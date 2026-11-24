import React from 'react';
import { Target, Award, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export function ProgressSection({ 
  completedTasks, 
  totalTasks, 
  completionRate, 
  onNavigateTasks 
}) {
  // SVG circular calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  const milestones = [
    { target: 25, label: "Certificate", reached: completionRate >= 25 },
    { target: 50, label: "Summit Pass", reached: completionRate >= 50 },
    { target: 75, label: "Exclusive Merch", reached: completionRate >= 75 },
    { target: 100, label: "Letter of Rec", reached: completionRate >= 100 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              My Ambassador Progress
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-700">
              Live Evaluation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time track of your deliverables, milestone badges, and summit tier benefits.
          </p>
        </div>

        <button
          onClick={onNavigateTasks}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Open Task Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 items-center">
        {/* Circular Indicator Column */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="11"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-orange-500 transition-all duration-1000 ease-out"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {completionRate}%
              </span>
              <span className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Completed
              </span>
            </div>
          </div>

          <div className="text-center sm:text-left lg:text-center">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              <Target className="w-3.5 h-3.5 text-orange-500" />
              <span>{completedTasks} of {totalTasks} Tasks Submitted</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {totalTasks - completedTasks > 0
                ? `${totalTasks - completedTasks} more tasks to reach 100% completion`
                : 'All assigned tasks successfully completed! 🎉'}
            </p>
          </div>
        </div>

        {/* Linear Progress and Milestones Column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Task Completion Bar</span>
                <span className="text-xs text-slate-500">({completedTasks}/{totalTasks} Completed)</span>
              </div>
              <span className="text-sm font-extrabold text-orange-600">{completionRate}%</span>
            </div>

            {/* Large Horizontal Progress Bar */}
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${Math.min(100, Math.max(4, completionRate))}%` }}
              />
            </div>
          </div>

          {/* Reward Milestones Roadmap */}
          <div>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-3">
              Ambassador Milestone Unlocks
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    m.reached
                      ? 'bg-orange-50/70 border-orange-200 text-orange-900 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1.5">
                    {m.reached ? (
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-400">
                        {m.target}%
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold leading-tight truncate">{m.label}</p>
                  <span className="text-[10px] opacity-75 mt-0.5 block">{m.target}% Mark</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
