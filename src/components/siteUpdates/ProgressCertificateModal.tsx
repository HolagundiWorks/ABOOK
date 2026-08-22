import React, { useState } from 'react';
import { SiteInspectionLog, FirmProfile } from '../../types';
import { formatINR, numberToWordsINR } from '../../utils/taxCalculations';
import { exportElementToPDF } from '../../utils/pdfExport';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Share2, 
  FileCheck,
  Award,
  HardHat
} from 'lucide-react';

interface ProgressCertificateModalProps {
  siteUpdate: SiteInspectionLog;
  firmProfile: FirmProfile;
  onClose: () => void;
  onPrint: () => void;
}

export const ProgressCertificateModal: React.FC<ProgressCertificateModalProps> = ({
  siteUpdate,
  firmProfile,
  onClose,
  onPrint
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState('');

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    setPdfProgress('Generating PDF...');
    await exportElementToPDF({
      elementId: 'printable-progress-certificate',
      fileName: `Certificate_${siteUpdate.certificateNumber?.replace(/[\/\\]/g, '_') || 'Site_Progress'}_${siteUpdate.clientName.replace(/\s+/g, '_')}.pdf`,
      onProgress: (status) => setPdfProgress(status)
    });
    setIsExportingPDF(false);
    setPdfProgress('');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `ARCHITECT'S PROGRESS BILLING CERTIFICATE\n` +
      `Certificate No: ${siteUpdate.certificateNumber || 'CERT-PROG'}\n` +
      `Project: ${siteUpdate.projectTitle}\n` +
      `Client: ${siteUpdate.clientName}\n` +
      `Milestone: ${siteUpdate.milestoneStageName}\n` +
      `Physical Progress: ${siteUpdate.physicalProgressPercentage}%\n` +
      `Certified Stage Valuation: ${formatINR(siteUpdate.targetMilestoneAmount)}\n` +
      `Certified By: ${siteUpdate.certifiedByArchitect || firmProfile.architectName} (CoA: ${firmProfile.coaRegistrationNo})\n\n` +
      `This certifies that the specified site construction stage has been inspected and approved for milestone fee release.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-none max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#393939] print:shadow-none print:border-none print:max-w-none print:max-h-none">
        
        {/* Top Control Bar (Hidden during Print) */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#393939] flex items-center justify-between bg-[#161616] text-white print:hidden gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-[#78a9ff] bg-[#262626] px-2 py-0.5 border border-[#525252]">
              {siteUpdate.certificateNumber || 'PROGRESS CERTIFICATE'}
            </span>
            <span className="text-xs text-[#c6c6c6] font-medium truncate max-w-[200px] sm:max-w-xs">
              {siteUpdate.projectTitle}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={handleWhatsAppShare}
              title="Share Certificate on WhatsApp"
              className="inline-flex items-center px-2.5 py-1.5 bg-[#24a148] hover:bg-[#198038] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              id="download-cert-pdf-btn"
              className="inline-flex items-center px-3 py-1.5 bg-[#0f62fe] hover:bg-[#0043ce] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>{isExportingPDF ? (pdfProgress || 'Exporting...') : 'Download PDF'}</span>
            </button>

            <button
              onClick={onPrint}
              id="print-cert-btn"
              className="inline-flex items-center px-3 py-1.5 bg-[#393939] hover:bg-[#4c4c4c] text-white font-bold text-xs uppercase tracking-wider transition-colors border border-[#525252]"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              id="close-cert-view-btn"
              className="p-1.5 text-[#8d8d8d] hover:text-white hover:bg-[#262626] transition-colors"
              title="Close Certificate"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f4f4f4] print:bg-white print:p-0 print:overflow-visible">
          <div 
            id="printable-progress-certificate" 
            className="bg-white p-6 sm:p-10 border border-[#e0e0e0] print:border-none print:p-0 max-w-3xl mx-auto shadow-sm space-y-6 text-[#161616] font-sans"
          >
            
            {/* Header / Letterhead */}
            <div className="border-b-2 border-[#161616] pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
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
                <div className="flex items-center space-x-3 text-[11px] font-mono text-[#525252] pt-0.5">
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

              {/* Certificate Box */}
              <div className="sm:text-right shrink-0 bg-[#f4f4f4] p-3 border border-[#e0e0e0] sm:min-w-48">
                <span className="text-[10px] font-mono font-bold uppercase text-[#0f62fe] block">
                  OFFICIAL STAGE CERTIFICATE
                </span>
                <span className="text-sm font-mono font-bold text-[#161616] block">
                  {siteUpdate.certificateNumber || 'CERT/PROG/2026/01'}
                </span>
                <div className="text-xs text-[#525252] font-mono mt-1 space-y-0.5">
                  <div>Date: {new Date(siteUpdate.certifiedDate || siteUpdate.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div>Inspection Ref: {siteUpdate.inspectionNumber}</div>
                </div>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center py-2 bg-[#edf5ff] border border-[#a6c8ff]">
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0043ce]">
                ARCHITECT'S CERTIFICATE OF WORK PROGRESS & STAGE COMPLETION
              </h2>
              <span className="text-[11px] font-mono text-[#525252]">
                Issued pursuant to Council of Architecture (CoA) Conditions of Engagement & Milestone Billing
              </span>
            </div>

            {/* Project Particulars Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border border-[#e0e0e0] p-4 bg-[#fcfcfc]">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-[#8d8d8d] block">
                  CLIENT DETAILS
                </span>
                <p className="font-bold text-sm text-[#161616]">{siteUpdate.clientName}</p>
                {siteUpdate.clientEmail && <p className="text-[#525252]">{siteUpdate.clientEmail}</p>}
                {siteUpdate.clientPhone && <p className="font-mono text-[#525252]">{siteUpdate.clientPhone}</p>}
              </div>

              <div className="space-y-1.5 sm:border-l sm:border-[#e0e0e0] sm:pl-4">
                <span className="text-[10px] font-mono uppercase font-bold text-[#8d8d8d] block">
                  PROJECT & SITE LOCATION
                </span>
                <p className="font-bold text-sm text-[#161616]">{siteUpdate.projectTitle}</p>
                <p className="text-[#525252] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0f62fe] shrink-0" />
                  <span>{siteUpdate.siteLocation}</span>
                </p>
                {siteUpdate.contractorName && (
                  <p className="text-[11px] font-mono text-[#525252]">
                    Contractor: <strong>{siteUpdate.contractorName}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Formal Certification Statement */}
            <div className="p-4 bg-[#f4f4f4] border-l-4 border-[#0f62fe] space-y-2 text-xs leading-relaxed">
              <p className="font-bold uppercase tracking-wider text-[#161616] flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-[#0f62fe]" />
                <span>Certification of Physical Site Progress</span>
              </p>
              <p className="text-[#161616]">
                This is to formally certify that a periodic physical site inspection and architectural quality audit was conducted at the aforementioned project site on <strong>{new Date(siteUpdate.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> by <strong>{siteUpdate.architectObserver || firmProfile.architectName}</strong>.
              </p>
              <p className="text-[#161616]">
                The physical construction and execution of <strong className="text-[#0043ce]">{siteUpdate.milestoneStageName}</strong> has been carried out in substantial conformity with the approved architectural drawings, structural specifications, and Council of Architecture standards of workmanship.
              </p>
            </div>

            {/* Milestone & Financial Valuation Breakdown Table */}
            <div className="border border-[#161616]">
              <div className="bg-[#161616] text-white px-3 py-2 text-xs font-mono font-bold uppercase flex justify-between">
                <span>Milestone Stage & Financial Valuation</span>
                <span>Stage Status: {siteUpdate.verificationStatus.replace(/_/g, ' ')}</span>
              </div>

              <div className="p-4 space-y-3">
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-[#e0e0e0]">
                      <td className="py-2 text-[#525252] font-semibold w-1/2">Milestone Stage Inspected:</td>
                      <td className="py-2 font-bold text-[#161616] text-right">{siteUpdate.milestoneStageName}</td>
                    </tr>
                    <tr className="border-b border-[#e0e0e0]">
                      <td className="py-2 text-[#525252] font-semibold">Stage Percentage of Total Fee:</td>
                      <td className="py-2 font-mono font-bold text-[#161616] text-right">{siteUpdate.stagePercentageFee}%</td>
                    </tr>
                    <tr className="border-b border-[#e0e0e0]">
                      <td className="py-2 text-[#525252] font-semibold">Physical Completion Verified on Site:</td>
                      <td className="py-2 font-mono font-bold text-[#0043ce] text-right">
                        {siteUpdate.physicalProgressPercentage}% Completed
                      </td>
                    </tr>
                    <tr className="border-b border-[#e0e0e0]">
                      <td className="py-2 text-[#525252] font-semibold">Stage Fee Valuation:</td>
                      <td className="py-2 font-mono font-bold text-[#161616] text-right">
                        {formatINR(siteUpdate.targetMilestoneAmount)}
                      </td>
                    </tr>
                    <tr className="bg-[#edf5ff]">
                      <td className="py-2.5 px-2 text-[#0043ce] font-bold uppercase">
                        Certified Amount Recommended for Release:
                      </td>
                      <td className="py-2.5 px-2 font-mono text-base font-bold text-[#0043ce] text-right">
                        {formatINR(siteUpdate.targetMilestoneAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[11px] font-mono text-[#525252] italic text-right">
                  Amount in Words: {numberToWordsINR(siteUpdate.targetMilestoneAmount)}
                </p>
              </div>
            </div>

            {/* Observations & Quality Checks */}
            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-mono uppercase font-bold text-[#161616] block">
                Architectural Inspection Observations & Site Notes:
              </span>
              <p className="p-3 bg-[#fcfcfc] border border-[#e0e0e0] text-[#161616] leading-relaxed">
                {siteUpdate.observationsAndNotes}
              </p>

              {siteUpdate.checklistResults && siteUpdate.checklistResults.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#8d8d8d] block mb-1">
                    Quality Checklist Verification:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {siteUpdate.checklistResults.map((chk, i) => (
                      <div key={i} className="flex items-start space-x-1.5 p-1.5 bg-[#f4f4f4] border border-[#e0e0e0] text-[11px]">
                        {chk.isPassed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#24a148] shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#da1e28] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className={chk.isPassed ? 'text-[#161616] font-medium' : 'text-[#da1e28] font-bold'}>
                            {chk.item}
                          </span>
                          {chk.notes && <p className="text-[10px] font-mono text-[#525252]">{chk.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Signature & Seal Block */}
            <div className="pt-6 border-t-2 border-[#161616] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
              <div className="space-y-1 text-[#525252] text-[11px]">
                <p className="font-bold text-[#161616]">Council of Architecture Statutory Note:</p>
                <p>This certificate represents professional architectural opinion based on visual inspection and testing reports provided during periodic site supervision.</p>
                <p className="font-mono text-[10px] text-[#8d8d8d]">Generated via Architect Studio Suite • ISO 19650 Compliance</p>
              </div>

              <div className="text-left sm:text-right shrink-0 min-w-56 space-y-1">
                <div className="h-14 flex items-end justify-start sm:justify-end">
                  <div className="border-b border-dashed border-[#8d8d8d] pb-1 text-right">
                    <span className="font-mono text-xs font-bold text-[#0f62fe]">
                      [{siteUpdate.certifiedByArchitect || firmProfile.architectName}]
                    </span>
                  </div>
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
