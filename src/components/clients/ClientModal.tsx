import React, { useState, useEffect } from 'react';
import { ClientProfile, ClientCategory, FirmProfile } from '../../types';
import { INDIAN_STATES_AND_CODES } from '../../data/coaStandards';
import { 
  X, 
  UserPlus, 
  Building, 
  User, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  FileText, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: ClientProfile) => void;
  initialClient?: ClientProfile | null;
  generatedClientCode: string;
  firmProfile: FirmProfile;
  title?: string;
  onSaveAndCreateProposal?: (client: ClientProfile) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClient,
  generatedClientCode,
  firmProfile,
  title = 'Client Profile Registration',
  onSaveAndCreateProposal
}) => {
  if (!isOpen) return null;

  const [clientCode, setClientCode] = useState(
    initialClient?.clientCode || generatedClientCode
  );
  const [category, setCategory] = useState<ClientCategory>(
    initialClient?.category || 'INDIVIDUAL'
  );
  const [name, setName] = useState(initialClient?.name || '');
  const [organization, setOrganization] = useState(initialClient?.organization || '');
  const [contactPerson, setContactPerson] = useState(initialClient?.contactPerson || '');
  const [designation, setDesignation] = useState(initialClient?.designation || '');
  const [email, setEmail] = useState(initialClient?.email || '');
  const [phone, setPhone] = useState(initialClient?.phone || '');
  const [secondaryPhone, setSecondaryPhone] = useState(initialClient?.secondaryPhone || '');
  const [address, setAddress] = useState(initialClient?.address || '');
  const [city, setCity] = useState(initialClient?.city || firmProfile.city);
  const [state, setState] = useState(initialClient?.state || firmProfile.state);
  const [stateCode, setStateCode] = useState(initialClient?.stateCode || firmProfile.stateCode);
  const [pincode, setPincode] = useState(initialClient?.pincode || '');
  const [gstin, setGstin] = useState(initialClient?.gstin || '');
  const [pan, setPan] = useState(initialClient?.pan || '');
  const [siteAddress, setSiteAddress] = useState(initialClient?.siteAddress || '');
  const [notes, setNotes] = useState(initialClient?.notes || '');
  const [tagsInput, setTagsInput] = useState((initialClient?.tags || []).join(', '));
  const [error, setError] = useState<string | null>(null);

  // Auto-sync state code when state selection changes
  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
    const found = INDIAN_STATES_AND_CODES.find((s) => s.name === selectedState);
    if (found) {
      setStateCode(found.code);
    }
  };

  // Auto-extract PAN from GSTIN if 15 chars
  const handleGstinChange = (value: string) => {
    const upper = value.toUpperCase().trim();
    setGstin(upper);
    if (upper.length === 15) {
      const gstinStateCode = upper.substring(0, 2);
      const extractedPan = upper.substring(2, 12);
      if (!pan) setPan(extractedPan);
      const matchingState = INDIAN_STATES_AND_CODES.find((s) => s.code === gstinStateCode);
      if (matchingState) {
        setState(matchingState.name);
        setStateCode(matchingState.code);
      }
    }
  };

  const validateAndBuildClient = (): ClientProfile | null => {
    if (!name.trim()) {
      setError('Client or Entity Name is required.');
      return null;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Either Email or Primary Phone number is required.');
      return null;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const client: ClientProfile = {
      id: initialClient?.id || `client-${Date.now()}`,
      clientCode,
      name: name.trim(),
      category,
      organization: organization.trim() || undefined,
      contactPerson: contactPerson.trim() || undefined,
      designation: designation.trim() || undefined,
      email: email.trim(),
      phone: phone.trim(),
      secondaryPhone: secondaryPhone.trim() || undefined,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      stateCode: stateCode.trim(),
      pincode: pincode.trim(),
      gstin: gstin.trim() || undefined,
      pan: pan.trim().toUpperCase() || undefined,
      siteAddress: siteAddress.trim() || undefined,
      notes: notes.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      createdAt: initialClient?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return client;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const client = validateAndBuildClient();
    if (!client) return;
    onSave(client);
    onClose();
  };

  const handleSaveAndCreateProposal = () => {
    setError(null);
    const client = validateAndBuildClient();
    if (!client) return;
    onSave(client);
    if (onSaveAndCreateProposal) {
      onSaveAndCreateProposal(client);
    }
    onClose();
  };

  return (
    <div id="client-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 overflow-y-auto">
      <div id="client-modal-container" className="w-full max-w-3xl bg-white text-[#161616] border border-[#393939] shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#161616] text-white border-b border-[#393939] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 bg-[#0f62fe]" />
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">
                {title}
              </h2>
              <span className="text-[10px] font-mono text-[#8d8d8d]">
                Architect-Client Identity & Statutory GST Registry
              </span>
            </div>
          </div>
          <button
            id="close-client-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-[#393939] text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-[#fff1f1] border-l-2 border-[#da1e28] text-[#da1e28] text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Workflow Step Banner */}
          <div className="p-3 bg-[#edf5ff] border-l-2 border-[#0f62fe] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#0043ce] block">
                Workflow Phase 1: Client Profile First
              </span>
              <p className="text-xs text-[#161616] mt-0.5">
                Register complete client contact, tax identity & site details before generating CoA proposals.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-white px-2 py-1 border border-[#0f62fe] text-[#0043ce] font-bold shrink-0">
              {clientCode}
            </span>
          </div>

          {/* Section 1: Classification & Primary Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 pb-1 border-b border-[#e0e0e0]">
              <User className="w-3.5 h-3.5 text-[#0f62fe]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                1. Client Classification & Primary Name
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client Code:
                </label>
                <input
                  type="text"
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client Category / Type: *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ClientCategory)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans font-semibold text-[#161616] outline-none focus:border-[#0f62fe]"
                >
                  <option value="INDIVIDUAL">Individual / Private Homeowner</option>
                  <option value="REAL_ESTATE_DEVELOPER">Real Estate Developer / Builder</option>
                  <option value="CORPORATE">Corporate Enterprise / Private Limited</option>
                  <option value="COMMERCIAL_RETAIL">Commercial / Retail / Hospitality</option>
                  <option value="GOVERNMENT_INSTITUTION">Government / Public Sector Undertaking</option>
                  <option value="INSTITUTIONAL">Educational / Healthcare Institution</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client / Entity Full Name: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Arvind & Priya Kulkarni or Apex Realty Pvt Ltd"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Organization / Group (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kulkarni Family Trust or Horizon Group"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Key Contact Person:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Malhotra"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Designation / Role:
                </label>
                <input
                  type="text"
                  placeholder="e.g. VP - Projects & Planning"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Numbers & Communication */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 pb-1 border-b border-[#e0e0e0]">
              <Phone className="w-3.5 h-3.5 text-[#0f62fe]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                2. Contact & Communication
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Primary Email: *
                </label>
                <input
                  type="email"
                  placeholder="client@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Primary Phone / Mobile: *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98801 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Secondary / Office Phone:
                </label>
                <input
                  type="tel"
                  placeholder="+91 80 4000 0000"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Statutory GST & PAN Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 pb-1 border-b border-[#e0e0e0]">
              <CreditCard className="w-3.5 h-3.5 text-[#0f62fe]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                3. Statutory GSTIN & Income Tax PAN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Client GSTIN (15 Digits):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 29AABCA8912K1Z8"
                  value={gstin}
                  onChange={(e) => handleGstinChange(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono uppercase text-[#161616] outline-none focus:border-[#0f62fe]"
                />
                <span className="text-[9px] text-[#6f6f6f] font-mono block mt-0.5">
                  Leave blank for Unregistered Consumer / Individual Homeowner
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Permanent Account Number (PAN - 10 Digits):
                </label>
                <input
                  type="text"
                  placeholder="e.g. AABCA8912K"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono uppercase text-[#161616] outline-none focus:border-[#0f62fe]"
                />
                <span className="text-[9px] text-[#6f6f6f] font-mono block mt-0.5">
                  Required for TDS reconciliation (Form 26AS) u/s 194J
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Registered Billing Address & State */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 pb-1 border-b border-[#e0e0e0]">
              <MapPin className="w-3.5 h-3.5 text-[#0f62fe]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                4. Billing Address & Place of Supply
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                Full Street / Office Address:
              </label>
              <textarea
                rows={2}
                placeholder="Suite / Plot No, Road, Locality"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  City:
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  State / UT:
                </label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                >
                  {INDIAN_STATES_AND_CODES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  State Code:
                </label>
                <input
                  type="text"
                  readOnly
                  value={stateCode}
                  className="w-full bg-[#f4f4f4] border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  PIN Code:
                </label>
                <input
                  type="text"
                  placeholder="560001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                Default Project Site / Plot Location:
              </label>
              <input
                type="text"
                placeholder="e.g. Survey 48, Gated Community, Whitefield, Bengaluru"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
              />
            </div>
          </div>

          {/* Section 5: Internal Notes & Tags */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 pb-1 border-b border-[#e0e0e0]">
              <FileText className="w-3.5 h-3.5 text-[#0f62fe]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                5. Architectural Scope Tags & Notes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Tags (Comma separated):
                </label>
                <input
                  type="text"
                  placeholder="e.g. High-End Villa, Sustainable, Master Planning"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                  Confidential Practice Notes:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Preferred drawing delivery on Saturdays"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-sans text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#e0e0e0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="carbon-btn-ghost px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>

            <div className="flex items-center space-x-2">
              {onSaveAndCreateProposal && (
                <button
                  type="button"
                  onClick={handleSaveAndCreateProposal}
                  className="px-4 py-2 bg-[#161616] hover:bg-[#262626] text-[#4589ff] border border-[#0f62fe] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Save & Create Proposal</span>
                </button>
              )}

              <button
                type="submit"
                className="carbon-btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Client Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
