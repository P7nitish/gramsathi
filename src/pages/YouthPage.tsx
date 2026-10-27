import React, { useState } from 'react';
import {
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Filter,
  ShieldCheck,
  Send,
  X,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { Language, VolunteerOpportunity, VolunteerRegistration } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import {
  mockVolunteerOpportunities,
  mockLeaderboard,
  mockDigitalLiteracyCurriculum,
  mockVillages
} from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { saveVolunteerRegistration } from '../utils/storage';

interface YouthPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const YouthPage: React.FC<YouthPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;

  // Filter state for opportunities
  const [filterCause, setFilterCause] = useState<string>('all');
  const [filterVillage, setFilterVillage] = useState<string>('all');

  // Accordion state for digital literacy curriculum
  const [expandedCurriculum, setExpandedCurriculum] = useState<string | null>("MOD-1");

  // General Volunteer Form State
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState('Male');
  const [villageId, setVillageId] = useState(mockVillages[0].id);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [availability, setAvailability] = useState('Weekends (4-6 hrs)');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Smartphone Proficiency']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal for specific opportunity "Register Interest"
  const [activeModalOpp, setActiveModalOpp] = useState<VolunteerOpportunity | null>(null);
  const [modalPhone, setModalPhone] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const skillOptions = [
    'Smartphone Proficiency',
    'Hindi Communication',
    'Two-wheeler mobility',
    'Digital Payments (UPI)',
    'Water quality test kits (FTK)',
    'Document Scanning',
    'Composting & Waste Separation',
    'First Aid & Evacuation'
  ];

  const filteredOpportunities = mockVolunteerOpportunities.filter(opp => {
    if (filterCause !== 'all' && opp.cause !== filterCause) return false;
    if (filterVillage !== 'all' && opp.villageId !== filterVillage) return false;
    return true;
  });

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleGeneralRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (age < 15 || age > 35) {
      setFormError('MY Bharat youth volunteer bracket is age 15–35.');
      return;
    }
    if (!phone.trim() || !/^\+?[0-9]{10,13}$/.test(phone.replace(/[\s-]/g, ''))) {
      setFormError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      saveVolunteerRegistration({
        id: `VOL-REG-${Date.now()}`,
        fullName: fullName.trim(),
        age,
        gender,
        villageId,
        phone: phone.trim(),
        email: email.trim(),
        skills: selectedSkills,
        availability,
        createdAt: new Date().toISOString()
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFullName('');
      setPhone('');
      setEmail('');
    }, 600);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim() || !modalPhone.trim()) return;

    saveVolunteerRegistration({
      id: `VOL-OPP-${Date.now()}`,
      fullName: modalName.trim(),
      age: 22,
      gender: "Not Specified",
      villageId: activeModalOpp?.villageId || mockVillages[0].id,
      phone: modalPhone.trim(),
      email: "",
      skills: activeModalOpp?.requiredSkills || [],
      availability: "Flexible",
      opportunityId: activeModalOpp?.id,
      createdAt: new Date().toISOString()
    });

    setModalSuccess(true);
    setTimeout(() => {
      setModalSuccess(false);
      setActiveModalOpp(null);
      setModalName('');
      setModalPhone('');
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Youth Participation & Volunteering" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <Users className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  MY Bharat Social Innovation Network
                </span>
                <SampleDataBadge label="COMMUNITY PILOT" variant="verified" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Youth Participation, Civic Audits & Volunteering
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Mobilizing rural youth through Ministry of Youth Affairs & Sports' MY Bharat platform. Equipping volunteers with digital literacy, civic audit capabilities, and verified leadership badges.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://mybharat.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#0F2A4A] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>MY Bharat Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Volunteer Governance Note:</strong> All volunteer leaderboards and mission slots displayed are simulated for demonstration. Formal MY Bharat certification is subject to Ministry approval.
            </div>
          </div>
        </div>

        {/* Section 1: Volunteer Registration Form & Active Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Volunteer Registration Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#1B5E3A]" />
              <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                Register as a Gram Sathi Volunteer
              </h2>
            </div>
            <p className="text-xs text-[#5A6B7B] mb-5">
              Join the volunteer brigade for digital literacy drives, ration audits, and flood early warnings.
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-[#1B5E3A]" />
                  <span>Gram Sathi Enrolled Successfully!</span>
                </div>
                <p className="text-emerald-800">
                  Welcome to the Sitapur rural youth network. You will receive notification for upcoming village camps.
                </p>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {formError}
              </div>
            )}

            <form onSubmit={handleGeneralRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age (15–35) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="35"
                    value={age}
                    onChange={e => setAge(parseInt(e.target.value) || 18)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Village Panchayat <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={villageId}
                    onChange={e => setVillageId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                  >
                    {mockVillages.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.block})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                >
                  <option value="Weekends (4-6 hrs)">Weekends (4–6 hrs)</option>
                  <option value="Daily 1-2 hrs">Daily (1–2 hrs evenings)</option>
                  <option value="Seasonal / Monsoon only">Seasonal (Monsoon flood drives only)</option>
                  <option value="On-Call Emergency">On-Call Emergency Redressal</option>
                </select>
              </div>

              {/* Multi-select skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Skills & Interests (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {skillOptions.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-[#1B5E3A] text-white border-[#1B5E3A]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <SensitiveDataNotice compact />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-emerald-200" />
                <span>{isSubmitting ? 'Enrolling Volunteer...' : 'Submit Youth Sathi Application'}</span>
              </button>
            </form>
          </div>

          {/* Volunteer Opportunities Board */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-[#0B1B2B]">
                  Active Civic Missions & Opportunities ({filteredOpportunities.length})
                </h3>
                <p className="text-[11px] text-slate-500">Field assignments coordinated with local Gram Sabhas</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterCause}
                  onChange={e => setFilterCause(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="all">All Causes</option>
                  <option value="digital_literacy">Digital Literacy</option>
                  <option value="flood_prep">Flood Preparedness</option>
                  <option value="ration_assistance">Ration Audit</option>
                  <option value="waste_segregation">Clean Village</option>
                  <option value="road_audit">Road Audit</option>
                </select>

                <select
                  value={filterVillage}
                  onChange={e => setFilterVillage(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="all">All Villages (8)</option>
                  {mockVillages.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOpportunities.map(opp => (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#1B5E3A] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#1B5E3A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {opp.villageName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 font-mono">
                        {opp.slotsAvailable} slots left
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-[#0B1B2B]">
                      {opp.title}
                    </h4>

                    <div className="mt-2 text-xs text-slate-500 space-y-1">
                      <div><strong>Duration:</strong> {opp.duration}</div>
                      <div><strong>Coordinator:</strong> {opp.coordinator}</div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {opp.requiredSkills.map((sk, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 capitalize">
                      {opp.cause.replace('_', ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveModalOpp(opp)}
                      className="px-3 py-1.5 rounded-lg bg-[#0F2A4A] hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      Register Interest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Section 2: Youth Leaderboard & Points Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold font-heading text-[#0B1B2B]">
                  Panchayat Youth Sathi Honor Roll & Leaderboard
                </h2>
              </div>
              <p className="text-xs text-slate-500">Recognizing youth volunteers for road audits, digital literacy hours, and civic monitoring</p>
            </div>
            <SampleDataBadge label="SAMPLE LEADERBOARD" variant="sample" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Volunteer Name</th>
                  <th className="py-3 px-4">Village</th>
                  <th className="py-3 px-4">Total Points</th>
                  <th className="py-3 px-4">Civic Audits Done</th>
                  <th className="py-3 px-4">Digital Literacy (Hours)</th>
                  <th className="py-3 px-4">MY Bharat Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockLeaderboard.map(user => {
                  let rankColor = "text-slate-600 font-bold";
                  if (user.rank === 1) rankColor = "text-amber-500 font-black text-sm";
                  if (user.rank === 2) rankColor = "text-slate-400 font-black text-sm";
                  if (user.rank === 3) rankColor = "text-amber-700 font-black text-sm";

                  return (
                    <tr key={user.rank} className="hover:bg-slate-50/80 transition-colors">
                      <td className={`py-3 px-4 font-mono ${rankColor}`}>
                        #{user.rank}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0B1B2B]">
                        {user.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {user.village}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700 text-sm">
                        {user.points} pts
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {user.issuesAudited}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {user.digitalLiteracyHours} hrs
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {user.badge}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Digital Literacy Curriculum (8 Topics in Accordions) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1B5E3A]" />
                <h2 className="text-lg font-bold font-heading text-[#0B1B2B]">
                  Rural Youth Digital Empowerment Curriculum (8 Modules)
                </h2>
              </div>
              <p className="text-xs text-[#5A6B7B] mt-0.5">
                Standardized open training modules designed for low-resource smartphone literacy in rural habitations.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Total Duration: 5.5 Hours
            </span>
          </div>

          <div className="space-y-3">
            {mockDigitalLiteracyCurriculum.map(item => {
              const isExpanded = expandedCurriculum === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedCurriculum(isExpanded ? null : item.id)}
                    className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <div>
                      <div className="font-heading font-bold text-sm text-[#0B1B2B]">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#1B5E3A] font-hindi">
                        {item.titleHi}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                        {item.duration}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-700 space-y-2">
                      <p className="font-bold text-slate-900">Key Learning Objectives:</p>
                      <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                        {item.modules.map((m, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal for Opportunity Interest Registration */}
      {activeModalOpp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setActiveModalOpp(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#1B5E3A] uppercase tracking-wider block">
                Mission Registration
              </span>
              <h3 className="font-heading font-bold text-base text-[#0B1B2B]">
                {activeModalOpp.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Panchayat: {activeModalOpp.villageName} | Coordinator: {activeModalOpp.coordinator}
              </p>
            </div>

            {modalSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-center text-xs text-emerald-900 space-y-1">
                <CheckCircle className="w-6 h-6 text-[#1B5E3A] mx-auto mb-1" />
                <p className="font-bold">Interest Registered!</p>
                <p>The mission coordinator has been notified.</p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalName}
                    onChange={e => setModalName(e.target.value)}
                    placeholder="e.g. Amit Kumar"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (SMS Contact) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={modalPhone}
                    onChange={e => setModalPhone(e.target.value)}
                    placeholder="e.g. 9839012345"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                    required
                  />
                </div>

                <SensitiveDataNotice compact />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Confirm Mission Enrollment
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
