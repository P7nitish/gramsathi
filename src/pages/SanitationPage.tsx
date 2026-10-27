import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  CheckCircle,
  Truck,
  Droplets,
  Calendar,
  Filter,
  ShieldCheck,
  Send,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { Language, WasteBin } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mockWasteBins, mockVillages } from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { getAllGrievances, saveGrievance } from '../utils/storage';
import { generateTrackingId } from '../utils/logic';

interface SanitationPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const SanitationPage: React.FC<SanitationPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  // Filter state
  const [filterVillage, setFilterVillage] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Report form state
  const [issueType, setIssueType] = useState('overflowing_bin');
  const [reportVillage, setReportVillage] = useState(mockVillages[0].id);
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const filteredBins = mockWasteBins.filter(b => {
    if (filterVillage !== 'all' && b.villageId !== filterVillage) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    return true;
  });

  // Sample collection schedule data
  const collectionSchedules = [
    {
      villageId: "VIL-01",
      villageName: "Rampur Kalan",
      days: "Mon, Wed, Fri",
      time: "07:00 AM – 10:00 AM",
      vehicle: "E-Rickshaw Tipper 01",
      driver: "Ramphal (Sanitation Mitra)",
      wasteTypes: "Dry Recyclable & Segregated Wet"
    },
    {
      villageId: "VIL-02",
      villageName: "Shivpuri Khurd",
      days: "Tue, Thu, Sat",
      time: "07:30 AM – 10:30 AM",
      vehicle: "Tractor Trolley #4",
      driver: "Sanjay Kumar",
      wasteTypes: "Household Segregated"
    },
    {
      villageId: "VIL-03",
      villageName: "Badagaon",
      days: "Daily (Mon – Sun)",
      time: "06:00 AM – 11:00 AM",
      vehicle: "Compactor Rickshaw 02",
      driver: "Munna Lal",
      wasteTypes: "Grain Mandi & Residential"
    },
    {
      villageId: "VIL-04",
      villageName: "Jamunaha Tola",
      days: "Wed, Sat",
      time: "08:00 AM – 11:00 AM",
      vehicle: "E-Cart Tipper 03",
      driver: "Santosh Rawat",
      wasteTypes: "Panchayat Wet/Dry"
    }
  ];

  const filteredSchedule = collectionSchedules.filter(s => {
    if (filterVillage === 'all') return true;
    return s.villageId === filterVillage;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landmark.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const trackingId = generateTrackingId(2026);
    const villageObj = mockVillages.find(v => v.id === reportVillage) || mockVillages[0];

    const issueTitles: Record<string, string> = {
      overflowing_bin: "Overflowing community garbage receptacle",
      stagnant_drain: "Open drain choked with single-use plastic waste",
      animal_carcass: "Dead animal carcass removal urgent request",
      dirty_handpump: "Contaminated / unchlorinated drinking water source"
    };

    saveGrievance({
      id: trackingId,
      title: issueTitles[issueType] || "Sanitation hazard reported",
      description: description.trim(),
      category: 'sanitation',
      severity: issueType === 'animal_carcass' ? 'critical' : 'high',
      status: 'received',
      villageId: reportVillage,
      villageName: villageObj.name,
      locationDetails: landmark.trim(),
      isAnonymous: false,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      assignedDepartment: "Swachh Bharat Mission (Grameen) / Panchayat Mitra",
      timeline: [
        {
          step: 'received',
          label: 'Sanitation Report Logged',
          timestamp: new Date().toLocaleString(),
          remarks: 'Action ticket queued for Gram Panchayat Sanitation Crew'
        }
      ],
      isSample: false
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setGeneratedId(trackingId);
      setDescription('');
      setLandmark('');
    }, 500);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Sanitation, Water & Waste Management" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-teal-100 text-teal-800">
                  <Trash2 className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Swachh Bharat Mission (SBM-G) Module
                </span>
                <SampleDataBadge label="SAMPLE DATA" variant="verified" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Sanitation, Solid Waste & Drinking Water Quality
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Smart ultrasonic waste bin telemetry, door-to-door e-rickshaw collection schedules, and Jal Jeevan Mission drinking water surveillance. Transforming villages into clean, ODF Plus communities.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://sbm.gov.in/sbmgdashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2A4A] text-xs font-bold transition-colors"
              >
                SBM-G National Portal
              </a>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Public Health Protocol:</strong> Bin fill levels and waste metrics are updated by simulated edge sensors. For immediate biohazard or epidemic water contamination outbreaks, notify the Block Medical Officer immediately.
            </div>
          </div>
        </div>

        {/* Section 1: Smart Waste Bin Fill-Level Dashboard */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-heading text-[#0B1B2B]">
                  Smart Waste Receptacle Telemetry ({filteredBins.length} Bins)
                </h2>
                <SampleDataBadge label="20 SIMULATED BINS" variant="sample" />
              </div>
              <p className="text-xs text-slate-500">Ultrasonic fill sensors dispatching alerts when bin reaches 85%+ capacity</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterVillage}
                onChange={e => setFilterVillage(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">All Villages (8)</option>
                {mockVillages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">All Fill Statuses</option>
                <option value="empty">Empty (&lt; 40%)</option>
                <option value="half">Half (40% – 80%)</option>
                <option value="full">Full (&gt; 80%)</option>
                <option value="overdue">Overdue (&gt; 95%)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Bin Code</th>
                  <th className="py-3 px-4">Village & Location</th>
                  <th className="py-3 px-4">Waste Stream</th>
                  <th className="py-3 px-4">Current Fill Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Cleaned</th>
                  <th className="py-3 px-4">Telemetry Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBins.map(bin => {
                  let barColor = "bg-emerald-500";
                  let statBadge = "bg-emerald-100 text-emerald-800 border-emerald-300";

                  if (bin.status === 'half') {
                    barColor = "bg-blue-500";
                    statBadge = "bg-blue-100 text-blue-800 border-blue-300";
                  } else if (bin.status === 'full') {
                    barColor = "bg-amber-500";
                    statBadge = "bg-amber-100 text-amber-900 border-amber-300";
                  } else if (bin.status === 'overdue') {
                    barColor = "bg-rose-600";
                    statBadge = "bg-rose-100 text-rose-900 border-rose-300";
                  }

                  return (
                    <tr key={bin.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {bin.binCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0B1B2B]">{bin.villageName}</div>
                        <div className="text-[11px] text-slate-500">{bin.location}</div>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {bin.wasteType.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              style={{ width: `${bin.fillPercentage}%` }}
                              className={`h-full rounded-full ${barColor}`}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-800 text-[11px]">
                            {bin.fillPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statBadge}`}>
                          {bin.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {bin.lastCleaned}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {bin.lastSensorReading}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Report Sanitation Issue & Door-to-Door Collection Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Report Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-teal-700" />
              <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                Report Sanitation or Waste Hazard
              </h2>
            </div>
            <p className="text-xs text-[#5A6B7B] mb-5">
              Notify the Panchayat Sanitation Committee of overflowing waste, animal carcass, or blocked drains.
            </p>

            {generatedId && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-[#1B5E3A]" />
                  <span>Sanitation Dispatch Order Created!</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-mono font-bold text-[#1B5E3A]">{generatedId}</span>
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

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sanitation Hazard Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={issueType}
                    onChange={e => setIssueType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  >
                    <option value="overflowing_bin">Overflowing Waste Bin</option>
                    <option value="stagnant_drain">Choked Drain / Stagnant Water</option>
                    <option value="animal_carcass">Dead Animal Carcass Removal</option>
                    <option value="dirty_handpump">Turbid / Contaminated Tap Water</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gram Panchayat <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={reportVillage}
                    onChange={e => setReportVillage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  >
                    {mockVillages.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Landmark & Street Details <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="e.g. Behind Health Sub-Centre, Haat Bazaar lane 3"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description of Health Hazard <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe foul odor, mosquito breeding, waste spill over road..."
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
                <span>{isSubmitting ? 'Submitting Order...' : 'Dispatch Sanitation Request'}</span>
              </button>
            </form>
          </div>

          {/* Collection Schedule & Drinking Water Hotline */}
          <div className="lg:col-span-6 space-y-4">
            {/* Waste Collection Schedule */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-teal-700" />
                  <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">
                    E-Rickshaw Waste Collection Schedule
                  </h3>
                </div>
                <SampleDataBadge label="TIMETABLE" variant="sample" />
              </div>

              <div className="space-y-3">
                {filteredSchedule.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#0B1B2B]">
                      <span>{s.villageName}</span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {s.days}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{s.time}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      <strong>Vehicle:</strong> {s.vehicle} | <strong>Driver:</strong> {s.driver}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean Drinking Water Surveillance Panel (Jal Jeevan Mission) */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Droplets className="w-5 h-5" />
                <h3 className="font-heading font-bold text-sm">
                  Jal Jeevan Mission Potable Water Surveillance
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Village Pani Samitis conduct monthly testing using chemical Field Test Kits (FTK). Report chlorine depletion, fluoride, or heavy bacterial turbidity directly.
              </p>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Pani Samiti Toll-Free Line:</span>
                  <strong className="text-white">1800-180-5678</strong>
                </div>
                <div className="flex justify-between">
                  <span>Water Quality Standards:</span>
                  <span className="text-slate-300 font-mono">IS 10500: 2012</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
