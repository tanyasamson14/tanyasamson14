# Given / When / Then Acceptance Criteria

I write acceptance criteria as Given/When/Then scenarios **before development starts**, from the customer's point
of view. The same table becomes the test plan: two extra columns hold the result and the evidence as I test.

Example below uses the fictional patient record app in this repo. The demo date is 29 October 2026.

**Test environment:** patient record demo, `npm run demo`, Chrome latest.

| # | Given | When | Then | Test results | Test status |
| --- | --- | --- | --- | --- | --- |
| 1 | a patient record with no medication chosen | the vet looks at the Prescribe button | it is disabled | Button greyed out | Pass |
| 2 | a patient record | the vet prescribes a 10-day course starting today | it shows as active, ending 7 November 2026 | End date 2026-11-07 | Pass |
| 3 | a patient record | the vet prescribes with no course length | it shows as long-term, with no end date | "long-term" shown | Pass |
| 4 | an active long-term medication | the vet stops it | it shows as expired, ended yesterday, with no Stop button | Expired, 2026-10-28 | Pass |
| 5 | a course that ended in July | the record is read through the API | its status is expired | expired returned | Pass |
| 6 | an active problem | the vet resolves it | it shows as resolved | Resolved shown | Pass |
| 7 | a medication prescribed today | the vet generates AI notes | the notes list it as active, with a "check before use" notice | Listed, notice shown | Pass |
| 8 | any patient record | AI notes are generated 5 times | every run lists every medication and problem, and nothing that is not in the record | 5 of 5 runs pass | Pass |
| 9 | a course length of 0 days | it is sent to the API | it is rejected with a 400 | 400 returned | Pass |

## What makes a good scenario

- **One behaviour per row.** If the Then has "and" in it twice, split the row.
- **Concrete values.** "ending 7 November 2026", not "the correct end date".
- **Edge cases are rows, not footnotes.** Last day of a course, a course that ended long ago, external
  medications, zero-day courses.
- **Written with the team in refinement.** Questions raised here are cheaper than bugs found later.

Each row above maps to an automated test in [`tests/`](../tests/).
