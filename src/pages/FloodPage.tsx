import React, { useState } from 'react';
import {
  Droplets,
  AlertTriangle,
  Bell,
  CheckCircle,
  Filter,
  ShieldAlert,
  Radio,
  ArrowRight,
  Info,
  Smartphone,
  Send
} from 'lucide-react';
import { Language, FloodSensor } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mockFloodSensors, mockVillages } from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { LeafletMap } from '../components/common/LeafletMap';
import { saveFloodSubscription } from '../utils/storage';

interface FloodPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const FloodPage: React.FC<FloodPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  
  // Alert Subscription Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subVillage, setSubVillage] = useState(mockVillages[0].id);
  const [alertSms, setAlertSms] = useState(true);
  const [alertVoice, setAlertVoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter sensors
  const filteredSensors = mockFloodSensors.filter(sensor => {
    if (filterStatus !== 'all' && sensor.status !== filterStatus) return false;
    if (selectedVillage !== 'all' && sensor.villageId !== selectedVillage) return false;
    return true;
  });

  const mapMarkers = filteredSensors.map(s => ({
    id: s.id,
    code: s.sensorCode,
    lat: s.lat,
    lng: s.lng,
    title: `${s.sensorCode} - ${s.villageName}`,
    status: s.status,
    details: `${s.waterBody} | Level: ${s.currentLevelMeters}m (Threshold: ${s.dangerThresholdMeters}m) | Bat: ${s.batteryPercent}%`
  }));

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!phone.trim() || !/^\+?[0-9]{10,13}$/.test(phone.replace(/[\s-]/g, ''))) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number for emergency SMS.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      saveFloodSubscription({
        id: `FSUB-${Date.now()}`,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        villageId: subVillage,
        alertTypes: [alertSms ? 'SMS' : '', alertVoice ? 'Voice Call' : ''].filter(Boolean),
        createdAt: new Date().toISOString()
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFullName('');
      setPhone('');
      setEmail('');
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Flood Prevention & Disaster Prep" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <Droplets className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Disaster Early Warning Module
                </span>
                <SampleDataBadge label="SIMULATED TELEMETRY" variant="demo" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Flood Prevention & River Gauging Network
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Continuous IoT telemetry tracking river gauge heads, canal syphon discharge points, and low-lying nallahs. Triggers multi-channel SMS broadcasts when warning thresholds are breached.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/grievances/report')}
                className="px-4 py-2 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Report Local Waterlogging</span>
              </button>
            </div>
          </div>

          {/* Mandatory Safety Disclaimer */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Advisory & Legal Notice:</strong> Preparedness and alert coordination tool only. Cannot prevent flood events. All sensor readings and battery telemetry displayed are simulated for demonstration. In active flash flood situations, immediately contact the District Emergency Operations Center at <strong>1077</strong>.
            </div>
          </div>
        </div>

        {/* Workflow Diagram: Sensor -> Dashboard -> Alert -> Official -> Response */}
        <div className="bg-[#0F2A4A] rounded-2xl p-6 text-white shadow-sm">
          <div className="text-xs font-bold text-[#FF9933] uppercase tracking-wider mb-2">
            Early Warning Architecture
          </div>
          <h2 className="text-lg font-bold font-heading mb-4">
            How The Community Early Warning Loop Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { title: "1. Solar Ultrasonic Sensor", text: "Solar-powered IoT gauge measures river head level every 5 minutes." },
              { title: "2. Edge Gateway Telemetry", text: "Packets sent via 2G/4G NB-IoT or LoRaWAN to cloud central gateway." },
              { title: "3. Threshold Evaluation", text: "Rules engine categorizes state into Normal, Warning, or Critical." },
              { title: "4. Rapid Alert Broadcast", text: "Instant localized SMS sent to enrolled villagers and Ward Members." },
              { title: "5. Official Mobilization", text: "Block Disaster Officer dispatches sandbags and earthmoving gear." }
            ].map((st, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/10 text-xs">
                <span className="font-bold text-[#FF9933] block mb-1">{st.title}</span>
                <span className="text-slate-300 text-[11px] leading-relaxed">{st.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map & Filters Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-[#0B1B2B]">Filter Sensor Telemetry:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Status filter buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { id: 'all', label: 'All Sensors' },
                  { id: 'normal', label: 'Normal' },
                  { id: 'warning', label: 'Warning' },
                  { id: 'critical', label: 'Critical' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setFilterStatus(b.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      filterStatus === b.id
                        ? 'bg-white text-[#0B1B2B] shadow-xs'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* Village selector */}
              <select
                value={selectedVillage}
                onChange={e => setSelectedVillage(e.target.value)}
                className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[#0B1B2B] focus:ring-2 focus:ring-[#1B5E3A]"
                aria-label="Filter sensors by village"
              >
                <option value="all">All Villages (8)</option>
                {mockVillages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Leaflet Map */}
          <LeafletMap
            markers={mapMarkers}
            filterStatus={filterStatus}
            height="440px"
          />
        </div>

        {/* Telemetry Sensor Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold font-heading text-[#0B1B2B]">
                Active Sensor Telemetry Feeds ({filteredSensors.length})
              </h2>
              <p className="text-xs text-slate-500">Live simulated sensor nodes deployed across river culverts and canal escapes</p>
            </div>
            <SampleDataBadge label="15 SIMULATED NODES" variant="sample" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Sensor ID</th>
                  <th className="py-3 px-4">Village & Water Body</th>
                  <th className="py-3 px-4">Water Level</th>
                  <th className="py-3 px-4">Danger Mark</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Battery</th>
                  <th className="py-3 px-4">Telemetry Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSensors.map(sensor => {
                  let statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-200";
                  if (sensor.status === 'warning') statusBadge = "bg-amber-100 text-amber-900 border-amber-300";
                  if (sensor.status === 'critical') statusBadge = "bg-rose-100 text-rose-900 border-rose-300";

                  return (
                    <tr key={sensor.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {sensor.sensorCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0B1B2B]">{sensor.villageName}</div>
                        <div className="text-[11px] text-slate-500">{sensor.waterBody}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sm text-[#0B1B2B]">
                        {sensor.currentLevelMeters.toFixed(1)} m
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {sensor.dangerThresholdMeters.toFixed(1)} m
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge}`}>
                          {sensor.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`w-2 h-2 rounded-full ${sensor.batteryPercent > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{sensor.batteryPercent}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {sensor.lastUpdated}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscribe to Alerts Form & Non-digital Alternatives */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-[#1B5E3A]" />
              <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                Subscribe to Village Flood & High Water Alerts
              </h2>
            </div>
            <p className="text-xs text-[#5A6B7B] mb-6">
              Receive automatic SMS warnings if water sensors in your Gram Panchayat exceed the safety threshold. (Demonstration enrollment)
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#1B5E3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Subscription Successfully Registered (Demo Mode)!</p>
                  <p className="text-emerald-800 mt-0.5">
                    Your number has been added to the simulated SMS dispatcher queue for {mockVillages.find(v => v.id === subVillage)?.name}.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone (For SMS Alerts) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A] focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gram Panchayat (Select Village) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={subVillage}
                    onChange={e => setSubVillage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A] focus:outline-hidden"
                  >
                    {mockVillages.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.block})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. ramesh@example.org"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A] focus:outline-hidden"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">Alert Delivery Preferences:</span>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertSms}
                      onChange={e => setAlertSms(e.target.checked)}
                      className="rounded text-[#1B5E3A] focus:ring-[#1B5E3A]"
                    />
                    <span>Priority SMS Text (Standard 2G/4G GSM)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertVoice}
                      onChange={e => setAlertVoice(e.target.checked)}
                      className="rounded text-[#1B5E3A] focus:ring-[#1B5E3A]"
                    />
                    <span>Automated Voice Call (IVRS Broadcast)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <SensitiveDataNotice compact />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Registering Alert Subscription...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-200" />
                    <span>Activate Early Warning Alerts</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Non-digital Alternatives & Helplines */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-sm text-[#0B1B2B] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Non-Digital & Offline Redressal Protocols</span>
              </h3>
              <p className="text-xs text-[#5A6B7B] leading-relaxed">
                For households without smartphones or in low network connectivity zones, GRAM Sathi 360° specifies standard operational alternatives:
              </p>
              <ul className="text-xs space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Temple / Mosque / Panchayat Loudspeaker Relay:</strong> Critical alarms relayed through local chaupal amplifiers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Village Chaukidar Whistle Network:</strong> Traditional flood watchmen dispatched to low-lying hamlets upon sensor danger alarm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Physical Colored Staff Gauges:</strong> Painted red-line flood markers readable at a distance along river bridges.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Emergency Hotline Directory (Verified)
              </h4>
              <div className="text-xs space-y-2 text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span>District Disaster Management Authority:</span>
                  <strong className="text-white">1077</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span>State Disaster Response (SDRF):</span>
                  <strong className="text-white">1070</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span>National Emergency Helpline:</span>
                  <strong className="text-white">112</strong>
                </div>
                <div className="flex justify-between">
                  <span>Ambulance Service:</span>
                  <strong className="text-white">108</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
