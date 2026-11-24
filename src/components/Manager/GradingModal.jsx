import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  File, 
  FileText, 
  Sparkles, 
  Award, 
  Clock, 
  User, 
  School,
  Send,
  RotateCcw
} from 'lucide-react';
import { FormatBadge } from '../UI/Badge';

export function GradingModal({ 
  submission, 
  isOpen, 
  onClose, 
  onGradeSubmit, 
  reviewerName 
}) {
  if (!isOpen || !submission) return null;

  const [points, setPoints] = useState(submission.pointsAwarded ?? submission.maxPoints);
  const [status, setStatus] = useState(submission.status === 'pending_review' ? 'approved' : submission.status);
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPoints(submission.pointsAwarded ?? submission.maxPoints);
    setStatus(submission.status === 'pending_review' ? 'approved' : submission.status);
    setFeedback(submission.feedback || '');
    setError('');
  }, [submission]);

  const handleQuickPoints = (fraction) => {
    setPoints(Math.round(submission.maxPoints * fraction));
  };

  const handleQuickFeedback = (text) => {
    setFeedback((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (points === '' || points < 0 || points > submission.maxPoints) {
      setError(`Points awarded must be between 0 and ${submission.maxPoints}.`);
      return;
    }
    if (status === 'needs_revision' && !feedback.trim()) {
      setError('Please provide feedback explaining what needs revision.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onGradeSubmit(submission.id, {
        pointsAwarded: Number(points),
        status: status,
        feedback: feedback.trim(),
        reviewedBy: reviewerName,
        reviewedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-modal overflow-hidden transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-1.5 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Evaluation Desk
              </span>
              <FormatBadge type={submission.submissionType} />
              <span className="text-xs text-slate-400">Max: {submission.maxPoints} pts</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              {submission.taskTitle}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1 font-semibold text-white">
                <User className="w-3.5 h-3.5 text-orange-400" />
                {submission.ambassadorName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <School className="w-3.5 h-3.5 text-slate-400" />
                {submission.college}
              </span>
              <span>•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {submission.submittedAt}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Submitted Deliverable Review Box */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Submitted Proof / Deliverable
              </span>
              <span className="text-[11px] font-semibold text-slate-500 capitalize">
                {submission.submissionType} Submission
              </span>
            </div>

            {/* Case A: LINK */}
            {submission.submissionType === 'link' && submission.submissionData?.link && (
              <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">Provided URL</p>
                    <p className="text-sm font-bold text-blue-600 truncate underline">
                      {submission.submissionData.link}
                    </p>
                  </div>
                </div>
                <a
                  href={submission.submissionData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors shrink-0"
                >
                  <span>Open & Verify Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Case B: FILE */}
            {submission.submissionType === 'file' && (
              <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {submission.submissionData?.fileName || 'Ambassador_Report.pdf'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {submission.submissionData?.fileSize || '3.2 MB'} • Uploaded by ambassador
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Simulated file preview for: ${submission.submissionData?.fileName || 'Document.pdf'}`)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
                >
                  View Attachment
                </button>
              </div>
            )}

            {/* Case C: TEXT */}
            {submission.submissionType === 'text' && (
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Written Response:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {submission.submissionData?.text || 'No text provided.'}
                </p>
              </div>
            )}
          </div>

          {/* Form Error */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grading Controls */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Evaluation Decision / Status:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('approved')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    status === 'approved'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('needs_revision')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    status === 'needs_revision'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Needs Revision</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatus('rejected');
                    setPoints(0);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    status === 'rejected'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

            {/* Points Awarded */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Points to Award (Max {submission.maxPoints} pts):
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Quick set:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickPoints(1)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    100%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPoints(0.8)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    80%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPoints(0.5)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    50%
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Award className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="0"
                  max={submission.maxPoints}
                  value={points}
                  onChange={(e) => setPoints(e.target.value === '' ? '' : Number(e.target.value))}
                  disabled={status === 'rejected'}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Reviewer Feedback */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Feedback & Evaluation Notes:
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add comments on why this was approved, or specific instructions for revision..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 leading-relaxed font-sans"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Quick tags:
                </span>
                {[
                  "Verified and approved!",
                  "Great outreach & high engagement.",
                  "Proof link is accessible.",
                  "Please attach clearer photos.",
                  "Missing coordinator contact info."
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickFeedback(tag)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
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
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Grade & Feedback</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
