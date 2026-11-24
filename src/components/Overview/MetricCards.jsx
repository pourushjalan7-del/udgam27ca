import React from 'react';
import { CheckCircle2, Clock, ListChecks, Percent, TrendingUp } from 'lucide-react';

export function MetricCards({ totalTasks, completedTasks, pendingTasks, completionRate }) {
  const cards = [
    {
      title: "Total Tasks",
      value: `${totalTasks}`,
      suffix: "Assigned",
      subtext: "Tasks curated for Phase 1",
      icon: ListChecks,
      color: "blue",
      badgeText: "Phase 1 Scope",
      bgColor: "bg-blue-50/70",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
    },
    {
      title: "Completed Tasks",
      value: `${completedTasks}`,
      suffix: "Done",
      subtext: "Successfully verified & submitted",
      icon: CheckCircle2,
      color: "emerald",
      badgeText: "Submitted",
      bgColor: "bg-emerald-50/70",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
    },
    {
      title: "Pending Tasks",
      value: `${pendingTasks}`,
      suffix: "Remaining",
      subtext: "Requires ambassador action",
      icon: Clock,
      color: "orange",
      badgeText: "Action Needed",
      bgColor: "bg-orange-50/70",
      textColor: "text-orange-600",
      borderColor: "border-orange-100",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      suffix: "Progress",
      subtext: `${completedTasks} of ${totalTasks} completed`,
      icon: Percent,
      color: "indigo",
      badgeText: "Dynamic Score",
      bgColor: "bg-indigo-50/70",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {card.suffix}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate">{card.subtext}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.bgColor} ${card.textColor}`}>
                {card.badgeText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
