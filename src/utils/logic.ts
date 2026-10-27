import { Grievance, FloodSensor, WasteBin, Streetlight, Village } from '../types';

/**
 * Generates tracking ID in standard format GS360-YYYY-XXXXXX
 */
export function generateTrackingId(year = 2026): string {
  const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
  return `GS360-${year}-${randomSixDigit}`;
}

/**
 * Validates tracking ID format
 */
export function isValidTrackingId(id: string): boolean {
  return /^GS360-\d{4}-\d{6}$/.test(id.trim());
}

/**
 * Sanitizes user input to prevent XSS and script injection
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Calculate NFSA illustrative entitlement
 * Antyodaya Anna Yojana (AAY): Fixed 35 kg per family per month
 * Priority Household (PHH): 5 kg per member per month
 */
export interface EntitlementResult {
  cardType: 'AAY' | 'PHH' | 'NPHH';
  familyMembers: number;
  totalGrainsKg: number;
  wheatKg: number;
  riceKg: number;
  sugarKg: number;
  pricePerKgNote: string;
  legalNote: string;
}

export function calculateEntitlement(cardType: 'AAY' | 'PHH' | 'NPHH', familyMembers: number): EntitlementResult {
  const members = Math.max(1, Math.min(20, familyMembers));
  
  if (cardType === 'AAY') {
    return {
      cardType: 'AAY',
      familyMembers: members,
      totalGrainsKg: 35,
      wheatKg: 14,
      riceKg: 21,
      sugarKg: 1,
      pricePerKgNote: "Under Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY), food grains under NFSA are provided FREE of cost.",
      legalNote: "Entitlement as per National Food Security Act (NFSA), 2013 rules. This calculator is illustrative and non-binding."
    };
  } else if (cardType === 'PHH') {
    const total = members * 5;
    const wheat = members * 2;
    const rice = members * 3;
    return {
      cardType: 'PHH',
      familyMembers: members,
      totalGrainsKg: total,
      wheatKg: wheat,
      riceKg: rice,
      sugarKg: 0,
      pricePerKgNote: "Provided FREE of cost under PMGKAY extension guidelines.",
      legalNote: "Entitlement as per National Food Security Act (NFSA), 2013 rules (5kg per person). Illustrative only."
    };
  } else {
    return {
      cardType: 'NPHH',
      familyMembers: members,
      totalGrainsKg: 0,
      wheatKg: 0,
      riceKg: 0,
      sugarKg: 0,
      pricePerKgNote: "Non-Priority cardholders are not covered under subsidised central NFSA quotas unless notified by State policy.",
      legalNote: "State-specific Non-Priority Household guidelines apply. Consult local Block Supply Office."
    };
  }
}

/**
 * Calculates dashboard statistics from village & grievance data
 */
export function calculateDashboardStats(
  villageId: string | 'all',
  villages: Village[],
  grievances: Grievance[],
  floodSensors: FloodSensor[],
  wasteBins: WasteBin[],
  streetlights: Streetlight[]
) {
  const filteredGrievances = villageId === 'all'
    ? grievances
    : grievances.filter(g => g.villageId === villageId);

  const filteredSensors = villageId === 'all'
    ? floodSensors
    : floodSensors.filter(s => s.villageId === villageId);

  const filteredBins = villageId === 'all'
    ? wasteBins
    : wasteBins.filter(b => b.villageId === villageId);

  const filteredLights = villageId === 'all'
    ? streetlights
    : streetlights.filter(l => l.villageId === villageId);

  const totalGrievances = filteredGrievances.length;
  const resolvedGrievances = filteredGrievances.filter(g => g.status === 'resolved').length;
  const inProgressGrievances = filteredGrievances.filter(g => g.status === 'in_progress').length;
  const pendingGrievances = filteredGrievances.filter(g => g.status === 'received' || g.status === 'acknowledged' || g.status === 'assigned').length;
  const resolutionRate = totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 100) : 0;

  // Category counts
  const categoryCounts: Record<string, number> = {
    roads: 0,
    water: 0,
    sanitation: 0,
    lighting: 0,
    flood: 0,
    ration: 0,
    health: 0,
    other: 0
  };
  filteredGrievances.forEach(g => {
    categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1;
  });

  // Critical alerts count
  const criticalSensors = filteredSensors.filter(s => s.status === 'critical').length;
  const warningSensors = filteredSensors.filter(s => s.status === 'warning').length;
  const fullBins = filteredBins.filter(b => b.status === 'full' || b.status === 'overdue').length;
  const faultyLights = filteredLights.filter(l => l.status === 'faulty' || l.status === 'under_maintenance').length;

  return {
    totalGrievances,
    resolvedGrievances,
    inProgressGrievances,
    pendingGrievances,
    resolutionRate,
    categoryCounts,
    criticalSensors,
    warningSensors,
    fullBins,
    faultyLights,
    totalSensors: filteredSensors.length,
    totalBins: filteredBins.length,
    totalLights: filteredLights.length
  };
}

/**
 * Generates downloadable CSV content of village progress & issues
 */
export function generateVillageReportCSV(villageName: string, grievances: Grievance[]): string {
  const headers = [
    "Tracking ID",
    "Village",
    "Category",
    "Severity",
    "Status",
    "Created Date",
    "Last Updated",
    "Assigned Department",
    "Description",
    "Data Type"
  ];

  const rows = grievances.map(g => [
    `"${g.id}"`,
    `"${g.villageName}"`,
    `"${g.category}"`,
    `"${g.severity}"`,
    `"${g.status}"`,
    `"${g.createdAt}"`,
    `"${g.updatedAt}"`,
    `"${g.assignedDepartment.replace(/"/g, '""')}"`,
    `"${g.description.replace(/"/g, '""')}"`,
    `"${g.isSample ? 'SAMPLE DATA' : 'USER SUBMITTED'}"`
  ]);

  return [
    `# GRAM Sathi 360 - Civic Action Report`,
    `# Target Village: ${villageName}`,
    `# Generated At: ${new Date().toISOString()}`,
    `# Notice: Sample demonstrative report submitted for MY Bharat consideration`,
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');
}

/**
 * Triggers browser download of text/CSV content
 */
export function downloadTextFile(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
