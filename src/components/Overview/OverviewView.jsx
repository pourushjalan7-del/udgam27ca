import React from 'react';
import { MetricCards } from './MetricCards';
import { ProgressSection } from './ProgressSection';
import { UpcomingTasks } from './UpcomingTasks';
import { RecentSubmissions } from './RecentSubmissions';
import { Sparkles, Calendar, School, Trophy, Award } from 'lucide-react';

export function OverviewView({ 
  user, 
  tasks, 
  onSelectTask, 
  onNavigateTasks,
  userLeaderboardEntry
}) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasksList = tasks.filter((t) => t.status === 'completed');
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#1C2541] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-40 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UDGAM'27 Official Ambassador Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hello, {user?.name || 'Rahul'} 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Welcome to your UDGAM'27 Campus Ambassador Dashboard. Track your assigned outreach tasks, upload proofs, and compete for top national honors with E-Cell, IIT Guwahati.
            </p>
          </div>

          {/* Quick Rank Card */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold">National Rank</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-white">#{userLeaderboardEntry?.rank || 5}</span>
                <span className="text-xs text-orange-300 font-medium">of 120+ CAs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{user?.college}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <MetricCards
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks.length}
        completionRate={completionRate}
      />

      {/* Section A: My Progress */}
      <ProgressSection
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        completionRate={completionRate}
        onNavigateTasks={onNavigateTasks}
      />

      {/* Section B & C: Upcoming Tasks & Recent Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks
          pendingTasks={pendingTasks}
          onSelectTask={onSelectTask}
          onNavigateTasks={onNavigateTasks}
        />
        <RecentSubmissions
          completedTasksList={completedTasksList}
          onSelectTask={onSelectTask}
          onNavigateTasks={onNavigateTasks}
        />
      </div>
    </div>
  );
}
