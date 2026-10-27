import React, { useState } from 'react';
import {
  Footprints,
  AlertTriangle,
  MapPin,
  Filter,
  CheckCircle,
  Search,
  Layers,
  ArrowRight,
  Info,
  ShieldAlert,
  Send,
  Hammer
} from 'lucide-react';
import { Language, Grievance, Severity, IssueStatus } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mockVillages } from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { LeafletMap } from '../components/common/LeafletMap';
import { getAllGrievances, saveGrievance } from '../utils/storage';
import { generateTrackingId } from '../utils/logic';

interface RoadsPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const RoadsPage: React.FC<RoadsPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  // Form State
  const [roadCategory, setRoadCategory] = useState<'pothole' | 'waterlogging' | 'blocked_drain' | 'culvert'>('pothole');
  const [villageId, setVillageId] = useState(mockVillages[0].id);
  const [locationText, setLocationText] = useState('');
  const [lat, setLat] = useState<number>(mockVillages[0].lat);
  const [lng, setLng] = useState<number>(mockVillages[0].lng);
  const [severity, setSeverity] = useState<Severity>('medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  // Filter state for road list
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allGrievances = getAllGrievances();
  const roadIssues = allGrievances.filter(g => g.category === 'roads' || g.category === 'flood');

  const filteredIssues = roadIssues.filter(issue => {
    if (filterSeverity !== 'all' && issue.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.id.toLowerCase().includes(q) ||
        issue.villageName.toLowerCase().includes(q) ||
        issue.locationDetails.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const mapMarkers = filteredIssues.filter(i => i.lat && i.lng).map(i => ({
    id: i.id,
    lat: i.lat!,
    lng: i.lng!,
    title: `${i.id}: ${i.title}`,
    status: (i.severity === 'critical' ? 'critical' : i.severity === 'high' ? 'warning' : 'normal') as any,
    details: `${i.villageName} | Status: ${i.status} | Dept: ${i.assignedDepartment}`
  }));

  const handleMapLocationPick = (loc: { lat: number; lng: number; approxLocation: string }) => {
    setLat(loc.lat);
    setLng(loc.lng);
    if (!locationText) {
      setLocationText(`GPS Location: ${loc.lat}, ${loc.lng}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !locationText.trim()) return;

    setIsSubmitting(true);
    const trackingId = generateTrackingId(2026);
    const villageObj = mockVillages.find(v => v.id === villageId) || mockVillages[0];

    const categoryTitles: Record<string, string> = {
      pothole: "Pothole crater hazard on village link road",
      waterlogging: "Severe monsoon waterlogging along road stretch",
      blocked_drain: "Concrete side drain choked with debris and mud",
      culvert: "Masonry bridge/culvert structural damage"
    };

    const newIssue: Grievance = {
      id: trackingId,
      title: categoryTitles[roadCategory] || "Road defect reported",
      description: description.trim(),
      category: 'roads',
      severity,
      status: 'received',
      villageId,
      villageName: villageObj.name,
      locationDetails: locationText.trim(),
      lat,
      lng,
      isAnonymous: false,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      assignedDepartment: "Rural Engineering Services (RES / PWD)",
      timeline: [
        {
          step: 'received',
          label: 'Road Grievance Logged with GPS Geotag',
          timestamp: new Date().toLocaleString(),
          remarks: 'Submitted via Roads & Drainage reporting module'
        }
      ],
      isSample: false
    };

    saveGrievance(newIssue);

    setTimeout(() => {
      setIsSubmitting(false);
      setGeneratedId(trackingId);
      setDescription('');
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Roads, Drainage & Waterlogging" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Footprints className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Infrastructure & Connectivity Module
                </span>
                <SampleDataBadge label="SAMPLE DATA" variant="verified" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Roads, Drainage & Monsoon Waterlogging
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Geotagged citizen audits for rural link roads, PMGSY blacktop surfaces, hume pipe culverts, and side drain siltation. Accelerating repair work before monsoon isolation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://omms.nic.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2A4A] text-xs font-bold transition-colors"
              >
                PMGSY National Portal
              </a>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Engineering Notice:</strong> Proper road culvert reconstruction and drainage gradient slope require qualified civil engineering assessment. Reports submitted here serve as civic inspection requests to the Rural Engineering Services (RES / PWD).
            </div>
          </div>
        </div>

        {/* Technical Cross-Section Diagram: Rural Road + Integrated Side Drainage */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">IRC:SP:20 Standard Design Reference</span>
              <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                Cross-Section: All-Weather Rural Road with Longitudinal Drain
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Carriageway 3.75m</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
            <svg viewBox="0 0 800 200" className="w-full min-w-[650px] h-auto">
              {/* Ground level */}
              <line x1="20" y1="160" x2="780" y2="160" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Embankment slope */}
              <polygon points="120,160 180,100 620,100 680,160" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
              
              {/* Sub-base course */}
              <polygon points="180,100 200,85 600,85 620,100" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
              
              {/* Bituminous Wearing Course with Camber */}
              <polygon points="200,85 400,75 600,85 600,90 400,80 200,90" fill="#334155" />
              
              {/* Side Drain Left */}
              <polygon points="60,160 80,185 110,185 130,160" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
              
              {/* Side Drain Right */}
              <polygon points="670,160 690,185 720,185 740,160" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />

              {/* Labels */}
              <text x="400" y="65" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="bold">
                Bituminous Top Surface (Camber 2.5% - 3%)
              </text>
              <text x="400" y="125" textAnchor="middle" fill="#475569" fontSize="11">
                Compacted Granular Sub-Base & Earth Embankment
              </text>
              <text x="95" y="150" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="bold">
                Lined Drain (Culvert Outfall)
              </text>
              <text x="705" y="150" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="bold">
                Earthen Shoulder Drain
              </text>

              {/* Width indicators */}
              <line x1="200" y1="50" x2="600" y2="50" stroke="#64748B" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <text x="400" y="45" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="monospace">
                Carriageway: 3.75 m (Single Lane)
              </text>
            </svg>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 italic">
            Rural roads constructed under Pradhan Mantri Gram Sadak Yojana (PMGSY) specifications mandate cross-drainage culverts every 150m in water-logged stretches.
          </p>
        </div>

        {/* Section 2: Report Road Issue & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Report Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#1B5E3A]" />
              <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                Report Road Defect or Waterlogging
              </h2>
            </div>
            <p className="text-xs text-[#5A6B7B] mb-5">
              Submit a geotagged hazard report for potholes, broken culverts, or waterlogged stretches.
            </p>

            {generatedId && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1B5E3A]" />
                  <span className="font-bold">Road Defect Logged Successfully!</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-mono font-bold text-sm text-[#1B5E3A]">{generatedId}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/grievances/track?id=${generatedId}`)}
                    className="text-[11px] font-bold text-[#1B5E3A] hover:underline"
                  >
                    Track Status &rarr;
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pothole', label: 'Pothole Crater' },
                  { id: 'waterlogging', label: 'Waterlogging' },
                  { id: 'blocked_drain', label: 'Blocked Drain' },
                  { id: 'culvert', label: 'Broken Culvert' }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setRoadCategory(c.id as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      roadCategory === c.id
                        ? 'border-[#1B5E3A] bg-emerald-50 text-[#1B5E3A]'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Village / Panchayat <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={villageId}
                    onChange={e => {
                      const vId = e.target.value;
                      setVillageId(vId);
                      const found = mockVillages.find(v => v.id === vId);
                      if (found) {
                        setLat(found.lat);
                        setLng(found.lng);
                      }
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  >
                    {mockVillages.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.block})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Severity Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  >
                    <option value="low">Low (Surface roughness)</option>
                    <option value="medium">Medium (Requires slow driving)</option>
                    <option value="high">High (Catering water / two-wheeler risk)</option>
                    <option value="critical">Critical (Road washed away / blocked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Landmark & GPS Coordinates <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={locationText}
                  onChange={e => setLocationText(e.target.value)}
                  placeholder="e.g. Near Milk Collection Centre, 200m from Highway arch"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tip: Click the map on the right to auto-fill exact GPS coordinates.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Description & Hazard Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe depth of pothole, length of flooded road, impact on school children or milk transit..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
              </div>

              <SensitiveDataNotice compact />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-emerald-200" />
                <span>{isSubmitting ? 'Logging Road Grievance...' : 'Submit Road Defect Report'}</span>
              </button>
            </form>
          </div>

          {/* Map Viewer */}
          <div className="lg:col-span-6 space-y-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1B5E3A]" />
                <span className="text-xs font-bold text-[#0B1B2B]">Click Map to Pick Geolocation</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>

            <LeafletMap
              markers={mapMarkers}
              center={[lat, lng]}
              enableClickPicker
              onLocationSelected={handleMapLocationPick}
              height="380px"
            />
          </div>

        </div>

        {/* Section 3: Active Road Defects Table with Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-bold font-heading text-[#0B1B2B]">
                Active Road & Drainage Issues ({filteredIssues.length})
              </h2>
              <p className="text-xs text-slate-500">Live citizen audits under review by Rural Engineering Services</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search road reports..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-[#0B1B2B] focus:ring-2 focus:ring-[#1B5E3A]"
                />
              </div>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="received">Received</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              {/* Severity filter */}
              <select
                value={filterSeverity}
                onChange={e => setFilterSeverity(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Village</th>
                  <th className="py-3 px-4">Issue Description</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Department</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map(issue => {
                  let sevColor = "bg-slate-100 text-slate-700";
                  if (issue.severity === 'critical') sevColor = "bg-rose-100 text-rose-800 border-rose-300";
                  if (issue.severity === 'high') sevColor = "bg-amber-100 text-amber-800 border-amber-300";
                  if (issue.severity === 'medium') sevColor = "bg-blue-100 text-blue-800 border-blue-300";

                  let statColor = "bg-slate-100 text-slate-700";
                  if (issue.status === 'resolved') statColor = "bg-emerald-100 text-emerald-800";
                  if (issue.status === 'in_progress') statColor = "bg-amber-100 text-amber-800";

                  return (
                    <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1B5E3A] whitespace-nowrap">
                        {issue.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0B1B2B]">
                        {issue.villageName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0B1B2B] line-clamp-1">{issue.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{issue.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sevColor}`}>
                          {issue.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statColor}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {issue.assignedDepartment}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/grievances/track?id=${issue.id}`)}
                          className="text-[#1B5E3A] hover:underline font-bold text-xs"
                        >
                          Track &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
