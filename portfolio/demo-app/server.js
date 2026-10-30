// Tiny demo server for the fictional patient record app. Node standard library only.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { DEMO_TODAY, endDateFor, medicationStatus, stopMedication } from './medications.js';
import { generateNotes } from './notes.js';

const PORT = Number(process.env.PORT ?? 4173);
const dir = new URL('.', import.meta.url);
const templates = JSON.parse(await readFile(new URL('patients.json', dir), 'utf8'));
const patients = new Map(Object.entries(structuredClone(templates)));
let nextId = 1;

const catalogue = [
  { id: 'amoxicillin', name: 'Amoxicillin 250mg tablet' },
  { id: 'carprofen', name: 'Carprofen 75mg tablet' },
  { id: 'cephalexin', name: 'Cephalexin 500mg capsule' },
  { id: 'gabapentin', name: 'Gabapentin 100mg capsule' },
  { id: 'meloxicam', name: 'Meloxicam 0.5mg/ml oral suspension' },
  { id: 'methimazole', name: 'Methimazole 2.5mg tablet' },
];
const SAVE_DELAY_MS = 1500; // a slow save on purpose: tests must wait on the result, not on a timer

// Status is always worked out from the dates, never stored, so it cannot go stale.
const withStatus = (id, p) => ({
  id,
  ...p,
  today: DEMO_TODAY,
  medications: p.medications.map((m) => ({ ...m, status: medicationStatus(m) })),
});

const send = (res, status, body, type = 'application/json') => {
  res.writeHead(status, { 'content-type': type });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
};

const readBody = async (req) => {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
};

const routes = [
  ['GET', /^\/$/, async (req, res) => send(res, 200, await readFile(new URL('index.html', dir)), 'text/html')],
  ['GET', /^\/medications\.js$/, async (req, res) => send(res, 200, await readFile(new URL('medications.js', dir)), 'text/javascript')],

  ['GET', /^\/api\/medications$/, (req, res, url) => {
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    send(res, 200, catalogue.filter((m) => m.name.toLowerCase().includes(q)));
  }],

  ['GET', /^\/api\/patients$/, (req, res) => send(res, 200, [...patients].map(([id, p]) => ({ id, name: p.name, species: p.species })))],

  // Tests create their own patient from a template, so they never share or change each other's data.
  ['POST', /^\/api\/patients$/, async (req, res) => {
    const { from } = await readBody(req);
    if (!templates[from]) return send(res, 400, { error: `Unknown template: ${from}` });
    const id = `${from}-${nextId++}`;
    patients.set(id, structuredClone(templates[from]));
    send(res, 201, withStatus(id, patients.get(id)));
  }],

  ['GET', /^\/api\/patients\/([\w-]+)$/, (req, res, url, [id]) => send(res, 200, withStatus(id, patients.get(id)))],

  ['POST', /^\/api\/patients\/([\w-]+)\/medications$/, async (req, res, url, [id]) => {
    const { medicationId, durationDays = null, startDate = DEMO_TODAY } = await readBody(req);
    const drug = catalogue.find((m) => m.id === medicationId);
    if (!drug) return send(res, 400, { error: `Unknown medication: ${medicationId}` });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return send(res, 400, { error: 'startDate must be YYYY-MM-DD' });
    const medication = { name: drug.name, startDate, endDate: endDateFor(startDate, durationDays), source: 'this clinic' };
    patients.get(id).medications.push(medication);
    await new Promise((r) => setTimeout(r, SAVE_DELAY_MS));
    send(res, 201, withStatus(id, patients.get(id)));
  }],

  ['POST', /^\/api\/patients\/([\w-]+)\/medications\/(\d+)\/stop$/, (req, res, url, [id, i]) => {
    const meds = patients.get(id).medications;
    if (!meds[i]) return send(res, 404, { error: 'No such medication' });
    meds[i] = stopMedication(meds[i]);
    send(res, 200, withStatus(id, patients.get(id)));
  }],

  ['POST', /^\/api\/patients\/([\w-]+)\/problems\/(\d+)\/resolve$/, (req, res, url, [id, i]) => {
    const problems = patients.get(id).problems;
    if (!problems[i]) return send(res, 404, { error: 'No such problem' });
    problems[i].status = 'resolved';
    send(res, 200, withStatus(id, patients.get(id)));
  }],

  ['GET', /^\/api\/patients\/([\w-]+)\/notes$/, (req, res, url, [id]) => {
    const model = url.searchParams.get('model') ?? 'v2';
    const seed = Number(url.searchParams.get('seed') ?? 0);
    send(res, 200, generateNotes(withStatus(id, patients.get(id)), { model, seed }));
  }],
];

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    for (const [method, pattern, handler] of routes) {
      const match = req.method === method && url.pathname.match(pattern);
      if (!match) continue;
      const params = match.slice(1);
      if (url.pathname.startsWith('/api/patients/') && !patients.has(params[0])) return send(res, 404, { error: 'No such patient' });
      return await handler(req, res, url, params);
    }
    send(res, 404, { error: 'Not found' });
  } catch (err) {
    send(res, err instanceof RangeError || err instanceof SyntaxError ? 400 : 500, { error: err.message });
  }
}).listen(PORT, () => console.log(`Patient record demo on http://localhost:${PORT}`));
