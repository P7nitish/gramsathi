import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Droplets,
  Trash2,
  Sun,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { Language, Village } from '../types';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import {
  mockVillages,
  mockFloodSensors,
  mockWasteBins,
  mockStreetlights
} from '../mockData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { CivicBarChart, CivicDonutChart, CivicTrendChart } from '../components/common/CivicChart';
import { getAllGrievances } from '../utils/storage';
import { calculateDashboardStats, generateVillageReportCSV, downloadTextFile } from '../utils/logic';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  language: Language;
  initialVillageId?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  language,
  initialVillageId = 'all'
}) => {
  const t = language === 'hi' ? hi : en;
  const [selectedVillageId, setSelectedVillageId] = useState<string>(initialVillageId);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const grievances = getAllGrievances();
  const selectedVillageObj = mockVillages.find(v => v.id === selectedVillageId);

  const stats = calculateDashboardStats(
    selectedVillageId,
    mockVillages,
    grievances,
    mockFloodSensors,
    mockWasteBins,
    mockStreetlights
  );

  // Category Bar chart data
  const barData = [
    { label: 'Roads', value: stats.categoryCounts.roads, color: '#1B5E3A' },
    { label: 'Water', value: stats.categoryCounts.water, color: '#1565C0' },
    { label: 'Sanitation', value: stats.categoryCounts.sanitation, color: '#0F766E' },
    { label: 'Lighting', value: stats.categoryCounts.lighting, color: '#D97706' },
    { label: 'Flood', value: stats.categoryCounts.flood, color: '#2563EB' },
    { label: 'Ration', value: stats.categoryCounts.ration, color: '#DC2626' }
  ];

  // Status Donut chart data
  const donutData = [
    { label: 'Resolved', value: stats.resolvedGrievances, color: '#1E8E5A' },
    { label: 'In Progress', value: stats.inProgressGrievances, color: '#E6A700' },
    { label: 'Pending / Triage', value: stats.pendingGrievances, color: '#64748B' }
  ];

  // 6-Month Trend Data
  const trendData = [
    { month: 'May', reported: 18, resolved: 14 },
    { month: 'Jun', reported: 24, resolved: 20 },
    { month: 'Jul', reported: 32, resolved: 27 },
    { month: 'Aug', reported: 38, resolved: 33 },
    { month: 'Sep', reported: 29, resolved: 26 },
    { month: 'Oct', reported: stats.totalGrievances, resolved: stats.resolvedGrievances }
  ];

  const handleDownloadCSV = () => {
    const targetName = selectedVillageObj ? selectedVillageObj.name : "All Sitapur Pilot Panchayats";
    const filteredGrievances = selectedVillageId === 'all'
      ? grievances
      : grievances.filter(g => g.villageId === selectedVillageId);

    const csvContent = generateVillageReportCSV(targetName, filteredGrievances);
    const filename = `GS360_Civic_Report_${selectedVillageId === 'all' ? 'All_Villages' : selectedVillageObj?.name.replace(/\s+/g, '_')}_2026.csv`;
    downloadTextFile(filename, csvContent);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Village Progress Dashboard" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Header & Village Selector */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-emerald-100 text-[#1B5E3A]">
                  <BarChart3 className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-[#1B5E3A] uppercase tracking-wider">
                  Gram Panchayat Accountability Analytics
                </span>
                <SampleDataBadge label="SAMPLE DATA" variant="sample" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
                Village Development Progress & Service Delivery
              </h1>
              <p className="text-sm text-[#5A6B7B] mt-1 max-w-3xl">
                Aggregated performance indicators covering grievance resolution rates, flood sensor warnings, smart waste bin clearances, and public streetlight uptime.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Village selector dropdown */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <Building className="w-4 h-4 text-slate-500" />
                <select
                  value={selectedVillageId}
                  onChange={e => setSelectedVillageId(e.target.value)}
                  className="text-xs font-bold text-[#0B1B2B] bg-transparent focus:outline-hidden"
                  aria-label="Filter dashboard by village"
                >
                  <option value="all">All Pilot Panchayats (8 Villages)</option>
                  {mockVillages.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.nameHi})</option>
                  ))}
                </select>
              </div>

              {/* Working CSV Download Button */}
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="px-4 py-2 rounded-xl bg-[#0F2A4A] hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
                aria-label="Download sample civic progress CSV report"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>{downloadSuccess ? 'CSV Exported!' : 'Download Sample CSV'}</span>
              </button>
            </div>
          </div>

          {/* Mandatory Baseline Notice Banner */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Sample Baseline Disclaimer:</strong> All data shown is sample data. Baselines and quantitative targets to be finalized during formal project planning with district administration.
            </div>
          </div>
        </div>

        {/* Section 1: KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Grievances Audited</span>
              <FileSpreadsheet className="w-4 h-4 text-[#1B5E3A]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
              {stats.totalGrievances}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              {stats.resolvedGrievances} closed ({stats.resolutionRate}%)
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Flood Risk Sensors</span>
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
              {stats.totalSensors}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">
              {stats.criticalSensors} Critical / {stats.warningSensors} Warning
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Smart Waste Bins</span>
              <Trash2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
              {stats.totalBins}
            </div>
            <div className="text-[11px] text-rose-700 font-semibold mt-1">
              {stats.fullBins} Bins at capacity (&gt;85%)
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Solar & Grid Poles</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
              {stats.totalLights}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold mt-1">
              {stats.faultyLights} Poles under maintenance
            </div>
          </div>
        </div>

        {/* Section 2: Charts: Category (Bar), Status (Donut), Trend (Line) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <CivicBarChart
              data={barData}
              title="Grievance Volume by Civic Infrastructure Category"
              unit="cases"
              height={230}
            />
          </div>

          <div className="lg:col-span-5">
            <CivicDonutChart
              data={donutData}
              title="Resolution Status Distribution"
              centerLabel={`${stats.resolutionRate}%`}
              centerSub="Resolved"
            />
          </div>
        </div>

        {/* 6-Month Resolution Trend Line Chart */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
          <CivicTrendChart
            data={trendData}
            title="6-Month Redressal Trend: Reported vs. Resolved Cases"
            height={220}
          />
        </div>

        {/* Section 3: Village Development Milestones */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold font-heading text-[#0B1B2B]">
                Panchayat Development Milestones & Social Audit Schedule
              </h2>
              <p className="text-xs text-slate-500">Key targets tracked under the Gram Panchayat Development Plan (GPDP)</p>
            </div>
            <SampleDataBadge label="ANNUAL GPDP" variant="sample" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                COMPLETED
              </span>
              <h4 className="font-bold text-slate-900">Baseline IoT Gauge Installation</h4>
              <p className="text-slate-600 text-[11px]">
                15 solar ultrasonic river and canal discharge staff gauges calibrated and transmitting telemetry.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                COMPLETED
              </span>
              <h4 className="font-bold text-slate-900">Fair Price Shop Calibration</h4>
              <p className="text-slate-600 text-[11px]">
                Digital scales integrated with e-PoS machines across all 4 pilot fair price shops in Sitapur.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                IN PROGRESS
              </span>
              <h4 className="font-bold text-slate-900">Pre-Monsoon Culvert Desilting</h4>
              <p className="text-slate-600 text-[11px]">
                Cleanout of 18 Hume pipe culvert bridges along PMGSY connecting corridors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
              <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                SCHEDULED (NOV 2026)
              </span>
              <h4 className="font-bold text-slate-900">Bi-Annual Gram Sabha Social Audit</h4>
              <p className="text-slate-600 text-[11px]">
                Public reading and verification of expenditure vouchers and civic complaints before villagers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
