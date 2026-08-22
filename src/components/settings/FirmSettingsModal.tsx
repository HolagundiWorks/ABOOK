import React, { useState } from 'react';
import { FirmProfile, TaxScheme, FirmType, PartnerInfo, AppModulesConfig, AppSecurityConfig } from '../../types';
import { INDIAN_STATES_AND_CODES } from '../../data/coaStandards';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Save,
  QrCode,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Briefcase,
  Layers,
  Lock,
  Plus,
  Trash2,
  Wifi,
  Cable,
  Users
} from 'lucide-react';

interface FirmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  firmProfile: FirmProfile;
  modulesConfig: AppModulesConfig;
  securityConfig: AppSecurityConfig;
  onSave: (
    updatedProfile: FirmProfile, 
    updatedModules: AppModulesConfig, 
    updatedSecurity: AppSecurityConfig
  ) => void;
  onOpenTemplates?: () => void;
  onOpenLanModal?: () => void;
  onExportData?: () => void;
  onImportData?: () => void;
  onResetData?: () => void;
}

export const FirmSettingsModal: React.FC<FirmSettingsModalProps> = ({
  isOpen,
  onClose,
  firmProfile,
  modulesConfig,
  securityConfig,
  onSave,
  onOpenTemplates,
  onOpenLanModal,
  onExportData,
  onImportData,
  onResetData
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'FIRM' | 'PARTNERS' | 'MODULES' | 'SECURITY' | 'DATA'>('FIRM');
  const [formData, setFormData] = useState<FirmProfile>({ 
    ...firmProfile,
    partners: firmProfile.partners || []
  });
  const [modules, setModules] = useState<AppModulesConfig>({ ...modulesConfig });
  const [security, setSecurity] = useState<AppSecurityConfig>({ ...securityConfig });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof FirmProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (stateName: string) => {
    const found = INDIAN_STATES_AND_CODES.find((s) => s.name === stateName);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        state: found.name,
        stateCode: found.code
      }));
    } else {
      handleChange('state', stateName);
    }
  };

  const handleAddPartner = () => {
    const newPartner: PartnerInfo = {
      id: `partner-${Date.now()}`,
      name: '',
      coaRegistrationNo: '',
      designation: 'Partner Architect',
      sharePercentage: 50
    };
    setFormData(prev => ({
      ...prev,
      partners: [...(prev.partners || []), newPartner]
    }));
  };

  const handleUpdatePartner = (id: string, field: keyof PartnerInfo, val: any) => {
    setFormData(prev => ({
      ...prev,
      partners: (prev.partners || []).map(p => p.id === id ? { ...p, [field]: val } : p)
    }));
  };

  const handleRemovePartner = (id: string) => {
    setFormData(prev => ({
      ...prev,
      partners: (prev.partners || []).filter(p => p.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, modules, security);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const isMultiPartner = formData.firmType === 'PARTNERSHIP' || formData.firmType === 'LLP' || formData.firmType === 'PVT_LTD';

  return (
    <div id="firm-settings-backdrop" className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div id="firm-settings-container" className="bg-white text-[#161616] max-w-3xl w-full max-h-[92vh] flex flex-col border border-[#393939] shadow-2xl my-4">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#393939] flex items-center justify-between bg-[#161616] text-white">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#0f62fe]"></div>
            <div>
              <h3 className="text-base font-bold uppercase tracking-tight text-white leading-tight">
                Studio Configuration & Settings
              </h3>
              <p className="text-[11px] text-[#8d8d8d] font-mono">
                Firm Structure, CoA Credentials, Modules & Security
              </p>
            </div>
          </div>
          <button
            id="close-firm-settings-btn"
            onClick={onClose}
            className="p-1 hover:bg-[#393939] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e0e0e0] bg-[#f4f4f4] overflow-x-auto text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('FIRM')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'FIRM'
                ? 'bg-white text-[#0f62fe] border-[#0f62fe]'
                : 'text-[#525252] border-transparent hover:text-[#161616]'
            }`}
          >
            1. Firm Profile & Tax
          </button>

          {isMultiPartner && (
            <button
              type="button"
              onClick={() => setActiveTab('PARTNERS')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'PARTNERS'
                  ? 'bg-white text-[#0f62fe] border-[#0f62fe]'
                  : 'text-[#525252] border-transparent hover:text-[#161616]'
              }`}
            >
              2. Partners ({formData.partners?.length || 0})
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('MODULES')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'MODULES'
                ? 'bg-white text-[#0f62fe] border-[#0f62fe]'
                : 'text-[#525252] border-transparent hover:text-[#161616]'
            }`}
          >
            3. Modules Toggle
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'SECURITY'
                ? 'bg-white text-[#0f62fe] border-[#0f62fe]'
                : 'text-[#525252] border-transparent hover:text-[#161616]'
            }`}
          >
            4. Lock & LAN Wi-Fi
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DATA')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'DATA'
                ? 'bg-white text-[#0f62fe] border-[#0f62fe]'
                : 'text-[#525252] border-transparent hover:text-[#161616]'
            }`}
          >
            5. Backup & Data
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs max-h-[70vh]">
          
          {savedSuccess && (
            <div className="p-3 bg-[#defbe6] text-[#0f6225] border-l-4 border-[#24a148] flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#24a148] shrink-0" />
              <span className="font-bold">Studio configuration updated successfully!</span>
            </div>
          )}

          {/* TAB 1: FIRM PROFILE */}
          {activeTab === 'FIRM' && (
            <div className="space-y-4">
              {/* Firm Type Selection */}
              <div className="p-3.5 bg-[#f4f4f4] border border-[#e0e0e0]">
                <span className="text-xs font-bold uppercase text-[#161616] tracking-wider block mb-2">
                  Architectural Practice Business Structure *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('firmType', 'FREELANCER')}
                    className={`p-3 text-left border transition-all ${
                      formData.firmType === 'FREELANCER'
                        ? 'bg-white border-[#0f62fe] shadow-xs'
                        : 'bg-white border-[#e0e0e0] hover:border-[#161616]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#161616]">Freelancer</span>
                      {formData.firmType === 'FREELANCER' && <span className="w-2 h-2 bg-[#0f62fe]"></span>}
                    </div>
                    <p className="text-[11px] text-[#525252]">Independent Consultant / Solo Practice</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('firmType', 'PROPRIETORSHIP')}
                    className={`p-3 text-left border transition-all ${
                      formData.firmType === 'PROPRIETORSHIP'
                        ? 'bg-white border-[#0f62fe] shadow-xs'
                        : 'bg-white border-[#e0e0e0] hover:border-[#161616]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#161616]">Sole Proprietor</span>
                      {formData.firmType === 'PROPRIETORSHIP' && <span className="w-2 h-2 bg-[#0f62fe]"></span>}
                    </div>
                    <p className="text-[11px] text-[#525252]">Single Principal Architect Firm</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('firmType', 'PARTNERSHIP')}
                    className={`p-3 text-left border transition-all ${
                      isMultiPartner
                        ? 'bg-white border-[#0f62fe] shadow-xs'
                        : 'bg-white border-[#e0e0e0] hover:border-[#161616]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#161616]">Partnership / LLP</span>
                      {isMultiPartner && <span className="w-2 h-2 bg-[#0f62fe]"></span>}
                    </div>
                    <p className="text-[11px] text-[#525252]">Multiple Partner CoA Architects</p>
                  </button>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                    Studio / Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firmName}
                    onChange={(e) => handleChange('firmName', e.target.value)}
                    className="carbon-input w-full p-2 text-xs font-bold text-[#161616]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                    Principal Architect / Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.architectName}
                    onChange={(e) => handleChange('architectName', e.target.value)}
                    className="carbon-input w-full p-2 text-xs font-bold text-[#161616]"
                  />
                </div>
              </div>

              {/* CoA & Registration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                    CoA Reg. No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CA/2015/68294"
                    value={formData.coaRegistrationNo}
                    onChange={(e) => handleChange('coaRegistrationNo', e.target.value)}
                    className="carbon-input w-full p-2 text-xs font-mono font-bold uppercase text-[#161616]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                    IIA Number
                  </label>
                  <input
                    type="text"
                    placeholder="A-21945"
                    value={formData.iiaNumber || ''}
                    onChange={(e) => handleChange('iiaNumber', e.target.value)}
                    className="carbon-input w-full p-2 text-xs font-mono text-[#161616]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                    LLPIN / CIN (if LLP/Co.)
                  </label>
                  <input
                    type="text"
                    placeholder="AAA-1234 / U74210..."
                    value={formData.cinOrLlpin || ''}
                    onChange={(e) => handleChange('cinOrLlpin', e.target.value)}
                    className="carbon-input w-full p-2 text-xs font-mono uppercase text-[#161616]"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                    Studio Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="carbon-input w-full p-2 text-xs text-[#161616]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                    Studio Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="carbon-input w-full p-2 text-xs text-[#161616]"
                  />
                </div>
              </div>

              {/* Studio Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                  Studio Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="carbon-input w-full p-2 text-xs text-[#161616]"
                />
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="carbon-input w-full p-2 text-xs text-[#161616]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">State (GST Code)</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="carbon-input w-full p-2 text-xs text-[#161616]"
                  >
                    {INDIAN_STATES_AND_CODES.map((st) => (
                      <option key={st.code} value={st.name}>
                        {st.name} ({st.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className="carbon-input w-full p-2 text-xs font-mono text-[#161616]"
                  />
                </div>
              </div>

              {/* GST & Tax Scheme */}
              <div className="p-3.5 bg-[#f4f4f4] border border-[#e0e0e0] space-y-3">
                <span className="text-xs font-bold uppercase text-[#161616] tracking-wider block">
                  Tax Scheme & Compliance
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                      Tax Scheme
                    </label>
                    <select
                      value={formData.defaultTaxScheme}
                      onChange={(e) => handleChange('defaultTaxScheme', e.target.value as TaxScheme)}
                      className="carbon-input w-full p-2 text-xs font-bold text-[#161616]"
                    >
                      <option value="REGULAR_GST">Regular GST (18%)</option>
                      <option value="COMPOSITION_GST">Composition Scheme (6%)</option>
                      <option value="NO_GST">Non-GST (Exempt &lt;20L)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                      GSTIN
                    </label>
                    <input
                      type="text"
                      placeholder="29AABCU9603R1ZM"
                      value={formData.gstin || ''}
                      onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                      className="carbon-input w-full p-2 text-xs font-mono font-bold text-[#161616]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">
                      PAN
                    </label>
                    <input
                      type="text"
                      placeholder="AABCU9603R"
                      value={formData.pan}
                      onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                      className="carbon-input w-full p-2 text-xs font-mono font-bold text-[#161616]"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-3.5 bg-[#f4f4f4] border border-[#e0e0e0] space-y-3">
                <span className="text-xs font-bold uppercase text-[#161616] tracking-wider block">
                  Bank Remittance & UPI QR
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleChange('bankName', e.target.value)}
                      className="carbon-input w-full p-2 text-xs text-[#161616]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">Account Number</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => handleChange('accountNumber', e.target.value)}
                      className="carbon-input w-full p-2 text-xs font-mono font-bold text-[#161616]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                      className="carbon-input w-full p-2 text-xs font-mono uppercase font-bold text-[#161616]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#525252] mb-1">UPI VPA (QR Code)</label>
                    <input
                      type="text"
                      placeholder="studio@bank"
                      value={formData.upiId || ''}
                      onChange={(e) => handleChange('upiId', e.target.value)}
                      className="carbon-input w-full p-2 text-xs font-mono font-bold text-[#0f62fe]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARTNERS */}
          {activeTab === 'PARTNERS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                    Partner Architects List
                  </h4>
                  <p className="text-[11px] text-[#525252]">
                    Add all practicing partners with their Council of Architecture (CoA) registration numbers.
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-add-partner"
                  onClick={handleAddPartner}
                  className="carbon-btn-primary px-3 py-1.5 text-xs font-bold uppercase flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-white" />
                  <span>Add Partner</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.partners || []).map((partner, idx) => (
                  <div key={partner.id} className="p-3.5 bg-[#f4f4f4] border border-[#e0e0e0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#0f62fe]">
                        Partner #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePartner(partner.id)}
                        className="text-[#da1e28] hover:text-black text-xs p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#525252]">Partner Name *</label>
                        <input
                          type="text"
                          required
                          value={partner.name}
                          onChange={(e) => handleUpdatePartner(partner.id, 'name', e.target.value)}
                          placeholder="Ar. Full Name"
                          className="carbon-input w-full p-1.5 text-xs text-[#161616]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#525252]">CoA Registration No</label>
                        <input
                          type="text"
                          value={partner.coaRegistrationNo || ''}
                          onChange={(e) => handleUpdatePartner(partner.id, 'coaRegistrationNo', e.target.value)}
                          placeholder="CA/2018/12345"
                          className="carbon-input w-full p-1.5 text-xs font-mono text-[#161616]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#525252]">Designation</label>
                        <input
                          type="text"
                          value={partner.designation}
                          onChange={(e) => handleUpdatePartner(partner.id, 'designation', e.target.value)}
                          placeholder="Managing Partner"
                          className="carbon-input w-full p-1.5 text-xs text-[#161616]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#525252]">Equity / Profit Share %</label>
                        <input
                          type="number"
                          value={partner.sharePercentage || ''}
                          onChange={(e) => handleUpdatePartner(partner.id, 'sharePercentage', parseFloat(e.target.value) || 0)}
                          placeholder="50"
                          className="carbon-input w-full p-1.5 text-xs font-mono text-[#161616]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MODULES */}
          {activeTab === 'MODULES' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                  Studio Practice Modules Manager
                </h4>
                <p className="text-[11px] text-[#525252]">
                  Enable or disable suite modules based on your studio workflow. Unchecked modules will be hidden from the navigation bar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'proposals', title: 'Fee Proposals & Quotations', desc: 'CoA scope stages, area rates & percentage fees' },
                  { key: 'invoices', title: 'Milestone Tax Invoices', desc: 'Regular GST, Composition 6% & Non-GST billing' },
                  { key: 'payments', title: 'Payment Receipts & TDS Ledger', desc: 'Track bank credits and Section 194J 10% TDS' },
                  { key: 'expenses', title: 'Studio Expenses & Reimbursables', desc: 'Billable client expenses & overhead tracking' },
                  { key: 'salaries', title: 'Salaries & Payroll Ledger', desc: 'Associate salaries, drafter fees & intern stipends' },
                  { key: 'books', title: 'Books of Accounts & P&L', desc: 'GST reports, net studio operating profit & summary' },
                  { key: 'freelanceTemplates', title: 'Freelance Quick Templates', desc: 'Pre-set lump sum rates for 3D views & part-work' }
                ].map((mod) => (
                  <label
                    key={mod.key}
                    id={`toggle-module-${mod.key}`}
                    className={`p-3.5 border flex items-start space-x-3 cursor-pointer transition-colors ${
                      (modules as any)[mod.key]
                        ? 'bg-[#edf5ff] border-[#0f62fe]'
                        : 'bg-[#f4f4f4] border-[#e0e0e0]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(modules as any)[mod.key]}
                      onChange={(e) => setModules(prev => ({ ...prev, [mod.key]: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 accent-[#0f62fe]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#161616] block">{mod.title}</span>
                      <span className="text-[11px] text-[#525252] block mt-0.5">{mod.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & LAN */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-4">
              {/* Lock App Section */}
              <div className="p-4 bg-[#f4f4f4] border border-[#e0e0e0] space-y-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-[#0f62fe]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                    Master PIN Lock Protection
                  </h4>
                </div>
                <p className="text-[11px] text-[#525252]">
                  Lock financial ledgers, client fee invoices, and salary figures behind a 4-digit security PIN.
                </p>

                <div className="flex items-center space-x-4 pt-1">
                  <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      id="security-lock-enabled-checkbox"
                      checked={security.isLockEnabled}
                      onChange={(e) => setSecurity(prev => ({ ...prev, isLockEnabled: e.target.checked }))}
                      className="w-4 h-4 accent-[#0f62fe]"
                    />
                    <span>Enable Master PIN Lock</span>
                  </label>
                </div>

                {security.isLockEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#525252] mb-1">
                        4-Digit PIN *
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        value={security.pin}
                        onChange={(e) => setSecurity(prev => ({ ...prev, pin: e.target.value }))}
                        className="carbon-input w-full p-2 text-sm font-mono font-bold text-center tracking-widest text-[#161616]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#525252] mb-1">
                        PIN Hint / Reminder
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Studio founding year"
                        value={security.securityHint || ''}
                        onChange={(e) => setSecurity(prev => ({ ...prev, securityHint: e.target.value }))}
                        className="carbon-input w-full p-2 text-xs text-[#161616]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Data Cable & Security Link */}
              <div className="p-4 bg-white border border-[#161616] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cable className="w-4 h-4 text-[#0f62fe]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                      Mobile Data Cable & Security Link (Air-Gapped)
                    </h4>
                  </div>
                  {onOpenLanModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenLanModal();
                      }}
                      className="carbon-btn-primary px-3 py-1 text-xs font-bold uppercase"
                    >
                      Open Cable / USB Link
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#525252]">
                  Connect your phone or tablet directly via a physical <strong>USB Data Cable (Tethering)</strong> for maximum security against Wi-Fi packet sniffing and radio wave interception.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: DATA */}
          {activeTab === 'DATA' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                  Data Backup, Export & Reset
                </h4>
                <p className="text-[11px] text-[#525252]">
                  Export a complete JSON snapshot of all proposals, invoices, expenses, and payroll to archive locally.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {onExportData && (
                  <button
                    type="button"
                    onClick={onExportData}
                    className="p-4 border border-[#161616] hover:bg-[#161616] hover:text-white transition-colors text-left group"
                  >
                    <Download className="w-5 h-5 text-[#0f62fe] group-hover:text-white mb-2" />
                    <span className="font-bold text-xs block">Export JSON Archive</span>
                    <span className="text-[10px] text-[#8d8d8d] block mt-1">Full studio data dump</span>
                  </button>
                )}

                {onImportData && (
                  <button
                    type="button"
                    onClick={onImportData}
                    className="p-4 border border-[#161616] hover:bg-[#161616] hover:text-white transition-colors text-left group"
                  >
                    <Upload className="w-5 h-5 text-[#0f62fe] group-hover:text-white mb-2" />
                    <span className="font-bold text-xs block">Import JSON Archive</span>
                    <span className="text-[10px] text-[#8d8d8d] block mt-1">Restore studio records</span>
                  </button>
                )}

                {onResetData && (
                  <button
                    type="button"
                    onClick={onResetData}
                    className="p-4 border border-[#da1e28] hover:bg-[#da1e28] hover:text-white transition-colors text-left"
                  >
                    <RotateCcw className="w-5 h-5 text-[#da1e28] mb-2" />
                    <span className="font-bold text-xs block">Reset Sample Data</span>
                    <span className="text-[10px] text-[#8d8d8d] block mt-1">Reset to CoA defaults</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Footer Save */}
          <div className="pt-4 border-t border-[#e0e0e0] flex items-center justify-end space-x-3">
            <button
              type="button"
              id="cancel-firm-settings-btn"
              onClick={onClose}
              className="carbon-btn-ghost px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-firm-settings-btn"
              className="carbon-btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
            >
              <Save className="w-4 h-4 mr-1 text-white" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
