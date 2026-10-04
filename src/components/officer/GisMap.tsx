import React, { useState } from 'react';
import { Layers, Plus, Minus, Maximize2, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import { EvidenceRecord } from '../../types';

interface GisMapProps {
  reports: EvidenceRecord[];
  selectedReport: EvidenceRecord | null;
  onSelectReport: (report: EvidenceRecord) => void;
}

export const GisMap: React.FC<GisMapProps> = ({
  reports,
  selectedReport,
  onSelectReport,
}) => {
  const [mapType, setMapType] = useState<'map' | 'satellite'>('satellite');
  const [zoomLevel, setZoomLevel] = useState(1);

  const getMarkerColor = (severity: string, status: string) => {
    if (status === 'Inspection Required') return '#a855f7'; // purple
    if (severity === 'Severe' || severity === 'High') return '#ef4444'; // red
    if (severity === 'Medium') return '#f59e0b'; // amber
    return '#10b981'; // emerald green
  };

  return (
    <div
      id="gis-interactive-map"
      className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 select-none group"
    >
      {/* Background Raster */}
      <img
        src={
          mapType === 'satellite'
            ? 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1400&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&auto=format&fit=crop&q=80'
        }
        alt="GIS Base Map"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
        style={{ transform: `scale(${zoomLevel})` }}
      />

      {/* Flood Extent Inundation Overlays (Blue translucent flood polygon shapes) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
        <defs>
          <radialGradient id="floodGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#0369a1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* River flood plain polygon 1 */}
        <polygon
          points="60,180 180,120 340,160 480,240 380,310 220,330 90,260"
          fill="url(#floodGrad)"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        {/* Secondary tributary polygon */}
        <polygon
          points="420,60 520,40 680,110 590,180 470,140"
          fill="url(#floodGrad)"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
      </svg>

      {/* Top Map / Satellite Toggle */}
      <div className="absolute top-4 left-4 z-20 flex items-center bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg">
        <button
          onClick={() => setMapType('map')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mapType === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mapType === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Top Right Legend */}
      <div className="absolute top-4 right-4 z-20 bg-slate-900/85 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-lg text-[11px] space-y-1.5 hidden sm:block">
        <div className="flex items-center gap-2 text-slate-200 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs shadow-red-500/50" />
          <span>High Severity (51-100%)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50" />
          <span>Medium (26-50%)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
          <span>Low (0-25%)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs shadow-purple-500/50" />
          <span>Inspection Required</span>
        </div>
      </div>

      {/* Interactive Report Pins */}
      {reports.map((report, idx) => {
        // Distribute markers naturally across map space
        const positions = [
          { top: '48%', left: '46%' }, // Ramesh Kumar
          { top: '35%', left: '30%' }, // Suresh Yadav
          { top: '65%', left: '60%' }, // Balram Singh
          { top: '55%', left: '72%' }, // Ramvati Devi
          { top: '25%', left: '52%' }, // Dharmendra Yadav
        ];
        const pos = positions[idx % positions.length];
        const isSelected = selectedReport?.id === report.id;
        const color = getMarkerColor(report.severityLevel, report.status);

        return (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            style={{ top: pos.top, left: pos.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
          >
            {/* Pulse ring for active or high severity */}
            <span
              className="absolute -inset-1 rounded-full animate-ping opacity-60 pointer-events-none"
              style={{ backgroundColor: color }}
            />
            {/* Pin Head */}
            <div
              className={`w-6 h-6 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-all ${
                isSelected ? 'scale-125 ring-4 ring-white/60' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color }}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            {/* Hover Tooltip Mini Label */}
            <div className="absolute top-7 left-1/2 -translate-x-1/2 hidden group-hover/pin:block z-30 bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap border border-slate-700">
              {report.farmerName} • {report.cropType}
            </div>
          </div>
        );
      })}

      {/* Active Pin Card Popup (matches Mockup) */}
      {selectedReport && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 sm:bottom-6 z-30 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-2xl w-64 text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-bold text-slate-900">
              {selectedReport.id}
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                selectedReport.severityLevel === 'High' || selectedReport.severityLevel === 'Severe'
                  ? 'bg-red-100 text-red-700'
                  : selectedReport.severityLevel === 'Medium'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {selectedReport.severityLevel}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-800">
            {selectedReport.cropType} • <span className="text-red-600 font-bold">{selectedReport.damageSeverityPercent}%</span> • {selectedReport.severityLevel}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {selectedReport.village}, {selectedReport.block}
          </p>

          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Confidence: {selectedReport.confidenceScore}%
            </span>
            <button
              onClick={() => onSelectReport(selectedReport)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Inspect →
            </button>
          </div>
        </div>
      )}

      {/* Bottom Map Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700">
        <button
          onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.15))}
          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-sm font-bold"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(1.0, prev - 0.15))}
          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-sm font-bold"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Layers icon control */}
      <div className="absolute bottom-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-white cursor-pointer hover:bg-slate-800">
        <Layers className="w-4 h-4" />
      </div>
    </div>
  );
};
