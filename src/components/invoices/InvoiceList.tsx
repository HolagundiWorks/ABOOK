import React, { useState } from 'react';
import { Invoice, InvoiceStatus, FirmProfile } from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { 
  ReceiptText, 
  Plus, 
  Search, 
  Printer, 
  CreditCard, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building,
  User,
  ShieldCheck
} from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  firmProfile: FirmProfile;
  onNewInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  firmProfile,
  onNewInvoice,
  onEditInvoice,
  onViewInvoice,
  onDeleteInvoice,
  onRecordPayment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#24a148] border border-[#24a148]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid Full
          </span>
        );
      case 'PARTIALLY_PAID':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#ff832b] border border-[#ff832b]">
            <Clock className="w-3 h-3 mr-1" />
            Partially Paid
          </span>
        );
      case 'UNPAID':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#da1e28] border border-[#da1e28]">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unpaid
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#8d8d8d] border border-[#393939]">
            Cancelled
          </span>
        );
    }
  };

  const getTaxBadge = (inv: Invoice) => {
    if (inv.taxScheme === 'REGULAR_GST') {
      return (
        <span className="text-[10px] font-mono font-bold text-white bg-[#161616] px-1.5 py-0.5 border border-[#ff832b]">
          GST 18% {inv.isInterState ? '(IGST)' : '(CGST+SGST)'}
        </span>
      );
    }
    if (inv.taxScheme === 'COMPOSITION_GST') {
      return (
        <span className="text-[10px] font-mono font-bold text-white bg-[#161616] px-1.5 py-0.5 border border-[#8d8d8d]">
          COMP 6% (Sec 10(2A))
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono font-bold text-white bg-[#24a148] px-1.5 py-0.5 border border-[#24a148]">
        NON-GST / Exempt
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-[#161616] text-white border-2 border-[#393939]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-1.5 py-0.5 bg-[#ff832b] text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                SAC 998321 • ARCHITECTURAL BILLING
              </span>
              <span className="text-[11px] font-mono text-[#8d8d8d]">
                Total: {invoices.length}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white uppercase tracking-tight">
              Tax Invoices & Bills of Supply
            </h2>
            <p className="text-xs text-[#c6c6c6] mt-0.5 max-w-xl">
              Council of Architecture stage-wise milestone billing, GST invoices, and composition vouchers.
            </p>
          </div>

          <button
            id="invoices-create-btn"
            onClick={onNewInvoice}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-[#ff832b] hover:bg-[#fa7516] text-black font-bold uppercase tracking-wider text-xs border border-black transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-3 bg-white border border-[#393939] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8d8d8d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="invoices-search-input"
            type="text"
            placeholder="Search by invoice #, project, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-[#f4f4f4] border border-[#8d8d8d] focus:border-[#ff832b] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'UNPAID', 'PARTIALLY_PAID', 'PAID'].map((st) => (
            <button
              key={st}
              id={`filter-invoice-${st.toLowerCase()}-btn`}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase font-bold border transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#161616] text-[#ff832b] border-[#ff832b]'
                  : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
              }`}
            >
              {st === 'ALL'
                ? 'All'
                : st === 'PARTIALLY_PAID'
                ? 'Partial'
                : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-[#8d8d8d] p-6">
          <ReceiptText className="w-10 h-10 text-[#8d8d8d] mx-auto mb-2" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#161616]">No invoices found</h3>
          <p className="text-xs text-[#525252] max-w-sm mx-auto mt-1 mb-4">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your search terms or filter selection.'
              : 'Create your first milestone stage Tax Invoice or Bill of Supply.'}
          </p>
          <button
            onClick={onNewInvoice}
            className="inline-flex items-center px-4 py-2 bg-[#161616] text-[#ff832b] border border-[#ff832b] text-xs font-bold uppercase tracking-wider hover:bg-[#262626] transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Draft Invoice
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              id={`invoice-item-${inv.id}`}
              className="bg-white border-2 border-[#393939] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:border-[#ff832b] transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="font-mono text-xs font-bold text-white bg-[#161616] px-2 py-0.5">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-[11px] font-mono text-[#525252]">
                    {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {getTaxBadge(inv)}
                  {getStatusBadge(inv.status)}
                </div>

                <h4 className="text-base font-bold text-[#161616] uppercase tracking-tight leading-snug">
                  {inv.projectTitle}
                </h4>

                <div className="flex items-center space-x-3 text-xs text-[#525252] flex-wrap">
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-[#ff832b]" />
                    <span className="font-semibold text-[#161616]">{inv.client.name}</span>
                  </div>
                  {inv.placeOfSupply && (
                    <span className="font-mono text-[11px] text-[#8d8d8d]">• PoS: {inv.placeOfSupply}</span>
                  )}
                  {inv.lineItems.length > 0 && inv.lineItems[0].stageName && (
                    <span className="text-[11px] text-[#525252]">
                      • Stage: <strong>{inv.lineItems[0].stageName}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Financials & Balance */}
              <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 border-t md:border-t-0 pt-2.5 md:pt-0 border-[#e0e0e0]">
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#8d8d8d] block">
                    Invoice Total
                  </span>
                  <span className="text-base font-mono font-bold text-[#161616]">
                    {formatINR(inv.totalAmount)}
                  </span>
                  {inv.subtotal !== inv.totalAmount && (
                    <span className="text-[10px] font-mono text-[#8d8d8d] block">
                      Base: {formatINR(inv.subtotal, false)}
                    </span>
                  )}
                </div>

                <div className="text-right min-w-24">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#8d8d8d] block">
                    Balance Due
                  </span>
                  <span
                    className={`text-base font-mono font-bold ${
                      inv.balanceDue > 0 ? 'text-[#da1e28]' : 'text-[#24a148]'
                    }`}
                  >
                    {formatINR(inv.balanceDue)}
                  </span>
                  {inv.tdsDeducted > 0 && (
                    <span className="text-[10px] font-mono text-[#ff832b] block">
                      TDS: {formatINR(inv.tdsDeducted, false)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  <button
                    id={`invoice-view-${inv.id}-btn`}
                    onClick={() => onViewInvoice(inv)}
                    className="p-1.5 text-[#161616] hover:bg-[#e0e0e0] border border-[#8d8d8d] transition-colors"
                    title="View & Print Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  {inv.balanceDue > 0 && (
                    <button
                      id={`invoice-record-pay-${inv.id}-btn`}
                      onClick={() => onRecordPayment(inv)}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase text-black bg-[#ff832b] hover:bg-[#fa7516] border border-black transition-colors"
                      title="Record Payment for this invoice"
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      Pay
                    </button>
                  )}

                  <button
                    id={`invoice-edit-${inv.id}-btn`}
                    onClick={() => onEditInvoice(inv)}
                    className="p-1.5 text-[#525252] hover:text-[#161616] hover:bg-[#e0e0e0] border border-transparent hover:border-[#8d8d8d] transition-colors"
                    title="Edit Invoice"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    id={`invoice-delete-${inv.id}-btn`}
                    onClick={() => onDeleteInvoice(inv.id)}
                    className="p-1.5 text-[#8d8d8d] hover:text-[#da1e28] hover:bg-[#da1e28]/10 border border-transparent hover:border-[#da1e28] transition-colors"
                    title="Delete Invoice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
