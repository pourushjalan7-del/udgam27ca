import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  School, 
  Mail, 
  Phone, 
  Trophy, 
  Award, 
  Zap, 
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle,
  X,
  UserCheck
} from 'lucide-react';
import { PerformanceBadge } from '../UI/Badge';

export function AmbassadorDirectory({ 
  leaderboard = [], 
  submissions = [], 
  onFilterSubmissionsByAmbassador,
  onOpenNewAmbassadorModal,
  onRemoveAmbassador
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ambassadorToDelete, setAmbassadorToDelete] = useState(null);

  const filteredAmbassadors = leaderboard.filter((amb) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      amb.name.toLowerCase().includes(q) ||
      amb.college.toLowerCase().includes(q) ||
      (amb.email && amb.email.toLowerCase().includes(q)) ||
      (amb.caId && amb.caId.toLowerCase().includes(q))
    );
  });

  const confirmDelete = () => {
    if (ambassadorToDelete && onRemoveAmbassador) {
      onRemoveAmbassador(ambassadorToDelete.id);
      setAmbassadorToDelete(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-orange-600" />
            <span>National Ambassador Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ambassador Directory & Performance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete institutional records, contact channels, and submission health of all ambassadors.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={onOpenNewAmbassadorModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Ambassador</span>
          </button>
          <div className="text-xs px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold">
            {leaderboard.length} Registered CAs
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700">
          Showing {filteredAmbassadors.length} of {leaderboard.length} Verified College Leads
        </span>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ambassador, college, email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-14">Rank</th>
                <th className="py-3.5 px-4">Ambassador Name</th>
                <th className="py-3.5 px-4">College & Region</th>
                <th className="py-3.5 px-4">Direct Contact</th>
                <th className="py-3.5 px-4">Tasks Completed</th>
                <th className="py-3.5 px-4">Total Score</th>
                <th className="py-3.5 px-4">Speed</th>
                <th className="py-3.5 px-4">Performance</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAmbassadors.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 text-xs">
                    No ambassadors found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredAmbassadors.map((amb) => {
                  const ambSubmissions = submissions.filter((s) => s.ambassadorId === amb.id);

                  return (
                    <tr key={amb.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Rank */}
                      <td className="py-4 px-4 font-black text-slate-900 whitespace-nowrap">
                        #{amb.rank}
                      </td>

                      {/* Ambassador */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {amb.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{amb.name}</p>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active Ambassador
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* College */}
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                        {amb.college}
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        <p className="flex items-center gap-1.5 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{amb.email || `${amb.name.toLowerCase().replace(' ', '.')}@edu.in`}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{amb.phone || '+91 98000 00000'}</span>
                        </p>
                      </td>

                      {/* Tasks Completed */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold">
                          {amb.tasksCompleted} Tasks
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-4 px-4 whitespace-nowrap font-black text-orange-600">
                        {amb.score} pts
                      </td>

                      {/* Speed */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          {amb.avgSpeed}
                        </span>
                      </td>

                      {/* Performance */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <PerformanceBadge performance={amb.performance} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onFilterSubmissionsByAmbassador(amb.name)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Inspect Submissions"
                          >
                            <span>Inspect ({ambSubmissions.length})</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => setAmbassadorToDelete(amb)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title={`Remove ${amb.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {ambassadorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                onClick={() => setAmbassadorToDelete(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Remove Campus Ambassador?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to remove <strong className="text-slate-800">{ambassadorToDelete.name}</strong> from <strong className="text-slate-800">{ambassadorToDelete.college}</strong>?
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Rank & Score:</span>
                <span className="font-bold text-slate-800">#{ambassadorToDelete.rank} • {ambassadorToDelete.score} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Tasks Completed:</span>
                <span className="font-bold text-slate-800">{ambassadorToDelete.tasksCompleted} tasks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Email:</span>
                <span className="font-mono text-[11px] text-slate-700">{ambassadorToDelete.email}</span>
              </div>
            </div>

            <p className="text-[11px] text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              ⚠️ This will delete their login credentials, leaderboard rank, and all associated deliverables. Ranks of remaining ambassadors will be automatically recomputed.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAmbassadorToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
