import React, { useState, useEffect } from 'react';
import { SalaryRecord, EmploymentType, PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/taxCalculations';
import { X, Check, Users, Calculator, ShieldCheck } from 'lucide-react';

interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salary: SalaryRecord) => void;
  salaryToEdit?: SalaryRecord | null;
}

const ROLES = [
  'Principal Architect / Partner',
  'Senior Associate Architect',
  'Project Architect',
  'Junior Architect',
  'Senior 3D Visualizer & BIM Lead',
  'CAD Draftsman & Detailer',
  'Interior Designer & Stylist',
  'Site Engineer / Supervisor',
  'Architectural Intern (Trainee)',
  'Studio Admin / Accountant'
];

export const SalaryModal: React.FC<SalaryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  salaryToEdit
}) => {
  const [monthYear, setMonthYear] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [employeeName, setEmployeeName] = useState<string>('');
  const [role, setRole] = useState<string>(ROLES[1]);
  const [employmentType, setEmploymentType] = useState<EmploymentType>('FULL_TIME');
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [tdsDeducted, setTdsDeducted] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NEFT_RTGS');
  const [transactionReference, setTransactionReference] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING'>('PAID');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (salaryToEdit) {
      setMonthYear(salaryToEdit.monthYear);
      setPaymentDate(salaryToEdit.paymentDate);
      setEmployeeName(salaryToEdit.employeeName);
      setRole(salaryToEdit.role);
      setEmploymentType(salaryToEdit.employmentType);
      setBasicSalary(salaryToEdit.basicSalary);
      setAllowances(salaryToEdit.allowances);
      setDeductions(salaryToEdit.deductions);
      setTdsDeducted(salaryToEdit.tdsDeducted);
      setPaymentMethod(salaryToEdit.paymentMethod);
      setTransactionReference(salaryToEdit.transactionReference);
      setPaymentStatus(salaryToEdit.paymentStatus);
      setNotes(salaryToEdit.notes || '');
    } else {
      setMonthYear(new Date().toISOString().slice(0, 7));
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setEmployeeName('');
      setRole(ROLES[1]);
      setEmploymentType('FULL_TIME');
      setBasicSalary(35000);
      setAllowances(0);
      setDeductions(0);
      setTdsDeducted(0);
      setPaymentMethod('NEFT_RTGS');
      setTransactionReference('');
      setPaymentStatus('PAID');
      setNotes('');
    }
  }, [salaryToEdit, isOpen]);

  if (!isOpen) return null;

  const netPayable = Math.max(0, (Number(basicSalary) || 0) + (Number(allowances) || 0) - (Number(deductions) || 0) - (Number(tdsDeducted) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim() || basicSalary <= 0) {
      alert('Please provide team member name and valid basic salary.');
      return;
    }

    const salary: SalaryRecord = {
      id: salaryToEdit ? salaryToEdit.id : `sal-${Date.now()}`,
      monthYear,
      paymentDate,
      employeeName: employeeName.trim(),
      role,
      employmentType,
      basicSalary: Number(basicSalary),
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      tdsDeducted: Number(tdsDeducted) || 0,
      netPaid: netPayable,
      paymentMethod,
      transactionReference: transactionReference.trim() || 'SAL-DISBURSEMENT',
      paymentStatus,
      notes: notes.trim() || undefined,
      createdAt: salaryToEdit ? salaryToEdit.createdAt : new Date().toISOString()
    };

    onSave(salary);
    onClose();
  };

  return (
    <div id="salary-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 overflow-y-auto">
      <div id="salary-modal-container" className="w-full max-w-lg bg-[#ffffff] text-[#161616] border border-[#393939] shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#161616] text-[#ffffff] border-b border-[#393939]">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#0f62fe]"></div>
            <h2 className="text-base font-bold tracking-tight uppercase">
              {salaryToEdit ? 'Edit Salary / Payroll Record' : 'Record Salary / Stipend / Consultant Draw'}
            </h2>
          </div>
          <button
            id="close-salary-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-[#393939] text-[#ffffff] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Month & Payment Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Payroll Month (YYYY-MM) *
              </label>
              <input
                type="month"
                id="salary-month-input"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                required
                className="carbon-input w-full p-2 text-sm font-mono text-[#161616]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Disbursement Date *
              </label>
              <input
                type="date"
                id="salary-payment-date-input"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="carbon-input w-full p-2 text-sm font-mono text-[#161616]"
              />
            </div>
          </div>

          {/* Employee Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
              Architect / Team Member Name *
            </label>
            <input
              type="text"
              id="salary-employee-name-input"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="e.g. Ar. Ananya Sharma"
              required
              className="carbon-input w-full p-2 text-sm text-[#161616]"
            />
          </div>

          {/* Role & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Designation / Role
              </label>
              <select
                id="salary-role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="carbon-input w-full p-2 text-sm text-[#161616]"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Contract Type
              </label>
              <select
                id="salary-employment-type-select"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="carbon-input w-full p-2 text-sm text-[#161616]"
              >
                <option value="FULL_TIME">Full-Time Studio Staff</option>
                <option value="PART_TIME">Part-Time</option>
                <option value="CONSULTANT">Retainer / Consultant</option>
                <option value="INTERN_STIPEND">Internship Stipend</option>
                <option value="PARTNER_DRAW">Partner Profit Draw</option>
              </select>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#161616]">
              Earnings & Deductions (₹ INR)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                  Basic Salary / Stipend *
                </label>
                <input
                  type="number"
                  id="salary-basic-input"
                  min="0"
                  value={basicSalary || ''}
                  onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                  className="carbon-input w-full p-2 text-sm font-mono font-bold text-[#161616]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                  Allowances / Special Pay
                </label>
                <input
                  type="number"
                  id="salary-allowances-input"
                  min="0"
                  value={allowances || ''}
                  onChange={(e) => setAllowances(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="carbon-input w-full p-2 text-sm font-mono text-[#161616]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e0e0e0]">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                  Deductions / PT
                </label>
                <input
                  type="number"
                  id="salary-deductions-input"
                  min="0"
                  value={deductions || ''}
                  onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="carbon-input w-full p-2 text-sm font-mono text-[#161616]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                  TDS Withheld (192 / 194J)
                </label>
                <input
                  type="number"
                  id="salary-tds-input"
                  min="0"
                  value={tdsDeducted || ''}
                  onChange={(e) => setTdsDeducted(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="carbon-input w-full p-2 text-sm font-mono text-[#161616]"
                />
              </div>
            </div>

            {/* Net Calculation Tile */}
            <div className="p-3 bg-[#161616] text-white flex items-center justify-between border border-[#393939]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8d8d8d]">Net Take-Home Pay</span>
                <p className="text-xs text-[#8d8d8d]">(Basic + Allowances - Deductions - TDS)</p>
              </div>
              <span className="text-xl font-black font-mono text-[#0f62fe]">
                {formatCurrency(netPayable)}
              </span>
            </div>
          </div>

          {/* Payment Method & Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                Disbursement Mode
              </label>
              <select
                id="salary-payment-method-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="carbon-input w-full p-2 text-sm text-[#161616]"
              >
                <option value="NEFT_RTGS">Bank Direct NEFT / RTGS</option>
                <option value="UPI">UPI Direct Transfer</option>
                <option value="IMPS">IMPS Instant Transfer</option>
                <option value="CHEQUE">Bank Cheque</option>
                <option value="CASH">Cash Voucher</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                UTR / Cheque Ref No.
              </label>
              <input
                type="text"
                id="salary-reference-input"
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                placeholder="e.g. UTR-HDFC-99120"
                className="carbon-input w-full p-2 text-sm font-mono text-[#161616]"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="flex items-center space-x-4 p-3 bg-[#f4f4f4] border border-[#e0e0e0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#525252]">Payment Status:</span>
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="salaryStatus"
                value="PAID"
                checked={paymentStatus === 'PAID'}
                onChange={() => setPaymentStatus('PAID')}
                className="accent-[#24a148]"
              />
              <span className="text-[#0f6225]">Disbursed (PAID)</span>
            </label>
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="salaryStatus"
                value="PENDING"
                checked={paymentStatus === 'PENDING'}
                onChange={() => setPaymentStatus('PENDING')}
                className="accent-[#da1e28]"
              />
              <span className="text-[#da1e28]">Scheduled / Pending</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#e0e0e0]">
            <button
              type="button"
              id="cancel-salary-btn"
              onClick={onClose}
              className="carbon-btn-ghost px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-salary-btn"
              className="carbon-btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
            >
              <Check className="w-4 h-4 mr-1" />
              {salaryToEdit ? 'Save Changes' : 'Record Salary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
