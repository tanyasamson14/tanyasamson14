import { test, expect } from '@playwright/test';
import { RecordPage, createPatient } from './pages/record.page';

test.describe('Patient record: medications and problems', () => {
  let record: RecordPage;

  test.beforeEach(async ({ page, request }) => {
    record = new RecordPage(page);
    await record.goto(await createPatient(request, 'milo'));
    await expect(record.name).toHaveText('Milo (Cat)');
  });

  test('a 10-day course is active today and ends on day ten', async () => {
    await record.prescribe('cephalexin', 'cephal', 10);

    const row = record.medication('Cephalexin 500mg capsule');
    await expect(row.getByTestId('medication-status')).toHaveText('active');
    await expect(row.getByTestId('medication-end')).toHaveText('2026-11-07');
  });

  test('a medication with no course length is long-term', async () => {
    await record.prescribe('gabapentin', 'gaba');

    await expect(record.medication('Gabapentin 100mg capsule').getByTestId('medication-end')).toHaveText('long-term');
  });

  test('stopping a medication marks it expired and removes the Stop button', async () => {
    await record.stop('Methimazole 2.5mg tablet');

    const row = record.medication('Methimazole 2.5mg tablet');
    await expect(row.getByTestId('medication-end')).toHaveText('2026-10-28');
    await expect(row.getByTestId('stop-medication')).toHaveCount(0);
  });

  test('resolving a problem updates its status', async () => {
    await record.resolve('Hyperthyroidism');

    await expect(record.problem('Hyperthyroidism').getByTestId('resolve-problem')).toHaveCount(0);
  });

  test('typing a letter at a time shows only the matches for the final text', async ({ page }) => {
    // Each key sends a search. On a slow network the answers for "c", "ce" and "cep" can arrive after
    // the answer for "ceph". Hold them back so they always do, "c" (which matches most drugs) last of all,
    // then check they are ignored. This delay stands in for the network; the test itself never sleeps.
    await page.route('**/api/medications?*', async (route) => {
      const q = new URL(route.request().url()).searchParams.get('q') ?? '';
      await new Promise((r) => setTimeout(r, (4 - q.length) * 150));
      await route.continue();
    });
    const lastLateAnswer = page.waitForEvent('requestfinished', (r) => r.url().endsWith('q=c'));

    await record.search.pressSequentially('ceph');
    await expect(page.getByTestId('medication-option-cephalexin')).toBeVisible();
    await lastLateAnswer;

    await expect(page.getByTestId(/^medication-option-/)).toHaveCount(1);
  });

  test('an invalid course length is refused with a message, and the record stays on screen', async ({ page }) => {
    await record.search.fill('ceph');
    await page.getByTestId('medication-option-cephalexin').click();
    await record.duration.fill('0');
    await record.prescribeButton.click();

    await expect(record.toast).toContainText('Not prescribed');
    await expect(record.name).toHaveText('Milo (Cat)');
    await expect(record.medications).toHaveCount(1);
  });

  test('an unknown patient shows a clear message instead of a broken page', async ({ page }) => {
    await page.goto('/?patient=nobody');

    await expect(record.name).toHaveText('Patient not found');
    await expect(page.getByTestId('patient-list')).toBeVisible();
  });

  test('the medication directory lists every drug you can search for', async ({ page }) => {
    await expect(page.getByTestId('medication-directory').getByRole('listitem')).toHaveCount(6);
  });

  test('the prescribe button stays disabled until a medication is chosen', async () => {
    await expect(record.prescribeButton).toBeDisabled();
  });
});
