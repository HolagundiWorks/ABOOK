import React, { useState } from 'react';
import { PaymentRecord, FirmProfile } from '../../types';
import { formatINR, numberToWordsINR } from '../../utils/taxCalculations';
import { exportElementToPDF } from '../../utils/pdfExport';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  FileCheck2,
  Calendar,
  CreditCard,
  Download,
  Share2
} from 'lucide-react';

interface ReceiptViewProps {
  payment: PaymentRecord;
  firmProfile: FirmProfile;
  onClose: () => void;
  onPrint: () => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  payment,
  firmProfile,
  onClose,
  onPrint
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState('');

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    setPdfProgress('Preparing PDF...');
    await exportElementToPDF({
      elementId: 'printable-receipt-document',
      fileName: `Receipt_${payment.receiptNumber.replace(/[\/\\]/g, '_')}_${payment.clientName.replace(/\s+/g, '_')}.pdf`,
      onProgress: (st) => setPdfProgress(st)
    });
    setIsExportingPDF(false);
    setPdfProgress('');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello ${payment.clientName},\n\nPayment Receipt Acknowledgment:\nReceipt No: ${payment.receiptNumber}\nInvoice: ${payment.invoiceNumber}\nProject: ${payment.projectTitle}\nNet Bank/Cash Received: ${formatINR(payment.netAmountReceived)}\nTDS (194J): ${formatINR(payment.tdsDeducted)}\nGross Amount Settled: ${formatINR(payment.grossAmountSettled)}\n\nThank you for your payment.\n${firmProfile.firmName}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 print:shadow-none print:border-none print:max-w-none print:max-h-none print:rounded-none">
        
        {/* Floating Action Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-emerald-950 text-white rounded-t-2xl print:hidden gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-emerald-400 bg-emerald-900 px-2 py-0.5 rounded">
              {payment.receiptNumber}
            </span>
            <span className="text-xs text-slate-200 font-medium truncate max-w-[160px] sm:max-w-xs">
              Receipt Voucher • {payment.clientName}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={handleWhatsAppShare}
              title="Share Receipt on WhatsApp"
              className="inline-flex items-center px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              id="download-receipt-pdf-btn"
              className="inline-flex items-center px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>{isExportingPDF ? (pdfProgress || 'Exporting...') : 'Download PDF'}</span>
            </button>

            <button
              onClick={onPrint}
              id="print-receipt-btn"
              className="inline-flex items-center px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors border border-emerald-800"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt-document" className="p-6 sm:p-10 overflow-y-auto space-y-6 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                {firmProfile.firmName}
              </h1>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {firmProfile.architectName} • {firmProfile.qualification}
              </p>
              <div className="inline-flex items-center px-2 py-0.5 mt-2 bg-amber-50 border border-amber-300 rounded text-amber-900 font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-700" />
                CoA Reg: {firmProfile.coaRegistrationNo}
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-1">
              <p>{firmProfile.address}</p>
              <p>{firmProfile.city}, {firmProfile.state} - {firmProfile.pincode}</p>
              <p className="font-mono">PAN: {firmProfile.pan}</p>
              {firmProfile.gstin && <p className="font-mono">GSTIN: {firmProfile.gstin}</p>}
            </div>
          </div>

          {/* Banner */}
          <div className="text-center py-2 border-y border-slate-200 bg-emerald-50/60">
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-emerald-950">
              Official Payment Receipt Voucher
            </h2>
            <p className="text-[10px] sm:text-[11px] text-emerald-800 uppercase tracking-wider mt-0.5 font-medium">
              Architectural Professional Fee Settlement
            </p>
          </div>

          {/* Particulars */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Receipt No:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{payment.receiptNumber}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Payment:</span>
              <span className="font-semibold text-slate-900">
                {new Date(payment.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Formal Statement Box */}
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50 space-y-3.5 text-xs leading-relaxed text-slate-800">
            <div className="flex items-start space-x-2">
              <span className="font-bold text-slate-500 min-w-28">Received from:</span>
              <span className="font-bold text-slate-950 text-sm">{payment.clientName}</span>
            </div>

            <div className="flex items-start space-x-2 border-t border-slate-200/60 pt-3">
              <span className="font-bold text-slate-500 min-w-28">Project Title:</span>
              <span className="font-bold text-slate-900">{payment.projectTitle}</span>
            </div>

            <div className="flex items-start space-x-2 border-t border-slate-200/60 pt-3">
              <span className="font-bold text-slate-500 min-w-28">Against Invoice:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {payment.invoiceNumber}
              </span>
            </div>

            <div className="flex items-start space-x-2 border-t border-slate-200/60 pt-3">
              <span className="font-bold text-slate-500 min-w-28">Payment Mode:</span>
              <span className="font-semibold text-slate-900">
                {payment.paymentMethod.replace('_', ' ')} • Ref / UTR: <strong className="font-mono">{payment.transactionReference}</strong>
              </span>
            </div>

            {payment.notes && (
              <div className="flex items-start space-x-2 border-t border-slate-200/60 pt-3">
                <span className="font-bold text-slate-500 min-w-28">Remarks / Notes:</span>
                <span className="text-slate-700 italic">{payment.notes}</span>
              </div>
            )}
          </div>

          {/* Settlement Computation Breakdown */}
          <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/40 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-700">
              <span className="font-sans font-medium">Net Remitted / Bank Credit:</span>
              <span className="font-bold text-emerald-900 text-sm">{formatINR(payment.netAmountReceived)}</span>
            </div>

            {payment.tdsDeducted > 0 && (
              <div className="flex justify-between text-blue-900 pt-1 border-t border-emerald-200">
                <span className="font-sans font-medium">TDS Deducted (Section 194J - 10% / 2%):</span>
                <span className="font-bold">{formatINR(payment.tdsDeducted)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t-2 border-emerald-900">
              <span className="font-sans font-bold">Total Gross Amount Settled:</span>
              <span>{formatINR(payment.grossAmountSettled)}</span>
            </div>
          </div>

          <p className="text-[11px] font-bold text-slate-800 italic">
            Total Settled in words: {numberToWordsINR(payment.grossAmountSettled)}
          </p>

          {/* Signatures */}
          <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-end text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Official Payment Settlement Acknowledged</span>
            </div>

            <div className="text-right space-y-8">
              <p className="font-bold text-slate-900">For {firmProfile.firmName}</p>
              <div>
                <p className="font-bold text-slate-900">{firmProfile.architectName}</p>
                <p className="text-[10px] text-slate-500">Authorized Signatory / Architect</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
