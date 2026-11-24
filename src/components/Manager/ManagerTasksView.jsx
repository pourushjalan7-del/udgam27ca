import React, { useState } from 'react';
import { 
  CheckSquare, 
  Lock, 
  Search, 
  Calendar, 
  Eye, 
  AlertCircle, 
  Award, 
  ArrowUpRight, 
  Info 
} from 'lucide-react';
import { FormatBadge } from '../UI/Badge';

export function ManagerTasksView({ tasks, submissions, onFilterSubmissionsByTask }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.submissionType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header with Permission Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assigned Program Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review active task parameters and check submission volume per task.
          </p>
        </div>

        {/* Manager Role Scope Banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Adding tasks & editing points restricted to <strong>Super Admin</strong></span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-700">
          Showing {filteredTasks.length} Active Ambassador Deliverables
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
          const pendingForThis = taskSubmissions.filter((s) => s.status === 'pending_review').length;

          return (
            <div
              key={task.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <FormatBadge type={task.submissionType} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      {task.points} pts
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
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

                {pendingForThis > 0 && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center justify-between">
                    <span>{pendingForThis} pending grading</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  </div>
                )}

                <button
                  onClick={() => onFilterSubmissionsByTask(task.id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Review Submissions ({taskSubmissions.length})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
