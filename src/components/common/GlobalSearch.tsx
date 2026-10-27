import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Layers, AlertCircle, BookOpen, Users, MapPin, ArrowRight } from 'lucide-react';
import { mockVillages, mockSchemes, mockVolunteerOpportunities } from '../../mockData';
import { getAllGrievances } from '../../utils/storage';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const grievances = getAllGrievances();
  const q = query.trim().toLowerCase();

  // Static modules
  const modules = [
    { title: "Flood Prevention & Early Warning", path: "/flood", category: "Module" },
    { title: "Ration Distribution Transparency", path: "/ration", category: "Module" },
    { title: "Roads, Drainage & Waterlogging", path: "/roads", category: "Module" },
    { title: "Streetlights & Solar Energy", path: "/lighting", category: "Module" },
    { title: "Sanitation, Water & Waste", path: "/sanitation", category: "Module" },
    { title: "Public Grievances Portal", path: "/grievances", category: "Module" },
    { title: "Report an Issue (4-Step Form)", path: "/grievances/report", category: "Module" },
    { title: "Track Grievance by Tracking ID", path: "/grievances/track", category: "Module" },
    { title: "MY Bharat Youth & Volunteering", path: "/youth", category: "Module" },
    { title: "Government Schemes Directory", path: "/schemes", category: "Module" },
    { title: "Village Progress Dashboard", path: "/dashboard", category: "Module" },
    { title: "About GRAM Sathi 360° Proposal", path: "/about", category: "Module" }
  ];

  const filteredModules = q ? modules.filter(m => m.title.toLowerCase().includes(q)) : modules.slice(0, 5);

  const filteredGrievances = q ? grievances.filter(g =>
    g.id.toLowerCase().includes(q) ||
    g.title.toLowerCase().includes(q) ||
    g.villageName.toLowerCase().includes(q) ||
    g.category.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const filteredSchemes = q ? mockSchemes.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.code.toLowerCase().includes(q) ||
    s.ministry.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const filteredVillages = q ? mockVillages.filter(v =>
    v.name.toLowerCase().includes(q) ||
    v.block.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global quick search"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a service, tracking ID (GS360...), scheme, or village..."
            className="w-full text-sm sm:text-base text-[#0B1B2B] placeholder:text-slate-400 focus:outline-hidden bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Quick Modules */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Platform Modules & Actions</span>
            </div>
            <div className="space-y-1">
              {filteredModules.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm text-[#0B1B2B] hover:bg-emerald-50/80 hover:text-[#1B5E3A] transition-colors group"
                >
                  <span className="font-medium">{item.title}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1B5E3A] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Grievance match */}
          {filteredGrievances.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Public Grievances & Audit Records</span>
              </div>
              <div className="space-y-1.5">
                {filteredGrievances.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSelect(`/grievances/track?id=${g.id}`)}
                    className="w-full flex items-start justify-between p-2.5 rounded-lg text-left bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1B5E3A] bg-emerald-100/70 px-1.5 py-0.5 rounded">
                          {g.id}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">({g.villageName})</span>
                      </div>
                      <p className="text-xs text-[#0B1B2B] mt-1 font-medium line-clamp-1">{g.title}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0 ml-2">
                      {g.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Schemes match */}
          {filteredSchemes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Government Schemes</span>
              </div>
              <div className="space-y-1">
                {filteredSchemes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelect(`/schemes`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm text-[#0B1B2B] hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-xs text-[#1565C0] mr-2">[{s.code}]</span>
                      <span className="font-medium text-xs">{s.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">Official Scheme</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Villages match */}
          {filteredVillages.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Gram Panchayats (Pilot)</span>
              </div>
              <div className="space-y-1">
                {filteredVillages.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelect(`/dashboard?village=${v.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm text-[#0B1B2B] hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-medium text-xs">{v.name} ({v.nameHi})</span>
                    <span className="text-[11px] text-slate-500">Block {v.block}, {v.district}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Esc</kbd> to exit</span>
            <span>Type <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">GS360</kbd> to track report</span>
          </div>
          <span className="font-medium text-[#1B5E3A]">GRAM Sathi 360° Search</span>
        </div>
      </div>
    </div>
  );
};
