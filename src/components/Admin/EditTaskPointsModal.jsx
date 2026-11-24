import React, { useState, useEffect } from 'react';
import { X, Award, Calendar, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { FormatBadge } from '../UI/Badge';

export function EditTaskPointsModal({ task, isOpen, onClose, onSaveTask }) {
  if (!isOpen || !task) return null;

  const [points, setPoints] = useState(task.points);
  const [deadline, setDeadline] = useState(task.deadline);
  const [title, setTitle] = useState(task.title);
  const [shortDesc, setShortDesc] = useState(task.shortDescription);
  const [error, setError] = useState('');

  useEffect(() => {
    setPoints(task.points);
    setDeadline(task.deadline);
    setTitle(task.title);
    setShortDesc(task.shortDescription);
    setError('');
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!points || Number(points) <= 0) {
      setError('Points must be a positive number.');
      return;
    }
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }

    onSaveTask(task.id, {
      points: Number(points),
      deadline: deadline.trim(),
      title: title.trim(),
      shortDescription: shortDesc.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-modal overflow-hidden transform transition-all my-8"
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
              Edit Task Points & Parameters
            </h2>
            <p className="text-xs text-slate-300">
              Modify points weighting or deadline for this task.
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Info Pill */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Format:</span>
            <FormatBadge type={task.submissionType} />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Points Awarded (Key Request) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Points Value (Weighting) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-500">
                <Award className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="10"
                max="1000"
                step="10"
                required
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl pl-10 pr-4 py-2 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Changing this updates the score weighting for both future and active submissions.
            </p>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Submission Deadline
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-3 text-xs focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Save & Update Points</span>
              <Save className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
