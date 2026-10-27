# GRAM Sathi 360° — Technical Architecture & System Design

## 1. System Overview
**GRAM Sathi 360°** is an integrated civic technology and digital rural governance platform proposed under the **Ministry of Youth Affairs and Sports' MY Bharat platform**.

The system establishes an end-to-end accountability loop:
```
[ Citizen / Youth Sathi ] 
       │ (1. Identify & Report via 60s form / offline SMS / photo geotag)
       ▼
[ Edge Ingestion & Verification ]
       │ (2. Sanitize input, mask PII, assign GS360-YYYY-XXXXXX tracking ID)
       ▼
[ Departmental Routing Engine ]
       │ (3. Dispatches SLA ticket to RES / JJM / SBM-G / DSO / UPNEDA)
       ▼
[ Public Transparency Ledger ]
       │ (4. Open tracking milestone trail & inspection photologs)
       ▼
[ Panchayat Progress Analytics ]
         (5. Real-time GPDP KPI dashboard, flood warning map, & CSV exports)
```

## 2. Front-End Architecture
- **Framework:** React 19 + TypeScript + Vite + Tailwind CSS 4.
- **Routing:** Lightweight client-side route dispatcher with full `window.history` pushState support, dynamic query params (`?id=`, `?village=`), and backward/forward browser history.
- **State Management & Persistence:**
  - `storage.ts` abstraction layer with browser localStorage persistence for grievances, subscriptions, and volunteer enrolments.
  - Initial seed data from `mockData/` loaded automatically on first paint.
- **Mapping Engine:** Leaflet 1.9.4 with OpenStreetMap tile layers, custom status pins, and interactive click-to-pick GPS coordinates.
- **Visual Analytics:** Custom accessible SVG Bar, Donut, and Line trend charts with accessible data table fallbacks.
- **Internationalization (i18n):** Bilingual dictionaries (`/locales/en.ts` and `/locales/hi.ts`) with dynamic toggle without external heavy dependencies.

## 3. Data Governance & Security
1. **Data Minimization:** No collection of Aadhaar numbers, biometric seeds, or banking credentials.
2. **Whistleblower Protection:** Full anonymous reporting mode masks personal identifiable information (PII) from public view.
3. **WCAG 2.1 AA Accessibility:** Full keyboard navigation, visible focus indicators, skip-to-content links, ARIA labels, and `prefers-reduced-motion` compliance.
