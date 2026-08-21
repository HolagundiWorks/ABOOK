import React, { useEffect } from 'react';
import { 
  X, 
  Building2, 
  FileText, 
  ReceiptText, 
  WalletCards, 
  DollarSign, 
  Users, 
  BookOpenCheck, 
  Settings, 
  Briefcase, 
  Wifi, 
  Lock, 
  Download, 
  Upload, 
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { FirmProfile, TaxScheme, AppModulesConfig } from '../../types';
import { MainTabType } from '../Navbar';

interface SidePaneDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  firmProfile: FirmProfile;
  modulesConfig: AppModulesConfig;
  onOpenSettings: () => void;
  onOpenTemplates: () => void;
  onOpenLanModal: () => void;
  onLockApp: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
  counts: {
    clients?: number;
    proposals: number;
    invoices: number;
    payments: number;
    expenses: number;
    salaries: number;
  };
}

export const SidePaneDrawer: React.FC<SidePaneDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  firmProfile,
  modulesConfig,
  onOpenSettings,
  onOpenTemplates,
  onOpenLanModal,
  onLockApp,
  onExportData,
  onImportData,
  onResetData,
  counts
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTaxBadge = (scheme: TaxScheme) => {
    switch (scheme) {
      case 'REGULAR_GST':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#4589ff] border border-[#0f62fe]">
            GST 18%
          </span>
        );
      case 'COMPOSITION_GST':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-white border border-[#8d8d8d]">
            COMP 6%
          </span>
        );
      case 'NO_GST':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#24a148] text-white border border-[#24a148]">
            NON-GST
          </span>
        );
    }
  };

  const getFirmTypeLabel = (type?: string) => {
    switch (type) {
      case 'FREELANCER': return 'Solo Consultant';
      case 'PROPRIETORSHIP': return 'Proprietorship Studio';
      case 'PARTNERSHIP': return 'Partnership Firm';
      case 'LLP': return 'Architectural LLP';
      case 'PVT_LTD': return 'Pvt Ltd Practice';
      default: return 'Architectural Practice';
    }
  };

  const handleSelectTab = (tab: MainTabType) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div id="side-pane-overlay" className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Side Pane Content Container */}
      <div 
        id="side-pane-container"
        className="relative w-full max-w-sm sm:max-w-md bg-[#161616] text-white h-full flex flex-col z-10 border-l border-[#393939] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Pane Header */}
        <div className="p-4 bg-[#262626] border-b border-[#393939] flex items-start justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-[#0f62fe] text-white flex items-center justify-center font-black shrink-0 border border-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold text-white uppercase tracking-tight truncate">
                {firmProfile.firmName}
              </h2>
              <div className="flex items-center space-x-2 text-[10px] text-[#8d8d8d] font-mono mt-0.5">
                <span className="text-[#4589ff]">CoA: {firmProfile.coaRegistrationNo}</span>
                <span>•</span>
                <span>{getFirmTypeLabel(firmProfile.firmType)}</span>
              </div>
            </div>
          </div>

          <button
            id="side-pane-close-btn"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-[#8d8d8d] hover:text-white hover:bg-[#393939] transition-colors border border-transparent hover:border-[#525252]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Firm Status Pill Banner */}
        <div className="px-4 py-2.5 bg-[#1f1f1f] border-b border-[#393939] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#8d8d8d] uppercase tracking-wider font-semibold">
            Tax Regime
          </span>
          {getTaxBadge(firmProfile.defaultTaxScheme)}
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6 flex-1">
          
          {/* Section 1: Studio Practice Modules */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8d8d8d] block mb-2 px-1">
              Practice Modules (Client-First Workflow)
            </span>
            <div className="space-y-1">
              {/* Clients Tab */}
              {modulesConfig.clients !== false && (
                <button
                  id="side-nav-clients"
                  onClick={() => handleSelectTab('clients')}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    activeTab === 'clients'
                      ? 'bg-[#262626] border-[#0f62fe] text-[#4589ff]'
                      : 'bg-[#161616] border-[#393939] text-[#e0e0e0] hover:bg-[#262626] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-[#0f62fe]" />
                    <div className="text-left">
                      <span className="text-xs font-bold uppercase tracking-wider block">
                        1. Client Profiles
                      </span>
                      <span className="text-[9px] font-mono text-[#8d8d8d] block">
                        Statutory GST & PAN Registry
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black border border-[#393939] text-[#4589ff]">
                    {counts.clients ?? 0}
                  </span>
                </button>
              )}

              {modulesConfig.proposals && (
                <button
                  id="side-nav-proposals"
                  onClick={() => handleSelectTab('proposals')}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    activeTab === 'proposals'
                      ? 'bg-[#262626] border-[#0f62fe] text-[#4589ff]'
                      : 'bg-[#161616] border-[#393939] text-[#e0e0e0] hover:bg-[#262626] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      2. Fee Proposals (CoA)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black border border-[#393939] text-[#8d8d8d]">
                    {counts.proposals}
                  </span>
                </button>
              )}

              {modulesConfig.invoices && (
                <button
                  id="side-nav-invoices"
                  onClick={() => handleSelectTab('invoices')}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    activeTab === 'invoices'
                      ? 'bg-[#262626] border-[#0f62fe] text-[#4589ff]'
                      : 'bg-[#161616] border-[#393939] text-[#e0e0e0] hover:bg-[#262626] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ReceiptText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      3. Tax Invoices & Milestone Billing
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black border border-[#393939] text-[#8d8d8d]">
                    {counts.invoices}
                  </span>
                </button>
              )}

              {modulesConfig.payments && (
                <button
                  id="side-nav-payments"
                  onClick={() => handleSelectTab('payments')}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    activeTab === 'payments'
                      ? 'bg-[#262626] border-[#0f62fe] text-[#4589ff]'
                      : 'bg-[#161616] border-[#393939] text-[#e0e0e0] hover:bg-[#262626] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <WalletCards className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      4. Receipts & TDS Settlements
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black border border-[#393939] text-[#8d8d8d]">
                    {counts.payments}
                  </span>
                </button>
              )}

              {modulesConfig.expenses && (
                <button
                  id="side-nav-expenses"
                  onClick={() => handleSelectTab('expenses')}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    activeTab === 'expenses'
                      ? 'bg-[#262626] border-[#0f62fe] text-[#4589ff]'
                      : 'bg-[#161616] border-[#393939] text-[#e0e0e0] hover:bg-[#262626] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Studio Expenses & Reimbursables
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black border border-[#393939] text-[#8d8d8d]">
                    {counts.expenses}
                  </span>
                </button>
              )}

              {modulesConfig.salaries && (
                <button
                  id="side-nav-salaries"
                  onClick={() => handleSelectTab('salaries')}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    activeTab === 'salaries'
                      ? 'bg-[#262626] border-[#0f62fe] text-[#4589ff]'
                      : 'bg-[#161616] border-[#393939] text-[#e0e0e0] hover:bg-[#262626] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Team Salaries & Stipends
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black border border-[#393939] text-[#8d8d8d]">
                    {counts.salaries}
                  </span>
                </button>
              )}

              {modulesConfig.books && (
                <button
                  id="side-nav-books"
                  onClick={() => handleSelectTab('books')}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    activeTab === 'books'
                      ? 'bg-[#262626] border-[#0f62fe] text-[#4589ff]'
                      : 'bg-[#161616] border-[#393939] text-[#e0e0e0] hover:bg-[#262626] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <BookOpenCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Studio Books & P&L Analysis
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Studio Tools & Connectivity */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8d8d8d] block mb-2 px-1">
              Studio Network & Security
            </span>
            <div className="space-y-1">
              <button
                id="side-nav-lan-modal"
                onClick={() => {
                  onClose();
                  onOpenLanModal();
                }}
                className="w-full flex items-center justify-between p-3 border border-[#393939] bg-[#161616] hover:bg-[#262626] text-[#e0e0e0] hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Wifi className="w-4 h-4 text-[#0f62fe]" />
                  <div className="text-left">
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      Dedicated Wi-Fi Portal
                    </span>
                    <span className="text-[10px] font-mono text-[#8d8d8d]">
                      Hotspot Air-Gap & Office LAN
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#0f62fe] text-white font-bold">
                  SECURE
                </span>
              </button>

              {modulesConfig.freelanceTemplates && (
                <button
                  id="side-nav-templates"
                  onClick={() => {
                    onClose();
                    onOpenTemplates();
                  }}
                  className="w-full flex items-center justify-between p-3 border border-[#393939] bg-[#161616] hover:bg-[#262626] text-[#e0e0e0] hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-4 h-4 text-[#0f62fe]" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Freelance Fee Templates
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8d8d8d]" />
                </button>
              )}

              <button
                id="side-nav-settings"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full flex items-center justify-between p-3 border border-[#393939] bg-[#161616] hover:bg-[#262626] text-[#e0e0e0] hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Firm Profile & Tax Settings
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8d8d8d]" />
              </button>

              <button
                id="side-nav-lock"
                onClick={() => {
                  onClose();
                  onLockApp();
                }}
                className="w-full flex items-center justify-between p-3 border border-[#393939] bg-[#161616] hover:bg-[#262626] text-[#e0e0e0] hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-4 h-4 text-[#da1e28]" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Lock Studio PIN Session
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#da1e28] text-white">
                  LOCK
                </span>
              </button>
            </div>
          </div>

          {/* Section 3: Data Management & Backup */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8d8d8d] block mb-2 px-1">
              Local Data Storage & Vault
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="side-nav-export"
                onClick={() => {
                  onClose();
                  onExportData();
                }}
                className="p-2.5 bg-[#262626] hover:bg-[#393939] text-[#e0e0e0] hover:text-white border border-[#393939] flex flex-col items-center justify-center text-center transition-colors"
              >
                <Download className="w-4 h-4 mb-1 text-[#0f62fe]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Export JSON
                </span>
              </button>

              <button
                id="side-nav-import"
                onClick={() => {
                  onClose();
                  onImportData();
                }}
                className="p-2.5 bg-[#262626] hover:bg-[#393939] text-[#e0e0e0] hover:text-white border border-[#393939] flex flex-col items-center justify-center text-center transition-colors"
              >
                <Upload className="w-4 h-4 mb-1 text-[#0f62fe]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Import JSON
                </span>
              </button>
            </div>

            <button
              id="side-nav-reset"
              onClick={() => {
                onClose();
                onResetData();
              }}
              className="w-full mt-2 p-2 bg-[#1f1f1f] hover:bg-[#da1e28] text-[#8d8d8d] hover:text-white border border-[#393939] flex items-center justify-center space-x-2 text-[10px] font-mono uppercase transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Sample CoA Data</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-[#1f1f1f] border-t border-[#393939] text-center space-y-1">
          <div className="flex items-center justify-center space-x-2 text-[10px] text-[#8d8d8d] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0f62fe]" />
            <span>CoA Architectural Standards • GST Compliant</span>
          </div>
          <p className="text-[9px] text-[#6f6f6f] font-mono">
            Version 2.0-IBM-Carbon • Offline Local Storage
          </p>
        </div>
      </div>
    </div>
  );
};
