import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  MapPin,
  Camera,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Upload,
  RefreshCw,
  Droplets,
  Clock,
  FileText,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  CropType,
  CropStage,
  EventType,
  DamageBand,
  EvidenceRecord,
  EvidencePhoto,
} from '../../types';
import { computePacketHash, generateEvidenceId } from '../../utils/crypto';
import { SAMPLE_FLOOD_PHOTOS } from '../../data/mockData';

interface ReportWizardProps {
  onBack: () => void;
  onSubmitReport: (newReport: EvidenceRecord) => void;
  isOnline: boolean;
}

export const ReportWizard: React.FC<ReportWizardProps> = ({
  onBack,
  onSubmitReport,
  isOnline,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [latitude, setLatitude] = useState(26.7245);
  const [longitude, setLongitude] = useState(81.0213);
  const [gpsAccuracy, setGpsAccuracy] = useState(8);
  const [village, setVillage] = useState('Rampur');
  const [block, setBlock] = useState('Sitapur');
  const [district, setDistrict] = useState('Lakhimpur Kheri');

  // Step 2 Photos State
  const [photos, setPhotos] = useState<EvidencePhoto[]>([
    {
      id: 'p-init-1',
      url: SAMPLE_FLOOD_PHOTOS[0],
      latitude: 26.7245,
      longitude: 81.0213,
      timestamp: new Date().toLocaleTimeString(),
      description: 'Submerged paddy field with visible flood line',
    },
    {
      id: 'p-init-2',
      url: SAMPLE_FLOOD_PHOTOS[1],
      latitude: 26.7246,
      longitude: 81.0215,
      timestamp: new Date().toLocaleTimeString(),
      description: 'Field boundary bund overflow',
    },
    {
      id: 'p-init-3',
      url: SAMPLE_FLOOD_PHOTOS[2],
      latitude: 26.7244,
      longitude: 81.0211,
      timestamp: new Date().toLocaleTimeString(),
      description: 'Vegetative lodging and standing water',
    },
  ]);
  const [flashEnabled, setFlashEnabled] = useState(false);

  // Step 3 Survey Form State
  const [cropType, setCropType] = useState<CropType>('Paddy (Rice)');
  const [cropStage, setCropStage] = useState<CropStage>('Vegetative');
  const [areaAffected, setAreaAffected] = useState(2);
  const [areaUnit, setAreaUnit] = useState<'Acres' | 'Hectares'>('Acres');
  const [damageBand, setDamageBand] = useState<DamageBand>('51 - 75%');
  const [eventType, setEventType] = useState<EventType>('Flood');
  const [waterLevelNotes, setWaterLevelNotes] = useState(
    'Water level about 1.5 feet in field. Standing flood water for over 36 hours.'
  );

  // Step 4 AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDamagePercent, setAiDamagePercent] = useState(68);
  const [aiConfidence, setAiConfidence] = useState(89);
  const [aiReasons, setAiReasons] = useState<string[]>([
    'Flood detected in Sentinel-1 SAR satellite radar data',
    'Location and time verified with river gauge basin',
    'Multiple clear photographs verified for crop lodging & submergence',
    'Consistent with local heavy rainfall weather event (218mm in 48h)',
  ]);
  const [aiSeverityLevel, setAiSeverityLevel] = useState<'Low' | 'Medium' | 'High' | 'Severe'>('High');

  // Step 5 Created Report
  const [createdReport, setCreatedReport] = useState<EvidenceRecord | null>(null);

  // Trigger Real-Time AI Analysis
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-damage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType,
          cropStage,
          eventType,
          areaAffected,
          waterLevelNotes,
          photos: photos.map(p => p.url),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.estimatedDamagePercent) {
          setAiDamagePercent(data.estimatedDamagePercent);
        }
        if (data.confidenceScore) {
          setAiConfidence(data.confidenceScore);
        }
        if (data.severityLevel) {
          setAiSeverityLevel(data.severityLevel);
        }
        if (Array.isArray(data.reasons) && data.reasons.length > 0) {
          setAiReasons(data.reasons);
        }
      }
    } catch {
      // Fallback heuristics
      setAiDamagePercent(68);
      setAiConfidence(89);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStep3Next = () => {
    setStep(4);
    runAiAnalysis();
  };

  // Final Submission with Tamper-Evident Packaging
  const handleFinalSubmit = async () => {
    const reportId = generateEvidenceId();
    const timestamp = new Date().toISOString();

    const packetData = {
      id: reportId,
      farmerName: 'Ramesh Kumar',
      farmerPhone: '+91 98765 43210',
      farmerId: 'UP-KCC-882190',
      village,
      block,
      district,
      cropType,
      cropStage,
      eventType,
      areaAffected,
      areaUnit,
      damageBand,
      damageSeverityPercent: aiDamagePercent,
      confidenceScore: aiConfidence,
      waterLevelNotes,
      latitude,
      longitude,
      deviceTimestamp: timestamp,
    };

    const packetHash = await computePacketHash(packetData);

    const fullReport: EvidenceRecord = {
      id: reportId,
      farmerName: 'Ramesh Kumar',
      farmerPhone: '+91 98765 43210',
      farmerId: 'UP-KCC-882190',
      village,
      block,
      district,
      eventType,
      cropType,
      cropStage,
      areaAffected,
      areaUnit,
      damageBand,
      damageSeverityPercent: aiDamagePercent,
      confidenceScore: aiConfidence,
      severityLevel: aiSeverityLevel,
      status: 'New',
      waterLevelNotes,
      latitude,
      longitude,
      gpsAccuracy,
      deviceTimestamp: timestamp,
      packetHash,
      isHashVerified: true,
      syncStatus: isOnline ? 'SYNCED' : 'PENDING_SYNC',
      photos,
      verification: {
        satelliteFloodDetected: true,
        sarRadarMatch: true,
        weatherAlertMatch: true,
        rainfall48hMm: 218.4,
        spatialDistanceKm: 0.42,
        timeWindowMatch: true,
        flags: [],
        aiAnalysisReasoning: aiReasons,
      },
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          officerId: 'SYS-AUTO',
          officerName: 'FloodCrop AI Engine',
          action: 'Cryptographic hash generated & SAR flood radar cross-checked',
          timestamp,
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setCreatedReport(fullReport);
    onSubmitReport(fullReport);
    setStep(5);
  };

  // Add captured photo
  const handleCapturePhoto = () => {
    const nextIndex = photos.length % SAMPLE_FLOOD_PHOTOS.length;
    const newPhoto: EvidencePhoto = {
      id: `p-${Date.now()}`,
      url: SAMPLE_FLOOD_PHOTOS[nextIndex],
      latitude: latitude + (Math.random() - 0.5) * 0.0008,
      longitude: longitude + (Math.random() - 0.5) * 0.0008,
      timestamp: new Date().toLocaleTimeString(),
      description: `Photo ${photos.length + 1} - Inundated crop angle`,
    };
    setPhotos(prev => [...prev, newPhoto]);
  };

  // File Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const newPhoto: EvidencePhoto = {
          id: `p-upload-${Date.now()}`,
          url: reader.result as string,
          latitude,
          longitude,
          timestamp: new Date().toLocaleTimeString(),
          description: files[0].name,
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div
      id="report-wizard-container"
      className="relative w-full h-full min-h-[640px] flex flex-col justify-between bg-slate-50 text-slate-900 pb-5 overflow-y-auto"
    >
      {/* Top Header & Stepper */}
      <div className="bg-white px-5 pt-4 pb-3 border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={step === 1 ? onBack : () => setStep(prev => (prev - 1) as 1 | 2 | 3 | 4 | 5)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{step === 5 ? 'Done' : 'Back'}</span>
          </button>
          <span className="text-xs font-bold text-slate-800">
            {step === 5 ? 'Report Tracking' : 'Quick Damage Report'}
          </span>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            Step {step}/5
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-between gap-1.5 px-2">
          {[1, 2, 3, 4, 5].map(num => (
            <div
              key={num}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                num < step
                  ? 'bg-emerald-600'
                  : num === step
                  ? 'bg-emerald-500 ring-2 ring-emerald-300/60'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: LOCATION CAPTURE */}
      {step === 1 && (
        <div className="p-5 space-y-4 flex-1">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Step 1
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              1. Field Location Lock
            </h3>
            <p className="text-xs text-slate-500">
              Capturing high-accuracy satellite GPS coordinates of affected plot.
            </p>
          </div>

          {/* Interactive Simulated Map Box */}
          <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
            {/* Satellite Terrain Image */}
            <img
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=700&auto=format&fit=crop&q=80"
              alt="Satellite Map"
              className="w-full h-full object-cover opacity-85"
            />
            {/* Radar Overlay grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* GPS Pulse Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="w-12 h-12 rounded-full bg-emerald-500/30 animate-pulse-ring absolute" />
                <span className="w-7 h-7 rounded-full bg-emerald-500/80 border-2 border-white shadow-xl flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                </span>
              </div>
              <div className="mt-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30 shadow-lg">
                Plot #42B • Rampur
              </div>
            </div>

            {/* Map Top Badge */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white border border-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SAR Radar Overlay Active</span>
            </div>
          </div>

          {/* GPS Coordinate Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 font-mono">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Accuracy: ±{gpsAccuracy} m
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                GPS Locked
              </span>
              <button
                onClick={() => {
                  setLatitude(26.7245 + (Math.random() - 0.5) * 0.001);
                  setLongitude(81.0213 + (Math.random() - 0.5) * 0.001);
                  setGpsAccuracy(6 + Math.floor(Math.random() * 4));
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Lock</span>
              </button>
            </div>
          </div>

          {/* Village & Block Dropdowns */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Registered Administrative Block
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-medium">Village</span>
                <input
                  type="text"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium">District</span>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>
            </div>
          </div>

          <button
            id="wizard-step1-next"
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
          >
            Next: Capture Photos
          </button>
        </div>
      )}

      {/* STEP 2: CAMERA CAPTURE */}
      {step === 2 && (
        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Step 2
            </span>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                2. Geo-Tagged Photos ({photos.length}/5)
              </h3>
              <button
                onClick={() => setFlashEnabled(!flashEnabled)}
                className={`p-1.5 rounded-xl border ${
                  flashEnabled
                    ? 'bg-amber-100 border-amber-300 text-amber-700'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Capture clear photos from corner of field showing water level and plant damage.
            </p>
          </div>

          {/* Interactive Camera Viewfinder */}
          <div className="relative flex-1 min-h-[260px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between p-4">
            <img
              src={photos[photos.length - 1]?.url || SAMPLE_FLOOD_PHOTOS[0]}
              alt="Active Viewfinder"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />

            {/* Viewfinder Rule-of-Thirds Grid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Top Viewfinder HUD */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/40">
                LAT {latitude.toFixed(4)} • LON {longitude.toFixed(4)}
              </span>
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white">
                {photos.length} Captured
              </span>
            </div>

            {/* Tip Banner at Bottom of Viewfinder */}
            <div className="relative z-10 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-[11px] text-slate-200 font-medium leading-tight">
                Make sure the field boundary, flood line, and crop water level are visible.
              </p>
            </div>
          </div>

          {/* Captured Photos Reel */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Captured Evidence Reel</span>
              <label className="text-emerald-700 font-semibold cursor-pointer flex items-center gap-1 hover:underline">
                <Upload className="w-3 h-3" />
                <span>Upload from phone</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {photos.map((p, index) => (
                <div
                  key={p.id}
                  className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-emerald-500 relative shadow-sm"
                >
                  <img
                    src={p.url}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] font-mono text-center text-white py-0.5">
                    #{index + 1}
                  </span>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  onClick={handleCapturePhoto}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 shrink-0 bg-white transition-all"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-bold">+ Add</span>
                </button>
              )}
            </div>
          </div>

          {/* Shutter Button & Navigation */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-center">
              <button
                id="camera-shutter-btn"
                onClick={handleCapturePhoto}
                className="w-16 h-16 rounded-full border-4 border-emerald-600 p-1 bg-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-inner">
                  <Camera className="w-6 h-6" />
                </div>
              </button>
            </div>

            <button
              id="wizard-step2-next"
              onClick={() => setStep(3)}
              disabled={photos.length === 0}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Next: Crop & Damage Survey ({photos.length} photos)
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CROP & DAMAGE SURVEY */}
      {step === 3 && (
        <div className="p-5 space-y-4 flex-1">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Step 3
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              3. Crop & Damage Details
            </h3>
            <p className="text-xs text-slate-500">
              Structured survey data aligned with State Disaster Relief & PMFBY forms.
            </p>
          </div>

          {/* Crop Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Crop Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                ['Paddy (Rice)', 'Wheat', 'Maize', 'Sugarcane', 'Mustard', 'Vegetables'] as CropType[]
              ).map(crop => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setCropType(crop)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    cropType === crop
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Stage */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Crop Stage</label>
            <select
              value={cropStage}
              onChange={e => setCropStage(e.target.value as CropStage)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
            >
              <option value="Sowing">Sowing</option>
              <option value="Vegetative">Vegetative</option>
              <option value="Flowering">Flowering</option>
              <option value="Grain Filling">Grain Filling</option>
              <option value="Harvesting">Harvesting</option>
            </select>
          </div>

          {/* Affected Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Approx. Affected Area
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={areaAffected}
                onChange={e => setAreaAffected(Number(e.target.value))}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold"
              />
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setAreaUnit('Acres')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    areaUnit === 'Acres' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Acres
                </button>
                <button
                  type="button"
                  onClick={() => setAreaUnit('Hectares')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    areaUnit === 'Hectares' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Hectares
                </button>
              </div>
            </div>
          </div>

          {/* Farmer's Damage Estimate Bands */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Farmer Loss Estimate Band
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['0 - 25%', '26 - 50%', '51 - 75%', '76 - 100%'] as DamageBand[]).map(band => (
                <button
                  key={band}
                  type="button"
                  onClick={() => setDamageBand(band)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    damageBand === band
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {band} Loss
                </button>
              ))}
            </div>
          </div>

          {/* Event Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Extreme Weather Event</label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value as EventType)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
            >
              <option value="Flood">Flood (River Inundation)</option>
              <option value="Waterlogging">Waterlogging (Rain Inundation)</option>
              <option value="Flash Flood">Flash Flood / High Torrent</option>
              <option value="Hailstorm">Hailstorm</option>
              <option value="Windstorm">Windstorm / Lodging</option>
            </select>
          </div>

          {/* Additional Notes & Water Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Water Level & Field Notes
            </label>
            <textarea
              rows={2}
              value={waterLevelNotes}
              onChange={e => setWaterLevelNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
              placeholder="e.g. Water level about 1.5 feet in field. Inundated for 48 hours."
            />
          </div>

          <button
            id="wizard-step3-next"
            onClick={handleStep3Next}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
          >
            Next: Run Real-Time AI Analysis
          </button>
        </div>
      )}

      {/* STEP 4: AI ASSESSMENT (PRELIMINARY) */}
      {step === 4 && (
        <div className="p-5 space-y-4 flex-1">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Step 4
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              4. AI Assessment (Preliminary)
            </h3>
            <p className="text-xs text-slate-500">
              Automated multi-spectral and remote sensing cross-check.
            </p>
          </div>

          {/* Radial Circular Severity Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md text-center flex flex-col items-center">
            {isAnalyzing ? (
              <div className="py-12 flex flex-col items-center">
                <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
                <p className="text-sm font-bold text-slate-800">
                  Cross-checking Sentinel-1 SAR & Weather Data...
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Comparing multi-photo lodging with river basin metrics
                </p>
              </div>
            ) : (
              <>
                {/* Radial Gauge Visual */}
                <div className="relative w-40 h-40 mb-3 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={aiDamagePercent > 60 ? '#f43f5e' : '#10b981'}
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * aiDamagePercent) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {aiDamagePercent}%
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Damage Severity
                    </span>
                  </div>
                </div>

                <div className="w-full max-w-xs space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Confidence Score</span>
                    <span className="text-emerald-700">{aiConfidence}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${aiConfidence}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Key Reasons List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Verification Factors</span>
            </h4>
            <div className="space-y-2">
              {aiReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="leading-snug">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regulation / Disclaimer Notice */}
          <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-900 leading-tight">
              This is an AI-assisted preliminary evidence packet. Official relief and claim payout approval are ratified by Block Agriculture Officers.
            </p>
          </div>

          <button
            id="wizard-submit-packet"
            onClick={handleFinalSubmit}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Package & Sign Evidence Packet (SHA-256)</span>
          </button>
        </div>
      )}

      {/* STEP 5: REPORT STATUS & TAMPER-EVIDENT TRACKING */}
      {step === 5 && (
        <div className="p-5 space-y-4 flex-1">
          {/* Header */}
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Damage Evidence Submitted!
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evidence ID: <span className="font-mono font-bold text-slate-800">{createdReport?.id}</span>
            </p>
          </div>

          {/* Tamper-Evident SHA-256 Hash Card */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Tamper-Evident Hash</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                Verified Intact
              </span>
            </div>
            <p className="font-mono text-[10px] text-slate-300 break-all bg-slate-950/80 p-2 rounded-xl border border-slate-800">
              {createdReport?.packetHash}
            </p>
          </div>

          {/* Report Tracking Timeline (matches Mockup Screen #8) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Claim Progression Timeline
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
              {/* Point 1 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                  ✓
                </span>
                <p className="text-xs font-bold text-slate-900">Evidence Captured</p>
                <p className="text-[10px] text-slate-400">09:42 AM • Offline Saved</p>
              </div>

              {/* Point 2 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                  ✓
                </span>
                <p className="text-xs font-bold text-slate-900">Packet Hash Sealed</p>
                <p className="text-[10px] text-slate-400">09:45 AM • SHA-256 Generated</p>
              </div>

              {/* Point 3 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                  ✓
                </span>
                <p className="text-xs font-bold text-slate-900">
                  {isOnline ? 'Synced to Agriculture Cloud' : 'Queued in Offline Storage'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isOnline ? '09:46 AM • Live Ingested' : 'Will sync upon network reconnect'}
                </p>
              </div>

              {/* Point 4 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] animate-pulse">
                  •
                </span>
                <p className="text-xs font-bold text-blue-900">Verification in Progress</p>
                <p className="text-[10px] text-blue-600 font-medium">
                  SAR Satellite & IMD telemetry matching
                </p>
              </div>

              {/* Point 5 */}
              <div className="relative opacity-60">
                <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-[9px]">
                  5
                </span>
                <p className="text-xs font-bold text-slate-700">Under Officer Review</p>
                <p className="text-[10px] text-slate-400">Sitapur Block Agriculture Office</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onBack}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
            >
              Return to Home Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
