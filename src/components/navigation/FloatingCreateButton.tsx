import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  UserPlus,
  FileText, 
  HardHat,
  ReceiptText, 
  Bell,
  WalletCards, 
  DollarSign, 
  Users,
  ChevronRight
} from 'lucide-react';
import { AppModulesConfig } from '../../types';

interface FloatingCreateButtonProps {
  modulesConfig: AppModulesConfig;
  onNewClient?: () => void;
  onNewProposal: () => void;
  onNewSiteUpdate?: () => void;
  onNewInvoice: () => void;
  onNewReminder?: () => void;
  onNewPayment: () => void;
  onNewExpense: () => void;
  onNewSalary: () => void;
}

export const FloatingCreateButton: React.FC<FloatingCreateButtonProps> = ({
  modulesConfig,
  onNewClient,
  onNewProposal,
  onNewSiteUpdate,
  onNewInvoice,
  onNewReminder,
  onNewPayment,
  onNewExpense,
  onNewSalary
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleAction = (actionFn: () => void) => {
    setIsOpen(false);
    actionFn();
  };

  return (
    <>
      {/* Dimmed Backdrop when menu is active */}
      {isOpen && (
        <div 
          id="fab-backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        />
      )}

      {/* Floating Action Menu Popover */}
      {isOpen && (
        <div 
          id="fab-action-menu"
          className="fixed bottom-18 right-3 sm:right-5 z-50 w-64 sm:w-72 bg-[#161616] text-white border border-[#393939] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-100"
        >
          {/* Header */}
          <div className="px-3 py-2 bg-[#262626] border-b border-[#393939] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#0f62fe]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                Create New
              </span>
            </div>
            <span className="text-[9px] text-[#8d8d8d] font-mono">
              ESC
            </span>
          </div>

          {/* Action Items List */}
          <div className="p-1.5 space-y-1">
            {onNewClient && (
              <button
                id="fab-new-client-btn"
                onClick={() => handleAction(onNewClient)}
                className="w-full flex items-center justify-between p-2 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#0f62fe] text-left transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 bg-[#262626] group-hover:bg-[#0f62fe] text-[#0f62fe] group-hover:text-white flex items-center justify-center transition-colors">
                    <UserPlus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#4589ff] transition-colors uppercase tracking-tight">
                      Client Profile First
                    </span>
                    <span className="text-[9px] text-[#8d8d8d] block font-mono">
                      Register GST, PAN & Site
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d8d8d] group-hover:text-[#0f62fe] transition-colors" />
              </button>
            )}

            {modulesConfig.proposals && (
              <button
                id="fab-new-proposal-btn"
                onClick={() => handleAction(onNewProposal)}
                className="w-full flex items-center justify-between p-2 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#0f62fe] text-left transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 bg-[#262626] group-hover:bg-[#0f62fe] text-[#0f62fe] group-hover:text-white flex items-center justify-center transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#4589ff] transition-colors uppercase tracking-tight">
                      Fee Proposal
                    </span>
                    <span className="text-[9px] text-[#8d8d8d] block font-mono">
                      CoA Stage-wise Scale
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d8d8d] group-hover:text-[#0f62fe] transition-colors" />
              </button>
            )}

            {modulesConfig.siteUpdates !== false && onNewSiteUpdate && (
              <button
                id="fab-new-site-update-btn"
                onClick={() => handleAction(onNewSiteUpdate)}
                className="w-full flex items-center justify-between p-2 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#0f62fe] text-left transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 bg-[#262626] group-hover:bg-[#0f62fe] text-[#0f62fe] group-hover:text-white flex items-center justify-center transition-colors">
                    <HardHat className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#4589ff] transition-colors uppercase tracking-tight">
                      Site Inspection Log
                    </span>
                    <span className="text-[9px] text-[#8d8d8d] block font-mono">
                      Stage Certificate & Snags
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d8d8d] group-hover:text-[#0f62fe] transition-colors" />
              </button>
            )}

            {modulesConfig.invoices && (
              <button
                id="fab-new-invoice-btn"
                onClick={() => handleAction(onNewInvoice)}
                className="w-full flex items-center justify-between p-2 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#0f62fe] text-left transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 bg-[#262626] group-hover:bg-[#0f62fe] text-[#0f62fe] group-hover:text-white flex items-center justify-center transition-colors">
                    <ReceiptText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#4589ff] transition-colors uppercase tracking-tight">
                      Tax Invoice
                    </span>
                    <span className="text-[9px] text-[#8d8d8d] block font-mono">
                      18% GST / 6% Comp / Non-GST
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d8d8d] group-hover:text-[#0f62fe] transition-colors" />
              </button>
            )}

            {modulesConfig.reminders !== false && onNewReminder && (
              <button
                id="fab-new-reminder-btn"
                onClick={() => handleAction(onNewReminder)}
                className="w-full flex items-center justify-between p-2 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#0f62fe] text-left transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 bg-[#262626] group-hover:bg-[#0f62fe] text-[#f1c21b] group-hover:text-white flex items-center justify-center transition-colors">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#4589ff] transition-colors uppercase tracking-tight">
                      Payment Reminder
                    </span>
                    <span className="text-[9px] text-[#8d8d8d] block font-mono">
                      WhatsApp / Email / Demand Notice
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d8d8d] group-hover:text-[#0f62fe] transition-colors" />
              </button>
            )}

            {modulesConfig.payments && (
              <button
                id="fab-new-payment-btn"
                onClick={() => handleAction(onNewPayment)}
                className="w-full flex items-center justify-between p-2 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#0f62fe] text-left transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 bg-[#262626] group-hover:bg-[#0f62fe] text-[#0f62fe] group-hover:text-white flex items-center justify-center transition-colors">
                    <WalletCards className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#4589ff] transition-colors uppercase tracking-tight">
                      Payment Receipt
                    </span>
                    <span className="text-[9px] text-[#8d8d8d] block font-mono">
                      Receipt Voucher + TDS 194J
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d8d8d] group-hover:text-[#0f62fe] transition-colors" />
              </button>
            )}

            {modulesConfig.expenses && (
              <button
                id="fab-new-expense-btn"
                onClick={() => handleAction(onNewExpense)}
                className="w-full flex items-center justify-between p-2 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#0f62fe] text-left transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 bg-[#262626] group-hover:bg-[#0f62fe] text-[#0f62fe] group-hover:text-white flex items-center justify-center transition-colors">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#4589ff] transition-colors uppercase tracking-tight">
                      Practice Expense
                    </span>
                    <span className="text-[9px] text-[#8d8d8d] block font-mono">
                      Billable Site / Office Cost
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d8d8d] group-hover:text-[#0f62fe] transition-colors" />
              </button>
            )}

            {modulesConfig.salaries && (
              <button
                id="fab-new-salary-btn"
                onClick={() => handleAction(onNewSalary)}
                className="w-full flex items-center justify-between p-2 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#0f62fe] text-left transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 bg-[#262626] group-hover:bg-[#0f62fe] text-[#0f62fe] group-hover:text-white flex items-center justify-center transition-colors">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#4589ff] transition-colors uppercase tracking-tight">
                      Staff Salary
                    </span>
                    <span className="text-[9px] text-[#8d8d8d] block font-mono">
                      Payroll Payslip & Allowances
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8d8d8d] group-hover:text-[#0f62fe] transition-colors" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Floating Action Button - Scaled down to 0.5x (28px - 32px), thin 1px border, strict IBM Blue #0f62fe */}
      <button
        id="main-floating-create-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close create menu" : "Create new item"}
        title={isOpen ? "Close create menu" : "Quick Create (0.5x)"}
        className={`fixed bottom-16 right-3 sm:right-5 z-50 w-7 h-7 bg-[#0f62fe] text-white hover:bg-[#0043ce] active:bg-[#002d9c] flex items-center justify-center shadow-lg border border-[#0f62fe] transition-all duration-150 ${
          isOpen ? 'rotate-45 bg-[#da1e28] text-white border-[#da1e28]' : 'hover:scale-105 active:scale-95'
        }`}
      >
        <Plus className="w-4 h-4 stroke-[2]" />
      </button>
    </>
  );
};
