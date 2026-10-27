import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Droplets,
  Scale,
  Footprints,
  Sun,
  Trash2,
  FileText,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  TrendingUp,
  Cpu,
  Building2,
  ChevronRight,
  Share2
} from 'lucide-react';
import { Language } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';

interface HomePageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  const modules = [
    {
      id: "flood",
      title: t.modules.floodTitle,
      desc: t.modules.floodDesc,
      icon: Droplets,
      path: "/flood",
      tag: "IoT Telemetry",
      badgeVariant: "demo" as const,
      color: "from-blue-600 to-cyan-600",
      accentBg: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "ration",
      title: t.modules.rationTitle,
      desc: t.modules.rationDesc,
      icon: Scale,
      path: "/ration",
      tag: "PDS Audit",
      badgeVariant: "verified" as const,
      color: "from-amber-600 to-orange-600",
      accentBg: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      id: "roads",
      title: t.modules.roadsTitle,
      desc: t.modules.roadsDesc,
      icon: Footprints,
      path: "/roads",
      tag: "GIS Mapping",
      badgeVariant: "sample" as const,
      color: "from-emerald-600 to-green-700",
      accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      id: "lighting",
      title: t.modules.lightingTitle,
      desc: t.modules.lightingDesc,
      icon: Sun,
      path: "/lighting",
      tag: "Renewable Ops",
      badgeVariant: "demo" as const,
      color: "from-yellow-500 to-amber-600",
      accentBg: "bg-yellow-50 text-yellow-800 border-yellow-200"
    },
    {
      id: "sanitation",
      title: t.modules.sanitationTitle,
      desc: t.modules.sanitationDesc,
      icon: Trash2,
      path: "/sanitation",
      tag: "SBM-G Tracking",
      badgeVariant: "sample" as const,
      color: "from-teal-600 to-emerald-800",
      accentBg: "bg-teal-50 text-teal-700 border-teal-200"
    },
    {
      id: "grievances",
      title: t.modules.grievancesTitle,
      desc: t.modules.grievancesDesc,
      icon: FileText,
      path: "/grievances",
      tag: "Public SLA Trail",
      badgeVariant: "live" as const,
      color: "from-rose-600 to-red-700",
      accentBg: "bg-rose-50 text-rose-700 border-rose-200"
    },
    {
      id: "youth",
      title: t.modules.youthTitle,
      desc: t.modules.youthDesc,
      icon: Users,
      path: "/youth",
      tag: "MY Bharat Network",
      badgeVariant: "verified" as const,
      color: "from-indigo-600 to-violet-700",
      accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200"
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:py-20 bg-gradient-to-b from-emerald-50/70 via-[#F7F9FC] to-[#F7F9FC] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Proposal Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-xs font-bold text-[#1B5E3A] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-ping" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#0B1B2B] tracking-tight leading-[1.18]">
                {t.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-[#5A6B7B] font-medium leading-relaxed max-w-2xl">
                <strong className="text-[#1B5E3A]">{t.hero.tagline}</strong>
                <br />
                {t.hero.subtitle}
              </p>

              {/* Dual Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/grievances/report')}
                  className="px-6 py-3.5 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:ring-3 focus:ring-emerald-500"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-300" />
                  <span>{t.hero.reportCta}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F2A4A] border-2 border-slate-200 font-bold text-sm sm:text-base shadow-xs hover:border-[#1B5E3A] transition-all flex items-center gap-2 focus:ring-3 focus:ring-slate-300"
                >
                  <TrendingUp className="w-5 h-5 text-[#1B5E3A]" />
                  <span>{t.hero.exploreCta}</span>
                </button>
              </div>

              {/* Live Search Shortcut & Sub-note */}
              <div className="pt-2 flex items-center gap-3 text-xs text-[#5A6B7B]">
                <SampleDataBadge label="PROTOTYPE ENVIRONMENT" variant="demo" />
                <span>{t.hero.sampleDataNote}</span>
              </div>
            </div>

            {/* Right Hero Visual / Interactive Snapshot */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 relative">
                <div className="absolute -top-3 -right-3">
                  <SampleDataBadge label="LIVE PROTOTYPE" variant="verified" />
                </div>

                <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pilot Gram Panchayat Cluster
                    </span>
                    <h3 className="font-heading font-bold text-base text-[#0B1B2B]">
                      Sitapur Rural District (8 Villages)
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1B5E3A]">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Quick stats grid inside hero card */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">Active Grievances</span>
                    <span className="text-2xl font-bold font-heading text-[#0B1B2B]">27</span>
                    <span className="text-[10px] text-amber-700 block font-semibold mt-0.5">8 under inspection</span>
                  </div>
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-medium block">Redressed (30 Days)</span>
                    <span className="text-2xl font-bold font-heading text-[#1B5E3A]">162</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">86% SLA compliance</span>
                  </div>
                </div>

                {/* Latest simulated alert */}
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-2.5 mb-4 text-xs">
                  <Droplets className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block">Ultrasonic River Sensor #FL-0301</span>
                    <span className="text-amber-800">Laharpur Lowland Basin reached 4.9m (Critical Threshold: 4.6m). SMS alert dispatched to Panchayat Ward 2.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('/grievances/track')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2A4A] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#1B5E3A]" />
                  <span>Track An Existing Grievance by ID (e.g. GS360-2026-881024)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sensitive Data Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SensitiveDataNotice />
      </div>

      {/* 2. IMPACT STRIP (Honest Sample Data Label) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-heading">
                Civic Redressal & Field Telemetry Snapshot
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Baseline indicators configured for the Sitapur block proof-of-concept
              </p>
            </div>
            <SampleDataBadge label={t.impactStrip.badge} variant="sample" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-2 border-[#1B5E3A] pl-4">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                162
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#5A6B7B] mt-1">
                {t.impactStrip.grievancesResolved}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                Verified with photologs
              </span>
            </div>

            <div className="border-l-2 border-blue-600 pl-4">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                15
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#5A6B7B] mt-1">
                {t.impactStrip.activeSensors}
              </div>
              <span className="text-[10px] text-blue-700 font-semibold block mt-1">
                Solar ultrasonic river gauges
              </span>
            </div>

            <div className="border-l-2 border-[#FF9933] pl-4">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                8
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#5A6B7B] mt-1">
                {t.impactStrip.villagesCovered}
              </div>
              <span className="text-[10px] text-amber-800 font-semibold block mt-1">
                Total population ~26,400
              </span>
            </div>

            <div className="border-l-2 border-purple-600 pl-4">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                48
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#5A6B7B] mt-1">
                {t.impactStrip.volunteersRegistered}
              </div>
              <span className="text-[10px] text-purple-700 font-semibold block mt-1">
                {t.impactStrip.auditTimeAvg}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEVEN CIVIC MODULES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#1B5E3A] bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Comprehensive Platform Scope
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B] mt-3 tracking-tight">
            {t.modules.title}
          </h2>
          <p className="text-sm text-[#5A6B7B] mt-2">
            {t.modules.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1B5E3A] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${m.accentBg}`}>
                      {m.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#0B1B2B] group-hover:text-[#1B5E3A] transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-[#5A6B7B] mt-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <SampleDataBadge label="SAMPLE DATA" variant={m.badgeVariant} />
                  <button
                    type="button"
                    onClick={() => onNavigate(m.path)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E3A] group-hover:text-[#154b2e] group-hover:translate-x-1 transition-all"
                  >
                    <span>{t.modules.openModule}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS: 5-STEP CIVIC ACCOUNTABILITY LOOP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F2A4A] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-wider block mb-2">
              End-to-End Governance Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              {t.howItWorks.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {[
              { num: "01", step: t.howItWorks.step1, desc: t.howItWorks.step1Desc },
              { num: "02", step: t.howItWorks.step2, desc: t.howItWorks.step2Desc },
              { num: "03", step: t.howItWorks.step3, desc: t.howItWorks.step3Desc },
              { num: "04", step: t.howItWorks.step4, desc: t.howItWorks.step4Desc },
              { num: "05", step: t.howItWorks.step5, desc: t.howItWorks.step5Desc }
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="font-heading font-extrabold text-2xl text-[#FF9933] block mb-2">
                    {s.num}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white mb-2">
                    {s.step}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. YOUTH SPOTLIGHT (MY BHARAT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-8 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FF9933] text-[#0B1B2B] text-xs font-bold uppercase tracking-wider">
              MY Bharat Youth Engagement
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Empowering Rural Youth as Civic Technologists
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Equipping village youth with digital literacy, mobile GPS auditing skills, and verified volunteer certificates. Join over 48 active Gram Sathi volunteers bridging digital divides.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('/youth')}
              className="px-6 py-3 rounded-xl bg-white text-[#1B5E3A] font-bold text-sm shadow hover:bg-slate-100 transition-all text-center"
            >
              Explore Volunteer Opportunities
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/schemes')}
              className="px-6 py-3 rounded-xl bg-emerald-950/60 border border-emerald-400 text-white font-bold text-sm hover:bg-emerald-950 transition-all text-center"
            >
              Government Schemes Directory
            </button>
          </div>
        </div>
      </section>

      {/* 6. WHAT THIS IS / WHAT THIS IS NOT (Civic Integrity) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#0B1B2B]">
              {t.comparison.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B7B] mt-1">
              {t.comparison.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What it is */}
            <div className="p-6 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-4">
              <div className="flex items-center gap-2 text-[#1B5E3A] font-heading font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-[#1B5E3A]" />
                <span>{t.comparison.whatItIs}</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E3A] mt-1.5 shrink-0" />
                  <span>{t.comparison.is1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E3A] mt-1.5 shrink-0" />
                  <span>{t.comparison.is2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E3A] mt-1.5 shrink-0" />
                  <span>{t.comparison.is3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E3A] mt-1.5 shrink-0" />
                  <span>{t.comparison.is4}</span>
                </li>
              </ul>
            </div>

            {/* What it is not */}
            <div className="p-6 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-heading font-bold text-base">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>{t.comparison.whatItIsNot}</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{t.comparison.isNot1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{t.comparison.isNot2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{t.comparison.isNot3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{t.comparison.isNot4}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL ACTION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-slate-100 rounded-2xl p-8 sm:p-10 border border-slate-200 flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#0B1B2B]">
            Review the Full Proposal Document & Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B7B] mt-2 max-w-xl">
            Detailed 4-phase rollout plan, API contracts, field training curriculum, and government integration pathways prepared for MY Bharat evaluators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => onNavigate('/about')}
              className="px-6 py-2.5 rounded-xl bg-[#0F2A4A] hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              Read Proposal Roadmap
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-[#0B1B2B] hover:border-[#1B5E3A] font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              View Analytics Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
