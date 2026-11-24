import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Trophy, 
  UserCircle, 
  LogOut, 
  X,
  FileCheck2,
  Users,
  Coins,
  ShieldCheck,
  ClipboardList,
  Sparkles,
  Briefcase
} from 'lucide-react';

export function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  onLogout, 
  user, 
  mobileOpen, 
  setMobileOpen,
  pendingCount = 0,
  pendingSubmissionsCount = 0
}) {
  const role = user?.role || 'ambassador';
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';

  // Dynamic Navigation Items based on Role
  let navItems = [];

  if (isAdmin) {
    navItems = [
      {
        id: 'admin_overview',
        label: 'Admin Overview',
        icon: LayoutDashboard,
        badge: null
      },
      {
        id: 'task_mgmt',
        label: 'Task Management',
        icon: Coins,
        badge: 'Add / Edit'
      },
      {
        id: 'submissions',
        label: 'Review Submissions',
        icon: FileCheck2,
        badge: pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount} new` : null
      },
      {
        id: 'leaderboard',
        label: 'Leaderboard Rankings',
        icon: Trophy,
        badge: 'All CAs'
      },
      {
        id: 'directory',
        label: 'Ambassador Directory',
        icon: Users,
        badge: null
      },
      {
        id: 'managers',
        label: 'Manager Directory',
        icon: Briefcase,
        badge: 'Review Team'
      },
      {
        id: 'profile',
        label: 'My Profile',
        icon: UserCircle,
        badge: null
      },
    ];
  } else if (isManager) {
    navItems = [
      {
        id: 'submissions',
        label: 'Grade Deliverables',
        icon: FileCheck2,
        badge: pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount} review` : null
      },
      {
        id: 'manager_tasks',
        label: 'View Tasks',
        icon: ClipboardList,
        badge: 'Read-only'
      },
      {
        id: 'profile',
        label: 'My Profile',
        icon: UserCircle,
        badge: null
      },
    ];
  } else {
    // Campus Ambassador
    navItems = [
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        badge: null
      },
      {
        id: 'tasks',
        label: 'My Tasks',
        icon: CheckSquare,
        badge: pendingCount > 0 ? `${pendingCount} due` : null
      },
      {
        id: 'leaderboard',
        label: 'Leaderboard',
        icon: Trophy,
        badge: 'Live'
      },
      {
        id: 'profile',
        label: 'My Profile',
        icon: UserCircle,
        badge: null
      },
    ];
  }

  const handleNavClick = (id) => {
    setCurrentTab(id);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border ${
            isAdmin 
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400/40 shadow-amber-500/20'
              : isManager
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-400/40 shadow-indigo-500/20'
              : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-400/30 shadow-orange-500/20'
          }`}>
            <span className="font-extrabold text-white text-lg tracking-wider">U</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">UDGAM<span className="text-orange-500">'27</span></span>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border ${
                isAdmin 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : isManager
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
              }`}>
                {isAdmin ? 'ADMIN' : isManager ? 'MANAGER' : 'CA'}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 tracking-wider">E-CELL IIT GUWAHATI</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {mobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider uppercase flex items-center justify-between">
          <span>{isAdmin ? 'Admin Console' : isManager ? 'Manager Console' : 'Ambassador Menu'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : item.id === 'submissions' || item.id === 'tasks'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Helpful role-specific callout */}
        <div className="pt-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/60 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'System Governance' : isManager ? 'Grading Desk' : 'Campus Incentive Tier'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAdmin 
                ? 'Only Admin can publish new deliverables and calibrate task point weightings.'
                : isManager
                ? 'Review deliverables, award marks, and provide feedback to drive ambassador output.'
                : 'Complete remaining tasks to earn exclusive E-Summit passes and official IIT Guwahati merch.'}
            </p>
          </div>
        </div>
      </div>

      {/* User Card & Logout Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div 
          onClick={() => handleNavClick('profile')}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer mb-2"
        >
          <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-md ${
            isAdmin ? 'bg-gradient-to-tr from-amber-500 to-orange-600' :
            isManager ? 'bg-gradient-to-tr from-indigo-500 to-purple-600' :
            'bg-gradient-to-br from-orange-500 to-amber-600'
          }`}>
            {user?.initials || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.roleTitle || user?.college}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout from Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed inset-y-0 left-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 md:hidden transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
