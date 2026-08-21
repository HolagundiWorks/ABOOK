import React, { useState } from 'react';
import { ClientProfile, ClientCategory, ProjectProposal, Invoice } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText, 
  ReceiptText, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ClientListProps {
  clients?: ClientProfile[];
  proposals?: ProjectProposal[];
  invoices?: Invoice[];
  onAddClient?: () => void;
  onNewClient?: () => void;
  onEditClient: (client: ClientProfile) => void;
  onDeleteClient: (id: string) => void;
  onCreateProposalForClient: (client: ClientProfile) => void;
  onCreateInvoiceForClient: (client: ClientProfile) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients = [],
  proposals = [],
  invoices = [],
  onAddClient,
  onNewClient,
  onEditClient,
  onDeleteClient,
  onCreateProposalForClient,
  onCreateInvoiceForClient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const handleAdd = onAddClient || onNewClient || (() => {});

  const safeClients = clients || [];
  const safeProposals = proposals || [];
  const safeInvoices = invoices || [];

  const filteredClients = safeClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.clientCode && client.clientCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.organization && client.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.phone && client.phone.includes(searchTerm)) ||
      (client.gstin && client.gstin.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.city && client.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' || client.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Client counts
  const totalClients = safeClients.length;
  const corporateClients = safeClients.filter(
    (c) => c.category === 'CORPORATE' || c.category === 'REAL_ESTATE_DEVELOPER'
  ).length;
  const individualClients = safeClients.filter((c) => c.category === 'INDIVIDUAL').length;
  const commercialClients = safeClients.filter(
    (c) => c.category === 'COMMERCIAL_RETAIL' || c.category === 'GOVERNMENT_INSTITUTION' || c.category === 'INSTITUTIONAL'
  ).length;

  const getCategoryBadge = (category: ClientCategory) => {
    switch (category) {
      case 'CORPORATE':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#161616] text-[#4589ff] border border-[#0f62fe]">
            CORPORATE
          </span>
        );
      case 'REAL_ESTATE_DEVELOPER':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#161616] text-[#0f62fe] border border-[#0f62fe]">
            DEVELOPER
          </span>
        );
      case 'INDIVIDUAL':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#f4f4f4] text-[#161616] border border-[#8d8d8d]">
            INDIVIDUAL
          </span>
        );
      case 'COMMERCIAL_RETAIL':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#161616] text-white border border-[#8d8d8d]">
            COMMERCIAL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#edf5ff] text-[#0043ce] border border-[#a6c8ff]">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-[#161616] text-white border border-[#393939]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-1.5 py-0.5 bg-[#0f62fe] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                STEP 1: CLIENT IDENTITY FIRST
              </span>
              <span className="text-[11px] font-mono text-[#8d8d8d]">
                Total: {safeClients.length} Registered
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white uppercase tracking-tight">
              Client Directory & Statutory Records
            </h2>
            <p className="text-xs text-[#c6c6c6] mt-0.5 max-w-xl">
              Register clients first to capture statutory GSTIN, PAN, and site parameters. Directly generate CoA milestone proposals with zero re-entry.
            </p>
          </div>

          <button
            id="clients-add-btn"
            onClick={handleAdd}
            className="carbon-btn-primary inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2]" />
            Register Client First
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 border border-[#e0e0e0]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] block">
            Total Clients
          </span>
          <p className="text-lg font-bold font-mono text-[#161616] mt-1">
            {totalClients}
          </p>
          <span className="text-[10px] font-mono text-[#0f62fe] block mt-0.5">
            Active in Directory
          </span>
        </div>

        <div className="bg-white p-3.5 border border-[#e0e0e0]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] block">
            Corporate & Developers
          </span>
          <p className="text-lg font-bold font-mono text-[#0f62fe] mt-1">
            {corporateClients}
          </p>
          <span className="text-[10px] font-mono text-[#8d8d8d] block mt-0.5">
            GST B2B Registered
          </span>
        </div>

        <div className="bg-white p-3.5 border border-[#e0e0e0]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] block">
            Individual Villa Owners
          </span>
          <p className="text-lg font-bold font-mono text-[#161616] mt-1">
            {individualClients}
          </p>
          <span className="text-[10px] font-mono text-[#8d8d8d] block mt-0.5">
            B2C Residential
          </span>
        </div>

        <div className="bg-white p-3.5 border border-[#e0e0e0]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] block">
            Proposals Linked
          </span>
          <p className="text-lg font-bold font-mono text-[#198038] mt-1">
            {safeProposals.length}
          </p>
          <span className="text-[10px] font-mono text-[#198038] block mt-0.5">
            Active CoA Contracts
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-3 bg-white border border-[#e0e0e0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8d8d8d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="clients-search-input"
            type="text"
            placeholder="Search by client name, organization, code, phone, or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-sans bg-[#f4f4f4] border border-[#8d8d8d] focus:border-[#0f62fe] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Clients' },
            { id: 'INDIVIDUAL', label: 'Individual' },
            { id: 'CORPORATE', label: 'Corporate' },
            { id: 'REAL_ESTATE_DEVELOPER', label: 'Developers' },
            { id: 'COMMERCIAL_RETAIL', label: 'Commercial' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold border transition-colors whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-[#161616] text-[#4589ff] border-[#0f62fe]'
                  : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client List Grid / Table */}
      {filteredClients.length === 0 ? (
        <div className="p-10 bg-white border border-[#e0e0e0] text-center">
          <Users className="w-10 h-10 text-[#8d8d8d] mx-auto mb-2" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#161616]">
            No client profiles found
          </h3>
          <p className="text-xs text-[#525252] max-w-sm mx-auto mt-1 mb-4">
            Create your first client profile to capture all billing, GSTIN, PAN, and site data before drafting proposals.
          </p>
          <button
            onClick={handleAdd}
            className="carbon-btn-primary inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Register Client Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredClients.map((client) => {
            const clientProposals = safeProposals.filter(
              (p) => p.client && (p.client.clientProfileId === client.id || (p.client.name && p.client.name.toLowerCase() === client.name.toLowerCase()))
            );
            const clientInvoices = safeInvoices.filter(
              (i) => i.client && (i.client.clientProfileId === client.id || (i.client.name && i.client.name.toLowerCase() === client.name.toLowerCase()))
            );

            return (
              <div
                key={client.id}
                className="bg-white border border-[#e0e0e0] hover:border-[#0f62fe] transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Code + Category Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold bg-[#f4f4f4] text-[#161616] px-1.5 py-0.5 border border-[#8d8d8d]">
                      {client.clientCode}
                    </span>
                    {getCategoryBadge(client.category)}
                  </div>

                  {/* Client Name & Organization */}
                  <h3 className="text-sm font-bold text-[#161616] uppercase tracking-tight">
                    {client.name}
                  </h3>
                  {client.organization && (
                    <div className="flex items-center space-x-1.5 text-xs text-[#525252] mt-0.5">
                      <Building className="w-3 h-3 text-[#0f62fe] shrink-0" />
                      <span className="font-medium">{client.organization}</span>
                      {client.contactPerson && (
                        <span className="text-[10px] font-mono text-[#8d8d8d]">
                          (Attn: {client.contactPerson})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="mt-3 space-y-1 text-xs text-[#525252]">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-[#8d8d8d] shrink-0" />
                      <span className="font-mono truncate">{client.email || '—'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-[#8d8d8d] shrink-0" />
                      <span className="font-mono">{client.phone || '—'}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[#8d8d8d] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{client.city}, {client.state} ({client.stateCode})</span>
                    </div>
                  </div>

                  {/* Statutory GST & PAN Tag */}
                  <div className="mt-3 pt-2.5 border-t border-[#f4f4f4] flex flex-wrap items-center gap-2 text-[10px] font-mono">
                    {client.gstin ? (
                      <span className="bg-[#edf5ff] text-[#0043ce] px-1.5 py-0.5 border border-[#a6c8ff]">
                        GSTIN: {client.gstin}
                      </span>
                    ) : (
                      <span className="bg-[#f4f4f4] text-[#6f6f6f] px-1.5 py-0.5">
                        Non-GST Client
                      </span>
                    )}

                    {client.pan && (
                      <span className="bg-[#f4f4f4] text-[#161616] px-1.5 py-0.5 border border-[#e0e0e0]">
                        PAN: {client.pan}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-[#e0e0e0] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onEditClient(client)}
                      className="p-1.5 text-[#525252] hover:text-[#161616] hover:bg-[#f4f4f4] border border-[#e0e0e0] transition-colors"
                      title="Edit Client Profile"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteClient(client.id)}
                      className="p-1.5 text-[#8d8d8d] hover:text-[#da1e28] hover:bg-[#fff1f1] border border-[#e0e0e0] hover:border-[#da1e28] transition-colors"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onCreateProposalForClient(client)}
                      className="px-2.5 py-1.5 bg-[#161616] hover:bg-[#262626] text-[#4589ff] border border-[#0f62fe] text-[10px] font-mono font-bold uppercase transition-colors flex items-center space-x-1"
                      title="Generate CoA Fee Proposal for this client"
                    >
                      <FileText className="w-3 h-3 text-[#0f62fe]" />
                      <span>+ Proposal</span>
                    </button>

                    <button
                      onClick={() => onCreateInvoiceForClient(client)}
                      className="px-2.5 py-1.5 bg-white hover:bg-[#f4f4f4] text-[#161616] border border-[#8d8d8d] text-[10px] font-mono font-bold uppercase transition-colors flex items-center space-x-1"
                      title="Generate Tax Invoice for this client"
                    >
                      <ReceiptText className="w-3 h-3 text-[#161616]" />
                      <span>+ Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
