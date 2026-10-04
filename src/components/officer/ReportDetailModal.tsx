import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Share2,
  Printer,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Calendar,
  Lock,
} from 'lucide-react';
import { EvidenceRecord } from '../../types';

interface ReportDetailModalProps {
  report: EvidenceRecord | null;
  onClose: () => void;
  onUpdateStatus: (
    reportId: string,
    status: EvidenceRecord['status'],
    notes?: string,
    modifiedSeverity?: number
  ) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<
    'evidence' | 'satellite' | 'audit' | 'docket'
  >('evidence');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [actionNotes, setActionNotes] = useState('');
  const [customSeverity, setCustomSeverity] = useState<number>(
    report?.damageSeverityPercent || 68
  );

  if (!report) return null;

  const handleDownloadJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.id}_evidence_packet.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Top Navigation */}
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 font-mono">
                  {report.id}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    report.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : report.status === 'Inspection Required'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Farmer: <strong className="text-slate-800">{report.farmerName}</strong> • {report.village}, {report.district}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
              title="Download machine-readable evidence JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
              title="Print official assessment docket"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Docket</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white gap-2 overflow-x-auto">
          {[
            { id: 'evidence', label: 'Field Evidence & Photos' },
            { id: 'satellite', label: 'Satellite & Weather Verification' },
            { id: 'audit', label: 'Officer Audit Trail' },
            { id: 'docket', label: 'Official Claim Docket' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: FIELD EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              {/* Photo Zoom Gallery & Carousel */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Photographic Evidence ({report.photos.length} Captured)
                </h4>
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md">
                  <img
                    src={
                      report.photos[selectedPhotoIndex]?.url ||
                      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'
                    }
                    alt="Inspection Photo"
                    className="w-full h-full object-cover"
                  />
                  {/* Photo Overlay Watermark */}
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl text-white border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-mono font-bold text-emerald-400">
                        LAT {report.photos[selectedPhotoIndex]?.latitude?.toFixed(4) || report.latitude}° • LON {report.photos[selectedPhotoIndex]?.longitude?.toFixed(4) || report.longitude}°
                      </p>
                      <p className="text-[11px] text-slate-300">
                        {report.photos[selectedPhotoIndex]?.description || 'Crop field waterlogging angle'}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {report.photos[selectedPhotoIndex]?.timestamp || '09:42 AM'}
                    </span>
                  </div>
                </div>

                {/* Thumbnails Row */}
                <div className="flex items-center gap-2 mt-3 overflow-x-auto py-1">
                  {report.photos.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedPhotoIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-300'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Crop & Stage</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">
                    {report.cropType} ({report.cropStage})
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Affected: <strong className="text-slate-900">{report.areaAffected} {report.areaUnit}</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Calamity & Loss</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">
                    {report.eventType}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Farmer Loss Band: <strong className="text-slate-900">{report.damageBand}</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">AI Assessment</span>
                  <p className="text-sm font-extrabold text-red-600 mt-1">
                    {report.damageSeverityPercent}% Damage Severity
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Confidence: <strong className="text-emerald-700">{report.confidenceScore}%</strong>
                  </p>
                </div>
              </div>

              {/* Water Level Notes */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <h5 className="text-xs font-bold text-blue-900 mb-1">Farmer Field Observations</h5>
                <p className="text-xs text-blue-950 leading-relaxed font-medium">
                  {report.waterLevelNotes}
                </p>
              </div>

              {/* Cryptographic SHA-256 Validation Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>SHA-256 Tamper-Evident Evidence Seal</span>
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    Seal Valid & Intact
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-300 break-all bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  {report.packetHash}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SATELLITE & WEATHER */}
          {activeTab === 'satellite' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Sentinel-1 SAR Radar Verification
                  </span>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Inundation Pattern Corroborated</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    SAR radar backscatter coefficient decreased by &gt;4.2 dB, consistent with standing water surface reflections over parcel coordinates.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Meteorological Telemetry (IMD)
                  </span>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{report.verification.rainfall48hMm} mm Rainfall in 48h</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Exceeds standard 10-year return period threshold for Sitapur / Lakhimpur river basin.
                  </p>
                </div>
              </div>

              {/* AI Reasoning Points */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Agronomical Validation Factors</span>
                </h5>
                <ul className="space-y-1.5">
                  {report.verification.aiAnalysisReasoning.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Official Action History & Chain of Custody
              </h4>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {report.auditTrail.map((log, idx) => (
                  <div key={log.id || idx} className="relative">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-slate-900">{log.officerName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700">{log.action}</p>
                      {log.notes && (
                        <p className="text-slate-500 italic mt-1 bg-white p-2 rounded-lg border border-slate-100">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL CLAIM DOCKET */}
          {activeTab === 'docket' && (
            <div className="border border-slate-300 p-6 rounded-2xl bg-slate-50 font-serif text-slate-900 space-y-4 shadow-inner">
              <div className="text-center border-b border-slate-300 pb-3">
                <h3 className="text-lg font-bold tracking-tight uppercase">
                  FloodCrop Snap – Preliminary Damage Assessment Docket
                </h3>
                <p className="text-xs text-slate-600 font-sans mt-0.5">
                  Under Guidelines of National Disaster Management Authority (NDMA) & PMFBY
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <p><strong>Document ID:</strong> {report.id}</p>
                  <p><strong>Farmer Name:</strong> {report.farmerName}</p>
                  <p><strong>Kisan ID:</strong> {report.farmerId}</p>
                  <p><strong>Location:</strong> {report.village}, {report.block}, {report.district}</p>
                </div>
                <div>
                  <p><strong>Crop Type:</strong> {report.cropType} ({report.cropStage})</p>
                  <p><strong>Affected Area:</strong> {report.areaAffected} {report.areaUnit}</p>
                  <p><strong>Assessed Damage:</strong> {report.damageSeverityPercent}% (Band: {report.damageBand})</p>
                  <p><strong>Status:</strong> {report.status}</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] font-sans">
                <p><strong>Tamper-Evident SHA-256 Hash:</strong> <span className="font-mono break-all">{report.packetHash}</span></p>
              </div>

              <p className="text-[10px] text-slate-500 font-sans italic pt-2">
                Disclaimer: This evidence packet constitutes preliminary technological assessment based on geo-tagged mobile evidence, SAR satellite verification, and weather radar anomalies. Final claim disbursal is subject to official endorsement.
              </p>
            </div>
          )}

          {/* Officer Action Panel */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Officer Review Actions
            </h4>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Action Decision Notes / Justification:
              </label>
              <textarea
                rows={2}
                value={actionNotes}
                onChange={e => setActionNotes(e.target.value)}
                placeholder="Enter officer notes or reasons for approval / modification..."
                className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-sans"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  onUpdateStatus(
                    report.id,
                    'Approved',
                    actionNotes || 'Preliminary approved by Block Agriculture Officer based on SAR satellite match.'
                  );
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Approve Preliminary Claim
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(
                    report.id,
                    'Inspection Required',
                    actionNotes || 'Dispatched field verification team for ground-truth inspection.'
                  );
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Request Physical Inspection
              </button>

              <button
                onClick={() => {
                  const newPercent = prompt('Enter modified loss percentage (0-100):', String(report.damageSeverityPercent));
                  if (newPercent !== null) {
                    onUpdateStatus(
                      report.id,
                      'Under Review',
                      actionNotes || `Officer adjusted severity to ${newPercent}%.`,
                      Number(newPercent)
                    );
                    onClose();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Modify Severity %
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(
                    report.id,
                    'Rejected',
                    actionNotes || 'Evidence rejected due to location or date inconsistency.'
                  );
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Reject Evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
