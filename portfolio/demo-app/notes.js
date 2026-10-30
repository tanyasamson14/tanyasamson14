// A stand-in for an AI service that writes notes. No real model is called: output is built from the
// patient record with seeded wording changes, so tests are free, fast and repeatable.
//
// model "v2" is correct but words things differently on each run, like a real LLM.
// model "v1" has the defect classes found when testing real AI-generated notes:
//   seed 1: drops a medication (omission)
//   seed 2: adds a medication the patient was never prescribed (hallucination)
//   seed 3: reports an expired medication as current (status error)
//   seed 4: gets the last visit date wrong
// The tests in tests/ai/ must pass every v2 run and catch every v1 defect.

const OPENERS = ['Notes for', 'Clinical overview of', 'Patient notes:'];
const MED_LEADS = ['Medications:', 'Current and recent medications:', 'Medication history:'];

function shiftDate(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function generateNotes(patient, { model = 'v2', seed = 0 } = {}) {
  let medications = patient.medications.map((m) => ({ ...m }));
  let lastVisit = patient.lastVisit;
  const defect = model === 'v1' ? seed % 5 : 0;

  if (defect === 1) medications = medications.slice(1);
  if (defect === 2) medications.push({ name: 'Prednisolone 5mg tablet', status: 'active', source: 'this clinic' });
  if (defect === 3) medications = medications.map((m) => (m.status === 'expired' ? { ...m, status: 'active' } : m));
  if (defect === 4) lastVisit = shiftDate(lastVisit, 1);

  // Seeded variation that a correct model is still allowed to have.
  const ordered = seed % 2 ? [...medications].reverse() : medications;
  const problems = patient.problems.map((p) => ({ ...p }));

  const medText = ordered.length
    ? ordered.map((m) => `${m.name} (${m.status}${m.source === 'external clinic' ? ', from an external clinic' : ''})`).join('; ')
    : 'none recorded';
  const text = [
    `${OPENERS[seed % OPENERS.length]} ${patient.name}, ${patient.species.toLowerCase()}.`,
    `${MED_LEADS[seed % MED_LEADS.length]} ${medText}.`,
    `Problems: ${problems.map((p) => `${p.name} (${p.status})`).join('; ')}.`,
    `Last seen ${lastVisit}.`,
  ].join(' ');

  return { model, seed, text, sections: { medications: ordered, problems, lastVisit } };
}
