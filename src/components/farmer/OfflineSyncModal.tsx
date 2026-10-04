import React, { useState } from 'react';
import { X, CloudUpload, RefreshCw, CheckCircle2, Wifi, WifiOff, Database } from 'lucide-react';
import { EvidenceRecord } from '../../types';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingReports: EvidenceRecord[];
  onSyncAll: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  isOpen,
  onClose,
  pendingReports,
  onSyncAll,
  isOnline,
  onToggleOnline,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSync = async () => {
    if (!isOnline) {
      onToggleOnline();
    }
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    onSyncAll();
    setIsSyncing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <CloudUpload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Offline Sync Queue</h3>
              <p className="text-[11px] text-slate-500">Local SQLite / IndexedDB buffer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Network Status Toggle */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-600" />
            )}
            <span className="text-xs font-bold text-slate-800">
              Network Status: {isOnline ? 'Connected' : 'Offline Mode Active'}
            </span>
          </div>
          <button
            onClick={onToggleOnline}
            className="text-[11px] font-bold text-emerald-700 hover:underline"
          >
            {isOnline ? 'Simulate Disconnect' : 'Reconnect Online'}
          </button>
        </div>

        {/* Pending Items */}
        <div className="p-5 space-y-3 max-h-60 overflow-y-auto">
          {pendingReports.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">All Reports Fully Synced!</p>
              <p className="text-[11px] text-slate-500">
                Any evidence recorded while disconnected from the tower will queue safely here.
              </p>
            </div>
          ) : (
            pendingReports.map(report => (
              <div
                key={report.id}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 font-mono">{report.id}</p>
                  <p className="text-[11px] text-slate-600">
                    {report.cropType} • {report.damageSeverityPercent}% Loss
                  </p>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Pending Upload
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleSync}
            disabled={isSyncing || pendingReports.length === 0}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {isSyncing
                ? 'Uploading Evidence Packets & Photos...'
                : `Sync All Queued Reports (${pendingReports.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
