// Characterisation tests for medication course rules. Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { endDateFor, medicationStatus, stopMedication } from '../../demo-app/medications.js';

const today = '2026-10-29';

// Scenarios as data: each row is one rule a reviewer can read without the code.
const endDates = [
  { name: 'one-day course ends the day it starts', start: '2026-10-29', days: 1, end: '2026-10-29' },
  { name: 'ten-day course counts the start day as day one', start: '2026-10-29', days: 10, end: '2026-11-07' },
  { name: 'course runs across a month end', start: '2026-10-25', days: 14, end: '2026-11-07' },
  { name: 'course runs across a year end', start: '2026-12-28', days: 7, end: '2027-01-03' },
  { name: 'no duration means long-term', start: '2026-10-29', days: null, end: null },
];

for (const { name, start, days, end } of endDates) {
  test(`endDateFor: ${name}`, () => assert.equal(endDateFor(start, days), end));
}

test('endDateFor rejects zero, negative and part days', () => {
  for (const bad of [0, -3, 1.5]) assert.throws(() => endDateFor(today, bad), RangeError);
});

const statuses = [
  { name: 'last day of the course is still active', med: { startDate: '2026-10-20', endDate: today }, status: 'active' },
  { name: 'course that ended yesterday is expired', med: { startDate: '2026-10-20', endDate: '2026-10-28' }, status: 'expired' },
  { name: 'course starting tomorrow is scheduled', med: { startDate: '2026-10-30', endDate: '2026-11-05' }, status: 'scheduled' },
  { name: 'long-term medication stays active', med: { startDate: '2025-01-01', endDate: null }, status: 'active' },
  { name: 'historical course months ago is expired', med: { startDate: '2026-07-20', endDate: '2026-07-29' }, status: 'expired' },
];

for (const { name, med, status } of statuses) {
  test(`medicationStatus: ${name}`, () => assert.equal(medicationStatus(med, today), status));
}

test('stopping a medication makes it expired from today', () => {
  const stopped = stopMedication({ startDate: '2026-10-02', endDate: null }, today);
  assert.equal(stopped.endDate, '2026-10-28');
  assert.equal(medicationStatus(stopped, today), 'expired');
});

test('stopping a course that has not started yet does not leave it scheduled', () => {
  const stopped = stopMedication({ startDate: '2026-11-01', endDate: '2026-11-10' }, today);
  assert.equal(medicationStatus(stopped, today), 'expired');
});
