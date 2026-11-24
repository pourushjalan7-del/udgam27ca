import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Briefcase, 
  Key, 
  Building2, 
  Tag, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';

const DEPARTMENT_OPTIONS = [
  'Media & PR Track',
  'Events & On-Ground Outreach',
  'Academic Outreach',
  'Strategic Alliances',
  'Data & Registrations',
  'Quality Assurance & Reports',
  'Regional Special Operations',
  'CA Operations Support'
];

const DOMAIN_SUGGESTIONS = [
  'Social Media & Digital Promotion (Tasks 1-2)',
  'Offline Campus Activations & Kiosks (Task 6)',
  'Classroom Pitches & Notice Boards (Tasks 4, 9)',
  'College Society & Club Collaborations (Tasks 5, 11)',
  'Participant Rosters & Lead Sheets (Task 7)',
  'Weekly Reports & Capstone Dossiers (Tasks 3, 10, 12)',
  'North-East Region Special Outreach Track',
  'General Summit Registrations & Grievances'
];

export function NewManagerModal({ isOpen, onClose, onAddManager, nextManagerId = 'UDGAM27-MGR-09' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: 'manager123',
    managerId: nextManagerId,
    phone: '',
    department: 'Media & PR Track',
    domain: 'Social Media & Digital Promotion (Tasks 1-2)',
    customDomain: ''
  });

  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid official email is required';
    if (!formData.username.trim()) errs.username = 'Username is required';
    if (!formData.managerId.trim()) errs.managerId = 'Staff ID is required';
    if (useCustomDomain && !formData.customDomain.trim()) errs.domain = 'Custom domain description is required';
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

    const newManager = {
      id: `user-mgr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      username: formData.username.trim().toLowerCase(),
      password: formData.password || 'manager123',
      managerId: formData.managerId.trim(),
      department: formData.department,
      domain: useCustomDomain ? formData.customDomain.trim() : formData.domain,
      phone: formData.phone.trim() || '+91 98000 00000',
      role: 'manager',
      roleTitle: 'CA Task Review Manager',
      evaluationsCount: 0,
      pendingInQueue: 0,
      avgTurnaround: '2.0 hrs',
      status: 'active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: initials
    };

    onAddManager(newManager);
    onClose();

    // Reset form
    setFormData({
      name: '',
      email: '',
      username: '',
      password: 'manager123',
      managerId: `UDGAM27-MGR-${Math.floor(Math.random() * 90 + 10)}`,
      phone: '',
      department: 'Media & PR Track',
      domain: DOMAIN_SUGGESTIONS[0],
      customDomain: ''
    });
    setUseCustomDomain(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Onboard Task Review Manager
              </h2>
              <p className="text-xs text-slate-300">
                Create staff credentials and assign verification responsibility
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
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Managers only have access to view and grade assigned deliverables. They cannot publish tasks or modify point values.
            </p>
          </div>

          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
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
                placeholder="e.g. Vikram Sengupta"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Login Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. vikram_mgr"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 ${
                  errors.username ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {errors.username && <p className="text-[11px] text-rose-500 mt-1">{errors.username}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Official Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@ecell-iitg.org"
                  className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Staff ID & Initial Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Staff ID Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                placeholder="UDGAM27-MGR-09"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {errors.managerId && <p className="text-[11px] text-rose-500 mt-1">{errors.managerId}</p>}
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Default: manager123</span>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Operating Department / Committee
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {DEPARTMENT_OPTIONS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Verification Domain */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">
                Assigned Verification Track / Domain
              </label>
              <button
                type="button"
                onClick={() => setUseCustomDomain(!useCustomDomain)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                {useCustomDomain ? 'Pick standard domain' : '+ Custom domain'}
              </button>
            </div>

            {useCustomDomain ? (
              <div>
                <input
                  type="text"
                  value={formData.customDomain}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                  placeholder="e.g. Design & Video Submissions Review"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 ${
                    errors.domain ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
                {errors.domain && <p className="text-[11px] text-rose-500 mt-1">{errors.domain}</p>}
              </div>
            ) : (
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {DOMAIN_SUGGESTIONS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            )}
            <p className="text-[11px] text-slate-400">
              Deliverables belonging to these tasks will automatically prioritize under this manager's evaluation queue.
            </p>
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
              <span>Confirm & Onboard Manager</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
