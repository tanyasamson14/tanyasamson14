# Bug Classification Rules

I wrote the classification rules that product, support and engineering used in triage, then automated the
first pass with an AI agent that checks each customer-reported bug against the source code. Generic version.

## Why it matters

When every customer report is counted as a defect, the bug numbers mislead leadership and the team fixes the wrong
things. Classifying first means each report goes to the person who can act on it.

## Categories

| Category | Means | Goes to |
| --- | --- | --- |
| **Genuine defect** | The product does not do what it was built to do | Engineering, prioritised |
| **Another area's defect** | A real defect, but in a different product area | That team's backlog |
| **Another team's root cause** | The symptom shows here, the cause is upstream | Owning team, linked |
| **Configuration** | The clinic's own template or settings cause the behaviour | Support, with the fix |
| **Feature gap** | It works as built; the customer needs something it was never built to do | Product, as a request |
| **Usability issue** | It works as built, but is hard to read or use | Product and design |
| **Long-standing behaviour** | It has always worked this way and was not changed recently | Product decision |
| **Duplicate** | Already reported | Linked and closed |
| **Not reproducible** | Cannot be reproduced with the information given | Back to support for details |

## Decision order

1. Can I reproduce it? If not, **Not reproducible**.
2. Is it already reported? If yes, **Duplicate**.
3. Does the code do what it was designed to do?
   - No, and the code is ours: **Genuine defect**.
   - No, and the code belongs elsewhere: **Another area** or **Another team's root cause**.
4. Yes, it works as designed:
   - The clinic's setup causes it: **Configuration**.
   - It was never built to do this: **Feature gap**.
   - It does it, but badly: **Usability issue**.
   - It has always been like this: **Long-standing behaviour**.

## Writing the analysis

The analysis goes in an internal field, never in a comment that syncs back to the customer. It states the
category, the evidence (steps, code area, configuration) and a recommended owner.
