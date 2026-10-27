import React, { useState } from 'react';
import {
  Scale,
  AlertTriangle,
  CheckCircle,
  Calculator,
  ShieldCheck,
  FileSpreadsheet,
  Building,
  Info,
  Calendar,
  Send,
  HelpCircle
} from 'lucide-react';
import { Language, RationShop, RationDiscrepancyReport } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mockRationShops, mockVillages } from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { calculateEntitlement, EntitlementResult } from '../utils/logic';
import { saveRationDiscrepancy, getRationDiscrepancies } from '../utils/storage';

interface RationPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const RationPage: React.FC<RationPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  // Entitlement Calculator State
  const [calcCardType, setCalcCardType] = useState<'AAY' | 'PHH' | 'NPHH'>('PHH');
  const [calcMembers, setCalcMembers] = useState<number>(4);
  const [entitlement, setEntitlement] = useState<EntitlementResult>(calculateEntitlement('PHH', 4));

  // Discrepancy Form State
  const [reportVillage, setReportVillage] = useState(mockVillages[0].id);
  const [fpsCode, setFpsCode] = useState(mockRationShops[0].fpsCode);
  const [commodity, setCommodity] = useState<'rice' | 'wheat' | 'sugar' | 'kerosene' | 'edible_oil'>('rice');
  const [cardType, setCardType] = useState<'AAY' | 'PHH' | 'NPHH'>('PHH');
  const [expectedQty, setExpectedQty] = useState<number>(20);
  const [measuredQty, setMeasuredQty] = useState<number>(18);
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initial demo discrepancies
  const [discrepancyList, setDiscrepancyList] = useState<RationDiscrepancyReport[]>([
    {
      id: "RPT-FPS-1043-01",
      villageId: "VIL-02",
      fpsCode: "FPS-UP-STP-1043",
      commodity: "rice",
      expectedQtyKg: 35,
      measuredQtyKg: 32.5,
      date: "2026-10-24",
      cardType: "AAY",
      notes: "Dealer deducted 2.5kg claiming bag tare weight. Electronic scale was not calibrated.",
      status: "under_investigation",
      createdAt: "2026-10-24",
      isSample: true
    },
    {
      id: "RPT-FPS-1088-02",
      villageId: "VIL-03",
      fpsCode: "FPS-UP-STP-1088",
      commodity: "wheat",
      expectedQtyKg: 25,
      measuredQtyKg: 22,
      date: "2026-10-22",
      cardType: "PHH",
      notes: "3kg wheat under-measured for 5-member priority ration card. Receipt generated said 25kg.",
      status: "verified",
      createdAt: "2026-10-22",
      isSample: true
    },
    {
      id: "RPT-FPS-1042-03",
      villageId: "VIL-01",
      fpsCode: "FPS-UP-STP-1042",
      commodity: "sugar",
      expectedQtyKg: 1,
      measuredQtyKg: 0.8,
      date: "2026-10-20",
      cardType: "AAY",
      notes: "AAY sugar entitlement weighed with stone weight instead of standard 1kg weights.",
      status: "addressed",
      createdAt: "2026-10-20",
      isSample: true
    }
  ]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateEntitlement(calcCardType, calcMembers);
    setEntitlement(result);
  };

  const handleDiscrepancySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (measuredQty > expectedQty) {
      setErrorMessage('Validation error: Measured quantity cannot exceed expected entitlement quantity for a discrepancy audit.');
      return;
    }
    if (expectedQty <= 0 || measuredQty <= 0) {
      setErrorMessage('Please enter positive quantities greater than 0.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReport: RationDiscrepancyReport = {
        id: `RPT-FPS-${Date.now().toString().slice(-4)}`,
        villageId: reportVillage,
        fpsCode,
        commodity,
        expectedQtyKg: expectedQty,
        measuredQtyKg: measuredQty,
        date: reportDate,
        cardType,
        notes: notes.trim() || 'Civic weighment audit observation recorded by beneficiary.',
        status: 'under_investigation',
        createdAt: new Date().toISOString().split('T')[0],
        isSample: false
      };

      saveRationDiscrepancy(newReport);
      setDiscrepancyList(prev => [newReport, ...prev]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setNotes('');
    }, 500);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Ration Distribution Transparency" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Scale className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Targeted PDS Transparency & Audit
                </span>
                <SampleDataBadge label="SAMPLE DATA" variant="verified" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Public Distribution System (PDS) Ration Transparency
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Ensuring transparency at Fair Price Shops (FPS). Empowering rural cardholders to check statutory NFSA foodgrain quotas, compare electronic receipts, and record weighment discrepancies.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://nfsa.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2A4A] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>NFSA National Portal</span>
              </a>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Civic Integrity Safeguard:</strong> All grain calculators and report forms are based on National Food Security Act (NFSA) statutory norms. Do not enter real ration card numbers or Aadhaar IDs. Official dispute escalation is submitted through your District Supply Office.
            </div>
          </div>
        </div>

        {/* Section 1: Entitlement Calculator & Fair Price Shop Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Entitlement Calculator */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-[#1B5E3A]" />
              <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                Check Monthly Ration Entitlement
              </h2>
            </div>
            <p className="text-xs text-[#5A6B7B] mb-5">
              Calculate your family's statutory grain entitlement based on central NFSA provisions (PMGKAY).
            </p>

            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ration Card Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PHH', label: 'Priority (PHH)', desc: '5 kg / member' },
                    { id: 'AAY', label: 'Antyodaya (AAY)', desc: '35 kg / family' },
                    { id: 'NPHH', label: 'Non-Priority', desc: 'State norms' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCalcCardType(c.id as any);
                        setEntitlement(calculateEntitlement(c.id as any, calcMembers));
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        calcCardType === c.id
                          ? 'border-[#1B5E3A] bg-emerald-50/80 text-[#1B5E3A] shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{c.label}</div>
                      <div className="text-[10px] text-slate-500">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Family Members on Ration Card: <strong className="text-[#1B5E3A]">{calcMembers} Persons</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={calcMembers}
                  onChange={e => {
                    const m = parseInt(e.target.value);
                    setCalcMembers(m);
                    setEntitlement(calculateEntitlement(calcCardType, m));
                  }}
                  className="w-full accent-[#1B5E3A]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>1 member</span>
                  <span>6 members</span>
                  <span>12 members</span>
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold text-slate-600">Calculated Monthly Entitlement:</span>
                  <span className="text-sm font-extrabold text-[#1B5E3A] font-heading">
                    {entitlement.totalGrainsKg} kg Total Grains
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rice</span>
                    <strong className="text-sm font-mono text-slate-800">{entitlement.riceKg} kg</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wheat</span>
                    <strong className="text-sm font-mono text-slate-800">{entitlement.wheatKg} kg</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sugar (AAY)</span>
                    <strong className="text-sm font-mono text-slate-800">{entitlement.sugarKg} kg</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Note: {entitlement.pricePerKgNote}
                </p>
              </div>
            </form>
          </div>

          {/* Fair Price Shop (FPS) Dealer Ledger */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#0F2A4A]" />
                <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                  Panchayat Fair Price Shops
                </h2>
              </div>
              <SampleDataBadge label="SAMPLE STOCK" variant="sample" />
            </div>
            <p className="text-xs text-[#5A6B7B] mb-4">
              Real-time simulated e-PoS dealer stock quotas for pilot shops.
            </p>

            <div className="space-y-3">
              {mockRationShops.map(shop => (
                <div
                  key={shop.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors bg-slate-50/60"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#0F2A4A]">{shop.fpsCode}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">{shop.villageName}</span>
                      </div>
                      <div className="text-xs font-bold text-[#0B1B2B] mt-0.5">{shop.dealerName}</div>
                      <div className="text-[11px] text-slate-500">{shop.location}</div>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-[10px] text-slate-400 block">Cards Attached</span>
                      <span className="font-mono font-bold text-slate-800">{shop.activeCardsCount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Wheat Stock</span>
                      <span className="font-mono font-semibold text-slate-700">{shop.currentWheatStockKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Rice Stock</span>
                      <span className="font-mono font-semibold text-slate-700">{shop.currentRiceStockKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Sugar Stock</span>
                      <span className="font-mono font-semibold text-slate-700">{shop.currentSugarStockKg} kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Section 2: Report a Discrepancy Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
              Report a Ration Weight or Stock Discrepancy
            </h2>
          </div>
          <p className="text-xs text-[#5A6B7B] mb-6">
            Log an audit record if your delivered grains were less than the statutory allocation, if weights were manipulated, or if biometric non-denial protocol was violated.
          </p>

          {submitSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#1B5E3A] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Discrepancy Audit Logged Successfully!</p>
                <p className="text-emerald-800 mt-0.5">
                  Record added to the transparency registry. Field youth volunteers are alerted to observe subsequent distribution rounds at Fair Price Shop {fpsCode}.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleDiscrepancySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gram Panchayat / Village <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reportVillage}
                  onChange={e => setReportVillage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                >
                  {mockVillages.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.district})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fair Price Shop Code <span className="text-rose-500">*</span>
                </label>
                <select
                  value={fpsCode}
                  onChange={e => setFpsCode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                >
                  {mockRationShops.map(s => (
                    <option key={s.id} value={s.fpsCode}>{s.fpsCode} — {s.dealerName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commodity Affected <span className="text-rose-500">*</span>
                </label>
                <select
                  value={commodity}
                  onChange={e => setCommodity(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                >
                  <option value="rice">Rice (चावल)</option>
                  <option value="wheat">Wheat (गेहूं)</option>
                  <option value="sugar">Sugar (चीनी)</option>
                  <option value="kerosene">Kerosene / Fuel</option>
                  <option value="edible_oil">Edible Oil (Fortified)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ration Card Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={cardType}
                  onChange={e => setCardType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                >
                  <option value="PHH">Priority Household (PHH)</option>
                  <option value="AAY">Antyodaya Anna Yojana (AAY)</option>
                  <option value="NPHH">Non-Priority Household (NPHH)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Allocation (kg) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="100"
                  value={expectedQty}
                  onChange={e => setExpectedQty(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Actually Measured (kg) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  value={measuredQty}
                  onChange={e => setMeasuredQty(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
                <span className="text-[10px] text-slate-500">Must be ≤ expected quantity</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Distribution Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={e => setReportDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Audit Notes / Observations (e.g. scale manipulation, biometric denial, substandard quality)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe what occurred during the weighment or transaction..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
              />
            </div>

            <SensitiveDataNotice compact />

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-200" />
              <span>{isSubmitting ? 'Submitting Audit Report...' : 'Log Ration Discrepancy Record'}</span>
            </button>
          </form>
        </div>

        {/* Section 3: Discrepancy Tracker Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold font-heading text-[#0B1B2B]">
                Public Discrepancy Audit Log ({discrepancyList.length})
              </h2>
              <p className="text-xs text-slate-500">Citizen & youth volunteer verified weighment records</p>
            </div>
            <SampleDataBadge label="SAMPLE AUDIT LOG" variant="sample" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">FPS Code</th>
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-4">Expected vs Measured</th>
                  <th className="py-3 px-4">Shortfall</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {discrepancyList.map(item => {
                  const shortfall = (item.expectedQtyKg - item.measuredQtyKg).toFixed(1);
                  let statusColor = "bg-amber-100 text-amber-900 border-amber-300";
                  if (item.status === 'verified') statusColor = "bg-rose-100 text-rose-900 border-rose-300";
                  if (item.status === 'addressed') statusColor = "bg-emerald-100 text-emerald-900 border-emerald-300";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                      <td className="py-3 px-4 font-mono">{item.fpsCode}</td>
                      <td className="py-3 px-4 uppercase font-semibold text-slate-800">{item.commodity}</td>
                      <td className="py-3 px-4 font-mono">
                        {item.expectedQtyKg} kg &rarr; <span className="text-rose-700 font-bold">{item.measuredQtyKg} kg</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600">
                        -{shortfall} kg
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {item.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Safeguards & Statutory Non-Denial Protections */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-heading font-bold text-base">
              National Food Security Act (NFSA) Statutory Protections
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-white block mb-1">Non-Denial on Biometric Failure:</strong>
              As per Ministry of Consumer Affairs orders, no genuine beneficiary can be denied food grains solely due to fingerprint or iris authentication failure on the e-PoS machine. An OTP or manual nominee register exception must be invoked.
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-white block mb-1">Mandatory Electronic Weighing Scale:</strong>
              Point of Sale (e-PoS) devices must be electronically integrated with certified digital scales. Mechanical deductions or manually input weights are legally prohibited.
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-white block mb-1">Social Audit & Vigilance Committee:</strong>
              Every Gram Panchayat has a statutorily formed Vigilance Committee comprising local ward members, women self-help group representatives, and youth volunteers to conduct monthly inspection audits.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
