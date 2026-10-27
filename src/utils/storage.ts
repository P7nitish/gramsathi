import {
  Grievance,
  FloodAlertSubscription,
  VolunteerRegistration,
  RationDiscrepancyReport,
  AuthUser,
  Language
} from '../types';
import { mockGrievances } from '../mockData';

const STORAGE_KEYS = {
  GRIEVANCES: 'gs360_grievances_v1',
  FLOOD_SUBS: 'gs360_flood_subs_v1',
  VOLUNTEERS: 'gs360_volunteers_v1',
  RATION_REPORTS: 'gs360_ration_reports_v1',
  AUTH_USER: 'gs360_auth_user_v1',
  LANGUAGE: 'gs360_language_v1'
};

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (lang === 'hi' ? 'hi' : 'en');
  } catch {
    return 'en';
  }
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch {
    // ignore
  }
}

export function getAllGrievances(): Grievance[] {
  if (typeof window === 'undefined') return mockGrievances;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GRIEVANCES);
    if (!raw) {
      // Seed with initial mock grievances
      localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(mockGrievances));
      return mockGrievances;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockGrievances;
  } catch {
    return mockGrievances;
  }
}

export function saveGrievance(grievance: Grievance): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getAllGrievances();
    const updated = [grievance, ...current];
    localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving grievance:', err);
  }
}

export function findGrievanceById(id: string): Grievance | undefined {
  const all = getAllGrievances();
  const searchId = id.trim().toUpperCase();
  return all.find(g => g.id.toUpperCase() === searchId);
}

export function saveFloodSubscription(sub: FloodAlertSubscription): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLOOD_SUBS);
    const list: FloodAlertSubscription[] = raw ? JSON.parse(raw) : [];
    list.unshift(sub);
    localStorage.setItem(STORAGE_KEYS.FLOOD_SUBS, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving flood sub:', err);
  }
}

export function getFloodSubscriptions(): FloodAlertSubscription[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLOOD_SUBS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveVolunteerRegistration(vol: VolunteerRegistration): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    const list: VolunteerRegistration[] = raw ? JSON.parse(raw) : [];
    list.unshift(vol);
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving volunteer:', err);
  }
}

export function getVolunteerRegistrations(): VolunteerRegistration[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRationDiscrepancy(report: RationDiscrepancyReport): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RATION_REPORTS);
    const list: RationDiscrepancyReport[] = raw ? JSON.parse(raw) : [];
    list.unshift(report);
    localStorage.setItem(STORAGE_KEYS.RATION_REPORTS, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving ration report:', err);
  }
}

export function getRationDiscrepancies(): RationDiscrepancyReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RATION_REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuthUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    }
  } catch {
    // ignore
  }
}
