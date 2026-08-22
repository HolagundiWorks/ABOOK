import React from 'react';
import { 
  Users,
  FileText, 
  HardHat,
  ReceiptText, 
  Bell,
  WalletCards, 
  Menu
} from 'lucide-react';
import { MainTabType } from '../Navbar';
import { AppModulesConfig } from '../../types';

interface BottomNavBarProps {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  onOpenSidePane: () => void;
  modulesConfig: AppModulesConfig;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSidePane,
  modulesConfig
}) => {
  return (
    <nav 
      id="main-bottom-navigation"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#161616] text-white border-t border-[#393939] shadow-2xl print:hidden h-14"
    >
      <div className="max-w-4xl mx-auto h-full flex items-stretch overflow-x-auto justify-around">
        
        {/* 1. Clients Tab (Client-First Step 1) */}
        {modulesConfig.clients !== false && (
          <button
            id="bottom-nav-clients"
            onClick={() => setActiveTab('clients')}
            aria-label="Clients tab"
            aria-selected={activeTab === 'clients'}
            className={`flex-1 min-w-[50px] flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'clients'
                ? 'border-[#0f62fe] text-[#4589ff] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase font-bold tracking-wider leading-none">
              Clients
            </span>
          </button>
        )}

        {/* 2. Proposals Tab */}
        {modulesConfig.proposals && (
          <button
            id="bottom-nav-proposals"
            onClick={() => setActiveTab('proposals')}
            aria-label="Proposals tab"
            aria-selected={activeTab === 'proposals'}
            className={`flex-1 min-w-[50px] flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'proposals'
                ? 'border-[#0f62fe] text-[#4589ff] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase font-bold tracking-wider leading-none">
              Proposals
            </span>
          </button>
        )}

        {/* 3. Site Updates Tab (Linked to Milestone Billing) */}
        {modulesConfig.siteUpdates !== false && (
          <button
            id="bottom-nav-site-updates"
            onClick={() => setActiveTab('siteUpdates')}
            aria-label="Site updates tab"
            aria-selected={activeTab === 'siteUpdates'}
            className={`flex-1 min-w-[50px] flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'siteUpdates'
                ? 'border-[#0f62fe] text-[#4589ff] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <HardHat className="w-4 h-4 mb-0.5 text-[#0f62fe]" />
            <span className="text-[9px] uppercase font-bold tracking-wider leading-none">
              Site
            </span>
          </button>
        )}

        {/* 4. Invoices Tab */}
        {modulesConfig.invoices && (
          <button
            id="bottom-nav-invoices"
            onClick={() => setActiveTab('invoices')}
            aria-label="Invoices tab"
            aria-selected={activeTab === 'invoices'}
            className={`flex-1 min-w-[50px] flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'invoices'
                ? 'border-[#0f62fe] text-[#4589ff] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <ReceiptText className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase font-bold tracking-wider leading-none">
              Invoices
            </span>
          </button>
        )}

        {/* 5. Reminders Tab */}
        {modulesConfig.reminders !== false && (
          <button
            id="bottom-nav-reminders"
            onClick={() => setActiveTab('reminders')}
            aria-label="Payment reminders tab"
            aria-selected={activeTab === 'reminders'}
            className={`flex-1 min-w-[50px] flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'reminders'
                ? 'border-[#0f62fe] text-[#4589ff] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <Bell className="w-4 h-4 mb-0.5 text-[#f1c21b]" />
            <span className="text-[9px] uppercase font-bold tracking-wider leading-none">
              Remind
            </span>
          </button>
        )}

        {/* 6. Receipts & Payments Tab */}
        {modulesConfig.payments && (
          <button
            id="bottom-nav-payments"
            onClick={() => setActiveTab('payments')}
            aria-label="Receipts tab"
            aria-selected={activeTab === 'payments'}
            className={`flex-1 min-w-[50px] flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'payments'
                ? 'border-[#0f62fe] text-[#4589ff] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <WalletCards className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase font-bold tracking-wider leading-none">
              Receipts
            </span>
          </button>
        )}

        {/* 7. Side Menu Drawer Button */}
        <button
          id="bottom-nav-menu"
          onClick={onOpenSidePane}
          aria-label="Open Studio Menu & Side Pane"
          className="flex-1 min-w-[50px] flex flex-col items-center justify-center transition-colors border-t-2 border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c] h-full"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase font-bold tracking-wider leading-none">
            Menu
          </span>
        </button>

      </div>
    </nav>
  );
};

