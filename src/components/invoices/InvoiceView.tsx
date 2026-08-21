import React, { useState } from 'react';
import { Invoice, FirmProfile } from '../../types';
import { formatINR, numberToWordsINR } from '../../utils/taxCalculations';
import { exportElementToPDF } from '../../utils/pdfExport';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  Building2, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';

interface InvoiceViewProps {
  invoice: Invoice;
  firmProfile: FirmProfile;
  onClose: () => void;
  onPrint: () => void;
  onRecordPayment?: (invoice: Invoice) => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoice,
  firmProfile,
  onClose,
  onPrint,
  onRecordPayment
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState('');

  const isTaxInvoice = invoice.type === 'TAX_INVOICE';
  const isBillOfSupply = invoice.type === 'BILL_OF_SUPPLY';
  const isProforma = invoice.type === 'PROFORMA_INVOICE';

  const docTitle = isTaxInvoice
    ? 'TAX INVOICE'
    : isBillOfSupply
    ? 'BILL OF SUPPLY'
    : 'PROFORMA INVOICE';

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    setPdfProgress('Preparing PDF...');
    await exportElementToPDF({
      elementId: 'printable-invoice-document',
      fileName: `Invoice_${invoice.invoiceNumber.replace(/[\/\\]/g, '_')}_${invoice.client.name.replace(/\s+/g, '_')}.pdf`,
      onProgress: (st) => setPdfProgress(st)
    });
    setIsExportingPDF(false);
    setPdfProgress('');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello ${invoice.client.name},\n\nPlease find attached the ${docTitle} ${invoice.invoiceNumber} for "${invoice.projectTitle}".\nInvoice Amount: ${formatINR(invoice.totalAmount)}\nBalance Due: ${formatINR(invoice.balanceDue)}\nDue Date: ${invoice.dueDate}\n\nBank Account: ${firmProfile.bankName} | A/C: ${firmProfile.accountNumber} | IFSC: ${firmProfile.ifscCode}\nUPI ID: ${firmProfile.upiId || 'N/A'}\n\nBest regards,\n${firmProfile.architectName}\n${firmProfile.firmName}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // UPI payment QR link
  const upiPayLink = firmProfile.upiId
    ? `upi://pay?pa=${encodeURIComponent(firmProfile.upiId)}&pn=${encodeURIComponent(firmProfile.accountHolderName)}&am=${encodeURIComponent(invoice.balanceDue.toString())}&cu=INR&tn=${encodeURIComponent(invoice.invoiceNumber)}`
    : '';

  const upiQrImageUrl = upiPayLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiPayLink)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 print:shadow-none print:border-none print:max-w-none print:max-h-none print:rounded-none">
        
        {/* Floating Action Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl print:hidden gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-blue-400 bg-slate-800 px-2 py-0.5 rounded">
              {invoice.invoiceNumber}
            </span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-[160px] sm:max-w-xs">
              {docTitle} • {invoice.projectTitle}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {invoice.balanceDue > 0 && onRecordPayment && (
              <button
                onClick={() => onRecordPayment(invoice)}
                className="inline-flex items-center px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5 mr-1" />
                <span>+ Payment</span>
              </button>
            )}

            <button
              onClick={handleWhatsAppShare}
              title="Share via WhatsApp"
              className="inline-flex items-center px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              id="download-invoice-pdf-btn"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>{isExportingPDF ? (pdfProgress || 'Exporting...') : 'Download PDF'}</span>
            </button>

            <button
              onClick={onPrint}
              id="print-invoice-btn"
              className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div id="printable-invoice-document" className="p-6 sm:p-10 overflow-y-auto space-y-6 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible">
          
          {/* Header & Architect Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {firmProfile.firmName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                  Architects • Urban Planners • Interior Designers
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {firmProfile.architectName} • {firmProfile.qualification}
                </p>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-1">
                <div className="inline-flex items-center px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-amber-900 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  CoA: {firmProfile.coaRegistrationNo}
                </div>
                <p>{firmProfile.address}</p>
                <p>{firmProfile.city}, {firmProfile.state} - {firmProfile.pincode}</p>
                <p className="font-mono">PAN: <strong>{firmProfile.pan}</strong></p>
                {firmProfile.gstin && (
                  <p className="font-mono text-slate-900 font-bold">
                    GSTIN: {firmProfile.gstin}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Document Banner */}
          <div className="text-center py-2 border-y border-slate-200 bg-slate-50">
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-slate-900">
              {docTitle}
            </h2>
            {invoice.taxScheme === 'COMPOSITION_GST' && (
              <p className="text-[10px] sm:text-[11px] font-bold text-purple-900 uppercase tracking-wide mt-0.5">
                Composition taxable person under Section 10(2A), not eligible to collect tax on supplies
              </p>
            )}
            {invoice.taxScheme === 'NO_GST' && (
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-600 uppercase tracking-wide mt-0.5">
                Exempt / Supply not subject to GST
              </p>
            )}
          </div>

          {/* Invoice Particulars & Client Information */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                Billed To / Client:
              </span>
              <p className="text-sm font-bold text-slate-900">{invoice.client.name}</p>
              {invoice.client.organization && (
                <p className="font-semibold text-slate-700">{invoice.client.organization}</p>
              )}
              {invoice.client.address && <p className="text-slate-600">{invoice.client.address}</p>}
              <p className="text-slate-600">
                {invoice.client.city}, {invoice.client.state} {invoice.client.pincode}
              </p>
              {invoice.client.phone && <p className="text-slate-600">Tel: {invoice.client.phone}</p>}
              {invoice.client.pan && <p className="font-mono text-slate-600">PAN: {invoice.client.pan}</p>}
              {invoice.client.gstin && (
                <p className="font-mono text-slate-900 font-bold">
                  Client GSTIN: {invoice.client.gstin}
                </p>
              )}
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block text-left">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  Invoice Details:
                </span>
                <p className="font-mono font-bold text-slate-900 text-sm">{invoice.invoiceNumber}</p>
                <p className="text-slate-600">
                  Invoice Date: <strong>{new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </p>
                <p className="text-slate-600">
                  Payment Due Date: <strong>{new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </p>
                <p className="text-slate-600">
                  Place of Supply: <strong>{invoice.placeOfSupply}</strong>
                </p>
                <p className="text-slate-600">
                  Supply Type: <strong>{invoice.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST+SGST)'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Project Details Banner */}
          <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block">
                Project Name
              </span>
              <p className="font-bold text-white text-sm">{invoice.projectTitle}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              invoice.status === 'PAID'
                ? 'bg-emerald-500 text-white'
                : invoice.status === 'PARTIALLY_PAID'
                ? 'bg-blue-500 text-white'
                : 'bg-amber-400 text-slate-950'
            }`}>
              {invoice.status}
            </span>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3">Description of Architectural Services</th>
                  <th className="py-2.5 px-3 w-20 text-center">SAC Code</th>
                  <th className="py-2.5 px-3 w-16 text-center">Qty</th>
                  <th className="py-2.5 px-3 w-24 text-right">Rate</th>
                  <th className="py-2.5 px-3 w-28 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {invoice.lineItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900">{item.description}</p>
                      {item.stageName && (
                        <p className="text-[10px] text-slate-500 font-medium">Stage: {item.stageName}</p>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-700">
                      {item.sacCode || '998321'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {formatINR(item.rate, false)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatINR(item.amount, false)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Computation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            {/* Amount In Words & Statutory Declarations */}
            <div className="space-y-3 max-w-sm text-xs">
              <div>
                <span className="font-bold text-slate-500 text-[10px] uppercase block">
                  Total In Words:
                </span>
                <p className="font-bold text-slate-900 italic text-[11px]">
                  {numberToWordsINR(invoice.totalAmount)}
                </p>
              </div>

              {invoice.taxScheme === 'REGULAR_GST' && (
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Tax invoice issued under Section 31 of CGST Act. Recipient is eligible for Input Tax Credit subject to section 16/17(5).
                </p>
              )}
            </div>

            {/* Computation Summary */}
            <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-700">
                <span>Taxable Subtotal:</span>
                <span className="font-bold">{formatINR(invoice.subtotal)}</span>
              </div>

              {invoice.taxScheme === 'REGULAR_GST' && (
                <>
                  {invoice.isInterState ? (
                    <div className="flex justify-between text-blue-900">
                      <span>IGST (18%):</span>
                      <span className="font-bold">{formatINR(invoice.igstAmount || 0)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-blue-900">
                        <span>CGST (9%):</span>
                        <span className="font-bold">{formatINR(invoice.cgstAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between text-blue-900">
                        <span>SGST (9%):</span>
                        <span className="font-bold">{formatINR(invoice.sgstAmount || 0)}</span>
                      </div>
                    </>
                  )}
                </>
              )}

              {invoice.taxScheme === 'COMPOSITION_GST' && (
                <div className="flex justify-between text-purple-900 font-sans text-[11px] font-semibold">
                  <span>Composition Scheme:</span>
                  <span>Bill of Supply</span>
                </div>
              )}

              <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t-2 border-slate-900">
                <span>Total Invoice Amount:</span>
                <span>{formatINR(invoice.totalAmount)}</span>
              </div>

              {(invoice.paidAmount > 0 || invoice.tdsDeducted > 0) && (
                <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-600">
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Paid Received:</span>
                    <span>- {formatINR(invoice.paidAmount)}</span>
                  </div>
                  {invoice.tdsDeducted > 0 && (
                    <div className="flex justify-between text-blue-700 font-bold">
                      <span>TDS Deducted (194J):</span>
                      <span>- {formatINR(invoice.tdsDeducted)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-700 font-black text-xs pt-1 border-t border-slate-200">
                    <span>Balance Due:</span>
                    <span>{formatINR(invoice.balanceDue)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bank Remittance Details & UPI Payment QR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
            <div className="sm:col-span-2 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-700 block">
                Bank Remittance Details (NEFT / RTGS / IMPS):
              </span>
              <p>Bank: <strong>{firmProfile.bankName}</strong></p>
              <p>Account Name: <strong>{firmProfile.accountHolderName}</strong></p>
              <p className="font-mono">Account No: <strong>{firmProfile.accountNumber}</strong></p>
              <p className="font-mono">IFSC Code: <strong>{firmProfile.ifscCode}</strong></p>
              {firmProfile.branch && <p>Branch: {firmProfile.branch}</p>}
              {firmProfile.upiId && (
                <p className="font-mono text-blue-800 font-bold pt-1">
                  UPI ID (VPA): {firmProfile.upiId}
                </p>
              )}
            </div>

            {upiQrImageUrl && invoice.balanceDue > 0 && (
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-200 text-center">
                <img
                  src={upiQrImageUrl}
                  alt="Scan UPI to Pay"
                  className="w-24 h-24 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] font-bold text-slate-700 mt-1">Scan UPI to Pay</span>
                <span className="text-[9px] font-mono text-slate-500 font-bold">{formatINR(invoice.balanceDue)}</span>
              </div>
            )}
          </div>

          {/* Terms & Notes */}
          {invoice.termsAndConditions && (
            <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-3 space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-600 block">
                Payment Terms & Conditions:
              </span>
              <p className="leading-relaxed">{invoice.termsAndConditions}</p>
            </div>
          )}

          {/* Sign-off */}
          <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-end text-xs">
            <div className="text-slate-500 text-[10px]">
              Computer Generated Tax Invoice • E. & O.E.
            </div>

            <div className="text-right space-y-10">
              <p className="font-bold text-slate-900">For {firmProfile.firmName}</p>
              <div>
                <p className="font-bold text-slate-900">{firmProfile.architectName}</p>
                <p className="text-[10px] text-slate-500">Authorized Signatory</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
