import React from 'react';
import { ShieldCheck, PhoneCall, HeartHandshake, ExternalLink, HelpCircle, FileCheck } from 'lucide-react';
import { Language } from '../../types';
import { en } from '../../locales/en';
import { hi } from '../../locales/hi';

interface FooterProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  return (
    <footer className="bg-[#0B1B2B] text-slate-300 pt-14 pb-10 border-t border-slate-800" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Disclaimer Notice Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 mb-12 shadow-inner">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1.5">
              <p className="font-bold text-amber-300 uppercase tracking-wide">
                Mandatory Regulatory & Proposal Disclaimer
              </p>
              <p className="text-slate-300 leading-relaxed font-sans">
                {t.footer.statusLine}
              </p>
              <p className="text-amber-200/90 text-[11px]">
                {t.footer.sensitiveNotice}
              </p>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-sm">
          {/* Col 1: Initiative Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm">
                GS
              </div>
              <span className="font-heading font-extrabold text-white text-lg tracking-tight">
                GRAM Sathi 360°
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Rural Development, Social Innovation & Digital Empowerment Platform for Indian villages. Proposed under the Ministry of Youth Affairs & Sports' MY Bharat platform.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Core Mission:</span>
              <p className="italic text-slate-300 mt-0.5">
                "Identify a problem. Report it digitally. Notify the authority. Track the action. Measure the impact."
              </p>
            </div>
          </div>

          {/* Col 2: Civic Tech Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Civic Tech Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/flood')}
                  className="hover:text-emerald-400 transition-colors focus:underline"
                >
                  Flood Early Warning & River Sensors
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/ration')}
                  className="hover:text-emerald-400 transition-colors focus:underline"
                >
                  PDS Fair Price Shop Transparency
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/roads')}
                  className="hover:text-emerald-400 transition-colors focus:underline"
                >
                  Roads, Potholes & Culvert Audits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/lighting')}
                  className="hover:text-emerald-400 transition-colors focus:underline"
                >
                  Solar Streetlights & Energy Asset Registry
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sanitation')}
                  className="hover:text-emerald-400 transition-colors focus:underline"
                >
                  Smart Waste Bins & Sanitation Mitra
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/grievances')}
                  className="hover:text-emerald-400 transition-colors focus:underline font-semibold text-emerald-300"
                >
                  Public Grievances & Redressal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen & Youth Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Citizen & Youth Actions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/grievances/report')}
                  className="hover:text-emerald-400 transition-colors text-amber-300 font-semibold"
                >
                  Submit a Citizen Report (4 Steps)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/grievances/track')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Grievance with Tracking ID
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/youth')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  MY Bharat Youth Volunteering & Curriculum
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/schemes')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Government Schemes Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Village KPI Dashboard & CSV Export
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Governance, Disclaimers & Official Helplines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About the Proposal & 4-Phase Roadmap
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Data Protection & Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/accessibility')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Accessibility Statement (WCAG 2.1 AA)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms of Demonstration & Disclaimers
                </button>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">
                Official Toll-Free Helplines:
              </span>
              <div className="space-y-0.5">
                <div>National Disaster Control: <strong className="text-white">1077</strong></div>
                <div>Electricity Fault Line: <strong className="text-white">1912</strong></div>
                <div>National Cyber Helpline: <strong className="text-white">1930</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 GRAM Sathi 360° Civic Initiative. Concept demonstration submitted for consideration via MY Bharat.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>All mock datasets marked SAMPLE DATA</span>
            <span className="text-slate-600">•</span>
            <span>Bilingual EN / हिंदी</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
