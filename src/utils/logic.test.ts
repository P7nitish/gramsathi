import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTrackingId,
  isValidTrackingId,
  sanitizeInput,
  calculateEntitlement,
  calculateDashboardStats,
  generateVillageReportCSV
} from './logic';
import { mockVillages, mockGrievances, mockFloodSensors, mockWasteBins, mockStreetlights } from '../mockData';

test('generateTrackingId produces expected GS360 format', () => {
  const id = generateTrackingId(2026);
  assert.match(id, /^GS360-2026-\d{6}$/);
  assert.equal(isValidTrackingId(id), true);
});

test('isValidTrackingId rejects invalid formats', () => {
  assert.equal(isValidTrackingId('GS360-ABC-123456'), false);
  assert.equal(isValidTrackingId('12345'), false);
  assert.equal(isValidTrackingId(''), false);
  assert.equal(isValidTrackingId('GS360-2026-12345'), false); // only 5 digits
  assert.equal(isValidTrackingId('GS360-2026-1234567'), false); // 7 digits
  assert.equal(isValidTrackingId('GS360-2026-881024'), true);
});

test('sanitizeInput strips dangerous tags and trims whitespace', () => {
  const dirty = '  <script>alert("hack")</script> Broken road at chaupal  ';
  const clean = sanitizeInput(dirty);
  assert.equal(clean, 'scriptalert("hack")/script Broken road at chaupal');
  assert.equal(sanitizeInput(''), '');
});

test('calculateEntitlement computes accurate AAY and PHH quota', () => {
  const aayResult = calculateEntitlement('AAY', 4);
  assert.equal(aayResult.totalGrainsKg, 35);
  assert.equal(aayResult.wheatKg, 14);
  assert.equal(aayResult.riceKg, 21);
  assert.equal(aayResult.sugarKg, 1);

  const phhResult = calculateEntitlement('PHH', 5);
  assert.equal(phhResult.totalGrainsKg, 25); // 5 members * 5kg
  assert.equal(phhResult.wheatKg, 10);
  assert.equal(phhResult.riceKg, 15);

  const nphhResult = calculateEntitlement('NPHH', 3);
  assert.equal(nphhResult.totalGrainsKg, 0);
});

test('calculateDashboardStats produces consistent counts', () => {
  const stats = calculateDashboardStats(
    'all',
    mockVillages,
    mockGrievances,
    mockFloodSensors,
    mockWasteBins,
    mockStreetlights
  );

  assert.equal(stats.totalGrievances, mockGrievances.length);
  assert.equal(stats.totalSensors, mockFloodSensors.length);
  assert.equal(stats.totalBins, mockWasteBins.length);
  assert.equal(stats.totalLights, mockStreetlights.length);
  assert.ok(stats.resolutionRate >= 0 && stats.resolutionRate <= 100);
});

test('generateVillageReportCSV outputs proper headers and rows', () => {
  const csv = generateVillageReportCSV('Rampur Kalan', [mockGrievances[0]]);
  assert.ok(csv.includes('GRAM Sathi 360 - Civic Action Report'));
  assert.ok(csv.includes('Rampur Kalan'));
  assert.ok(csv.includes('Tracking ID'));
  assert.ok(csv.includes(mockGrievances[0].id));
});
