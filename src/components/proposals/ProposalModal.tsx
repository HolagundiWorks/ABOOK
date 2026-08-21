import React, { useState, useEffect } from 'react';
import { 
  ProjectProposal, 
  ProposalMilestone, 
  FeeModel, 
  TaxScheme, 
  ProposalStatus, 
  FirmProfile,
  FreelanceTemplate 
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
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  HelpCircle,
  RotateCcw,
  Briefcase
} from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (proposal: ProjectProposal) => void;
  initialProposal?: ProjectProposal | null;
  generatedProposalNumber: string;
  firmProfile: FirmProfile;
  freelanceTemplates?: FreelanceTemplate[];
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProposal,
  generatedProposalNumber,
  firmProfile,
  freelanceTemplates = INITIAL_FREELANCE_TEMPLATES
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

  // Client Details
  const [clientName, setClientName] = useState(initialProposal?.client.name || '');
  const [clientOrg, setClientOrg] = useState(initialProposal?.client.organization || '');
  const [clientEmail, setClientEmail] = useState(initialProposal?.client.email || '');
  const [clientPhone, setClientPhone] = useState(initialProposal?.client.phone || '');
  const [clientAddress, setClientAddress] = useState(initialProposal?.client.address || '');
  const [clientCity, setClientCity] = useState(initialProposal?.client.city || firmProfile.city);
  const [clientState, setClientState] = useState(initialProposal?.client.state || firmProfile.state);
  const [clientPincode, setClientPincode] = useState(initialProposal?.client.pincode || '');
  const [clientPan, setClientPan] = useState(initialProposal?.client.pan || '');
  const [clientGstin, setClientGstin] = useState(initialProposal?.client.gstin || '');

  // Project Info
  const [projectTitle, setProjectTitle] = useState(initialProposal?.projectTitle || '');
  const [projectType, setProjectType] = useState(initialProposal?.projectType || 'Bespoke Residential Villa');
  const [siteLocation, setSiteLocation] = useState(initialProposal?.siteLocation || '');
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<number>(initialProposal?.builtUpAreaSqFt || 4500);
  const [estimatedCostOfWork, setEstimatedCostOfWork] = useState<number>(initialProposal?.estimatedCostOfWork || 15000000);

  // Fee calculation model
  const [feeModel, setFeeModel] = useState<FeeModel>(initialProposal?.feeModel || 'PERCENTAGE_COST');
  const [percentageRate, setPercentageRate] = useState<number>(initialProposal?.percentageRate || 6.0);
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(initialProposal?.ratePerSqFt || 120);
  const [lumpSumFee, setLumpSumFee] = useState<number>(initialProposal?.lumpSumFee || 800000);

  // Tax Scheme
  const [taxScheme, setTaxScheme] = useState<TaxScheme>(initialProposal?.taxScheme || firmProfile.defaultTaxScheme);
  const [status, setStatus] = useState<ProposalStatus>(initialProposal?.status || 'DRAFT');

  // Milestones & Scope
  const [milestones, setMilestones] = useState<ProposalMilestone[]>(() => {
    if (initialProposal?.milestones && initialProposal.milestones.length > 0) {
      return initialProposal.milestones;
    }
    return COA_STANDARD_STAGES.map((s) => ({
      stageId: s.id,
      stageNumber: s.stageNumber,
      name: s.name,
      deliverables: s.deliverables.join('; '),
      percentage: s.percentageOfFee,
      amount: 0
    }));
  });

  const [scopeClauses, setScopeClauses] = useState<string[]>(
    initialProposal?.scopeOfWorkClauses || COA_STANDARD_CLAUSES
  );
  const [reimbursables, setReimbursables] = useState(
    initialProposal?.reimbursableExpensesNotes ||
    'Statutory sanction application fees, municipal scrutiny challan charges, and outstation site travel billed at actuals.'
  );
  const [notes, setNotes] = useState(initialProposal?.notes || '');

  // Calculate Total Estimated Fee
  const calculateTotalFee = (): number => {
    if (feeModel === 'PERCENTAGE_COST') {
      return Math.round(((estimatedCostOfWork || 0) * (percentageRate || 0)) / 100);
    }
    if (feeModel === 'PER_SQFT') {
      return Math.round((builtUpAreaSqFt || 0) * (ratePerSqFt || 0));
    }
    return lumpSumFee || 0;
  };

  const totalFee = calculateTotalFee();

  // Recalculate milestone amounts when totalFee or milestones percentage change
  useEffect(() => {
    setMilestones((prev) =>
      prev.map((m) => ({
        ...m,
        amount: Math.round((totalFee * (m.percentage || 0)) / 100)
      }))
    );
  }, [totalFee, feeModel, percentageRate, ratePerSqFt, lumpSumFee, estimatedCostOfWork, builtUpAreaSqFt]);

  const totalPercentage = milestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);
  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.01;

  // Handle Preset CoA Template
  const handleApplyPresetTemplate = (templateId: string) => {
    const template = COA_PRESET_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    if (template.recommendedPercentageRate && feeModel === 'PERCENTAGE_COST') {
      setPercentageRate(template.recommendedPercentageRate);
    }

    const newMilestones: ProposalMilestone[] = template.stages.map((s) => ({
      stageId: s.id,
      stageNumber: s.stageNumber,
      name: s.name,
      deliverables: s.deliverables.join('; '),
      percentage: s.percentageOfFee,
      amount: Math.round((totalFee * s.percentageOfFee) / 100)
    }));

    setMilestones(newMilestones);
  };

  // Handle Freelance / Part-Work Lump Sum Template
  const handleApplyFreelanceTemplate = (tplId: string) => {
    const tpl = freelanceTemplates.find((t) => t.id === tplId);
    if (!tpl) return;

    setFeeModel('LUMP_SUM');
    setLumpSumFee(tpl.lumpSumRate);
    setProjectType(tpl.category);
    if (!projectTitle.trim()) {
      setProjectTitle(tpl.title);
    }

    const newMilestones: ProposalMilestone[] = tpl.items.map((it, idx) => ({
      stageId: it.id,
      stageNumber: idx + 1,
      name: it.name,
      deliverables: it.deliverables,
      percentage: it.percentage,
      amount: it.amount,
      isCustom: true
    }));

    setMilestones(newMilestones);
  };

  // Rebalance percentages to sum 100
  const handleRebalancePercentages = () => {
    if (milestones.length === 0) return;
    const equalShare = Number((100 / milestones.length).toFixed(1));
    const remainder = Number((100 - equalShare * (milestones.length - 1)).toFixed(1));

    const updated = milestones.map((m, idx) => {
      const p = idx === milestones.length - 1 ? remainder : equalShare;
      return {
        ...m,
        percentage: p,
        amount: Math.round((totalFee * p) / 100)
      };
    });
    setMilestones(updated);
  };

  // Add custom / misc milestone
  const handleAddMilestone = () => {
    const nextNum = milestones.length + 1;
    const newM: ProposalMilestone = {
      stageId: `custom_stage_${Date.now()}`,
      stageNumber: nextNum,
      name: `Custom Scope / Milestone #${nextNum}`,
      deliverables: 'Detailed deliverable and drawings description as agreed with client',
      percentage: 10,
      amount: Math.round((totalFee * 10) / 100),
      isCustom: true
    };
    setMilestones([...milestones, newM]);
  };

  const handleUpdateMilestone = (index: number, field: keyof ProposalMilestone, value: any) => {
    const updated = [...milestones];
    const item = { ...updated[index], [field]: value };
    if (field === 'percentage') {
      const numP = parseFloat(value) || 0;
      item.percentage = numP;
      item.amount = Math.round((totalFee * numP) / 100);
    }
    updated[index] = item;
    setMilestones(updated);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    const updated = milestones.filter((_, idx) => idx !== index).map((m, idx) => ({
      ...m,
      stageNumber: idx + 1
    }));
    setMilestones(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      alert('Please enter client name.');
      return;
    }
    if (!projectTitle.trim()) {
      alert('Please enter project title.');
      return;
    }

    const proposal: ProjectProposal = {
      id: initialProposal?.id || `prop-${Date.now()}`,
      proposalNumber,
      date,
      validUntil,
      client: {
        name: clientName,
        organization: clientOrg,
        email: clientEmail,
        phone: clientPhone,
        address: clientAddress,
        city: clientCity,
        state: clientState,
        pincode: clientPincode,
        pan: clientPan,
        gstin: clientGstin
      },
      projectTitle,
      projectType,
      siteLocation,
      builtUpAreaSqFt: Number(builtUpAreaSqFt) || 0,
      estimatedCostOfWork: Number(estimatedCostOfWork) || 0,
      feeModel,
      percentageRate: Number(percentageRate) || 0,
      ratePerSqFt: Number(ratePerSqFt) || 0,
      lumpSumFee: Number(lumpSumFee) || 0,
      totalEstimatedFee: totalFee,
      taxScheme,
      gstRate: taxScheme === 'REGULAR_GST' ? 18 : taxScheme === 'COMPOSITION_GST' ? 6 : 0,
      milestones,
      scopeOfWorkClauses: scopeClauses,
      reimbursableExpensesNotes: reimbursables,
      termsAndConditions: [
        'Milestone disbursement schedule is strictly aligned with Council of Architecture (CoA) guidelines.',
        'Drawings and specifications remain the copyright of the Architect.',
        'Payment terms: Invoices payable within 15 days upon submission.'
      ],
      status,
      notes,
      createdAt: initialProposal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wide">
              {initialProposal ? 'Edit Proposal' : 'Draft Fee Proposal'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              {proposalNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Quick Freelance Template Bar */}
          <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Quick Apply Freelance / Lump Sum Template
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                onChange={(e) => handleApplyFreelanceTemplate(e.target.value)}
                className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900 shadow-2xs"
              >
                <option value="">Choose Freelance Template...</option>
                {freelanceTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — {formatINR(t.lumpSumRate, false)}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => handleApplyPresetTemplate(e.target.value)}
                className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900 shadow-2xs"
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

          {/* Section 1: Metadata & Client */}
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              1. Proposal Details & Client Information
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Proposal #</label>
                <input
                  type="text"
                  required
                  value={proposalNumber}
                  onChange={(e) => setProposalNumber(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Proposal Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Rajesh Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Client Phone</label>
                <input
                  type="text"
                  placeholder="+91 98450 00000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Client GSTIN (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 29ABCPK8891J1Z8"
                  value={clientGstin}
                  onChange={(e) => setClientGstin(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono uppercase px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Client State</label>
                <select
                  value={clientState}
                  onChange={(e) => setClientState(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  {INDIAN_STATES_AND_CODES.map((st) => (
                    <option key={st.code} value={st.name}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Project & Fee Calculation */}
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              2. Project Scope & Architectural Fee Basis
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 3D Elevation & Sanction Drawings for Villa"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            {/* Fee Model Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-slate-700">Fee Calculation Model</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFeeModel('PERCENTAGE_COST')}
                  className={`py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
                    feeModel === 'PERCENTAGE_COST'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  % of Cost
                </button>
                <button
                  type="button"
                  onClick={() => setFeeModel('PER_SQFT')}
                  className={`py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
                    feeModel === 'PER_SQFT'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  ₹ / Sq.Ft.
                </button>
                <button
                  type="button"
                  onClick={() => setFeeModel('LUMP_SUM')}
                  className={`py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
                    feeModel === 'LUMP_SUM'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Lump Sum
                </button>
              </div>

              {/* Input for selected model */}
              <div className="pt-1.5">
                {feeModel === 'PERCENTAGE_COST' && (
                  <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Est. Cost (₹)</label>
                      <input
                        type="number"
                        value={estimatedCostOfWork}
                        onChange={(e) => setEstimatedCostOfWork(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">CoA Scale %</label>
                      <input
                        type="number"
                        step="0.25"
                        value={percentageRate}
                        onChange={(e) => setPercentageRate(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>
                  </div>
                )}

                {feeModel === 'PER_SQFT' && (
                  <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Area (Sq.Ft.)</label>
                      <input
                        type="number"
                        value={builtUpAreaSqFt}
                        onChange={(e) => setBuiltUpAreaSqFt(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Rate / Sq.Ft. (₹)</label>
                      <input
                        type="number"
                        value={ratePerSqFt}
                        onChange={(e) => setRatePerSqFt(Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>
                  </div>
                )}

                {feeModel === 'LUMP_SUM' && (
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="text-[10px] text-slate-500 block">Fixed Lump Sum Architectural Fee (₹)</label>
                    <input
                      type="number"
                      value={lumpSumFee}
                      onChange={(e) => setLumpSumFee(Number(e.target.value))}
                      className="w-full text-xs font-mono font-bold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tax Scheme & Total Fee Indicator */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
              <div>
                <label className="text-[10px] text-slate-500 block font-semibold">Tax Regime</label>
                <select
                  value={taxScheme}
                  onChange={(e) => setTaxScheme(e.target.value as TaxScheme)}
                  className="w-full text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded"
                >
                  <option value="REGULAR_GST">Regular GST (18%)</option>
                  <option value="COMPOSITION_GST">Composition Scheme (6%)</option>
                  <option value="NO_GST">Non-GST / Exempt</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block font-semibold">Total Fee</label>
                <span className="text-xs font-mono font-black text-slate-900 block py-1">
                  {formatINR(totalFee, false)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Scope Milestones */}
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                3. Scope Milestones ({milestones.length})
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleRebalancePercentages}
                  className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200"
                >
                  Auto-Balance %
                </button>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200"
                >
                  + Custom Milestone
                </button>
              </div>
            </div>

            {/* Milestones list */}
            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div key={m.stageId || idx} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {m.stageNumber}
                    </span>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleUpdateMilestone(idx, 'name', e.target.value)}
                      placeholder="Milestone title"
                      className="w-full text-xs font-bold px-2 py-1 border border-slate-200 rounded"
                    />
                    <div className="flex items-center space-x-1 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={m.percentage}
                        onChange={(e) => handleUpdateMilestone(idx, 'percentage', e.target.value)}
                        className="w-10 text-xs font-mono font-bold text-right px-1 py-1 border border-slate-200 rounded"
                      />
                      <span className="text-[10px] font-bold text-slate-500">%</span>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="p-1 text-slate-400 hover:text-red-600"
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
                    className="w-full text-[11px] px-2 py-1 border border-slate-200 rounded text-slate-600"
                  />

                  <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                    <span>Milestone Amount:</span>
                    <strong className="text-slate-900 font-bold">{formatINR(m.amount, false)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="proposal-save-btn"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              {initialProposal ? 'Save Changes' : 'Create Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
