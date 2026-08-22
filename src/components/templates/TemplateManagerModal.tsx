import React, { useState } from 'react';
import { FreelanceTemplate, FreelanceTemplateItem } from '../../types';
import { formatINR } from '../../utils/taxCalculations';
import { SAC_CODES_DIRECTORY } from '../../data/coaStandards';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Layers, 
  Check, 
  Sparkles,
  Building,
  RotateCcw
} from 'lucide-react';

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: FreelanceTemplate[];
  onSaveTemplates: (updated: FreelanceTemplate[]) => void;
  onSelectTemplate?: (template: FreelanceTemplate) => void;
  isSelectionMode?: boolean;
}

export const TemplateManagerModal: React.FC<TemplateManagerModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSaveTemplates,
  onSelectTemplate,
  isSelectionMode = false
}) => {
  if (!isOpen) return null;

  const [templateList, setTemplateList] = useState<FreelanceTemplate[]>(templates);
  const [editingTemplate, setEditingTemplate] = useState<FreelanceTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for creating/editing template
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Freelance Consultancy');
  const [description, setDescription] = useState('');
  const [lumpSumRate, setLumpSumRate] = useState<number>(20000);
  const [sacCode, setSacCode] = useState('998321');
  const [items, setItems] = useState<FreelanceTemplateItem[]>([]);

  const handleStartEdit = (tpl: FreelanceTemplate) => {
    setEditingTemplate(tpl);
    setIsCreating(false);
    setTitle(tpl.title);
    setCategory(tpl.category);
    setDescription(tpl.description);
    setLumpSumRate(tpl.lumpSumRate);
    setSacCode(tpl.sacCode);
    setItems([...tpl.items]);
  };

  const handleStartCreate = () => {
    setEditingTemplate(null);
    setIsCreating(true);
    setTitle('');
    setCategory('Freelance Consultancy');
    setDescription('');
    setLumpSumRate(25000);
    setSacCode('998321');
    setItems([
      {
        id: `item-${Date.now()}-1`,
        name: 'Concept & Preliminary Submission',
        deliverables: 'Initial sketches and architectural layout options',
        percentage: 50,
        amount: 12500,
        sacCode: '998321'
      },
      {
        id: `item-${Date.now()}-2`,
        name: 'Final Approved Delivery & CAD Files',
        deliverables: 'High-res exports, drawings and native CAD documentation',
        percentage: 50,
        amount: 12500,
        sacCode: '998321'
      }
    ]);
  };

  // Recalculate item amounts when lumpSumRate changes
  const handleRateChange = (newRate: number) => {
    setLumpSumRate(newRate);
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        amount: Math.round((newRate * (it.percentage || 0)) / 100)
      }))
    );
  };

  const handleItemPercentageChange = (index: number, newPct: number) => {
    const updated = [...items];
    updated[index].percentage = newPct;
    updated[index].amount = Math.round((lumpSumRate * newPct) / 100);
    setItems(updated);
  };

  const handleAddItem = () => {
    const newItem: FreelanceTemplateItem = {
      id: `item-${Date.now()}`,
      name: 'Additional Work Milestone',
      deliverables: 'Detailed deliverable descriptions and files',
      percentage: 20,
      amount: Math.round((lumpSumRate * 20) / 100),
      sacCode: sacCode
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveTemplateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a template title.');
      return;
    }

    const savedTemplate: FreelanceTemplate = {
      id: editingTemplate ? editingTemplate.id : `tpl-${Date.now()}`,
      title,
      category,
      description,
      lumpSumRate,
      sacCode,
      items,
      isCustom: true
    };

    let updatedList: FreelanceTemplate[];
    if (editingTemplate) {
      updatedList = templateList.map((t) => (t.id === savedTemplate.id ? savedTemplate : t));
    } else {
      updatedList = [savedTemplate, ...templateList];
    }

    setTemplateList(updatedList);
    onSaveTemplates(updatedList);
    setEditingTemplate(null);
    setIsCreating(false);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Delete this template?')) {
      const updated = templateList.filter((t) => t.id !== id);
      setTemplateList(updated);
      onSaveTemplates(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white max-w-md w-full max-h-[92vh] flex flex-col border border-[#393939]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#393939] flex items-center justify-between bg-[#161616] text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 bg-[#0f62fe]"></div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider leading-tight">
                {isSelectionMode ? 'Select Freelance Template' : 'Freelance & Lump Sum Templates'}
              </h3>
              <p className="text-[11px] text-[#8d8d8d]">
                Lump sum rate templates for non-standard / part-work
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d8d8d] hover:text-white hover:bg-[#262626] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* If Editing or Creating a Template */}
          {(editingTemplate || isCreating) ? (
            <form onSubmit={handleSaveTemplateForm} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e0e0e0]">
                <span className="text-xs font-bold text-[#161616] uppercase tracking-wider">
                  {editingTemplate ? 'Edit Template' : 'Create New Lump Sum Template'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTemplate(null);
                    setIsCreating(false);
                  }}
                  className="text-xs text-[#525252] hover:text-[#161616] underline"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3D Visualization Pack"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="carbon-input w-full text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                    Lump Sum Rate (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={lumpSumRate}
                    onChange={(e) => handleRateChange(Number(e.target.value))}
                    className="carbon-input w-full text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. 3D, Liaison, Interior"
                    className="carbon-input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#525252] mb-1">
                  Description / Scope Summary
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of included deliverables..."
                  className="carbon-input w-full text-xs"
                />
              </div>

              {/* Milestones / Items breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#e0e0e0]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                    Milestones & Deliverables ({items.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-[#0f62fe] hover:text-[#0043ce] flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Milestone
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#525252] uppercase tracking-wider">
                          Item #{idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-[#da1e28] hover:text-[#ba1b23] p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Milestone title (e.g. 3D exterior renders)"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].name = e.target.value;
                          setItems(updated);
                        }}
                        className="carbon-input w-full text-xs font-semibold"
                      />

                      <textarea
                        rows={1}
                        placeholder="Deliverables description..."
                        value={item.deliverables}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].deliverables = e.target.value;
                          setItems(updated);
                        }}
                        className="carbon-input w-full text-xs"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-[#525252] uppercase block">Fee Split (%)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={item.percentage}
                            onChange={(e) => handleItemPercentageChange(idx, Number(e.target.value))}
                            className="carbon-input w-full text-xs font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#525252] uppercase block">Amount</label>
                          <span className="text-xs font-mono font-bold text-[#161616] block py-2">
                            {formatINR(item.amount, false)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="carbon-btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-white mr-1" />
                  <span>Save Template</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#525252]">
                  Available Lump Sum Presets ({templateList.length})
                </span>
                <button
                  onClick={handleStartCreate}
                  className="carbon-btn-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-white" />
                  New Template
                </button>
              </div>

              <div className="space-y-3">
                {templateList.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-3.5 bg-[#f4f4f4] hover:bg-[#e0e0e0] border border-[#e0e0e0] transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#0f62fe] uppercase tracking-wider block">
                          {tpl.category}
                        </span>
                        <h4 className="text-xs font-bold text-[#161616] mt-0.5">{tpl.title}</h4>
                      </div>
                      <span className="text-xs font-black font-mono text-[#161616] bg-white px-2 py-0.5 border border-[#8d8d8d]">
                        {formatINR(tpl.lumpSumRate, false)}
                      </span>
                    </div>

                    <p className="text-xs text-[#525252] line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>

                    <div className="pt-2 border-t border-[#e0e0e0] flex items-center justify-between">
                      <span className="text-[10px] text-[#8d8d8d] font-medium font-mono">
                        {tpl.items.length} milestones included
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStartEdit(tpl)}
                          className="p-1.5 text-[#525252] hover:text-[#161616] hover:bg-white border border-transparent hover:border-[#8d8d8d]"
                          title="Edit Template"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {tpl.isCustom && (
                          <button
                            onClick={() => handleDeleteTemplate(tpl.id)}
                            className="p-1.5 text-[#da1e28] hover:text-[#ba1b23] hover:bg-white border border-transparent hover:border-[#8d8d8d]"
                            title="Delete Template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isSelectionMode && onSelectTemplate && (
                          <button
                            onClick={() => {
                              onSelectTemplate(tpl);
                              onClose();
                            }}
                            className="carbon-btn-primary px-3 py-1 text-xs font-bold uppercase tracking-wider"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
