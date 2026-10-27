import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const TermsPage: React.FC<{ onNavigate: (path: string) => void; language: Language }> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Terms & Legal Disclaimers" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Civic Demonstration Guidelines</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
            Terms of Demonstration & Platform Disclaimers
          </h1>

          {/* Mandatory Status Line Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-1.5">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">
              Formal Status Notice
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              {t.footer.statusLine}
            </p>
          </div>

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                1. Nature of the Platform
              </h2>
              <p>
                This website is a conceptual demonstration and working civic technology prototype developed specifically for evaluation under the Ministry of Youth Affairs and Sports' MY Bharat social innovation proposal track. It does not represent an approved, operational, or statutory agency of the Government of India, State Government, or District Panchayati Raj Office.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                2. Acceptable Use Policy
              </h2>
              <p>
                Users exploring the demonstration agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 mt-1 pl-2">
                <li>Submit abusive, defamatory, or false personal allegations against individuals or local officials.</li>
                <li>Enter authentic sensitive identification data such as 12-digit Aadhaar UID numbers, bank account details, or biometric credentials.</li>
                <li>Misrepresent the platform as an official Government of India portal to third parties.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                3. Simulated & Sample Data Attribution
              </h2>
              <p>
                All flood river gauge readings, smart waste receptacle fill levels, solar streetlight asset entries, and grievance tickets are realistic simulations prepared for test-case demonstration. They do not reflect real-time emergency telemetry.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                4. Intellectual Property & Fair Use
              </h2>
              <p>
                The GRAM Sathi 360° conceptual architecture and interface are open for public civic assessment and evaluation under fair-use principles. Official scheme names (PMGSY, JJM, PMAY-G, SBM-G, PM-KUSUM, NFSA) belong to their respective Government of India Ministries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
