import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase, 
  UserCheck 
} from 'lucide-react';

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('rahul123');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('ambassador'); // 'ambassador' | 'manager' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (role === 'manager') {
      setUsername('manager');
      setPassword('manager123');
    } else {
      setUsername('rahul123');
      setPassword('password123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await onLogin(username.trim(), password.trim());
      if (result && result.success === false) {
        setError(result.error || 'Invalid credentials. Please verify username and password.');
      }
    } catch (err) {
      setError('Connection error with authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 border border-orange-400/30">
            <span className="font-extrabold text-white text-lg tracking-wider">U</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">UDGAM<span className="text-orange-500">'27</span></span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30">PORTAL</span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium">E-CELL IIT GUWAHATI</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 border border-slate-700/60 rounded-full px-3 py-1.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Role-Based Access: Admin • Manager • Ambassador</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Student & Staff Portal</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Welcome to UDGAM'27
              </h1>
              <p className="text-sm text-slate-400 mt-1 font-normal">
                Sign in to your authorized workspace
              </p>
            </div>

            {/* Quick Persona Selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Select Sign-in Persona for Preview:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectRole('ambassador')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedRole === 'ambassador'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Ambassador</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('manager')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedRole === 'manager'
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Manager</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedRole === 'admin'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Super Admin</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-10 pr-11 py-2.5 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter {selectedRole === 'admin' ? 'Admin Dashboard' : selectedRole === 'manager' ? 'Manager Dashboard' : 'Ambassador Portal'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-400">
                Active credentials for demo: <span className="text-orange-400 font-mono">admin</span>, <span className="text-indigo-400 font-mono">manager</span>, or <span className="text-orange-400 font-mono">rahul123</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-slate-500">
        <p>
          UDGAM'27 — The Annual Entrepreneurship Summit | Developed for <strong className="text-slate-400 font-semibold">E-Cell, IIT Guwahati</strong>
        </p>
      </footer>
    </div>
  );
}
