import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Search, 
  Filter, 
  FileText, 
  ExternalLink, 
  CheckSquare, 
  Award, 
  School, 
  User, 
  ChevronRight, 
  Eye, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { FormatBadge } from '../UI/Badge';

export function SubmissionsReviewView({ 
  submissions, 
  tasks, 
  onOpenGradingModal, 
  userRole = 'manager' 
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'revision' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('all');

  // Filter counts
  const pendingCount = submissions.filter((s) => s.status === 'pending_review').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const revisionCount = submissions.filter((s) => s.status === 'needs_revision').length;
  const totalCount = submissions.length;

  // Filter submissions by tab
  let filtered = submissions;
  if (activeTab === 'pending') {
    filtered = filtered.filter((s) => s.status === 'pending_review');
  } else if (activeTab === 'approved') {
    filtered = filtered.filter((s) => s.status === 'approved');
  } else if (activeTab === 'revision') {
    filtered = filtered.filter((s) => s.status === 'needs_revision');
  }

  // Filter by task
  if (selectedTaskFilter !== 'all') {
    filtered = filtered.filter((s) => s.taskId === selectedTaskFilter);
  }

  // Filter by search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.ambassadorName.toLowerCase().includes(q) ||
        s.college.toLowerCase().includes(q) ||
        s.taskTitle.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#1C2541] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{userRole === 'admin' ? 'Admin Submissions Center' : 'Manager Grading Portal'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Task Evaluation & Grading
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Review submitted proofs from Campus Ambassadors across India. Inspect deliverables, assign scores, request revisions, and verify points.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
              {pendingCount}
            </div>
            <div>
              <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Awaiting Review</p>
              <p className="text-xs text-orange-300">Requires grading action</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-50/80 border-amber-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">{pendingCount}</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Tasks to be graded</p>
        </div>

        <div 
          onClick={() => setActiveTab('approved')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-emerald-50/80 border-emerald-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
            <span>Approved & Graded</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">{approvedCount}</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Points recorded</p>
        </div>

        <div 
          onClick={() => setActiveTab('revision')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'revision'
              ? 'bg-rose-50/80 border-rose-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
            <span>Needs Revision</span>
            <RotateCcw className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">{revisionCount}</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Returned with feedback</p>
        </div>

        <div 
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-50/80 border-blue-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-700 font-semibold mb-1">
            <span>Total Submissions</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">{totalCount}</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all CAs</p>
        </div>
      </div>

      {/* Filter Bar & Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'approved'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('revision')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'revision'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Needs Revision ({revisionCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All ({totalCount})</span>
          </button>
        </div>

        {/* Search & Task Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Specific Task Filter */}
          <select
            value={selectedTaskFilter}
            onChange={(e) => setSelectedTaskFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="all">All Tasks Filter</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title.slice(0, 32)}...
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ambassador or college..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No submissions found</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no submissions matching your active filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Ambassador</th>
                  <th className="py-3.5 px-4">Task Deliverable</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-4">Evaluation Status</th>
                  <th className="py-3.5 px-4">Score Awarded</th>
                  <th className="py-3.5 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((sub) => {
                  const isPending = sub.status === 'pending_review';
                  const isApproved = sub.status === 'approved';
                  const isRevision = sub.status === 'needs_revision';

                  return (
                    <tr 
                      key={sub.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onOpenGradingModal(sub)}
                    >
                      {/* Ambassador */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {sub.avatar || sub.ambassadorName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {sub.ambassadorName}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {sub.college}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Task Deliverable */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-semibold text-slate-900 line-clamp-1">
                          {sub.taskTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {sub.submissionType === 'file' 
                            ? `File: ${sub.submissionData?.fileName}` 
                            : sub.submissionType === 'link' 
                            ? `URL: ${sub.submissionData?.link}` 
                            : `Text: ${sub.submissionData?.text?.slice(0, 40)}...`}
                        </p>
                      </td>

                      {/* Format */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <FormatBadge type={sub.submissionType} />
                      </td>

                      {/* Submitted At */}
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        {sub.submittedAt}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved
                          </span>
                        )}
                        {isRevision && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <RotateCcw className="w-3.5 h-3.5" />
                            Needs Revision
                          </span>
                        )}
                      </td>

                      {/* Score */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {sub.pointsAwarded !== null ? (
                          <span className="font-extrabold text-slate-900">
                            {sub.pointsAwarded} <span className="text-slate-400 font-normal">/ {sub.maxPoints} pts</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">
                            Unscored (Max {sub.maxPoints})
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenGradingModal(sub);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isPending
                              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{isPending ? 'Grade Task' : 'Edit Grade'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
