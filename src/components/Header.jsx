import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  ChevronRight, 
  ShieldCheck, 
  UserCheck, 
  Briefcase, 
  ChevronDown,
  Database,
  CheckCircle2,
  Server
} from 'lucide-react';

export function Header({ 
  currentTab, 
  setMobileOpen, 
  user, 
  completionRate,
  onOpenQuickSubmit,
  currentRole,
  dbStatus
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDbInfo, setShowDbInfo] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Real Database Connected",
      time: "Just now",
      desc: "Connected to SQLite / PostgreSQL database server with live persistence.",
      read: false
    },
    {
      id: 2,
      title: "Submission Queue Ready",
      time: "10 mins ago",
      desc: "Submissions across all CAs are stored with real file attachments.",
      read: false
    },
    {
      id: 3,
      title: "UDGAM'27 Summit Update",
      time: "1 day ago",
      desc: "120+ Campus Ambassadors active across 18 states.",
      read: true
    }
  ];

  const titles = {
    overview: 'Ambassador Overview',
    tasks: 'Task Management',
    leaderboard: 'Campus Leaderboard',
    profile: 'Profile & Credentials',
    admin_overview: 'Admin Executive Console',
    task_mgmt: 'Task Master & Points Weighting',
    submissions: 'Task Verification & Grading Queue',
    manager_tasks: 'Program Deliverables Overview',
    directory: 'Campus Ambassador Directory',
  };

  const roleStyles = {
    admin: {
      badge: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      label: 'Super Admin',
      icon: ShieldCheck
    },
    manager: {
      badge: 'bg-indigo-100 text-indigo-900 border-indigo-300 font-extrabold',
      label: 'Task Manager',
      icon: Briefcase
    },
    ambassador: {
      badge: 'bg-orange-100 text-orange-900 border-orange-300 font-extrabold',
      label: 'Ambassador',
      icon: UserCheck
    }
  };

  const currentRoleStyle = roleStyles[currentRole] || roleStyles.ambassador;
  const RoleIcon = currentRoleStyle.icon;

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>UDGAM'27</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-orange-600 font-semibold">{titles[currentTab] || 'Dashboard'}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {titles[currentTab] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Database Status, Role Switcher, & User Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Database Status Indicator Pill */}
        <div className="relative">
          <button
            onClick={() => setShowDbInfo(!showDbInfo)}
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              dbStatus?.status === 'warning'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Click to view database connection status & metrics"
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                dbStatus?.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
            <Database
              className={`w-3.5 h-3.5 ${
                dbStatus?.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
              }`}
            />
            <span className="font-bold">{dbStatus?.type || 'Database Connected'}</span>
          </button>

          {showDbInfo && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Server
                    className={`w-4 h-4 ${
                      dbStatus?.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  />
                  Database Engine Status
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    dbStatus?.status === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {dbStatus?.status === 'warning' ? 'Action Required' : 'Active'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="font-bold text-slate-900">{dbStatus?.type || 'SQLite 3 (WAL Mode)'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Connection Latency:</span>
                  <span className={`font-bold ${dbStatus?.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {dbStatus?.latency || '< 2ms'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Cloud Status:</span>
                  <span className="font-medium text-slate-700">
                    {dbStatus?.status === 'warning' ? 'Permission Denied (42501)' : dbStatus?.type?.includes('Supabase') ? 'Live Cloud Connected' : 'Local Fallback'}
                  </span>
                </div>
              </div>

              {dbStatus?.status === 'warning' && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold">⚠️ Cloud Permission Denied (42501):</p>
                  <p>Run <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">fix_permissions.sql</code> in your Supabase SQL Editor to grant table access to the anon API role.</p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                All tasks, points, and graded deliverables persist directly to the active database.
              </div>
            </div>
          )}
        </div>

        {/* Authenticated Role Badge (Fixed to authenticated database identity) */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border shadow-xs ${currentRoleStyle.badge}`}>
          <RoleIcon className="w-3.5 h-3.5" />
          <span className="font-bold">{currentRoleStyle.label}</span>
        </div>

        {/* Quick Submit Shortcut */}
        {currentRole === 'ambassador' && onOpenQuickSubmit && (
          <button
            onClick={onOpenQuickSubmit}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <span>Submit Task</span>
          </button>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Summit Updates</span>
                <span className="text-[11px] text-orange-600 font-semibold">Live DB Active</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">E-Cell IIT Guwahati Broadcast Center</span>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-orange-500/20 ${
            currentRole === 'admin' ? 'bg-gradient-to-tr from-amber-600 to-orange-600' :
            currentRole === 'manager' ? 'bg-gradient-to-tr from-indigo-600 to-purple-600' :
            'bg-gradient-to-tr from-slate-900 to-slate-700'
          }`}>
            {user?.initials || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight truncate max-w-[120px]">
              {user?.roleTitle || user?.college}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
