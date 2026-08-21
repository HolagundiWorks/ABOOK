import React, { useState, useEffect } from 'react';
import { 
  FirmProfile, 
  ProjectProposal, 
  Invoice, 
  PaymentRecord, 
  ExpenseItem,
  SalaryRecord,
  FinancialSummary,
  FreelanceTemplate,
  AppModulesConfig,
  AppSecurityConfig
} from './types';
import { 
  loadFirmProfile, 
  saveFirmProfile, 
  loadProposals, 
  saveProposals, 
  loadInvoices, 
  saveInvoices, 
  loadPayments, 
  savePayments,
  loadExpenses,
  saveExpenses,
  loadSalaries,
  saveSalaries,
  loadFreelanceTemplates,
  saveFreelanceTemplates,
  loadAppModulesConfig,
  saveAppModulesConfig,
  loadAppSecurityConfig,
  saveAppSecurityConfig,
  calculateFinancialSummary,
  generateNextProposalNumber,
  generateNextInvoiceNumber,
  generateNextReceiptNumber,
  exportAllDataAsJSON,
  importAllDataFromJSON,
  resetAllToSampleData
} from './utils/storage';
import { MainTabType } from './components/Navbar';
import { BottomNavBar } from './components/navigation/BottomNavBar';
import { FloatingCreateButton } from './components/navigation/FloatingCreateButton';
import { SidePaneDrawer } from './components/navigation/SidePaneDrawer';
import { ProposalList } from './components/proposals/ProposalList';
import { ProposalModal } from './components/proposals/ProposalModal';
import { ProposalView } from './components/proposals/ProposalView';
import { InvoiceList } from './components/invoices/InvoiceList';
import { InvoiceModal } from './components/invoices/InvoiceModal';
import { InvoiceView } from './components/invoices/InvoiceView';
import { PaymentLedger } from './components/payments/PaymentLedger';
import { PaymentModal } from './components/payments/PaymentModal';
import { ReceiptView } from './components/payments/ReceiptView';
import { ExpenseList } from './components/expenses/ExpenseList';
import { ExpenseModal } from './components/expenses/ExpenseModal';
import { SalaryList } from './components/salaries/SalaryList';
import { SalaryModal } from './components/salaries/SalaryModal';
import { BooksDashboard } from './components/books/BooksDashboard';
import { FirmSettingsModal } from './components/settings/FirmSettingsModal';
import { TemplateManagerModal } from './components/templates/TemplateManagerModal';
import { LockScreen } from './components/security/LockScreen';
import { LanShareModal } from './components/lan/LanShareModal';

export default function App() {
  // Core App State
  const [firmProfile, setFirmProfile] = useState<FirmProfile>(loadFirmProfile);
  const [proposals, setProposals] = useState<ProjectProposal[]>(loadProposals);
  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices);
  const [payments, setPayments] = useState<PaymentRecord[]>(loadPayments);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(loadExpenses);
  const [salaries, setSalaries] = useState<SalaryRecord[]>(loadSalaries);
  const [freelanceTemplates, setFreelanceTemplates] = useState<FreelanceTemplate[]>(loadFreelanceTemplates);
  const [modulesConfig, setModulesConfig] = useState<AppModulesConfig>(loadAppModulesConfig);
  const [securityConfig, setSecurityConfig] = useState<AppSecurityConfig>(loadAppSecurityConfig);

  // Lock Screen state
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const sec = loadAppSecurityConfig();
    return Boolean(sec.isLockEnabled);
  });

  // Tab State
  const [activeTab, setActiveTab] = useState<MainTabType>('proposals');

  // Proposal Modals
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<ProjectProposal | null>(null);
  const [viewingProposal, setViewingProposal] = useState<ProjectProposal | null>(null);

  // Invoice Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [preselectedProposalForInvoice, setPreselectedProposalForInvoice] = useState<ProjectProposal | null>(null);

  // Payment Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState<PaymentRecord | null>(null);
  const [preselectedInvoiceForPayment, setPreselectedInvoiceForPayment] = useState<Invoice | null>(null);

  // Expense Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  // Salary Modals
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryRecord | null>(null);

  // Settings, Template, LAN & Side Pane Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [isLanModalOpen, setIsLanModalOpen] = useState(false);
  const [isSidePaneOpen, setIsSidePaneOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveFirmProfile(firmProfile);
  }, [firmProfile]);

  useEffect(() => {
    saveProposals(proposals);
  }, [proposals]);

  useEffect(() => {
    saveInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    savePayments(payments);
  }, [payments]);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveSalaries(salaries);
  }, [salaries]);

  useEffect(() => {
    saveFreelanceTemplates(freelanceTemplates);
  }, [freelanceTemplates]);

  useEffect(() => {
    saveAppModulesConfig(modulesConfig);
  }, [modulesConfig]);

  useEffect(() => {
    saveAppSecurityConfig(securityConfig);
  }, [securityConfig]);

  // Financial Summary Calculation
  const summary: FinancialSummary = calculateFinancialSummary(invoices, payments, expenses, salaries);

  // ================= Proposal Actions =================
  const handleNewProposal = () => {
    setEditingProposal(null);
    setIsProposalModalOpen(true);
  };

  const handleEditProposal = (prop: ProjectProposal) => {
    setEditingProposal(prop);
    setIsProposalModalOpen(true);
  };

  const handleSaveProposal = (savedProp: ProjectProposal) => {
    const existingIndex = proposals.findIndex((p) => p.id === savedProp.id);
    if (existingIndex >= 0) {
      const updated = [...proposals];
      updated[existingIndex] = savedProp;
      setProposals(updated);
    } else {
      setProposals([savedProp, ...proposals]);
    }
  };

  const handleDeleteProposal = (id: string) => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      setProposals(proposals.filter((p) => p.id !== id));
    }
  };

  const handleDuplicateProposal = (prop: ProjectProposal) => {
    const newProp: ProjectProposal = {
      ...prop,
      id: `prop-${Date.now()}`,
      proposalNumber: generateNextProposalNumber(proposals),
      projectTitle: `${prop.projectTitle} (Copy)`,
      status: 'DRAFT',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProposals([newProp, ...proposals]);
    setActiveTab('proposals');
  };

  const handleCreateInvoiceFromProposal = (prop: ProjectProposal) => {
    setPreselectedProposalForInvoice(prop);
    setEditingInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  // ================= Invoice Actions =================
  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setPreselectedProposalForInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  const handleEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setPreselectedProposalForInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  const handleSaveInvoice = (savedInv: Invoice) => {
    const existingIndex = invoices.findIndex((i) => i.id === savedInv.id);
    if (existingIndex >= 0) {
      const updated = [...invoices];
      updated[existingIndex] = savedInv;
      setInvoices(updated);
    } else {
      setInvoices([savedInv, ...invoices]);
    }
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice? Associated payment records will also be unlinked.')) {
      setInvoices(invoices.filter((i) => i.id !== id));
    }
  };

  // ================= Payment Actions =================
  const handleNewPayment = (targetInvoice?: Invoice) => {
    setPreselectedInvoiceForPayment(targetInvoice || null);
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = (payment: PaymentRecord) => {
    setPayments([payment, ...payments]);

    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === payment.invoiceId) {
        const newPaid = inv.paidAmount + payment.netAmountReceived;
        const newTds = inv.tdsDeducted + payment.tdsDeducted;
        const newBalance = Math.max(0, inv.totalAmount - (newPaid + newTds));
        
        let newStatus = inv.status;
        if (newBalance === 0) {
          newStatus = 'PAID';
        } else if (newPaid + newTds > 0) {
          newStatus = 'PARTIALLY_PAID';
        }

        return {
          ...inv,
          paidAmount: newPaid,
          tdsDeducted: newTds,
          balanceDue: newBalance,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
  };

  const handleDeletePayment = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    if (confirm(`Are you sure you want to delete receipt voucher ${payment.receiptNumber}? Invoice balance will be rolled back.`)) {
      const updatedInvoices = invoices.map((inv) => {
        if (inv.id === payment.invoiceId) {
          const newPaid = Math.max(0, inv.paidAmount - payment.netAmountReceived);
          const newTds = Math.max(0, inv.tdsDeducted - payment.tdsDeducted);
          const newBalance = inv.totalAmount - (newPaid + newTds);
          
          let newStatus = inv.status;
          if (newBalance === inv.totalAmount) {
            newStatus = 'UNPAID';
          } else if (newBalance > 0) {
            newStatus = 'PARTIALLY_PAID';
          } else {
            newStatus = 'PAID';
          }

          return {
            ...inv,
            paidAmount: newPaid,
            tdsDeducted: newTds,
            balanceDue: newBalance,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return inv;
      });

      setInvoices(updatedInvoices);
      setPayments(payments.filter((p) => p.id !== paymentId));
    }
  };

  // ================= Expense Actions =================
  const handleNewExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (savedExp: ExpenseItem) => {
    const existingIndex = expenses.findIndex(e => e.id === savedExp.id);
    if (existingIndex >= 0) {
      const updated = [...expenses];
      updated[existingIndex] = savedExp;
      setExpenses(updated);
    } else {
      setExpenses([savedExp, ...expenses]);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleToggleBilledExpense = (id: string) => {
    setExpenses(expenses.map(e => {
      if (e.id === id) {
        return { ...e, isBilledToClient: !e.isBilledToClient };
      }
      return e;
    }));
  };

  // ================= Salary Actions =================
  const handleNewSalary = () => {
    setEditingSalary(null);
    setIsSalaryModalOpen(true);
  };

  const handleEditSalary = (salary: SalaryRecord) => {
    setEditingSalary(salary);
    setIsSalaryModalOpen(true);
  };

  const handleSaveSalary = (savedSal: SalaryRecord) => {
    const existingIndex = salaries.findIndex(s => s.id === savedSal.id);
    if (existingIndex >= 0) {
      const updated = [...salaries];
      updated[existingIndex] = savedSal;
      setSalaries(updated);
    } else {
      setSalaries([savedSal, ...salaries]);
    }
  };

  const handleDeleteSalary = (id: string) => {
    setSalaries(salaries.filter(s => s.id !== id));
  };

  const handleToggleStatusSalary = (id: string) => {
    setSalaries(salaries.map(s => {
      if (s.id === id) {
        return {
          ...s,
          paymentStatus: s.paymentStatus === 'PAID' ? 'PENDING' : 'PAID'
        };
      }
      return s;
    }));
  };

  // ================= Freelance Template Actions =================
  const handleSaveTemplates = (updatedTemplates: FreelanceTemplate[]) => {
    setFreelanceTemplates(updatedTemplates);
  };

  // ================= App Settings & Security =================
  const handleSaveFirmSettings = (
    updatedProfile: FirmProfile,
    updatedModules: AppModulesConfig,
    updatedSecurity: AppSecurityConfig
  ) => {
    setFirmProfile(updatedProfile);
    setModulesConfig(updatedModules);
    setSecurityConfig(updatedSecurity);
  };

  // ================= Backup, Export, Reset =================
  const handleExportData = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Architect_Studio_Suite_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (customJson?: string) => {
    if (typeof customJson === 'string') {
      if (importAllDataFromJSON(customJson)) {
        setFirmProfile(loadFirmProfile());
        setProposals(loadProposals());
        setInvoices(loadInvoices());
        setPayments(loadPayments());
        setExpenses(loadExpenses());
        setSalaries(loadSalaries());
        setFreelanceTemplates(loadFreelanceTemplates());
        setModulesConfig(loadAppModulesConfig());
        setSecurityConfig(loadAppSecurityConfig());
        alert('Studio data imported successfully!');
      } else {
        alert('Invalid JSON file format.');
      }
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && importAllDataFromJSON(content)) {
          setFirmProfile(loadFirmProfile());
          setProposals(loadProposals());
          setInvoices(loadInvoices());
          setPayments(loadPayments());
          setExpenses(loadExpenses());
          setSalaries(loadSalaries());
          setFreelanceTemplates(loadFreelanceTemplates());
          setModulesConfig(loadAppModulesConfig());
          setSecurityConfig(loadAppSecurityConfig());
          alert('Studio data imported successfully!');
        } else {
          alert('Failed to parse backup JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetData = () => {
    if (confirm('Reset all records to Council of Architecture (CoA) sample practice defaults?')) {
      resetAllToSampleData();
      setFirmProfile(loadFirmProfile());
      setProposals(loadProposals());
      setInvoices(loadInvoices());
      setPayments(loadPayments());
      setExpenses(loadExpenses());
      setSalaries(loadSalaries());
      setFreelanceTemplates(loadFreelanceTemplates());
      setModulesConfig(loadAppModulesConfig());
      setSecurityConfig(loadAppSecurityConfig());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // If App is Locked, render Security Lock Screen
  if (isLocked) {
    return (
      <LockScreen
        securityConfig={securityConfig}
        firmProfile={firmProfile}
        onUnlock={() => setIsLocked(false)}
        onEmergencyReset={() => {
          const defaultSec: AppSecurityConfig = { 
            isLockEnabled: false, 
            pin: '1234',
            autoLockMinutes: 0
          };
          setSecurityConfig(defaultSec);
          saveAppSecurityConfig(defaultSec);
          setIsLocked(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#161616] font-sans flex flex-col antialiased">
      {/* Mobile Shell Wrapper */}
      <div className="w-full max-w-4xl mx-auto min-h-screen bg-white flex flex-col relative border-x border-[#e0e0e0] shadow-sm">
        
        {/* Main Content View (No Top Bar, Generous Mobile Spacing) */}
        <main className="flex-1 w-full px-3 sm:px-5 pt-4 sm:pt-6 pb-28">
          {activeTab === 'proposals' && modulesConfig.proposals && (
            <ProposalList
              proposals={proposals}
              firmProfile={firmProfile}
              onNewProposal={handleNewProposal}
              onEditProposal={handleEditProposal}
              onViewProposal={(p) => setViewingProposal(p)}
              onDeleteProposal={handleDeleteProposal}
              onDuplicateProposal={handleDuplicateProposal}
              onCreateInvoiceFromProposal={handleCreateInvoiceFromProposal}
            />
          )}

          {activeTab === 'invoices' && modulesConfig.invoices && (
            <InvoiceList
              invoices={invoices}
              firmProfile={firmProfile}
              onNewInvoice={handleNewInvoice}
              onEditInvoice={handleEditInvoice}
              onViewInvoice={(inv) => setViewingInvoice(inv)}
              onDeleteInvoice={handleDeleteInvoice}
              onRecordPayment={(inv) => handleNewPayment(inv)}
            />
          )}

          {activeTab === 'payments' && modulesConfig.payments && (
            <PaymentLedger
              payments={payments}
              invoices={invoices}
              firmProfile={firmProfile}
              onRecordPayment={(inv) => handleNewPayment(inv)}
              onViewReceipt={(pay) => setViewingPayment(pay)}
              onDeletePayment={handleDeletePayment}
            />
          )}

          {activeTab === 'expenses' && modulesConfig.expenses && (
            <ExpenseList
              expenses={expenses}
              invoices={invoices}
              onAddExpense={handleNewExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onToggleBilled={handleToggleBilledExpense}
            />
          )}

          {activeTab === 'salaries' && modulesConfig.salaries && (
            <SalaryList
              salaries={salaries}
              firmProfile={firmProfile}
              onAddSalary={handleNewSalary}
              onEditSalary={handleEditSalary}
              onDeleteSalary={handleDeleteSalary}
              onToggleStatus={handleToggleStatusSalary}
            />
          )}

          {activeTab === 'books' && modulesConfig.books && (
            <BooksDashboard
              invoices={invoices}
              payments={payments}
              expenses={expenses}
              salaries={salaries}
              firmProfile={firmProfile}
              summary={summary}
            />
          )}
        </main>

        {/* Floating Create Action Button (FAB) */}
        <FloatingCreateButton
          modulesConfig={modulesConfig}
          onNewProposal={handleNewProposal}
          onNewInvoice={handleNewInvoice}
          onNewPayment={() => handleNewPayment()}
          onNewExpense={handleNewExpense}
          onNewSalary={handleNewSalary}
        />

        {/* Sole Bottom Navigation Bar (No Top Bar) */}
        <BottomNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSidePane={() => setIsSidePaneOpen(true)}
          modulesConfig={modulesConfig}
        />
      </div>

      {/* Slide-over Side Pane Drawer */}
      <SidePaneDrawer
        isOpen={isSidePaneOpen}
        onClose={() => setIsSidePaneOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        firmProfile={firmProfile}
        modulesConfig={modulesConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTemplates={() => setIsTemplateManagerOpen(true)}
        onOpenLanModal={() => setIsLanModalOpen(true)}
        onLockApp={() => setIsLocked(true)}
        onExportData={handleExportData}
        onImportData={() => handleImportData()}
        onResetData={handleResetData}
        counts={{
          proposals: proposals.length,
          invoices: invoices.length,
          payments: payments.length,
          expenses: expenses.length,
          salaries: salaries.length
        }}
      />

      {/* Modals & Overlays */}
      {isProposalModalOpen && (
        <ProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          onSave={handleSaveProposal}
          initialProposal={editingProposal}
          generatedProposalNumber={generateNextProposalNumber(proposals)}
          firmProfile={firmProfile}
          freelanceTemplates={freelanceTemplates}
        />
      )}

      {viewingProposal && (
        <ProposalView
          proposal={viewingProposal}
          firmProfile={firmProfile}
          onClose={() => setViewingProposal(null)}
          onPrint={handlePrint}
        />
      )}

      {isInvoiceModalOpen && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setPreselectedProposalForInvoice(null);
          }}
          onSave={handleSaveInvoice}
          initialInvoice={editingInvoice}
          generatedInvoiceNumber={generateNextInvoiceNumber(invoices)}
          proposals={proposals}
          firmProfile={firmProfile}
          preselectedProposal={preselectedProposalForInvoice}
          freelanceTemplates={freelanceTemplates}
        />
      )}

      {viewingInvoice && (
        <InvoiceView
          invoice={viewingInvoice}
          firmProfile={firmProfile}
          onClose={() => setViewingInvoice(null)}
          onPrint={handlePrint}
          onRecordPayment={(inv) => {
            setViewingInvoice(null);
            handleNewPayment(inv);
          }}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPreselectedInvoiceForPayment(null);
          }}
          onSave={handleSavePayment}
          invoices={invoices}
          firmProfile={firmProfile}
          preselectedInvoice={preselectedInvoiceForPayment}
          generatedReceiptNumber={generateNextReceiptNumber(payments)}
        />
      )}

      {viewingPayment && (
        <ReceiptView
          payment={viewingPayment}
          firmProfile={firmProfile}
          onClose={() => setViewingPayment(null)}
          onPrint={handlePrint}
        />
      )}

      {isExpenseModalOpen && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={handleSaveExpense}
          invoices={invoices}
          expenseToEdit={editingExpense}
        />
      )}

      {isSalaryModalOpen && (
        <SalaryModal
          isOpen={isSalaryModalOpen}
          onClose={() => setIsSalaryModalOpen(false)}
          onSave={handleSaveSalary}
          salaryToEdit={editingSalary}
        />
      )}

      {isSettingsOpen && (
        <FirmSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          firmProfile={firmProfile}
          modulesConfig={modulesConfig}
          securityConfig={securityConfig}
          onSave={handleSaveFirmSettings}
          onOpenTemplates={() => setIsTemplateManagerOpen(true)}
          onOpenLanModal={() => setIsLanModalOpen(true)}
          onExportData={handleExportData}
          onImportData={() => handleImportData()}
          onResetData={handleResetData}
        />
      )}

      {isTemplateManagerOpen && (
        <TemplateManagerModal
          isOpen={isTemplateManagerOpen}
          onClose={() => setIsTemplateManagerOpen(false)}
          templates={freelanceTemplates}
          onSaveTemplates={handleSaveTemplates}
        />
      )}

      {isLanModalOpen && (
        <LanShareModal
          isOpen={isLanModalOpen}
          onClose={() => setIsLanModalOpen(false)}
          firmProfile={firmProfile}
          onExportBackup={handleExportData}
          onImportBackup={(json) => handleImportData(json)}
        />
      )}
    </div>
  );
}
