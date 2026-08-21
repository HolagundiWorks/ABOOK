import React, { useState } from 'react';
import { Invoice, PaymentRecord, FirmProfile, FinancialSummary, ExpenseItem, SalaryRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils/taxCalculations';
import { GstLedgerView } from './GstLedgerView';
import { 
  BookOpenCheck, 
  Download, 
  Printer, 
  ShieldCheck, 
  TrendingUp, 
  FileCheck2, 
  ReceiptText,
  DollarSign,
  Users,
  Briefcase,
  Layers,
  Building2,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

interface BooksDashboardProps {
  invoices: Invoice[];
  payments: PaymentRecord[];
  firmProfile: FirmProfile;
  summary: FinancialSummary;
  expenses?: ExpenseItem[];
  salaries?: SalaryRecord[];
}

export const BooksDashboard: React.FC<BooksDashboardProps> = ({
  invoices,
  payments,
  firmProfile,
  summary,
  expenses = [],
  salaries = []
}) => {
  const [subTab, setSubTab] = useState<'overview' | 'profit_loss' | 'gst_ledger'>('overview');

  // Client-wise aggregation
  const clientMap = new Map<string, {
    clientName: string;
    organization?: string;
    totalBilled: number;
    totalPaid: number;
    totalTds: number;
    balanceDue: number;
    invoicesCount: number;
  }>();

  (invoices || []).forEach((inv) => {
    const clientName = inv.client?.name || 'Unknown Client';
    const key = clientName.toLowerCase().trim();
    const existing = clientMap.get(key) || {
      clientName: clientName,
      organization: inv.client?.organization,
      totalBilled: 0,
      totalPaid: 0,
      totalTds: 0,
      balanceDue: 0,
      invoicesCount: 0
    };

    existing.totalBilled += inv.totalAmount || 0;
    existing.totalPaid += inv.paidAmount || 0;
    existing.totalTds += inv.tdsDeducted || 0;
    existing.balanceDue += inv.balanceDue || 0;
    existing.invoicesCount += 1;

    clientMap.set(key, existing);
  });

  const clientStats = Array.from(clientMap.values()).sort((a, b) => b.totalBilled - a.totalBilled);

  // Expense calculations
  const totalExpenses = summary?.totalExpenses || 0;
  const billableExpenses = summary?.totalBillableExpenses || 0;
  const nonBillableExpenses = summary?.totalNonBillableExpenses || 0;
  const unbilledReimbursables = summary?.totalUnbilledExpenses || 0;
  const totalSalaries = summary?.totalSalariesPaid || 0;
  const netOperatingProfit = summary?.netStudioOperatingProfit ?? ((summary?.totalCollectedNet || 0) - totalExpenses - totalSalaries);

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = ['Receipt #', 'Date', 'Invoice #', 'Project', 'Client', 'Payment Mode', 'Ref / UTR', 'Net Received (INR)', 'TDS (194J) (INR)', 'Gross Settled (INR)'];
    const rows = (payments || []).map((p) => [
      p.receiptNumber,
      p.paymentDate,
      p.invoiceNumber,
      `"${(p.projectTitle || '').replace(/"/g, '""')}"`,
      `"${(p.clientName || '').replace(/"/g, '""')}"`,
      p.paymentMethod,
      `"${(p.transactionReference || '').replace(/"/g, '""')}"`,
      p.netAmountReceived,
      p.tdsDeducted,
      p.grossAmountSettled
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Studio_Books_Accounts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tab Switcher (Carbon tabs) */}
      <div className="flex border-b border-[#e0e0e0] bg-white">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            subTab === 'overview'
              ? 'bg-[#f4f4f4] text-[#161616] border-[#ff832b]'
              : 'text-[#525252] border-transparent hover:text-[#161616]'
          }`}
        >
          <BookOpenCheck className="w-4 h-4 text-[#ff832b]" />
          <span>Income & Financial Books</span>
        </button>

        <button
          onClick={() => setSubTab('profit_loss')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            subTab === 'profit_loss'
              ? 'bg-[#f4f4f4] text-[#161616] border-[#ff832b]'
              : 'text-[#525252] border-transparent hover:text-[#161616]'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#ff832b]" />
          <span>Studio P&L & Cash Flow</span>
        </button>

        <button
          onClick={() => setSubTab('gst_ledger')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            subTab === 'gst_ledger'
              ? 'bg-[#f4f4f4] text-[#161616] border-[#ff832b]'
              : 'text-[#525252] border-transparent hover:text-[#161616]'
          }`}
        >
          <ReceiptText className="w-4 h-4 text-[#ff832b]" />
          <span>GST Returns & Tax Ledger</span>
        </button>
      </div>

      {subTab === 'gst_ledger' ? (
        <GstLedgerView invoices={invoices} firmProfile={firmProfile} />
      ) : subTab === 'profit_loss' ? (
        /* Studio Profit & Loss View */
        <div className="space-y-6">
          {/* P&L Header */}
          <div className="bg-[#161616] text-white p-5 border border-[#393939] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#ff832b]"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#8d8d8d]">Financial Health & Operations</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-1 text-white">Studio Profit & Loss Statement</h2>
              <p className="text-xs text-[#8d8d8d] mt-1">
                Realized fee income, client reimbursables, studio overheads, team payroll, and operating margin.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0 self-start sm:self-auto"
            >
              <Printer className="w-4 h-4 mr-1 text-black" />
              <span>Print P&L</span>
            </button>
          </div>

          {/* Profit Summary Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#24a148]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0f6225]">Realized Fee Revenue</span>
              <span className="text-2xl font-black font-mono text-[#0f6225] mt-1 block">
                {formatCurrency(summary.totalCollectedNet)}
              </span>
              <span className="text-[10px] text-[#525252] font-mono mt-1 block">
                + {formatCurrency(summary.totalTdsDeducted)} TDS Withheld (194J)
              </span>
            </div>

            <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#da1e28]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#da1e28]">Total Studio Outflow</span>
              <span className="text-2xl font-black font-mono text-[#da1e28] mt-1 block">
                {formatCurrency(totalExpenses + totalSalaries)}
              </span>
              <span className="text-[10px] text-[#525252] font-mono mt-1 block">
                Expenses ({formatCurrency(totalExpenses)}) + Payroll ({formatCurrency(totalSalaries)})
              </span>
            </div>

            <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#ff832b]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#b84300]">Net Studio Operating Margin</span>
              <span className="text-2xl font-black font-mono text-[#ff832b] mt-1 block">
                {formatCurrency(netOperatingProfit)}
              </span>
              <span className="text-[10px] text-[#161616] font-mono mt-1 block font-bold">
                {summary.totalCollectedNet > 0 
                  ? `${((netOperatingProfit / summary.totalCollectedNet) * 100).toFixed(1)}% Operating Profit Margin`
                  : '0.0% Margin'}
              </span>
            </div>
          </div>

          {/* Detailed Statement Table */}
          <div className="bg-white border border-[#e0e0e0]">
            <div className="p-4 bg-[#161616] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider">Statement of Financial Operations</h3>
              <span className="text-xs font-mono text-[#ff832b]">{firmProfile.firmName}</span>
            </div>

            <table className="w-full text-xs font-mono">
              <tbody className="divide-y divide-[#e0e0e0]">
                {/* 1. Inflow Section */}
                <tr className="bg-[#f4f4f4] font-bold text-black font-sans">
                  <td colSpan={2} className="p-3 uppercase tracking-wider text-xs">1. Inflows & Realized Revenue</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans">Gross Milestone Architectural Fee Invoiced</td>
                  <td className="p-3 text-right font-bold">{formatCurrency(summary.totalFeeInvoiced)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans">Net Cash Realized & Credited to Bank</td>
                  <td className="p-3 text-right font-bold text-[#0f6225]">+{formatCurrency(summary.totalCollectedNet)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans">Section 194J TDS Deducted by Clients (Form 26AS Asset)</td>
                  <td className="p-3 text-right text-[#b84300]">+{formatCurrency(summary.totalTdsDeducted)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-[#525252]">Outstanding Uncollected Invoiced Client Balance</td>
                  <td className="p-3 text-right text-[#8d8d8d]">{formatCurrency(summary.totalOutstandingBalance)}</td>
                </tr>

                {/* 2. Expenses Section */}
                <tr className="bg-[#f4f4f4] font-bold text-black font-sans">
                  <td colSpan={2} className="p-3 uppercase tracking-wider text-xs">2. Studio Operational Expenses & Reimbursables</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans">Billable Client Reimbursables (Site travel, blueprints, municipal liaising)</td>
                  <td className="p-3 text-right text-[#da1e28]">-{formatCurrency(billableExpenses)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans">Non-Billable Studio Overheads (Software CAD/BIM licenses, rent, utilities)</td>
                  <td className="p-3 text-right text-[#da1e28]">-{formatCurrency(nonBillableExpenses)}</td>
                </tr>
                {unbilledReimbursables > 0 && (
                  <tr className="bg-[#fff4eb]">
                    <td className="p-3 font-sans text-[#b84300] font-bold">Unbilled Reimbursables (Pending invoice addition to client)</td>
                    <td className="p-3 text-right text-[#b84300] font-bold">{formatCurrency(unbilledReimbursables)}</td>
                  </tr>
                )}

                {/* 3. Payroll Section */}
                <tr className="bg-[#f4f4f4] font-bold text-black font-sans">
                  <td colSpan={2} className="p-3 uppercase tracking-wider text-xs">3. Team Salaries, Stipends & Consultant Fees</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans">Associate Architects & Draftsmen Salaries Paid</td>
                  <td className="p-3 text-right text-[#da1e28]">-{formatCurrency(totalSalaries)}</td>
                </tr>

                {/* Bottom Line */}
                <tr className="bg-[#161616] text-white font-bold text-sm">
                  <td className="p-4 font-sans uppercase">Net Retained Studio Operating Profit (P&L)</td>
                  <td className="p-4 text-right font-mono text-[#ff832b] text-base">
                    {formatCurrency(netOperatingProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Overview Sub-Tab */
        <>
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#161616] text-white p-5 border border-[#393939]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#ff832b]"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#8d8d8d]">
                  Income Books • Professional Architectural Practice
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-1 text-white">Books of Accounts & Fee Ledger</h2>
              <p className="text-xs text-[#8d8d8d] mt-1 max-w-xl">
                Receipt vouchers, bank credits, Section 194J TDS deductions, and client balance recovery.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0 pt-2 md:pt-0">
              <button
                id="books-export-csv-btn"
                onClick={handleExportCSV}
                className="carbon-btn-secondary px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>CSV</span>
              </button>

              <button
                id="books-print-btn"
                onClick={() => window.print()}
                className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5 mr-1 text-black" />
                <span>Print Ledger</span>
              </button>
            </div>
          </div>

          {/* Primary KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#161616]">
              <span className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">
                Total Invoiced
              </span>
              <p className="text-xl font-black text-[#161616] mt-1 font-mono">
                {formatCurrency(summary.totalFeeInvoiced)}
              </p>
              <span className="text-[10px] text-[#8d8d8d] font-mono block mt-1">
                {summary.invoicesCount} active milestone invoices
              </span>
            </div>

            <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#24a148]">
              <span className="text-[11px] font-bold text-[#0f6225] uppercase tracking-wider block">
                Net Bank Realized
              </span>
              <p className="text-xl font-black text-[#0f6225] mt-1 font-mono">
                {formatCurrency(summary.totalCollectedNet)}
              </p>
              <span className="text-[10px] text-[#0f6225] font-mono block mt-1">
                Net credited to firm bank account
              </span>
            </div>

            <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#ff832b]">
              <span className="text-[11px] font-bold text-[#b84300] uppercase tracking-wider block">
                TDS (194J) Credits
              </span>
              <p className="text-xl font-black text-[#ff832b] mt-1 font-mono">
                {formatCurrency(summary.totalTdsDeducted)}
              </p>
              <span className="text-[10px] text-[#525252] font-mono block mt-1">
                Form 26AS tax offset credits
              </span>
            </div>

            <div className="bg-white p-4 border border-[#e0e0e0] border-t-2 border-t-[#da1e28]">
              <span className="text-[11px] font-bold text-[#da1e28] uppercase tracking-wider block">
                Outstanding Dues
              </span>
              <p className="text-xl font-black text-[#da1e28] mt-1 font-mono">
                {formatCurrency(summary.totalOutstandingBalance)}
              </p>
              <span className="text-[10px] text-[#da1e28] font-mono block mt-1">
                Pending client fee recovery
              </span>
            </div>
          </div>

          {/* Tax Compliance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-[#e0e0e0] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#f4f4f4]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                    Regular GST (18%)
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#ff832b]" />
                </div>
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold text-[#8d8d8d] uppercase tracking-wider block">
                    Output GST Liability
                  </span>
                  <span className="text-xl font-black font-mono text-[#161616] block">
                    {formatCurrency(summary.totalRegularGstInvoiced)}
                  </span>
                  <p className="text-xs text-[#525252] pt-1">
                    GSTR-1 return filing & GSTR-3B tax payment.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e0e0e0] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#f4f4f4]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                    Composition (6%)
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#ff832b]" />
                </div>
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold text-[#8d8d8d] uppercase tracking-wider block">
                    Section 10(2A) Estimate
                  </span>
                  <span className="text-xl font-black font-mono text-[#161616] block">
                    {formatCurrency(summary.totalCompositionTaxInvoiced)}
                  </span>
                  <p className="text-xs text-[#525252] pt-1">
                    Quarterly CMP-08 tax challan discharge.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e0e0e0] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#f4f4f4]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                    Sec 194J TDS Ledger
                  </span>
                  <FileCheck2 className="w-4 h-4 text-[#ff832b]" />
                </div>
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold text-[#8d8d8d] uppercase tracking-wider block">
                    Total TDS Deducted
                  </span>
                  <span className="text-xl font-black font-mono text-[#161616] block">
                    {formatCurrency(summary.totalTdsDeducted)}
                  </span>
                  <p className="text-xs text-[#525252] pt-1">
                    Form 16A certificates for ITR offset.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Client-Wise Account Summary */}
          <div className="bg-white border border-[#e0e0e0]">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#161616]">
                  Client-Wise Fee & Recovery Performance
                </h3>
                <p className="text-xs text-[#525252]">
                  Fee billed, payments received, and pending balances by client
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161616] text-white font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4 text-right">Billed</th>
                    <th className="py-3 px-4 text-right">Paid</th>
                    <th className="py-3 px-4 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0] bg-white">
                  {clientStats.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[#f4f4f4] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#161616] block">{c.clientName}</span>
                        {c.organization && (
                          <span className="text-[10px] text-[#8d8d8d] block font-mono">{c.organization}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-[#161616]">
                        {formatCurrency(c.totalBilled)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#0f6225]">
                        {formatCurrency(c.totalPaid)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={c.balanceDue > 0 ? 'text-[#da1e28]' : 'text-[#0f6225]'}>
                          {formatCurrency(c.balanceDue)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
