import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-2.5 px-4 bg-white/70 border-b border-slate-200/60 backdrop-blur-xs text-xs text-[#5A6B7B]">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1 hover:text-[#1B5E3A] transition-colors focus:ring-2 focus:ring-[#1B5E3A] rounded px-1"
          aria-label="Navigate to Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              {isLast || !item.path ? (
                <span className="font-semibold text-[#0B1B2B] truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(item.path!)}
                  className="hover:text-[#1B5E3A] transition-colors focus:ring-2 focus:ring-[#1B5E3A] rounded px-1"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
