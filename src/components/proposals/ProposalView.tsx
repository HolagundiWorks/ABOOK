import React, { useState } from 'react';
import { ProjectProposal, FirmProfile } from '../../types';
import { formatINR, numberToWordsINR } from '../../utils/taxCalculations';
import { exportElementToPDF } from '../../utils/pdfExport';
import { 
  Printer, 
  X, 
  Building2, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone,
  Globe,
  FileCheck,
  Download,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface ProposalViewProps {
  proposal: ProjectProposal;
  firmProfile: FirmProfile;
  onClose: () => void;
  onPrint: () => void;
}

export const ProposalView: React.FC<ProposalViewProps> = ({
  proposal,
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
      elementId: 'printable-proposal-document',
      fileName: `Proposal_${proposal.proposalNumber.replace(/[\/\\]/g, '_')}_${proposal.client.name.replace(/\s+/g, '_')}.pdf`,
      onProgress: (status) => setPdfProgress(status)
    });
    setIsExportingPDF(false);
    setPdfProgress('');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello ${proposal.client.name},\n\nPlease find attached the Architectural Fee Proposal ${proposal.proposalNumber} for "${proposal.projectTitle}".\nTotal Estimated Fee: ${formatINR(proposal.totalEstimatedFee)}\n\nBest regards,\n${firmProfile.architectName}\n${firmProfile.firmName}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 print:shadow-none print:border-none print:max-w-none print:max-h-none print:rounded-none">
        
        {/* Floating Action Bar (Hidden during Print) */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#393939] flex items-center justify-between bg-[#161616] text-white print:hidden gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-[#78a9ff] bg-[#262626] px-2 py-0.5 border border-[#525252]">
              {proposal.proposalNumber}
            </span>
            <span className="text-xs text-[#c6c6c6] font-medium truncate max-w-[160px] sm:max-w-xs">
              {proposal.projectTitle}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={handleWhatsAppShare}
              title="Share via WhatsApp"
              className="inline-flex items-center px-2.5 py-1.5 bg-[#24a148] hover:bg-[#198038] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              id="download-proposal-pdf-btn"
              className="inline-flex items-center px-3 py-1.5 bg-[#0f62fe] hover:bg-[#0043ce] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>{isExportingPDF ? (pdfProgress || 'Exporting...') : 'Download PDF'}</span>
            </button>

            <button
              onClick={onPrint}
              id="print-proposal-btn"
              className="inline-flex items-center px-3 py-1.5 bg-[#393939] hover:bg-[#4c4c4c] text-white font-bold text-xs uppercase tracking-wider transition-colors border border-[#525252]"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#8d8d8d] hover:text-white hover:bg-[#262626] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-proposal-document" className="p-6 sm:p-10 overflow-y-auto space-y-7 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible">
          
          {/* Header & Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {firmProfile.firmName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                  Architecture • Planning • Interior Design
                </p>
                <div className="flex items-center space-x-2 mt-1.5 flex-wrap text-xs text-slate-600">
                  <span className="font-medium">{firmProfile.architectName}</span>
                  <span>•</span>
                  <span>{firmProfile.qualification}</span>
                  {firmProfile.iiaNumber && (
                    <>
                      <span>•</span>
                      <span>IIA: {firmProfile.iiaNumber}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-1">
                <div className="inline-flex items-center px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-amber-900 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  CoA Reg: {firmProfile.coaRegistrationNo}
                </div>
                <p>{firmProfile.address}</p>
                <p>{firmProfile.city}, {firmProfile.state} - {firmProfile.pincode}</p>
                <p className="font-mono">Email: {firmProfile.email} | Tel: {firmProfile.phone}</p>
                {firmProfile.gstin && <p className="font-mono">GSTIN: {firmProfile.gstin}</p>}
              </div>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="text-center py-2 border-y border-slate-200 bg-slate-50">
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-slate-800">
              Architectural Services & Fee Proposal
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">
              Based on Council of Architecture (CoA) Scope of Work & Professional Practice Norms
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                To / Client Details:
              </span>
              <p className="text-sm font-bold text-slate-900">{proposal.client.name}</p>
              {proposal.client.organization && (
                <p className="font-semibold text-slate-700">{proposal.client.organization}</p>
              )}
              {proposal.client.address && <p className="text-slate-600">{proposal.client.address}</p>}
              <p className="text-slate-600">
                {proposal.client.city}, {proposal.client.state} {proposal.client.pincode}
              </p>
              {proposal.client.phone && <p className="text-slate-600">Tel: {proposal.client.phone}</p>}
              {proposal.client.email && <p className="text-slate-600">Email: {proposal.client.email}</p>}
              {proposal.client.gstin && (
                <p className="font-mono text-slate-700 font-bold">Client GSTIN: {proposal.client.gstin}</p>
              )}
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block text-left">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  Proposal Details:
                </span>
                <p className="font-mono font-bold text-slate-900">{proposal.proposalNumber}</p>
                <p className="text-slate-600">
                  Date: <strong>{new Date(proposal.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </p>
                <p className="text-slate-600">
                  Validity: <strong>{new Date(proposal.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </p>
                <p className="text-slate-600">
                  Project Type: <strong>{proposal.projectType}</strong>
                </p>
                {proposal.siteLocation && (
                  <p className="text-slate-600">
                    Location: <strong>{proposal.siteLocation}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Project Title Block */}
          <div className="bg-[#161616] text-white p-4 border border-[#393939]">
            <span className="text-[10px] text-[#78a9ff] uppercase font-bold tracking-wider block">
              Project Title
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{proposal.projectTitle}</h3>
          </div>

          {/* Fee Basis & Computation Box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
              Fee Computation Model & Basis
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {proposal.feeModel === 'PERCENTAGE_COST' && (
                <>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Est. Cost of Work</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatINR(proposal.estimatedCostOfWork || 0, false)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Architectural Fee Rate</span>
                    <span className="font-mono font-bold text-slate-900">
                      {proposal.percentageRate}% of Cost
                    </span>
                  </div>
                </>
              )}

              {proposal.feeModel === 'PER_SQFT' && (
                <>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Built-Up Area</span>
                    <span className="font-mono font-bold text-slate-900">
                      {proposal.builtUpAreaSqFt?.toLocaleString('en-IN')} Sq.Ft.
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Rate per Sq.Ft.</span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹ {proposal.ratePerSqFt} / sq.ft.
                    </span>
                  </div>
                </>
              )}

              {proposal.feeModel === 'LUMP_SUM' && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Fee Basis</span>
                  <span className="font-bold text-slate-900">Agreed Fixed Lump Sum</span>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-500 block">Tax Regime</span>
                <span className="font-bold text-blue-900">
                  {proposal.taxScheme === 'REGULAR_GST'
                    ? 'Regular GST (18%)'
                    : proposal.taxScheme === 'COMPOSITION_GST'
                    ? 'Composition Scheme (6%)'
                    : 'Non-GST / Exempt'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Total Estimated Fee</span>
                <span className="font-mono font-black text-slate-950 text-sm">
                  {formatINR(proposal.totalEstimatedFee, false)}
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Schedule Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Stage-Wise Scope of Work & Milestone Disbursement Schedule
            </h4>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-16 text-center">Stage</th>
                  <th className="py-2.5 px-3">Scope Description & Deliverables</th>
                  <th className="py-2.5 px-3 w-20 text-center">% Fee</th>
                  <th className="py-2.5 px-3 w-32 text-right">Milestone Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {proposal.milestones.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700 bg-slate-50">
                      {m.stageNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900">{m.name}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {m.deliverables}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {m.percentage}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-950">
                      {formatINR(m.amount, false)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3 text-right text-slate-900">
                    Total Professional Consultancy Fee:
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">
                    {proposal.milestones.reduce((acc, m) => acc + (Number(m.percentage) || 0), 0)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-sm text-slate-950">
                    {formatINR(proposal.totalEstimatedFee, false)}
                  </td>
                </tr>
              </tfoot>
            </table>
            <p className="text-[11px] font-semibold text-slate-700 italic">
              Amount in words: {numberToWordsINR(proposal.totalEstimatedFee)}
            </p>
          </div>

          {/* Standard CoA Clauses */}
          <div className="space-y-2 text-xs border-t border-slate-200 pt-4">
            <h4 className="font-bold uppercase tracking-wider text-slate-700 text-[10px]">
              Terms of Engagement & Standard CoA Conditions:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              {proposal.scopeOfWorkClauses.map((clause, idx) => (
                <li key={idx}>{clause}</li>
              ))}
            </ol>
          </div>

          {/* Reimbursable Expenses */}
          {proposal.reimbursableExpensesNotes && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
                Reimbursable Expenses & Out-of-Pocket Costs:
              </span>
              <p className="text-[11px] leading-relaxed">{proposal.reimbursableExpensesNotes}</p>
            </div>
          )}

          {/* Acceptance Signature Block */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-900 text-xs">
            <div className="space-y-12">
              <div>
                <p className="font-bold text-slate-900">Submitted by:</p>
                <p className="text-slate-600">{firmProfile.firmName}</p>
              </div>
              <div className="border-t border-slate-400 pt-1 w-48">
                <p className="font-bold text-slate-900">{firmProfile.architectName}</p>
                <p className="text-[11px] text-slate-500">CoA Reg: {firmProfile.coaRegistrationNo}</p>
              </div>
            </div>

            <div className="space-y-12 text-right">
              <div>
                <p className="font-bold text-slate-900">Accepted & Approved by:</p>
                <p className="text-slate-600">{proposal.client.name}</p>
              </div>
              <div className="border-t border-slate-400 pt-1 w-48 ml-auto text-right">
                <p className="font-bold text-slate-900">Client Signature & Seal</p>
                <p className="text-[11px] text-slate-500">Date: _________________</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
