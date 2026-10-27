import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SensitiveDataNoticeProps {
  compact?: boolean;
  className?: string;
}

export const SensitiveDataNotice: React.FC<SensitiveDataNoticeProps> = ({
  compact = false,
  className = ""
}) => {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 p-2 bg-amber-50/90 border border-amber-200 rounded-lg text-xs text-amber-900 ${className}`}
        role="note"
      >
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
        <span>
          <strong>Privacy Safeguard:</strong> Do not enter real Aadhaar, ration card, bank, or personal identifiers on this demonstration platform.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg shadow-xs flex items-start gap-3 text-sm text-amber-900 ${className}`}
      role="note"
      aria-label="Sensitive personal data notice"
    >
      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="font-semibold text-amber-950">
          Civic Integrity & Data Privacy Notice
        </p>
        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
          <strong>Do not enter real Aadhaar, ration card, bank, or personal identifiers on this demonstration platform.</strong> All simulated records and form submissions are retained in your local demonstration sandbox or demo state.
        </p>
      </div>
    </div>
  );
};
