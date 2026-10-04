import React from 'react';
import { X, BookOpen, Check, AlertTriangle, Camera, MapPin } from 'lucide-react';

interface EvidenceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceGuideModal: React.FC<EvidenceGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Crop Damage Evidence Guide</h3>
              <p className="text-[11px] text-slate-500">How to capture valid insurance & survey evidence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>1. Photograph the Water Depth & Flood Line</span>
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              Place a measurement stick, boot, or plant stalk to show water level depth. Take at least one wide photo from field perimeter bund.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span>2. Stand Within the Cultivated Boundary</span>
            </h4>
            <p className="text-blue-800 leading-relaxed">
              Ensure the GPS status indicator turns green with accuracy &lt; 15 meters. Our SAR satellite engine matches your exact field polygon.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>3. Report Within 72 Hours of Inundation</span>
            </h4>
            <p className="text-amber-800 leading-relaxed">
              Under PMFBY crop insurance norms, intimation must occur within 72 hours of the calamity before floodwaters completely recede.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
            >
              I Understand – Ready to Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
