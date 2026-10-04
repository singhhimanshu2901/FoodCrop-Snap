import React, { useState } from 'react';
import { CheckCircle2, SlidersHorizontal, Maximize2, Layers } from 'lucide-react';

interface SatelliteComparisonSliderProps {
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export const SatelliteComparisonSlider: React.FC<SatelliteComparisonSliderProps> = ({
  beforeImageUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&auto=format&fit=crop&q=80',
  afterImageUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&auto=format&fit=crop&q=80',
}) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div
      id="satellite-verification-panel"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Satellite Verification (Sentinel-1 SAR)</span>
        </h4>
        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          10m Resolution
        </span>
      </div>

      {/* Comparison Container */}
      <div className="relative h-44 rounded-xl overflow-hidden select-none border border-slate-200 bg-slate-900 group">
        {/* Underneath: After Flood (SAR Inundation) */}
        <img
          src={afterImageUrl}
          alt="After Flood Inundation"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top: Before Flood (Clipped by slider position) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImageUrl}
            alt="Before Flood Dry Season"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', minWidth: '350px' }}
          />
        </div>

        {/* Divider line & handle */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-xl pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white text-slate-800 shadow-md border border-slate-300 flex items-center justify-center text-[10px] font-bold">
            ↔
          </div>
        </div>

        {/* Labels */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700">
          Before Flood
        </span>
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-blue-950/85 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-blue-600">
          After Flood (SAR)
        </span>

        {/* Invisible Range Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
      </div>

      {/* Verification Status Badges */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            Flood extent detected
          </span>
        </div>
        <div className="flex items-center gap-3 pl-7 text-[11px] text-slate-600">
          <span>
            Location match: <strong className="text-emerald-700">YES</strong>
          </span>
          <span>•</span>
          <span>
            Time match: <strong className="text-emerald-700">YES</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
