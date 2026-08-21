import { TaxScheme } from '../types';

/**
 * Format numbers in standard Indian Rupee format (e.g., ₹ 1,50,000.00 or ₹ 12,45,000)
 */
export function formatINR(amount: number, showDecimals = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹ 0';
  }
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  };
  
  const formatted = new Intl.NumberFormat('en-IN', options).format(absAmount);
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Alias for formatINR with default 2 decimals
 */
export function formatCurrency(amount: number, showDecimals = true): string {
  return formatINR(amount, showDecimals);
}

/**
 * Format ISO date string to Indian readable date (e.g., "24 Aug 2026")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Convert number to words in Indian format (Rupees ... Lakhs / Crores ... Only)
 */
export function numberToWordsINR(num: number): string {
  if (num === 0) return 'Rupees Zero Only';
  if (isNaN(num)) return '';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  const integerPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - integerPart) * 100);

  let result = 'Rupees ' + inWords(integerPart);
  if (decimalPart > 0) {
    result += ' and ' + inWords(decimalPart) + ' Paise';
  }
  result += ' Only';

  return result;
}

export interface TaxCalculationResult {
  subtotal: number;
  taxScheme: TaxScheme;
  gstRate: number;
  isInterState: boolean;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
  statutoryDeclaration?: string;
}

/**
 * Computes GST breakdown according to tax scheme and location
 */
export function calculateGstBreakdown(
  subtotal: number,
  taxScheme: TaxScheme,
  sellerStateCode: string,
  buyerStateCode: string,
  customGstRate?: number
): TaxCalculationResult {
  const isInterState = Boolean(
    sellerStateCode &&
    buyerStateCode &&
    sellerStateCode.trim() !== '' &&
    buyerStateCode.trim() !== '' &&
    sellerStateCode.trim() !== buyerStateCode.trim()
  );

  if (taxScheme === 'NO_GST') {
    return {
      subtotal,
      taxScheme,
      gstRate: 0,
      isInterState: false,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalTax: 0,
      totalAmount: subtotal,
      statutoryDeclaration: 'Supply not subject to GST / Below threshold exemption or unregistered'
    };
  }

  if (taxScheme === 'COMPOSITION_GST') {
    // Under Section 10(2A) for Service Providers, standard composition rate is 6% (3% CGST + 3% SGST).
    // Note: Composition dealers issue 'Bill of Supply' and cannot collect tax separately from recipient on B2C/B2B or can show 6% nominal rate
    const compRate = customGstRate !== undefined ? customGstRate : 6;
    const cgstRate = compRate / 2; // 3%
    const sgstRate = compRate / 2; // 3%
    const cgstAmount = (subtotal * cgstRate) / 100;
    const sgstAmount = (subtotal * sgstRate) / 100;
    const totalTax = cgstAmount + sgstAmount;
    
    return {
      subtotal,
      taxScheme,
      gstRate: compRate,
      isInterState: false, // Composition dealers can generally supply intra-state
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate: 0,
      igstAmount: 0,
      totalTax,
      totalAmount: subtotal + totalTax,
      statutoryDeclaration: 'Composition taxable person under Section 10(2A), not eligible to collect tax on supplies (Bill of Supply)'
    };
  }

  // REGULAR_GST
  const regularRate = customGstRate !== undefined ? customGstRate : 18;
  
  if (isInterState) {
    const igstRate = regularRate;
    const igstAmount = (subtotal * igstRate) / 100;
    return {
      subtotal,
      taxScheme,
      gstRate: regularRate,
      isInterState: true,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate,
      igstAmount,
      totalTax: igstAmount,
      totalAmount: subtotal + igstAmount,
    };
  } else {
    const cgstRate = regularRate / 2; // 9%
    const sgstRate = regularRate / 2; // 9%
    const cgstAmount = (subtotal * cgstRate) / 100;
    const sgstAmount = (subtotal * sgstRate) / 100;
    const totalTax = cgstAmount + sgstAmount;
    return {
      subtotal,
      taxScheme,
      gstRate: regularRate,
      isInterState: false,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate: 0,
      igstAmount: 0,
      totalTax,
      totalAmount: subtotal + totalTax,
    };
  }
}

/**
 * Helper to get current Indian Financial Year string (e.g. "2026-27")
 */
export function getCurrentFinancialYear(): string {
  const today = new Date();
  const month = today.getMonth(); // 0-11. April is 3
  const year = today.getFullYear();
  
  if (month >= 3) {
    const nextYearShort = (year + 1).toString().slice(-2);
    return `${year}-${nextYearShort}`;
  } else {
    const yearShort = year.toString().slice(-2);
    return `${year - 1}-${yearShort}`;
  }
}
