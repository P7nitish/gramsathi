import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  ShieldCheck,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Language, Grievance, IssueStatus } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { findGrievanceById, getAllGrievances } from '../utils/storage';

interface GrievanceTrackPageProps {
  onNavigate: (path: string) => void;
  language: Language;
  initialQueryId?: string;
}

export const GrievanceTrackPage: React.FC<GrievanceTrackPageProps> = ({
  onNavigate,
  language,
  initialQueryId = ''
}) => {
  const t = language === 'hi' ? hi : en;
  const [trackingIdInput, setTrackingIdInput] = useState(initialQueryId || 'GS360-2026-881024');
  const [activeGrievance, setActiveGrievance] = useState<Grievance | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialQueryId) {
      setTrackingIdInput(initialQueryId);
      const found = findGrievanceById(initialQueryId);
      if (found) {
        setActiveGrievance(found);
      }
    } else {
      // Default to sample grievance for smooth evaluation
      const initial = findGrievanceById('GS360-2026-881024');
      if (initial) setActiveGrievance(initial);
    }
  }, [initialQueryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    const found = findGrievanceById(trackingIdInput);
    setActiveGrievance(found || null);
  };

  const copyId = () => {
    if (!activeGrievance) return;
    navigator.clipboard.writeText(activeGrievance.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepsList: { step: IssueStatus; label: string; desc: string }[] = [
    { step: 'received', label: '1. Received', desc: 'Complaint registered digitally with GPS coordinates' },
    { step: 'acknowledged', label: '2. Acknowledged', desc: 'Panchayat Secretary or BDO office triaged' },
    { step: 'assigned', label: '3. Assigned', desc: 'Junior Engineer or nodal officer mobilized' },
    { step: 'in_progress', label: '4. In Progress', desc: 'On-site technical work / repair executing' },
    { step: 'resolved', label: '5. Resolved', desc: 'Physical audit completed and citizen signed off' }
  ];

  const getStepStatus = (step: IssueStatus, currentStatus: IssueStatus) => {
    const order: IssueStatus[] = ['received', 'acknowledged', 'assigned', 'in_progress', 'resolved'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const sampleIds = [
    { id: 'GS360-2026-881024', title: 'Culvert collapse (In Progress)' },
    { id: 'GS360-2026-719302', title: 'Turbid handpump (Resolved)' },
    { id: 'GS360-2026-642109', title: 'Solar light dark (Assigned)' },
    { id: 'GS360-2026-310984', title: 'Sub-centre waterlogging (Received)' }
  ];

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[
          { label: "Public Grievances", path: "/grievances" },
          { label: "Track Grievance by ID" }
        ]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-3">
          <span className="text-xs font-bold text-[#1B5E3A] bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Public Service SLA Guarantee
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
            Track Public Grievance Status
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6B7B] max-w-xl mx-auto">
            Enter any tracking ID (format: <code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">GS360-YYYY-XXXXXX</code>) to inspect live departmental actions and site inspection logs.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={trackingIdInput}
                onChange={e => setTrackingIdInput(e.target.value.toUpperCase())}
                placeholder="Enter GS360-2026-XXXXXX..."
                className="w-full pl-10 pr-4 py-3 text-sm font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A] uppercase font-bold text-[#0B1B2B]"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              Track Status
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="text-[11px] font-semibold">Try sample IDs:</span>
            {sampleIds.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setTrackingIdInput(s.id);
                  const found = findGrievanceById(s.id);
                  if (found) setActiveGrievance(found);
                }}
                className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-[#1B5E3A] border border-slate-200 transition-colors"
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Not Found state */}
        {!activeGrievance && searchAttempted && (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="font-heading font-bold text-base text-[#0B1B2B]">
              No Grievance Found with ID "{trackingIdInput}"
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Please double check the ID format. If you recently filed a grievance, check if your browser stored it or try clicking one of the sample IDs above.
            </p>
          </div>
        )}

        {/* Active Grievance Card & Timeline */}
        {activeGrievance && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            
            {/* Top Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-base font-black text-[#1B5E3A] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    {activeGrievance.id}
                  </span>
                  <button
                    type="button"
                    onClick={copyId}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1"
                    title="Copy Tracking ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <SampleDataBadge label={activeGrievance.isSample ? "SAMPLE DATA" : "USER SUBMITTED"} variant={activeGrievance.isSample ? "sample" : "live"} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-heading text-[#0B1B2B]">
                  {activeGrievance.title}
                </h2>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Lifecycle Stage</span>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mt-0.5">
                  {activeGrievance.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Village & District</span>
                <strong className="text-slate-800">{activeGrievance.villageName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
                <strong className="text-slate-800 capitalize">{activeGrievance.category}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Department</span>
                <strong className="text-slate-800 truncate block">{activeGrievance.assignedDepartment}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reported On</span>
                <span className="font-mono text-slate-700">{activeGrievance.createdAt}</span>
              </div>
            </div>

            {/* Problem Details */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Citizen Description & Landmark:</span>
              <p className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-sans">
                {activeGrievance.description}
              </p>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong>Location:</strong> {activeGrievance.locationDetails}</span>
                {activeGrievance.lat && (
                  <span className="font-mono text-slate-400">({activeGrievance.lat.toFixed(4)}, {activeGrievance.lng?.toFixed(4)})</span>
                )}
              </div>
            </div>

            {/* 5-Stage Status Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">
                  Official Departmental Action Timeline
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Last update: {activeGrievance.updatedAt}</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {stepsList.map((stepItem, idx) => {
                  const status = getStepStatus(stepItem.step, activeGrievance.status);
                  const timelineEvent = activeGrievance.timeline?.find(t => t.step === stepItem.step);

                  let circleStyle = "bg-slate-200 border-slate-300 text-slate-400";
                  if (status === 'completed') {
                    circleStyle = "bg-emerald-600 border-emerald-700 text-white";
                  } else if (status === 'current') {
                    circleStyle = "bg-amber-500 border-amber-600 text-white ring-4 ring-amber-100";
                  }

                  return (
                    <div key={idx} className="relative group">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${circleStyle}`}>
                        {status === 'completed' ? '✓' : idx + 1}
                      </div>

                      <div className="text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-[#0B1B2B] text-sm font-heading">{stepItem.label}</strong>
                          {timelineEvent?.timestamp && (
                            <span className="font-mono text-[10px] text-slate-400">
                              [{timelineEvent.timestamp}]
                            </span>
                          )}
                          {status === 'current' && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>

                        <p className="text-slate-500 text-xs mt-0.5">{stepItem.desc}</p>

                        {timelineEvent && (
                          <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                            {timelineEvent.officerOrDept && (
                              <div>
                                <span className="font-semibold text-slate-800">Officer / Desk:</span> {timelineEvent.officerOrDept}
                              </div>
                            )}
                            {timelineEvent.remarks && (
                              <div>
                                <span className="font-semibold text-slate-800">Inspection Note:</span> {timelineEvent.remarks}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-slate-500">
                Official Department SLA standard: Maximum 72 hours for first on-site inspection.
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/grievances')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1B2B] font-bold transition-colors"
              >
                &larr; Return to Public Grievances
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
