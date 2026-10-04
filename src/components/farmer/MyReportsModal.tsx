import React from 'react';
import { X, FileText, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import { EvidenceRecord } from '../../types';

interface MyReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: EvidenceRecord[];
  onSelectReport: (report: EvidenceRecord) => void;
}

export const MyReportsModal: React.FC<MyReportsModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">My Damage Claims</h3>
              <p className="text-[11px] text-slate-500">{reports.length} recorded submissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {reports.map(report => (
            <div
              key={report.id}
              onClick={() => {
                onSelectReport(report);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative">
                <img
                  src={report.photos[0]?.url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150'}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-mono text-center text-white py-0.5">
                  {report.damageSeverityPercent}%
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {report.id}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  {report.cropType} • {report.areaAffected} {report.areaUnit}
                </p>

                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      report.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : report.status === 'Inspection Required'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.status}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Hash Verified
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
