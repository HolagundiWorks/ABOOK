import React, { useState, useEffect } from 'react';
import { 
  ProjectProposal, 
  FirmProfile, 
  FeeModel, 
  TaxScheme, 
  ProposalStatus, 
  ProposalMilestone,
  FreelanceTemplate,
  ClientProfile
} from '../../types';
import { 
  COA_STANDARD_STAGES, 
  COA_PRESET_TEMPLATES, 
  COA_STANDARD_CLAUSES,
  INDIAN_STATES_AND_CODES 
} from '../../data/coaStandards';
import { INITIAL_FREELANCE_TEMPLATES } from '../../data/freelanceTemplates';
import { formatINR } from '../../utils/taxCalculations';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Building, 
  User, 
  Check, 
  UserPlus
} from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (proposal: ProjectProposal) => void;
  initialProposal?: ProjectProposal | null;
  generatedProposalNumber: string;
  firmProfile: FirmProfile;
  freelanceTemplates?: FreelanceTemplate[];
  clients?: ClientProfile[];
  onAddNewClient?: () => void;
  preselectedClient?: ClientProfile | null;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProposal,
  generatedProposalNumber,
  firmProfile,
  freelanceTemplates = INITIAL_FREELANCE_TEMPLATES,
  clients = [],
  onAddNewClient,
  preselectedClient
}) => {
  if (!isOpen) return null;

  const [proposalNumber, setProposalNumber] = useState(
    initialProposal?.proposalNumber || generatedProposalNumber
  );
  const [date, setDate] = useState(
    initialProposal?.date || new Date().toISOString().split('T')[0]
  );
  const [validUntil, setValidUntil] = useState(
    initialProposal?.validUntil || 
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Selected Client Profile ID
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialProposal?.client?.clientProfileId || preselectedClient?.id || ''
  );

  // Client Details state
  const [clientName, setClientName] = useState(
    initialProposal?.client.name || preselectedClient?.name || ''
  );
  const [clientOrg, setClientOrg] = useState(
    initialProposal?.client.organization || preselectedClient?.organization || ''
  );
  const [clientEmail, setClientEmail] = useState(
    initialProposal?.client.email || preselectedClient?.email || ''
  );
  const [clientPhone, setClientPhone] = useState(
    initialProposal?.client.phone || preselectedClient?.phone || ''
  );
  const [clientAddress, setClientAddress] = useState(
    initialProposal?.client.address || preselectedClient?.address || ''
  );
  const [clientCity, setClientCity] = useState(
    initialProposal?.client.city || preselectedClient?.city || firmProfile.city
  );
  const [clientState, setClientState] = useState(
    initialProposal?.client.state || preselectedClient?.state || firmProfile.state
  );
  const [clientPincode, setClientPincode] = useState(
    initialProposal?.client.pincode || preselectedClient?.pincode || ''
  );
  const [clientPan, setClientPan] = useState(
    initialProposal?.client.pan || preselectedClient?.pan || ''
  );
  const [clientGstin, setClientGstin] = useState(
    initialProposal?.client.gstin || preselectedClient?.gstin || ''
  );

  // Project Info
  const [projectTitle, setProjectTitle] = useState(initialProposal?.projectTitle || '');
  const [projectType, setProjectType] = useState(
    initialProposal?.projectType || 'Bespoke Residential Villa'
  );
  const [siteLocation, setSiteLocation] = useState(
    initialProposal?.siteLocation || preselectedClient?.siteAddress || ''
  );
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<number>(
    initialProposal?.builtUpAreaSqFt || 4500
  );
  const [estimatedCostOfWork, setEstimatedCostOfWork] = useState<number>(
    initialProposal?.estimatedCostOfWork || 15000000
  );

  // Fee calculation model
  const [feeModel, setFeeModel] = useState<FeeModel>(
    initialProposal?.feeModel || 'PERCENTAGE_COST'
  );
  const [percentageRate, setPercentageRate] = useState<number>(
    initialProposal?.percentageRate || 6.0
  );
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(
    initialProposal?.ratePerSqFt || 120
  );
  const [lumpSumFee, setLumpSumFee] = useState<number>(
    initialProposal?.lumpSumFee || 800000
  );

  // Tax Scheme
  const [taxScheme, setTaxScheme] = useState<TaxScheme>(
    initialProposal?.taxScheme || firmProfile.defaultTaxScheme
  );
  const [status, setStatus] = useState<ProposalStatus>(
    initialProposal?.status || 'DRAFT'
  );

  // Milestones
  const [milestones, setMilestones] = useState<ProposalMilestone[]>(() => {
    if (initialProposal?.milestones && initialProposal.milestones.length > 0) {
      return initialProposal.milestones;
    }
    return COA_STANDARD_STAGES.map((s) => ({
      stageId: s.id,
      stageNumber: s.stageNumber,
      name: s.name,
      deliverables: Array.isArray(s.deliverables) ? s.deliverables.join('; ') : String(s.deliverables || ''),
      percentage: s.percentageOfFee,
      amount: 0
    }));
  });

  // Handle client selection change
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    if (!clientId) return;
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setClientName(client.name);
      setClientOrg(client.organization || '');
      setClientEmail(client.email || '');
      setClientPhone(client.phone || '');
      setClientAddress(client.address || '');
      setClientCity(client.city || firmProfile.city);
      setClientState(client.state || firmProfile.state);
      setClientPincode(client.pincode || '');
      setClientPan(client.pan || '');
      setClientGstin(client.gstin || '');
      if (client.siteAddress && !siteLocation) {
        setSiteLocation(client.siteAddress);
      }
    }
  };

  // Calculate Base Fee
  const calculateTotalFee = (): number => {
    switch (feeModel) {
      case 'PERCENTAGE_COST':
        return Math.round((estimatedCostOfWork * percentageRate) / 100);
      case 'PER_SQFT':
        return Math.round(builtUpAreaSqFt * ratePerSqFt);
      case 'LUMP_SUM':
        return Math.round(lumpSumFee);
      default:
        return 0;
    }
  };

  const totalFee = calculateTotalFee();

  // Recompute milestone amounts when totalFee changes
  useEffect(() => {
    setMilestones((prev) =>
      prev.map((m) => ({
        ...m,
        amount: Math.round((totalFee * m.percentage) / 100)
      }))
    );
  }, [totalFee]);

  const handleApplyFreelanceTemplate = (templateId: string) => {
    const tmpl = freelanceTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;

    setProjectTitle(tmpl.title);
    setProjectType(tmpl.category);
    setFeeModel('LUMP_SUM');
    setLumpSumFee(tmpl.lumpSumRate);

    if (tmpl.items && tmpl.items.length > 0) {
      const updatedMilestones: ProposalMilestone[] = tmpl.items.map((m, idx) => ({
        stageId: m.id || `custom-tmpl-${idx + 1}`,
        stageNumber: idx + 1,
        name: m.name,
        deliverables: m.deliverables,
        percentage: m.percentage,
        amount: Math.round((tmpl.lumpSumRate * m.percentage) / 100)
      }));
      setMilestones(updatedMilestones);
    }
  };

  const handleApplyPresetTemplate = (templateId: string) => {
    const tmpl = COA_PRESET_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;

    const updatedMilestones: ProposalMilestone[] = tmpl.stages.map((s) => ({
      stageId: s.id,
      stageNumber: s.stageNumber,
      name: s.name,
      deliverables: Array.isArray(s.deliverables) ? s.deliverables.join('; ') : String(s.deliverables || ''),
      percentage: s.percentageOfFee,
      amount: Math.round((totalFee * s.percentageOfFee) / 100)
    }));
    setMilestones(updatedMilestones);
  };

  const handleUpdateMilestone = (
    index: number,
    field: keyof ProposalMilestone,
    value: any
  ) => {
    const updated = [...milestones];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    if (field === 'percentage') {
      updated[index].amount = Math.round((totalFee * Number(value)) / 100);
    }
    setMilestones(updated);
  };

  const handleAddMilestone = () => {
    const nextNum = milestones.length + 1;
    setMilestones([
      ...milestones,
      {
        stageId: `custom-${Date.now()}`,
        stageNumber: nextNum,
        name: `Stage ${nextNum}: Additional Milestone`,
        deliverables: 'Detailed architectural drawings and coordination documents.',
        percentage: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    const updated = milestones.filter((_, i) => i !== index);
    setMilestones(
      updated.map((m, idx) => ({
        ...m,
        stageNumber: idx + 1
      }))
    );
  };

  const handleRebalancePercentages = () => {
    if (milestones.length === 0) return;
    const equalShare = Number((100 / milestones.length).toFixed(2));
    setMilestones(
      milestones.map((m, idx) => {
        const pct =
          idx === milestones.length - 1
            ? Number((100 - equalShare * (milestones.length - 1)).toFixed(2))
            : equalShare;
        return {
          ...m,
          percentage: pct,
          amount: Math.round((totalFee * pct) / 100)
        };
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedStateCode =
      INDIAN_STATES_AND_CODES.find((s) => s.name === clientState)?.code ||
      firmProfile.stateCode;

    const proposal: ProjectProposal = {
      id: initialProposal?.id || `prop-${Date.now()}`,
      proposalNumber,
      date,
      validUntil,
      client: {
        clientProfileId: selectedClientId || undefined,
        name: clientName.trim(),
        organization: clientOrg.trim() || undefined,
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        address: clientAddress.trim(),
        city: clientCity.trim(),
        state: clientState.trim(),
        stateCode: selectedStateCode,
        pincode: clientPincode.trim(),
        gstin: clientGstin.trim() || undefined,
        pan: clientPan.trim() || undefined
      },
      projectTitle: projectTitle.trim(),
      projectType,
      siteLocation: siteLocation.trim() || 'Project Site',
      builtUpAreaSqFt,
      estimatedCostOfWork,
      feeModel,
      percentageRate,
      ratePerSqFt,
      lumpSumFee,
      totalEstimatedFee: totalFee,
      taxScheme,
      gstRate: taxScheme === 'REGULAR_GST' ? 18 : taxScheme === 'COMPOSITION_GST' ? 6 : 0,
      milestones,
      scopeOfWorkClauses: initialProposal?.scopeOfWorkClauses || COA_STANDARD_CLAUSES,
      reimbursableExpensesNotes: initialProposal?.reimbursableExpensesNotes || 'Printing, plotting, statutory sanction fees, and site visits beyond the allocated quota are charged at actuals.',
      termsAndConditions: initialProposal?.termsAndConditions || [firmProfile.standardPaymentTerms],
      status,
      createdAt: initialProposal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(proposal);
    onClose();
  };

  return (
    <div id="proposal-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div id="proposal-modal-container" className="w-full max-w-4xl bg-white text-[#161616] border border-[#393939] shadow-2xl my-4 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#161616] text-white border-b border-[#393939] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 bg-[#0f62fe]" />
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">
                {initialProposal ? 'Edit Project Proposal' : 'Draft CoA Architectural Fee Proposal'}
              </h2>
              <span className="text-[10px] font-mono text-[#8d8d8d]">
                Council of Architecture Comprehensive Services & Milestone Schedule
              </span>
            </div>
          </div>
          <button
            id="close-proposal-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-[#393939] text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick Apply Templates Bar */}
          <div className="p-3 bg-[#edf5ff] border-l-2 border-[#0f62fe] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase font-mono text-[#0043ce] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0f62fe]" />
                <span>Quick Apply CoA Stage / Freelance Templates</span>
              </span>
              <span className="text-[10px] font-mono text-[#525252]">Optional</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                onChange={(e) => handleApplyFreelanceTemplate(e.target.value)}
                className="w-full text-xs font-sans px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616] outline-none focus:border-[#0f62fe]"
              >
                <option value="">Choose Freelance Lump Sum Template...</option>
                {freelanceTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — {formatINR(t.lumpSumRate, false)}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => handleApplyPresetTemplate(e.target.value)}
                className="w-full text-xs font-sans px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616] outline-none focus:border-[#0f62fe]"
              >
                <option value="">Choose CoA Stage Template...</option>
                {COA_PRESET_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 1: Client Selection First (Strict Workflow) */}
          <div className="p-4 bg-white border border-[#e0e0e0] space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#e0e0e0]">
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-[#0f62fe]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                  1. Client Profile Selection (Client-First Workflow)
                </span>
              </div>
              {onAddNewClient && (
                <button
                  type="button"
                  onClick={onAddNewClient}
                  className="px-2 py-1 bg-[#161616] hover:bg-[#262626] text-[#4589ff] border border-[#0f62fe] text-[10px] font-mono font-bold uppercase transition-colors flex items-center space-x-1"
                >
                  <UserPlus className="w-3 h-3 text-[#0f62fe]" />
                  <span>+ Register New Client First</span>
                </button>
              )}
            </div>

            {/* Client Directory Picker */}
            {clients.length > 0 ? (
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Select Registered Client Profile (Auto-fills GSTIN, PAN & Address):
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleSelectClient(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                >
                  <option value="">-- Choose from Registered Client Profiles --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.clientCode}] {c.name} {c.organization ? `(${c.organization})` : ''} - {c.city}, {c.category}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-2.5 bg-[#f4f4f4] border border-[#e0e0e0] flex items-center justify-between text-xs text-[#525252]">
                <span>No registered clients yet. Fill in details below or click Register Client First.</span>
                {onAddNewClient && (
                  <button
                    type="button"
                    onClick={onAddNewClient}
                    className="font-bold text-[#0f62fe] underline"
                  >
                    Register Client
                  </button>
                )}
              </div>
            )}

            {/* Metadata (Proposal # & Date) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Proposal Reference #:
                </label>
                <input
                  type="text"
                  required
                  value={proposalNumber}
                  onChange={(e) => setProposalNumber(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Proposal Date:
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Valid Until:
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            {/* Client Detail Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client / Entity Name: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Arvind & Priya Kulkarni"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Organization (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kulkarni Family Trust"
                  value={clientOrg}
                  onChange={(e) => setClientOrg(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client Email:
                </label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client Phone / Mobile:
                </label>
                <input
                  type="tel"
                  placeholder="+91 98801 00000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client GSTIN:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 29AABCA8912K1Z8"
                  value={clientGstin}
                  onChange={(e) => setClientGstin(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono uppercase text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client PAN:
                </label>
                <input
                  type="text"
                  placeholder="AABCA8912K"
                  value={clientPan}
                  onChange={(e) => setClientPan(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono uppercase text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client State:
                </label>
                <select
                  value={clientState}
                  onChange={(e) => setClientState(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                >
                  {INDIAN_STATES_AND_CODES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Project Scope & Architectural Fee Basis */}
          <div className="p-4 bg-white border border-[#e0e0e0] space-y-3">
            <div className="flex items-center space-x-2 pb-1 border-b border-[#e0e0e0]">
              <Building className="w-3.5 h-3.5 text-[#0f62fe]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                2. Project Scope & Architectural Fee Basis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Project Title / Assignment: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bespoke 4BHK Villa Architectural Design"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Project Site Location / Plot Address:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Plot 12B, Palm Meadows, Whitefield, Bengaluru"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            {/* Fee Model Selector */}
            <div className="space-y-2 pt-1">
              <label className="block text-[10px] uppercase font-mono text-[#525252]">
                Architectural Fee Calculation Model:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFeeModel('PERCENTAGE_COST')}
                  className={`py-2 px-2 text-xs font-bold uppercase transition-all border ${
                    feeModel === 'PERCENTAGE_COST'
                      ? 'bg-[#161616] text-[#4589ff] border-[#0f62fe]'
                      : 'bg-white text-[#525252] border-[#8d8d8d] hover:border-[#161616]'
                  }`}
                >
                  % of Cost of Work (CoA)
                </button>
                <button
                  type="button"
                  onClick={() => setFeeModel('PER_SQFT')}
                  className={`py-2 px-2 text-xs font-bold uppercase transition-all border ${
                    feeModel === 'PER_SQFT'
                      ? 'bg-[#161616] text-[#4589ff] border-[#0f62fe]'
                      : 'bg-white text-[#525252] border-[#8d8d8d] hover:border-[#161616]'
                  }`}
                >
                  ₹ / Sq.Ft. Area Basis
                </button>
                <button
                  type="button"
                  onClick={() => setFeeModel('LUMP_SUM')}
                  className={`py-2 px-2 text-xs font-bold uppercase transition-all border ${
                    feeModel === 'LUMP_SUM'
                      ? 'bg-[#161616] text-[#4589ff] border-[#0f62fe]'
                      : 'bg-white text-[#525252] border-[#8d8d8d] hover:border-[#161616]'
                  }`}
                >
                  Fixed Lump Sum Fee
                </button>
              </div>

              {/* Input for selected model */}
              <div className="pt-2">
                {feeModel === 'PERCENTAGE_COST' && (
                  <div className="grid grid-cols-2 gap-3 bg-[#f4f4f4] p-3 border border-[#e0e0e0]">
                    <div>
                      <label className="text-[10px] font-mono text-[#525252] block mb-1">
                        Est. Cost of Work (₹):
                      </label>
                      <input
                        type="number"
                        value={estimatedCostOfWork}
                        onChange={(e) => setEstimatedCostOfWork(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#525252] block mb-1">
                        CoA Scale % Fee:
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={percentageRate}
                        onChange={(e) => setPercentageRate(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616]"
                      />
                    </div>
                  </div>
                )}

                {feeModel === 'PER_SQFT' && (
                  <div className="grid grid-cols-2 gap-3 bg-[#f4f4f4] p-3 border border-[#e0e0e0]">
                    <div>
                      <label className="text-[10px] font-mono text-[#525252] block mb-1">
                        Built-Up Area (Sq.Ft.):
                      </label>
                      <input
                        type="number"
                        value={builtUpAreaSqFt}
                        onChange={(e) => setBuiltUpAreaSqFt(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#525252] block mb-1">
                        Rate per Sq.Ft. (₹):
                      </label>
                      <input
                        type="number"
                        value={ratePerSqFt}
                        onChange={(e) => setRatePerSqFt(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616]"
                      />
                    </div>
                  </div>
                )}

                {feeModel === 'LUMP_SUM' && (
                  <div className="bg-[#f4f4f4] p-3 border border-[#e0e0e0]">
                    <label className="text-[10px] font-mono text-[#525252] block mb-1">
                      Fixed Lump Sum Architectural Fee (₹):
                    </label>
                    <input
                      type="number"
                      value={lumpSumFee}
                      onChange={(e) => setLumpSumFee(Number(e.target.value))}
                      className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tax Scheme & Total Fee Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e0e0e0]">
              <div>
                <label className="text-[10px] uppercase font-mono text-[#525252] block mb-1">
                  Tax Scheme Applicable:
                </label>
                <select
                  value={taxScheme}
                  onChange={(e) => setTaxScheme(e.target.value as TaxScheme)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616] outline-none focus:border-[#0f62fe]"
                >
                  <option value="REGULAR_GST">Regular GST (18% SAC 998321)</option>
                  <option value="COMPOSITION_GST">Composition Scheme (6% Sec 10(2A))</option>
                  <option value="NO_GST">Non-GST / Exempt</option>
                </select>
              </div>

              <div className="bg-[#f4f4f4] p-2.5 border border-[#8d8d8d] flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-[#525252] font-bold">
                  Total Calculated Architectural Fee:
                </span>
                <span className="text-base font-mono font-bold text-[#0043ce]">
                  {formatINR(totalFee, false)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Scope Milestones */}
          <div className="p-4 bg-white border border-[#e0e0e0] space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#e0e0e0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                3. Scope Milestones ({milestones.length} Stages)
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleRebalancePercentages}
                  className="text-[10px] font-mono font-bold text-[#161616] hover:bg-[#e0e0e0] bg-[#f4f4f4] px-2 py-1 border border-[#8d8d8d] transition-colors"
                >
                  Auto-Balance %
                </button>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="text-[10px] font-mono font-bold text-[#0043ce] hover:bg-[#edf5ff] bg-white px-2 py-1 border border-[#0f62fe] transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3 text-[#0f62fe]" />
                  <span>Add Milestone</span>
                </button>
              </div>
            </div>

            {/* Milestones list */}
            <div className="space-y-2.5">
              {milestones.map((m, idx) => (
                <div key={m.stageId || idx} className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 bg-[#161616] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {m.stageNumber}
                    </span>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleUpdateMilestone(idx, 'name', e.target.value)}
                      placeholder="Milestone title"
                      className="w-full text-xs font-bold px-2.5 py-1 bg-white border border-[#8d8d8d] text-[#161616]"
                    />
                    <div className="flex items-center space-x-1 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={m.percentage}
                        onChange={(e) => handleUpdateMilestone(idx, 'percentage', e.target.value)}
                        className="w-12 text-xs font-mono font-bold text-right px-1 py-1 bg-white border border-[#8d8d8d] text-[#161616]"
                      />
                      <span className="text-[10px] font-mono font-bold text-[#525252]">%</span>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="p-1 text-[#8d8d8d] hover:text-[#da1e28]"
                          title="Remove stage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={1}
                    value={m.deliverables}
                    onChange={(e) => handleUpdateMilestone(idx, 'deliverables', e.target.value)}
                    placeholder="Deliverables description..."
                    className="w-full text-xs px-2.5 py-1 bg-white border border-[#8d8d8d] text-[#525252]"
                  />

                  <div className="flex justify-between text-[10px] font-mono text-[#525252] pt-0.5">
                    <span>Milestone Amount Payable:</span>
                    <strong className="text-[#161616] font-bold">{formatINR(m.amount, false)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#e0e0e0] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="carbon-btn-ghost px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="proposal-save-btn"
              className="carbon-btn-primary px-6 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialProposal ? 'Save Changes' : 'Create CoA Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
