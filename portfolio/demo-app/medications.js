// Medication course rules for the fictional patient record demo.
// Dates are ISO strings (YYYY-MM-DD), so plain string comparison orders them correctly.

export const DEMO_TODAY = '2026-10-29'; // fixed, so every run and every test sees the same day

export function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// A 10-day course starting on the 1st runs to the 10th: the start day counts as day one.
// No duration means long-term, with no end date.
export function endDateFor(startDate, durationDays) {
  if (durationDays == null) return null;
  if (!Number.isInteger(durationDays) || durationDays < 1) {
    throw new RangeError('durationDays must be a whole number of days, 1 or more');
  }
  return addDays(startDate, durationDays - 1);
}

// The last day of a course is still active. A course that ended yesterday is expired.
// Expired is checked first, so a course stopped before it started is not shown as upcoming.
export function medicationStatus({ startDate, endDate }, today = DEMO_TODAY) {
  if (endDate && today > endDate) return 'expired';
  if (today < startDate) return 'scheduled';
  return 'active';
}

// Stopping a medication ends the course yesterday, so it is expired from today.
export function stopMedication(medication, today = DEMO_TODAY) {
  return { ...medication, endDate: addDays(today, -1) };
}
