import { 
  FirmProfile, 
  ProjectProposal, 
  Invoice, 
  PaymentRecord, 
  FinancialSummary, 
  FreelanceTemplate,
  ExpenseItem,
  SalaryRecord,
  AppModulesConfig,
  AppSecurityConfig
} from '../types';
import { 
  INITIAL_FIRM_PROFILE, 
  INITIAL_PROPOSALS, 
  INITIAL_INVOICES, 
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_SALARIES,
  INITIAL_MODULES_CONFIG,
  INITIAL_SECURITY_CONFIG
} from '../data/initialData';
import { INITIAL_FREELANCE_TEMPLATES } from '../data/freelanceTemplates';
import { getCurrentFinancialYear } from './taxCalculations';

const STORAGE_KEYS = {
  FIRM_PROFILE: 'coa_arch_firm_profile_v2',
  PROPOSALS: 'coa_arch_proposals_v2',
  INVOICES: 'coa_arch_invoices_v2',
  PAYMENTS: 'coa_arch_payments_v2',
  TEMPLATES: 'coa_arch_freelance_templates_v2',
  EXPENSES: 'coa_arch_expenses_v2',
  SALARIES: 'coa_arch_salaries_v2',
  MODULES: 'coa_arch_modules_v2',
  SECURITY: 'coa_arch_security_v2'
};

export function loadFirmProfile(): FirmProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FIRM_PROFILE);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load firm profile', e);
  }
  return INITIAL_FIRM_PROFILE;
}

export function saveFirmProfile(profile: FirmProfile): void {
  localStorage.setItem(STORAGE_KEYS.FIRM_PROFILE, JSON.stringify(profile));
}

export function loadModulesConfig(): AppModulesConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MODULES);
    if (saved) return { ...INITIAL_MODULES_CONFIG, ...JSON.parse(saved) };
  } catch (e) {
    console.error('Failed to load modules config', e);
  }
  return INITIAL_MODULES_CONFIG;
}

export const loadAppModulesConfig = loadModulesConfig;

export function saveModulesConfig(config: AppModulesConfig): void {
  localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(config));
}

export const saveAppModulesConfig = saveModulesConfig;

export function loadSecurityConfig(): AppSecurityConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SECURITY);
    if (saved) return { ...INITIAL_SECURITY_CONFIG, ...JSON.parse(saved) };
  } catch (e) {
    console.error('Failed to load security config', e);
  }
  return INITIAL_SECURITY_CONFIG;
}

export const loadAppSecurityConfig = loadSecurityConfig;

export function saveSecurityConfig(config: AppSecurityConfig): void {
  localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(config));
}

export const saveAppSecurityConfig = saveSecurityConfig;

export function loadFreelanceTemplates(): FreelanceTemplate[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load freelance templates', e);
  }
  return INITIAL_FREELANCE_TEMPLATES;
}

export function saveFreelanceTemplates(templates: FreelanceTemplate[]): void {
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
}

export function loadProposals(): ProjectProposal[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load proposals', e);
  }
  return INITIAL_PROPOSALS;
}

export function saveProposals(proposals: ProjectProposal[]): void {
  localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
}

export function loadInvoices(): Invoice[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load invoices', e);
  }
  return INITIAL_INVOICES;
}

export function saveInvoices(invoices: Invoice[]): void {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
}

export function loadPayments(): PaymentRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load payments', e);
  }
  return INITIAL_PAYMENTS;
}

export function savePayments(payments: PaymentRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
}

export function loadExpenses(): ExpenseItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load expenses', e);
  }
  return INITIAL_EXPENSES;
}

export function saveExpenses(expenses: ExpenseItem[]): void {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export function loadSalaries(): SalaryRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SALARIES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load salaries', e);
  }
  return INITIAL_SALARIES;
}

export function saveSalaries(salaries: SalaryRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));
}

export function resetAllToSampleData(): void {
  localStorage.setItem(STORAGE_KEYS.FIRM_PROFILE, JSON.stringify(INITIAL_FIRM_PROFILE));
  localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(INITIAL_PROPOSALS));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
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
    proposals: loadProposals(),
    invoices: loadInvoices(),
    payments: loadPayments(),
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
    if (Array.isArray(data.proposals)) saveProposals(data.proposals);
    if (Array.isArray(data.invoices)) saveInvoices(data.invoices);
    if (Array.isArray(data.payments)) savePayments(data.payments);
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
  invoices: Invoice[], 
  payments: PaymentRecord[],
  expenses: ExpenseItem[] = [],
  salaries: SalaryRecord[] = []
): FinancialSummary {
  let totalFeeInvoiced = 0;
  let totalRegularGstInvoiced = 0;
  let totalCompositionTaxInvoiced = 0;
  let totalOutstandingBalance = 0;
  
  let paidInvoicesCount = 0;
  let pendingInvoicesCount = 0;

  invoices.forEach((inv) => {
    totalFeeInvoiced += inv.totalAmount;
    totalOutstandingBalance += inv.balanceDue;

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

  payments.forEach((p) => {
    totalCollectedNet += p.netAmountReceived;
    totalTdsDeducted += p.tdsDeducted;
    totalSettledGross += p.grossAmountSettled;
  });

  // Expenses calculations
  let totalExpenses = 0;
  let totalBillableExpenses = 0;
  let totalNonBillableExpenses = 0;
  let totalUnbilledExpenses = 0;
  let totalBilledExpenses = 0;

  expenses.forEach((e) => {
    totalExpenses += e.amount;
    if (e.isBillable) {
      totalBillableExpenses += e.amount;
      if (e.isBilled) {
        totalBilledExpenses += e.amount;
      } else {
        totalUnbilledExpenses += e.amount;
      }
    } else {
      totalNonBillableExpenses += e.amount;
    }
  });

  // Salaries calculation
  let totalSalariesPaid = 0;
  salaries.forEach((s) => {
    if (s.paymentStatus === 'PAID') {
      totalSalariesPaid += s.netPaid + s.tdsDeducted;
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
    invoicesCount: invoices.length,
    paidInvoicesCount,
    pendingInvoicesCount
  };
}

