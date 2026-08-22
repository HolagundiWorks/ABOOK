import React, { useState } from 'react';
import { 
  PaymentReminder, 
  Invoice, 
  FirmProfile, 
  SiteInspectionLog 
} from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { PaymentReminderModal } from './PaymentReminderModal';
import { FormalReminderLetterView } from './FormalReminderLetterView';
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Receipt, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Send, 
  FileText, 
  Share2, 
  Calendar, 
  User, 
  Building2, 
  Trash2, 
  Edit, 
  ExternalLink,
  DollarSign,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface PaymentRemindersListProps {
  reminders: PaymentReminder[];
  invoices: Invoice[];
  firmProfile: FirmProfile;
  siteUpdates: SiteInspectionLog[];
  onSaveReminder: (reminder: PaymentReminder) => void;
  onDeleteReminder: (id: string) => void;
  onRecordPaymentForInvoice?: (invoice: Invoice) => void;
}

export const PaymentRemindersList: React.FC<PaymentRemindersListProps> = ({
  reminders,
  invoices,
  firmProfile,
  siteUpdates,
  onSaveReminder,
  onDeleteReminder,
  onRecordPaymentForInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'OVERDUE_INVOICES' | 'REMINDER_HISTORY'>('OVERDUE_INVOICES');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [selectedInvoiceForReminder, setSelectedInvoiceForReminder] = useState<Invoice | null>(null);
  const [editingReminder, setEditingReminder] = useState<PaymentReminder | null>(null);
  const [viewingFormalLetter, setViewingFormalLetter] = useState<PaymentReminder | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Unpaid or partially paid invoices
  const unpaidInvoices = invoices.filter((i) => i.status !== 'PAID');
  
  // Calculate Aging Metrics
  const today = new Date();
  const totalOutstanding = unpaidInvoices.reduce((acc, i) => acc + (i.balanceDue ?? i.totalAmount), 0);
  
  const overdueInvoices = unpaidInvoices.filter((i) => {
    const due = new Date(i.dueDate);
    return due < today;
  });

  const criticalOverdueCount = overdueInvoices.filter((i) => {
    const diffDays = Math.floor((today.getTime() - new Date(i.dueDate).getTime()) / (1000 * 3600 * 24));
    return diffDays > 30;
  }).length;

  const totalRemindersDispatched = reminders.length;

  // Filtered lists
  const filteredUnpaidInvoices = unpaidInvoices.filter((i) =>
    i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReminders = reminders.filter((r) =>
    r.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComposeNew = (inv?: Invoice) => {
    setSelectedInvoiceForReminder(inv || null);
    setEditingReminder(null);
    setIsComposeModalOpen(true);
  };

  const handleEditReminder = (rem: PaymentReminder) => {
    setEditingReminder(rem);
    setSelectedInvoiceForReminder(null);
    setIsComposeModalOpen(true);
  };

  const handleQuickCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getDaysOverdue = (dueDateStr: string): number => {
    const due = new Date(dueDateStr);
    const diffTime = today.getTime() - due.getTime();
    return Math.floor(diffTime / (1000 * 3600 * 24));
  };

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'WHATSAPP':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#defbe6] text-[#0e6027] border border-[#6fdd8b]">
            <MessageSquare className="w-3 h-3 mr-1" />
            WhatsApp
          </span>
        );
      case 'EMAIL':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#edf5ff] text-[#0043ce] border border-[#a6c8ff]">
            <Mail className="w-3 h-3 mr-1" />
            Email
          </span>
        );
      case 'FORMAL_LETTER':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#fff1f1] text-[#da1e28] border border-[#ff8389]">
            <FileText className="w-3 h-3 mr-1" />
            Formal Notice
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#f4f4f4] text-[#525252] border border-[#e0e0e0]">
            <Send className="w-3 h-3 mr-1" />
            SMS
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-[#0f62fe] bg-[#edf5ff] px-2 py-0.5 font-bold uppercase border border-[#a6c8ff]">
              STEP 3.5 • FEE RECOVERY & BILLING REMINDERS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#161616] mt-1">
            Payment Reminders & Outstanding Fee Aging
          </h2>
          <p className="text-xs text-[#525252] mt-0.5">
            Automate payment follow-ups, dispatch WhatsApp & Email reminders linked to site milestones, and generate formal Council of Architecture statutory demand notices.
          </p>
        </div>

        <button
          onClick={() => handleComposeNew()}
          id="send-payment-reminder-btn"
          className="carbon-btn-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shrink-0 self-start sm:self-auto shadow-sm"
        >
          <Bell className="w-4 h-4" />
          <span>Dispatch Reminder</span>
        </button>
      </div>

      {/* Aging KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#fff1f1] border border-[#ff8389] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#da1e28] block">
              TOTAL OVERDUE BALANCE
            </span>
            <span className="text-2xl font-mono font-bold text-[#da1e28]">
              {formatINR(totalOutstanding)}
            </span>
            <span className="text-[10px] text-[#da1e28] block font-mono">
              {unpaidInvoices.length} Unpaid Invoices
            </span>
          </div>
          <div className="p-2.5 bg-[#da1e28] text-white">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white border border-[#e0e0e0] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#8d8d8d] block">
              PAST DUE INVOICES
            </span>
            <span className="text-2xl font-mono font-bold text-[#161616]">
              {overdueInvoices.length}
            </span>
            <span className="text-[10px] text-[#525252] block">Beyond agreed credit term</span>
          </div>
          <div className="p-2.5 bg-[#f4f4f4] text-[#161616]">
            <Clock className="w-5 h-5 text-[#f1c21b]" />
          </div>
        </div>

        <div className="p-3.5 bg-[#edf5ff] border border-[#a6c8ff] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#0043ce] block">
              CRITICAL OVERDUE (&gt;30D)
            </span>
            <span className="text-2xl font-mono font-bold text-[#0043ce]">
              {criticalOverdueCount}
            </span>
            <span className="text-[10px] text-[#0043ce] block font-mono">
              18% CoA Interest Applicable
            </span>
          </div>
          <div className="p-2.5 bg-[#0f62fe] text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white border border-[#e0e0e0] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#24a148] block">
              FOLLOW-UPS DISPATCHED
            </span>
            <span className="text-2xl font-mono font-bold text-[#24a148]">
              {totalRemindersDispatched}
            </span>
            <span className="text-[10px] text-[#525252] block">Across all channels</span>
          </div>
          <div className="p-2.5 bg-[#defbe6] text-[#24a148]">
            <Send className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-[#e0e0e0] bg-[#f4f4f4]">
        <button
          onClick={() => setActiveTab('OVERDUE_INVOICES')}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase transition-colors flex items-center space-x-2 border-r border-[#e0e0e0] ${
            activeTab === 'OVERDUE_INVOICES'
              ? 'bg-white text-[#0f62fe] border-t-2 border-t-[#0f62fe] -mb-px'
              : 'text-[#525252] hover:text-[#161616] hover:bg-[#e8e8e8]'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Outstanding Invoices ({unpaidInvoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REMINDER_HISTORY')}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase transition-colors flex items-center space-x-2 border-r border-[#e0e0e0] ${
            activeTab === 'REMINDER_HISTORY'
              ? 'bg-white text-[#0f62fe] border-t-2 border-t-[#0f62fe] -mb-px'
              : 'text-[#525252] hover:text-[#161616] hover:bg-[#e8e8e8]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Reminder History ({reminders.length})</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8d8d8d] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice #, client, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="carbon-input w-full pl-8 py-1.5 text-xs bg-white"
          />
        </div>
      </div>

      {/* Tab 1: Outstanding Invoices */}
      {activeTab === 'OVERDUE_INVOICES' && (
        <div className="space-y-4">
          {filteredUnpaidInvoices.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#e0e0e0] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#24a148] mx-auto" />
              <h3 className="text-base font-bold text-[#161616] uppercase">No Outstanding Invoices</h3>
              <p className="text-xs text-[#525252]">All client invoices are fully paid and up to date.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#e0e0e0] overflow-x-auto shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#161616] text-white font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Client & Project</th>
                    <th className="p-3">Due Date & Aging</th>
                    <th className="p-3 text-right">Total Fee</th>
                    <th className="p-3 text-right">Balance Due</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {filteredUnpaidInvoices.map((inv) => {
                    const daysOverdue = getDaysOverdue(inv.dueDate);
                    const isPastDue = daysOverdue > 0;
                    const balance = inv.balanceDue ?? inv.totalAmount;
                    const linkedReminders = reminders.filter((r) => r.invoiceId === inv.id);

                    return (
                      <tr key={inv.id} className="hover:bg-[#fcfcfc] transition-colors">
                        <td className="p-3 font-mono font-bold text-[#0f62fe] whitespace-nowrap">
                          {inv.invoiceNumber}
                          <span className="block text-[10px] text-[#525252] font-normal">
                            {new Date(inv.invoiceDate).toLocaleDateString('en-IN')}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="font-bold text-[#161616] block">{inv.client.name}</span>
                          <span className="text-[#525252] text-[11px] block truncate max-w-xs">{inv.projectTitle}</span>
                        </td>

                        <td className="p-3 whitespace-nowrap">
                          <span className={`font-mono font-bold block ${isPastDue ? 'text-[#da1e28]' : 'text-[#161616]'}`}>
                            {new Date(inv.dueDate).toLocaleDateString('en-IN')}
                          </span>
                          {isPastDue ? (
                            <span className="inline-flex items-center text-[10px] font-mono font-bold text-[#da1e28] bg-[#fff1f1] px-1 py-0.5 border border-[#ff8389]">
                              <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                              {daysOverdue} Days Overdue
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-[#24a148]">Within credit period</span>
                          )}
                        </td>

                        <td className="p-3 text-right font-mono font-medium text-[#525252] whitespace-nowrap">
                          {formatINR(inv.totalAmount)}
                        </td>

                        <td className="p-3 text-right font-mono font-bold text-sm text-[#da1e28] whitespace-nowrap">
                          {formatINR(balance)}
                        </td>

                        <td className="p-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                              inv.status === 'OVERDUE'
                                ? 'bg-[#fff1f1] text-[#da1e28] border border-[#ff8389]'
                                : inv.status === 'PARTIALLY_PAID'
                                ? 'bg-[#edf5ff] text-[#0043ce] border border-[#a6c8ff]'
                                : 'bg-[#f4f4f4] text-[#525252] border border-[#e0e0e0]'
                            }`}
                          >
                            {inv.status.replace('_', ' ')}
                          </span>
                          {linkedReminders.length > 0 && (
                            <span className="block text-[10px] font-mono text-[#525252] mt-0.5">
                              {linkedReminders.length} reminder{linkedReminders.length > 1 ? 's' : ''} sent
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleComposeNew(inv)}
                              title="Send Reminder"
                              className="inline-flex items-center px-2.5 py-1 bg-[#0f62fe] hover:bg-[#0043ce] text-white font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                            >
                              <Bell className="w-3.5 h-3.5 mr-1" />
                              <span>Remind</span>
                            </button>

                            {onRecordPaymentForInvoice && (
                              <button
                                onClick={() => onRecordPaymentForInvoice(inv)}
                                title="Record Received Payment"
                                className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-[#defbe6] text-[#0e6027] border border-[#6fdd8b] font-bold text-[11px] uppercase tracking-wider transition-colors"
                              >
                                <span>Record Paid</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reminder Log History */}
      {activeTab === 'REMINDER_HISTORY' && (
        <div className="space-y-4">
          {filteredReminders.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#e0e0e0] space-y-3">
              <Bell className="w-8 h-8 text-[#8d8d8d] mx-auto" />
              <h3 className="text-base font-bold text-[#161616] uppercase">No Reminders Dispatched Yet</h3>
              <p className="text-xs text-[#525252] max-w-md mx-auto">
                Send payment reminders to clients via WhatsApp, Email, or printable formal Council of Architecture statutory demand notices.
              </p>
              <button
                onClick={() => handleComposeNew()}
                className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase"
              >
                Compose First Reminder
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredReminders.map((rem) => {
                const isCopied = copiedId === rem.id;

                return (
                  <div
                    key={rem.id}
                    className="bg-white border border-[#e0e0e0] hover:border-[#161616] transition-all flex flex-col justify-between shadow-xs"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-[#e0e0e0] space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-[#0f62fe] bg-[#edf5ff] px-1.5 py-0.5 border border-[#a6c8ff]">
                              {rem.invoiceNumber}
                            </span>
                            {getChannelBadge(rem.channel)}
                          </div>
                          <h3 className="text-sm font-bold text-[#161616] mt-1.5 leading-snug">
                            {rem.clientName}
                          </h3>
                          <p className="text-xs text-[#525252] truncate">{rem.projectTitle}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-sm text-[#da1e28] block">
                            {formatINR(rem.balanceDue)}
                          </span>
                          <span className="text-[10px] font-mono text-[#8d8d8d] block">
                            Due: {new Date(rem.dueDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Body Preview */}
                    <div className="p-4 bg-[#fcfcfc] space-y-3 flex-1 text-xs">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-[#8d8d8d] block">Subject:</span>
                        <p className="font-bold text-[#161616] text-[11px] truncate">{rem.subject}</p>
                      </div>

                      <div className="p-2.5 bg-white border border-[#e0e0e0] text-[#525252] font-mono text-[11px] whitespace-pre-line line-clamp-4 leading-relaxed">
                        {rem.messageBody}
                      </div>

                      {rem.scheduledNextFollowUpDate && (
                        <div className="flex items-center justify-between text-[11px] p-2 bg-[#edf5ff] border border-[#a6c8ff]">
                          <span className="text-[#0043ce] font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Next Follow-up Scheduled:</span>
                          </span>
                          <span className="font-mono font-bold text-[#0043ce]">
                            {new Date(rem.scheduledNextFollowUpDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      )}

                      {rem.notes && (
                        <p className="text-[11px] text-[#525252] italic bg-[#f4f4f4] p-1.5 border border-[#e0e0e0]">
                          Log Note: {rem.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions Footer */}
                    <div className="p-3 bg-[#f4f4f4] border-t border-[#e0e0e0] flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center space-x-1.5">
                        {/* Copy Message */}
                        <button
                          onClick={() => handleQuickCopy(rem.id, rem.messageBody)}
                          className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-[#e8e8e8] text-[#525252] border border-[#e0e0e0] font-bold text-[11px] uppercase tracking-wider transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-[#24a148]" />
                              <span className="text-[#24a148]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {/* View Formal Notice */}
                        <button
                          onClick={() => setViewingFormalLetter(rem)}
                          className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-[#fff1f1] text-[#da1e28] border border-[#ff8389] font-bold text-[11px] uppercase tracking-wider transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          <span>Formal Letter</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleEditReminder(rem)}
                          className="p-1.5 text-[#525252] hover:text-[#161616] hover:bg-[#e0e0e0] transition-colors"
                          title="Edit Reminder"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete reminder for invoice ${rem.invoiceNumber}?`)) {
                              onDeleteReminder(rem.id);
                            }
                          }}
                          className="p-1.5 text-[#8d8d8d] hover:text-[#da1e28] hover:bg-[#fff1f1] transition-colors"
                          title="Delete Reminder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Compose / Edit Modal */}
      {isComposeModalOpen && (
        <PaymentReminderModal
          isOpen={isComposeModalOpen}
          onClose={() => {
            setIsComposeModalOpen(false);
            setEditingReminder(null);
            setSelectedInvoiceForReminder(null);
          }}
          onSave={(rem) => {
            onSaveReminder(rem);
            setIsComposeModalOpen(false);
            setEditingReminder(null);
            setSelectedInvoiceForReminder(null);
          }}
          preSelectedInvoice={selectedInvoiceForReminder}
          invoices={invoices}
          firmProfile={firmProfile}
          editingReminder={editingReminder}
        />
      )}

      {/* Formal Letter Modal */}
      {viewingFormalLetter && (
        <FormalReminderLetterView
          reminder={viewingFormalLetter}
          firmProfile={firmProfile}
          invoice={invoices.find((i) => i.id === viewingFormalLetter.invoiceId)}
          onClose={() => setViewingFormalLetter(null)}
          onPrint={() => window.print()}
        />
      )}

    </div>
  );
};
