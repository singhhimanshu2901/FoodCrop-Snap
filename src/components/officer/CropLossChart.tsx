import React from 'react';
import { BarChart3 } from 'lucide-react';

interface CropLossChartProps {
  onViewAnalytics?: () => void;
}

export const CropLossChart: React.FC<CropLossChartProps> = ({ onViewAnalytics }) => {
  const cropData = [
    { crop: 'Paddy', count: 29, color: 'bg-emerald-500', height: 'h-24' },
    { crop: 'Wheat', count: 15, color: 'bg-amber-400', height: 'h-16' },
    { crop: 'Maize', count: 11, color: 'bg-yellow-500', height: 'h-12' },
    { crop: 'Sugarcane', count: 12, color: 'bg-blue-400', height: 'h-14' },
    { crop: 'Others', count: 7, color: 'bg-rose-400', height: 'h-8' },
  ];

  return (
    <div
      id="crop-loss-breakdown-card"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
          <span>Damage Reports by Crop</span>
        </h4>
        <button
          onClick={onViewAnalytics}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View Analytics
        </button>
      </div>

      {/* Bar Chart Visual */}
      <div className="flex items-end justify-between gap-2 pt-2 px-1 h-32 border-b border-slate-100">
        {cropData.map(item => (
          <div key={item.crop} className="flex flex-col items-center flex-1 group">
            <span className="text-[10px] font-bold text-slate-600 mb-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
              {item.count}
            </span>
            <div
              className={`w-full max-w-[36px] rounded-t-lg ${item.color} ${item.height} shadow-xs group-hover:brightness-110 transition-all`}
            />
            <span className="text-[10px] font-bold text-slate-600 mt-2 truncate w-full text-center">
              {item.crop}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
