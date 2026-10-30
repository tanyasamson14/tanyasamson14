import { test, expect } from '@playwright/test';
import { RecordPage, createPatient } from './pages/record.page';

test.describe('Patient record API', () => {
  test('the saved record matches what the vet saw on screen', async ({ page, request }) => {
    const id = await createPatient(request, 'bella');
    const record = new RecordPage(page);
    await record.goto(id);
    await record.prescribe('cephalexin', 'cephal', 7);
    const shownEnd = await record.medication('Cephalexin').getByTestId('medication-end').textContent();

    const saved = await (await request.get(`/api/patients/${id}`)).json();
    const cephalexin = saved.medications.find((m: { name: string }) => m.name.startsWith('Cephalexin'));

    expect(cephalexin).toMatchObject({ status: 'active', startDate: '2026-10-29', endDate: shownEnd });
  });

  test('status is worked out from dates by the server: a course that ended in July is expired', async ({ request }) => {
    const saved = await (await request.get('/api/patients/bella')).json();

    expect(saved.medications).toContainEqual(
      expect.objectContaining({ name: 'Amoxicillin 250mg tablet', endDate: '2026-07-29', status: 'expired' }),
    );
  });

  test('a prescription for an unknown medication is rejected', async ({ request }) => {
    const id = await createPatient(request, 'milo');
    const res = await request.post(`/api/patients/${id}/medications`, { data: { medicationId: 'nope' } });

    expect(res.status()).toBe(400);
  });

  test('a course length of zero days is rejected', async ({ request }) => {
    const id = await createPatient(request, 'milo');
    const res = await request.post(`/api/patients/${id}/medications`, { data: { medicationId: 'cephalexin', durationDays: 0 } });

    expect(res.status()).toBe(400);
    expect((await res.json()).error).toContain('durationDays');
  });

  test('an unknown patient returns 404', async ({ request }) => {
    expect((await request.get('/api/patients/nobody')).status()).toBe(404);
  });
});
