import React, { useState } from 'react';
import {
  Sun,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Wrench,
  BatteryCharging,
  Zap,
  Filter,
  ShieldCheck,
  Send,
  Info
} from 'lucide-react';
import { Language, Streetlight } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mockStreetlights, mockVillages } from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { LeafletMap } from '../components/common/LeafletMap';

interface LightingPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const LightingPage: React.FC<LightingPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  // Filter state
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [poleCode, setPoleCode] = useState(mockStreetlights[0].poleCode);
  const [faultType, setFaultType] = useState('bulb_not_turning_on');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Streetlights list state
  const [lights, setLights] = useState<Streetlight[]>(mockStreetlights);

  const filteredLights = lights.filter(l => {
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (filterType !== 'all' && l.type !== filterType) return false;
    return true;
  });

  const mapMarkers = filteredLights.map(l => ({
    id: l.id,
    code: l.poleCode,
    lat: l.lat,
    lng: l.lng,
    title: `${l.poleCode} (${l.villageName})`,
    status: l.status,
    details: `${l.location} | Type: ${l.type} (${l.wattage}W) | Assigned: ${l.assignedTechnician || 'Unassigned'}`
  }));

  const handleReportFault = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setLights(prev => prev.map(l => {
        if (l.poleCode === poleCode) {
          return {
            ...l,
            status: 'under_maintenance',
            faultDetails: `Fault: ${faultType.replace(/_/g, ' ')}. ${notes || 'Reported by local resident'}`
          };
        }
        return l;
      }));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setNotes('');
    }, 500);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Streetlights & Solar Energy" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-yellow-100 text-yellow-800">
                  <Sun className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider">
                  Public Lighting & Renewable Asset Registry
                </span>
                <SampleDataBadge label="SAMPLE DATA" variant="demo" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Streetlights, Solar Microgrids & Darkness Hotspots
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Asset registry tracking standalone solar LED luminaires, village high masts, and grid poles. Prevents nighttime crime, eliminates school pathway dark zones, and monitors battery degradation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://pmkusum.mnre.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2A4A] text-xs font-bold transition-colors"
              >
                MNRE Solar Portal
              </a>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Renewables Governance Note:</strong> Streetlight asset maintenance tickets are synchronized with Gram Panchayat 15th Finance Commission maintenance grants. All pole data and solar capacities shown are simulated pilot assets.
            </div>
          </div>
        </div>

        {/* Section 1: Report Fault & Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Fault Reporting Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                Report Faulty Light or Dark Zone
              </h2>
            </div>
            <p className="text-xs text-[#5A6B7B] mb-5">
              Submit pole repair request for battery failure, broken fixture, or snapped cable.
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-[#1B5E3A]" />
                  <span>Maintenance Ticket Dispatched!</span>
                </div>
                <p className="text-emerald-800">
                  Pole {poleCode} updated to "under_maintenance". Panchayat Junior Engineer notified.
                </p>
              </div>
            )}

            <form onSubmit={handleReportFault} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Streetlight Pole Code <span className="text-rose-500">*</span>
                </label>
                <select
                  value={poleCode}
                  onChange={e => setPoleCode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                >
                  {mockStreetlights.map(l => (
                    <option key={l.id} value={l.poleCode}>
                      {l.poleCode} — {l.villageName} ({l.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observed Defect Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={faultType}
                  onChange={e => setFaultType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                >
                  <option value="bulb_not_turning_on">Light does not turn on at night</option>
                  <option value="flickering_intermittently">Rapid intermittent flickering</option>
                  <option value="physical_damage">Cracked solar PV panel / tilted pole</option>
                  <option value="burnt_controller">Battery box smoking or corroded wires</option>
                  <option value="always_on">Sensor fault (light stays on all day)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Observations / Impact on Women or School Route
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Near girls tuition center; students having to walk in pitch dark..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                />
              </div>

              <SensitiveDataNotice compact />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4 text-emerald-200" />
                <span>{isSubmitting ? 'Dispatching Work Order...' : 'Dispatch Repair Ticket'}</span>
              </button>
            </form>
          </div>

          {/* Interactive Pole Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0B1B2B] block">Interactive Streetlight Map</span>
                <span className="text-[11px] text-slate-500">Green = Operational, Yellow = Maintenance, Red = Faulty</span>
              </div>
              <SampleDataBadge label="10 POLES" variant="demo" />
            </div>

            <LeafletMap
              markers={mapMarkers}
              filterStatus={filterStatus}
              height="400px"
            />
          </div>

        </div>

        {/* Section 2: Streetlight Asset Maintenance Tracker Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-bold font-heading text-[#0B1B2B]">
                Public Streetlight Asset Registry ({filteredLights.length})
              </h2>
              <p className="text-xs text-slate-500">Pole-level tracking with assigned technicians and inspection logs</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="operational">Operational</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="faulty">Faulty</option>
              </select>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">All Pole Types</option>
                <option value="solar_led">Solar LED</option>
                <option value="grid_connected">Grid Connected</option>
                <option value="high_mast">High Mast Tower</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Pole Code</th>
                  <th className="py-3 px-4">Village & Location</th>
                  <th className="py-3 px-4">Type & Wattage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Technician</th>
                  <th className="py-3 px-4">Last Inspected</th>
                  <th className="py-3 px-4">Fault Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLights.map(l => {
                  let statColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
                  if (l.status === 'faulty') statColor = "bg-rose-100 text-rose-800 border-rose-300";
                  if (l.status === 'under_maintenance') statColor = "bg-amber-100 text-amber-800 border-amber-300";

                  return (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{l.poleCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0B1B2B]">{l.villageName}</div>
                        <div className="text-[11px] text-slate-500">{l.location}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-medium">{l.type.replace('_', ' ')}</span>
                        <span className="text-[11px] text-slate-400 block font-mono">{l.wattage} Watts</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statColor}`}>
                          {l.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {l.assignedTechnician || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {l.lastInspected}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {l.faultDetails || 'Normal operation'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Solar Feasibility Info (Subject to Approval) */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Zap className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base">
                Decentralized Solar Microgrid Feasibility (Proposed Phase)
              </h3>
            </div>
            <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-bold">
              SUBJECT TO MINISTRY APPROVAL
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            As outlined in the GRAM Sathi 360° technical submission, replacing diesel irrigation pump generators and grid-vulnerable poles with community solar microgrids provides an estimated 42% cost reduction over a 5-year lifecycle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-white block mb-1">LiFePO4 Battery Chemistry:</strong>
              Transition from flooded lead-acid batteries to Lithium Iron Phosphate (LiFePO4) with 2,500+ charge cycles and theft-resistant internal pole enclosures.
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-white block mb-1">Automatic Photocell Dimming:</strong>
              Smart LED controllers dim to 40% after midnight and ramp back to 100% when motion is detected, extending runtime during foggy winter months.
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-white block mb-1">Panchayat Asset Ownership:</strong>
              Annual Maintenance Contracts (AMC) managed directly through the Gram Panchayat Development Plan (GPDP) with certified local youth solar technicians.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
