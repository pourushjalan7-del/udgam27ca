import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  School, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Key, 
  MapPin, 
  GraduationCap, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';

const COMMON_STATES = [
  'Assam',
  'Delhi NCR',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Uttar Pradesh',
  'Rajasthan',
  'Punjab',
  'Gujarat',
  'Telangana',
  'Kerala',
  'Odisha',
  'Bihar',
  'Madhya Pradesh',
  'Other / Regional'
];

export function NewAmbassadorModal({ isOpen, onClose, onAddAmbassador, nextCaNumber = 1013 }) {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    email: '',
    username: '',
    password: 'password123',
    phone: '',
    caId: `UDGAM27-CA-${nextCaNumber}`,
    state: 'Assam',
    department: 'Computer Science & Engineering',
    year: '3rd Year, B.Tech'
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.college.trim()) errs.college = 'College/University name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.username.trim()) errs.username = 'Username is required';
    if (!formData.caId.trim()) errs.caId = 'CA ID code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const initials = formData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newAmbassador = {
      id: `amb-${Date.now()}`,
      name: formData.name.trim(),
      college: formData.college.trim(),
      email: formData.email.trim(),
      username: formData.username.trim().toLowerCase(),
      password: formData.password || 'password123',
      phone: formData.phone.trim() || '+91 98000 00000',
      caId: formData.caId.trim(),
      state: formData.state,
      department: formData.department.trim(),
      year: formData.year.trim(),
      avatar: initials,
      tasksCompleted: 0,
      speedDays: 3.0,
      avgSpeed: '3.0 days',
      score: 0,
      performance: 'New Lead',
      isCurrentUser: false
    };

    onAddAmbassador(newAmbassador);
    onClose();

    // Reset form
    setFormData({
      name: '',
      college: '',
      email: '',
      username: '',
      password: 'password123',
      phone: '',
      caId: `UDGAM27-CA-${Math.floor(Math.random() * 9000 + 1000)}`,
      state: 'Assam',
      department: 'Computer Science & Engineering',
      year: '3rd Year, B.Tech'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Register New Campus Ambassador
              </h2>
              <p className="text-xs text-slate-300">
                Enroll a verified student lead into the UDGAM'27 national CA roster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Notice banner */}
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-100 text-orange-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Once added, this ambassador can log in using their username and password to view tasks, submit deliverables, and compete on the national leaderboard.
            </p>
          </div>

          {/* Full Name & College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Ambassador Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const generatedUsername = val.toLowerCase().replace(/\s+/g, '_').slice(0, 15);
                  setFormData({ 
                    ...formData, 
                    name: val, 
                    username: formData.username ? formData.username : generatedUsername 
                  });
                }}
                placeholder="e.g. Rohit Deshmukh"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-orange-500/20 focus:border-orange-500'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                College / Institute Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <School className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. IIT Bombay, DTU Delhi..."
                  className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 ${
                    errors.college ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-orange-500/20 focus:border-orange-500'
                  }`}
                />
              </div>
              {errors.college && <p className="text-[11px] text-rose-500 mt-1">{errors.college}</p>}
            </div>
          </div>

          {/* Email & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Student Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@college.edu.in"
                  className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-orange-500/20 focus:border-orange-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Login Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. rohit_iitb"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 ${
                  errors.username ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-orange-500/20 focus:border-orange-500'
                }`}
              />
              {errors.username && <p className="text-[11px] text-rose-500 mt-1">{errors.username}</p>}
            </div>
          </div>

          {/* CA ID & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Official CA ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.caId}
                onChange={(e) => setFormData({ ...formData, caId: e.target.value })}
                placeholder="UDGAM27-CA-1013"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              {errors.caId && <p className="text-[11px] text-rose-500 mt-1">{errors.caId}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Default Access Password
              </label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Default: password123</span>
            </div>
          </div>

          {/* Phone & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                State / Region
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {COMMON_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Department & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Department / Branch
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Computer Science, Mechanical..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Year of Study
              </label>
              <div className="relative">
                <GraduationCap className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g. 2nd Year, B.Tech"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Ambassador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
