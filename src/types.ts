export type TaxScheme = 'NO_GST' | 'REGULAR_GST' | 'COMPOSITION_GST';

export type FeeModel = 'PERCENTAGE_COST' | 'PER_SQFT' | 'LUMP_SUM';

export type ProposalStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'ARCHIVED';

export type InvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type InvoiceType = 'TAX_INVOICE' | 'PROFORMA_INVOICE' | 'BILL_OF_SUPPLY';

export type PaymentMethod = 'NEFT_RTGS' | 'UPI' | 'IMPS' | 'CHEQUE' | 'BANK_TRANSFER' | 'CASH';

export type FirmType = 'FREELANCER' | 'PROPRIETORSHIP' | 'PARTNERSHIP' | 'LLP' | 'PVT_LTD';

export interface PartnerInfo {
  id: string;
  name: string;
  coaRegistrationNo?: string;
  designation: string;
  sharePercentage?: number;
  phone?: string;
  email?: string;
}

export interface CoaStage {
  id: string;
  stageNumber: number;
  name: string;
  shortName: string;
  description: string;
  deliverables: string[];
  percentageOfFee: number; // percentage e.g. 15 for 15%
}

export interface ProposalMilestone {
  stageId: string;
  stageNumber: number;
  name: string;
  deliverables: string;
  percentage: number;
  amount: number;
  isCustom?: boolean;
}

export interface ClientInfo {
  name: string;
  organization?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  pan?: string;
}

export interface FirmProfile {
  firmType: FirmType;
  firmName: string;
  architectName: string;
  coaRegistrationNo: string; // e.g. "CA/2015/72890"
  iiaNumber?: string;
  qualification: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  stateCode: string; // e.g. "27" for Maharashtra, "29" for Karnataka, "07" for Delhi
  pincode: string;
  website?: string;
  pan: string;
  gstin?: string;
  cinOrLlpin?: string;
  partners?: PartnerInfo[];
  defaultTaxScheme: TaxScheme;
  compositionSchemeDeclaration?: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId?: string;
  standardPaymentTerms: string;
  sacCodeDefault: string; // e.g. "998321" (Architectural Services)
}

export interface ProjectProposal {
  id: string;
  proposalNumber: string; // e.g. "PROP/2026-27/012"
  date: string;
  validUntil: string;
  client: ClientInfo;
  projectTitle: string;
  projectType: string; // e.g. "Residential Villa", "Commercial Complex", "Interior Fit-out"
  siteLocation: string;
  builtUpAreaSqFt?: number;
  estimatedCostOfWork?: number;
  
  // Fee Calculation
  feeModel: FeeModel;
  percentageRate?: number; // e.g. 5 for 5% of cost of work
  ratePerSqFt?: number; // e.g. 150 for ₹150/sqft
  lumpSumFee?: number;
  totalEstimatedFee: number;
  
  taxScheme: TaxScheme;
  gstRate: number; // 0, 6, or 18
  
  // CoA Scope & Milestones
  milestones: ProposalMilestone[];
  scopeOfWorkClauses: string[];
  reimbursableExpensesNotes: string;
  termsAndConditions: string[];
  
  status: ProposalStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  stageName?: string;
  sacCode: string; // default 998321
  percentageBilled?: number;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV/2026-27/005"
  type: InvoiceType;
  date: string;
  dueDate: string;
  
  proposalId?: string;
  projectTitle: string;
  client: ClientInfo;
  
  // Tax Info
  taxScheme: TaxScheme;
  placeOfSupply: string; // State
  placeOfSupplyStateCode: string;
  isInterState: boolean; // if true, IGST; if false, CGST+SGST
  
  lineItems: InvoiceLineItem[];
  subtotal: number;
  
  // Tax Amounts
  gstRate: number; // 0 for NO_GST, 6 for COMPOSITION_GST (or billed as Bill of Supply), 18 for REGULAR_GST
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  
  totalAmount: number;
  
  // Payments received on this invoice
  paidAmount: number;
  tdsDeducted: number; // Total TDS deducted by client (e.g. 10% u/s 194J)
  balanceDue: number;
  
  status: InvoiceStatus;
  notes?: string;
  termsAndConditions?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string; // e.g. "REC/2026-27/008"
  paymentDate: string;
  invoiceId: string;
  invoiceNumber: string;
  proposalId?: string;
  projectTitle: string;
  clientName: string;
  
  netAmountReceived: number; // Actual amount received in bank/cash
  tdsDeducted: number; // TDS deducted under 194J (credited in 26AS)
  grossAmountSettled: number; // netAmountReceived + tdsDeducted
  
  paymentMethod: PaymentMethod;
  transactionReference: string; // UTR, Cheque No, UPI ref, etc.
  bankAccountCredited?: string;
  notes?: string;
  
  createdAt: string;
}

export type ExpenseCategory = 
  | 'PRINTING_PLOTTING'
  | 'RENDER_3D_COMPUTE'
  | 'MODEL_MAKING'
  | 'TRAVEL_SITE_VISIT'
  | 'MUNICIPAL_SANCTIONS'
  | 'SURVEY_SOIL_TEST'
  | 'SUB_CONSULTANT_FEE'
  | 'SOFTWARE_SUBSCRIPTIONS'
  | 'STATIONERY_SUPPLIES'
  | 'STUDIO_RENT_UTILITIES'
  | 'HARDWARE_EQUIPMENT'
  | 'CLIENT_MEETINGS'
  | 'MISCELLANEOUS';

export interface ExpenseItem {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  isBillable: boolean; // Billable to Client vs Non-Billable Studio Overhead
  projectId?: string;
  projectTitle?: string;
  clientName?: string;
  isBilled: boolean; // Whether already added to an invoice
  invoiceNumber?: string;
  paymentMethod: PaymentMethod;
  vendorOrPayee: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONSULTANT' | 'INTERN_STIPEND' | 'PARTNER_DRAW';

export interface SalaryRecord {
  id: string;
  monthYear: string; // e.g. "2026-08"
  paymentDate: string;
  employeeName: string;
  role: string; // e.g. "Senior Architect", "3D Visualizer", "Intern", "Partner"
  employmentType: EmploymentType;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tdsDeducted: number; // TDS deducted under Sec 192/194J
  netPaid: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  paymentStatus: 'PAID' | 'PENDING';
  notes?: string;
  createdAt: string;
}

export interface FreelanceTemplateItem {
  id: string;
  name: string;
  deliverables: string;
  percentage: number;
  amount: number;
  sacCode?: string;
}

export interface FreelanceTemplate {
  id: string;
  title: string;
  category: string; // e.g. "3D Visualization", "Sanctions", "Interior Space Planning", "Drafting"
  description: string;
  lumpSumRate: number;
  sacCode: string;
  items: FreelanceTemplateItem[];
  isCustom?: boolean;
}

export interface AppModulesConfig {
  proposals: boolean;
  invoices: boolean;
  payments: boolean;
  expenses: boolean;
  salaries: boolean;
  books: boolean;
  freelanceTemplates: boolean;
}

export interface AppSecurityConfig {
  isLockEnabled: boolean;
  pin: string; // 4-6 digit numeric pin
  autoLockMinutes: number; // 0 for immediate on unfocus, 1, 5, 15, 30, -1 for never
  securityHint?: string;
}

export interface FinancialSummary {
  totalFeeInvoiced: number;
  totalCollectedNet: number;
  totalTdsDeducted: number;
  totalSettledGross: number;
  totalOutstandingBalance: number;
  
  // Expenses & Salaries
  totalExpenses: number;
  totalBillableExpenses: number;
  totalNonBillableExpenses: number;
  totalUnbilledExpenses: number;
  totalBilledExpenses: number;
  totalSalariesPaid: number;
  
  // Studio Net Operating Profit
  netStudioOperatingProfit: number;
  
  totalRegularGstInvoiced: number;
  totalCompositionTaxInvoiced: number;
  invoicesCount: number;
  paidInvoicesCount: number;
  pendingInvoicesCount: number;
}

