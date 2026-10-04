# 🌱 FloodCrop Snap

> **Capture Early. Verify Faster. Recover Sooner.**  
> A full-stack, offline-first mobile and GIS web platform empowering flood-affected farmers and agricultural officers with real-time, tamper-evident crop damage evidence collection, automated satellite SAR/AI verification, and fast-track disaster relief dockets.

---

## 📌 1. Executive Summary & Problem Statement

In flood-prone agricultural districts, extreme monsoon deluges and river overflows routinely destroy standing crops. Traditional compensation and crop insurance workflows (such as PMFBY and State Disaster Relief Funds) face severe bottlenecks:

1. **Delayed Surveys**: Official paper assessments are conducted days or weeks *after* floodwaters recede, by which time crops may have rotted or fields were cleared.
2. **Resource Constraints**: Overstretched block agriculture officers cannot physically inspect thousands of fragmented, remote holdings simultaneously.
3. **Disputes and Fraud**: Contentions over affected acreage, crop growth stage, and severity often stall payouts for months, devastating small and marginal farmers.
4. **Underutilized Evidence**: Smartphone photos taken by farmers are routinely rejected by authorities due to lack of standard geo-referencing, timestamps, or tamper verification.

### The Solution: FloodCrop Snap
FloodCrop Snap acts as the trusted technological bridge between **farmers in the field** and **revenue/agriculture officers in the administrative office**. By combining offline-first mobile capture, cryptographic SHA-256 evidence hashing, Sentinel-1 SAR satellite cross-checks, real-time AI damage modeling, and an officer GIS dashboard, FloodCrop Snap provides **trusted preliminary evidence** that aligns with official survey formats and dramatically accelerates emergency relief.

---

## 🚀 2. System Architecture & Workflow

```
   ┌────────────────────────────────────────────────────────┐
   │                  FARMER MOBILE APP                     │
   │  • Animated Splash & Onboarding Guide                  │
   │  • GPS Lock (±8m accuracy) + Field Perimeter Coordinates│
   │  • Geo-Tagged Multi-Angle Camera Capture               │
   │  • Structured Crop & Loss Survey                       │
   │  • Real-Time AI Damage & Agronomic Analysis            │
   │  • SHA-256 Tamper-Evident Evidence Packaging           │
   │  • Offline SQLite/IndexedDB Storage & Queue            │
   └──────────────────────────┬─────────────────────────────┘
                              │
                    (Automatic / Manual Sync)
                              ▼
   ┌────────────────────────────────────────────────────────┐
   │                  EXPRESS BACKEND API                   │
   │  • /api/analyze-damage (Gemini / Agronomic Engine)     │
   │  • /api/reports (Ingestion & Status Management)        │
   │  • /api/verify-hash (SHA-256 Seal Validation)          │
   │  • /api/reports/:id/export (Claim-Ready Docket JSON)   │
   │  • Radar & IMD Rainfall Cross-Checking Service         │
   └──────────────────────────┬─────────────────────────────┘
                              │
                    (Real-Time Telemetry)
                              ▼
   ┌────────────────────────────────────────────────────────┐
   │              OFFICER GIS COMMAND CENTER                │
   │  • Live District & Block Key Metrics                   │
   │  • Interactive Inundation GIS Map (Parcels & Floods)   │
   │  • Before / After Sentinel-1 SAR Comparison Slider     │
   │  • Crop-Wise Loss Distribution Analytics               │
   │  • Comprehensive Inspection Drawer & Audit Trail       │
   │  • Official Claim Dossier / PDF-Ready Export           │
   └────────────────────────────────────────────────────────┘
```

---

## ✨ 3. Core Features

### 🌾 3.1 Farmer Mobile Application
* **Animated Splash & Onboarding**: Smooth motion animations introducing farmers to flood documentation and key reporting rules (e.g. 72-hour filing window).
* **Location Pinning**: Automated GPS coordinate locking with real-time accuracy indicators (latitude, longitude, elevation, administrative block).
* **Multi-Angle Camera Capture**: Simulated in-app camera viewfinder with composition guidelines, flood-line level tips, and photo watermarking.
* **Structured Survey Form**: Standardized survey fields aligned with PMFBY and NDMA formats:
  * Crop Type (*Paddy, Wheat, Maize, Sugarcane, Mustard, Pulses, Vegetables*)
  * Growth Stage (*Sowing, Vegetative, Flowering, Grain Filling, Harvesting*)
  * Affected Acreage (*Numeric + Unit toggles*)
  * Loss Band (*0–25%, 26–50%, 51–75%, 76–100%*)
  * Event Type (*River Flood, Heavy Rain Waterlogging, Flash Flood, Hailstorm*)
  * Observational field notes (e.g. water depth, duration of stagnation).
* **Real-Time AI Damage Assessment**:
  * Powered by Google's **Gemini models** (via `@google/genai`) and agricultural agronomy logic (ICAR/FAO crop inundation resilience matrices).
  * Computes estimated loss percentage, statistical confidence score, stalk lodging analysis, and submergence tolerance countdowns.
* **Tamper-Evident SHA-256 Packaging**:
  * Combines photos, GPS coordinates, timestamps, and farmer responses into a canonical JSON packet.
  * Calculates an immutable SHA-256 digest that seals the evidence before leaving the farmer's device.
* **Offline-First Resilience**:
  * Allows farmers in low-connectivity fields to draft and seal reports offline.
  * Local queue maintains `DRAFT`, `PENDING_SYNC`, and `SYNCED` statuses with auto-reconnect synchronization.
* **Farmer Claim Tracking**: Step-by-step progress timeline tracking report progression from field capture to officer endorsement.

---

### 🏛️ 3.2 Officer Web GIS Command Center
* **Operational Dashboard Metrics**:
  * Real-time counters: *Total Submissions, New Reports, Under Review, High Severity Cases, Inspection Required, Synced Today*.
* **Interactive GIS Map**:
  * Vector/Satellite basemap toggle with zoom controls.
  * Multi-spectral flood inundation overlay polygons denoting high-water boundaries.
  * Geotagged pins color-coded by damage severity with one-click inspection popups.
* **Before / After Satellite SAR Slider**:
  * Interactive swipe tool comparing pre-calamity optical terrain with post-flood Sentinel-1 Synthetic Aperture Radar (SAR) backscatter data.
* **Crop Loss Analytics**:
  * Live distribution charts summarizing damage reports and loss severity across all major crop categories.
* **Deep Inspection & Action Docket**:
  * Carousel viewer for full-resolution geotagged photographs with metadata.
  * Meteorological validation against Indian Meteorological Department (IMD) 48-hour rainfall gauges.
  * One-click officer adjudication:
    1. **Approve Preliminary Claim** (for fast-track interim relief).
    2. **Modify Severity %** (adjust damage band with official notes).
    3. **Request Physical Inspection** (dispatch field survey team).
    4. **Reject Evidence** (with logged justification).
  * Immutable chain-of-custody audit log recording officer identity, timestamp, and changes.
* **Standardized Docket Export**:
  * Generates formatted claim dockets with disclaimer badges ready for official printing or machine-readable JSON transfer.

---

### 🖥️ 3.3 Multi-View Presentation Experience
The application includes a unified view switcher in the navigation bar:
1. **Farmer App**: Realistic smartphone viewport simulation.
2. **Officer GIS**: Full-screen desktop command center.
3. **Dual Mode**: Side-by-side demonstration layout showcasing real-time interaction between farmer field reporting and officer GIS verification simultaneously.

---

## 🛠️ 4. Technical Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component-based, typed reactive user interface |
| **Build & Tooling** | Vite 6 + Tailwind CSS v4 | High-performance bundling and responsive styling |
| **Animation Engine** | Motion (`motion/react`) | Fluid physics-based transitions, splash screen & gestures |
| **Icons & Design** | Lucide React | Clean, domain-specific SVG iconography |
| **Server / Backend** | Node.js + Express + `tsx` | RESTful API, ingestion pipeline, verification engine |
| **AI Assessment** | Google Gen AI SDK (`@google/genai`) | Intelligent agricultural damage and lodging reasoning |
| **Cryptography** | Web Crypto API + Node `crypto` | Canonical SHA-256 tamper-evident packet sealing |

---

## 🔌 5. API Reference

### 1. `GET /api/health`
Checks server health, timestamp, and Gemini API availability.
* **Response**: `{"status": "ok", "geminiAvailable": true, "time": "..."}`

### 2. `GET /api/reports`
Lists all submitted damage evidence reports with support for query filters (`district`, `status`, `crop`, `severity`).
* **Response**: `{ "reports": [...], "total": 12, "metrics": {...} }`

### 3. `GET /api/reports/:id`
Retrieves detailed metadata, photos, satellite check flags, and audit history for a single report.

### 4. `POST /api/reports`
Ingests a new damage report submitted by the farmer app. Computes canonical SHA-256 seal if not already present.
* **Body**:
  ```json
  {
    "farmerName": "Ramesh Kumar",
    "farmerPhone": "+91 98765 43210",
    "village": "Rampur",
    "block": "Sitapur",
    "district": "Lakhimpur Kheri",
    "cropType": "Paddy (Rice)",
    "cropStage": "Vegetative",
    "areaAffected": 2.0,
    "damageBand": "51 - 75%",
    "damageSeverityPercent": 68,
    "confidenceScore": 89,
    "latitude": 26.7245,
    "longitude": 81.0213,
    "photos": [...]
  }
  ```

### 5. `PUT /api/reports/:id`
Allows authorized agriculture officers to update status, modify severity %, and append audit trail logs.

### 6. `POST /api/analyze-damage`
Invokes the Gemini 3.8 / Agronomic engine to compute real-time loss percentages, statistical confidence scores, lodging assessments, and relief recommendations.

### 7. `POST /api/verify-hash`
Verifies whether a given SHA-256 hash matches the canonical evidence packet stored in the database.
* **Response**: `{"verified": true, "status": "SEAL_INTACT", "matchedReportId": "FCS-2025-09-001234"}`

### 8. `GET /api/reports/:id/export`
Exports a standardized claim docket object structured for integration with state insurance and disaster management portals.

---

## 🔒 6. Tamper-Evident Security Model

To prevent photo recycling, coordinate falsification, or post-submission record modification:
1. **Canonical Payload Construction**: Core survey fields (Coordinates, Farmer ID, Timestamp, Crop Stage, Loss Band) are alphabetically serialized.
2. **SHA-256 Digest**: The serialized string is cryptographically hashed using SHA-256.
3. **Read-Only Evidence**: Once created, records cannot be overwritten. Any officer revision appends an entry to the immutable `auditTrail` array without altering original field evidence.
4. **Verification Status**: The officer portal instantly displays whether the packet hash is intact (`SEAL_INTACT`) or flagged if manual alterations occurred.

---

## 💻 7. Local Development Guide

### Prerequisites
* **Node.js**: v18 or later
* **npm**: v9 or later

### Installation & Launch

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` (optional, for Gemini AI acceleration):
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` if testing server-side generative AI features. If omitted, the system seamlessly falls back to the ICAR-grounded agronomic calculation model.

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📜 8. Compliance & Disclaimer

> **Important Regulatory Notice**:  
> FloodCrop Snap generates **preliminary damage evidence packets** and accelerated decision-support dockets. Final statutory approvals and disbursement of disaster compensation or PMFBY claim payouts remain under the jurisdiction of authorized Block Agriculture Officers, District Revenue Authorities, and empanelled insurance underwriters.
