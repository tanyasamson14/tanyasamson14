# Go/No-Go Quality Sign-off Checklist

The checklist I bring to go/no-go meetings when giving the quality sign-off for a pilot launch or a pilot
extension. Generic version; no company content.

## Before the meeting

- [ ] Every story in scope has acceptance criteria, and each criterion has a test result.
- [ ] End-to-end workflow testing done the way the user works, not screen by screen.
- [ ] Exploratory testing done after the feature was marked ready, with findings logged.
- [ ] Automated regression green on the release candidate.
- [ ] For AI features: every scenario run repeatedly, with pass rates recorded (see
      [AI output testing](ai-output-testing.md)).
- [ ] Open bugs listed by priority, with an owner and a decision for each: fix before launch, fix during pilot,
      or accept.

## In the meeting

| Question | Evidence I bring |
| --- | --- |
| What did we test, and what did we not? | Coverage summary and known gaps |
| What is still open? | Pilot-readiness dashboard |
| What could hurt a clinic? | Top risks with likelihood and impact |
| Can we turn it off? | Feature flag or rollback plan confirmed |
| How will we know it is going wrong? | Monitoring and support escalation path |

## Recommendation

- **Go:** no open high-priority bugs, risks accepted by product, rollback confirmed.
- **Go with conditions:** named bugs fixed by a date during the pilot, agreed in the meeting.
- **No-go:** a defect or gap that could give a clinic wrong information or lose data.

For a pilot **extension**, add: what customers reported during the pilot, what was fixed, and what changed in
the risk list since launch.
