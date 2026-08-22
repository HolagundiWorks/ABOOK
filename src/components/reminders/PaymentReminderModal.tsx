import React, { useState, useEffect } from 'react';
import { 
  PaymentReminder, 
  Invoice, 
  FirmProfile, 
  SiteInspectionLog 
} from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { 
  X, 
  Bell, 
  Send, 
  Share2, 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  FileText, 
  Building2, 
  Calendar, 
  AlertTriangle,
  Receipt,
  FileCheck
} from 'lucide-react';

interface PaymentReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: PaymentReminder) => void;
  preSelectedInvoice?: Invoice | null;
  preSelectedSiteUpdate?: SiteInspectionLog | null;
  invoices: Invoice[];
  firmProfile: FirmProfile;
  editingReminder?: PaymentReminder | null;
}

type ReminderTemplateType = 
  | 'MILESTONE_SITE_COMPLETION' 
  | 'GENTLE_DUE_NOTICE' 
  | 'OVERDUE_ALERT' 
  | 'FORMAL_COA_DEMAND'
  | 'WHATSAPP_SHORT';

export const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  preSelectedInvoice,
  preSelectedSiteUpdate,
  invoices,
  firmProfile,
  editingReminder
}) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<ReminderTemplateType>('OVERDUE_ALERT');
  const [channel, setChannel] = useState<'WHATSAPP' | 'EMAIL' | 'SMS' | 'FORMAL_LETTER'>('WHATSAPP');
  const [subject, setSubject] = useState<string>('');
  const [messageBody, setMessageBody] = useState<string>('');
  const [scheduledNextDate, setScheduledNextDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Derive current invoice
  const currentInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || preSelectedInvoice || invoices[0];

  useEffect(() => {
    if (editingReminder) {
      setSelectedInvoiceId(editingReminder.invoiceId);
      setChannel(editingReminder.channel);
      setSubject(editingReminder.subject);
      setMessageBody(editingReminder.messageBody);
      setScheduledNextDate(editingReminder.scheduledNextFollowUpDate || '');
      setNotes(editingReminder.notes || '');
    } else if (preSelectedInvoice) {
      setSelectedInvoiceId(preSelectedInvoice.id);
      generateTemplateMessage(preSelectedInvoice, selectedTemplate);
    } else if (preSelectedSiteUpdate) {
      // Find matching invoice or first unpaid
      const matchInv = invoices.find((i) => i.id === preSelectedSiteUpdate.linkedInvoiceId) || invoices[0];
      if (matchInv) {
        setSelectedInvoiceId(matchInv.id);
        setSelectedTemplate('MILESTONE_SITE_COMPLETION');
        generateTemplateMessage(matchInv, 'MILESTONE_SITE_COMPLETION', preSelectedSiteUpdate);
      }
    } else if (invoices.length > 0) {
      setSelectedInvoiceId(invoices[0].id);
      generateTemplateMessage(invoices[0], selectedTemplate);
    }
  }, [editingReminder, preSelectedInvoice, preSelectedSiteUpdate, isOpen]);

  const generateTemplateMessage = (
    inv: Invoice, 
    template: ReminderTemplateType, 
    siteUpdate?: SiteInspectionLog | null
  ) => {
    if (!inv) return;
    const clientName = inv.client.name;
    const invNum = inv.invoiceNumber;
    const amountDue = formatINR(inv.balanceDue || inv.totalAmount);
    const dueDateStr = new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const project = inv.projectTitle;

    let sub = '';
    let body = '';

    switch (template) {
      case 'MILESTONE_SITE_COMPLETION':
        sub = `Stage Completion & Fee Milestone Notice - ${project} (${invNum})`;
        body = `Dear ${clientName},\n\nWe are pleased to inform you that our architectural site inspection and quality audit for the latest construction milestone at "${project}" has been successfully completed and certified in accordance with Council of Architecture standards.\n\nAccordingly, Tax Invoice ${invNum} for ${amountDue} is due on ${dueDateStr}.\n\nPlease find our bank transfer details below for payment processing:\n• Account: ${firmProfile.accountHolderName || firmProfile.firmName}\n• Bank: ${firmProfile.bankName} (A/C: ${firmProfile.accountNumber})\n• IFSC: ${firmProfile.ifscCode}\n• UPI VPA: ${firmProfile.upiId}\n\nWe appreciate your partnership in keeping the project on schedule.\n\nWarm regards,\nAr. ${firmProfile.architectName}\n${firmProfile.firmName}`;
        break;

      case 'GENTLE_DUE_NOTICE':
        sub = `Gentle Reminder: Architectural Fee Invoice ${invNum} - ${project}`;
        body = `Dear ${clientName},\n\nHope this message finds you well.\n\nThis is a friendly reminder regarding Tax Invoice ${invNum} for professional architectural services rendered on "${project}". The balance amount of ${amountDue} is due on ${dueDateStr}.\n\nBank Payment Details:\n• A/C Name: ${firmProfile.accountHolderName || firmProfile.firmName}\n• Bank: ${firmProfile.bankName}\n• A/C No: ${firmProfile.accountNumber}\n• IFSC: ${firmProfile.ifscCode}\n• UPI: ${firmProfile.upiId}\n\nIf you have already processed this payment, kindly disregard this notice.\n\nThank you,\nAr. ${firmProfile.architectName}\n${firmProfile.firmName}`;
        break;

      case 'OVERDUE_ALERT':
        sub = `Urgent Follow-up: Overdue Invoice ${invNum} for ${project}`;
        body = `Dear ${clientName},\n\nWe are following up regarding the outstanding balance of ${amountDue} against Tax Invoice ${invNum} for "${project}", which was due on ${dueDateStr}.\n\nAs on-site execution and structural drawing releases are currently in progress, we kindly request the prompt clearance of this invoice to prevent any scheduling delays.\n\nRemittance Details:\n• Account: ${firmProfile.accountHolderName || firmProfile.firmName}\n• Bank: ${firmProfile.bankName} (A/C: ${firmProfile.accountNumber})\n• IFSC: ${firmProfile.ifscCode}\n• UPI: ${firmProfile.upiId}\n\nPlease share the transaction UTR once executed.\n\nSincerely,\nAr. ${firmProfile.architectName}\n${firmProfile.firmName}`;
        break;

      case 'FORMAL_COA_DEMAND':
        sub = `FORMAL DEMAND FOR PAYMENT: Invoice ${invNum} (${project})`;
        body = `Dear ${clientName},\n\nRE: Outstanding Professional Fees for Architectural Services under Council of Architecture (CoA) Engagement Code.\n\nThis is a formal notice that Tax Invoice ${invNum} dated ${new Date(inv.date).toLocaleDateString('en-IN')} for ${amountDue} remains overdue beyond the agreed credit terms.\n\nIn accordance with CoA Guidelines for Professional Practice, fees delayed beyond 30 days are subject to interest @ 18% p.a. from the due date.\n\nWe urge you to remit the outstanding sum of ${amountDue} within 7 days to avoid suspension of site inspection visits and statutory drawing submissions.\n\nBank Transfer:\n• Bank: ${firmProfile.bankName}\n• A/C: ${firmProfile.accountNumber}\n• IFSC: ${firmProfile.ifscCode}\n• UPI: ${firmProfile.upiId}\n\nAr. ${firmProfile.architectName} (CoA Reg: ${firmProfile.coaRegistrationNo})\n${firmProfile.firmName}`;
        break;

      case 'WHATSAPP_SHORT':
        sub = `Payment Reminder: ${invNum}`;
        body = `Hi ${clientName}, greetings from ${firmProfile.firmName}!\n\nThis is a reminder regarding Invoice *${invNum}* for *${project}*.\n• Amount Due: *${amountDue}*\n• Due Date: ${dueDateStr}\n\nBank Transfer / UPI Details:\n• Bank: ${firmProfile.bankName}\n• A/C: ${firmProfile.accountNumber}\n• IFSC: ${firmProfile.ifscCode}\n• UPI: ${firmProfile.upiId}\n\nKindly share the payment confirmation once done. Thank you!`;
        break;
    }

    setSubject(sub);
    setMessageBody(body);
  };

  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    const found = invoices.find((i) => i.id === invId);
    if (found) {
      generateTemplateMessage(found, selectedTemplate);
    }
  };

  const handleTemplateChange = (tmpl: ReminderTemplateType) => {
    setSelectedTemplate(tmpl);
    if (tmpl === 'WHATSAPP_SHORT') {
      setChannel('WHATSAPP');
    } else if (tmpl === 'FORMAL_COA_DEMAND') {
      setChannel('FORMAL_LETTER');
    }
    if (currentInvoice) {
      generateTemplateMessage(currentInvoice, tmpl);
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(messageBody);
    const phone = currentInvoice?.client.phone?.replace(/[^0-9]/g, '') || '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = () => {
    const to = currentInvoice?.client.email || '';
    const sub = encodeURIComponent(subject);
    const body = encodeURIComponent(messageBody);
    window.open(`mailto:${to}?subject=${sub}&body=${body}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoice) return;

    const reminder: PaymentReminder = {
      id: editingReminder ? editingReminder.id : `rem-${Date.now()}`,
      invoiceId: currentInvoice.id,
      invoiceNumber: currentInvoice.invoiceNumber,
      proposalId: currentInvoice.proposalId,
      projectTitle: currentInvoice.projectTitle,
      clientName: currentInvoice.client.name,
      clientPhone: currentInvoice.client.phone,
      clientEmail: currentInvoice.client.email,
      dueDate: currentInvoice.dueDate,
      totalAmount: currentInvoice.totalAmount,
      balanceDue: currentInvoice.balanceDue || currentInvoice.totalAmount,
      reminderType: selectedTemplate,
      channel,
      subject,
      messageBody,
      sentDate: new Date().toISOString(),
      scheduledNextFollowUpDate: scheduledNextDate || undefined,
      sentBy: firmProfile.architectName,
      status: 'SENT',
      notes,
      createdAt: editingReminder ? editingReminder.createdAt : new Date().toISOString()
    };

    onSave(reminder);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#161616] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#393939] shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#f1c21b] text-[#161616]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#f1c21b] block">
                PAYMENT RECOVERY & FOLLOW-UP DISPATCH
              </span>
              <h3 className="text-base font-bold text-white uppercase tracking-tight">
                {editingReminder ? 'Edit Payment Reminder' : 'Compose & Dispatch Payment Reminder'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d8d8d] hover:text-white hover:bg-[#262626] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Invoice Selection & Overview */}
          <div className="p-4 bg-[#f4f4f4] border border-[#e0e0e0] space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#161616] flex items-center space-x-1.5">
              <Receipt className="w-4 h-4 text-[#0f62fe]" />
              <span>Target Tax Invoice & Client</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Select Unpaid / Outstanding Invoice
                </label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs bg-white font-mono font-bold"
                  required
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} - {inv.client.name} ({formatINR(inv.balanceDue || inv.totalAmount)} Due)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Communication Channel
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
                    { id: 'EMAIL', label: 'Email', icon: Mail },
                    { id: 'SMS', label: 'SMS', icon: Send },
                    { id: 'FORMAL_LETTER', label: 'Formal Letter', icon: FileText }
                  ].map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setChannel(ch.id as any)}
                        className={`p-1.5 text-[10px] font-mono font-bold uppercase flex flex-col items-center justify-center border transition-colors ${
                          channel === ch.id
                            ? 'bg-[#161616] text-white border-[#161616]'
                            : 'bg-white text-[#525252] border-[#e0e0e0] hover:bg-[#e8e8e8]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mb-0.5" />
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Current Invoice Quick Card */}
            {currentInvoice && (
              <div className="p-3 bg-white border border-[#e0e0e0] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[#8d8d8d] uppercase block">Client</span>
                  <span className="font-bold text-[#161616] truncate block">{currentInvoice.client.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#8d8d8d] uppercase block">Project</span>
                  <span className="font-medium text-[#525252] truncate block">{currentInvoice.projectTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#8d8d8d] uppercase block">Due Date</span>
                  <span className="font-mono font-bold text-[#da1e28] block">
                    {new Date(currentInvoice.dueDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#8d8d8d] uppercase block">Balance Due</span>
                  <span className="font-mono font-bold text-[#da1e28] text-sm block">
                    {formatINR(currentInvoice.balanceDue || currentInvoice.totalAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#161616] block">
              Choose Reminder Tone & Context Template
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'MILESTONE_SITE_COMPLETION',
                  name: 'Site Work Certified',
                  desc: 'Physical inspection completed'
                },
                {
                  id: 'GENTLE_DUE_NOTICE',
                  name: 'Gentle Courtesy',
                  desc: 'Approaching / on due date'
                },
                {
                  id: 'OVERDUE_ALERT',
                  name: 'Urgent Overdue',
                  desc: 'Drawing hold warning'
                },
                {
                  id: 'FORMAL_COA_DEMAND',
                  name: 'CoA Demand Letter',
                  desc: '18% p.a. interest clause'
                },
                {
                  id: 'WHATSAPP_SHORT',
                  name: 'WhatsApp Quick Ping',
                  desc: 'Emoji & UPI bullet points'
                }
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.id as ReminderTemplateType)}
                  className={`p-2 text-left border transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'bg-[#edf5ff] border-[#0f62fe] text-[#0043ce] shadow-xs'
                      : 'bg-white border-[#e0e0e0] text-[#525252] hover:bg-[#f4f4f4]'
                  }`}
                >
                  <span className="text-xs font-bold block">{tmpl.name}</span>
                  <span className="text-[10px] text-[#8d8d8d] block">{tmpl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject & Message Body Composer */}
          <div className="p-4 bg-white border border-[#e0e0e0] space-y-3">
            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="carbon-input w-full py-1.5 text-xs font-medium"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252]">
                  Message Body / Dispatch Content
                </label>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center text-[10px] font-mono text-[#0f62fe] hover:underline"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-[#24a148]" />
                      <span className="text-[#24a148] font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={9}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="carbon-input w-full p-3 text-xs font-mono leading-relaxed"
                required
              />
            </div>

            {/* Next Follow up & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Schedule Next Follow-Up Date
                </label>
                <input
                  type="date"
                  value={scheduledNextDate}
                  onChange={(e) => setScheduledNextDate(e.target.value)}
                  className="carbon-input w-full py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#525252] block mb-1">
                  Internal Log Notes / Client Response
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Client promised clearance via RTGS on Friday"
                  className="carbon-input w-full py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Direct Actions Toolbar */}
          <div className="p-3 bg-[#edf5ff] border border-[#a6c8ff] flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-mono font-bold uppercase text-[#0043ce]">
              1-Click Dispatch:
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="inline-flex items-center px-3 py-1.5 bg-[#24a148] hover:bg-[#198038] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                <span>WhatsApp Client</span>
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                className="inline-flex items-center px-3 py-1.5 bg-[#0f62fe] hover:bg-[#0043ce] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 mr-1" />
                <span>Email Client</span>
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="carbon-btn-ghost px-4 py-2 text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="carbon-btn-primary px-6 py-2 text-xs font-bold uppercase tracking-wider shadow-md"
            >
              {editingReminder ? 'Update Reminder Record' : 'Record & Save to History'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
