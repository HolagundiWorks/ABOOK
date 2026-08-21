import React, { useState, useMemo } from 'react';
import { SalaryRecord, FirmProfile } from '../../types';
import { formatCurrency, formatDate } from '../../utils/taxCalculations';
import { 
  Plus, 
  Search, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Printer, 
  DollarSign,
  Briefcase,
  X
} from 'lucide-react';

interface SalaryListProps {
  salaries: SalaryRecord[];
  firmProfile: FirmProfile;
  onAddSalary: () => void;
  onEditSalary: (salary: SalaryRecord) => void;
  onDeleteSalary: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const SalaryList: React.FC<SalaryListProps> = ({
  salaries,
  firmProfile,
  onAddSalary,
  onEditSalary,
  onDeleteSalary,
  onToggleStatus
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [slipModalSalary, setSlipModalSalary] = useState<SalaryRecord | null>(null);

  // Extract unique months from salary records
  const availableMonths = useMemo(() => {
    const months = Array.from(new Set(salaries.map(s => s.monthYear))).sort().reverse();
    return months;
  }, [salaries]);

  // Filtered salaries
  const filteredSalaries = useMemo(() => {
    return salaries.filter(s => {
      if (selectedMonth !== 'ALL' && s.monthYear !== selectedMonth) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.employeeName.toLowerCase().includes(q);
        const matchRole = s.role.toLowerCase().includes(q);
        const matchRef = s.transactionReference.toLowerCase().includes(q);
        return matchName || matchRole || matchRef;
      }
      return true;
    }).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [salaries, selectedMonth, searchQuery]);

  // Calculations
  const totalNetDisbursed = filteredSalaries.filter(s => s.paymentStatus === 'PAID').reduce((sum, s) => sum + s.netPaid, 0);
  const totalTdsWithheld = filteredSalaries.reduce((sum, s) => sum + s.tdsDeducted, 0);
  const totalGrossSalaries = filteredSalaries.reduce((sum, s) => sum + (s.basicSalary + s.allowances), 0);
  const pendingDisbursements = filteredSalaries.filter(s => s.paymentStatus === 'PENDING').reduce((sum, s) => sum + s.netPaid, 0);

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'Full-Time Staff';
      case 'PART_TIME': return 'Part-Time';
      case 'CONSULTANT': return 'Consultant Retainer';
      case 'INTERN_STIPEND': return 'Internship Stipend';
      case 'PARTNER_DRAW': return 'Partner Profit Draw';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Carbon Studio Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] text-[#ffffff] p-5 border border-[#393939]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#ff832b]"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8d8d8d]">Studio Payroll Ledger</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1 text-white">
            Salaries, Stipends & Consultant Retainers
          </h1>
          <p className="text-xs text-[#8d8d8d] mt-1 max-w-xl">
            Manage associate architects, BIM drafters, 3D visualizers, student interns stipends, TDS deductions (192/194J), and issue pay slips.
          </p>
        </div>
        <button
          id="btn-add-salary"
          onClick={onAddSalary}
          className="carbon-btn-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1 text-black" />
          <span>Disburse / Record Salary</span>
        </button>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#161616]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#525252]">Net Disbursed</span>
          <span className="text-xl font-black font-mono text-[#161616] mt-1 block">
            {formatCurrency(totalNetDisbursed)}
          </span>
          <span className="text-[10px] text-[#8d8d8d] font-mono mt-1 block">
            {filteredSalaries.filter(s => s.paymentStatus === 'PAID').length} Paid Team Members
          </span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#ff832b]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#b84300]">Total Gross Payroll</span>
          <span className="text-xl font-black font-mono text-[#ff832b] mt-1 block">
            {formatCurrency(totalGrossSalaries)}
          </span>
          <span className="text-[10px] text-[#525252] font-mono mt-1 block">Basic + Allowances</span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#525252]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#525252]">TDS Withheld (192/194J)</span>
          <span className="text-xl font-black font-mono text-[#161616] mt-1 block">
            {formatCurrency(totalTdsWithheld)}
          </span>
          <span className="text-[10px] text-[#8d8d8d] font-mono mt-1 block">Tax Deducted at Source</span>
        </div>

        <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#da1e28]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#da1e28]">Scheduled / Pending</span>
          <span className="text-xl font-black font-mono text-[#da1e28] mt-1 block">
            {formatCurrency(pendingDisbursements)}
          </span>
          <span className="text-[10px] text-[#da1e28] font-mono mt-1 block">
            {filteredSalaries.filter(s => s.paymentStatus === 'PENDING').length} Pending Payouts
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Month Selector */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-[#525252]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#525252]">Payroll Period:</span>
          <select
            id="salary-month-filter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white border border-[#8d8d8d] px-3 py-1.5 text-xs text-[#161616] outline-none focus:border-[#ff832b]"
          >
            <option value="ALL">All Payroll Months</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8d8d8d]" />
          <input
            type="text"
            id="salary-search-input"
            placeholder="Search architect name, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f4f4f4] border border-[#8d8d8d] pl-9 pr-3 py-1.5 text-xs text-[#161616] outline-none focus:border-[#ff832b] focus:bg-white"
          />
        </div>
      </div>

      {/* Salary Records Cards */}
      {filteredSalaries.length === 0 ? (
        <div className="bg-white p-12 text-center border border-[#e0e0e0]">
          <Users className="w-12 h-12 text-[#8d8d8d] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#161616]">No Payroll Records Found</h3>
          <p className="text-xs text-[#525252] mt-1 max-w-sm mx-auto">
            No salary records match your filter criteria. Record monthly disbursements for studio architects and staff.
          </p>
          <button
            onClick={onAddSalary}
            className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider mt-4 inline-flex items-center space-x-1"
          >
            <Plus className="w-4 h-4 mr-1 text-black" />
            <span>Record First Salary</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSalaries.map((sal) => (
            <div
              key={sal.id}
              id={`salary-card-${sal.id}`}
              className="bg-white border border-[#e0e0e0] hover:border-[#161616] transition-colors p-4"
            >
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f4f4f4]">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#161616] text-white border border-[#161616]">
                    Period: {sal.monthYear}
                  </span>
                  <span className="text-[10px] font-mono text-[#525252] bg-[#f4f4f4] px-2 py-0.5 border border-[#e0e0e0]">
                    {getEmploymentTypeLabel(sal.employmentType)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-[#525252]">Paid on: {formatDate(sal.paymentDate)}</span>
                  <button
                    id={`btn-toggle-salary-status-${sal.id}`}
                    onClick={() => onToggleStatus(sal.id)}
                    title="Click to toggle paid / pending status"
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center space-x-1 border cursor-pointer ${
                      sal.paymentStatus === 'PAID'
                        ? 'bg-[#defbe6] text-[#0f6225] border-[#24a148]'
                        : 'bg-[#fff1f1] text-[#da1e28] border-[#da1e28]'
                    }`}
                  >
                    {sal.paymentStatus === 'PAID' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        <span>Disbursed (PAID)</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Pending</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-bold text-[#161616]">
                      {sal.employeeName}
                    </h4>
                    <span className="text-xs text-[#525252] font-mono">({sal.role})</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#525252] pt-1">
                    <span>Basic: <strong>{formatCurrency(sal.basicSalary)}</strong></span>
                    {sal.allowances > 0 && <span>Allowances: +{formatCurrency(sal.allowances)}</span>}
                    {sal.deductions > 0 && <span>Deductions: -{formatCurrency(sal.deductions)}</span>}
                    {sal.tdsDeducted > 0 && (
                      <span className="text-[#b84300] font-semibold">TDS 192/194J: -{formatCurrency(sal.tdsDeducted)}</span>
                    )}
                    <span>Mode: {sal.paymentMethod}</span>
                    <span>Ref: {sal.transactionReference}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end md:space-x-4 border-t md:border-t-0 pt-2 md:pt-0 border-[#f4f4f4]">
                  <div className="text-right">
                    <span className="text-xs text-[#8d8d8d] uppercase tracking-wider block">Net Disbursed</span>
                    <span className="text-lg font-black font-mono text-[#ff832b]">
                      {formatCurrency(sal.netPaid)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      id={`btn-payslip-${sal.id}`}
                      onClick={() => setSlipModalSalary(sal)}
                      className="p-1.5 border border-[#8d8d8d] hover:bg-[#ff832b] hover:text-black text-[#161616] transition-colors"
                      title="View & Print Salary Pay Slip"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-edit-salary-${sal.id}`}
                      onClick={() => onEditSalary(sal)}
                      className="p-1.5 border border-[#8d8d8d] hover:bg-[#161616] hover:text-white text-[#161616] transition-colors"
                      title="Edit salary record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-delete-salary-${sal.id}`}
                      onClick={() => {
                        if (confirm('Delete this salary record?')) {
                          onDeleteSalary(sal.id);
                        }
                      }}
                      className="p-1.5 border border-[#da1e28] text-[#da1e28] hover:bg-[#da1e28] hover:text-white transition-colors"
                      title="Delete salary record"
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

      {/* Carbon Pay Slip Printable Modal */}
      {slipModalSalary && (
        <div id="payslip-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 overflow-y-auto">
          <div id="payslip-modal-container" className="w-full max-w-md bg-white text-black border border-[#393939] shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#525252]">Salary Disbursement Voucher</span>
                <h3 className="text-base font-bold text-[#161616]">{firmProfile.firmName}</h3>
              </div>
              <button
                onClick={() => setSlipModalSalary(null)}
                className="p-1 hover:bg-[#e0e0e0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Body */}
            <div className="space-y-4 text-xs font-mono">
              <div className="bg-[#f4f4f4] p-3 border border-[#e0e0e0] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#525252]">Employee / Architect:</span>
                  <span className="font-bold text-[#161616]">{slipModalSalary.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#525252]">Designation / Role:</span>
                  <span className="text-[#161616]">{slipModalSalary.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#525252]">Payroll Period:</span>
                  <span className="text-[#161616]">{slipModalSalary.monthYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#525252]">Payment Date:</span>
                  <span className="text-[#161616]">{formatDate(slipModalSalary.paymentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#525252]">Txn Reference:</span>
                  <span className="text-[#161616]">{slipModalSalary.transactionReference}</span>
                </div>
              </div>

              {/* Earnings Table */}
              <table className="w-full text-xs border border-[#e0e0e0]">
                <thead>
                  <tr className="bg-[#161616] text-white">
                    <th className="p-2 text-left font-bold uppercase">Item Particulars</th>
                    <th className="p-2 text-right font-bold uppercase">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  <tr>
                    <td className="p-2">Basic Salary / Stipend</td>
                    <td className="p-2 text-right font-bold">{formatCurrency(slipModalSalary.basicSalary)}</td>
                  </tr>
                  {slipModalSalary.allowances > 0 && (
                    <tr>
                      <td className="p-2">Allowances / Special Pay</td>
                      <td className="p-2 text-right">+{formatCurrency(slipModalSalary.allowances)}</td>
                    </tr>
                  )}
                  {slipModalSalary.deductions > 0 && (
                    <tr>
                      <td className="p-2">Professional Tax / Deductions</td>
                      <td className="p-2 text-right text-[#da1e28]">-{formatCurrency(slipModalSalary.deductions)}</td>
                    </tr>
                  )}
                  {slipModalSalary.tdsDeducted > 0 && (
                    <tr>
                      <td className="p-2">TDS Withheld (192 / 194J)</td>
                      <td className="p-2 text-right text-[#da1e28]">-{formatCurrency(slipModalSalary.tdsDeducted)}</td>
                    </tr>
                  )}
                  <tr className="bg-[#fff4eb] border-t-2 border-[#ff832b]">
                    <td className="p-2 font-bold text-black uppercase">Net Salary Disbursed</td>
                    <td className="p-2 text-right font-bold text-[#ff832b] text-sm">
                      {formatCurrency(slipModalSalary.netPaid)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 flex justify-between items-end text-[10px] text-[#525252]">
                <div>
                  <p>Prepared By: Accounts</p>
                  <p className="mt-4 border-t border-[#8d8d8d] pt-1">Authorized Signatory</p>
                </div>
                <div className="text-right">
                  <p>Received By:</p>
                  <p className="mt-4 border-t border-[#8d8d8d] pt-1">{slipModalSalary.employeeName}</p>
                </div>
              </div>
            </div>

            {/* Print button */}
            <div className="mt-6 pt-3 border-t border-[#e0e0e0] flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
              >
                <Printer className="w-4 h-4 mr-1 text-black" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
