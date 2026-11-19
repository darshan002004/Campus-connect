import React from 'react';

export const CategoryBadge = ({ category, className = '' }) => {
  const styles = {
    Technical: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    Hackathon: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Cultural: 'bg-rose-50 text-rose-700 border-rose-200/80',
    Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Workshop: 'bg-blue-50 text-blue-700 border-blue-200/80',
    Seminar: 'bg-purple-50 text-purple-700 border-purple-200/80',
    Management: 'bg-teal-50 text-teal-700 border-teal-200/80',
    Other: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const style = styles[category] || styles.Other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      {category}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const styles = {
    upcoming: 'bg-sky-50 text-sky-700 border-sky-200',
    ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    registered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    attended: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  const labels = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Concluded',
    cancelled: 'Cancelled',
    registered: 'Registered',
    attended: 'Attended',
  };

  const normalized = (status || '').toLowerCase();
  const style = styles[normalized] || 'bg-slate-100 text-slate-600 border-slate-200';
  const label = labels[normalized] || status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0 opacity-80"></span>
      {label}
    </span>
  );
};
