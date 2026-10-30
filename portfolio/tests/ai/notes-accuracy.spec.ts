import { test, expect, type APIRequestContext } from '@playwright/test';
import { checkNotes, type Issue, type PatientRecord, type Notes } from './checks';
import { RecordPage, createPatient } from '../e2e/pages/record.page';

// The same input can give a different answer each time, so one passing run proves little.
// Every scenario runs RUNS times and we look at the pass rate, not a single result.
const RUNS = 5;
const PATIENTS = ['bella', 'milo', 'pepper'];

const getRecord = async (request: APIRequestContext, id: string): Promise<PatientRecord> =>
  (await request.get(`/api/patients/${id}`)).json();

async function runScenario(request: APIRequestContext, id: string, model: string) {
  const record = await getRecord(request, id);
  const results: Issue[][] = [];
  for (let seed = 0; seed < RUNS; seed++) {
    const res = await request.get(`/api/patients/${id}/notes`, { params: { model, seed } });
    expect(res.ok()).toBeTruthy();
    results.push(checkNotes(record, (await res.json()) as Notes));
  }
  const passed = results.filter((issues) => issues.length === 0).length;
  return { passRate: passed / RUNS, issues: results.flat() };
}

test.describe('AI notes accuracy: release candidate (v2)', () => {
  for (const id of PATIENTS) {
    test(`${id}: every run is complete, accurate and hallucination-free`, async ({ request }) => {
      const { passRate, issues } = await runScenario(request, id, 'v2');
      expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
      expect(passRate).toBe(1);
    });
  }

  test('wording varies between runs, so the checks must compare facts, not strings', async ({ request }) => {
    const texts = new Set<string>();
    for (let seed = 0; seed < RUNS; seed++) {
      texts.add((await (await request.get('/api/patients/bella/notes', { params: { seed } })).json()).text);
    }
    expect(texts.size).toBeGreaterThan(1);
  });

  test('a medication prescribed today appears in the notes the vet sees', async ({ page, request }) => {
    const id = await createPatient(request, 'milo');
    const record = new RecordPage(page);
    await record.goto(id);
    await record.prescribe('cephalexin', 'cephal', 10);

    await record.generateNotes();
    await expect(page.getByTestId('notes-medications').getByRole('listitem')).toContainText(['Cephalexin 500mg capsule (active)']);

    const notes = await (await request.get(`/api/patients/${id}/notes`)).json();
    expect(checkNotes(await getRecord(request, id), notes)).toEqual([]);
  });
});

test('notes are cleared when the record changes, so out-of-date notes are never on screen', async ({ page, request }) => {
  const record = new RecordPage(page);
  await record.goto(await createPatient(request, 'bella'));
  await record.generateNotes();
  await record.stop('Carprofen 75mg tablet');

  await expect(record.notes).toBeHidden();
});

// Found in exploratory testing: a drug prescribed twice is two entries, and each one counts.
test.describe('The checks handle a drug prescribed twice', () => {
  const active = { name: 'Cephalexin 500mg capsule', startDate: '2026-10-29', endDate: '2026-11-02', source: 'this clinic', status: 'active' };
  const stopped = { ...active, endDate: '2026-10-28', status: 'expired' };
  const record = { name: 'Milo', lastVisit: '2026-10-02', problems: [], medications: [active, stopped] };
  const notesWith = (medications: typeof active[]) => ({
    text: `Notes for Milo, cat. Medications: ${medications.map((m) => `${m.name} (${m.status})`).join('; ')}. Last seen 2026-10-02.`,
    sections: { medications, problems: [], lastVisit: '2026-10-02' },
  });

  test('dropping one of the two courses is an omission', () => {
    expect(checkNotes(record, notesWith([active]))).toContainEqual(expect.objectContaining({ type: 'omission' }));
  });

  test('both courses listed in a different order, each with its right status, passes', () => {
    expect(checkNotes(record, notesWith([stopped, active]))).toEqual([]);
  });
});

// Prove the checks work: a known-bad model version must fail, and for the right reasons.
// If someone weakens a check, this block goes red.
test.describe('AI notes accuracy: known-bad version (v1) is caught', () => {
  test('omissions, hallucinations, status and date errors are all detected', async ({ request }) => {
    const found = new Set<string>();
    for (const id of PATIENTS) {
      const { passRate, issues } = await runScenario(request, id, 'v1');
      expect(passRate, `${id} should not pass every run`).toBeLessThan(1);
      issues.forEach((i) => found.add(i.type));
    }
    expect([...found].sort()).toEqual(['date', 'hallucination', 'omission', 'status']);
  });

  test('the known-bad version chosen on screen shows the expired antibiotic as active', async ({ page, request }) => {
    const record = new RecordPage(page);
    await record.goto(await createPatient(request, 'bella'));
    await page.getByTestId('model-version').selectOption('v1');
    await page.getByTestId('model-run').selectOption('3');
    await record.generateNotes();

    await expect(page.getByTestId('notes-medications').getByRole('listitem')).toContainText(['Amoxicillin 250mg tablet (active)']);
    await expect(record.medication('Amoxicillin 250mg tablet').getByTestId('medication-status')).toHaveText('expired');
  });

  test('an expired antibiotic reported as current is flagged by name', async ({ request }) => {
    const res = await request.get('/api/patients/bella/notes', { params: { model: 'v1', seed: 3 } });
    const issues = checkNotes(await getRecord(request, 'bella'), await res.json());
    expect(issues).toContainEqual({
      type: 'status',
      detail: 'Amoxicillin 250mg tablet: record says expired, notes say active',
    });
  });
});
