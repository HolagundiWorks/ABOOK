import React, { useState, useEffect } from 'react';
import { ExpenseItem, ExpenseCategory, PaymentMethod, ProjectProposal } from '../../types';
import { X, Check, DollarSign, Receipt, Briefcase, Tag } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseItem) => void;
  expenseToEdit?: ExpenseItem | null;
  proposals: ProjectProposal[];
}

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'PRINTING_PLOTTING', label: 'Printing & Plotting Blueprints' },
  { value: 'RENDER_3D_COMPUTE', label: '3D Cloud Render & GPU Compute' },
  { value: 'MODEL_MAKING', label: 'Scale Model Making & Acrylics' },
  { value: 'TRAVEL_SITE_VISIT', label: 'Site Travel, Fuel & Tolls' },
  { value: 'MUNICIPAL_SANCTIONS', label: 'Municipal Sanctions Liaison' },
  { value: 'SURVEY_SOIL_TEST', label: 'Land Survey & Soil Core Test' },
  { value: 'SUB_CONSULTANT_FEE', label: 'Structural / MEP Sub-consultant' },
  { value: 'SOFTWARE_SUBSCRIPTIONS', label: 'Revit / CAD / Rhino Licenses' },
  { value: 'STATIONERY_SUPPLIES', label: 'Office Stationery & Art Supplies' },
  { value: 'STUDIO_RENT_UTILITIES', label: 'Studio Rent, Power & Internet' },
  { value: 'HARDWARE_EQUIPMENT', label: 'Studio Hardware & Equipment' },
  { value: 'CLIENT_MEETINGS', label: 'Client Hospitality & Meetings' },
  { value: 'MISCELLANEOUS', label: 'Miscellaneous Studio Expense' }
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  expenseToEdit,
  proposals
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('PRINTING_PLOTTING');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [isBillable, setIsBillable] = useState<boolean>(true);
  const [projectId, setProjectId] = useState<string>('');
  const [isBilled, setIsBilled] = useState<boolean>(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [vendorOrPayee, setVendorOrPayee] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (expenseToEdit) {
      setDate(expenseToEdit.date);
      setCategory(expenseToEdit.category);
      setDescription(expenseToEdit.description);
      setAmount(expenseToEdit.amount);
      setIsBillable(expenseToEdit.isBillable);
      setProjectId(expenseToEdit.projectId || '');
      setIsBilled(expenseToEdit.isBilled);
      setInvoiceNumber(expenseToEdit.invoiceNumber || '');
      setPaymentMethod(expenseToEdit.paymentMethod);
      setVendorOrPayee(expenseToEdit.vendorOrPayee);
      setReferenceNumber(expenseToEdit.referenceNumber || '');
      setNotes(expenseToEdit.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('PRINTING_PLOTTING');
      setDescription('');
      setAmount(0);
      setIsBillable(true);
      setProjectId(proposals.length > 0 ? proposals[0].id : '');
      setIsBilled(false);
      setInvoiceNumber('');
      setPaymentMethod('UPI');
      setVendorOrPayee('');
      setReferenceNumber('');
      setNotes('');
    }
  }, [expenseToEdit, isOpen, proposals]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0 || !vendorOrPayee.trim()) {
      alert('Please fill description, positive amount, and vendor/payee.');
      return;
    }

    const selectedProposal = proposals.find(p => p.id === projectId);

    const expense: ExpenseItem = {
      id: expenseToEdit ? expenseToEdit.id : `exp-${Date.now()}`,
      date,
      category,
      description: description.trim(),
      amount: Number(amount),
      isBillable,
      projectId: isBillable && selectedProposal ? selectedProposal.id : undefined,
      projectTitle: isBillable && selectedProposal ? selectedProposal.projectTitle : undefined,
      clientName: isBillable && selectedProposal ? selectedProposal.client.name : undefined,
      isBilled: isBillable ? isBilled : false,
      invoiceNumber: isBillable && isBilled ? invoiceNumber.trim() : undefined,
      paymentMethod,
      vendorOrPayee: vendorOrPayee.trim(),
      referenceNumber: referenceNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: expenseToEdit ? expenseToEdit.createdAt : new Date().toISOString()
    };

    onSave(expense);
    onClose();
  };

  return (
    <div id="expense-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 overflow-y-auto">
      <div id="expense-modal-container" className="w-full max-w-lg bg-[#ffffff] text-[#161616] border border-[#393939] shadow-2xl my-6">
        {/* Carbon Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#161616] text-[#ffffff] border-b border-[#393939]">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#ff832b]"></div>
            <h2 className="text-base font-bold tracking-tight uppercase">
              {expenseToEdit ? 'Edit Studio / Project Expense' : 'Record Studio / Project Expense'}
            </h2>
          </div>
          <button
            id="close-expense-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-[#393939] text-[#ffffff] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Billable vs Non-Billable Selection */}
          <div className="p-3 bg-[#f4f4f4] border border-[#e0e0e0]">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-2">
              Expense Classification
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-expense-billable"
                onClick={() => setIsBillable(true)}
                className={`py-2 px-3 text-xs font-bold uppercase tracking-wider border text-center transition-all ${
                  isBillable
                    ? 'bg-[#ff832b] text-black border-[#ff832b]'
                    : 'bg-white text-[#525252] border-[#8d8d8d] hover:border-[#161616]'
                }`}
              >
                Billable (Client Reimbursable)
              </button>
              <button
                type="button"
                id="btn-expense-non-billable"
                onClick={() => setIsBillable(false)}
                className={`py-2 px-3 text-xs font-bold uppercase tracking-wider border text-center transition-all ${
                  !isBillable
                    ? 'bg-[#161616] text-white border-[#161616]'
                    : 'bg-white text-[#525252] border-[#8d8d8d] hover:border-[#161616]'
                }`}
              >
                Non-Billable (Studio Overhead)
              </button>
            </div>
          </div>

          {/* If Billable, Project Selector */}
          {isBillable && (
            <div className="space-y-2 p-3 bg-[#fff4eb] border-l-4 border-[#ff832b]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#b84300]">
                Associated Project / Proposal
              </label>
              <select
                id="expense-project-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-white border border-[#8d8d8d] p-2 text-sm text-[#161616] outline-none focus:border-[#ff832b]"
              >
                <option value="">-- General Project Billable --</option>
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.proposalNumber} - {p.projectTitle} ({p.client.name})
                  </option>
                ))}
              </select>

              {/* Billing Status */}
              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs font-semibold text-[#161616] cursor-pointer">
                  <input
                    type="checkbox"
                    id="expense-is-billed-checkbox"
                    checked={isBilled}
                    onChange={(e) => setIsBilled(e.target.checked)}
                    className="w-4 h-4 accent-[#ff832b]"
                  />
                  <span>Already Billed to Client on Invoice</span>
                </label>
                {isBilled && (
                  <input
                    type="text"
                    id="expense-invoice-number-input"
                    placeholder="Invoice Ref (e.g. INV-002)"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="border border-[#8d8d8d] px-2 py-1 text-xs outline-none focus:border-[#ff832b] bg-white w-40"
                  />
                )}
              </div>
            </div>
          )}

          {/* Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Date *
              </label>
              <input
                type="date"
                id="expense-date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white border border-[#8d8d8d] p-2 text-sm font-mono text-[#161616] outline-none focus:border-[#ff832b]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Category *
              </label>
              <select
                id="expense-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-white border border-[#8d8d8d] p-2 text-sm text-[#161616] outline-none focus:border-[#ff832b]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
              Expense Item Description *
            </label>
            <input
              type="text"
              id="expense-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A0 Working Drawing sets plotting & lamination"
              required
              className="w-full bg-white border border-[#8d8d8d] p-2 text-sm text-[#161616] outline-none focus:border-[#ff832b]"
            />
          </div>

          {/* Amount & Payee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Amount (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#525252] text-sm font-mono">₹</span>
                <input
                  type="number"
                  id="expense-amount-input"
                  min="0"
                  step="any"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                  className="w-full bg-white border border-[#8d8d8d] pl-7 pr-2 py-2 text-sm font-mono font-bold text-[#161616] outline-none focus:border-[#ff832b]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Vendor / Payee / Paid To *
              </label>
              <input
                type="text"
                id="expense-vendor-input"
                value={vendorOrPayee}
                onChange={(e) => setVendorOrPayee(e.target.value)}
                placeholder="e.g. Apex Reprographics / Fastag"
                required
                className="w-full bg-white border border-[#8d8d8d] p-2 text-sm text-[#161616] outline-none focus:border-[#ff832b]"
              />
            </div>
          </div>

          {/* Payment Method & Reference No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Payment Method
              </label>
              <select
                id="expense-payment-method-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-white border border-[#8d8d8d] p-2 text-sm text-[#161616] outline-none focus:border-[#ff832b]"
              >
                <option value="UPI">UPI (GPay / PhonePe / QR)</option>
                <option value="NEFT_RTGS">NEFT / RTGS</option>
                <option value="IMPS">IMPS Instant Transfer</option>
                <option value="CHEQUE">Cheque / Bank Draft</option>
                <option value="BANK_TRANSFER">Direct Debit / Card</option>
                <option value="CASH">Petty Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Bill / Voucher / Txn Ref No.
              </label>
              <input
                type="text"
                id="expense-reference-input"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. BILL-9921 / UTR-4912"
                className="w-full bg-white border border-[#8d8d8d] p-2 text-sm font-mono text-[#161616] outline-none focus:border-[#ff832b]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
              Internal Notes / Attachment Reference
            </label>
            <textarea
              id="expense-notes-textarea"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reimbursable as per stage 3 agreement clause."
              className="w-full bg-white border border-[#8d8d8d] p-2 text-sm text-[#161616] outline-none focus:border-[#ff832b]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#e0e0e0]">
            <button
              type="button"
              id="cancel-expense-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#161616] bg-transparent border border-[#8d8d8d] hover:bg-[#e0e0e0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-expense-btn"
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-[#ff832b] hover:bg-[#eb6200] hover:text-white border border-[#ff832b] transition-all flex items-center space-x-1"
            >
              <Check className="w-4 h-4 mr-1" />
              {expenseToEdit ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
