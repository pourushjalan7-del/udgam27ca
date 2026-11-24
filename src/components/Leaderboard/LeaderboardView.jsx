import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Search, 
  Zap, 
  Award, 
  TrendingUp, 
  School, 
  Flame, 
  Sparkles,
  ArrowUp,
  Info
} from 'lucide-react';
import { PerformanceBadge } from '../UI/Badge';

export function LeaderboardView({ leaderboardData, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Top 3 Podium entries
  const top1 = leaderboardData[0];
  const top2 = leaderboardData[1];
  const top3 = leaderboardData[2];

  // Current user's entry
  const userEntry = leaderboardData.find((entry) => entry.isCurrentUser);

  // Search filter
  const filteredData = leaderboardData.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.name.toLowerCase().includes(q) ||
      entry.college.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-orange-600" />
            <span>National Ambassador Standings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Ambassador Leaderboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your efforts, your progress, your rank.
          </p>
        </div>

        {/* User Rank Card Highlight */}
        {userEntry && (
          <div className="bg-orange-500 text-white rounded-2xl p-4 shadow-lg shadow-orange-500/20 flex items-center gap-4 border border-orange-400">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
              #{userEntry.rank}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-orange-100 font-bold">
                Your Current Rank
              </p>
              <p className="text-sm font-extrabold">{userEntry.name} (You)</p>
              <p className="text-[11px] text-orange-100">{userEntry.tasksCompleted} Tasks • {userEntry.avgSpeed} avg</p>
            </div>
          </div>
        )}
      </div>

      {/* TOP 3 PODIUM SECTION */}
      <div className="relative pt-6 pb-2">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Summit Hall of Fame
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            Top Performing Ambassadors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto items-end">
          {/* Rank 2: Silver */}
          {top2 && (
            <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-card flex flex-col items-center text-center relative overflow-hidden group hover:border-slate-400 transition-all">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300" />
              
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-black text-slate-700 text-xl shadow-md">
                  {top2.avatar}
                </div>
                <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 flex items-center justify-center font-black text-xs border-2 border-white shadow">
                  2
                </div>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mb-1">
                Silver Medalist
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {top2.name} {top2.isCurrentUser && '(You)'}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <School className="w-3 h-3 text-slate-400" />
                {top2.college}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 w-full grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-xs font-bold text-slate-900 block">{top2.tasksCompleted}</span>
                  <span className="text-[10px] text-slate-500">Tasks</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-xs font-bold text-slate-900 block">{top2.avgSpeed}</span>
                  <span className="text-[10px] text-slate-500">Avg Speed</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1: Gold (Center & Elevated) */}
          {top1 && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/60 to-white rounded-3xl p-7 border-2 border-amber-400 shadow-xl shadow-amber-500/10 flex flex-col items-center text-center relative overflow-hidden group hover:scale-[1.02] transition-all -translate-y-2 md:-translate-y-4">
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
              
              <div className="mb-2">
                <Trophy className="w-7 h-7 text-amber-500 animate-bounce" />
              </div>

              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-yellow-400 border-4 border-amber-300 flex items-center justify-center font-black text-amber-950 text-2xl shadow-lg ring-4 ring-amber-100">
                  {top1.avatar}
                </div>
                <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-md">
                  1
                </div>
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-200/80 px-3 py-0.5 rounded-full mb-1">
                🏆 National Leader • Gold
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {top1.name} {top1.isCurrentUser && '(You)'}
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                <School className="w-3.5 h-3.5 text-amber-600" />
                {top1.college}
              </p>

              <div className="mt-4 pt-4 border-t border-amber-100 w-full grid grid-cols-2 gap-2 text-center">
                <div className="bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/50">
                  <span className="text-sm font-black text-amber-950 block">{top1.tasksCompleted} Tasks</span>
                  <span className="text-[10px] font-semibold text-amber-700">Submissions</span>
                </div>
                <div className="bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/50">
                  <span className="text-sm font-black text-amber-950 block">{top1.avgSpeed}</span>
                  <span className="text-[10px] font-semibold text-amber-700">Avg Speed</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3: Bronze */}
          {top3 && (
            <div className="order-3 md:order-3 bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-card flex flex-col items-center text-center relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600" />
              
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center font-black text-amber-800 text-xl shadow-md">
                  {top3.avatar}
                </div>
                <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-black text-xs border-2 border-white shadow">
                  3
                </div>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mb-1">
                Bronze Medalist
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {top3.name} {top3.isCurrentUser && '(You)'}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <School className="w-3 h-3 text-slate-400" />
                {top3.college}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 w-full grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-xs font-bold text-slate-900 block">{top3.tasksCompleted}</span>
                  <span className="text-[10px] text-slate-500">Tasks</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-xs font-bold text-slate-900 block">{top3.avgSpeed}</span>
                  <span className="text-[10px] text-slate-500">Avg Speed</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH AND TABLE CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Complete Ambassador Rankings
            </h3>
            <p className="text-xs text-slate-500">
              Rankings dynamically recalculate as tasks are submitted and verified.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ambassador or college..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-16">Rank</th>
                <th className="py-3.5 px-4">Participant Name</th>
                <th className="py-3.5 px-4">College Name</th>
                <th className="py-3.5 px-4">Tasks Completed</th>
                <th className="py-3.5 px-4">Average Submission Speed</th>
                <th className="py-3.5 px-4">Overall Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No ambassadors matched "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => {
                  const isCurrent = row.isCurrentUser;
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-orange-50/90 font-semibold text-slate-900 border-l-4 border-l-orange-500'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {row.rank === 1 && (
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black flex items-center justify-center text-xs">
                              🥇
                            </span>
                          )}
                          {row.rank === 2 && (
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-black flex items-center justify-center text-xs">
                              🥈
                            </span>
                          )}
                          {row.rank === 3 && (
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                              🥉
                            </span>
                          )}
                          {row.rank > 3 && (
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                              #{row.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Participant Name + Avatar */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isCurrent
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {row.avatar}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">
                              {row.name}
                            </span>
                            {isCurrent && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-600 text-white uppercase tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* College Name */}
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap font-medium">
                        {row.college}
                      </td>

                      {/* Tasks Completed */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold">
                          {row.tasksCompleted} Tasks
                        </span>
                      </td>

                      {/* Average Submission Speed */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                        <span className="flex items-center gap-1 text-xs">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          {row.avgSpeed}
                        </span>
                      </td>

                      {/* Overall Performance */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <PerformanceBadge performance={row.performance} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
