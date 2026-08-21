import React, { useState } from 'react';
import { ProjectProposal, ProposalStatus, FirmProfile } from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { 
  FileText, 
  Plus, 
  Search, 
  Printer, 
  Copy, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building,
  User,
  Layers,
  Sparkles
} from 'lucide-react';

interface ProposalListProps {
  proposals: ProjectProposal[];
  firmProfile: FirmProfile;
  onNewProposal: () => void;
  onEditProposal: (proposal: ProjectProposal) => void;
  onViewProposal: (proposal: ProjectProposal) => void;
  onDeleteProposal: (id: string) => void;
  onDuplicateProposal: (proposal: ProjectProposal) => void;
  onCreateInvoiceFromProposal: (proposal: ProjectProposal) => void;
}

export const ProposalList: React.FC<ProposalListProps> = ({
  proposals,
  firmProfile,
  onNewProposal,
  onEditProposal,
  onViewProposal,
  onDeleteProposal,
  onDuplicateProposal,
  onCreateInvoiceFromProposal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      p.proposalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.siteLocation && p.siteLocation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#24a148] border border-[#24a148]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Accepted
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#ff832b] border border-[#ff832b]">
            <Clock className="w-3 h-3 mr-1" />
            Sent
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#8d8d8d] border border-[#8d8d8d]">
            Draft
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#da1e28] border border-[#da1e28]">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#161616] text-[#8d8d8d] border border-[#393939]">
            Archived
          </span>
        );
    }
  };

  const getFeeModelBadge = (proposal: ProjectProposal) => {
    if (proposal.feeModel === 'PERCENTAGE_COST') {
      return (
        <span className="text-[11px] font-mono font-semibold text-[#161616] bg-[#e0e0e0] px-2 py-0.5 border border-[#8d8d8d]">
          {proposal.percentageRate}% of Est. Cost
        </span>
      );
    }
    if (proposal.feeModel === 'PER_SQFT') {
      return (
        <span className="text-[11px] font-mono font-semibold text-[#161616] bg-[#e0e0e0] px-2 py-0.5 border border-[#8d8d8d]">
          ₹{proposal.ratePerSqFt}/sq.ft ({proposal.builtUpAreaSqFt?.toLocaleString('en-IN')} sq.ft)
        </span>
      );
    }
    return (
      <span className="text-[11px] font-mono font-semibold text-[#161616] bg-[#e0e0e0] px-2 py-0.5 border border-[#8d8d8d]">
        Lump Sum Fee
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Section Header Card */}
      <div className="p-4 sm:p-5 bg-[#161616] text-white border-2 border-[#393939]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-1.5 py-0.5 bg-[#ff832b] text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                COA COMPREHENSIVE SCALE
              </span>
              <span className="text-[11px] font-mono text-[#8d8d8d]">
                Total: {proposals.length}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white uppercase tracking-tight">
              Architectural Fee Proposals
            </h2>
            <p className="text-xs text-[#c6c6c6] mt-0.5 max-w-xl">
              Stage-wise milestone fee proposals aligned with Council of Architecture guidelines. Convert approved milestones into tax invoices.
            </p>
          </div>

          <button
            id="proposals-create-btn"
            onClick={onNewProposal}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-[#ff832b] hover:bg-[#fa7516] text-black font-bold uppercase tracking-wider text-xs border border-black transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            New Proposal
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-3 bg-white border border-[#393939] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8d8d8d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="proposals-search-input"
            type="text"
            placeholder="Search by project, client, or proposal #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-[#f4f4f4] border border-[#8d8d8d] focus:border-[#ff832b] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'ACCEPTED', 'SENT', 'DRAFT'].map((st) => (
            <button
              key={st}
              id={`filter-proposal-${st.toLowerCase()}-btn`}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase font-bold border transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#161616] text-[#ff832b] border-[#ff832b]'
                  : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
              }`}
            >
              {st === 'ALL' ? 'All Proposals' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      {filteredProposals.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-[#8d8d8d] p-6">
          <FileText className="w-10 h-10 text-[#8d8d8d] mx-auto mb-2" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#161616]">No fee proposals found</h3>
          <p className="text-xs text-[#525252] max-w-sm mx-auto mt-1 mb-4">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filter selection.'
              : 'Create your first Council of Architecture stage-wise fee proposal.'}
          </p>
          <button
            onClick={onNewProposal}
            className="inline-flex items-center px-4 py-2 bg-[#161616] text-[#ff832b] border border-[#ff832b] text-xs font-bold uppercase tracking-wider hover:bg-[#262626] transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Draft New Proposal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              id={`proposal-card-${proposal.id}`}
              className="bg-white border-2 border-[#393939] p-4 flex flex-col justify-between hover:border-[#ff832b] transition-colors"
            >
              <div>
                {/* Top Row: Proposal Number & Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-white bg-[#161616] px-2 py-0.5">
                      {proposal.proposalNumber}
                    </span>
                    <span className="text-[11px] font-mono text-[#525252]">
                      {new Date(proposal.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {getStatusBadge(proposal.status)}
                </div>

                {/* Project Title & Client */}
                <h3 className="text-base font-bold text-[#161616] uppercase tracking-tight line-clamp-2">
                  {proposal.projectTitle}
                </h3>

                <div className="mt-2 space-y-1 text-xs text-[#525252]">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-[#ff832b] shrink-0" />
                    <span className="font-semibold text-[#161616]">{proposal.client.name}</span>
                    {proposal.client.organization && (
                      <span className="text-[#8d8d8d]">({proposal.client.organization})</span>
                    )}
                  </div>
                  {proposal.siteLocation && (
                    <div className="flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-[#8d8d8d] shrink-0" />
                      <span className="truncate">{proposal.siteLocation}</span>
                    </div>
                  )}
                </div>

                {/* Fee & Scope Details */}
                <div className="mt-3 p-3 bg-[#f4f4f4] border border-[#e0e0e0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#525252]">
                      Est. Total Fee
                    </span>
                    <span className="text-base font-mono font-bold text-[#161616]">
                      {formatINR(proposal.totalEstimatedFee, false)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#e0e0e0]">
                    <span className="text-[10px] font-mono text-[#525252] flex items-center">
                      <Layers className="w-3.5 h-3.5 mr-1 text-[#ff832b]" />
                      {proposal.milestones.length} CoA Stages
                    </span>
                    <div>{getFeeModelBadge(proposal)}</div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-[#e0e0e0] flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1">
                  <button
                    id={`proposal-view-${proposal.id}-btn`}
                    onClick={() => onViewProposal(proposal)}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase text-[#161616] bg-[#e0e0e0] hover:bg-[#c6c6c6] border border-[#8d8d8d] transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    Print
                  </button>

                  <button
                    id={`proposal-edit-${proposal.id}-btn`}
                    onClick={() => onEditProposal(proposal)}
                    className="p-1.5 text-[#525252] hover:text-[#161616] hover:bg-[#e0e0e0] border border-transparent hover:border-[#8d8d8d] transition-colors"
                    title="Edit Proposal"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`proposal-duplicate-${proposal.id}-btn`}
                    onClick={() => onDuplicateProposal(proposal)}
                    className="p-1.5 text-[#525252] hover:text-[#161616] hover:bg-[#e0e0e0] border border-transparent hover:border-[#8d8d8d] transition-colors"
                    title="Duplicate as Template"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`proposal-delete-${proposal.id}-btn`}
                    onClick={() => onDeleteProposal(proposal.id)}
                    className="p-1.5 text-[#8d8d8d] hover:text-[#da1e28] hover:bg-[#da1e28]/10 border border-transparent hover:border-[#da1e28] transition-colors"
                    title="Delete Proposal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  id={`proposal-invoice-${proposal.id}-btn`}
                  onClick={() => onCreateInvoiceFromProposal(proposal)}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase text-black bg-[#ff832b] hover:bg-[#fa7516] border border-black transition-colors"
                >
                  Bill Stage
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
