export type Language = 'en' | 'hi';

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'received' | 'acknowledged' | 'assigned' | 'in_progress' | 'resolved';

export interface Village {
  id: string;
  name: string;
  nameHi: string;
  panchayat: string;
  block: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  activeIssuesCount: number;
  resolvedIssuesCount: number;
  cleanlinessScore: number; // 0-100
  isSample: true;
}

export interface GrievanceTimelineEvent {
  step: IssueStatus;
  label: string;
  timestamp: string;
  officerOrDept?: string;
  remarks?: string;
}

export interface Grievance {
  id: string; // GS360-YYYY-XXXXXX
  title: string;
  titleHi?: string;
  description: string;
  category: 'roads' | 'water' | 'sanitation' | 'lighting' | 'flood' | 'ration' | 'health' | 'other';
  severity: Severity;
  status: IssueStatus;
  villageId: string;
  villageName: string;
  locationDetails: string;
  lat?: number;
  lng?: number;
  reporterName?: string;
  reporterPhone?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  assignedDepartment: string;
  timeline: GrievanceTimelineEvent[];
  photoUrl?: string;
  isSample: boolean;
}

export interface FloodSensor {
  id: string;
  sensorCode: string;
  villageId: string;
  villageName: string;
  waterBody: string;
  currentLevelMeters: number;
  warningThresholdMeters: number;
  dangerThresholdMeters: number;
  status: 'normal' | 'warning' | 'critical';
  batteryPercent: number;
  lastUpdated: string;
  lat: number;
  lng: number;
  isSample: true;
}

export interface FloodAlertSubscription {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  villageId: string;
  alertTypes: string[];
  createdAt: string;
}

export interface WasteBin {
  id: string;
  binCode: string;
  location: string;
  villageId: string;
  villageName: string;
  fillPercentage: number;
  wasteType: 'organic' | 'dry_recyclable' | 'hazardous' | 'general';
  status: 'empty' | 'half' | 'full' | 'overdue';
  lastCleaned: string;
  lastSensorReading: string;
  lat: number;
  lng: number;
  isSample: true;
}

export interface Streetlight {
  id: string;
  poleCode: string;
  villageId: string;
  villageName: string;
  location: string;
  type: 'solar_led' | 'grid_connected' | 'high_mast';
  wattage: number;
  status: 'operational' | 'faulty' | 'under_maintenance';
  lastInspected: string;
  assignedTechnician?: string;
  faultDetails?: string;
  lat: number;
  lng: number;
  isSample: true;
}

export interface RationShop {
  id: string;
  fpsCode: string;
  dealerName: string;
  villageId: string;
  villageName: string;
  location: string;
  activeCardsCount: number;
  currentWheatStockKg: number;
  currentRiceStockKg: number;
  currentSugarStockKg: number;
  lastDistributionDate: string;
  isSample: true;
}

export interface RationDiscrepancyReport {
  id: string;
  villageId: string;
  fpsCode: string;
  commodity: 'rice' | 'wheat' | 'sugar' | 'kerosene' | 'edible_oil';
  expectedQtyKg: number;
  measuredQtyKg: number;
  date: string;
  cardType: 'AAY' | 'PHH' | 'NPHH';
  notes: string;
  status: 'under_investigation' | 'verified' | 'addressed' | 'rejected';
  createdAt: string;
  isSample: boolean;
}

export interface GovernmentScheme {
  id: string;
  code: string;
  name: string;
  nameHi: string;
  ministry: string;
  objective: string;
  eligibilitySummary: string;
  benefitsSummary: string;
  officialPortalUrl: string;
  category: 'housing' | 'water_sanitation' | 'agriculture' | 'energy' | 'employment' | 'infrastructure';
  sourceVerified: string;
  isSample: true;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  titleHi: string;
  cause: 'digital_literacy' | 'flood_prep' | 'waste_segregation' | 'road_audit' | 'ration_assistance';
  villageId: string;
  villageName: string;
  duration: string;
  requiredSkills: string[];
  slotsAvailable: number;
  coordinator: string;
  contactEmail: string;
  isSample: true;
}

export interface VolunteerRegistration {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  villageId: string;
  phone: string;
  email: string;
  skills: string[];
  availability: string;
  opportunityId?: string;
  createdAt: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  village: string;
  points: number;
  issuesAudited: number;
  digitalLiteracyHours: number;
  badge: string;
  isSample: true;
}

export interface AuthUser {
  name: string;
  email: string;
  role: 'citizen' | 'youth_volunteer' | 'panchayat_admin' | 'nodal_officer';
  villageId?: string;
  token?: string;
}
