import React from 'react';

interface SampleDataBadgeProps {
  label?: string;
  variant?: 'sample' | 'demo' | 'live' | 'verified';
  className?: string;
}

export const SampleDataBadge: React.FC<SampleDataBadgeProps> = ({
  label = "SAMPLE DATA",
  variant = 'sample',
  className = ""
}) => {
  let badgeStyle = "bg-amber-100 text-amber-900 border-amber-300";
  let dotColor = "bg-amber-500";

  if (variant === 'demo') {
    badgeStyle = "bg-blue-100 text-blue-900 border-blue-300";
    dotColor = "bg-blue-500";
  } else if (variant === 'live') {
    badgeStyle = "bg-emerald-100 text-emerald-900 border-emerald-300";
    dotColor = "bg-emerald-500";
  } else if (variant === 'verified') {
    badgeStyle = "bg-green-100 text-[#1B5E3A] border-green-300";
    dotColor = "bg-[#1B5E3A]";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border shadow-xs ${badgeStyle} ${className}`}
      role="status"
      aria-label={`Data status: ${label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} aria-hidden="true" />
      {label}
    </span>
  );
};
