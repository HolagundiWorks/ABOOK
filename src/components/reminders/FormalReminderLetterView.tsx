import React, { useState } from 'react';
import { PaymentReminder, FirmProfile, Invoice } from '../../types';
import { formatINR, numberToWordsINR } from '../../utils/taxCalculations';
import { exportElementToPDF } from '../../utils/pdfExport';
import { 
  Printer, 
  X, 
  Building2, 
  Download, 
  Share2, 
  FileWarning, 
  AlertCircle,
  Landmark,
  QrCode
} from 'lucide-react';

interface FormalReminderLetterViewProps {
  reminder: PaymentReminder;
  firmProfile: FirmProfile;
  invoice?: Invoice;
  onClose: () => void;
  onPrint: () => void;
}

export const FormalReminderLetterView: React.FC<FormalReminderLetterViewProps> = ({
  reminder,
  firmProfile,
  invoice,
  onClose,
  onPrint
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState('');

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    setPdfProgress('Generating Notice PDF...');
    await exportElementToPDF({
      elementId: 'printable-formal-reminder-letter',
      fileName: `Demand_Notice_${reminder.invoiceNumber.replace(/[\/\\]/g, '_')}_${reminder.clientName.replace(/\s+/g, '_')}.pdf`,
      onProgress: (status) => setPdfProgress(status)
    });
    setIsExportingPDF(false);
    setPdfProgress('');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `FORMAL NOTICE FOR OUTSTANDING ARCHITECTURAL FEES\n` +
      `Invoice Ref: ${reminder.invoiceNumber}\n` +
      `Project: ${reminder.projectTitle}\n` +
      `Client: ${reminder.clientName}\n` +
      `Balance Overdue: ${formatINR(reminder.balanceDue)}\n` +
      `Due Date: ${new Date(reminder.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n` +
      `Please remit the outstanding payment via NEFT/RTGS to HDFC Bank A/C ${firmProfile.accountNumber} (IFSC: ${firmProfile.ifscCode}) or UPI ${firmProfile.upiId}.\n\n` +
      `Studio Vistara Architects`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-none max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#393939] print:shadow-none print:border-none print:max-w-none print:max-h-none">
        
        {/* Top Control Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#393939] flex items-center justify-between bg-[#161616] text-white print:hidden gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-[#ff8389] bg-[#393939] px-2 py-0.5 border border-[#525252]">
              FORMAL DEMAND NOTICE
            </span>
            <span className="text-xs text-[#c6c6c6] font-medium truncate max-w-[200px] sm:max-w-xs">
              {reminder.invoiceNumber} • {reminder.clientName}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center px-2.5 py-1.5 bg-[#24a148] hover:bg-[#198038] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              id="download-demand-pdf-btn"
              className="inline-flex items-center px-3 py-1.5 bg-[#0f62fe] hover:bg-[#0043ce] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>{isExportingPDF ? (pdfProgress || 'Exporting...') : 'Download PDF'}</span>
            </button>

            <button
              onClick={onPrint}
              id="print-demand-btn"
              className="inline-flex items-center px-3 py-1.5 bg-[#393939] hover:bg-[#4c4c4c] text-white font-bold text-xs uppercase tracking-wider transition-colors border border-[#525252]"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              id="close-demand-view-btn"
              className="p-1.5 text-[#8d8d8d] hover:text-white hover:bg-[#262626] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Notice Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f4f4f4] print:bg-white print:p-0 print:overflow-visible">
          <div 
            id="printable-formal-reminder-letter" 
            className="bg-white p-6 sm:p-10 border border-[#e0e0e0] print:border-none print:p-0 max-w-3xl mx-auto shadow-sm space-y-6 text-[#161616] font-sans"
          >
            
            {/* Letterhead */}
            <div className="border-b-2 border-[#161616] pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#0f62fe]" />
                  <span className="text-xl font-bold uppercase tracking-tight text-[#161616]">
                    {firmProfile.firmName}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#525252]">
                  {firmProfile.architectName} • {firmProfile.qualification}
                </p>
                <div className="flex items-center space-x-3 text-[11px] font-mono text-[#525252]">
                  <span className="font-bold text-[#0f62fe] bg-[#edf5ff] px-1.5 py-0.5 border border-[#a6c8ff]">
                    CoA Reg: {firmProfile.coaRegistrationNo}
                  </span>
                  {firmProfile.gstin && <span>GSTIN: {firmProfile.gstin}</span>}
                  <span>PAN: {firmProfile.pan}</span>
                </div>
                <p className="text-[11px] text-[#525252] pt-1">
                  {firmProfile.address}, {firmProfile.city}, {firmProfile.state} - {firmProfile.pincode}
                </p>
              </div>

              <div className="sm:text-right shrink-0 bg-[#f4f4f4] p-3 border border-[#e0e0e0] sm:min-w-48">
                <span className="text-[10px] font-mono font-bold uppercase text-[#da1e28] block">
                  FORMAL DEMAND NOTICE
                </span>
                <span className="text-sm font-mono font-bold text-[#161616] block">
                  REF/REM/{new Date().getFullYear()}/{reminder.invoiceNumber.split('/').pop() || '01'}
                </span>
                <div className="text-xs text-[#525252] font-mono mt-1">
                  Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Client Addressee */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8d8d8d] block">TO:</span>
              <p className="font-bold text-sm text-[#161616]">{reminder.clientName}</p>
              {reminder.clientEmail && <p className="text-[#525252]">Email: {reminder.clientEmail}</p>}
              {reminder.clientPhone && <p className="text-[#525252] font-mono">Phone: {reminder.clientPhone}</p>}
              <p className="text-[#525252] pt-1">Project: <strong>{reminder.projectTitle}</strong></p>
            </div>

            {/* Subject Banner */}
            <div className="p-3 bg-[#fff1f1] border-l-4 border-[#da1e28]">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#da1e28]">
                SUBJECT: {reminder.subject || `DEMAND FOR IMMEDIATE PAYMENT OF OUTSTANDING ARCHITECTURAL FEES - INVOICE ${reminder.invoiceNumber}`}
              </p>
            </div>

            {/* Body */}
            <div className="space-y-3 text-xs leading-relaxed text-[#161616]">
              <p>Dear {reminder.clientName},</p>
              
              <div className="whitespace-pre-line p-3 bg-[#fcfcfc] border border-[#e0e0e0] rounded-none">
                {reminder.messageBody}
              </div>

              {/* Outstanding Fee Itemization Table */}
              <div className="pt-2">
                <table className="w-full text-xs border border-[#161616]">
                  <thead className="bg-[#161616] text-white font-mono text-[11px] uppercase">
                    <tr>
                      <th className="p-2 text-left">Tax Invoice #</th>
                      <th className="p-2 text-left">Project / Milestone Description</th>
                      <th className="p-2 text-center">Due Date</th>
                      <th className="p-2 text-right">Invoice Total</th>
                      <th className="p-2 text-right">Balance Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#e0e0e0] font-mono">
                      <td className="p-2 font-bold text-[#0f62fe]">{reminder.invoiceNumber}</td>
                      <td className="p-2 text-[#161616] font-sans font-medium">{reminder.projectTitle}</td>
                      <td className="p-2 text-center text-[#da1e28] font-bold">
                        {new Date(reminder.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-2 text-right">{formatINR(reminder.totalAmount)}</td>
                      <td className="p-2 text-right font-bold text-[#da1e28] text-sm bg-[#fff1f1]">
                        {formatINR(reminder.balanceDue)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[11px] font-mono text-[#525252] text-right pt-1">
                  Amount in Words: {numberToWordsINR(reminder.balanceDue)}
                </p>
              </div>

              {/* Council of Architecture Statutory Interest Clause */}
              <div className="p-3.5 bg-[#f4f4f4] border border-[#e0e0e0] text-xs space-y-1.5">
                <p className="font-bold text-[#161616] uppercase text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#da1e28]" />
                  <span>Council of Architecture (CoA) Statutory Payment Guidelines:</span>
                </p>
                <p className="text-[#525252]">
                  {firmProfile.standardPaymentTerms || 'Invoices raised upon milestone completion are payable within 15 days. In accordance with the Council of Architecture Guidelines for Professional Practice, payments delayed beyond 30 days shall attract interest @ 18% per annum from the due date until realization.'}
                </p>
              </div>

              {/* Bank Transfer Details Box */}
              <div className="p-4 bg-[#edf5ff] border border-[#a6c8ff] space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-[#0043ce] flex items-center space-x-1.5">
                  <Landmark className="w-4 h-4 text-[#0f62fe]" />
                  <span>Official Bank Payment Remittance Details</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <p className="text-[#525252]">Account Name: <strong className="text-[#161616]">{firmProfile.accountHolderName || firmProfile.firmName}</strong></p>
                    <p className="text-[#525252]">Bank: <strong className="text-[#161616]">{firmProfile.bankName}</strong></p>
                    <p className="text-[#525252]">Branch: <strong className="text-[#161616]">{firmProfile.branch}</strong></p>
                  </div>
                  <div>
                    <p className="text-[#525252]">Account No: <strong className="font-mono text-sm text-[#0043ce]">{firmProfile.accountNumber}</strong></p>
                    <p className="text-[#525252]">IFSC Code: <strong className="font-mono font-bold text-[#161616]">{firmProfile.ifscCode}</strong></p>
                    {firmProfile.upiId && (
                      <p className="text-[#525252]">UPI VPA: <strong className="font-mono text-[#0043ce]">{firmProfile.upiId}</strong></p>
                    )}
                  </div>
                </div>
              </div>

              <p className="pt-2 text-xs">
                We kindly request you to remit the overdue balance at the earliest to maintain project momentum, timely issuance of subsequent structural GFC drawings, and scheduled site supervision visits.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-6 border-t-2 border-[#161616] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
              <div className="space-y-1 text-[#525252] text-[11px]">
                <p className="font-bold text-[#161616]">For any billing queries, contact:</p>
                <p>Email: {firmProfile.email} • Tel: {firmProfile.phone}</p>
                <p className="font-mono text-[10px] text-[#8d8d8d]">Automated Architectural Billing & Recovery Engine</p>
              </div>

              <div className="text-left sm:text-right shrink-0 min-w-56 space-y-1">
                <p className="text-xs text-[#525252]">Sincerely,</p>
                <div className="h-10 flex items-end justify-start sm:justify-end">
                  <span className="font-mono text-xs font-bold text-[#0f62fe]">
                    [Ar. {firmProfile.architectName}]
                  </span>
                </div>
                <p className="font-bold text-sm text-[#161616]">{firmProfile.architectName}</p>
                <p className="text-[#525252]">{firmProfile.qualification}</p>
                <p className="font-mono text-[11px] font-bold text-[#0043ce]">
                  CoA Reg. No: {firmProfile.coaRegistrationNo}
                </p>
                <p className="text-[11px] text-[#8d8d8d]">{firmProfile.firmName}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
