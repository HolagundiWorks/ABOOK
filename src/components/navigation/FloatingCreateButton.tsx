import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  FileText, 
  ReceiptText, 
  WalletCards, 
  DollarSign, 
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AppModulesConfig } from '../../types';

interface FloatingCreateButtonProps {
  modulesConfig: AppModulesConfig;
  onNewProposal: () => void;
  onNewInvoice: () => void;
  onNewPayment: () => void;
  onNewExpense: () => void;
  onNewSalary: () => void;
}

export const FloatingCreateButton: React.FC<FloatingCreateButtonProps> = ({
  modulesConfig,
  onNewProposal,
  onNewInvoice,
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Floating Action Menu Popover */}
      {isOpen && (
        <div 
          id="fab-action-menu"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-72 sm:w-80 bg-[#161616] text-white border-2 border-[#393939] shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-150"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#262626] border-b border-[#393939] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#ff832b]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Create New Document
              </span>
            </div>
            <span className="text-[10px] text-[#8d8d8d] font-mono">
              ESC to close
            </span>
          </div>

          {/* Action Items List */}
          <div className="p-2 space-y-1.5">
            {modulesConfig.proposals && (
              <button
                id="fab-new-proposal-btn"
                onClick={() => handleAction(onNewProposal)}
                className="w-full flex items-center justify-between p-3 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#ff832b] text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#262626] group-hover:bg-[#ff832b] text-[#ff832b] group-hover:text-black flex items-center justify-center transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-[#ff832b] transition-colors uppercase tracking-tight">
                      Fee Proposal
                    </span>
                    <span className="text-[10px] text-[#8d8d8d] block font-mono">
                      CoA Stage-wise Scale
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8d8d8d] group-hover:text-[#ff832b] transition-colors" />
              </button>
            )}

            {modulesConfig.invoices && (
              <button
                id="fab-new-invoice-btn"
                onClick={() => handleAction(onNewInvoice)}
                className="w-full flex items-center justify-between p-3 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#ff832b] text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#262626] group-hover:bg-[#ff832b] text-[#ff832b] group-hover:text-black flex items-center justify-center transition-colors">
                    <ReceiptText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-[#ff832b] transition-colors uppercase tracking-tight">
                      Tax Invoice
                    </span>
                    <span className="text-[10px] text-[#8d8d8d] block font-mono">
                      18% GST / 6% Comp / Non-GST
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8d8d8d] group-hover:text-[#ff832b] transition-colors" />
              </button>
            )}

            {modulesConfig.payments && (
              <button
                id="fab-new-payment-btn"
                onClick={() => handleAction(onNewPayment)}
                className="w-full flex items-center justify-between p-3 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#ff832b] text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#262626] group-hover:bg-[#ff832b] text-[#ff832b] group-hover:text-black flex items-center justify-center transition-colors">
                    <WalletCards className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-[#ff832b] transition-colors uppercase tracking-tight">
                      Payment Receipt
                    </span>
                    <span className="text-[10px] text-[#8d8d8d] block font-mono">
                      Receipt Voucher + TDS 194J
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8d8d8d] group-hover:text-[#ff832b] transition-colors" />
              </button>
            )}

            {modulesConfig.expenses && (
              <button
                id="fab-new-expense-btn"
                onClick={() => handleAction(onNewExpense)}
                className="w-full flex items-center justify-between p-3 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#ff832b] text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#262626] group-hover:bg-[#ff832b] text-[#ff832b] group-hover:text-black flex items-center justify-center transition-colors">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-[#ff832b] transition-colors uppercase tracking-tight">
                      Practice Expense
                    </span>
                    <span className="text-[10px] text-[#8d8d8d] block font-mono">
                      Billable Site / Office Cost
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8d8d8d] group-hover:text-[#ff832b] transition-colors" />
              </button>
            )}

            {modulesConfig.salaries && (
              <button
                id="fab-new-salary-btn"
                onClick={() => handleAction(onNewSalary)}
                className="w-full flex items-center justify-between p-3 bg-[#161616] hover:bg-[#262626] border border-[#393939] hover:border-[#ff832b] text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#262626] group-hover:bg-[#ff832b] text-[#ff832b] group-hover:text-black flex items-center justify-center transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-[#ff832b] transition-colors uppercase tracking-tight">
                      Staff Salary
                    </span>
                    <span className="text-[10px] text-[#8d8d8d] block font-mono">
                      Payroll Payslip & Allowances
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8d8d8d] group-hover:text-[#ff832b] transition-colors" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Floating Action Button (Zero Radius, High Contrast, 56px Touch Target) */}
      <button
        id="main-floating-create-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close create menu" : "Create new item"}
        title={isOpen ? "Close create menu" : "Create new invoice, proposal, or receipt"}
        className={`fixed bottom-20 right-4 sm:right-6 z-50 w-14 h-14 bg-[#ff832b] text-black hover:bg-[#fa7516] active:bg-[#e06305] flex items-center justify-center shadow-2xl border-2 border-black transition-transform duration-200 ${
          isOpen ? 'rotate-45 bg-[#da1e28] text-white border-white' : 'hover:scale-105 active:scale-95'
        }`}
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </>
  );
};
