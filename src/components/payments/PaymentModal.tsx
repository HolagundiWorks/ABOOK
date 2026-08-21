import React, { useState, useEffect } from 'react';
import { PaymentRecord, Invoice, PaymentMethod, FirmProfile } from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { 
  X, 
  CreditCard, 
  Building2, 
  Calculator, 
  CheckCircle2, 
  HelpCircle,
  FileCheck 
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: PaymentRecord) => void;
  invoices: Invoice[];
  firmProfile: FirmProfile;
  preselectedInvoice?: Invoice | null;
  generatedReceiptNumber: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  invoices,
  firmProfile,
  preselectedInvoice,
  generatedReceiptNumber
}) => {
  if (!isOpen) return null;

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    preselectedInvoice?.id || (invoices.find((i) => i.balanceDue > 0)?.id || invoices[0]?.id || '')
  );

  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId) || preselectedInvoice || null;

  const [receiptNumber, setReceiptNumber] = useState(generatedReceiptNumber);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  // Payment numbers
  const [netAmountReceived, setNetAmountReceived] = useState<number>(() => {
    if (selectedInvoice) {
      return selectedInvoice.balanceDue > 0 ? selectedInvoice.balanceDue : selectedInvoice.totalAmount;
    }
    return 10000;
  });

  const [tdsDeducted, setTdsDeducted] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NEFT_RTGS');
  const [transactionRef, setTransactionRef] = useState('');
  const [bankAccountCredited, setBankAccountCredited] = useState(
    `${firmProfile.bankName} - ${firmProfile.accountNumber}`
  );
  const [notes, setNotes] = useState('');

  // When selected invoice changes, update suggested amount
  useEffect(() => {
    if (selectedInvoice) {
      const remaining = selectedInvoice.balanceDue > 0 ? selectedInvoice.balanceDue : selectedInvoice.totalAmount;
      setNetAmountReceived(remaining);
      setTdsDeducted(0);
    }
  }, [selectedInvoiceId]);

  // TDS 1-Click calculation helpers
  const handleApplyTds10Percent = () => {
    if (!selectedInvoice) return;
    // TDS under 194J is 10% calculated on base professional fee (subtotal), or on the current settlement
    const baseAmount = selectedInvoice.subtotal || selectedInvoice.totalAmount;
    const calculatedTds = Math.round(baseAmount * 0.10);
    setTdsDeducted(calculatedTds);
    
    // Adjust net received if needed so total matches invoice balance
    const balance = selectedInvoice.balanceDue > 0 ? selectedInvoice.balanceDue : selectedInvoice.totalAmount;
    const net = Math.max(0, balance - calculatedTds);
    setNetAmountReceived(net);
  };

  const handleApplyTds2Percent = () => {
    if (!selectedInvoice) return;
    const baseAmount = selectedInvoice.subtotal || selectedInvoice.totalAmount;
    const calculatedTds = Math.round(baseAmount * 0.02);
    setTdsDeducted(calculatedTds);
    
    const balance = selectedInvoice.balanceDue > 0 ? selectedInvoice.balanceDue : selectedInvoice.totalAmount;
    const net = Math.max(0, balance - calculatedTds);
    setNetAmountReceived(net);
  };

  const handleZeroTds = () => {
    setTdsDeducted(0);
    if (selectedInvoice) {
      const balance = selectedInvoice.balanceDue > 0 ? selectedInvoice.balanceDue : selectedInvoice.totalAmount;
      setNetAmountReceived(balance);
    }
  };

  const grossSettled = (Number(netAmountReceived) || 0) + (Number(tdsDeducted) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInvoice) {
      alert('Please select an invoice.');
      return;
    }
    if (grossSettled <= 0) {
      alert('Payment amount must be greater than zero.');
      return;
    }

    const record: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      paymentDate,
      invoiceId: selectedInvoice.id,
      invoiceNumber: selectedInvoice.invoiceNumber,
      proposalId: selectedInvoice.proposalId,
      projectTitle: selectedInvoice.projectTitle,
      clientName: selectedInvoice.client.name,
      netAmountReceived: Number(netAmountReceived) || 0,
      tdsDeducted: Number(tdsDeducted) || 0,
      grossAmountSettled: grossSettled,
      paymentMethod,
      transactionReference: transactionRef.trim() || 'Direct Transfer Ref',
      bankAccountCredited,
      notes,
      createdAt: new Date().toISOString()
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-950 text-white rounded-t-2xl">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wide">
              Fee Collections Bookkeeping
            </span>
            <h3 className="text-xl font-bold text-white">
              Record Fee Payment Receipt
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* 1. Target Invoice Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Invoice to Settle *
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} • {inv.projectTitle} • {inv.client.name} (Due: {formatINR(inv.balanceDue)})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Invoice Highlights */}
          {selectedInvoice && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invoice</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatINR(selectedInvoice.totalAmount)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Already Received</span>
                <span className="font-mono font-semibold text-emerald-700 text-sm">
                  {formatINR(selectedInvoice.paidAmount + selectedInvoice.tdsDeducted)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Balance Due</span>
                <span className="font-mono font-bold text-amber-700 text-sm">
                  {formatINR(selectedInvoice.balanceDue)}
                </span>
              </div>
            </div>
          )}

          {/* Receipt Info & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Receipt Voucher #
              </label>
              <input
                type="text"
                required
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Amount & TDS Calculator Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Remittance & TDS Settlement Breakdown
              </span>
              <div className="flex items-center space-x-1 text-xs">
                <button
                  type="button"
                  onClick={handleApplyTds10Percent}
                  className="px-2 py-0.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded font-semibold text-[11px] transition-colors"
                >
                  10% TDS (194J)
                </button>
                <button
                  type="button"
                  onClick={handleApplyTds2Percent}
                  className="px-2 py-0.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded font-semibold text-[11px] transition-colors"
                >
                  2% TDS
                </button>
                <button
                  type="button"
                  onClick={handleZeroTds}
                  className="px-2 py-0.5 bg-slate-200 text-slate-800 hover:bg-slate-300 rounded font-semibold text-[11px] transition-colors"
                >
                  No TDS
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Net Amount Received in Bank / Cash (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={netAmountReceived}
                  onChange={(e) => setNetAmountReceived(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-bold font-mono px-3 py-2 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
                <span className="text-[11px] text-emerald-800 mt-0.5 block">
                  {formatINR(netAmountReceived)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  TDS Deducted by Client (u/s 194J) (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={tdsDeducted}
                  onChange={(e) => setTdsDeducted(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-bold font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
                <span className="text-[11px] text-blue-700 mt-0.5 block">
                  {formatINR(tdsDeducted)} (Credited in 26AS)
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/80 flex justify-between items-center text-xs font-bold text-slate-900">
              <span>Gross Fee Settled Against Invoice:</span>
              <span className="font-mono text-base text-emerald-950">
                {formatINR(grossSettled)}
              </span>
            </div>
          </div>

          {/* Payment Method & UTR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Payment Mode *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              >
                <option value="NEFT_RTGS">NEFT / RTGS Bank Transfer</option>
                <option value="UPI">UPI (Google Pay, PhonePe, Paytm, BHIM)</option>
                <option value="IMPS">IMPS Instant Transfer</option>
                <option value="CHEQUE">Cheque / Demand Draft</option>
                <option value="BANK_TRANSFER">Direct Account Transfer</option>
                <option value="CASH">Cash Deposit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Transaction Ref / UTR / Cheque # *
              </label>
              <input
                type="text"
                placeholder="e.g. UTR # HDFCN2608194721 or UPI-482910"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Bank Account Credited
            </label>
            <input
              type="text"
              value={bankAccountCredited}
              onChange={(e) => setBankAccountCredited(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Receipt Notes / Milestone Stage Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Stage 1 Concept fee full settlement"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Settling: <strong className="text-slate-900">{formatINR(grossSettled)}</strong>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="payment-save-btn"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Save Payment Receipt
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
