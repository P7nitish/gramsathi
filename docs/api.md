# GRAM Sathi 360° — API Specifications & Contracts

All endpoints are designed following RESTful patterns. In this demonstration deployment, endpoints are consumed via the internal `storage.ts` service interface with realistic latency simulation.

---

### 1. Grievance Redressal Endpoints

#### `POST /api/v1/grievances`
Registers a new citizen complaint.

**Request Payload:**
```json
{
  "title": "Culvert masonry collapsing on Rampur-Sitapur link road",
  "description": "Wing wall damaged after flash downpour...",
  "category": "roads",
  "severity": "critical",
  "villageId": "VIL-01",
  "locationDetails": "500m ahead of Primary School",
  "lat": 27.5698,
  "lng": 80.6845,
  "isAnonymous": false,
  "reporterName": "Mahesh Prasad",
  "reporterPhone": "+91 98390 XXXXX",
  "photoUrl": "data:image/jpeg;base64,..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "trackingId": "GS360-2026-881024",
  "status": "received",
  "assignedDepartment": "Rural Engineering Services (RES / PWD)",
  "createdAt": "2026-10-27T08:00:00Z"
}
```

#### `GET /api/v1/grievances/:id`
Retrieves timeline milestones and status for a given tracking ID.

---

### 2. Flood & Disaster Telemetry

#### `GET /api/v1/sensors/flood`
Retrieves live ultrasonic water-level readings across all pilot nodes.

**Query Parameters:**
- `status`: `all` | `normal` | `warning` | `critical`
- `villageId`: Optional village ID filter.

#### `POST /api/v1/alerts/flood/subscribe`
Enrolls a citizen phone number for SMS and voice broadcasts.

---

### 3. Fair Price Shop & Ration Audit

#### `POST /api/v1/ration/discrepancies`
Logs weighment shortfall observations for vigilance committees.

---

### 4. Youth Volunteering

#### `POST /api/v1/volunteers/register`
Enrolls a youth volunteer under MY Bharat.
