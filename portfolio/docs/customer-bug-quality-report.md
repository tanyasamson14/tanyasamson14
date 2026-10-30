# Monthly Customer-Bug Quality Report

I built a monthly report for Product and Engineering leadership that shows how many customer-reported bugs are
genuine defects, and where they come from. It is now a plugin the team runs without me. This page describes the
structure; no company numbers are shared.

## Questions it answers

1. How many bugs did customers report this month, and how many were genuine defects?
2. What else were they? Configuration, feature gaps, usability, duplicates (see
   [classification rules](bug-classification-rules.md)).
3. Which product areas are the genuine defects in, and is that changing?
4. How many were found by the team before release versus by customers after?
5. What should testing focus on next month?

## Sections

| Section | Content |
| --- | --- |
| Headline | Three numbers and one sentence on what changed |
| Classification | Reported bugs split by category, with month-on-month change |
| Hotspots | Product areas with the most genuine defects, linked to test coverage there |
| Escape rate | Found before release versus reported by customers |
| Recommendations | Two or three concrete actions, each with an owner |

## Design rules

- **Every number is reproducible** from a saved Jira filter (see [Jira dashboards](jira-dashboards.md)).
- **Counting rules are written on the report**, so numbers from different months are comparable.
- **Short.** One page of findings; detail in an appendix.
