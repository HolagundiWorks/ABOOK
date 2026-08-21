import React, { useState, useMemo } from 'react';
import { ExpenseItem, ProjectProposal, ExpenseCategory, Invoice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/taxCalculations';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Trash2, 
  Edit3, 
  Receipt,
  Layers,
  Sparkles
} from 'lucide-react';

interface ExpenseListProps {
  expenses: ExpenseItem[];
  invoices?: Invoice[];
  proposals?: ProjectProposal[];
  onAddExpense: () => void;
  onEditExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  onToggleBilled: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  proposals,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onToggleBilled
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'BILLABLE' | 'NON_BILLABLE' | 'UNBILLED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      // Type filter
      if (filterType === 'BILLABLE' && !exp.isBillable) return false;
      if (filterType === 'NON_BILLABLE' && exp.isBillable) return false;
      if (filterType === 'UNBILLED' && (!exp.isBillable || exp.isBilled)) return false;

      // Category filter
      if (categoryFilter !== 'ALL' && exp.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = exp.description.toLowerCase().includes(q);
        const matchVendor = exp.vendorOrPayee.toLowerCase().includes(q);
        const matchProj = (exp.projectTitle || '').toLowerCase().includes(q);
        const matchClient = (exp.clientName || '').toLowerCase().includes(q);
        const matchRef = (exp.referenceNumber || '').toLowerCase().includes(q);
        return matchDesc || matchVendor || matchProj || matchClient || matchRef;
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterType, categoryFilter, searchQuery]);

  // Aggregate stats
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const billableAmount = expenses.filter(e => e.isBillable).reduce((sum, e) => sum + e.amount, 0);
  const nonBillableAmount = expenses.filter(e => !e.isBillable).reduce((sum, e) => sum + e.amount, 0);
  const unbilledAmount = expenses.filter(e => e.isBillable && !e.isBilled).reduce((sum, e) => sum + e.amount, 0);

  const getCategoryBadgeLabel = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'PRINTING_PLOTTING': return 'Blueprints / Plotting';
      case 'RENDER_3D_COMPUTE': return '3D Cloud Render';
      case 'MODEL_MAKING': return 'Scale Model';
      case 'TRAVEL_SITE_VISIT': return 'Site Travel';
      case 'MUNICIPAL_SANCTIONS': return 'Sanction Liaison';
      case 'SURVEY_SOIL_TEST': return 'Survey / Soil';
      case 'SUB_CONSULTANT_FEE': return 'Sub-Consultant';
      case 'SOFTWARE_SUBSCRIPTIONS': return 'Software License';
      case 'STATIONERY_SUPPLIES': return 'Stationery';
      case 'STUDIO_RENT_UTILITIES': return 'Rent & Power';
      case 'HARDWARE_EQUIPMENT': return 'Hardware';
      case 'CLIENT_MEETINGS': return 'Hospitality';
      default: return 'General Studio';
    }
  };

  return (
    <div className="space-y-6">
      {/* Carbon Studio Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] text-[#ffffff] p-5 border border-[#393939]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#ff832b]"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8d8d8d]">Studio Financial Ledger</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1 text-white">
            Studio Expenses & Reimbursables
          </h1>
          <p className="text-xs text-[#8d8d8d] mt-1 max-w-xl">
            Track client-billable project disbursements (blueprints, scale models, municipal liaison) and internal studio overheads (software licenses, utilities).
          </p>
        </div>
        <button
          id="btn-add-expense"
          onClick={onAddExpense}
          className="carbon-btn-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1 text-black" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#161616]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#525252]">Total Studio Expenses</span>
          <span className="text-xl font-black font-mono text-[#161616] mt-1 block">
            {formatCurrency(totalAmount)}
          </span>
          <span className="text-[10px] text-[#8d8d8d] font-mono mt-1 block">{expenses.length} Total Records</span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#ff832b]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#b84300]">Client Reimbursable</span>
          <span className="text-xl font-black font-mono text-[#ff832b] mt-1 block">
            {formatCurrency(billableAmount)}
          </span>
          <span className="text-[10px] text-[#525252] font-mono mt-1 block">
            {((billableAmount / (totalAmount || 1)) * 100).toFixed(0)}% of Outflow
          </span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#da1e28]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#da1e28]">Unbilled to Recover</span>
          <span className="text-xl font-black font-mono text-[#da1e28] mt-1 block">
            {formatCurrency(unbilledAmount)}
          </span>
          <span className="text-[10px] text-[#da1e28] font-mono mt-1 block">Pending Invoice Recovery</span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#525252]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#525252]">Studio Overheads</span>
          <span className="text-xl font-black font-mono text-[#161616] mt-1 block">
            {formatCurrency(nonBillableAmount)}
          </span>
          <span className="text-[10px] text-[#8d8d8d] font-mono mt-1 block">Non-billable Operations</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 border border-[#e0e0e0] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick classification tabs */}
          <div className="flex flex-wrap gap-1">
            {[
              { key: 'ALL', label: 'All Expenses' },
              { key: 'BILLABLE', label: 'Billable (Client)' },
              { key: 'UNBILLED', label: 'Unbilled (To Recover)' },
              { key: 'NON_BILLABLE', label: 'Overhead' }
            ].map(tab => (
              <button
                key={tab.key}
                id={`filter-tab-${tab.key.toLowerCase()}`}
                onClick={() => setFilterType(tab.key as any)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                  filterType === tab.key
                    ? 'bg-[#161616] text-white border-[#161616]'
                    : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#161616]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            id="expense-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-[#8d8d8d] px-3 py-1.5 text-xs text-[#161616] outline-none focus:border-[#ff832b]"
          >
            <option value="ALL">All Categories</option>
            <option value="PRINTING_PLOTTING">Printing & Plotting</option>
            <option value="RENDER_3D_COMPUTE">3D Cloud Compute</option>
            <option value="MODEL_MAKING">Scale Model</option>
            <option value="TRAVEL_SITE_VISIT">Site Travel</option>
            <option value="MUNICIPAL_SANCTIONS">Municipal Liaison</option>
            <option value="SURVEY_SOIL_TEST">Survey / Soil Test</option>
            <option value="SUB_CONSULTANT_FEE">Sub-Consultant Fee</option>
            <option value="SOFTWARE_SUBSCRIPTIONS">Software Licenses</option>
            <option value="STUDIO_RENT_UTILITIES">Studio Rent / Power</option>
            <option value="HARDWARE_EQUIPMENT">Hardware / Gear</option>
            <option value="CLIENT_MEETINGS">Client Meetings</option>
            <option value="MISCELLANEOUS">Miscellaneous</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8d8d8d]" />
          <input
            type="text"
            id="expense-search-input"
            placeholder="Search description, payee/vendor, project, client, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f4f4f4] border border-[#8d8d8d] pl-9 pr-3 py-2 text-xs text-[#161616] outline-none focus:border-[#ff832b] focus:bg-white"
          />
        </div>
      </div>

      {/* Expenses Table / Cards */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-white p-12 text-center border border-[#e0e0e0]">
          <Receipt className="w-12 h-12 text-[#8d8d8d] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#161616]">No Expense Records Found</h3>
          <p className="text-xs text-[#525252] mt-1 max-w-sm mx-auto">
            No expenses match your search or filter criteria. Click below to record a new project or studio expense.
          </p>
          <button
            onClick={onAddExpense}
            className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider mt-4 inline-flex items-center space-x-1"
          >
            <Plus className="w-4 h-4 mr-1 text-black" />
            <span>Add First Expense</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              id={`expense-card-${exp.id}`}
              className="bg-white border border-[#e0e0e0] hover:border-[#161616] transition-colors p-4 relative"
            >
              {/* Classification Tag Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f4f4f4]">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                    exp.isBillable
                      ? 'bg-[#fff4eb] text-[#b84300] border-[#ff832b]'
                      : 'bg-[#f4f4f4] text-[#525252] border-[#8d8d8d]'
                  }`}>
                    {exp.isBillable ? 'Billable to Client' : 'Studio Overhead'}
                  </span>

                  <span className="text-[10px] font-mono text-[#525252] bg-[#f4f4f4] px-2 py-0.5 border border-[#e0e0e0]">
                    {getCategoryBadgeLabel(exp.category)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-[#525252]">{formatDate(exp.date)}</span>
                  {exp.isBillable && (
                    <button
                      id={`btn-toggle-billed-${exp.id}`}
                      onClick={() => onToggleBilled(exp.id)}
                      title="Click to toggle billed status"
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center space-x-1 border cursor-pointer ${
                        exp.isBilled
                          ? 'bg-[#defbe6] text-[#0f6225] border-[#24a148]'
                          : 'bg-[#fff1f1] text-[#da1e28] border-[#da1e28] hover:bg-[#da1e28] hover:text-white'
                      }`}
                    >
                      {exp.isBilled ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          <span>Billed {exp.invoiceNumber ? `(${exp.invoiceNumber})` : ''}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Unbilled (Pending)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Details */}
              <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#161616]">
                    {exp.description}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#525252]">
                    <span><strong>Payee / Vendor:</strong> {exp.vendorOrPayee}</span>
                    <span><strong>Method:</strong> {exp.paymentMethod}</span>
                    {exp.referenceNumber && <span><strong>Ref:</strong> {exp.referenceNumber}</span>}
                  </div>
                  {exp.projectTitle && (
                    <p className="text-xs text-[#b84300] font-semibold mt-1">
                      📁 Project: {exp.projectTitle} {exp.clientName ? `(${exp.clientName})` : ''}
                    </p>
                  )}
                  {exp.notes && (
                    <p className="text-[11px] text-[#8d8d8d] italic mt-0.5">
                      "{exp.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end md:space-x-4 border-t md:border-t-0 pt-2 md:pt-0 border-[#f4f4f4]">
                  <div className="text-right">
                    <span className="text-xs text-[#8d8d8d] uppercase tracking-wider block">Amount</span>
                    <span className="text-lg font-black font-mono text-[#161616]">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      id={`btn-edit-expense-${exp.id}`}
                      onClick={() => onEditExpense(exp)}
                      className="p-1.5 border border-[#8d8d8d] hover:bg-[#161616] hover:text-white text-[#161616] transition-colors"
                      title="Edit expense"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-delete-expense-${exp.id}`}
                      onClick={() => {
                        if (confirm('Delete this expense entry?')) {
                          onDeleteExpense(exp.id);
                        }
                      }}
                      className="p-1.5 border border-[#da1e28] text-[#da1e28] hover:bg-[#da1e28] hover:text-white transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
