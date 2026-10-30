// Accuracy checks for AI-generated notes, asserted against the source record.
// Each check returns a list of human-readable issues; an empty list means the check passed.

type Medication = { name: string; status: string; source: string; startDate?: string; endDate?: string | null };
type Problem = { name: string; status: string };
export type PatientRecord = { name: string; lastVisit: string; medications: Medication[]; problems: Problem[] };
export type Notes = { text: string; sections: { medications: Medication[]; problems: Problem[]; lastVisit: string } };

export type IssueType = 'omission' | 'hallucination' | 'status' | 'date';
export type Issue = { type: IssueType; detail: string };

// One entry per course: a drug prescribed twice is two entries, told apart by its dates.
const course = (m: Medication) => `${m.name}|${m.startDate}|${m.endDate}`;
const tally = (meds: Medication[]) => {
  const counts = new Map<string, number>();
  for (const m of meds) counts.set(course(m), (counts.get(course(m)) ?? 0) + 1);
  return counts;
};
// Takes one matching course out of the tally; false when none is left.
const take = (counts: Map<string, number>, m: Medication) => {
  const left = counts.get(course(m)) ?? 0;
  counts.set(course(m), left - 1);
  return left > 0;
};

// Completeness: every medication and problem in the record must appear, in the data and in the prose.
export function findOmissions(record: PatientRecord, notes: Notes): Issue[] {
  const shown = tally(notes.sections.medications);
  const issues: Issue[] = [];
  for (const m of record.medications) {
    if (!take(shown, m)) issues.push({ type: 'omission', detail: `medication missing: ${m.name}` });
    else if (!notes.text.includes(m.name)) issues.push({ type: 'omission', detail: `medication not in text: ${m.name}` });
  }
  for (const p of record.problems) {
    if (!notes.sections.problems.some((s) => s.name === p.name)) issues.push({ type: 'omission', detail: `problem missing: ${p.name}` });
  }
  return issues;
}

// No unsupported statements: nothing may be listed that the record does not contain.
export function findHallucinations(record: PatientRecord, notes: Notes): Issue[] {
  const known = tally(record.medications);
  return notes.sections.medications
    .filter((m) => !take(known, m))
    .map((m) => ({ type: 'hallucination' as const, detail: `medication not in record: ${m.name}` }));
}

// Status and provenance: an expired drug shown as current is a clinical safety issue.
export function findStatusErrors(record: PatientRecord, notes: Notes): Issue[] {
  const issues: Issue[] = [];
  for (const m of notes.sections.medications) {
    const source = record.medications.find((r) => course(r) === course(m));
    if (!source) continue; // reported as a hallucination instead
    if (source.status !== m.status) issues.push({ type: 'status', detail: `${m.name}: record says ${source.status}, notes say ${m.status}` });
    if (source.source === 'external clinic' && !notes.text.includes('external clinic')) {
      issues.push({ type: 'status', detail: `${m.name}: external medication not labelled as external` });
    }
  }
  for (const p of notes.sections.problems) {
    const source = record.problems.find((r) => r.name === p.name);
    if (source && source.status !== p.status) issues.push({ type: 'status', detail: `${p.name}: record says ${source.status}, notes say ${p.status}` });
  }
  return issues;
}

export function findDateErrors(record: PatientRecord, notes: Notes): Issue[] {
  return notes.sections.lastVisit === record.lastVisit && notes.text.includes(record.lastVisit)
    ? []
    : [{ type: 'date', detail: `last visit: record ${record.lastVisit}, notes ${notes.sections.lastVisit}` }];
}

export function checkNotes(record: PatientRecord, notes: Notes): Issue[] {
  return [
    ...findOmissions(record, notes),
    ...findHallucinations(record, notes),
    ...findStatusErrors(record, notes),
    ...findDateErrors(record, notes),
  ];
}
