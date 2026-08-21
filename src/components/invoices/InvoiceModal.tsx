import React, { useState } from 'react';
import {
  Invoice,
  InvoiceLineItem,
  FirmProfile,
  TaxScheme,
  InvoiceType,
  ProjectProposal,
  FreelanceTemplate,
  ClientProfile
} from '../../types';
import { SAC_CODES_DIRECTORY, INDIAN_STATES_AND_CODES } from '../../data/coaStandards';
import { INITIAL_FREELANCE_TEMPLATES } from '../../data/freelanceTemplates';
import { calculateGstBreakdown, formatINR } from '../../utils/taxCalculations';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Receipt,
  User,
  Check,
  UserPlus
} from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  initialInvoice?: Invoice | null;
  generatedInvoiceNumber: string;
  proposals: ProjectProposal[];
  firmProfile: FirmProfile;
  preselectedProposal?: ProjectProposal | null;
  freelanceTemplates?: FreelanceTemplate[];
  clients?: ClientProfile[];
  onAddNewClient?: () => void;
  preselectedClient?: ClientProfile | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialInvoice,
  generatedInvoiceNumber,
  proposals,
  firmProfile,
  preselectedProposal,
  freelanceTemplates = INITIAL_FREELANCE_TEMPLATES,
  clients = [],
  onAddNewClient,
  preselectedClient
}) => {
  if (!isOpen) return null;

  // Header Details
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber || generatedInvoiceNumber
  );
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(
    initialInvoice?.invoiceType ||
      (firmProfile.defaultTaxScheme === 'COMPOSITION_GST'
        ? 'BILL_OF_SUPPLY'
        : 'TAX_INVOICE')
  );
  const [date, setDate] = useState(
    initialInvoice?.date || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    initialInvoice?.dueDate ||
      new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Link to Proposal
  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    initialInvoice?.proposalId || preselectedProposal?.id || ''
  );

  // Link to Client Profile (Client-First Workflow)
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialInvoice?.client?.clientProfileId || preselectedClient?.id || ''
  );

  // Client Details
  const [client, setClient] = useState({
    clientProfileId: initialInvoice?.client?.clientProfileId || preselectedClient?.id || '',
    name: initialInvoice?.client.name || preselectedClient?.name || preselectedProposal?.client.name || '',
    organization: initialInvoice?.client.organization || preselectedClient?.organization || preselectedProposal?.client.organization || '',
    email: initialInvoice?.client.email || preselectedClient?.email || preselectedProposal?.client.email || '',
    phone: initialInvoice?.client.phone || preselectedClient?.phone || preselectedProposal?.client.phone || '',
    address: initialInvoice?.client.address || preselectedClient?.address || preselectedProposal?.client.address || '',
    city: initialInvoice?.client.city || preselectedClient?.city || preselectedProposal?.client.city || firmProfile.city,
    state: initialInvoice?.client.state || preselectedClient?.state || preselectedProposal?.client.state || firmProfile.state,
    stateCode: initialInvoice?.client.stateCode || preselectedClient?.stateCode || preselectedProposal?.client.stateCode || firmProfile.stateCode,
    pincode: initialInvoice?.client.pincode || preselectedClient?.pincode || preselectedProposal?.client.pincode || '',
    pan: initialInvoice?.client.pan || preselectedClient?.pan || preselectedProposal?.client.pan || '',
    gstin: initialInvoice?.client.gstin || preselectedClient?.gstin || preselectedProposal?.client.gstin || ''
  });

  // Project Info
  const [projectTitle, setProjectTitle] = useState(
    initialInvoice?.projectTitle || preselectedProposal?.projectTitle || ''
  );
  const [placeOfSupply, setPlaceOfSupply] = useState(
    initialInvoice?.placeOfSupply || client.state || firmProfile.state
  );
  const [placeOfSupplyStateCode, setPlaceOfSupplyStateCode] = useState(
    initialInvoice?.placeOfSupplyStateCode || client.stateCode || firmProfile.stateCode
  );

  // Tax Scheme
  const [taxScheme, setTaxScheme] = useState<TaxScheme>(
    initialInvoice?.taxScheme || firmProfile.defaultTaxScheme
  );

  // Line Items
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(() => {
    if (initialInvoice?.lineItems && initialInvoice.lineItems.length > 0) {
      return initialInvoice.lineItems;
    }
    if (preselectedProposal && preselectedProposal.milestones.length > 0) {
      const firstStage = preselectedProposal.milestones[0];
      return [
        {
          id: `li-prop-${firstStage.stageNumber}`,
          stageNumber: firstStage.stageNumber,
          description: `Stage ${firstStage.stageNumber}: ${firstStage.name} - ${firstStage.deliverables}`,
          sacCode: firmProfile.sacCodeDefault || '998321',
          quantity: 1,
          unit: 'Stage',
          rate: firstStage.amount,
          amount: firstStage.amount
        }
      ];
    }
    return [
      {
        id: `li-${Date.now()}`,
        stageNumber: 1,
        description: 'Architectural Design Consultation & Stage Deliverables',
        sacCode: firmProfile.sacCodeDefault || '998321',
        quantity: 1,
        unit: 'Milestone',
        rate: 50000,
        amount: 50000
      }
    ];
  });

  // Client Selection Handler
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    if (!clientId) return;
    const cl = clients.find((c) => c.id === clientId);
    if (cl) {
      setClient({
        clientProfileId: cl.id,
        name: cl.name,
        organization: cl.organization || '',
        email: cl.email || '',
        phone: cl.phone || '',
        address: cl.address || '',
        city: cl.city || firmProfile.city,
        state: cl.state || firmProfile.state,
        stateCode: cl.stateCode || firmProfile.stateCode,
        pincode: cl.pincode || '',
        pan: cl.pan || '',
        gstin: cl.gstin || ''
      });
      setPlaceOfSupply(cl.state || firmProfile.state);
      setPlaceOfSupplyStateCode(cl.stateCode || firmProfile.stateCode);
    }
  };

  // Sync place of supply state code
  const handleStateChange = (stateName: string) => {
    setPlaceOfSupply(stateName);
    const found = INDIAN_STATES_AND_CODES.find((s) => s.name === stateName);
    if (found) {
      setPlaceOfSupplyStateCode(found.code);
    }
  };

  // Handle Proposal Selection
  const handleProposalChange = (proposalId: string) => {
    setSelectedProposalId(proposalId);
    if (!proposalId) return;

    const prop = proposals.find((p) => p.id === proposalId);
    if (prop) {
      setProjectTitle(prop.projectTitle);
      setClient({
        clientProfileId: prop.client.clientProfileId || '',
        name: prop.client.name,
        organization: prop.client.organization || '',
        email: prop.client.email || '',
        phone: prop.client.phone || '',
        address: prop.client.address || '',
        city: prop.client.city || firmProfile.city,
        state: prop.client.state || firmProfile.state,
        stateCode: prop.client.stateCode || firmProfile.stateCode,
        pincode: prop.client.pincode || '',
        pan: prop.client.pan || '',
        gstin: prop.client.gstin || ''
      });
      setPlaceOfSupply(prop.client.state);
      setPlaceOfSupplyStateCode(prop.client.stateCode || firmProfile.stateCode);
      setTaxScheme(prop.taxScheme);

      if (prop.milestones && prop.milestones.length > 0) {
        const firstStage = prop.milestones[0];
        setLineItems([
          {
            id: `li-prop-${firstStage.stageNumber}`,
            stageNumber: firstStage.stageNumber,
            description: `Stage ${firstStage.stageNumber}: ${firstStage.name} - ${firstStage.deliverables}`,
            sacCode: firmProfile.sacCodeDefault || '998321',
            quantity: 1,
            unit: 'Stage',
            rate: firstStage.amount,
            amount: firstStage.amount
          }
        ]);
      }
    }
  };

  const handleApplyFreelanceTemplate = (templateId: string) => {
    const tmpl = freelanceTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;

    setProjectTitle(tmpl.title);

    if (tmpl.items && tmpl.items.length > 0) {
      const newLineItems: InvoiceLineItem[] = tmpl.items.map((m, idx) => ({
        id: `li-tmpl-${idx + 1}`,
        stageNumber: idx + 1,
        description: `${tmpl.title} - ${m.name}: ${m.deliverables}`,
        sacCode: m.sacCode || tmpl.sacCode || firmProfile.sacCodeDefault || '998321',
        quantity: 1,
        unit: 'Milestone',
        rate: Math.round((tmpl.lumpSumRate * m.percentage) / 100),
        amount: Math.round((tmpl.lumpSumRate * m.percentage) / 100)
      }));
      setLineItems(newLineItems);
    } else {
      setLineItems([
        {
          id: `li-tmpl-single`,
          description: `${tmpl.title} - ${tmpl.description}`,
          sacCode: tmpl.sacCode || firmProfile.sacCodeDefault || '998321',
          quantity: 1,
          unit: 'Job',
          rate: tmpl.lumpSumRate,
          amount: tmpl.lumpSumRate
        }
      ]);
    }
  };

  const handleAddMilestoneToInvoice = (stageNum: number) => {
    const prop = proposals.find((p) => p.id === selectedProposalId);
    if (!prop) return;
    const stage = prop.milestones.find((m) => m.stageNumber === stageNum);
    if (!stage) return;

    setLineItems([
      ...lineItems,
      {
        id: `li-prop-${stage.stageNumber}-${Date.now()}`,
        stageNumber: stage.stageNumber,
        description: `Stage ${stage.stageNumber}: ${stage.name} - ${stage.deliverables}`,
        sacCode: firmProfile.sacCodeDefault || '998321',
        quantity: 1,
        unit: 'Stage',
        rate: stage.amount,
        amount: stage.amount
      }
    ]);
  };

  const handleAddLineItem = () => {
    const nextNum = lineItems.length + 1;
    setLineItems([
      ...lineItems,
      {
        id: `li-${Date.now()}`,
        stageNumber: nextNum,
        description: 'Additional Architectural Service / Deliverable',
        sacCode: firmProfile.sacCodeDefault || '998321',
        quantity: 1,
        unit: 'Job',
        rate: 0,
        amount: 0
      }
    ]);
  };

  const handleUpdateLineItem = (
    index: number,
    field: keyof InvoiceLineItem,
    value: any
  ) => {
    const updated = [...lineItems];
    const item = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(value) : item.quantity;
      const r = field === 'rate' ? Number(value) : item.rate;
      item.amount = Math.round(q * r);
    }

    updated[index] = item;
    setLineItems(updated);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // Subtotal calculation
  const subtotal = lineItems.reduce((acc, item) => acc + item.amount, 0);

  // Tax calculation
  const taxBreakdown = calculateGstBreakdown(
    subtotal,
    taxScheme,
    firmProfile.stateCode,
    placeOfSupplyStateCode
  );
  const totalAmount = subtotal + taxBreakdown.totalTax;

  const previousPaid = initialInvoice?.paidAmount || 0;
  const previousTds = initialInvoice?.tdsDeducted || 0;
  const balanceDue = Math.max(0, totalAmount - (previousPaid + previousTds));

  let status = initialInvoice?.status || 'UNPAID';
  if (balanceDue === 0 && totalAmount > 0) {
    status = 'PAID';
  } else if (previousPaid > 0 || previousTds > 0) {
    status = 'PARTIALLY_PAID';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoice: Invoice = {
      id: initialInvoice?.id || `inv-${Date.now()}`,
      invoiceNumber,
      proposalId: selectedProposalId || undefined,
      type: invoiceType,
      date,
      dueDate,
      projectTitle: projectTitle.trim(),
      client: {
        clientProfileId: selectedClientId || undefined,
        name: client.name.trim(),
        organization: client.organization?.trim() || undefined,
        email: client.email.trim(),
        phone: client.phone.trim(),
        address: client.address.trim(),
        city: client.city.trim(),
        state: client.state.trim(),
        stateCode: placeOfSupplyStateCode,
        pincode: client.pincode.trim(),
        gstin: client.gstin?.trim() || undefined,
        pan: client.pan?.trim() || undefined
      },
      placeOfSupply,
      placeOfSupplyStateCode,
      taxScheme,
      lineItems,
      subtotal,
      gstRate: taxBreakdown.gstRate,
      isInterState: taxBreakdown.isInterState,
      cgstRate: taxBreakdown.cgstRate,
      cgstAmount: taxBreakdown.cgstAmount,
      sgstRate: taxBreakdown.sgstRate,
      sgstAmount: taxBreakdown.sgstAmount,
      igstRate: taxBreakdown.igstRate,
      igstAmount: taxBreakdown.igstAmount,
      totalAmount,
      paidAmount: previousPaid,
      tdsDeducted: previousTds,
      balanceDue,
      status,
      termsAndConditions:
        initialInvoice?.termsAndConditions || firmProfile.standardPaymentTerms,
      createdAt: initialInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(invoice);
    onClose();
  };

  return (
    <div id="invoice-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div id="invoice-modal-container" className="w-full max-w-4xl bg-white text-[#161616] border border-[#393939] shadow-2xl my-4 flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#161616] text-white border-b border-[#393939] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 bg-[#0f62fe]" />
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">
                {initialInvoice ? 'Edit Architectural Invoice' : 'Generate GST Tax Invoice / Bill of Supply'}
              </h2>
              <span className="text-[10px] font-mono text-[#8d8d8d]">
                SAC 998321 Architectural Services • Rule 46 GST & TDS U/S 194J Compliant
              </span>
            </div>
          </div>
          <button
            id="close-invoice-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-[#393939] text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick Apply Templates & Proposal Link */}
          <div className="p-3 bg-[#edf5ff] border-l-2 border-[#0f62fe] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase font-mono text-[#0043ce] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0f62fe]" />
                <span>Link Approved Proposal or Freelance Service Template</span>
              </span>
              <span className="text-[10px] font-mono text-[#525252]">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={selectedProposalId}
                onChange={(e) => handleProposalChange(e.target.value)}
                className="w-full text-xs font-sans px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616] outline-none focus:border-[#0f62fe]"
              >
                <option value="">-- Link to Accepted Proposal (Auto-fills Stages) --</option>
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.proposalNumber} - {p.projectTitle} ({p.client.name})
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => handleApplyFreelanceTemplate(e.target.value)}
                className="w-full text-xs font-sans px-2.5 py-1.5 bg-white border border-[#8d8d8d] text-[#161616] outline-none focus:border-[#0f62fe]"
              >
                <option value="">-- Apply Freelance Milestone Template --</option>
                {freelanceTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — {formatINR(t.lumpSumRate, false)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 1: Client Profile Selection (Client-First Workflow) */}
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

            {/* Client Directory Dropdown */}
            {clients.length > 0 ? (
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Select Registered Client Profile:
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
                <span>No clients in directory yet. Fill in details below or click Register Client First.</span>
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

            {/* Invoice Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Invoice Number: *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Invoice Document Type:
                </label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
                  className="w-full bg-white border border-[#8d8d8d] px-2 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                >
                  <option value="TAX_INVOICE">Tax Invoice (Regular GST)</option>
                  <option value="BILL_OF_SUPPLY">Bill of Supply (Composition / Non-GST)</option>
                  <option value="PROFORMA_INVOICE">Proforma Invoice</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Invoice Date:
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
                  Due Date:
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            {/* Client Entity & Project Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client / Billed To Entity: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Arvind Kulkarni"
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Project Title / Assignment: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architectural Design of 4BHK Residence"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            {/* GSTIN, PAN & Place of Supply */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client GSTIN (for ITC):
                </label>
                <input
                  type="text"
                  placeholder="29AABCA8912K1Z8"
                  value={client.gstin}
                  onChange={(e) => setClient({ ...client, gstin: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono uppercase text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client PAN (for TDS u/s 194J):
                </label>
                <input
                  type="text"
                  placeholder="AABCA8912K"
                  value={client.pan}
                  onChange={(e) => setClient({ ...client, pan: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono uppercase text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Place of Supply (State / UT):
                </label>
                <select
                  value={placeOfSupply}
                  onChange={(e) => handleStateChange(e.target.value)}
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

          {/* Section 2: Billable Milestones & Line Items */}
          <div className="p-4 bg-white border border-[#e0e0e0] space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#e0e0e0]">
              <div className="flex items-center space-x-2">
                <Receipt className="w-3.5 h-3.5 text-[#0f62fe]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                  2. Billable Stages & SAC Services ({lineItems.length} Items)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {selectedProposalId && (
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-mono text-[#525252]">Add Stage:</span>
                    {proposals
                      .find((p) => p.id === selectedProposalId)
                      ?.milestones.map((m) => (
                        <button
                          key={m.stageNumber}
                          type="button"
                          onClick={() => handleAddMilestoneToInvoice(m.stageNumber)}
                          className="px-1.5 py-0.5 bg-[#f4f4f4] hover:bg-[#0f62fe] hover:text-white border border-[#8d8d8d] text-[10px] font-mono font-bold transition-colors"
                        >
                          S{m.stageNumber}
                        </button>
                      ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAddLineItem}
                  className="text-[10px] font-mono font-bold text-[#0043ce] hover:bg-[#edf5ff] bg-white px-2 py-1 border border-[#0f62fe] transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3 text-[#0f62fe]" />
                  <span>Add Line Item</span>
                </button>
              </div>
            </div>

            {/* Line items list */}
            <div className="space-y-2.5">
              {lineItems.map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 bg-[#161616] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateLineItem(idx, 'description', e.target.value)}
                      placeholder="Description of architectural service / milestone deliverable..."
                      className="w-full text-xs font-bold px-2.5 py-1 bg-white border border-[#8d8d8d] text-[#161616]"
                    />
                    <select
                      value={item.sacCode}
                      onChange={(e) => handleUpdateLineItem(idx, 'sacCode', e.target.value)}
                      className="text-[10px] font-mono px-1 py-1 bg-white border border-[#8d8d8d] text-[#161616] shrink-0"
                    >
                      {SAC_CODES_DIRECTORY.map((sac) => (
                        <option key={sac.code} value={sac.code}>
                          SAC {sac.code}
                        </option>
                      ))}
                    </select>
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(idx)}
                        className="p-1 text-[#8d8d8d] hover:text-[#da1e28]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="block text-[9px] uppercase font-mono text-[#525252]">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateLineItem(idx, 'quantity', e.target.value)}
                        className="w-full text-xs font-mono px-2 py-1 bg-white border border-[#8d8d8d]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-mono text-[#525252]">Rate (₹):</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleUpdateLineItem(idx, 'rate', e.target.value)}
                        className="w-full text-xs font-mono font-bold px-2 py-1 bg-white border border-[#8d8d8d]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-mono text-[#525252]">Amount (₹):</label>
                      <input
                        type="text"
                        readOnly
                        value={formatINR(item.amount, false)}
                        className="w-full text-xs font-mono font-bold px-2 py-1 bg-[#f4f4f4] border border-[#8d8d8d] text-[#161616]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Tax Calculation Summary */}
          <div className="p-4 bg-[#f4f4f4] border border-[#8d8d8d] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#525252]">Taxable Subtotal:</span>
              <strong className="text-[#161616]">{formatINR(subtotal, false)}</strong>
            </div>

            {taxScheme === 'REGULAR_GST' && (
              <>
                {taxBreakdown.isInterState ? (
                  <div className="flex justify-between text-xs font-mono text-[#0f62fe]">
                    <span>Integrated GST (IGST 18%):</span>
                    <strong>+{formatINR(taxBreakdown.igstAmount, false)}</strong>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-xs font-mono text-[#0f62fe]">
                      <span>Central GST (CGST 9%):</span>
                      <strong>+{formatINR(taxBreakdown.cgstAmount, false)}</strong>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-[#0f62fe]">
                      <span>State GST (SGST 9%):</span>
                      <strong>+{formatINR(taxBreakdown.sgstAmount, false)}</strong>
                    </div>
                  </>
                )}
              </>
            )}

            {taxScheme === 'COMPOSITION_GST' && (
              <div className="flex justify-between text-xs font-mono text-[#0f62fe]">
                <span>Composition Tax (6% Sec 10(2A)):</span>
                <strong>+{formatINR(taxBreakdown.totalTax, false)}</strong>
              </div>
            )}

            <div className="pt-2 border-t border-[#8d8d8d] flex justify-between items-center">
              <span className="text-xs font-bold uppercase font-mono text-[#161616]">
                Total Invoice Value Payable:
              </span>
              <span className="text-lg font-mono font-bold text-[#0043ce]">
                {formatINR(totalAmount, false)}
              </span>
            </div>
          </div>

          {/* Modal Footer Submit */}
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
              id="invoice-save-btn"
              className="carbon-btn-primary px-6 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialInvoice ? 'Save Changes' : 'Generate Tax Invoice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
