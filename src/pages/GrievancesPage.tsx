import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Building,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Language, Grievance, IssueStatus } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { mockVillages } from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { CivicBarChart, CivicDonutChart } from '../components/common/CivicChart';
import { getAllGrievances } from '../utils/storage';

interface GrievancesPageProps {
  onNavigate: (path: string) => void;
  language: Language;
}

export const GrievancesPage: React.FC<GrievancesPageProps> = ({ onNavigate, language }) => {
  const t = language === 'hi' ? hi : en;
  const grievances = getAllGrievances();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVillage, setFilterVillage] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'public_list' | 'admin_dashboard'>('public_list');

  const filteredGrievances = grievances.filter(g => {
    if (filterCategory !== 'all' && g.category !== filterCategory) return false;
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    if (filterVillage !== 'all' && g.villageId !== filterVillage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.id.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.villageName.toLowerCase().includes(q) ||
        g.assignedDepartment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate status counts
  const total = grievances.length;
  const resolvedCount = grievances.filter(g => g.status === 'resolved').length;
  const inProgressCount = grievances.filter(g => g.status === 'in_progress').length;
  const assignedCount = grievances.filter(g => g.status === 'assigned').length;
  const acknowledgedCount = grievances.filter(g => g.status === 'acknowledged').length;
  const receivedCount = grievances.filter(g => g.status === 'received').length;

  // Chart data
  const categoryBarData = [
    { label: 'Roads', value: grievances.filter(g => g.category === 'roads').length, color: '#1B5E3A' },
    { label: 'Water', value: grievances.filter(g => g.category === 'water').length, color: '#1565C0' },
    { label: 'Sanitation', value: grievances.filter(g => g.category === 'sanitation').length, color: '#0F766E' },
    { label: 'Lighting', value: grievances.filter(g => g.category === 'lighting').length, color: '#D97706' },
    { label: 'Flood', value: grievances.filter(g => g.category === 'flood').length, color: '#2563EB' },
    { label: 'Ration', value: grievances.filter(g => g.category === 'ration').length, color: '#DC2626' }
  ];

  const statusDonutData = [
    { label: 'Resolved', value: resolvedCount, color: '#1E8E5A' },
    { label: 'In Progress', value: inProgressCount, color: '#E6A700' },
    { label: 'Assigned', value: assignedCount, color: '#1565C0' },
    { label: 'Acknowledged', value: acknowledgedCount, color: '#8B5CF6' },
    { label: 'Received', value: receivedCount, color: '#64748B' }
  ];

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Public Grievances & Redressal" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-red-100 text-red-700">
                  <FileText className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                  Core Citizen Redressal Architecture
                </span>
                <SampleDataBadge label="PUBLIC AUDIT TRAIL" variant="live" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Public Grievance Redressal & SLA Tracking
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Every village grievance is registered with a tamper-evident tracking ID (GS360-YYYY-XXXXXX), routed to the respective department with clear time-bound milestones, and audited transparently in public view.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/grievances/track')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2A4A] text-xs font-bold transition-colors"
              >
                Track by ID
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/grievances/report')}
                className="px-5 py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span>File New Grievance (4 Steps)</span>
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Departmental Boundary Notice:</strong> Official complaint registration with legally binding statutory consequence requires integration with state departmental grievance systems (e.g. CPGRAMS / IGRS Jan Sunwai). Records on this demonstration portal are simulated for MY Bharat review.
            </div>
          </div>
        </div>

        {/* Tab Switcher: Public Grievance Ledger vs. Admin Analytics */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('public_list')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'public_list'
                  ? 'bg-[#1B5E3A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Public Grievances Ledger ({filteredGrievances.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin_dashboard')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'admin_dashboard'
                  ? 'bg-[#0F2A4A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Panchayat SLA Analytics (View-Only Admin)
            </button>
          </div>

          <SampleDataBadge label="ALL 30+ SAMPLE RECORDS" variant="sample" />
        </div>

        {/* TAB 1: Public Ledger View */}
        {activeTab === 'public_list' && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by ID (GS360...), keywords, village, department..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#0B1B2B] focus:ring-2 focus:ring-[#1B5E3A]"
                />
              </div>

              {/* Dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="roads">Roads & Drainage</option>
                  <option value="water">Drinking Water</option>
                  <option value="sanitation">Sanitation & Waste</option>
                  <option value="lighting">Streetlights & Solar</option>
                  <option value="flood">Flood & Culverts</option>
                  <option value="ration">Ration & PDS</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="received">Received</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={filterVillage}
                  onChange={e => setFilterVillage(e.target.value)}
                  className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  aria-label="Filter by village"
                >
                  <option value="all">All Villages (8)</option>
                  {mockVillages.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grievances Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGrievances.map(g => {
                let statusBadge = "bg-slate-100 text-slate-700 border-slate-200";
                if (g.status === 'resolved') statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-300";
                if (g.status === 'in_progress') statusBadge = "bg-amber-100 text-amber-900 border-amber-300";
                if (g.status === 'assigned') statusBadge = "bg-blue-100 text-blue-900 border-blue-300";

                let sevBadge = "bg-slate-100 text-slate-600";
                if (g.severity === 'critical') sevBadge = "bg-rose-100 text-rose-800";
                if (g.severity === 'high') sevBadge = "bg-amber-100 text-amber-800";

                return (
                  <div
                    key={g.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#1B5E3A] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-[#1B5E3A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {g.id}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${sevBadge}`}>
                            {g.severity}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadge}`}>
                          {g.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-sm text-[#0B1B2B] line-clamp-2">
                        {g.title}
                      </h3>

                      <p className="text-xs text-[#5A6B7B] mt-2 line-clamp-2 leading-relaxed">
                        {g.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] space-y-2">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="text-slate-700">{g.villageName}</strong>
                        </span>
                        <span className="font-mono">{g.createdAt}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="truncate max-w-[220px]">
                          <strong>Dept:</strong> {g.assignedDepartment}
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/grievances/track?id=${g.id}`)}
                          className="font-bold text-[#1B5E3A] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>Track Milestone</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredGrievances.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-base text-[#0B1B2B]">No Grievances Match Search</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting the category or village filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('all');
                    setFilterStatus('all');
                    setFilterVillage('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-[#0B1B2B]"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Admin SLA Analytics (View-Only) */}
        {activeTab === 'admin_dashboard' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
              <div>
                <strong>Panchayat Development & Grievance SLA Monitor (View-Only Admin):</strong> Demonstrating high-level executive dashboard view for Block Development Officers (BDOs) and District Magistrates.
              </div>
              <SampleDataBadge label="OFFICIAL DEMO" variant="demo" />
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">Total Inflow</span>
                <span className="text-2xl font-bold font-heading text-[#0B1B2B]">{total}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">100% audited</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">Resolved (Closed)</span>
                <span className="text-2xl font-bold font-heading text-[#1E8E5A]">{resolvedCount}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">{Math.round((resolvedCount / total) * 100)}% resolution rate</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">Under Action</span>
                <span className="text-2xl font-bold font-heading text-[#E6A700]">{inProgressCount}</span>
                <span className="text-[10px] text-amber-700 block mt-0.5">Crews on-site</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">Dispatched / Assigned</span>
                <span className="text-2xl font-bold font-heading text-[#1565C0]">{assignedCount}</span>
                <span className="text-[10px] text-blue-700 block mt-0.5">JE assigned</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
                <span className="text-xs text-slate-500 block">Average Turnaround</span>
                <span className="text-2xl font-bold font-heading text-[#0F2A4A]">64 hrs</span>
                <span className="text-[10px] text-purple-700 block mt-0.5">Within 72h SLA target</span>
              </div>
            </div>

            {/* Recharts / Custom Civic Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <CivicBarChart
                  data={categoryBarData}
                  title="Grievances Inflow by Departmental Category"
                  unit="cases"
                  height={220}
                />
              </div>
              <div className="lg:col-span-5">
                <CivicDonutChart
                  data={statusDonutData}
                  title="SLA Lifecycle Distribution"
                  centerLabel={`${total}`}
                  centerSub="All Cases"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
