import React, { useState, useEffect } from 'react';
import { 
  Invoice, 
  InvoiceType, 
  InvoiceLineItem, 
  TaxScheme, 
  ProjectProposal, 
  FirmProfile,
  ClientInfo,
  FreelanceTemplate
} from '../../types';
import { 
  calculateGstBreakdown, 
  formatINR 
} from '../../utils/taxCalculations';
import { 
  SAC_CODES_DIRECTORY, 
  INDIAN_STATES_AND_CODES 
} from '../../data/coaStandards';
import { INITIAL_FREELANCE_TEMPLATES } from '../../data/freelanceTemplates';
import { 
  X, 
  Plus, 
  Trash2, 
  Building2, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Receipt,
  FileText
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
  freelanceTemplates = INITIAL_FREELANCE_TEMPLATES
}) => {
  if (!isOpen) return null;

  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber || generatedInvoiceNumber
  );
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(
    initialInvoice?.type || 
    (firmProfile.defaultTaxScheme === 'COMPOSITION_GST' ? 'BILL_OF_SUPPLY' : 'TAX_INVOICE')
  );
  const [date, setDate] = useState(
    initialInvoice?.date || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    initialInvoice?.dueDate || 
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Proposal linkage
  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    initialInvoice?.proposalId || preselectedProposal?.id || ''
  );

  // Project & Client Details
  const [projectTitle, setProjectTitle] = useState(
    initialInvoice?.projectTitle || preselectedProposal?.projectTitle || ''
  );
  const [client, setClient] = useState<ClientInfo>(
    initialInvoice?.client || 
    preselectedProposal?.client || {
      name: '',
      organization: '',
      email: '',
      phone: '',
      address: '',
      city: firmProfile.city,
      state: firmProfile.state,
      pincode: '',
      pan: '',
      gstin: ''
    }
  );

  // Tax Scheme & Place of Supply
  const [taxScheme, setTaxScheme] = useState<TaxScheme>(
    initialInvoice?.taxScheme || preselectedProposal?.taxScheme || firmProfile.defaultTaxScheme
  );
  const [placeOfSupply, setPlaceOfSupply] = useState(
    initialInvoice?.placeOfSupply || firmProfile.state
  );
  const [placeOfSupplyStateCode, setPlaceOfSupplyStateCode] = useState(
    initialInvoice?.placeOfSupplyStateCode || firmProfile.stateCode
  );

  // Line items
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(() => {
    if (initialInvoice?.lineItems && initialInvoice.lineItems.length > 0) {
      return initialInvoice.lineItems;
    }
    if (preselectedProposal && preselectedProposal.milestones.length > 0) {
      const firstM = preselectedProposal.milestones[0];
      return [
        {
          id: 'li-1',
          description: `CoA Stage ${firstM.stageNumber}: ${firstM.name} - ${firstM.deliverables}`,
          stageName: firstM.name,
          sacCode: firmProfile.sacCodeDefault || '998321',
          percentageBilled: firstM.percentage,
          quantity: 1,
          rate: firstM.amount,
          amount: firstM.amount
        }
      ];
    }
    return [
      {
        id: 'li-1',
        description: 'Comprehensive Architectural Consultancy Services - Stage Milestone',
        stageName: 'Concept Design',
        sacCode: firmProfile.sacCodeDefault || '998321',
        quantity: 1,
        rate: 50000,
        amount: 50000
      }
    ];
  });

  const [notes, setNotes] = useState(
    initialInvoice?.notes || 'Payment due within 15 days upon submission.'
  );
  const [terms, setTerms] = useState(
    initialInvoice?.termsAndConditions || firmProfile.standardPaymentTerms
  );

  // Handle Proposal Selection Change
  const handleProposalChange = (propId: string) => {
    setSelectedProposalId(propId);
    const prop = proposals.find((p) => p.id === propId);
    if (prop) {
      setProjectTitle(prop.projectTitle);
      setClient(prop.client);
      setTaxScheme(prop.taxScheme);
      
      const stateObj = INDIAN_STATES_AND_CODES.find((s) => s.name === prop.client.state);
      if (stateObj) {
        setPlaceOfSupply(stateObj.name);
        setPlaceOfSupplyStateCode(stateObj.code);
      }
    }
  };

  // Quick Add from Proposal Milestone
  const handleAddMilestoneToInvoice = (stageNumber: number) => {
    const prop = proposals.find((p) => p.id === selectedProposalId);
    if (!prop) return;
    const milestone = prop.milestones.find((m) => m.stageNumber === stageNumber);
    if (!milestone) return;

    const newItem: InvoiceLineItem = {
      id: `li-${Date.now()}`,
      description: `CoA Stage ${milestone.stageNumber}: ${milestone.name} - ${milestone.deliverables}`,
      stageName: milestone.name,
      sacCode: '998321',
      percentageBilled: milestone.percentage,
      quantity: 1,
      rate: milestone.amount,
      amount: milestone.amount
    };

    setLineItems([...lineItems, newItem]);
  };

  // Apply Freelance Template to Line Items
  const handleApplyFreelanceTemplate = (tplId: string) => {
    const tpl = freelanceTemplates.find((t) => t.id === tplId);
    if (!tpl) return;

    if (!projectTitle.trim()) {
      setProjectTitle(tpl.title);
    }

    const items: InvoiceLineItem[] = tpl.items.map((it) => ({
      id: `li-${Date.now()}-${it.id}`,
      description: `${it.name}: ${it.deliverables}`,
      stageName: it.name,
      sacCode: '998321',
      quantity: 1,
      rate: it.amount,
      amount: it.amount
    }));

    setLineItems(items);
  };

  // Add Custom / Misc Line Item
  const handleAddCustomLineItem = (presetTitle?: string, presetRate?: number) => {
    const newItem: InvoiceLineItem = {
      id: `li-${Date.now()}`,
      description: presetTitle || 'Misc/Custom Work: 3D Visualization / Sanction Liaison / Drafting',
      stageName: 'Custom / Freelance Scope',
      sacCode: '998321',
      quantity: 1,
      rate: presetRate || 15000,
      amount: presetRate || 15000
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleUpdateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...lineItems];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? parseFloat(value) || 0 : item.quantity;
      const r = field === 'rate' ? parseFloat(value) || 0 : item.rate;
      item.quantity = q;
      item.rate = r;
      item.amount = Math.round(q * r);
    }
    updated[index] = item;
    setLineItems(updated);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, idx) => idx !== index));
  };

  const handleStateChange = (stateName: string) => {
    const found = INDIAN_STATES_AND_CODES.find((s) => s.name === stateName);
    if (found) {
      setPlaceOfSupply(found.name);
      setPlaceOfSupplyStateCode(found.code);
      setClient((prev) => ({
        ...prev,
        state: found.name
      }));
    }
  };

  // Tax calculations
  const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxBreakdown = calculateGstBreakdown(
    subtotal, 
    taxScheme, 
    firmProfile.stateCode, 
    placeOfSupplyStateCode
  );
  const isInterState = taxBreakdown.isInterState;
  const totalAmount = taxBreakdown.totalAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!client.name.trim()) {
      alert('Please enter client name.');
      return;
    }
    if (!projectTitle.trim()) {
      alert('Please enter project title.');
      return;
    }
    if (lineItems.length === 0 || subtotal <= 0) {
      alert('Please add at least one line item with a non-zero fee.');
      return;
    }

    const previousPaid = initialInvoice?.paidAmount || 0;
    const previousTds = initialInvoice?.tdsDeducted || 0;
    const balanceDue = Math.max(0, totalAmount - (previousPaid + previousTds));

    let status = initialInvoice?.status || 'UNPAID';
    if (balanceDue === 0 && totalAmount > 0) {
      status = 'PAID';
    } else if (previousPaid + previousTds > 0) {
      status = 'PARTIALLY_PAID';
    }

    const invoice: Invoice = {
      id: initialInvoice?.id || `inv-${Date.now()}`,
      invoiceNumber,
      proposalId: selectedProposalId || undefined,
      type: invoiceType,
      date,
      dueDate,
      client,
      projectTitle,
      placeOfSupply,
      placeOfSupplyStateCode,
      lineItems,
      subtotal,
      taxScheme,
      isInterState,
      gstRate: taxBreakdown.gstRate,
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
      notes,
      termsAndConditions: terms,
      createdAt: initialInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(invoice);
    onClose();
  };

  const selectedProposal = proposals.find((p) => p.id === selectedProposalId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wide">
              {invoiceType === 'TAX_INVOICE' ? 'Tax Invoice' : invoiceType === 'BILL_OF_SUPPLY' ? 'Bill of Supply' : 'Invoice'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              {invoiceNumber}
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
            <span className="font-bold text-amber-950 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Apply Freelance / Part-Work Template
            </span>
            <select
              onChange={(e) => handleApplyFreelanceTemplate(e.target.value)}
              className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900 shadow-2xs"
            >
              <option value="">Select Freelance / Lump Sum Template...</option>
              {freelanceTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category}) — {formatINR(t.lumpSumRate, false)}
                </option>
              ))}
            </select>
          </div>

          {/* Section 1: Invoice Header & Linkage */}
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              1. Invoice Details & Linkage
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Invoice #</label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Invoice Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Link to Approved Proposal (Optional)
              </label>
              <select
                value={selectedProposalId}
                onChange={(e) => handleProposalChange(e.target.value)}
                className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              >
                <option value="">-- Standalone Freelance / Direct Invoice --</option>
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.proposalNumber} - {p.projectTitle} ({p.client.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick add stage milestone if proposal linked */}
            {selectedProposal && selectedProposal.milestones.length > 0 && (
              <div className="pt-1.5">
                <span className="text-[10px] font-bold text-slate-600 block mb-1">
                  Add Milestones from {selectedProposal.proposalNumber}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedProposal.milestones.map((m) => (
                    <button
                      key={m.stageId || m.stageNumber}
                      type="button"
                      onClick={() => handleAddMilestoneToInvoice(m.stageNumber)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700"
                    >
                      + Stage {m.stageNumber} ({m.percentage}%)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Client & Project Info */}
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              2. Client & Project Information
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Project Title *</label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. 3D Architectural Rendering & CAD Drawings"
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Client Name *</label>
                <input
                  type="text"
                  required
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  placeholder="Client / Organization Name"
                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Client GSTIN (if applicable)</label>
                <input
                  type="text"
                  value={client.gstin || ''}
                  onChange={(e) => setClient({ ...client, gstin: e.target.value.toUpperCase() })}
                  placeholder="29ABCPK8891J1Z8"
                  className="w-full text-xs font-mono uppercase px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Place of Supply (State)</label>
                <select
                  value={placeOfSupply}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                >
                  {INDIAN_STATES_AND_CODES.map((st) => (
                    <option key={st.code} value={st.name}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Tax Scheme</label>
                <select
                  value={taxScheme}
                  onChange={(e) => {
                    const sch = e.target.value as TaxScheme;
                    setTaxScheme(sch);
                    if (sch === 'COMPOSITION_GST') setInvoiceType('BILL_OF_SUPPLY');
                    else if (sch === 'REGULAR_GST') setInvoiceType('TAX_INVOICE');
                  }}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="REGULAR_GST">Regular GST (18%)</option>
                  <option value="COMPOSITION_GST">Composition (6%)</option>
                  <option value="NO_GST">Non-GST / Exempt</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Line Items & Custom Work */}
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                3. Invoice Line Items ({lineItems.length})
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => handleAddCustomLineItem('3D Visualization & Exterior Views', 25000)}
                  className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200"
                >
                  + 3D Render
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCustomLineItem()}
                  className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200"
                >
                  + Custom Line Item
                </button>
              </div>
            </div>

            {/* Line items list */}
            <div className="space-y-2">
              {lineItems.map((item, idx) => (
                <div key={item.id || idx} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateLineItem(idx, 'description', e.target.value)}
                      placeholder="Line item description / deliverable details..."
                      className="w-full text-xs font-bold px-2 py-1 border border-slate-200 rounded"
                    />
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(idx)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-400 block">SAC Code</label>
                      <input
                        type="text"
                        value={item.sacCode}
                        onChange={(e) => handleUpdateLineItem(idx, 'sacCode', e.target.value)}
                        className="w-full text-xs font-mono px-1.5 py-1 border border-slate-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block">Qty / Units</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateLineItem(idx, 'quantity', e.target.value)}
                        className="w-full text-xs font-mono px-1.5 py-1 border border-slate-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block">Rate (₹)</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleUpdateLineItem(idx, 'rate', e.target.value)}
                        className="w-full text-xs font-mono font-bold px-1.5 py-1 border border-slate-200 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                    <span>Taxable Value:</span>
                    <strong className="text-slate-900 font-bold">{formatINR(item.amount, false)}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Tax calculation summary card */}
            <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Taxable Subtotal:</span>
                <span className="font-mono font-bold">{formatINR(subtotal, false)}</span>
              </div>

              {taxScheme === 'REGULAR_GST' && (
                <>
                  {!isInterState ? (
                    <>
                      <div className="flex justify-between text-[11px] text-blue-300">
                        <span>CGST (9%):</span>
                        <span className="font-mono">{formatINR(taxBreakdown.cgstAmount, false)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-blue-300">
                        <span>SGST (9%):</span>
                        <span className="font-mono">{formatINR(taxBreakdown.sgstAmount, false)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-[11px] text-blue-300">
                      <span>IGST (18% Inter-state):</span>
                      <span className="font-mono">{formatINR(taxBreakdown.igstAmount, false)}</span>
                    </div>
                  )}
                </>
              )}

              {taxScheme === 'COMPOSITION_GST' && (
                <div className="flex justify-between text-[11px] text-purple-300">
                  <span>Composition Estimate (6%):</span>
                  <span className="font-mono">({formatINR(taxBreakdown.totalTax, false)})</span>
                </div>
              )}

              <div className="flex justify-between text-xs font-bold text-amber-400 pt-1 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="font-mono text-sm">{formatINR(totalAmount, false)}</span>
              </div>
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
              id="invoice-save-btn"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              {initialInvoice ? 'Save Invoice' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
