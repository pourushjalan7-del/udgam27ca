import React from 'react';
import { 
  User, 
  Mail, 
  AtSign, 
  School, 
  ShieldCheck, 
  LogOut, 
  Lock, 
  Award, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Phone,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Key
} from 'lucide-react';

export function ProfileView({ user, onLogout, tasksCount, completedCount, rank }) {
  const isAdmin = user.role === 'admin';
  const isManager = user.role === 'manager';
  const isAmbassador = user.role === 'ambassador' || !user.role;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isAdmin ? 'System Administrator Profile' : isManager ? 'Manager Staff Profile' : 'My Ambassador Profile'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isAdmin 
            ? 'Executive Board & Portal Configuration Authority for E-Cell, IIT Guwahati.'
            : isManager
            ? 'Authorized Task Reviewer & Outreach Operations Manager.'
            : 'Official credentials and registration details verified by E-Cell, IIT Guwahati.'}
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {/* Banner with UDGAM Navy/Orange styling */}
        <div className="h-32 bg-gradient-to-r from-slate-950 via-slate-900 to-[#1C2541] relative p-6 flex items-end justify-end">
          <div className="absolute top-0 right-0 w-64 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isAdmin ? 'Super Admin Privileges' : isManager ? 'Authorized Task Evaluator' : 'Verified Campus Ambassador'}
            </span>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          {/* Avatar with Initials */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-6 gap-4">
            <div className="flex items-end gap-4">
              <div className={`w-24 h-24 rounded-2xl text-white flex items-center justify-center font-black text-3xl shadow-xl ring-4 ring-white border-2 ${
                isAdmin 
                  ? 'bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 border-amber-300' 
                  : isManager
                  ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 border-indigo-300'
                  : 'bg-gradient-to-tr from-orange-500 via-orange-600 to-amber-500 border-orange-300'
              }`}>
                {user.initials || 'AS'}
              </div>
              <div className="mb-1">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {user.name}
                </h2>
                <p className="text-xs font-semibold text-orange-600 flex items-center gap-1.5 mt-0.5">
                  <School className="w-3.5 h-3.5" />
                  {user.college || 'E-Cell, IIT Guwahati'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200 uppercase tracking-wide">
                Role: {user.roleTitle || user.role || 'Ambassador'}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
            <div className="text-center p-2">
              <span className="text-xs text-slate-500 font-medium block">
                {isAmbassador ? 'National Rank' : 'Portal Authority'}
              </span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">
                {isAmbassador ? `#${rank || 5}` : isAdmin ? 'Super Admin' : 'Manager'}
              </span>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">
                {isAmbassador ? 'Tasks Done' : 'Task Permissions'}
              </span>
              <span className="text-lg font-black text-emerald-600 mt-0.5 block">
                {isAmbassador ? `${completedCount} of ${tasksCount}` : isAdmin ? 'Add & Edit' : 'Grade Only'}
              </span>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">
                {isAmbassador ? 'Summit Tier' : 'Rankings Access'}
              </span>
              <span className="text-lg font-black text-orange-600 mt-0.5 block">
                {isAmbassador ? 'Gold Star' : isAdmin ? 'Full Access' : 'Restricted'}
              </span>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Account Status</span>
              <span className="text-lg font-black text-indigo-600 mt-0.5 block">Active</span>
            </div>
          </div>

          {/* Role Permission Scope Callout */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
              <Key className="w-4 h-4 text-orange-500" />
              <span>Role Permissions Matrix:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>View Assigned/Program Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin || isManager ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                )}
                <span>Verify & Grade Submissions</span>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className={isAdmin ? 'font-bold text-slate-900' : 'text-slate-400'}>
                  Add New Tasks (Admin Only)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className={isAdmin ? 'font-bold text-slate-900' : 'text-slate-400'}>
                  Edit Task Points (Admin Only)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin || isAmbassador ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className={isAdmin || isAmbassador ? 'text-slate-900' : 'text-slate-400'}>
                  {isAdmin ? 'Full Leaderboard Rankings' : isAmbassador ? 'Public Leaderboard' : 'Rankings Access (Restricted)'}
                </span>
              </div>
            </div>
          </div>

          {/* Read-Only Information Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Account Credentials</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200 font-medium normal-case">
                  <Lock className="w-3 h-3" /> Read-Only
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
                </span>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
              </div>

              {/* Email ID */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email ID
                </span>
                <p className="text-sm font-bold text-slate-900">{user.email}</p>
              </div>

              {/* Username */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <AtSign className="w-3.5 h-3.5 text-slate-400" /> Username
                </span>
                <p className="text-sm font-bold text-slate-900 font-mono">@{user.username}</p>
              </div>

              {/* College / Institution */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <School className="w-3.5 h-3.5 text-slate-400" /> College / Organization
                </span>
                <p className="text-sm font-bold text-slate-900">{user.college}</p>
              </div>

              {/* Department */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Department / Team
                </span>
                <p className="text-sm font-bold text-slate-900">{user.department || 'Outreach & Operations'}</p>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Registered Contact
                </span>
                <p className="text-sm font-bold text-slate-900">{user.phone || '+91 98765 43210'}</p>
              </div>
            </div>
          </div>

          {/* Support and Logout Button */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              UDGAM'27 Management Portal • <strong className="text-slate-700">E-Cell IIT Guwahati</strong>
            </p>

            <button
              onClick={onLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout from Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
