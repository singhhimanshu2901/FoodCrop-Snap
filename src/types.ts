export type CropType =
  | 'Paddy (Rice)'
  | 'Wheat'
  | 'Maize'
  | 'Sugarcane'
  | 'Mustard'
  | 'Pulses'
  | 'Vegetables';

export type CropStage =
  | 'Sowing'
  | 'Vegetative'
  | 'Flowering'
  | 'Grain Filling'
  | 'Harvesting';

export type EventType =
  | 'Flood'
  | 'Waterlogging'
  | 'Flash Flood'
  | 'Hailstorm'
  | 'Windstorm';

export type DamageBand = '0 - 25%' | '26 - 50%' | '51 - 75%' | '76 - 100%';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Severe';

export type ReportStatus =
  | 'New'
  | 'Under Review'
  | 'Approved'
  | 'Inspection Required'
  | 'Rejected';

export type SyncStatus = 'DRAFT' | 'PENDING_SYNC' | 'SYNCED';

export interface EvidencePhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  description?: string;
}

export interface VerificationDetails {
  satelliteFloodDetected: boolean;
  sarRadarMatch: boolean;
  weatherAlertMatch: boolean;
  rainfall48hMm: number;
  spatialDistanceKm: number;
  timeWindowMatch: boolean;
  flags: string[];
  aiAnalysisReasoning: string[];
  satelliteTileUrl?: string;
}

export interface AuditLog {
  id: string;
  officerId: string;
  officerName: string;
  action: string;
  timestamp: string;
  notes?: string;
}

export interface EvidenceRecord {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerId: string;
  village: string;
  block: string;
  district: string;
  eventType: EventType;
  cropType: CropType;
  cropStage: CropStage;
  areaAffected: number;
  areaUnit: 'Acres' | 'Hectares';
  damageBand: DamageBand;
  damageSeverityPercent: number;
  confidenceScore: number;
  severityLevel: SeverityLevel;
  status: ReportStatus;
  waterLevelNotes: string;
  latitude: number;
  longitude: number;
  gpsAccuracy: number;
  deviceTimestamp: string;
  packetHash: string;
  isHashVerified: boolean;
  syncStatus: SyncStatus;
  photos: EvidencePhoto[];
  verification: VerificationDetails;
  auditTrail: AuditLog[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalReports: number;
  newReports: number;
  underReview: number;
  highSeverity: number;
  inspectionRequired: number;
  syncedToday: number;
  cropLossBreakdown: { crop: string; count: number; avgDamage: number }[];
}

export interface OfficerProfile {
  id: string;
  name: string;
  role: string;
  district: string;
  block: string;
  email: string;
  avatarUrl: string;
}
