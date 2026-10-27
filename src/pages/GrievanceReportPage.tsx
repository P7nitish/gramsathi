import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  MapPin,
  Camera,
  User,
  CheckCircle,
  Copy,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import { Language, Grievance, Severity } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mockVillages } from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { LeafletMap } from '../components/common/LeafletMap';
import { saveGrievance } from '../utils/storage';
import { generateTrackingId, sanitizeInput } from '../utils/logic';

interface GrievanceReportPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const GrievanceReportPage: React.FC<GrievanceReportPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  // Multi-step tracking
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Category & Description
  const [category, setCategory] = useState<'roads' | 'water' | 'sanitation' | 'lighting' | 'flood' | 'ration' | 'health' | 'other'>('roads');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('medium');

  // Step 2: Location & Evidence
  const [villageId, setVillageId] = useState(mockVillages[0].id);
  const [locationDetails, setLocationDetails] = useState('');
  const [lat, setLat] = useState<number>(mockVillages[0].lat);
  const [lng, setLng] = useState<number>(mockVillages[0].lng);
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);

  // Step 3: Contact & Anonymity
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stepError, setStepError] = useState('');

  const villageObj = mockVillages.find(v => v.id === villageId) || mockVillages[0];

  const handleMapPin = (loc: { lat: number; lng: number; approxLocation: string }) => {
    setLat(loc.lat);
    setLng(loc.lng);
    if (!locationDetails) {
      setLocationDetails(`GPS: ${loc.lat}, ${loc.lng}`);
    }
  };

  const handleSimulatePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoSelected(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step Nav Validations
  const goToStep2 = () => {
    setStepError('');
    if (!title.trim() || title.length < 5) {
      setStepError('Please enter a clear summary title (at least 5 characters).');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setStepError('Please enter a detailed description explaining the problem (at least 15 characters).');
      return;
    }
    setCurrentStep(2);
  };

  const goToStep3 = () => {
    setStepError('');
    if (!locationDetails.trim()) {
      setStepError('Please provide specific landmark or location details.');
      return;
    }
    setCurrentStep(3);
  };

  const goToStep4 = () => {
    setStepError('');
    if (!isAnonymous) {
      if (!reporterName.trim()) {
        setStepError('Please enter your name or enable the anonymous submission toggle.');
        return;
      }
      if (!reporterPhone.trim() || !/^[0-9+ -]{10,14}$/.test(reporterPhone.trim())) {
        setStepError('Please provide a valid 10-digit mobile number for status SMS updates.');
        return;
      }
    }
    setCurrentStep(4);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const trackingId = generateTrackingId(2026);

    const departmentMap: Record<string, string> = {
      roads: "Rural Engineering Services (RES / PWD)",
      water: "Jal Jeevan Mission (Rural Water Supply)",
      sanitation: "Swachh Bharat Mission (Grameen) Sanitation Crew",
      lighting: "UPNEDA / Gram Panchayat Energy Cell",
      flood: "Irrigation Department & District Disaster Management",
      ration: "Food & Civil Supplies Department (DSO)",
      health: "Department of Medical Health & Family Welfare",
      other: "Panchayat Development Committee"
    };

    const newGrievance: Grievance = {
      id: trackingId,
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      category,
      severity,
      status: 'received',
      villageId,
      villageName: villageObj.name,
      locationDetails: sanitizeInput(locationDetails),
      lat,
      lng,
      reporterName: isAnonymous ? "Anonymous Citizen" : sanitizeInput(reporterName),
      reporterPhone: isAnonymous ? undefined : reporterPhone.trim(),
      isAnonymous,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      assignedDepartment: departmentMap[category] || "Panchayat Secretary",
      timeline: [
        {
          step: 'received',
          label: 'Grievance Registered Digitally',
          timestamp: new Date().toLocaleString(),
          remarks: 'Citizen submission received with location coordinates and timestamp.'
        }
      ],
      photoUrl: photoSelected || undefined,
      isSample: false
    };

    saveGrievance(newGrievance);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId(trackingId);
    }, 700);
  };

  const copyToClipboard = () => {
    if (!submittedId) return;
    navigator.clipboard.writeText(submittedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[
          { label: "Public Grievances", path: "/grievances" },
          { label: "Report an Issue (4 Steps)" }
        ]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#1B5E3A] bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Standard Citizen Redressal Flow
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
            Report a Village Problem (4-Step Form)
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6B7B] max-w-xl mx-auto">
            Your complaint generates a tamper-evident tracking ID. Local administration is notified under public service guarantee timelines.
          </p>
        </div>

        {/* Sensitive data safeguard */}
        <SensitiveDataNotice />

        {/* Step Indicator Progress Bar */}
        {!submittedId && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { step: 1, label: "1. Problem & Category" },
                { step: 2, label: "2. GPS & Evidence" },
                { step: 3, label: "3. Contact & Privacy" },
                { step: 4, label: "4. Review & Submit" }
              ].map(s => {
                const isCurrent = currentStep === s.step;
                const isPassed = currentStep > s.step;

                return (
                  <div key={s.step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                        isCurrent
                          ? 'bg-[#1B5E3A] text-white shadow-xs ring-4 ring-emerald-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? '✓' : s.step}
                    </div>
                    <span className={`text-[11px] font-medium hidden sm:inline ${isCurrent ? 'text-[#1B5E3A] font-bold' : 'text-slate-500'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error banner */}
        {stepError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
            {stepError}
          </div>
        )}

        {/* Success Screen after submission */}
        {submittedId ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1B5E3A] flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Grievance Successfully Registered
              </span>
              <h2 className="text-2xl font-extrabold font-heading text-[#0B1B2B]">
                Your Grievance Tracking ID
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Save this unique reference code to follow up with Panchayat authorities and check resolution progress.
              </p>
            </div>

            {/* Tracking ID Badge & Copy Button */}
            <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-[#1B5E3A] flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Permanent Tracking Reference</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-[#1B5E3A] tracking-wider">
                  {submittedId}
                </span>
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-4 py-2 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                aria-label="Copy tracking ID"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy ID'}</span>
              </button>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 text-left space-y-1">
              <p className="font-bold">What happens next?</p>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                1. The Panchayat Secretary and concerned Junior Engineer receive digital notification.
                <br />
                2. On-ground verification must be completed within 48 hours.
                <br />
                3. You will receive updates directly on the Public Grievance Tracking portal.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate(`/grievances/track?id=${submittedId}`)}
                className="px-6 py-3 rounded-xl bg-[#0F2A4A] hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Track Live Timeline Now &rarr;
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedId(null);
                  setCurrentStep(1);
                  setTitle('');
                  setDescription('');
                  setLocationDetails('');
                }}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            
            {/* STEP 1: Category & Problem Description */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                    Step 1: Problem Classification & Description
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select the civic category and write a concise, fact-based description.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Department Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'roads', label: 'Roads & Drainage' },
                      { id: 'water', label: 'Drinking Water' },
                      { id: 'sanitation', label: 'Sanitation & Waste' },
                      { id: 'lighting', label: 'Solar & Streetlight' },
                      { id: 'flood', label: 'Flood & Embankment' },
                      { id: 'ration', label: 'PDS Ration Discrepancy' },
                      { id: 'health', label: 'Health Sub-Centre' },
                      { id: 'other', label: 'Other Panchayat Issue' }
                    ].map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id as any)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                          category === c.id
                            ? 'border-[#1B5E3A] bg-emerald-50 text-[#1B5E3A] shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Summary Headline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Broken culvert wall causing tractor bottleneck near school"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Problem Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide exact facts: duration of issue, number of affected families, safety risks..."
                    rows={4}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency / Severity Level <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'low', label: 'Low', desc: 'Routine maintenance' },
                      { id: 'medium', label: 'Medium', desc: 'Inconvenience to daily transit' },
                      { id: 'high', label: 'High', desc: 'Risk of vehicle damage / health' },
                      { id: 'critical', label: 'Critical', desc: 'Immediate danger to life / flood' }
                    ].map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSeverity(s.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          severity === s.id
                            ? 'border-[#1B5E3A] bg-emerald-50 text-[#1B5E3A] font-bold shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="text-xs uppercase">{s.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={goToStep2}
                    className="px-6 py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Step 2: GPS Location</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: GPS Location & Photo Evidence */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                    Step 2: Geotag & Photo Evidence
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click the map to place an accurate GPS pin so the field engineer finds the exact site.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gram Panchayat / Village <span className="text-rose-500">*</span>
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
                        <option key={v.id} value={v.id}>{v.name} (Block {v.block})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location Landmark & Street Details <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={locationDetails}
                      onChange={e => setLocationDetails(e.target.value)}
                      placeholder="e.g. Near Shiv Mandir Chaupal, Pole SL-SK-P01"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                      required
                    />
                  </div>
                </div>

                {/* Map Picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">
                      Pinpoint Location on OpenStreetMap:
                    </span>
                    <span className="text-[11px] font-mono text-[#1B5E3A] font-bold">
                      Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
                    </span>
                  </div>
                  <LeafletMap
                    center={[lat, lng]}
                    enableClickPicker
                    onLocationSelected={handleMapPin}
                    height="280px"
                  />
                </div>

                {/* Photo Upload Simulation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Geotagged Site Photo <span className="text-slate-400 font-normal">(Optional but highly recommended)</span>
                  </label>
                  <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                    <Camera className="w-6 h-6 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-600 font-medium">Click to attach photo or drag here</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 5MB (Stored in demo session)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSimulatePhoto}
                      className="mt-3 text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1B5E3A] file:text-white hover:file:bg-[#154b2e] cursor-pointer"
                    />

                    {photoSelected && (
                      <div className="mt-3 flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                        <CheckCircle className="w-4 h-4 text-[#1B5E3A]" />
                        <span>Photo attached successfully ({photoSelected.slice(0, 30)}...)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={goToStep3}
                    className="px-6 py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Step 3: Contact & Privacy</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Contact & Anonymity */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                    Step 3: Contact Details & Whistleblower Protection
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    You can submit with your phone number to receive milestone SMS, or toggle 100% anonymous mode.
                  </p>
                </div>

                {/* Anonymity Toggle Box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#0B1B2B]">
                      {isAnonymous ? <EyeOff className="w-4 h-4 text-purple-700" /> : <Eye className="w-4 h-4 text-emerald-700" />}
                      <span>Whistleblower & Anonymous Reporting Mode</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      If enabled, your name and phone number will be completely hidden from the public ledger and village contractor view.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                      isAnonymous
                        ? 'bg-purple-700 text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {isAnonymous ? 'Anonymous: ON' : 'Anonymous: OFF'}
                  </button>
                </div>

                {!isAnonymous ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={e => setReporterName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra Verma"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Phone (For Progress SMS) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={reporterPhone}
                        onChange={e => setReporterPhone(e.target.value)}
                        placeholder="e.g. 9839012345"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900">
                    <strong>Identity Masked:</strong> Your complaint will be listed as submitted by "Anonymous Citizen". Please note down your tracking ID after submission as SMS alerts cannot be sent without a phone number.
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={goToStep4}
                    className="px-6 py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Step 4: Final Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                    Step 4: Review Details Before Submission
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verify all parameters. Upon submission, an official tracking ID will be generated.
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Category:</span>
                    <strong className="text-slate-800 capitalize">{category}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Target Village:</span>
                    <strong className="text-slate-800">{villageObj.name} (Block {villageObj.block})</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Severity:</span>
                    <strong className="text-rose-700 uppercase">{severity}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Landmark / Location:</span>
                    <strong className="text-slate-800">{locationDetails}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="font-mono text-slate-700">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Reporter:</span>
                    <strong className="text-slate-800">{isAnonymous ? 'Anonymous Citizen' : reporterName}</strong>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-1">Headline & Description:</span>
                    <p className="font-bold text-slate-900">{title}</p>
                    <p className="text-slate-700 mt-1 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      {description}
                    </p>
                  </div>
                </div>

                <SensitiveDataNotice compact />

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-emerald-200" />
                    <span>{isSubmitting ? 'Registering Grievance...' : 'Confirm & Generate Tracking ID'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
