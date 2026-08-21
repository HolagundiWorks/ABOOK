import React from 'react';
import { 
  FileText, 
  ReceiptText, 
  WalletCards, 
  BookOpenCheck, 
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
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#161616] text-white border-t border-[#393939] shadow-2xl print:hidden h-16"
    >
      <div className="max-w-4xl mx-auto h-full grid grid-cols-5 items-stretch">
        
        {/* 1. Proposals Tab */}
        {modulesConfig.proposals && (
          <button
            id="bottom-nav-proposals"
            onClick={() => setActiveTab('proposals')}
            aria-label="Proposals tab"
            aria-selected={activeTab === 'proposals'}
            className={`flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'proposals'
                ? 'border-[#ff832b] text-[#ff832b] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
              Proposals
            </span>
          </button>
        )}

        {/* 2. Invoices Tab */}
        {modulesConfig.invoices && (
          <button
            id="bottom-nav-invoices"
            onClick={() => setActiveTab('invoices')}
            aria-label="Invoices tab"
            aria-selected={activeTab === 'invoices'}
            className={`flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'invoices'
                ? 'border-[#ff832b] text-[#ff832b] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <ReceiptText className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
              Invoices
            </span>
          </button>
        )}

        {/* 3. Receipts & Payments Tab */}
        {modulesConfig.payments && (
          <button
            id="bottom-nav-payments"
            onClick={() => setActiveTab('payments')}
            aria-label="Receipts tab"
            aria-selected={activeTab === 'payments'}
            className={`flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'payments'
                ? 'border-[#ff832b] text-[#ff832b] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <WalletCards className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
              Receipts
            </span>
          </button>
        )}

        {/* 4. Books & P&L Tab */}
        {modulesConfig.books && (
          <button
            id="bottom-nav-books"
            onClick={() => setActiveTab('books')}
            aria-label="Books and P&L tab"
            aria-selected={activeTab === 'books'}
            className={`flex flex-col items-center justify-center transition-colors border-t-2 h-full ${
              activeTab === 'books'
                ? 'border-[#ff832b] text-[#ff832b] bg-[#262626] font-bold'
                : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <BookOpenCheck className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
              Books
            </span>
          </button>
        )}

        {/* 5. Menu / Studio Side Pane Trigger */}
        <button
          id="bottom-nav-menu"
          onClick={onOpenSidePane}
          aria-label="Open Studio Menu"
          className="flex flex-col items-center justify-center transition-colors border-t-2 border-transparent text-[#8d8d8d] hover:text-[#ff832b] hover:bg-[#1c1c1c] h-full"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
            Studio
          </span>
        </button>

      </div>
    </nav>
  );
};
