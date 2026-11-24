import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Search, 
  Calendar, 
  Award, 
  CheckSquare, 
  Sparkles, 
  ArrowUpRight, 
  Coins, 
  Layers,
  Filter
} from 'lucide-react';
import { FormatBadge } from '../UI/Badge';

export function TaskManagement({ 
  tasks, 
  submissions, 
  onOpenNewTaskModal, 
  onOpenEditPointsModal,
  onNavigateSubmissions 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');

  const totalPointsPool = tasks.reduce((acc, t) => acc + (t.points || 0), 0);
  const avgPoints = tasks.length > 0 ? Math.round(totalPointsPool / tasks.length) : 0;

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFormat = formatFilter === 'all' || t.submissionType === formatFilter;

    return matchesSearch && matchesFormat;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-semibold mb-2">
            <Coins className="w-3.5 h-3.5 text-orange-600" />
            <span>Task Master Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Task Management & Points Weighting
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create new tasks, adjust point weightings, and oversee ambassador deliverables.
          </p>
        </div>

        {/* Primary Action: Add Task */}
        <button
          onClick={onOpenNewTaskModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Tasks Deployed</span>
            <Layers className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">{tasks.length}</span>
          <p className="text-[11px] text-slate-500 mt-1">Active across all colleges</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Points Pool</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">{totalPointsPool.toLocaleString()} pts</span>
          <p className="text-[11px] text-slate-500 mt-1">Maximum score achievable</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Average Points / Task</span>
            <Coins className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">{avgPoints} pts</span>
          <p className="text-[11px] text-slate-500 mt-1">Difficulty balanced</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Format:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            {['all', 'link', 'file', 'text'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                  formatFilter === fmt
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {fmt === 'all' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => {
          const taskSubmissions = submissions.filter((s) => s.taskId === task.id);
          const pendingCount = taskSubmissions.filter((s) => s.status === 'pending_review').length;

          return (
            <div
              key={task.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <FormatBadge type={task.submissionType} />
                  <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 font-extrabold border border-orange-200 flex items-center gap-1 shadow-xs">
                    <Award className="w-3.5 h-3.5 text-orange-600" />
                    {task.points} pts
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {task.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: <strong className="text-slate-700">{task.deadline}</strong>
                  </span>
                  <span className="font-semibold text-slate-700">
                    {taskSubmissions.length} Submissions
                  </span>
                </div>

                {pendingCount > 0 && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center justify-between">
                    <span>{pendingCount} awaiting evaluation</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  </div>
                )}

                {/* Admin Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onOpenEditPointsModal(task)}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-orange-600" />
                    <span>Edit Points</span>
                  </button>

                  <button
                    onClick={() => onNavigateSubmissions(task.id)}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View ({taskSubmissions.length})</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
