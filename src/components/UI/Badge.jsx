import React from 'react';
import { CheckCircle2, Clock, Link as LinkIcon, FileText, UploadCloud, AlertCircle } from 'lucide-react';

export function StatusBadge({ status }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3.5 h-3.5 animate-pulse" />
      Pending
    </span>
  );
}

export function FormatBadge({ type }) {
  switch (type) {
    case 'link':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <LinkIcon className="w-3.5 h-3.5" />
          Link Submission
        </span>
      );
    case 'file':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <UploadCloud className="w-3.5 h-3.5" />
          File Upload
        </span>
      );
    case 'text':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <FileText className="w-3.5 h-3.5" />
          Text Submission
        </span>
      );
    default:
      return null;
  }
}

export function PerformanceBadge({ performance }) {
  const styles = {
    Exceptional: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    Outstanding: 'bg-orange-100 text-orange-800 border-orange-300 font-semibold',
    Superior: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    High: 'bg-blue-100 text-blue-800 border-blue-300 font-medium',
    Good: 'bg-indigo-100 text-indigo-800 border-indigo-300 font-medium',
    Moderate: 'bg-slate-100 text-slate-700 border-slate-200 font-normal',
    'On Track': 'bg-teal-100 text-teal-800 border-teal-200 font-normal',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${styles[performance] || 'bg-slate-100 text-slate-700'}`}>
      {performance}
    </span>
  );
}
