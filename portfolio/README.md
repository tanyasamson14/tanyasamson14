# Portfolio: Tanya Samson

![tests](https://github.com/tanyasamson14/portfolio/actions/workflows/tests.yml/badge.svg)

Samples of my work across **AI output testing, quality engineering, business analysis and product delivery**:
how I test AI-generated clinical content, how I write acceptance criteria and run go/no-go, and runnable test
code you can try in five minutes.

My professional work lives in private company repositories, so everything here is either **recreated against a
fictional demo app** or **written up without company names, code or data**. The approach and reasoning are the
real thing.

The demo app is a deliberately small test target: one web page and a tiny Node server, about 490 lines. It is
not a product. It exists so the tests have a stable, clinical-style record to run against. The test design, the
CI pipeline and the AI accuracy checks are the point.

## What's in here

### 1. AI output testing and AI tooling

| Sample | Shows |
| --- | --- |
| [Testing AI-Generated Clinical Output](docs/ai-output-testing.md) | Prompt and input variation, five repeat runs per scenario, API assertions for completeness and hallucinations, tracing failures to the model or its input |
| [AI accuracy tests](tests/ai/) | Runnable: completeness, hallucination, status and date checks against a stand-in AI notes service, plus a known-bad model version the checks must catch |
| [AI-Assisted QA Tooling](docs/ai-assisted-qa-tooling.md) | Claude Code skills and plugins I built for the team, from test planning to self-review, failure analysis and bug triage, and how I keep their output trustworthy |

### 2. Product, analysis and delivery

| Sample | Shows |
| --- | --- |
| [Go/No-Go Quality Sign-off](docs/go-no-go-checklist.md) | How I give the quality sign-off for pilot launches and extensions |
| [Given/When/Then Acceptance Criteria](docs/gwt-acceptance-criteria.md) | Criteria written before development, doubling as the test plan |
| [Definition of Ready for QA](docs/definition-of-ready-for-qa.md) | Catching gaps in refinement, not at the end of the sprint |
| [Jira Dashboards](docs/jira-dashboards.md) | How I design Jira dashboards for reporting and bug tracking |
| [Monthly Customer-Bug Quality Report](docs/customer-bug-quality-report.md) | Reporting for Product and Engineering leadership |
| [Bug Classification Rules](docs/bug-classification-rules.md) | Defect, feature gap, configuration or another team's root cause |

### 3. Quality engineering

| Sample | Shows |
| --- | --- |
| [Merged Work Write-ups](docs/merged-work-writeups.md) | 49 changes I merged: problem, what I did, why it mattered |
| [E2E Test Quality Rubric](docs/e2e-test-quality-rubric.md) | Scoring tests on stability and maintainability, not only pass/fail |
| [Playwright E2E tests](tests/e2e/) | Page object, stable test IDs, no sleeps, each test owns its patient, UI checked against the API |
| [Unit tests](tests/unit/) | Medication course rules as a scenario table: end dates, last day, expired, scheduled |

A six-page PDF portfolio is available on request through [LinkedIn](https://www.linkedin.com/in/tanyasamson14/).

**How it connects:** one fictional patient record drives everything. The
[acceptance criteria](docs/gwt-acceptance-criteria.md) define the medication rules, the [unit](tests/unit/) and
[E2E](tests/e2e/) tests prove them, and the [AI tests](tests/ai/) check that AI-generated notes for the same record are
complete, accurate and free of invented facts, every run.

## Run it (under 5 minutes)

Needs Node 20 or later.

```bash
git clone https://github.com/tanyasamson14/portfolio.git
cd portfolio
npm install
npx playwright install chromium
npm test
```

`npm test` runs the unit tests, starts the demo app, and runs the Playwright and AI accuracy suites against it.
To try the app yourself, run `npm run demo` and open http://localhost:4173. In the AI-generated notes section,
choose **v2** (the release candidate, correct on every run) or **v1** (a known-bad version for testing), and a
run from 1 to 5. On v1, runs 1 to 4 each carry one defect: a missing drug, an invented drug, an expired drug shown
as active, or a wrong date. Run 5 is correct, to show a faulty model can still pass once.

## Project layout

```
demo-app/            Fictional patient record app and a stand-in AI notes service
  medications.js     Course rules: end dates, active, expired, scheduled, stopping a medication
  notes.js           Seeded "AI" notes: v2 is correct, v1 has one defect of each kind
  patients.json      Three fictional patients: a dog, a cat and a rabbit
tests/
  unit/              Node test runner, no browser needed
  e2e/               Playwright specs and page object
  ai/                Accuracy checks and the repeat-run spec
docs/                Write-ups and templates
.github/workflows/   CI: runs everything on every push
```

## Why I built it this way

- **A fictional app, not a public practice site.** Public practice sites are shopping carts and hotel bookings.
  I test clinical records, and I needed AI-generated notes I could control, so I built the smallest target that has both.
- **A known-bad model version on purpose.** Passing tests only prove something if they can fail. Version v1
  carries one defect of each kind I have found in real AI-generated notes, and the build fails if any
  check stops catching it.
- **No retries.** Retries are switched off. A flaky test is a bug to fix, and on failure CI keeps the trace and
  report for diagnosis.

## Things worth looking at

- **Facts, not strings.** The AI notes word things differently each run; the checks compare medications,
  statuses and dates against the record.
- **No sleeps, no force clicks.** Prescribing takes 1.5 seconds on purpose. Tests wait on the result the vet
  sees, never on a timer.
- **Stable locators only.** Every element is found by `data-testid`.
- **Each test owns its data.** Tests copy a fresh patient from a template, so they pass in any order and in
  parallel.
- **Boundaries are tests.** The last day of a course is active; the day after, it is expired. Off-by-one dates are
  exactly the kind of error that makes AI notes say a finished antibiotic is current.
- **Status comes from dates.** The server works out active or expired every time, so it cannot go stale.
