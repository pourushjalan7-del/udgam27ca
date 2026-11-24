import React from 'react';
import { 
  Users, 
  CheckSquare, 
  Clock, 
  Award, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight, 
  School,
  Coins,
  Briefcase
} from 'lucide-react';
import { FormatBadge } from '../UI/Badge';

export function AdminOverview({ 
  user, 
  tasks, 
  submissions, 
  leaderboard, 
  onNavigate,
  onOpenNewTaskModal,
  onOpenGradingModal 
}) {
  const pendingCount = submissions.filter((s) => s.status === 'pending_review').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const totalSubmissions = submissions.length;
  const totalPointsPool = tasks.reduce((acc, t) => acc + (t.points || 0), 0);
  const totalPointsAwarded = submissions.reduce((acc, s) => acc + (s.pointsAwarded || 0), 0);

  const approvalRate = totalSubmissions > 0 ? Math.round((approvedCount / totalSubmissions) * 100) : 0;

  // Recent 4 submissions
  const recentSubmissions = submissions.slice(0, 4);

  // Top colleges by score
  const topColleges = [...leaderboard].slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#1C2541] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-40 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Administrator Operations Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hello, {user?.name || 'Aman Singhania'} 🛡️
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Full administrative oversight of UDGAM'27 Campus Ambassador Program. Manage point weightings, publish new deliverables, and oversee national rankings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy New Task</span>
            </button>
            <button
              onClick={() => onNavigate('submissions')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-orange-400" />
              <span>Review Submissions ({pendingCount})</span>
            </button>
            <button
              onClick={() => onNavigate('managers')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 text-white text-xs font-semibold border border-indigo-400/30 transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-indigo-300" />
              <span>Manager Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div 
          onClick={() => onNavigate('directory')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:border-blue-300 transition-all cursor-pointer group"
          title="Open Ambassador Directory"
        >
          <div className="flex items-center justify-between mb-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span className="group-hover:text-blue-600 transition-colors">Registered Ambassadors</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{leaderboard.length}</span>
            <span className="text-xs text-slate-500 font-semibold">Campuses</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="group-hover:text-blue-600 transition-colors flex items-center gap-1">Manage Roster →</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Tasks Deployed</span>
            <CheckSquare className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{tasks.length}</span>
            <span className="text-xs text-slate-500 font-semibold">Deliverables</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Pool: {totalPointsPool.toLocaleString()} pts</span>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Phase 1</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Evaluation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingCount}</span>
            <span className="text-xs text-amber-600 font-semibold">Awaiting Action</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{approvedCount} already graded</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Review Queue</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Points Awarded</span>
            <Coins className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalPointsAwarded.toLocaleString()}</span>
            <span className="text-xs text-indigo-600 font-semibold">Points Total</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Approval Rate: {approvalRate}%</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Verified</span>
          </div>
        </div>
      </div>

      {/* Grid: Top Colleges & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Colleges */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Top Colleges by Performance
                </h3>
                <p className="text-xs text-slate-500">Leading institutes ranked by aggregate points</p>
              </div>
              <button
                onClick={() => onNavigate('leaderboard')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Leaderboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topColleges.map((col, idx) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                      idx === 0 ? 'bg-amber-100 text-amber-800' :
                      idx === 1 ? 'bg-slate-200 text-slate-800' :
                      idx === 2 ? 'bg-amber-50 text-amber-900' : 'bg-white text-slate-600'
                    }`}>
                      #{col.rank}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{col.college}</p>
                      <p className="text-[11px] text-slate-500">{col.name} ({col.tasksCompleted} Tasks)</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-orange-600">
                    {col.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500 font-medium">
              Rankings dynamically recalculate as tasks are verified.
            </span>
          </div>
        </div>

        {/* Recent Submissions Queue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent Submissions Stream
                </h3>
                <p className="text-xs text-slate-500">Deliverables uploaded by ambassadors</p>
              </div>
              <button
                onClick={() => onNavigate('submissions')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({submissions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onOpenGradingModal(sub)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <FormatBadge type={sub.submissionType} />
                      <span className="text-[10px] text-slate-400 font-medium">{sub.submittedAt}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {sub.taskTitle}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {sub.ambassadorName} • {sub.college}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      sub.status === 'pending_review' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {sub.status === 'approved' ? 'Graded' : sub.status === 'pending_review' ? 'Pending' : 'Revision'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold group-hover:text-orange-600 flex items-center gap-0.5">
                      Review <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('submissions')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              Open Evaluation Queue ({pendingCount} pending review) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
