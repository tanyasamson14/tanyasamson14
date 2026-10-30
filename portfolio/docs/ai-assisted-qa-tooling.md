# AI-Assisted QA Tooling: How I Use Claude Code

I build Claude Code skills and plugins that take repetitive QA work off the team, and I treat their output the
way I treat any AI output: checked against the source before anyone relies on it. The tools live in team
repositories and are used by the team, not only by me.

## What I built, by stage of the work

| Stage | Tool | What it does |
| --- | --- | --- |
| Planning the testing | Test scenario generator | Reads a code change, classifies it (UI, API, bug fix, UX, accessibility, performance or security) and recommends the scenarios that matter, mapped to existing tests |
| Planning the testing | Given/When/Then test plans | Writes a ticket's test scenarios into the ticket as a [Given/When/Then](gwt-acceptance-criteria.md) table, with columns for results and status |
| Writing tests | Test quality audit | Scores an end-to-end test against the team's [test quality rubric](e2e-test-quality-rubric.md) and lists the exact rules it breaks |
| Writing tests | Test coverage review | Checks a change that adds unit or component tests against the team's testing guidelines, and confirms each new check fails when the code is broken |
| Before peer review | Pre-merge self-review | Reviews my own change against the team's review standards before it goes to the team for peer review, so peer review focuses on the substance |
| During peer review | Review-comment workflow | Gathers every reviewer comment, checks each claim against the code before acting on it, and re-tests each fix |
| After merge | Scope summary on the ticket | Runs as part of my ticket workflow once a change merges: adds a short, non-technical note to the ticket saying what was done and what changed |
| In the pipeline | End-to-end failure report | When end-to-end tests fail in the pipeline, analyses each failure, gives the likely reason, and routes it to the team that owns it |
| Bug triage | Bug pre-triage agent | Checks each client bug against the source code and classifies it: genuine defect, another team's root cause, configuration, feature request, usability, duplicate or not reproducible ([rules](bug-classification-rules.md)) |
| Bug reporting | Customer-bug analysis | Analyses client-reported bugs each month for Product and Engineering leadership ([report](customer-bug-quality-report.md)) |

## What it changed

- Peer reviews start from a change that already meets the team's standards.
- Anyone reading a ticket after merge can see what changed, without reading code.
- Pipeline failures reach the team that owns them, with a likely reason attached.
- Triage meetings start with evidence. The pre-triage agent reviewed 26 client bugs.

## How I keep AI tooling trustworthy

- **Every claim is checked against the source.** A tool that says "this test covers X" or "this bug is
  configuration" must cite the code or record that proves it.
- **A person approves before anything is posted.** The tools draft; I review, then publish.
- **Checks are tested too.** When a tool adds a test assertion, I break the code on purpose to confirm the
  assertion fails. The same idea runs through the [AI accuracy tests](../tests/ai/) in this portfolio.
- **Written for the reader.** Ticket notes are written in plain English, so product owners and support
  staff can act on them without reading code.
