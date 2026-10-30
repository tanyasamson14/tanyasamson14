# Definition of Ready for QA

I wrote the team's Definition of Ready for QA so gaps were caught in refinement, not at the end of the sprint.
Generalised version.

## A story is ready for development when

- [ ] The problem is described from the customer's point of view: who, what they are trying to do, and why.
- [ ] Acceptance criteria are written as [Given/When/Then](gwt-acceptance-criteria.md) with concrete values.
- [ ] Edge cases are listed: empty, zero, negative, very long, expired, external, permissions.
- [ ] The design matches the ticket. Differences between ticket, design and current behaviour are called out.
- [ ] Dependencies on other teams or services are named, with an owner.
- [ ] Test data needs are known, and how to create it.
- [ ] Feature flag and rollout plan are agreed, if any.
- [ ] Test estimate is given, including automation.

## A story is ready for QA when

- [ ] It is deployed to a test environment, and the environment is named on the ticket.
- [ ] The developer has checked the acceptance criteria themselves.
- [ ] Unit and component tests for the change are merged or in the same merge request.
- [ ] Known limitations are written on the ticket.

## Why it works

Questions asked in refinement cost minutes. The same question asked after development costs a rework cycle.
