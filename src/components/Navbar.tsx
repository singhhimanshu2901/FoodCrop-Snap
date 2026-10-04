import React from 'react';
import {
  Smartphone,
  Monitor,
  LayoutGrid,
  Wifi,
  WifiOff,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Droplets,
} from 'lucide-react';

interface NavbarProps {
  viewMode: 'mobile' | 'officer' | 'dual';
  setViewMode: (mode: 'mobile' | 'officer' | 'dual') => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  pendingSyncCount: number;
  onReplaySplash: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  isOnline,
  setIsOnline,
  pendingSyncCount,
  onReplaySplash,
}) => {
  return (
    <header id="app-navbar" className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
            <Droplets className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                FloodCrop <span className="text-emerald-400">Snap</span>
              </span>
              <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SAR & AI Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Capture Early. Verify Faster. Recover Sooner.
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
          <button
            id="nav-mobile-btn"
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'mobile'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Farmer Mobile App Simulator"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Farmer App</span>
          </button>

          <button
            id="nav-officer-btn"
            onClick={() => setViewMode('officer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'officer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Officer GIS Command Center"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Officer GIS</span>
          </button>

          <button
            id="nav-dual-btn"
            onClick={() => setViewMode('dual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'dual'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Dual Screen Hackathon Presentation View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dual Mode</span>
          </button>
        </div>

        {/* Right Tools: Connectivity simulator, Replay splash, Status */}
        <div className="flex items-center gap-2">
          {/* Offline / Online Simulation Toggle */}
          <button
            id="network-toggle-btn"
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
              isOnline
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
            }`}
            title={isOnline ? 'Online (Click to simulate offline mode)' : 'Offline (Click to simulate reconnecting)'}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">Offline ({pendingSyncCount})</span>
              </>
            )}
          </button>

          {/* Replay Splash button */}
          <button
            id="replay-splash-btn"
            onClick={onReplaySplash}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
            title="Replay Splash Screen Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Splash</span>
          </button>

          {/* Security Hash Badge */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SHA-256 Tamper Protected</span>
          </div>
        </div>
      </div>
    </header>
  );
};
