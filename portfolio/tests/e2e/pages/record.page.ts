import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test';

// Each test gets its own patient, copied from a template, so tests never share data.
export async function createPatient(request: APIRequestContext, from: 'bella' | 'milo' | 'pepper') {
  const res = await request.post('/api/patients', { data: { from } });
  expect(res.status()).toBe(201);
  return (await res.json()).id as string;
}

// Page object for the patient record screen. Every locator is a data-testid.
export class RecordPage {
  readonly name: Locator;
  readonly medications: Locator;
  readonly problems: Locator;
  readonly search: Locator;
  readonly selected: Locator;
  readonly duration: Locator;
  readonly prescribeButton: Locator;
  readonly toast: Locator;
  readonly generateNotesButton: Locator;
  readonly notes: Locator;
  readonly disclaimer: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByTestId('patient-name');
    this.medications = page.getByTestId('medication-row');
    this.problems = page.getByTestId('problem-row');
    this.search = page.getByTestId('medication-search');
    this.selected = page.getByTestId('selected-medication');
    this.duration = page.getByTestId('prescription-duration');
    this.prescribeButton = page.getByTestId('prescribe');
    this.toast = page.getByTestId('toast');
    this.generateNotesButton = page.getByTestId('generate-notes');
    this.notes = page.getByTestId('ai-notes');
    this.disclaimer = page.getByTestId('ai-disclaimer');
  }

  async goto(patientId: string) {
    await this.page.goto(`/?patient=${patientId}`);
    await expect(this.medications.first()).toBeVisible();
  }

  medication(name: string) {
    return this.medications.filter({ hasText: name });
  }

  problem(name: string) {
    return this.problems.filter({ hasText: name });
  }

  // The save takes 1.5 s on purpose. We wait on the toast and the new row, never on a timer.
  async prescribe(medicationId: string, searchText: string, durationDays?: number) {
    const before = await this.medications.count();
    await this.search.fill(searchText);
    await this.page.getByTestId(`medication-option-${medicationId}`).click();
    await expect(this.selected).not.toHaveText('none');
    if (durationDays) await this.duration.fill(String(durationDays));
    await this.prescribeButton.click();
    await expect(this.toast).toContainText('prescribed', { timeout: 5_000 });
    await expect(this.medications).toHaveCount(before + 1);
  }

  async stop(name: string) {
    await this.medication(name).getByTestId('stop-medication').click();
    await expect(this.medication(name).getByTestId('medication-status')).toHaveText('expired');
  }

  async resolve(name: string) {
    await this.problem(name).getByTestId('resolve-problem').click();
    await expect(this.problem(name).getByTestId('problem-status')).toHaveText('resolved');
  }

  async generateNotes() {
    await this.generateNotesButton.click();
    await expect(this.disclaimer).toBeVisible();
    return (await this.notes.textContent())!;
  }
}
