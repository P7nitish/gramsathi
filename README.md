# GRAM Sathi 360° — Smart Rural Development & Civic Technology Platform

> **Submitted for Consideration under the Ministry of Youth Affairs and Sports' MY Bharat Initiative**  
> *"Smart Villages. Safer Communities. Transparent Governance."*  
> *"Identify a problem. Report it digitally. Notify the authority. Track the action. Measure the impact."*

---

## Statutory & Proposal Disclaimer
**GRAM Sathi 360° is a proposed initiative submitted for consideration through MY Bharat. It is not an official Government of India platform and has not been approved, funded, or endorsed by any government body.**

**Privacy Safeguard:** Do not enter real Aadhaar, ration card, bank, or personal identifiers on this demonstration platform. All simulated records and form submissions are retained in your local demonstration sandbox.

---

## 1. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Run automated pure logic unit tests
npx --yes tsx --test src/utils/logic.test.ts
```

The application runs at `http://localhost:3000`.

---

## 2. Platform Architecture & Modules

The platform delivers seven integrated civic technology modules:

1. **Flood Prevention & Disaster Prep (`/flood`)**:
   - 15 simulated IoT ultrasonic staff gauges across rivers and canal escapes.
   - Interactive Leaflet OpenStreetMap with Normal, Warning, and Critical markers.
   - Working emergency SMS & automated voice broadcast subscription form.
2. **Ration Distribution Transparency (`/ration`)**:
   - Monthly NFSA grain entitlement calculator (Antyodaya AAY 35kg/family vs. Priority PHH 5kg/person).
   - Fair Price Shop e-PoS inventory ledger for 4 pilot shops.
   - Discrepancy reporting form with weight validation (`measured <= expected`).
   - Statutory non-denial protections (biometric failure safeguards).
3. **Roads, Drainage & Waterlogging (`/roads`)**:
   - Technical cross-section diagram of IRC-compliant rural roads and lined drainage.
   - Geotagged pothole and culvert damage report form with map pin picker.
   - Searchable, filterable ledger of active road defects.
4. **Streetlights & Solar Energy (`/lighting`)**:
   - Pole asset registry (solar LED luminaires, grid connections, high masts).
   - Fault dispatch form with technician assignment.
   - Decentralized solar microgrid feasibility section.
5. **Sanitation, Water & Waste Management (`/sanitation`)**:
   - 20 smart waste bins with real-time fill percentage progress bars.
   - Public health hazard dispatch form.
   - E-rickshaw door-to-door waste collection timetable.
   - Jal Jeevan Mission drinking water quality testing panel.
6. **Public Grievance Redressal (`/grievances`)**:
   - 4-step reporting wizard with GPS pin, simulated photo upload, and whistleblower anonymity toggle.
   - Automatic generation of permanent tracking IDs in format `GS360-YYYY-XXXXXX`.
   - Dedicated tracking portal (`/grievances/track`) with 5-stage SLA milestone timeline.
   - Public ledger of 30+ sample grievances with multi-field search and category filters.
   - View-only administrative SLA monitor with SVG bar, donut, and trend charts.
7. **MY Bharat Youth Participation (`/youth`)**:
   - Volunteer registration form with skills multi-selector.
   - Active missions board with interactive modal application flow.
   - Youth Sathi honor roll and leaderboard.
   - 8-topic rural digital empowerment curriculum in accordions.
8. **Government Schemes Awareness (`/schemes`)**:
   - Directory of 6 verified flagship schemes (PMGSY, JJM, PMAY-G, SBM-G, PM-KUSUM, NFSA).
   - Direct verified external links opening official `.gov.in` portals.
   - Illustrative 4-question household eligibility self-checker.
9. **Village Progress Dashboard (`/dashboard`)**:
   - Village selector dropdown covering 8 pilot Panchayats in Sitapur district.
   - Live KPI metric cards for grievances, sensors, bins, and lights.
   - 6-month resolution trend chart.
   - Working client-side CSV export button generating downloadable civic audit reports.

---

## 3. Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling & Design System:** Tailwind CSS 4 with custom tokens (`#1B5E3A` Deep Green, `#0F2A4A` Navy Blue, `#FF9933` Saffron)
- **Typography:** Manrope (Headings), Inter (Body), Noto Sans Devanagari (Hindi)
- **Maps:** Leaflet 1.9.4 + OpenStreetMap tiles (no API key required)
- **Visual Charts:** Accessible, custom SVG Bar, Donut, and Trend Charts
- **Icons:** Lucide React (stroke width 1.75)
- **Persistence:** LocalStorage abstraction (`src/utils/storage.ts`) with deterministic sample seed
- **Test Runner:** Node.js built-in test runner via `npx --yes tsx --test`

---

## 4. Proposed vs. Simulated Features

| Feature | Operational State | Implementation Details |
|---|---|---|
| **Bilingual Toggle (EN / हिंदी)** | **LIVE** | Complete translation dictionaries in `/locales/` covering navigation, modules, and form labels. |
| **Global Quick Search (⌘K / Ctrl+K)** | **LIVE** | Instant modal search with keyboard shortcuts and focus trapping. |
| **Grievance ID & Timeline Tracking** | **LIVE** | Validates `GS360-YYYY-XXXXXX`, retrieves stored complaints, and renders timeline stages. |
| **Interactive Map Pinpoint** | **LIVE** | Real OpenStreetMap map allowing click-to-pick GPS coordinates on reporting forms. |
| **CSV Export** | **LIVE** | Real client-side Blob generation downloading formatted `.csv` audit logs. |
| **Sensor Telemetry (River & Bin)** | **SIMULATED** | 15 flood gauges and 20 waste bins populated with realistic threshold data. |
| **Official Central Portal Links** | **AUTHENTIC** | Links strictly target official government domains (e.g. `omms.nic.in`, `ejalshakti.gov.in`, `nfsa.gov.in`). |

---

## 5. Accessibility & Inclusivity (WCAG 2.1 AA)

- **Keyboard Operable:** Complete tab navigation, modal focus traps, and Esc-key closing.
- **Visual Focus:** High-contrast 2px solid emerald outlines on all focusable interactive controls.
- **Accessible Color Contrast:** Ratio >= 4.5:1 for body copy and >= 3:1 for large headings.
- **Screen Reader Labels:** Explicit `<label>`, ARIA roles, and status announcements.
- **Motion Sensitivity:** Respects `prefers-reduced-motion: reduce`.
- **Offline / Low-Tech Fallbacks:** Clear documentation of non-digital protocols (chaupal loudspeakers, village chaukidar relays).

---

## 6. Directory Structure

```
├── docs/
│   ├── api.md                 # REST API contracts
│   ├── architecture.md        # Technical architecture
│   ├── integration-plan.md    # Production government API integration roadmap
│   └── routes.md              # Route directory
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Breadcrumb.tsx
│   │       ├── CivicChart.tsx
│   │       ├── Footer.tsx
│   │       ├── GlobalSearch.tsx
│   │       ├── LeafletMap.tsx
│   │       ├── Navbar.tsx
│   │       ├── SampleDataBadge.tsx
│   │       └── SensitiveDataNotice.tsx
│   ├── locales/
│   │   ├── en.ts              # English translation dictionary
│   │   └── hi.ts              # Hindi translation dictionary
│   ├── mockData/
│   │   └── index.ts           # 30+ grievances, sensors, bins, schemes, villages
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AccessibilityPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── FloodPage.tsx
│   │   ├── GrievanceReportPage.tsx
│   │   ├── GrievanceTrackPage.tsx
│   │   ├── GrievancesPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LightingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   ├── RationPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── RoadsPage.tsx
│   │   ├── SanitationPage.tsx
│   │   ├── SchemesPage.tsx
│   │   ├── TermsPage.tsx
│   │   └── YouthPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── logic.ts           # Pure business logic & calculations
│   │   ├── logic.test.ts      # Unit tests
│   │   └── storage.ts         # Persistence & demo data management
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── PRESENTATION_NOTES.md      # 5-minute walkthrough guide for evaluators
└── README.md
```
