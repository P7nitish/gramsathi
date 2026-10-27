import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';

export const PrivacyPage: React.FC<{ onNavigate: (path: string) => void; language: Language }> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Data Privacy & Governance" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1B5E3A] text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Personal Data Protection (DPDP) Act Alignment</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
            Data Privacy & Governance Policy
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Effective Date: October 2026 | Version 1.0 (Proposal Draft)
          </p>

          <SensitiveDataNotice />

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed pt-4 border-t border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                1. Principle of Minimum Data Collection
              </h2>
              <p>
                GRAM Sathi 360° is architected on strict data minimization principles. We explicitly do NOT collect, store, or process real Aadhaar numbers, biometric fingerprints, bank account credentials, credit/debit card numbers, or ration card barcodes on this demonstration platform.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                2. Whistleblower & Anonymity Safeguards
              </h2>
              <p>
                Citizens reporting Fair Price Shop (PDS) ration weight manipulation, illegal road substandard bitumen layering, or water source contamination can toggle Anonymous Reporting Mode. When enabled:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 mt-1 pl-2">
                <li>No name or mobile phone number is linked to the publicly queryable ledger.</li>
                <li>Only the Gram Panchayat level and GPS coordinate of the defect are provided to the inspection crew.</li>
                <li>IP addresses are scrubbed from telemetry access logs after 7 days.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                3. Demonstration Sandbox Data Retention
              </h2>
              <p>
                Complaints, subscriptions, and volunteer enrollments created during this demonstration are saved directly to your browser's local sandbox storage (`localStorage`) or simulated in-memory state. You may clear your session at any time by clearing your browser cache.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                4. User Rights & Data Redressal Contact
              </h2>
              <p>
                In compliance with the Digital Personal Data Protection Act (DPDP), 2023, citizens possess the right to data correction, erasure, and grievance redressal. For any privacy queries or data removal requests regarding this proposal:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2 font-mono text-[11px]">
                Data Protection Officer (Proposal Working Group): privacy@gramsathi360.org
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
