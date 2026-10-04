import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { EvidenceRecord } from '../../types';

interface RecentReportsFeedProps {
  reports: EvidenceRecord[];
  onSelectReport: (report: EvidenceRecord) => void;
  onViewAll?: () => void;
}

export const RecentReportsFeed: React.FC<RecentReportsFeedProps> = ({
  reports,
  onSelectReport,
  onViewAll,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Inspection Required':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id="officer-recent-reports-feed"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Recent Reports
        </h4>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View All
        </button>
      </div>

      {/* Reports Stack */}
      <div className="space-y-2.5">
        {reports.slice(0, 4).map(report => (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 bg-white"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                <img
                  src={report.photos[0]?.url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150'}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900 truncate">
                    {report.id}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    just now
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {report.cropType} • <span className="text-red-600 font-bold">{report.damageSeverityPercent}%</span> • {report.severityLevel}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {report.village}, {report.district}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(
                  report.status
                )}`}
              >
                {report.status === 'Approved' ? 'Verified' : report.status}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
