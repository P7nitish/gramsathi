# GRAM Sathi 360° — Evaluator Walkthrough Notes (5-Minute Guide)
**Target Audience:** Ministry of Youth Affairs and Sports / MY Bharat Social Innovation Committee

---

## 1. Executive Summary
**GRAM Sathi 360°** addresses the last-mile civic delivery deficit in rural India by coupling on-ground youth volunteerism with digital accountability. 

- **Core Tagline:** *"Smart Villages. Safer Communities. Transparent Governance."*
- **Action Principle:** *"Identify a problem. Report it digitally. Notify the authority. Track the action. Measure the impact."*
- **Status Disclosure:** This is an independent proposal prepared for consideration through MY Bharat. It is not an official government portal.

---

## 2. Five-Minute Evaluation Path

| Time | Action | Page / Feature | What to Observe |
|---|---|---|---|
| **0:00 - 1:00** | **Home Overview** | `/` (Home) | Impact strip, 7 module cards, 5-step accountability loop, and clear boundaries panel. |
| **1:00 - 2:00** | **File a Grievance** | `/grievances/report` | 4-step wizard: Pick category, click OpenStreetMap to place GPS pin, toggle anonymous whistleblower mode, review & generate `GS360-2026-XXXXXX` tracking ID. |
| **2:00 - 2:45** | **Track Lifecycle** | `/grievances/track` | Enter or click a sample ID (e.g. `GS360-2026-881024`). Observe 5-stage SLA timeline (Received &rarr; Resolved). |
| **2:45 - 3:45** | **Explore Modules** | `/flood` & `/ration` | `/flood`: Interactive Leaflet sensor map (Normal / Warning / Critical) and working SMS alert subscription form.<br>`/ration`: Interactive NFSA grain entitlement calculator and weighment discrepancy logger. |
| **3:45 - 4:30** | **Youth & Schemes** | `/youth` & `/schemes` | `/youth`: 8-module digital literacy curriculum, volunteer missions board, and youth leaderboard.<br>`/schemes`: Directory of 6 verified flagship schemes linking directly to `.gov.in` portals. |
| **4:30 - 5:00** | **Data & Export** | `/dashboard` | Village dropdown filter, SVG visual charts, and click **"Download Sample CSV"** to verify client-side export. |

---

## 3. Honest Labeling: What is Live vs. What is Sample

| Feature | Classification | Description |
|---|---|---|
| **Form Submissions & ID Generation** | **LIVE (Local)** | Forms run real validations, persist to `localStorage`, and generate retrievable `GS360-YYYY-XXXXXX` IDs. |
| **Bilingual Language Engine (EN/हिंदी)** | **LIVE** | 100% working dictionary translation across all navigation, hero, and form labels. |
| **Global ⌘K / Ctrl+K Search** | **LIVE** | Instant indexing of modules, sample grievances, schemes, and villages. |
| **Leaflet OpenStreetMap** | **LIVE** | Real interactive OpenStreetMap tiles with pin placement and GPS coordinate picker. |
| **CSV Report Generator** | **LIVE** | Real client-side CSV file download generated from current village metrics. |
| **Ultrasonic River & Bin Telemetry** | **SAMPLE DATA** | 15 flood gauges and 20 waste bins simulated for realistic demonstration. |
| **PDS Stock Ledger & Leaderboard** | **SAMPLE DATA** | Fair Price Shop inventory and volunteer leaderboard configured as demo data. |
| **Central Portals (PMGSY, JJM, NFSA)** | **LIVE LINKS** | Authentic external links opening official government portals with `rel="noopener noreferrer"`. |
