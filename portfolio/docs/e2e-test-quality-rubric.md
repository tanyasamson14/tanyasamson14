# E2E Test Quality Rubric

I set the team's test standards, including a rubric that scores end-to-end tests on **stability and
maintainability, not just pass/fail**. A green test that flakes once a week, or that nobody can change safely, is
a cost. This is a recreated, generic version.

## Two axes

### Axis 1: Playwright craft

| # | Check | Pass when |
| --- | --- | --- |
| P1 | Stable locators | Elements are found by test ID or accessible role, never by CSS path or position |
| P2 | Real waits | Every wait is an assertion on something the user would see; no fixed sleeps |
| P3 | No forced actions | No `force: true` clicks without a written reason |
| P4 | Web-first assertions | `expect(locator).toHaveText()` and friends, which retry, instead of reading values once |
| P5 | Isolation | The test creates its own data and passes in any order, alone or in parallel |

### Axis 2: Product and team fit

| # | Check | Pass when |
| --- | --- | --- |
| E1 | Tests a real workflow | It follows what a user does, end to end, not one screen in isolation |
| E2 | Asserts the outcome | It checks the result the customer cares about (the medication now shows as expired), not only that a page loaded |
| E3 | Reuses helpers | It uses existing page objects and helpers instead of copying steps |
| E4 | Readable | Someone new can tell what it proves from the test name and steps |
| E5 | Owns its data | Test data is created and cleaned up by the test or a fixture |
| E6 | Fails clearly | A failure message points at the cause, not a timeout |
| E7 | Right level | It could not be a cheaper unit or API test instead |
| E8 | Runs in the pipeline | It is on the merge gate or the scheduled run, not only on a laptop |

## Verdict

| Category | Meaning | Action |
| --- | --- | --- |
| **1** | Passes both axes | Merge |
| **2** | Minor issues on one axis | Merge with follow-up noted |
| **3** | A stability issue (P2, P3 or P5 failing) | Fix before merge |
| **4** | Does not test a real outcome, or cannot run in the pipeline | Rework |

The tests in [`tests/e2e/`](../tests/e2e/) are written to be Category 1.
