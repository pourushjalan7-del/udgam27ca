import React from 'react';
import { Calendar, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';
import { StatusBadge, FormatBadge } from '../UI/Badge';

export function UpcomingTasks({ pendingTasks, onSelectTask, onNavigateTasks }) {
  const displayTasks = pendingTasks.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Upcoming Tasks</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
              {pendingTasks.length} Pending
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Tasks requiring your immediate submission</p>
        </div>
        <button
          onClick={onNavigateTasks}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer hover:underline"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-start">
        {displayTasks.length === 0 ? (
          <div className="py-10 text-center my-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              🎉
            </div>
            <p className="text-sm font-semibold text-slate-800">All tasks completed!</p>
            <p className="text-xs text-slate-500 mt-1">You are completely up to date with your submissions.</p>
          </div>
        ) : (
          displayTasks.map((task) => (
            <div
              key={task.id}
              className="py-4 first:pt-4 last:pb-2 group hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <FormatBadge type={task.submissionType} />
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Due {task.deadline}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {task.shortDescription}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2 pt-1">
                  <StatusBadge status={task.status} />
                  <button
                    onClick={() => onSelectTask(task)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>View Task</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {pendingTasks.length > 3 && (
        <div className="pt-3 mt-auto border-t border-slate-100 text-center">
          <button
            onClick={onNavigateTasks}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            + {pendingTasks.length - 3} more pending tasks awaiting submission
          </button>
        </div>
      )}
    </div>
  );
}
