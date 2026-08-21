import React, { useState } from 'react';
import { Invoice, FirmProfile } from '../../types';
import { formatCurrency, formatDate } from '../../utils/taxCalculations';
import { exportElementToPDF } from '../../utils/pdfExport';
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Receipt
} from 'lucide-react';

interface GstLedgerViewProps {
  invoices: Invoice[];
  firmProfile: FirmProfile;
}

export const GstLedgerView: React.FC<GstLedgerViewProps> = ({
  invoices,
  firmProfile
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [taxSchemeFilter, setTaxSchemeFilter] = useState<'ALL' | 'REGULAR_GST' | 'COMPOSITION_GST' | 'NO_GST'>('ALL');
  const [b2bFilter, setB2bFilter] = useState<'ALL' | 'B2B' | 'B2C'>('ALL');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfStatus, setPdfStatus] = useState('');

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.client.gstin && inv.client.gstin.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesScheme = taxSchemeFilter === 'ALL' || inv.taxScheme === taxSchemeFilter;

    const isB2B = Boolean(inv.client.gstin && inv.client.gstin.trim().length > 0);
    const matchesB2b =
      b2bFilter === 'ALL' ||
      (b2bFilter === 'B2B' && isB2B) ||
      (b2bFilter === 'B2C' && !isB2B);

    return matchesSearch && matchesScheme && matchesB2b;
  });

  // Calculate totals
  let totalTaxableValue = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let totalOutputTax = 0;
  let totalGrossInvoiced = 0;
  let totalCompositionTurnover = 0;
  let totalCompositionTaxEstimate = 0;
  let totalTdsDeducted = 0;

  filteredInvoices.forEach((inv) => {
    totalGrossInvoiced += inv.totalAmount;
    totalTaxableValue += inv.subtotal;
    totalTdsDeducted += inv.tdsDeducted;

    if (inv.taxScheme === 'REGULAR_GST') {
      const cgst = inv.cgstAmount || 0;
      const sgst = inv.sgstAmount || 0;
      const igst = inv.igstAmount || 0;
      totalCgst += cgst;
      totalSgst += sgst;
      totalIgst += igst;
      totalOutputTax += (cgst + sgst + igst);
    } else if (inv.taxScheme === 'COMPOSITION_GST') {
      totalCompositionTurnover += inv.subtotal;
      totalCompositionTaxEstimate += (inv.subtotal * 0.06); // 6% under 10(2A)
    }
  });

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = [
      'Invoice #',
      'Invoice Date',
      'Client Name',
      'Client GSTIN',
      'Place of Supply',
      'Supply Type',
      'Tax Scheme',
      'Taxable Value (Subtotal INR)',
      'CGST (9% INR)',
      'SGST (9% INR)',
      'IGST (18% INR)',
      'Total GST (INR)',
      'Total Invoice (INR)',
      'TDS Deducted (INR)',
      'Payment Status'
    ];

    const rows = filteredInvoices.map((inv) => {
      const isB2B = inv.client.gstin && inv.client.gstin.trim() ? 'B2B' : 'B2C';
      const supplyType = inv.isInterState ? 'Inter-State' : 'Intra-State';
      const cgst = inv.cgstAmount || 0;
      const sgst = inv.sgstAmount || 0;
      const igst = inv.igstAmount || 0;
      const totalTax = cgst + sgst + igst;

      return [
        inv.invoiceNumber,
        inv.date,
        `"${inv.client.name.replace(/"/g, '""')}"`,
        `"${inv.client.gstin || ''}"`,
        `"${inv.placeOfSupply || ''}"`,
        supplyType,
        inv.taxScheme,
        inv.subtotal,
        cgst,
        sgst,
        igst,
        totalTax,
        inv.totalAmount,
        inv.tdsDeducted,
        inv.status
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GST_Output_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export
  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    setPdfStatus('Exporting GST Ledger PDF...');
    await exportElementToPDF({
      elementId: 'printable-gst-ledger',
      fileName: `GST_Ledger_${firmProfile.firmName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      onProgress: (st) => setPdfStatus(st)
    });
    setIsExportingPDF(false);
    setPdfStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#161616] text-white p-5 border border-[#393939] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#ff832b]"></div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white leading-tight">
                GST Output Tax Ledger & Returns
              </h2>
              <p className="text-xs text-[#8d8d8d]">
                GSTR-1, GSTR-3B and Section 10(2A) CMP-08 reconciliation
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-black text-[#ff832b] border border-[#393939] self-start sm:self-auto">
            GSTIN: {firmProfile.gstin || 'Registered'}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-3 pt-3 border-t border-[#393939]">
          <button
            id="gst-export-pdf-btn"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
          >
            <FileText className="w-4 h-4 mr-1 text-black" />
            <span>{isExportingPDF ? (pdfStatus || 'Generating...') : 'Export Ledger PDF'}</span>
          </button>

          <button
            id="gst-export-csv-btn"
            onClick={handleExportCSV}
            className="carbon-btn-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
          >
            <Download className="w-4 h-4 mr-1" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tax Liability Quick KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#161616]">
          <span className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">
            Taxable Turnover
          </span>
          <p className="text-xl font-black text-[#161616] mt-1 font-mono">
            {formatCurrency(totalTaxableValue)}
          </p>
          <span className="text-[10px] text-[#8d8d8d] font-mono block mt-1">
            {filteredInvoices.length} active tax invoices
          </span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#ff832b]">
          <span className="text-[11px] font-bold text-[#b84300] uppercase tracking-wider block">
            Output GST (18%)
          </span>
          <p className="text-xl font-black text-[#ff832b] mt-1 font-mono">
            {formatCurrency(totalOutputTax)}
          </p>
          <span className="text-[10px] text-[#525252] font-mono block mt-1">
            CGST + SGST + IGST Output
          </span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#525252]">
          <span className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">
            Composition (6%)
          </span>
          <p className="text-xl font-black text-[#161616] mt-1 font-mono">
            {formatCurrency(totalCompositionTaxEstimate)}
          </p>
          <span className="text-[10px] text-[#8d8d8d] font-mono block mt-1">
            CMP-08 Est. @ 6%
          </span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#24a148]">
          <span className="text-[11px] font-bold text-[#0f6225] uppercase tracking-wider block">
            TDS (194J) Credits
          </span>
          <p className="text-xl font-black text-[#0f6225] mt-1 font-mono">
            {formatCurrency(totalTdsDeducted)}
          </p>
          <span className="text-[10px] text-[#0f6225] font-mono block mt-1">
            Form 26AS Tax Offset
          </span>
        </div>
      </div>

      {/* Tax Component Details Card */}
      <div className="bg-white p-4 border border-[#e0e0e0] space-y-3">
        <h3 className="text-xs font-bold text-[#161616] uppercase tracking-wider flex items-center justify-between">
          <span>Regular GST Component Breakdown</span>
          <span className="text-[10px] font-mono text-[#ff832b] font-bold">GSTR-1 Ready</span>
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#f4f4f4] p-3 border border-[#e0e0e0]">
            <span className="text-[10px] font-bold uppercase text-[#525252] block">CGST (9%)</span>
            <span className="text-sm font-black font-mono text-[#161616] mt-1 block">
              {formatCurrency(totalCgst)}
            </span>
          </div>

          <div className="bg-[#f4f4f4] p-3 border border-[#e0e0e0]">
            <span className="text-[10px] font-bold uppercase text-[#525252] block">SGST (9%)</span>
            <span className="text-sm font-black font-mono text-[#161616] mt-1 block">
              {formatCurrency(totalSgst)}
            </span>
          </div>

          <div className="bg-[#f4f4f4] p-3 border border-[#e0e0e0]">
            <span className="text-[10px] font-bold uppercase text-[#525252] block">IGST (18%)</span>
            <span className="text-sm font-black font-mono text-[#161616] mt-1 block">
              {formatCurrency(totalIgst)}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Scheme Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8d8d8d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice #, client, GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-[#8d8d8d] outline-none focus:border-[#ff832b]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setTaxSchemeFilter('ALL')}
            className={`px-3 py-1.5 border transition-colors ${
              taxSchemeFilter === 'ALL'
                ? 'bg-[#161616] text-white border-[#161616]'
                : 'bg-white text-[#525252] border-[#8d8d8d] hover:text-black'
            }`}
          >
            All Schemes
          </button>
          <button
            onClick={() => setTaxSchemeFilter('REGULAR_GST')}
            className={`px-3 py-1.5 border transition-colors ${
              taxSchemeFilter === 'REGULAR_GST'
                ? 'bg-[#ff832b] text-black border-[#ff832b]'
                : 'bg-white text-[#525252] border-[#8d8d8d] hover:text-black'
            }`}
          >
            Regular GST (18%)
          </button>
          <button
            onClick={() => setTaxSchemeFilter('COMPOSITION_GST')}
            className={`px-3 py-1.5 border transition-colors ${
              taxSchemeFilter === 'COMPOSITION_GST'
                ? 'bg-[#161616] text-[#ff832b] border-[#161616]'
                : 'bg-white text-[#525252] border-[#8d8d8d] hover:text-black'
            }`}
          >
            Composition (6%)
          </button>
          <button
            onClick={() => setTaxSchemeFilter('NO_GST')}
            className={`px-3 py-1.5 border transition-colors ${
              taxSchemeFilter === 'NO_GST'
                ? 'bg-[#161616] text-white border-[#161616]'
                : 'bg-white text-[#525252] border-[#8d8d8d] hover:text-black'
            }`}
          >
            Exempt / Non-GST
          </button>
        </div>

        {/* B2B vs B2C selector */}
        <div className="flex border border-[#8d8d8d] bg-white text-xs font-bold uppercase">
          <button
            onClick={() => setB2bFilter('ALL')}
            className={`flex-1 py-1.5 text-center transition-all ${
              b2bFilter === 'ALL' ? 'bg-[#161616] text-white' : 'text-[#525252] hover:text-black'
            }`}
          >
            All Supplies
          </button>
          <button
            onClick={() => setB2bFilter('B2B')}
            className={`flex-1 py-1.5 text-center transition-all border-x border-[#8d8d8d] ${
              b2bFilter === 'B2B' ? 'bg-[#ff832b] text-black' : 'text-[#525252] hover:text-black'
            }`}
          >
            B2B (With GSTIN)
          </button>
          <button
            onClick={() => setB2bFilter('B2C')}
            className={`flex-1 py-1.5 text-center transition-all ${
              b2bFilter === 'B2C' ? 'bg-[#161616] text-white' : 'text-[#525252] hover:text-black'
            }`}
          >
            B2C (Consumers)
          </button>
        </div>
      </div>

      {/* Invoice Register List */}
      <div id="printable-gst-ledger" className="space-y-3 bg-white p-4 border border-[#e0e0e0]">
        <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#161616]">
            GST Invoicing Register ({filteredInvoices.length})
          </h4>
          <span className="text-xs text-[#525252] font-mono">
            {firmProfile.firmName}
          </span>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-10 text-[#8d8d8d] text-xs">
            No invoices match the selected tax criteria.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredInvoices.map((inv) => {
              const isB2B = Boolean(inv.client.gstin && inv.client.gstin.trim());
              const taxTotal = (inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0);

              return (
                <div
                  key={inv.id}
                  className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#161616]">
                          {inv.invoiceNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 uppercase border ${
                          isB2B ? 'bg-[#161616] text-[#ff832b] border-[#161616]' : 'bg-white text-[#525252] border-[#8d8d8d]'
                        }`}>
                          {isB2B ? 'B2B' : 'B2C'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#161616] mt-1">{inv.client.name}</p>
                      {inv.client.gstin && (
                        <p className="text-[10px] font-mono text-[#525252]">GSTIN: {inv.client.gstin}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-black text-[#161616] block">
                        {formatCurrency(inv.totalAmount)}
                      </span>
                      <span className="text-[10px] text-[#8d8d8d] font-mono block">
                        {inv.date}
                      </span>
                    </div>
                  </div>

                  {/* Tax values row */}
                  <div className="pt-2 border-t border-[#e0e0e0] flex items-center justify-between text-xs text-[#525252] font-mono">
                    <div>
                      <span className="text-[#8d8d8d] mr-1">Taxable:</span>
                      <strong className="text-[#161616]">{formatCurrency(inv.subtotal)}</strong>
                    </div>

                    {inv.taxScheme === 'REGULAR_GST' && (
                      <div>
                        {inv.isInterState ? (
                          <span>
                            <span className="text-[#8d8d8d] mr-1">IGST 18%:</span>
                            <strong className="text-[#b84300]">{formatCurrency(inv.igstAmount || 0)}</strong>
                          </span>
                        ) : (
                          <span>
                            <span className="text-[#8d8d8d] mr-1">CGST+SGST:</span>
                            <strong className="text-[#b84300]">{formatCurrency(taxTotal)}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {inv.taxScheme === 'COMPOSITION_GST' && (
                      <span className="text-[#ff832b] font-bold">
                        Comp. 6% (Bill of Supply)
                      </span>
                    )}

                    {inv.taxScheme === 'NO_GST' && (
                      <span className="text-[#0f6225] font-bold">
                        Non-GST / Exempt
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
