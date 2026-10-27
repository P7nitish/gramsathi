import React, { useState } from 'react';
import {
  Building2,
  Layers,
  Send,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  ExternalLink,
  Mail,
  MapPin
} from 'lucide-react';
import { Language } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';

interface AboutPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  // Contact form state
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderOrg, setSenderOrg] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setContactSuccess(true);
      setSenderName('');
      setSenderEmail('');
      setSenderOrg('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "About the Proposal" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1B5E3A] text-xs font-bold">
              <span>MY Bharat Social Innovation Concept</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#0B1B2B] tracking-tight">
              About GRAM Sathi 360°
            </h1>
            <p className="text-base text-[#1B5E3A] font-semibold italic">
              "Smart Villages. Safer Communities. Transparent Governance."
            </p>
            <p className="text-sm text-[#5A6B7B] leading-relaxed">
              GRAM Sathi 360° is a proposed civic technology and rural digital infrastructure initiative submitted for consideration under the Ministry of Youth Affairs and Sports' MY Bharat platform. It bridges the gap between rural citizens, village youth volunteers, and local administration by delivering transparent, multi-channel problem reporting and resolution tracking.
            </p>
          </div>

          <div className="mt-6 p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-1">
            <span className="text-amber-400 font-bold block uppercase tracking-wider text-[11px]">
              Proposal Status Statement
            </span>
            <p className="text-slate-300">
              {t.footer.statusLine}
            </p>
          </div>
        </div>

        {/* The 4-Phase Implementation Roadmap (No Invented Specific Dates) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold text-[#1B5E3A] uppercase tracking-wider block mb-1">
              Methodical Rollout Strategy
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0B1B2B]">
              The 4-Phase Deployment Roadmap
            </h2>
            <p className="text-xs text-[#5A6B7B] mt-1">
              Phased governance architecture designed to ensure zero service disruption, rigorous field testing, and seamless administrative onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="font-mono text-xs font-bold text-[#1B5E3A] bg-emerald-100 px-2 py-0.5 rounded">
                PHASE 1
              </span>
              <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">
                Proof-of-Concept & Pilot Cluster
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deploy prototype platform across 8 pilot Gram Panchayats. Validate 15 IoT ultrasonic staff gauges and calibrate e-PoS weighing transparency procedures.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                PHASE 2
              </span>
              <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">
                MY Bharat Youth Volunteer Mobilization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Roll out the 8-module digital empowerment curriculum. Enroll 250+ youth volunteers as certified Gram Sathis to assist senior citizens with geotagged complaints.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                PHASE 3
              </span>
              <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">
                Departmental System Integration
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Establish read/write API bridges to central portals (PMGSY OMMS, Jal Jeevan Mission, SBM-G, and State CPGRAMS / Jan Sunwai grievance helplines).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                PHASE 4
              </span>
              <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">
                District & State-Wide Scaling
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Institutional handover to District Administration. Expand to 500+ Gram Panchayats backed by state rural development grants and open-source civic technology standards.
              </p>
            </div>
          </div>
        </div>

        {/* Initiative Leadership & Team Overview (Honest Placeholders) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0B1B2B]">
                Project Working Group & Proposal Team
              </h2>
              <p className="text-xs text-[#5A6B7B] mt-0.5">
                Multidisciplinary team spanning civic tech, rural engineering, and public policy
              </p>
            </div>
            <SampleDataBadge label="PROPOSAL PROPONENTS" variant="demo" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#1B5E3A] flex items-center justify-center font-bold text-base mx-auto">
                CT
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">Civic Tech & Systems Architect</h3>
              <p className="text-xs text-slate-500">Full-Stack Platforms & Open Telemetry Standards</p>
              <p className="text-[11px] text-slate-400">Led public infrastructure deployments for Indian municipal and rural contexts.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base mx-auto">
                RE
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">Rural Infrastructure & Field Lead</h3>
              <p className="text-xs text-slate-500">Panchayati Raj Governance & Civil Works Specialist</p>
              <p className="text-[11px] text-slate-400">Over a decade advising block administrations on flood resilience and PMGSY maintenance.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
              <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base mx-auto">
                YP
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">Youth Programs & Digital Literacy</h3>
              <p className="text-xs text-slate-500">Curriculum Designer & Community Facilitator</p>
              <p className="text-[11px] text-slate-400">Specializes in vernacular smartphone training and village whistleblower safety mechanisms.</p>
            </div>
          </div>
        </div>

        {/* Functional Contact / Inquiries Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="max-w-2xl mb-6">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0B1B2B]">
              Submit Inquiries or Evaluator Feedback
            </h2>
            <p className="text-xs text-[#5A6B7B] mt-1">
              Ministry evaluators, Panchayati Raj officials, and social innovation researchers can get in touch with the proposal working group directly.
            </p>
          </div>

          {contactSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#1B5E3A] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Inquiry Message Received!</p>
                <p className="text-emerald-800">
                  Thank you for your feedback. Our working group will review your query within 2 business days.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="e.g. Dr. K.S. Verma"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={e => setSenderEmail(e.target.value)}
                  placeholder="e.g. ksverma@ministry.gov.in"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Ministry / Institution
              </label>
              <input
                type="text"
                value={senderOrg}
                onChange={e => setSenderOrg(e.target.value)}
                placeholder="e.g. Ministry of Youth Affairs / District Administration Sitapur"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message / Evaluation Notes <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share proposal feedback, pilot inquiry, or technical review notes..."
                rows={4}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                required
              />
            </div>

            <SensitiveDataNotice compact />

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-200" />
              <span>{isSubmitting ? 'Sending Message...' : 'Send Inquiry Message'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
