import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FarmerApp } from './components/farmer/FarmerApp';
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import {
  INITIAL_EVIDENCE_REPORTS,
  INITIAL_METRICS,
  INITIAL_OFFICER_PROFILE,
} from './data/mockData';
import { EvidenceRecord, DashboardMetrics } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<'mobile' | 'officer' | 'dual'>('mobile');
  const [reports, setReports] = useState<EvidenceRecord[]>(INITIAL_EVIDENCE_REPORTS);
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Sync with full-stack Express API
  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        if (data.reports && data.reports.length > 0) {
          setReports(data.reports);
        }
      })
      .catch(err => {
        console.warn('API backend initial fetch (using client seed):', err);
      });
  }, []);

  // Pending sync count
  const pendingSyncCount = reports.filter(r => r.syncStatus === 'PENDING_SYNC').length;

  // Add new report from farmer flow
  const handleAddReport = async (newReport: EvidenceRecord) => {
    setReports(prev => [newReport, ...prev]);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      totalReports: prev.totalReports + 1,
      newReports: prev.newReports + 1,
      syncedToday: prev.syncedToday + (newReport.syncStatus === 'SYNCED' ? 1 : 0),
      highSeverity:
        newReport.severityLevel === 'High' || newReport.severityLevel === 'Severe'
          ? prev.highSeverity + 1
          : prev.highSeverity,
    }));

    // Post to server if online
    if (isOnline) {
      try {
        await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReport),
        });
      } catch (e) {
        console.error('Failed to post report to backend:', e);
      }
    }
  };

  // Officer action updates report status
  const handleUpdateStatus = async (
    reportId: string,
    newStatus: EvidenceRecord['status'],
    notes?: string,
    modifiedSeverity?: number
  ) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          const updatedSeverity =
            modifiedSeverity !== undefined ? modifiedSeverity : r.damageSeverityPercent;
          return {
            ...r,
            status: newStatus,
            damageSeverityPercent: updatedSeverity,
            auditTrail: [
              ...r.auditTrail,
              {
                id: `aud-${Date.now()}`,
                officerId: INITIAL_OFFICER_PROFILE.id,
                officerName: INITIAL_OFFICER_PROFILE.name,
                action: `Updated status to ${newStatus}. ${notes || ''}`,
                timestamp: new Date().toISOString(),
                notes,
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    // Call server API
    try {
      await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          damageSeverityPercent: modifiedSeverity,
          officerName: INITIAL_OFFICER_PROFILE.name,
          officerId: INITIAL_OFFICER_PROFILE.id,
          actionNotes: notes,
        }),
      });
    } catch (err) {
      console.warn('Server sync error on status update:', err);
    }
  };

  // Sync all offline pending reports
  const handleSyncAll = async () => {
    setIsOnline(true);
    setReports(prev =>
      prev.map(r => (r.syncStatus === 'PENDING_SYNC' ? { ...r, syncStatus: 'SYNCED' } : r))
    );

    // Send each pending report to server
    const pending = reports.filter(r => r.syncStatus === 'PENDING_SYNC');
    for (const rep of pending) {
      try {
        await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rep),
        });
      } catch (err) {
        console.warn('Failed syncing report:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        pendingSyncCount={pendingSyncCount}
        onReplaySplash={() => setShowSplash(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 w-full flex flex-col">
        {/* VIEW 1: FARMER MOBILE APP */}
        {viewMode === 'mobile' && (
          <div className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-slate-950">
            <FarmerApp
              reports={reports}
              onAddReport={handleAddReport}
              onSelectReport={report => {
                // When selecting report in mobile view, opens modal
              }}
              isOnline={isOnline}
              onToggleOnline={() => setIsOnline(!isOnline)}
              pendingSyncCount={pendingSyncCount}
              onSyncAll={handleSyncAll}
              showSplash={showSplash}
              setShowSplash={setShowSplash}
            />
          </div>
        )}

        {/* VIEW 2: OFFICER GIS COMMAND CENTER */}
        {viewMode === 'officer' && (
          <OfficerDashboard
            reports={reports}
            metrics={metrics}
            officerProfile={INITIAL_OFFICER_PROFILE}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {/* VIEW 3: DUAL MODE (HACKATHON / PRESENTATION VIEW) */}
        {viewMode === 'dual' && (
          <div className="flex-1 p-3 sm:p-6 bg-slate-950">
            <div className="max-w-[1680px] mx-auto flex flex-col xl:flex-row gap-6 items-start justify-center">
              {/* Left Side: Farmer Mobile View */}
              <div className="w-full xl:w-[460px] shrink-0 flex flex-col items-center">
                <div className="mb-2 text-center">
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                    Farmer Mobile App
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Offline capture & instant tamper-evident packaging
                  </p>
                </div>
                <FarmerApp
                  reports={reports}
                  onAddReport={handleAddReport}
                  onSelectReport={() => {}}
                  isOnline={isOnline}
                  onToggleOnline={() => setIsOnline(!isOnline)}
                  pendingSyncCount={pendingSyncCount}
                  onSyncAll={handleSyncAll}
                  showSplash={showSplash}
                  setShowSplash={setShowSplash}
                />
              </div>

              {/* Right Side: Officer GIS Dashboard */}
              <div className="w-full xl:flex-1 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                <div className="bg-slate-900 px-5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">
                    Officer GIS Command Center
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Real-time SAR radar & AI verification pipeline
                  </span>
                </div>
                <OfficerDashboard
                  reports={reports}
                  metrics={metrics}
                  officerProfile={INITIAL_OFFICER_PROFILE}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
