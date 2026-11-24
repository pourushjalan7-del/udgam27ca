import React from 'react';
import { CheckCircle2, ChevronRight, FileCheck, ExternalLink, Calendar } from 'lucide-react';
import { StatusBadge, FormatBadge } from '../UI/Badge';

export function RecentSubmissions({ completedTasksList, onSelectTask, onNavigateTasks }) {
  const displayTasks = completedTasksList.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Recent Submissions</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              {completedTasksList.length} Verified
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Your submitted deliverables and validation status</p>
        </div>
        <button
          onClick={onNavigateTasks}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer hover:underline"
        >
          <span>View All Tasks</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-start">
        {displayTasks.length === 0 ? (
          <div className="py-10 text-center my-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">No submissions yet</p>
            <p className="text-xs text-slate-500 mt-1">Submit your first task to start scoring points!</p>
          </div>
        ) : (
          displayTasks.map((task) => (
            <div
              key={task.id}
              className="py-4 first:pt-4 last:pb-2 group hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
              onClick={() => onSelectTask(task)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <FormatBadge type={task.submissionType} />
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Submitted on {task.submittedDate || 'Recent'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {task.title}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                    <span>•</span>
                    <span>+{task.points} points awarded</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2 pt-1">
                  <StatusBadge status={task.status} />
                  <span className="text-[11px] text-slate-400 font-medium group-hover:text-orange-600 flex items-center gap-0.5">
                    View submission <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {completedTasksList.length > 3 && (
        <div className="pt-3 mt-auto border-t border-slate-100 text-center">
          <button
            onClick={onNavigateTasks}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            + {completedTasksList.length - 3} more completed submissions
          </button>
        </div>
      )}
    </div>
  );
}
