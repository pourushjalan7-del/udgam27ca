import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-orange-500 shrink-0" />,
  };

  const bgBorder = {
    success: 'border-emerald-200 bg-white shadow-lg shadow-emerald-500/10',
    error: 'border-rose-200 bg-white shadow-lg shadow-rose-500/10',
    info: 'border-orange-200 bg-white shadow-lg shadow-orange-500/10',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-in transition-all duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${bgBorder[toast.type || 'info']} shadow-xl`}>
        {icons[toast.type || 'info']}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
          {toast.message && (
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
