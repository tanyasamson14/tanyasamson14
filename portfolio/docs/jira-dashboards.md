# Jira Dashboards for Reporting and Bug Tracking

I built and ran **7 Jira dashboards** across two product teams for reporting and bug tracking, and used them for
monthly feature-quality reporting for a year. This page describes how I design them. Filters below are recreated examples with generic project and field names.

## Principles

1. **One dashboard, one decision.** Each dashboard answers a question someone acts on: "what do we fix next?",
   "are we ready for pilot?", "what are customers telling us?".
2. **Filters first, gadgets second.** Every gadget sits on a saved, shared filter, so the same numbers show up in
   the dashboard, the triage meeting and the monthly report.
3. **Readable at a glance.** Counts and short lists on top, trends underneath, no more than six gadgets.
4. **Hard to misread.** Label what is excluded (duplicates, not-a-bug, closed as configuration) so nobody compares
   numbers that were counted differently.

## How they were used

The dashboards supported the team's regular meetings: triage, sprint planning, stand-ups, go/no-go and
retrospectives. They also fed the monthly reporting for Product and Engineering leadership.

## Example filters

```
# Untriaged bugs
project = APP AND issuetype = Bug AND status = Open AND priority is EMPTY ORDER BY created DESC

# Customer-reported bugs this month, excluding non-defects
project = APP AND issuetype = Bug AND labels = customer-reported
  AND resolution not in (Duplicate, "Not a bug", "Works as designed")
  AND created >= startOfMonth() ORDER BY priority DESC

# Pilot blockers
project = APP AND fixVersion = "Pilot" AND priority in (Highest, High) AND statusCategory != Done
```

## Gadgets I reach for

- **Filter results** for short actionable lists (blockers, untriaged).
- **Two-dimensional filter statistics** for priority by status, or component by priority.
- **Created vs resolved chart** to see whether the backlog is growing.
- **Pie chart by resolution** to show how much of what customers report is a genuine defect.

## Outcome

Priorities were visible at a glance, triage and go/no-go meetings started from the same numbers, and the monthly
report could be produced from saved filters instead of by hand.
