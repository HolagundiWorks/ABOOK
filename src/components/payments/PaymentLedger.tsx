import React, { useState } from 'react';
import { PaymentRecord, Invoice, FirmProfile } from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { 
  WalletCards, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  CheckCircle, 
  CreditCard, 
  Landmark, 
  FileCheck2, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';

interface PaymentLedgerProps {
  payments: PaymentRecord[];
  invoices: Invoice[];
  firmProfile: FirmProfile;
  onRecordPayment: (invoice?: Invoice) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
  onDeletePayment: (id: string) => void;
}

export const PaymentLedger: React.FC<PaymentLedgerProps> = ({
  payments,
  invoices,
  firmProfile,
  onRecordPayment,
  onViewReceipt,
  onDeletePayment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.transactionReference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'ALL' || pay.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  // Totals
  const totalNetReceived = payments.reduce((sum, p) => sum + p.netAmountReceived, 0);
  const totalTdsDeducted = payments.reduce((sum, p) => sum + p.tdsDeducted, 0);
  const totalGrossSettled = payments.reduce((sum, p) => sum + p.grossAmountSettled, 0);
  const totalPendingInvoices = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'UPI':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#ff832b] border border-[#ff832b]">
            UPI
          </span>
        );
      case 'NEFT_RTGS':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-white border border-[#8d8d8d]">
            NEFT/RTGS
          </span>
        );
      case 'CHEQUE':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-white border border-[#8d8d8d]">
            CHEQUE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#e0e0e0] text-[#161616]">
            {method}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-[#161616] text-white border-2 border-[#393939]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-1.5 py-0.5 bg-[#ff832b] text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                RECEIPTS & TDS (SEC 194J)
              </span>
              <span className="text-[11px] font-mono text-[#8d8d8d]">
                Total: {payments.length}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white uppercase tracking-tight">
              Payment Receipts & Collections
            </h2>
            <p className="text-xs text-[#c6c6c6] mt-0.5 max-w-xl">
              Track client fee remittances, bank transfers, and Tax Deducted at Source (TDS) credits.
            </p>
          </div>

          <button
            id="payments-record-btn"
            onClick={() => onRecordPayment()}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-[#ff832b] hover:bg-[#fa7516] text-black font-bold uppercase tracking-wider text-xs border border-black transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Record Payment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 border-2 border-[#393939]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] block">
            Net In-Bank
          </span>
          <p className="text-lg font-bold font-mono text-[#161616] mt-1">
            {formatINR(totalNetReceived)}
          </p>
          <span className="text-[10px] font-mono text-[#24a148] block mt-0.5">
            Direct Collections
          </span>
        </div>

        <div className="bg-white p-3.5 border-2 border-[#393939]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] block">
            TDS Credits (194J)
          </span>
          <p className="text-lg font-bold font-mono text-[#ff832b] mt-1">
            {formatINR(totalTdsDeducted)}
          </p>
          <span className="text-[10px] font-mono text-[#8d8d8d] block mt-0.5">
            Form 26AS Tax credit
          </span>
        </div>

        <div className="bg-white p-3.5 border-2 border-[#393939]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] block">
            Gross Settled
          </span>
          <p className="text-lg font-bold font-mono text-[#161616] mt-1">
            {formatINR(totalGrossSettled)}
          </p>
          <span className="text-[10px] font-mono text-[#8d8d8d] block mt-0.5">
            Collections + TDS
          </span>
        </div>

        <div className="bg-white p-3.5 border-2 border-[#393939]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] block">
            Receivables
          </span>
          <p className="text-lg font-bold font-mono text-[#da1e28] mt-1">
            {formatINR(totalPendingInvoices)}
          </p>
          <span className="text-[10px] font-mono text-[#da1e28] block mt-0.5">
            Pending invoices
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-3 bg-white border border-[#393939] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8d8d8d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="payments-search-input"
            type="text"
            placeholder="Search by receipt #, client, UTR, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-[#f4f4f4] border border-[#8d8d8d] focus:border-[#ff832b] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'NEFT_RTGS', 'UPI', 'IMPS', 'CHEQUE'].map((m) => (
            <button
              key={m}
              id={`filter-payment-${m.toLowerCase()}-btn`}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase font-bold border transition-colors whitespace-nowrap ${
                methodFilter === m
                  ? 'bg-[#161616] text-[#ff832b] border-[#ff832b]'
                  : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
              }`}
            >
              {m === 'ALL' ? 'All Modes' : m.replace('_', '/')}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border-2 border-[#393939] overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12 p-6">
            <WalletCards className="w-10 h-10 text-[#8d8d8d] mx-auto mb-2" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#161616]">No payment records found</h3>
            <p className="text-xs text-[#525252] max-w-sm mx-auto mt-1 mb-4">
              Record payments against milestone invoices to maintain your professional fee income ledger.
            </p>
            <button
              onClick={() => onRecordPayment()}
              className="inline-flex items-center px-4 py-2 bg-[#161616] text-[#ff832b] border border-[#ff832b] text-xs font-bold uppercase tracking-wider hover:bg-[#262626] transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Record First Payment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-white font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Receipt & Date</th>
                  <th className="py-2.5 px-3">Invoice & Project</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Mode & Ref</th>
                  <th className="py-2.5 px-3 text-right">Net In-Bank</th>
                  <th className="py-2.5 px-3 text-right">TDS (194J)</th>
                  <th className="py-2.5 px-3 text-right">Settled</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0] bg-white">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#f4f4f4] transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-[#161616] block">
                        {pay.receiptNumber}
                      </span>
                      <span className="text-[10px] font-mono text-[#525252]">
                        {new Date(pay.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-white bg-[#161616] px-1.5 py-0.5 text-[10px]">
                        {pay.invoiceNumber}
                      </span>
                      <p className="font-bold text-[#161616] uppercase mt-1 text-[11px] line-clamp-1">
                        {pay.projectTitle}
                      </p>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-[#161616] block">
                        {pay.clientName}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div>{getMethodBadge(pay.paymentMethod)}</div>
                      <span className="font-mono text-[10px] text-[#525252] block mt-0.5 truncate max-w-36">
                        {pay.transactionReference}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#24a148] text-xs">
                      {formatINR(pay.netAmountReceived)}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#ff832b]">
                      {pay.tdsDeducted > 0 ? formatINR(pay.tdsDeducted) : '—'}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#161616] text-xs">
                      {formatINR(pay.grossAmountSettled)}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onViewReceipt(pay)}
                          className="p-1 text-[#161616] hover:bg-[#e0e0e0] border border-[#8d8d8d] transition-colors"
                          title="Print Receipt Voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePayment(pay.id)}
                          className="p-1 text-[#8d8d8d] hover:text-[#da1e28] hover:bg-[#da1e28]/10 border border-transparent hover:border-[#da1e28] transition-colors"
                          title="Delete Payment Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
