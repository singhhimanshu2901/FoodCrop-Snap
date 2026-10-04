import React, { useState } from 'react';
import {
  FileText,
  Clock,
  AlertTriangle,
  ClipboardCheck,
  CheckCircle2,
  Filter,
  Calendar,
  Search,
  ArrowUpDown,
  Download,
  ShieldCheck,
  Droplets,
  Layers,
} from 'lucide-react';
import { EvidenceRecord, DashboardMetrics, OfficerProfile } from '../../types';
import { OfficerSidebar } from './OfficerSidebar';
import { GisMap } from './GisMap';
import { SatelliteComparisonSlider } from './SatelliteComparisonSlider';
import { RecentReportsFeed } from './RecentReportsFeed';
import { CropLossChart } from './CropLossChart';
import { ReportDetailModal } from './ReportDetailModal';

interface OfficerDashboardProps {
  reports: EvidenceRecord[];
  metrics: DashboardMetrics;
  officerProfile: OfficerProfile;
  onUpdateStatus: (
    reportId: string,
    status: EvidenceRecord['status'],
    notes?: string,
    modifiedSeverity?: number
  ) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  reports,
  metrics,
  officerProfile,
  onUpdateStatus,
}) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 7 days');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<EvidenceRecord | null>(null);

  // Filtered reports
  const filteredReports = reports.filter(r => {
    if (selectedDistrict !== 'All Districts' && !r.district.includes(selectedDistrict)) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.farmerName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.village.toLowerCase().includes(q) ||
        r.cropType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="officer-gis-dashboard-layout" className="flex w-full min-h-screen bg-slate-100 text-slate-900">
      {/* Sidebar Navigation */}
      <OfficerSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        officerProfile={officerProfile}
        unreadNotifications={12}
      />

      {/* Main Command Center Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-wrap gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time crop damage assessment, SAR radar verification, and fast-track relief dockets
            </p>
          </div>

          {/* Filter Dropdowns matching Mockup */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Time Filter */}
            <div className="relative">
              <select
                value={selectedTimeRange}
                onChange={e => setSelectedTimeRange(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Today">Today</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Monsoon Season 2026">Monsoon Season 2026</option>
              </select>
            </div>

            {/* District Filter */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Districts">All Districts</option>
                <option value="Sitapur">Sitapur</option>
                <option value="Lakhimpur Kheri">Lakhimpur Kheri</option>
                <option value="Hardoi">Hardoi</option>
                <option value="Barabanki">Barabanki</option>
              </select>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Rendering */}
        <div className="p-6 space-y-6 flex-1">
          {/* Top 5 Metric Cards (Exactly as depicted in mockup) */}
          <section id="officer-metrics-row" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Card 1: New Reports */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {metrics.totalReports.toLocaleString()}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">New Reports</p>
              </div>
            </div>

            {/* Card 2: Under Review */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {metrics.underReview.toLocaleString()}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">Under Review</p>
              </div>
            </div>

            {/* Card 3: High Severity */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {metrics.highSeverity.toLocaleString()}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">High Severity</p>
              </div>
            </div>

            {/* Card 4: Inspection Required */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {metrics.inspectionRequired.toLocaleString()}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">Inspection Required</p>
              </div>
            </div>

            {/* Card 5: Synced Today */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {metrics.syncedToday.toLocaleString()}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">Synced Today</p>
              </div>
            </div>
          </section>

          {/* Main Content Area (Layout mirrors mockup) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col (7 of 12): Interactive GIS Map */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Live GIS Inundation Map & Geotagged Parcels</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                    {filteredReports.length} Active Pins
                  </span>
                </div>

                <GisMap
                  reports={filteredReports}
                  selectedReport={selectedReport}
                  onSelectReport={setSelectedReport}
                />
              </div>

              {/* Reports Table Summary beneath Map */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recent Flood Damage Submissions
                  </h4>
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search farmer, village..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                        <th className="py-2 px-2">ID</th>
                        <th className="py-2 px-2">Farmer</th>
                        <th className="py-2 px-2">Crop</th>
                        <th className="py-2 px-2">Damage %</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredReports.slice(0, 5).map(r => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-2 font-mono font-bold text-slate-800">{r.id}</td>
                          <td className="py-2 px-2 text-slate-900">{r.farmerName}</td>
                          <td className="py-2 px-2 text-slate-700">{r.cropType}</td>
                          <td className="py-2 px-2">
                            <span className="font-bold text-red-600">{r.damageSeverityPercent}%</span>
                            <span className="text-[10px] text-slate-400 ml-1">({r.severityLevel})</span>
                          </td>
                          <td className="py-2 px-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                r.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : r.status === 'Inspection Required'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <button
                              onClick={() => setSelectedReport(r)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Col (5 of 12): Satellite Slider, Crop Loss, Recent Reports */}
            <div className="lg:col-span-5 space-y-4">
              {/* Satellite Comparison Slider (Before/After Flood) */}
              <SatelliteComparisonSlider />

              {/* Damage Reports by Crop Bar Chart */}
              <CropLossChart onViewAnalytics={() => setCurrentTab('analytics')} />

              {/* Recent Reports Live Stream */}
              <RecentReportsFeed
                reports={filteredReports}
                onSelectReport={setSelectedReport}
                onViewAll={() => setCurrentTab('reports')}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Deep Inspection Drawer / Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};
