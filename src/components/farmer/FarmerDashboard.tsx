import React from 'react';
import {
  Camera,
  MapPin,
  Clock,
  Wifi,
  WifiOff,
  ChevronRight,
  FileText,
  CloudUpload,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { EvidenceRecord } from '../../types';

interface FarmerDashboardProps {
  onStartReport: () => void;
  onViewMyReports: () => void;
  onOpenSyncModal: () => void;
  onOpenGuideModal: () => void;
  onSelectReport: (report: EvidenceRecord) => void;
  reports: EvidenceRecord[];
  isOnline: boolean;
  pendingSyncCount: number;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onStartReport,
  onViewMyReports,
  onOpenSyncModal,
  onOpenGuideModal,
  onSelectReport,
  reports,
  isOnline,
  pendingSyncCount,
}) => {
  const recentReport = reports[0];

  return (
    <div
      id="farmer-home-dashboard"
      className="relative w-full h-full min-h-[640px] flex flex-col justify-between bg-slate-50 text-slate-900 pb-6"
    >
      {/* Top Header Card with User & Location */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Good Morning,
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              Ramesh Kumar
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span>Village: Rampur</span>
              <span>•</span>
              <span>Block: Sitapur</span>
              <span>•</span>
              <span>Lakhimpur</span>
            </p>
          </div>

          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-emerald-500/80 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=140&auto=format&fit=crop&q=80"
                alt="Farmer profile avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400" />
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Offline Mode</span>
              </>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>GPS Locked (±8m)</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Kisan ID: 882190</span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 px-5 pt-5 space-y-5 overflow-y-auto">
        {/* Big Primary Action: Report Crop Damage */}
        <button
          id="btn-start-report"
          onClick={onStartReport}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white shadow-xl shadow-emerald-700/20 active:scale-[0.98] transition-all duration-200 text-left border border-emerald-500/30"
        >
          {/* Subtle geometric background ring */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute right-4 top-4 p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
            <Camera className="w-7 h-7" />
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/25 text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-2">
            Priority Action
          </span>
          <h3 className="text-xl font-black tracking-tight mb-1">
            Report Crop Damage
          </h3>
          <p className="text-xs text-emerald-100/90 font-medium max-w-[220px] leading-relaxed">
            Capture photos & location for instant AI verification and officer relief docket.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/20">
            <span>Start a new report</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 4 Feature Action Grid Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-my-reports"
            onClick={onViewMyReports}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">My Reports</span>
            <span className="text-[11px] text-slate-500">{reports.length} claims submitted</span>
          </button>

          <button
            id="btn-pending-sync"
            onClick={onOpenSyncModal}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all text-left relative"
          >
            {pendingSyncCount > 0 && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-xs">
                {pendingSyncCount}
              </span>
            )}
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <CloudUpload className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Pending Sync</span>
            <span className="text-[11px] text-slate-500">
              {pendingSyncCount > 0 ? `${pendingSyncCount} offline waiting` : 'All synced'}
            </span>
          </button>

          <button
            id="btn-evidence-guide"
            onClick={onOpenGuideModal}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Evidence Guide</span>
            <span className="text-[11px] text-slate-500">Photo & survey tips</span>
          </button>

          <button
            id="btn-help-support"
            onClick={() => {
              window.alert('Kisan Helpline: 1800-180-1551 (Toll Free). Agricultural officer Sitapur: +91 94567 89012');
            }}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Help & Support</span>
            <span className="text-[11px] text-slate-500">Kisan Call 1800-180-1551</span>
          </button>
        </div>

        {/* Recent Reports List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recent Reports
            </h4>
            <button
              onClick={onViewMyReports}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View All
            </button>
          </div>

          {recentReport ? (
            <div
              onClick={() => onSelectReport(recentReport)}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative">
                <img
                  src={recentReport.photos[0]?.url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150'}
                  alt="Report thumbnail"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/75 text-[9px] font-mono text-center text-white py-0.5">
                  {recentReport.damageSeverityPercent}%
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 font-mono truncate">
                    {recentReport.id}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    2h ago
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  {recentReport.eventType} • <span className="text-emerald-700 font-semibold">{recentReport.cropType}</span>
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Synced
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {recentReport.status}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-slate-500 text-xs">
              No reports created yet. Tap "Report Crop Damage" above to start!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
