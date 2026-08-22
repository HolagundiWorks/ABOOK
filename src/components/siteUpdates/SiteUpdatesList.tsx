import React, { useState } from 'react';
import { 
  SiteInspectionLog, 
  SiteStageVerificationStatus, 
  FirmProfile, 
  ProjectProposal,
  Invoice
} from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { SiteUpdateModal } from './SiteUpdateModal';
import { ProgressCertificateModal } from './ProgressCertificateModal';
import { 
  HardHat, 
  Plus, 
  Search, 
  Filter, 
  Award, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Building2, 
  MapPin, 
  Bell, 
  Receipt, 
  Edit, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface SiteUpdatesListProps {
  siteUpdates: SiteInspectionLog[];
  firmProfile: FirmProfile;
  proposals: ProjectProposal[];
  invoices: Invoice[];
  onSaveSiteUpdate: (siteUpdate: SiteInspectionLog) => void;
  onDeleteSiteUpdate: (id: string) => void;
  onGenerateInvoiceFromMilestone: (siteUpdate: SiteInspectionLog) => void;
  onSendReminderForMilestone: (siteUpdate: SiteInspectionLog) => void;
}

export const SiteUpdatesList: React.FC<SiteUpdatesListProps> = ({
  siteUpdates,
  firmProfile,
  proposals,
  invoices,
  onSaveSiteUpdate,
  onDeleteSiteUpdate,
  onGenerateInvoiceFromMilestone,
  onSendReminderForMilestone
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiteUpdate, setEditingSiteUpdate] = useState<SiteInspectionLog | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<SiteInspectionLog | null>(null);

  // Filter calculations
  const filteredUpdates = siteUpdates.filter((u) => {
    const matchesSearch =
      u.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.inspectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.milestoneStageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.siteLocation && u.siteLocation.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'CERTIFIED' && u.verificationStatus === 'MILESTONE_COMPLETED_CERTIFIED') ||
      (statusFilter === 'IN_PROGRESS' && u.verificationStatus === 'INSPECTED_IN_PROGRESS') ||
      (statusFilter === 'DEFECTS_HOLD' && u.verificationStatus === 'DEFECTS_HOLD_BILLING') ||
      (statusFilter === 'BILLED' && u.verificationStatus === 'BILLED');

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalInspections = siteUpdates.length;
  const certifiedUnbilled = siteUpdates.filter(
    (u) => u.verificationStatus === 'MILESTONE_COMPLETED_CERTIFIED'
  );
  const readyToBillValuation = certifiedUnbilled.reduce((acc, u) => acc + (u.targetMilestoneAmount || 0), 0);
  const defectHoldsCount = siteUpdates.filter((u) => u.verificationStatus === 'DEFECTS_HOLD_BILLING').length;
  const billedCount = siteUpdates.filter((u) => u.verificationStatus === 'BILLED').length;

  const handleEdit = (update: SiteInspectionLog) => {
    setEditingSiteUpdate(update);
    setIsModalOpen(true);
  };

  const handleNewInspection = () => {
    setEditingSiteUpdate(null);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: SiteStageVerificationStatus) => {
    switch (status) {
      case 'MILESTONE_COMPLETED_CERTIFIED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#edf5ff] text-[#0043ce] border border-[#a6c8ff]">
            <CheckCircle2 className="w-3 h-3 mr-1 text-[#24a148]" />
            Certified • Ready to Bill
          </span>
        );
      case 'DEFECTS_HOLD_BILLING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#fff1f1] text-[#da1e28] border border-[#ff8389]">
            <AlertTriangle className="w-3 h-3 mr-1 text-[#da1e28]" />
            Defects • Billing on Hold
          </span>
        );
      case 'INSPECTED_IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#fcf4d6] text-[#8a6805] border border-[#fddc69]">
            <Clock className="w-3 h-3 mr-1 text-[#b28600]" />
            In Progress
          </span>
        );
      case 'BILLED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#defbe6] text-[#0e6027] border border-[#6fdd8b]">
            <Receipt className="w-3 h-3 mr-1 text-[#24a148]" />
            Invoiced & Billed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#f4f4f4] text-[#525252] border border-[#e0e0e0]">
            Pending Inspection
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-[#0f62fe] bg-[#edf5ff] px-2 py-0.5 font-bold uppercase border border-[#a6c8ff]">
              STEP 2.5 • SITE VERIFICATION & BILLING ENGINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#161616] mt-1">
            Site Updates & Construction Stage Verification
          </h2>
          <p className="text-xs text-[#525252] mt-0.5">
            Track physical construction progress, quality audits, defect punch lists, and issue Council of Architecture Progress Billing Certificates before raising milestone invoices.
          </p>
        </div>

        <button
          onClick={handleNewInspection}
          id="new-site-inspection-btn"
          className="carbon-btn-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shrink-0 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Site Inspection</span>
        </button>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-[#e0e0e0] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#8d8d8d] block">
              TOTAL SITE INSPECTIONS
            </span>
            <span className="text-2xl font-mono font-bold text-[#161616]">
              {totalInspections}
            </span>
            <span className="text-[10px] text-[#525252] block">Verified on site</span>
          </div>
          <div className="p-2.5 bg-[#f4f4f4] text-[#161616]">
            <HardHat className="w-5 h-5 text-[#0f62fe]" />
          </div>
        </div>

        <div className="p-3.5 bg-[#edf5ff] border border-[#a6c8ff] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#0043ce] block">
              CERTIFIED READY TO BILL
            </span>
            <span className="text-2xl font-mono font-bold text-[#0043ce]">
              {certifiedUnbilled.length}
            </span>
            <span className="text-[10px] font-mono font-bold text-[#0043ce] block">
              {formatINR(readyToBillValuation)} Valuation
            </span>
          </div>
          <div className="p-2.5 bg-[#0f62fe] text-white">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white border border-[#e0e0e0] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#da1e28] block">
              DEFECTS / ON HOLD
            </span>
            <span className="text-2xl font-mono font-bold text-[#da1e28]">
              {defectHoldsCount}
            </span>
            <span className="text-[10px] text-[#da1e28] block">Rectification required</span>
          </div>
          <div className="p-2.5 bg-[#fff1f1] text-[#da1e28]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white border border-[#e0e0e0] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#24a148] block">
              BILLED TO CLIENTS
            </span>
            <span className="text-2xl font-mono font-bold text-[#24a148]">
              {billedCount}
            </span>
            <span className="text-[10px] text-[#525252] block">Invoices generated</span>
          </div>
          <div className="p-2.5 bg-[#defbe6] text-[#24a148]">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8d8d8d] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by project, client, stage, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="carbon-input w-full pl-8 py-1.5 text-xs bg-white"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-mono font-bold text-[#525252] uppercase mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" />
            Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Stages' },
            { id: 'CERTIFIED', label: 'Certified' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'DEFECTS_HOLD', label: 'Defects Hold' },
            { id: 'BILLED', label: 'Billed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 text-xs font-mono font-bold uppercase transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#161616] text-white'
                  : 'bg-white text-[#525252] border border-[#e0e0e0] hover:bg-[#e8e8e8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inspection Cards Grid */}
      {filteredUpdates.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#e0e0e0] space-y-3">
          <div className="inline-flex p-3 bg-[#f4f4f4] rounded-full text-[#8d8d8d]">
            <HardHat className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#161616] uppercase">No Site Inspections Found</h3>
          <p className="text-xs text-[#525252] max-w-md mx-auto">
            Log your periodic construction inspections, audit quality checklists, and verify stage milestone completion to unlock automated billing.
          </p>
          <button
            onClick={handleNewInspection}
            className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase"
          >
            Record First Site Inspection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredUpdates.map((update) => {
            const openSnags = (update.snagList || []).filter((s) => !s.isResolved);
            const passedChecks = (update.checklistResults || []).filter((c) => c.isPassed).length;
            const totalChecks = (update.checklistResults || []).length;

            return (
              <div
                key={update.id}
                className="bg-white border border-[#e0e0e0] hover:border-[#161616] transition-all flex flex-col justify-between shadow-xs"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-[#e0e0e0] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#0f62fe] bg-[#edf5ff] px-1.5 py-0.5 border border-[#a6c8ff]">
                          {update.inspectionNumber}
                        </span>
                        <span className="text-[11px] font-mono text-[#525252]">
                          {new Date(update.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#161616] mt-1 leading-snug">
                        {update.projectTitle}
                      </h3>
                      <p className="text-xs text-[#525252] flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-[#8d8d8d]" />
                        <span>Client: <strong>{update.clientName}</strong></span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {getStatusBadge(update.verificationStatus)}
                      {update.certificateNumber && (
                        <span className="block text-[10px] font-mono font-bold text-[#0043ce] mt-1">
                          Cert: {update.certificateNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {update.siteLocation && (
                    <p className="text-[11px] text-[#525252] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0f62fe] shrink-0" />
                      <span className="truncate">{update.siteLocation}</span>
                    </p>
                  )}
                </div>

                {/* Card Body: Stage & Valuation */}
                <div className="p-4 bg-[#fcfcfc] space-y-3 flex-1 text-xs">
                  
                  <div className="p-3 bg-[#edf5ff] border border-[#a6c8ff] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0043ce] flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#0f62fe]" />
                        <span>{update.milestoneStageName}</span>
                      </span>
                      <span className="font-mono font-bold text-sm text-[#0043ce]">
                        {formatINR(update.targetMilestoneAmount)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-[#525252]">Physical Site Execution:</span>
                        <span className="font-bold text-[#161616]">{update.physicalProgressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            update.physicalProgressPercentage >= 100
                              ? 'bg-[#24a148]'
                              : update.physicalProgressPercentage > 50
                              ? 'bg-[#0f62fe]'
                              : 'bg-[#f1c21b]'
                          }`}
                          style={{ width: `${Math.min(100, update.physicalProgressPercentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quality & Snags Row */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-white border border-[#e0e0e0] flex items-center justify-between">
                      <span className="text-[#525252] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#24a148]" />
                        <span>Quality Checks:</span>
                      </span>
                      <span className="font-mono font-bold text-[#161616]">
                        {passedChecks}/{totalChecks} Passed
                      </span>
                    </div>

                    <div className="p-2 bg-white border border-[#e0e0e0] flex items-center justify-between">
                      <span className="text-[#525252] flex items-center gap-1">
                        <AlertTriangle className={`w-3.5 h-3.5 ${openSnags.length > 0 ? 'text-[#da1e28]' : 'text-[#24a148]'}`} />
                        <span>Open Snags:</span>
                      </span>
                      <span className={`font-mono font-bold ${openSnags.length > 0 ? 'text-[#da1e28]' : 'text-[#24a148]'}`}>
                        {openSnags.length} Pending
                      </span>
                    </div>
                  </div>

                  {/* Notes Snippet */}
                  {update.observationsAndNotes && (
                    <p className="text-[#525252] line-clamp-2 italic bg-white p-2 border border-[#e0e0e0]">
                      "{update.observationsAndNotes}"
                    </p>
                  )}

                  {/* Linked Invoice Info if Billed */}
                  {update.linkedInvoiceNumber && (
                    <div className="p-2 bg-[#defbe6] border border-[#6fdd8b] flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#0e6027] flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Linked Invoice: {update.linkedInvoiceNumber}</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#0e6027] uppercase font-bold">Tax Invoice Raised</span>
                    </div>
                  )}

                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-[#f4f4f4] border-t border-[#e0e0e0] flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center space-x-1.5">
                    {/* View Certificate */}
                    {(update.certificateNumber || update.verificationStatus === 'MILESTONE_COMPLETED_CERTIFIED' || update.verificationStatus === 'BILLED') && (
                      <button
                        onClick={() => setViewingCertificate(update)}
                        title="View Council of Architecture Progress Certificate"
                        className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-[#edf5ff] text-[#0043ce] border border-[#a6c8ff] font-bold text-[11px] uppercase tracking-wider transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 mr-1" />
                        <span>CoA Cert</span>
                      </button>
                    )}

                    {/* Send Stage Reminder */}
                    <button
                      onClick={() => onSendReminderForMilestone(update)}
                      title="Send stage billing reminder to client"
                      className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-[#f4f4f4] text-[#525252] hover:text-[#161616] border border-[#e0e0e0] font-bold text-[11px] uppercase tracking-wider transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5 mr-1 text-[#f1c21b]" />
                      <span>Reminder</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Generate Milestone Invoice Button if Certified and not yet billed */}
                    {update.verificationStatus === 'MILESTONE_COMPLETED_CERTIFIED' && (
                      <button
                        onClick={() => onGenerateInvoiceFromMilestone(update)}
                        title="Raise milestone Tax Invoice linked to this stage verification"
                        className="inline-flex items-center px-3 py-1 bg-[#0f62fe] hover:bg-[#0043ce] text-white font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                      >
                        <Receipt className="w-3.5 h-3.5 mr-1" />
                        <span>Raise Invoice</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(update)}
                      className="p-1.5 text-[#525252] hover:text-[#161616] hover:bg-[#e0e0e0] transition-colors"
                      title="Edit Inspection"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete inspection record ${update.inspectionNumber}?`)) {
                          onDeleteSiteUpdate(update.id);
                        }
                      }}
                      className="p-1.5 text-[#8d8d8d] hover:text-[#da1e28] hover:bg-[#fff1f1] transition-colors"
                      title="Delete Inspection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal for New / Edit Inspection */}
      {isModalOpen && (
        <SiteUpdateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSiteUpdate(null);
          }}
          onSave={(siteUpdate) => {
            onSaveSiteUpdate(siteUpdate);
            setIsModalOpen(false);
            setEditingSiteUpdate(null);
          }}
          editingSiteUpdate={editingSiteUpdate}
          existingSiteUpdates={siteUpdates}
          proposals={proposals}
          firmProfile={firmProfile}
        />
      )}

      {/* Certificate Preview Modal */}
      {viewingCertificate && (
        <ProgressCertificateModal
          siteUpdate={viewingCertificate}
          firmProfile={firmProfile}
          onClose={() => setViewingCertificate(null)}
          onPrint={() => window.print()}
        />
      )}

    </div>
  );
};
