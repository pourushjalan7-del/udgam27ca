import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Award, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export function NewTaskModal({ isOpen, onClose, onAddTask }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [detailedDesc, setDetailedDesc] = useState('');
  const [submissionType, setSubmissionType] = useState('link'); // 'link' | 'file' | 'text'
  const [acceptedFormats, setAcceptedFormats] = useState('.pdf');
  const [points, setPoints] = useState(150);
  const [deadline, setDeadline] = useState('Dec 05, 2026');
  const [submissionRequirements, setSubmissionRequirements] = useState('');
  const [instructions, setInstructions] = useState([
    'Review the official guidelines provided in the media kit.',
    'Execute the outreach campaign across your college.',
    'Take clear proof/screenshots and submit via the designated format.'
  ]);
  const [error, setError] = useState('');

  const handleAddInstructionStep = () => {
    setInstructions([...instructions, '']);
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleRemoveInstruction = (index) => {
    if (instructions.length <= 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim() || !detailedDesc.trim()) {
      setError('Please fill out all required task title and descriptions.');
      return;
    }
    if (!points || points <= 0) {
      setError('Please assign a valid point value greater than 0.');
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      shortDescription: shortDesc.trim(),
      detailedDescription: detailedDesc.trim(),
      instructions: instructions.filter((i) => i.trim() !== ''),
      submissionRequirements: submissionRequirements.trim() || 'Provide verifiable proof as outlined in instructions.',
      submissionType: submissionType,
      acceptedFormats: submissionType === 'file' ? acceptedFormats : undefined,
      placeholderText: submissionType === 'link' ? 'https://...' : undefined,
      assignedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      deadline: deadline,
      status: 'pending',
      points: Number(points)
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-modal overflow-hidden transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Admin Exclusive
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Create New Ambassador Task
            </h2>
            <p className="text-xs text-slate-300">
              Deploy a new deliverable across all registered Campus Ambassadors.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Host an offline UDGAM'27 Startup Pitch Screening on campus"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
            />
          </div>

          {/* Short & Detailed Description */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Summary / Card Description *
              </label>
              <input
                type="text"
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="1-2 sentences summarizing the deliverable for task cards"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Objective & Context *
              </label>
              <textarea
                rows={3}
                required
                value={detailedDesc}
                onChange={(e) => setDetailedDesc(e.target.value)}
                placeholder="Elaborate on why this task matters, target reach numbers, and guidelines..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Submission Format & Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Submission Format *
              </label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="link">Link Submission (URL)</option>
                <option value="file">File Upload (Document/Image)</option>
                <option value="text">Written Text Response</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Points to Award *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Award className="w-4 h-4 text-orange-500" />
                </div>
                <input
                  type="number"
                  required
                  min="10"
                  max="1000"
                  step="10"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Submission Deadline *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. Dec 05, 2026"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>

          {/* If file format, allow setting extensions */}
          {submissionType === 'file' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Accepted File Formats
              </label>
              <input
                type="text"
                value={acceptedFormats}
                onChange={(e) => setAcceptedFormats(e.target.value)}
                placeholder="e.g. .pdf,.png,.jpg,.xlsx"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          )}

          {/* Deliverable Requirements */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Deliverable Verification Criteria
            </label>
            <input
              type="text"
              value={submissionRequirements}
              onChange={(e) => setSubmissionRequirements(e.target.value)}
              placeholder="e.g. Public Google Drive folder or PDF report containing attendee roster & photos."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step-by-Step Instructions
              </label>
              <button
                type="button"
                onClick={handleAddInstructionStep}
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xs">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                    placeholder={`Step ${idx + 1} instructions...`}
                    className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Publish Task to Portal</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
