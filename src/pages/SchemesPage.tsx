import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Building,
  Filter,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { Language, GovernmentScheme } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mockSchemes } from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';

interface SchemesPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Eligibility Helper interactive wizard state
  const [ownsPuccaHouse, setOwnsPuccaHouse] = useState<string>('no');
  const [hasTapWater, setHasTapWater] = useState<string>('no');
  const [isFarmer, setIsFarmer] = useState<string>('yes');
  const [incomeBand, setIncomeBand] = useState<string>('bpl');
  const [checkerEvaluated, setCheckerEvaluated] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState<string[]>([]);

  const filteredSchemes = mockSchemes.filter(scheme => {
    if (filterCategory !== 'all' && scheme.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        scheme.name.toLowerCase().includes(q) ||
        scheme.code.toLowerCase().includes(q) ||
        scheme.objective.toLowerCase().includes(q) ||
        scheme.ministry.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleEvaluateEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const result: string[] = [];

    if (ownsPuccaHouse === 'no') {
      result.push('PMAY-G (Pradhan Mantri Awaas Yojana - Gramin)');
    }
    if (hasTapWater === 'no') {
      result.push('Jal Jeevan Mission (Har Ghar Jal)');
    }
    if (isFarmer === 'yes') {
      result.push('PM-KUSUM (Solar Agriculture Pump Subsidy)');
    }
    if (incomeBand === 'bpl' || incomeBand === 'antyodaya') {
      result.push('NFSA-TPDS (National Food Security Act - Subsidised Grains)');
      result.push('Swachh Bharat Mission (Grameen) Individual Household Latrine (IHHL)');
    }
    result.push('PMGSY (Pradhan Mantri Gram Sadak Yojana - Rural Habitation Road)');

    setEligibleSchemes(result);
    setCheckerEvaluated(true);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Government Scheme Awareness" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-emerald-100 text-[#1B5E3A]">
                  <BookOpen className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-[#1B5E3A] uppercase tracking-wider">
                  Verified Central Rural Schemes
                </span>
                <SampleDataBadge label="VERIFIED SCHEMES" variant="verified" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Government Scheme Awareness & Eligibility Helper
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Direct access to verified flagship welfare initiatives. Every scheme card links exclusively to its official Government of India portal (.gov.in / .nic.in).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">
                {mockSchemes.length} Verified National Programs
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Civic Integrity Safeguard:</strong> This platform does not fabricate or modify government policies, nor does it charge any fee. Always apply through official portals or your designated Common Service Centre (CSC) / Panchayat Seva Kendra.
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Eligibility Self-Check Helper */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0F2A4A] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-6">
            <div className="flex items-center gap-2 text-[#FF9933] mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Illustrative Self-Check
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading">
              Quick Scheme Eligibility Checker
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Answer 4 simple lifestyle questions to identify government schemes applicable to your rural household. (Illustrative, non-binding).
            </p>
          </div>

          <form onSubmit={handleEvaluateEligibility} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-2">
              <span className="text-slate-300 font-semibold block">1. Does your family own a pucca brick house?</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pucca"
                    value="yes"
                    checked={ownsPuccaHouse === 'yes'}
                    onChange={() => setOwnsPuccaHouse('yes')}
                    className="text-[#FF9933] focus:ring-[#FF9933]"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pucca"
                    value="no"
                    checked={ownsPuccaHouse === 'no'}
                    onChange={() => setOwnsPuccaHouse('no')}
                    className="text-[#FF9933] focus:ring-[#FF9933]"
                  />
                  <span>No (Kutcha / Tin)</span>
                </label>
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-2">
              <span className="text-slate-300 font-semibold block">2. Functional household tap water available?</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="water"
                    value="yes"
                    checked={hasTapWater === 'yes'}
                    onChange={() => setHasTapWater('yes')}
                    className="text-[#FF9933] focus:ring-[#FF9933]"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="water"
                    value="no"
                    checked={hasTapWater === 'no'}
                    onChange={() => setHasTapWater('no')}
                    className="text-[#FF9933] focus:ring-[#FF9933]"
                  />
                  <span>No (Rely on pump)</span>
                </label>
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-2">
              <span className="text-slate-300 font-semibold block">3. Own agricultural land / Farming?</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="farming"
                    value="yes"
                    checked={isFarmer === 'yes'}
                    onChange={() => setIsFarmer('yes')}
                    className="text-[#FF9933] focus:ring-[#FF9933]"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="farming"
                    value="no"
                    checked={isFarmer === 'no'}
                    onChange={() => setIsFarmer('no')}
                    className="text-[#FF9933] focus:ring-[#FF9933]"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-2">
              <span className="text-slate-300 font-semibold block">4. Ration card category / Income:</span>
              <select
                value={incomeBand}
                onChange={e => setIncomeBand(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-800 text-white border border-slate-700"
              >
                <option value="antyodaya">Antyodaya (Poorest of Poor / AAY)</option>
                <option value="bpl">Priority Household (BPL / PHH)</option>
                <option value="apl">Above Poverty Line (APL / General)</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 pt-2 flex items-center justify-between flex-wrap gap-3">
              <span className="text-[11px] text-slate-300 italic">
                Non-binding self-check. Official eligibility requires Gram Sabha SECC verification.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#FF9933] hover:bg-amber-600 text-[#0B1B2B] font-bold text-xs shadow-md transition-colors"
              >
                Run Eligibility Assessment
              </button>
            </div>
          </form>

          {/* Results Box */}
          {checkerEvaluated && (
            <div className="mt-6 p-5 rounded-2xl bg-white text-[#0B1B2B] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1B5E3A]" />
                <h3 className="font-heading font-bold text-sm">
                  Recommended Flagship Schemes ({eligibleSchemes.length} Matches)
                </h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {eligibleSchemes.map((s, idx) => (
                  <li key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E3A] shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 2: Search & Filter Directory */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search scheme name, ministry, or objective (e.g. housing, solar, water)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#0B1B2B] focus:ring-2 focus:ring-[#1B5E3A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="all">All Sectors</option>
              <option value="infrastructure">Rural Roads & Infrastructure</option>
              <option value="water_sanitation">Water & Sanitation</option>
              <option value="housing">Rural Housing</option>
              <option value="energy">Clean Energy & Solar</option>
              <option value="employment">Food Security & Welfare</option>
            </select>
          </div>
        </div>

        {/* Section 3: Verified Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map(scheme => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#1B5E3A] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#1565C0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {scheme.code}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Flagship Central Scheme
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-[#0B1B2B]">
                  {scheme.name}
                </h3>
                <p className="text-xs text-[#1B5E3A] font-hindi mt-0.5">
                  {scheme.nameHi}
                </p>

                <div className="mt-3 text-xs space-y-2 text-slate-600">
                  <div>
                    <strong className="text-slate-800">Ministry:</strong> {scheme.ministry}
                  </div>
                  <div>
                    <strong className="text-slate-800">Objective:</strong> {scheme.objective}
                  </div>
                  <div>
                    <strong className="text-slate-800">Key Benefits:</strong> {scheme.benefitsSummary}
                  </div>
                  <div>
                    <strong className="text-slate-800">Eligibility:</strong> {scheme.eligibilitySummary}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-[10px] text-slate-500 font-medium">
                  {scheme.sourceVerified}
                </div>

                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
