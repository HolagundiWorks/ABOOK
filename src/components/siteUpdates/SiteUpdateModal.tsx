import React, { useState, useEffect } from 'react';
import { 
  SiteInspectionLog, 
  SiteStageVerificationStatus, 
  SiteSnagItem, 
  ProjectProposal, 
  FirmProfile 
} from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { generateNextSiteInspectionNumber, generateNextCertificateNumber } from '../../utils/storage';
import { 
  X, 
  HardHat, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Calendar, 
  Building2, 
  User, 
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  Layers
} from 'lucide-react';

interface SiteUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (siteUpdate: SiteInspectionLog) => void;
  editingSiteUpdate?: SiteInspectionLog | null;
  existingSiteUpdates: SiteInspectionLog[];
  proposals: ProjectProposal[];
  firmProfile: FirmProfile;
}

const DEFAULT_QUALITY_CHECKLIST = [
  'Foundation / Shuttering levels and axis plumb verification',
  'Reinforcement steel grade (Fe550D), cover blocks, and spacing',
  'Concrete mix grade, slump test, and 14-day curing compliance',
  'Concealed electrical conduit routing & sanitary plumbing slopes',
  'Masonry mortar ratio (1:4) and lintel / chajja alignment'
];

export const SiteUpdateModal: React.FC<SiteUpdateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSiteUpdate,
  existingSiteUpdates,
  proposals,
  firmProfile
}) => {
  const [selectedProposalId, setSelectedProposalId] = useState<string>('');
  const [inspectionNumber, setInspectionNumber] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [siteLocation, setSiteLocation] = useState<string>('');

  const [milestoneStageName, setMilestoneStageName] = useState<string>('');
  const [stagePercentageFee, setStagePercentageFee] = useState<number>(15);
  const [targetMilestoneAmount, setTargetMilestoneAmount] = useState<number>(150000);
  const [physicalProgressPercentage, setPhysicalProgressPercentage] = useState<number>(100);

  const [architectObserver, setArchitectObserver] = useState<string>(firmProfile.architectName);
  const [contractorName, setContractorName] = useState<string>('');
  const [observationsAndNotes, setObservationsAndNotes] = useState<string>('');

  const [checklistResults, setChecklistResults] = useState<{ item: string; isPassed: boolean; notes?: string }[]>(
    DEFAULT_QUALITY_CHECKLIST.map((item) => ({ item, isPassed: true, notes: 'Verified on site' }))
  );

  const [snagList, setSnagList] = useState<SiteSnagItem[]>([]);
  const [newSnagText, setNewSnagText] = useState<string>('');
  const [newSnagLocation, setNewSnagLocation] = useState<string>('');
  const [newSnagSeverity, setNewSnagSeverity] = useState<'CRITICAL' | 'MODERATE' | 'MINOR'>('MODERATE');

  const [verificationStatus, setVerificationStatus] = useState<SiteStageVerificationStatus>('MILESTONE_COMPLETED_CERTIFIED');
  const [certificateNumber, setCertificateNumber] = useState<string>('');
  const [certifiedByArchitect, setCertifiedByArchitect] = useState<string>(
    `${firmProfile.architectName} (CoA: ${firmProfile.coaRegistrationNo})`
  );
  const [certifiedDate, setCertifiedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editingSiteUpdate) {
      setSelectedProposalId(editingSiteUpdate.proposalId || '');
      setInspectionNumber(editingSiteUpdate.inspectionNumber);
      setDate(editingSiteUpdate.date);
      setProjectTitle(editingSiteUpdate.projectTitle);
      setClientName(editingSiteUpdate.clientName);
      setClientEmail(editingSiteUpdate.clientEmail || '');
      setClientPhone(editingSiteUpdate.clientPhone || '');
      setSiteLocation(editingSiteUpdate.siteLocation);
      setMilestoneStageName(editingSiteUpdate.milestoneStageName);
      setStagePercentageFee(editingSiteUpdate.stagePercentageFee);
      setTargetMilestoneAmount(editingSiteUpdate.targetMilestoneAmount);
      setPhysicalProgressPercentage(editingSiteUpdate.physicalProgressPercentage);
      setArchitectObserver(editingSiteUpdate.architectObserver);
      setContractorName(editingSiteUpdate.contractorName || '');
      setObservationsAndNotes(editingSiteUpdate.observationsAndNotes);
      setChecklistResults(editingSiteUpdate.checklistResults || []);
      setSnagList(editingSiteUpdate.snagList || []);
      setVerificationStatus(editingSiteUpdate.verificationStatus);
      setCertificateNumber(editingSiteUpdate.certificateNumber || '');
      setCertifiedByArchitect(editingSiteUpdate.certifiedByArchitect || `${firmProfile.architectName} (${firmProfile.coaRegistrationNo})`);
      setCertifiedDate(editingSiteUpdate.certifiedDate || editingSiteUpdate.date);
    } else {
      // New Inspection
      setInspectionNumber(generateNextSiteInspectionNumber(existingSiteUpdates));
      setDate(new Date().toISOString().split('T')[0]);
      setCertificateNumber(generateNextCertificateNumber(existingSiteUpdates));
      setArchitectObserver(firmProfile.architectName);
      setCertifiedByArchitect(`${firmProfile.architectName} (${firmProfile.coaRegistrationNo})`);

      if (proposals.length > 0) {
        const first = proposals[0];
        setSelectedProposalId(first.id);
        setProjectTitle(first.projectTitle);
        setClientName(first.client.name);
        setClientEmail(first.client.email || '');
        setClientPhone(first.client.phone || '');
        setSiteLocation(first.siteLocation || first.client.address);
        
        if (first.milestones && first.milestones.length > 0) {
          const m = first.milestones[0];
          setMilestoneStageName(m.name);
          setStagePercentageFee(m.percentage);
          setTargetMilestoneAmount(m.amount);
        }
      }
    }
  }, [editingSiteUpdate, isOpen]);

  const handleProposalChange = (propId: string) => {
    setSelectedProposalId(propId);
    const prop = proposals.find((p) => p.id === propId);
    if (prop) {
      setProjectTitle(prop.projectTitle);
      setClientName(prop.client.name);
      setClientEmail(prop.client.email || '');
      setClientPhone(prop.client.phone || '');
      setSiteLocation(prop.siteLocation || prop.client.address);
      if (prop.milestones && prop.milestones.length > 0) {
        const m = prop.milestones[0];
        setMilestoneStageName(m.name);
        setStagePercentageFee(m.percentage);
        setTargetMilestoneAmount(m.amount);
      }
    }
  };

  const handleMilestoneSelect = (milestoneName: string) => {
    setMilestoneStageName(milestoneName);
    const prop = proposals.find((p) => p.id === selectedProposalId);
    if (prop && prop.milestones) {
      const found = prop.milestones.find((m) => m.name === milestoneName);
      if (found) {
        setStagePercentageFee(found.percentage);
        setTargetMilestoneAmount(found.amount);
      }
    }
  };

  const handleAddSnag = () => {
    if (!newSnagText.trim()) return;
    const newSnag: SiteSnagItem = {
      id: `snag-${Date.now()}`,
      description: newSnagText.trim(),
      location: newSnagLocation.trim() || 'General Site',
      severity: newSnagSeverity,
      isResolved: false
    };
    setSnagList([...snagList, newSnag]);
    setNewSnagText('');
    setNewSnagLocation('');
  };

  const handleToggleSnagResolved = (id: string) => {
    setSnagList(
      snagList.map((snag) =>
        snag.id === id
          ? {
              ...snag,
              isResolved: !snag.isResolved,
              resolvedDate: !snag.isResolved ? new Date().toISOString().split('T')[0] : undefined
            }
          : snag
      )
    );
  };

  const handleDeleteSnag = (id: string) => {
    setSnagList(snagList.filter((s) => s.id !== id));
  };

  const handleToggleChecklist = (index: number) => {
    setChecklistResults(
      checklistResults.map((item, idx) =>
        idx === index ? { ...item, isPassed: !item.isPassed } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !milestoneStageName) {
      alert('Please select a project title and milestone stage name.');
      return;
    }

    const payload: SiteInspectionLog = {
      id: editingSiteUpdate ? editingSiteUpdate.id : `site-${Date.now()}`,
      inspectionNumber,
      date,
      proposalId: selectedProposalId || undefined,
      projectTitle,
      clientName,
      clientEmail: clientEmail || undefined,
      clientPhone: clientPhone || undefined,
      siteLocation,
      milestoneStageName,
      stagePercentageFee: Number(stagePercentageFee) || 0,
      targetMilestoneAmount: Number(targetMilestoneAmount) || 0,
      physicalProgressPercentage: Number(physicalProgressPercentage) || 0,
      architectObserver,
      contractorName: contractorName || undefined,
      observationsAndNotes: observationsAndNotes || 'Site work inspected and verified per specifications.',
      checklistResults,
      snagList,
      verificationStatus,
      certificateNumber:
        verificationStatus === 'MILESTONE_COMPLETED_CERTIFIED' || verificationStatus === 'BILLED'
          ? certificateNumber || generateNextCertificateNumber(existingSiteUpdates)
          : undefined,
      certifiedByArchitect:
        verificationStatus === 'MILESTONE_COMPLETED_CERTIFIED' || verificationStatus === 'BILLED'
          ? certifiedByArchitect
          : undefined,
      certifiedDate:
        verificationStatus === 'MILESTONE_COMPLETED_CERTIFIED' || verificationStatus === 'BILLED'
          ? certifiedDate || date
          : undefined,
      linkedInvoiceId: editingSiteUpdate?.linkedInvoiceId,
      linkedInvoiceNumber: editingSiteUpdate?.linkedInvoiceNumber,
      createdAt: editingSiteUpdate ? editingSiteUpdate.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  const currentProposal = proposals.find((p) => p.id === selectedProposalId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#161616] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#393939] shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#0f62fe] text-white">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78a9ff] block">
                STEP 2.5 • STAGE-WISE SITE PROGRESS & VERIFICATION
              </span>
              <h3 className="text-base font-bold text-white uppercase tracking-tight">
                {editingSiteUpdate ? `Edit Inspection Log (${editingSiteUpdate.inspectionNumber})` : 'New Site Inspection & Stage Verification'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d8d8d] hover:text-white hover:bg-[#262626] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Section 1: Project & Inspection Particulars */}
          <div className="p-4 bg-[#f4f4f4] border border-[#e0e0e0] space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#161616] flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-[#0f62fe]" />
              <span>Project & Inspection Reference</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Link Proposal Project
                </label>
                <select
                  value={selectedProposalId}
                  onChange={(e) => handleProposalChange(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-white"
                >
                  <option value="">-- Custom / Ad-hoc Site --</option>
                  {proposals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.proposalNumber} - {p.projectTitle.substring(0, 32)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Inspection #
                </label>
                <input
                  type="text"
                  value={inspectionNumber}
                  onChange={(e) => setInspectionNumber(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs font-mono bg-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Inspection Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Site Location / Address
                </label>
                <input
                  type="text"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-white"
                  placeholder="Plot/Street/Area"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Contractor / PMC Name
                </label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-white"
                  placeholder="e.g. BuildCraft Solutions"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Milestone Stage & Valuation Link */}
          <div className="p-4 bg-[#edf5ff] border border-[#a6c8ff] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#0043ce] flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-[#0f62fe]" />
                <span>Stage Milestone & Fee Linkage (CoA Framework)</span>
              </span>
              <span className="text-[10px] font-mono bg-[#0f62fe] text-white px-2 py-0.5 font-bold">
                Directly Controls Milestone Invoicing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#0043ce] block mb-1">
                  Milestone Stage Name
                </label>
                {currentProposal && currentProposal.milestones && currentProposal.milestones.length > 0 ? (
                  <select
                    value={milestoneStageName}
                    onChange={(e) => handleMilestoneSelect(e.target.value)}
                    className="carbon-input w-full py-1.5 text-xs bg-white font-bold"
                  >
                    {currentProposal.milestones.map((m) => (
                      <option key={m.stageId || m.name} value={m.name}>
                        Stage {m.stageNumber}: {m.name} ({m.percentage}% - {formatINR(m.amount)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={milestoneStageName}
                    onChange={(e) => setMilestoneStageName(e.target.value)}
                    className="carbon-input w-full py-1.5 text-xs bg-white font-bold"
                    placeholder="e.g. Stage 6.2: 1st Floor Slab Casting"
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono uppercase font-bold text-[#0043ce] block mb-1">
                    Stage Fee %
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={stagePercentageFee}
                    onChange={(e) => setStagePercentageFee(Number(e.target.value))}
                    className="carbon-input w-full py-1.5 text-xs font-mono bg-white text-right"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase font-bold text-[#0043ce] block mb-1">
                    Stage Valuation (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetMilestoneAmount}
                    onChange={(e) => setTargetMilestoneAmount(Number(e.target.value))}
                    className="carbon-input w-full py-1.5 text-xs font-mono font-bold bg-white text-right"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Physical Progress Slider */}
            <div className="p-3 bg-white border border-[#a6c8ff] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase text-[#161616]">
                  Physical Construction Progress Verified on Site:
                </span>
                <span className="font-mono text-base font-bold text-[#0043ce]">
                  {physicalProgressPercentage}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={physicalProgressPercentage}
                onChange={(e) => setPhysicalProgressPercentage(Number(e.target.value))}
                className="w-full h-2 bg-[#e0e0e0] rounded-lg appearance-none cursor-pointer accent-[#0f62fe]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8d8d8d]">
                <span>0% Not Started</span>
                <span>50% Mid Execution</span>
                <span>100% Milestone Complete (Ready to Bill)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Architect Observations & Quality Checklist */}
          <div className="p-4 bg-white border border-[#e0e0e0] space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#161616] block">
              Architectural Observations & Quality Audit Notes
            </span>

            <textarea
              rows={3}
              value={observationsAndNotes}
              onChange={(e) => setObservationsAndNotes(e.target.value)}
              placeholder="Record structural alignment, cube test reports, curing status, MEP sleeve placements, architectural finishing notes..."
              className="carbon-input w-full p-2.5 text-xs"
              required
            />

            <div>
              <span className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1.5">
                Site Verification Checklist:
              </span>
              <div className="space-y-1.5">
                {checklistResults.map((chk, index) => (
                  <div
                    key={index}
                    onClick={() => handleToggleChecklist(index)}
                    className={`flex items-center justify-between p-2 text-xs border cursor-pointer transition-colors ${
                      chk.isPassed
                        ? 'bg-[#edf5ff] border-[#a6c8ff] text-[#0043ce]'
                        : 'bg-[#fff1f1] border-[#da1e28] text-[#da1e28]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {chk.isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#24a148] shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#da1e28] shrink-0" />
                      )}
                      <span className="font-medium">{chk.item}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 bg-white border">
                      {chk.isPassed ? 'PASSED / VERIFIED' : 'FAILED / REWORK'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Snags & Defect Punch List */}
          <div className="p-4 bg-white border border-[#e0e0e0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#161616] flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-[#f1c21b]" />
                <span>Site Snagging & Rectification Punch List</span>
              </span>
              <span className="text-[10px] font-mono text-[#525252]">
                {snagList.filter((s) => !s.isResolved).length} Open Snags
              </span>
            </div>

            {/* Add Snag Form */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSnagText}
                onChange={(e) => setNewSnagText(e.target.value)}
                placeholder="Snag description (e.g. living room conduit misaligned)..."
                className="carbon-input flex-1 py-1.5 text-xs"
              />
              <input
                type="text"
                value={newSnagLocation}
                onChange={(e) => setNewSnagLocation(e.target.value)}
                placeholder="Location (e.g. 1st Floor Living)"
                className="carbon-input w-full sm:w-40 py-1.5 text-xs"
              />
              <select
                value={newSnagSeverity}
                onChange={(e) => setNewSnagSeverity(e.target.value as any)}
                className="carbon-input py-1.5 text-xs bg-white font-mono"
              >
                <option value="MINOR">Minor</option>
                <option value="MODERATE">Moderate</option>
                <option value="CRITICAL">Critical</option>
              </select>
              <button
                type="button"
                onClick={handleAddSnag}
                className="carbon-btn-primary px-3 py-1.5 text-xs font-bold uppercase shrink-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>

            {/* Snags list */}
            {snagList.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {snagList.map((snag) => (
                  <div
                    key={snag.id}
                    className={`p-2 border flex items-center justify-between text-xs ${
                      snag.isResolved ? 'bg-[#f4f4f4] border-[#e0e0e0] opacity-70' : 'bg-white border-[#f1c21b]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="checkbox"
                        checked={snag.isResolved}
                        onChange={() => handleToggleSnagResolved(snag.id)}
                        className="rounded border-[#8d8d8d]"
                      />
                      <div className={snag.isResolved ? 'line-through text-[#8d8d8d]' : 'text-[#161616]'}>
                        <span className="font-semibold">{snag.description}</span>
                        <span className="text-[10px] font-mono text-[#525252] ml-2">({snag.location})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase ${
                          snag.severity === 'CRITICAL'
                            ? 'bg-[#da1e28] text-white'
                            : snag.severity === 'MODERATE'
                            ? 'bg-[#f1c21b] text-[#161616]'
                            : 'bg-[#e0e0e0] text-[#525252]'
                        }`}
                      >
                        {snag.severity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSnag(snag.id)}
                        className="text-[#8d8d8d] hover:text-[#da1e28] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Stage Verification Status & Certificate Signoff */}
          <div className="p-4 bg-[#161616] text-white border border-[#393939] space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#78a9ff] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0f62fe]" />
              <span>Architectural Stage Verification & Certification Decision</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#8d8d8d] block mb-1">
                  Stage Verification Status
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value as SiteStageVerificationStatus)}
                  className="carbon-input w-full py-2 text-xs font-bold font-mono bg-[#262626] text-white border-[#525252]"
                >
                  <option value="MILESTONE_COMPLETED_CERTIFIED">✅ MILESTONE COMPLETED & CERTIFIED (Ready to Bill)</option>
                  <option value="INSPECTED_IN_PROGRESS">⏳ INSPECTED - WORK IN PROGRESS (Partial)</option>
                  <option value="DEFECTS_HOLD_BILLING">⚠️ DEFECTS IDENTIFIED (Hold Milestone Billing)</option>
                  <option value="PENDING_INSPECTION">📋 PENDING / SCHEDULED INSPECTION</option>
                  <option value="BILLED">📦 BILLED (Invoice Already Raised)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#8d8d8d] block mb-1">
                  Progress Certificate #
                </label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  className="carbon-input w-full py-2 text-xs font-mono bg-[#262626] text-[#78a9ff] border-[#525252] font-bold"
                  placeholder="e.g. CERT/PROG/2026/01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#8d8d8d] block mb-1">
                  Certifying Architect (CoA Sign-off)
                </label>
                <input
                  type="text"
                  value={certifiedByArchitect}
                  onChange={(e) => setCertifiedByArchitect(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-[#262626] text-white border-[#525252]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#8d8d8d] block mb-1">
                  Certification Date
                </label>
                <input
                  type="date"
                  value={certifiedDate}
                  onChange={(e) => setCertifiedDate(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-[#262626] text-white border-[#525252]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="carbon-btn-ghost px-4 py-2 text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="carbon-btn-primary px-6 py-2 text-xs font-bold uppercase tracking-wider shadow-md"
            >
              {editingSiteUpdate ? 'Update Site Inspection' : 'Save & Record Inspection'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
