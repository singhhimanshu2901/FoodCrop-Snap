import React, { useState } from 'react';
import { SplashScreen } from './SplashScreen';
import { Onboarding } from './Onboarding';
import { FarmerDashboard } from './FarmerDashboard';
import { ReportWizard } from './ReportWizard';
import { MyReportsModal } from './MyReportsModal';
import { OfflineSyncModal } from './OfflineSyncModal';
import { EvidenceGuideModal } from './EvidenceGuideModal';
import { EvidenceRecord } from '../../types';

interface FarmerAppProps {
  reports: EvidenceRecord[];
  onAddReport: (report: EvidenceRecord) => void;
  onSelectReport: (report: EvidenceRecord) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onSyncAll: () => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
}

export const FarmerApp: React.FC<FarmerAppProps> = ({
  reports,
  onAddReport,
  onSelectReport,
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onSyncAll,
  showSplash,
  setShowSplash,
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showMyReports, setShowMyReports] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-6 w-full">
      {/* Smartphone Device Frame Container */}
      <div
        id="farmer-phone-mockup"
        className="w-full max-w-[420px] h-[780px] sm:h-[840px] bg-slate-950 rounded-[48px] p-3 sm:p-3.5 shadow-2xl shadow-slate-950/60 border-[6px] sm:border-[8px] border-slate-800 relative flex flex-col overflow-hidden"
      >
        {/* Phone Dynamic Island / Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-40 flex items-center justify-center border border-slate-800/80 shadow-xs">
          <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800 mr-2" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Screen Inner Bezel */}
        <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden relative flex flex-col select-none pt-7">
          {showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : showOnboarding ? (
            <Onboarding onComplete={() => setShowOnboarding(false)} />
          ) : showWizard ? (
            <ReportWizard
              onBack={() => setShowWizard(false)}
              onSubmitReport={newReport => {
                onAddReport(newReport);
              }}
              isOnline={isOnline}
            />
          ) : (
            <FarmerDashboard
              onStartReport={() => setShowWizard(true)}
              onViewMyReports={() => setShowMyReports(true)}
              onOpenSyncModal={() => setShowSyncModal(true)}
              onOpenGuideModal={() => setShowGuideModal(true)}
              onSelectReport={onSelectReport}
              reports={reports}
              isOnline={isOnline}
              pendingSyncCount={pendingSyncCount}
            />
          )}

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/60 rounded-full z-30 pointer-events-none" />
        </div>
      </div>

      {/* Auxiliary Modals */}
      <MyReportsModal
        isOpen={showMyReports}
        onClose={() => setShowMyReports(false)}
        reports={reports}
        onSelectReport={onSelectReport}
      />

      <OfflineSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        pendingReports={reports.filter(r => r.syncStatus === 'PENDING_SYNC')}
        onSyncAll={onSyncAll}
        isOnline={isOnline}
        onToggleOnline={onToggleOnline}
      />

      <EvidenceGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
};
