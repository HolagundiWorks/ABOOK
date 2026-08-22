import { 
  FirmProfile, 
  ProjectProposal, 
  Invoice, 
  PaymentRecord, 
  FinancialSummary, 
  FreelanceTemplate,
  ExpenseItem,
  SalaryRecord,
  ClientProfile,
  AppModulesConfig,
  AppSecurityConfig,
  SiteInspectionLog,
  PaymentReminder
} from '../types';
import { 
  INITIAL_FIRM_PROFILE, 
  INITIAL_PROPOSALS, 
  INITIAL_INVOICES, 
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_SALARIES,
  INITIAL_CLIENTS,
  INITIAL_MODULES_CONFIG,
  INITIAL_SECURITY_CONFIG,
  INITIAL_SITE_UPDATES,
  INITIAL_PAYMENT_REMINDERS
} from '../data/initialData';
import { INITIAL_FREELANCE_TEMPLATES } from '../data/freelanceTemplates';
import { getCurrentFinancialYear } from './taxCalculations';

const STORAGE_KEYS = {
  FIRM_PROFILE: 'coa_arch_firm_profile_v2',
  CLIENTS: 'coa_arch_clients_v2',
  PROPOSALS: 'coa_arch_proposals_v2',
  INVOICES: 'coa_arch_invoices_v2',
  PAYMENTS: 'coa_arch_payments_v2',
  SITE_UPDATES: 'coa_arch_site_updates_v2',
  REMINDERS: 'coa_arch_reminders_v2',
  TEMPLATES: 'coa_arch_freelance_templates_v2',
  EXPENSES: 'coa_arch_expenses_v2',
  SALARIES: 'coa_arch_salaries_v2',
  MODULES: 'coa_arch_modules_v2',
  SECURITY: 'coa_arch_security_v2'
};

export function loadClients(): ClientProfile[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load clients', e);
  }
  return INITIAL_CLIENTS;
}

export function saveClients(clients: ClientProfile[]): void {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients || []));
}

export function generateNextClientCode(existingClients: ClientProfile[]): string {
  const currentYear = new Date().getFullYear();
  const count = (existingClients || []).length + 1;
  return `CL-${currentYear}-${count.toString().padStart(3, '0')}`;
}

export function loadFirmProfile(): FirmProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FIRM_PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') return { ...INITIAL_FIRM_PROFILE, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load firm profile', e);
  }
  return INITIAL_FIRM_PROFILE;
}

export function saveFirmProfile(profile: FirmProfile): void {
  localStorage.setItem(STORAGE_KEYS.FIRM_PROFILE, JSON.stringify(profile || INITIAL_FIRM_PROFILE));
}

export function loadModulesConfig(): AppModulesConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MODULES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') return { ...INITIAL_MODULES_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load modules config', e);
  }
  return INITIAL_MODULES_CONFIG;
}

export const loadAppModulesConfig = loadModulesConfig;

export function saveModulesConfig(config: AppModulesConfig): void {
  localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(config || INITIAL_MODULES_CONFIG));
}

export const saveAppModulesConfig = saveModulesConfig;

export function loadSecurityConfig(): AppSecurityConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SECURITY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') return { ...INITIAL_SECURITY_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load security config', e);
  }
  return INITIAL_SECURITY_CONFIG;
}

export const loadAppSecurityConfig = loadSecurityConfig;

export function saveSecurityConfig(config: AppSecurityConfig): void {
  localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(config || INITIAL_SECURITY_CONFIG));
}

export const saveAppSecurityConfig = saveSecurityConfig;

export function loadFreelanceTemplates(): FreelanceTemplate[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load freelance templates', e);
  }
  return INITIAL_FREELANCE_TEMPLATES;
}

export function saveFreelanceTemplates(templates: FreelanceTemplate[]): void {
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates || []));
}

export function loadProposals(): ProjectProposal[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load proposals', e);
  }
  return INITIAL_PROPOSALS;
}

export function saveProposals(proposals: ProjectProposal[]): void {
  localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals || []));
}

export function loadInvoices(): Invoice[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load invoices', e);
  }
  return INITIAL_INVOICES;
}

export function saveInvoices(invoices: Invoice[]): void {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices || []));
}

export function loadPayments(): PaymentRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load payments', e);
  }
  return INITIAL_PAYMENTS;
}

export function savePayments(payments: PaymentRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments || []));
}

export function loadExpenses(): ExpenseItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load expenses', e);
  }
  return INITIAL_EXPENSES;
}

export function saveExpenses(expenses: ExpenseItem[]): void {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses || []));
}

export function loadSalaries(): SalaryRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SALARIES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load salaries', e);
  }
  return INITIAL_SALARIES;
}

export function saveSalaries(salaries: SalaryRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries || []));
}

export function loadSiteUpdates(): SiteInspectionLog[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SITE_UPDATES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load site updates', e);
  }
  return INITIAL_SITE_UPDATES;
}

export function saveSiteUpdates(updates: SiteInspectionLog[]): void {
  localStorage.setItem(STORAGE_KEYS.SITE_UPDATES, JSON.stringify(updates || []));
}

export function generateNextSiteInspectionNumber(existingUpdates: SiteInspectionLog[]): string {
  const fy = getCurrentFinancialYear();
  const count = (existingUpdates || []).length + 1;
  return `SITE/${fy}/${count.toString().padStart(3, '0')}`;
}

export function generateNextCertificateNumber(existingUpdates: SiteInspectionLog[]): string {
  const year = new Date().getFullYear();
  const count = (existingUpdates || []).filter((u) => u.certificateNumber).length + 1;
  return `CERT/PROG/${year}/${count.toString().padStart(2, '0')}`;
}

export function loadPaymentReminders(): PaymentReminder[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load payment reminders', e);
  }
  return INITIAL_PAYMENT_REMINDERS;
}

export function savePaymentReminders(reminders: PaymentReminder[]): void {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders || []));
}

export function resetAllToSampleData(): void {
  localStorage.setItem(STORAGE_KEYS.FIRM_PROFILE, JSON.stringify(INITIAL_FIRM_PROFILE));
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(INITIAL_PROPOSALS));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
  localStorage.setItem(STORAGE_KEYS.SITE_UPDATES, JSON.stringify(INITIAL_SITE_UPDATES));
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(INITIAL_PAYMENT_REMINDERS));
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(INITIAL_SALARIES));
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_FREELANCE_TEMPLATES));
  localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES_CONFIG));
  localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(INITIAL_SECURITY_CONFIG));
}

export function exportAllDataAsJSON(): string {
  const data = {
    version: '2.0-carbon',
    exportDate: new Date().toISOString(),
    firmProfile: loadFirmProfile(),
    clients: loadClients(),
    proposals: loadProposals(),
    invoices: loadInvoices(),
    payments: loadPayments(),
    siteUpdates: loadSiteUpdates(),
    reminders: loadPaymentReminders(),
    expenses: loadExpenses(),
    salaries: loadSalaries(),
    templates: loadFreelanceTemplates(),
    modules: loadModulesConfig(),
    security: loadSecurityConfig()
  };
  return JSON.stringify(data, null, 2);
}

export function importAllDataFromJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.firmProfile) saveFirmProfile(data.firmProfile);
    if (Array.isArray(data.clients)) saveClients(data.clients);
    if (Array.isArray(data.proposals)) saveProposals(data.proposals);
    if (Array.isArray(data.invoices)) saveInvoices(data.invoices);
    if (Array.isArray(data.payments)) savePayments(data.payments);
    if (Array.isArray(data.siteUpdates)) saveSiteUpdates(data.siteUpdates);
    if (Array.isArray(data.reminders)) savePaymentReminders(data.reminders);
    if (Array.isArray(data.expenses)) saveExpenses(data.expenses);
    if (Array.isArray(data.salaries)) saveSalaries(data.salaries);
    if (Array.isArray(data.templates)) saveFreelanceTemplates(data.templates);
    if (data.modules) saveModulesConfig(data.modules);
    if (data.security) saveSecurityConfig(data.security);
    return true;
  } catch (e) {
    console.error('Error importing JSON data', e);
    return false;
  }
}

export function generateNextProposalNumber(existingProposals: ProjectProposal[]): string {
  const fy = getCurrentFinancialYear();
  const count = existingProposals.length + 1;
  return `PROP/${fy}/${count.toString().padStart(3, '0')}`;
}

export function generateNextInvoiceNumber(existingInvoices: Invoice[]): string {
  const fy = getCurrentFinancialYear();
  const count = existingInvoices.length + 1;
  return `INV/${fy}/${count.toString().padStart(3, '0')}`;
}

export function generateNextReceiptNumber(existingPayments: PaymentRecord[]): string {
  const fy = getCurrentFinancialYear();
  const count = existingPayments.length + 1;
  return `REC/${fy}/${count.toString().padStart(3, '0')}`;
}

export function calculateFinancialSummary(
  invoices: Invoice[] = [], 
  payments: PaymentRecord[] = [],
  expenses: ExpenseItem[] = [],
  salaries: SalaryRecord[] = []
): FinancialSummary {
  let totalFeeInvoiced = 0;
  let totalRegularGstInvoiced = 0;
  let totalCompositionTaxInvoiced = 0;
  let totalOutstandingBalance = 0;
  
  let paidInvoicesCount = 0;
  let pendingInvoicesCount = 0;

  (invoices || []).forEach((inv) => {
    const amt = typeof inv.totalAmount === 'number' ? inv.totalAmount : 0;
    const bal = typeof inv.balanceDue === 'number' ? inv.balanceDue : amt;
    totalFeeInvoiced += amt;
    totalOutstandingBalance += bal;

    if (inv.taxScheme === 'REGULAR_GST') {
      const tax = (inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0);
      totalRegularGstInvoiced += tax;
    } else if (inv.taxScheme === 'COMPOSITION_GST') {
      const tax = (inv.cgstAmount || 0) + (inv.sgstAmount || 0);
      totalCompositionTaxInvoiced += tax;
    }

    if (inv.status === 'PAID') {
      paidInvoicesCount++;
    } else if (inv.status === 'UNPAID' || inv.status === 'PARTIALLY_PAID' || inv.status === 'OVERDUE') {
      pendingInvoicesCount++;
    }
  });

  let totalCollectedNet = 0;
  let totalTdsDeducted = 0;
  let totalSettledGross = 0;

  (payments || []).forEach((p) => {
    totalCollectedNet += (p.netAmountReceived || 0);
    totalTdsDeducted += (p.tdsDeducted || 0);
    totalSettledGross += (p.grossAmountSettled || 0);
  });

  // Expenses calculations
  let totalExpenses = 0;
  let totalBillableExpenses = 0;
  let totalNonBillableExpenses = 0;
  let totalUnbilledExpenses = 0;
  let totalBilledExpenses = 0;

  (expenses || []).forEach((e) => {
    const amt = typeof e.amount === 'number' ? e.amount : 0;
    totalExpenses += amt;
    if (e.isBillable) {
      totalBillableExpenses += amt;
      if (e.isBilled) {
        totalBilledExpenses += amt;
      } else {
        totalUnbilledExpenses += amt;
      }
    } else {
      totalNonBillableExpenses += amt;
    }
  });

  // Salaries calculation
  let totalSalariesPaid = 0;
  (salaries || []).forEach((s) => {
    if (s.paymentStatus === 'PAID') {
      totalSalariesPaid += (s.netPaid || 0) + (s.tdsDeducted || 0);
    }
  });

  // Net Operating Profit = Total Net Realized Income - Total Studio Expenses - Total Salaries Paid
  const netStudioOperatingProfit = totalCollectedNet - totalExpenses - totalSalariesPaid;

  return {
    totalFeeInvoiced,
    totalCollectedNet,
    totalTdsDeducted,
    totalSettledGross,
    totalOutstandingBalance,
    totalExpenses,
    totalBillableExpenses,
    totalNonBillableExpenses,
    totalUnbilledExpenses,
    totalBilledExpenses,
    totalSalariesPaid,
    netStudioOperatingProfit,
    totalRegularGstInvoiced,
    totalCompositionTaxInvoiced,
    invoicesCount: (invoices || []).length,
    paidInvoicesCount,
    pendingInvoicesCount
  };
}

