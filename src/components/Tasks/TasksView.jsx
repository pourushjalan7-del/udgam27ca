import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  ListFilter, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Eye, 
  FileText,
  Filter,
  Sparkles
} from 'lucide-react';
import { StatusBadge, FormatBadge } from '../UI/Badge';

export function TasksView({ tasks, onSelectTask }) {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'pending' | 'total'
  const [totalSubFilter, setTotalSubFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [searchQuery, setSearchQuery] = useState('');

  // Counts (synchronized)
  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  // Filter tasks for active tab
  let displayedTasks = [];

  if (activeTab === 'submit') {
    displayedTasks = tasks;
  } else if (activeTab === 'pending') {
    displayedTasks = tasks.filter((t) => t.status === 'pending');
  } else if (activeTab === 'total') {
    if (totalSubFilter === 'completed') {
      displayedTasks = tasks.filter((t) => t.status === 'completed');
    } else if (totalSubFilter === 'pending') {
      displayedTasks = tasks.filter((t) => t.status === 'pending');
    } else {
      displayedTasks = tasks;
    }
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedTasks = displayedTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.submissionType.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your assigned tasks and track your submissions.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-700">
            {pendingCount} Pending Action
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            {completedCount} Completed
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Tab 1: Submit a Task */}
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'submit'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Submit a Task</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'submit'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Tab 2: Pending Tasks */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Tasks</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'pending'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {pendingCount}
            </span>
          </button>

          {/* Tab 3: Total Tasks */}
          <button
            onClick={() => setActiveTab('total')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'total'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Total Tasks</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'total'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {totalCount}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Sub-Filters for Tab 3 (Total Tasks) */}
      {activeTab === 'total' && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter status:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setTotalSubFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                totalSubFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Tasks ({totalCount})
            </button>
            <button
              onClick={() => setTotalSubFilter('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                totalSubFilter === 'completed'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setTotalSubFilter('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                totalSubFilter === 'pending'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
        </div>
      )}

      {/* Tasks Listing Layout */}
      {displayedTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No tasks found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery
              ? `No tasks matched your search query "${searchQuery}".`
              : 'There are no tasks in this category right now.'}
          </p>
        </div>
      ) : activeTab === 'total' ? (
        /* Tab 3: Detailed Table Layout for Total Tasks */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Task Name</th>
                  <th className="py-3.5 px-4">Assigned Date</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Submission Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectTask(task)}
                  >
                    <td className="py-4 px-4 font-semibold text-slate-900 max-w-xs">
                      <div className="line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {task.title}
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                        {task.shortDescription}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {task.assignedDate}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {task.deadline}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <FormatBadge type={task.submissionType} />
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {task.submittedDate || '—'}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask(task);
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          task.status === 'completed'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                        }`}
                      >
                        {task.status === 'completed' ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </>
                        ) : (
                          <>
                            <span>Submit</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 1 & Tab 2: Clean Card Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-5 border shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between group ${
                task.status === 'completed'
                  ? 'border-slate-200/90'
                  : 'border-slate-200/90 hover:border-orange-300'
              }`}
            >
              <div>
                {/* Card Top: Badges & Points */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <FormatBadge type={task.submissionType} />
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-bold border border-orange-200">
                    +{task.points} pts
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2">
                  {task.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {task.shortDescription}
                </p>
              </div>

              {/* Card Footer: Metadata & Submit Action */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due {task.deadline}
                  </span>
                  <StatusBadge status={task.status} />
                </div>

                <button
                  onClick={() => onSelectTask(task)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    task.status === 'completed'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20 group-hover:shadow-md'
                  }`}
                >
                  {task.status === 'completed' ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>View Submission Details</span>
                    </>
                  ) : (
                    <>
                      <span>Open & Submit Task</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
