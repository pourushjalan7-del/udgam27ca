import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  ShieldCheck, 
  Filter, 
  Plus, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  Building2, 
  ExternalLink,
  Zap,
  Sparkles,
  Download
} from 'lucide-react';

export function ManagerDirectory({ 
  managers = [], 
  submissions = [], 
  onOpenNewManagerModal,
  onNavigateSubmissions 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [queueFilter, setQueueFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Extract unique departments for filter dropdown
  const departments = ['ALL', ...Array.from(new Set(managers.map(m => m.department).filter(Boolean)))];

  // Filtered managers list
  const filteredManagers = managers.filter((mgr) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = mgr.name.toLowerCase().includes(q);
      const matchEmail = mgr.email.toLowerCase().includes(q);
      const matchId = (mgr.managerId || '').toLowerCase().includes(q);
      const matchDomain = (mgr.domain || '').toLowerCase().includes(q);
      const matchDept = (mgr.department || '').toLowerCase().includes(q);
      const matchUsername = (mgr.username || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchDomain && !matchDept && !matchUsername) {
        return false;
      }
    }

    // 2. Department Filter
    if (departmentFilter !== 'ALL' && mgr.department !== departmentFilter) {
      return false;
    }

    // 3. Queue Filter
    if (queueFilter === 'PENDING' && (mgr.pendingInQueue || 0) === 0) {
      return false;
    }
    if (queueFilter === 'CLEARED' && (mgr.pendingInQueue || 0) > 0) {
      return false;
    }

    return true;
  });

  // Calculate High-level Summary Metrics
  const totalManagers = managers.length;
  const totalGraded = managers.reduce((acc, m) => acc + (m.evaluationsCount || 0), 0);
  const totalPendingQueue = managers.reduce((acc, m) => acc + (m.pendingInQueue || 0), 0);
  const activeCount = managers.filter(m => m.status === 'active').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-24 -top-8 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Super Admin Governance • E-Cell Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manager Directory & Review Team
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Oversee all 20 Task Evaluation Managers, track assigned verification domains, review backlogs, and inspect grading turnaround benchmarks.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 self-start md:self-center">
          <button
            onClick={onOpenNewManagerModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Manager</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Managers</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalManagers}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {activeCount} Active Reviewers Online
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Graded</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalGraded}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Across 12 Summit Deliverables
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Turnaround</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">2.1 hrs</p>
          <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
            <Zap className="w-3 h-3 text-amber-500" />
            High Efficiency Benchmark
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Workload</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-2">{totalPendingQueue}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Deliverables in Queue
          </p>
        </div>
      </div>

      {/* Controls & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manager, staff ID, domain, department..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Queue Status Filter */}
          <select
            value={queueFilter}
            onChange={(e) => setQueueFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Queues</option>
            <option value="PENDING">Has Pending Reviews</option>
            <option value="CLEARED">All Caught Up (0 Queue)</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 font-medium mr-1">
            {filteredManagers.length} of {managers.length} managers
          </span>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredManagers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-subtle text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No managers found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No manager records matched your search query or active filter settings.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDepartmentFilter('ALL');
              setQueueFilter('ALL');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-28">Staff ID</th>
                  <th className="py-3.5 px-4">Manager Profile</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Assigned Verification Domain</th>
                  <th className="py-3.5 px-4">Direct Contact</th>
                  <th className="py-3.5 px-4 text-center">Graded</th>
                  <th className="py-3.5 px-4 text-center">Queue</th>
                  <th className="py-3.5 px-4">Turnaround</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredManagers.map((mgr) => (
                  <tr key={mgr.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Staff ID */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold text-[11px]">
                        {mgr.managerId || 'MGR-STAFF'}
                      </span>
                    </td>

                    {/* Manager Name & Username */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-700 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          {mgr.avatar || mgr.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900">{mgr.name}</p>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Staff" />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">@{mgr.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{mgr.department || 'CA Operations'}</span>
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="py-4 px-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                          {mgr.domain || 'All Deliverables'}
                        </p>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                      <a 
                        href={`mailto:${mgr.email}`} 
                        className="flex items-center gap-1.5 text-[11px] hover:text-indigo-600 transition-colors"
                      >
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{mgr.email}</span>
                      </a>
                      <p className="flex items-center gap-1.5 text-[11px] mt-0.5 text-slate-400">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{mgr.phone || '+91 98000 00000'}</span>
                      </p>
                    </td>

                    {/* Graded Count */}
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs">
                        {mgr.evaluationsCount || 0}
                      </span>
                    </td>

                    {/* Pending Queue */}
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      {(mgr.pendingInQueue || 0) > 0 ? (
                        <span className="px-2.5 py-1 rounded-lg bg-orange-100 border border-orange-200 text-orange-800 font-bold text-xs animate-pulse">
                          {mgr.pendingInQueue} pending
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium text-xs">
                          Cleared
                        </span>
                      )}
                    </td>

                    {/* Turnaround */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {mgr.avgTurnaround || '2.0 hrs'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigateSubmissions && onNavigateSubmissions(mgr.domain)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition-colors cursor-pointer"
                        title="View Deliverables Queue for this Manager"
                      >
                        <span>View Queue</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredManagers.map((mgr) => (
            <div
              key={mgr.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & ID */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold text-[10px]">
                    {mgr.managerId || 'MGR-STAFF'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active Evaluator
                  </span>
                </div>

                {/* Profile Info */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    {mgr.avatar || mgr.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{mgr.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">@{mgr.username}</p>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>{mgr.department || 'CA Operations'}</span>
                    </p>
                  </div>
                </div>

                {/* Assigned Domain */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Assigned Task Domain
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {mgr.domain || 'All Tasks & General Inquiries'}
                  </p>
                </div>

                {/* Workload Stats Bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Graded</span>
                    <span className="text-sm font-bold text-emerald-600">{mgr.evaluationsCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">In Queue</span>
                    <span className={`text-sm font-bold ${
                      (mgr.pendingInQueue || 0) > 0 ? 'text-orange-600' : 'text-slate-500'
                    }`}>
                      {mgr.pendingInQueue || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Turnaround</span>
                    <span className="text-sm font-bold text-slate-700">{mgr.avgTurnaround || '2.0h'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`mailto:${mgr.email}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title={`Email ${mgr.name}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => onNavigateSubmissions && onNavigateSubmissions(mgr.domain)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 transition-all cursor-pointer"
                >
                  <span>Review Backlog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
