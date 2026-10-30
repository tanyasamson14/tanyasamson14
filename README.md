
### Quality Engineering, Business Analysis, AI Quality & Generative AI Testing, Test Automation, Product Management Experience, AI-Powered Skills & Plugin Development


## About Me

```typescript
const whoAmI = {
  name: 'Tanya Samson',
  basedIn: 'Auckland, New Zealand',
  experience: '10+ years in software: testing, test leadership, analysis and delivery',
  focus: ['AI output testing', 'Test automation', 'Business analysis - requirements traceability and definition of acceptance criteria', 'Release decisions'],
  openTo: [
    'Senior QA / Quality Coach',
    'Business Analyst',
    'Product Manager',
    'Scrum Master',
  ],
};
```

[![LinkedIn](https://img.shields.io/badge/-Tanya_Samson-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/tanyasamson14/) [![Email](https://img.shields.io/badge/-tanyasharon14@gmail.com-c14438?style=flat-square&logo=gmail&logoColor=white)](mailto:tanyasharon14@gmail.com)

## Why I'm Here 🏢

I'm looking for a role that brings quality coaching, business analysis and product judgement together. My
exposure also includes testing AI features, where getting the answer right really matters. This page shows what
I've delivered and how I work.

## 📂 Portfolio

**[Portfolio →](https://github.com/tanyasamson14/portfolio)** AI output testing method and runnable accuracy
checks, go/no-go and acceptance-criteria templates, Jira dashboard design, merged-work write-ups, and Playwright
tests you can run in five minutes.

## Featured Work 🚀

> Work delivered as Senior QA Engineer at IDEXX, on a cloud veterinary practice-management platform
> (May 2024 to October 2026). Described at a high level, so no internal code, names or ticket details are shared.

**At a glance:** 49 merged changes. 274 tests added to the merge gate. 112 genuine bugs raised, 94 resolved.

### 🩺 AI Output Testing in a Medical Setting
**Problem:** The same prompt and patient record can give a different AI-generated note every time. In a clinic,
a missed medication or an invented one is a safety issue, and both look plausible to a busy vet.

**What I did:**
- Led testing of AI-generated notes, working with the data scientist.
- Varied prompts and input records to find where output drifted, and compared output across model versions and
  LLM providers.
- Ran every scenario five times and tracked pass rates to measure consistency.
- Built 14 automated accuracy checks through the API. They assert that critical details from the source record
  are present (medications, problems, statuses, dates), that nothing appears that is not in the record
  (hallucination), and that dates and completeness hold.
- Designed edge cases, such as historical, expired and external medications, that exposed wrong output.
- Traced each failure to either the model or the data sent to it, and gave product input that shaped acceptance
  criteria and clearer prescription and problem statuses.
- Tested two closed-beta pilots end to end.

**Why it matters:** Issues were fixed in later model versions before wider release. Vets need output they can trust.

### 🚦 Product and Release Decisions
**What I did:** Gave the quality sign-off in go/no-go meetings before pilots launched and before they were
extended. Wrote acceptance criteria as Given/When/Then from customer outcomes before development, and flagged
gaps between the ticket, the design and the code. Found 12 issues on a partner integration after it was marked
ready for pilot, all fixed before customers saw them.

**Why it matters:** Release decisions were made on evidence: coverage, open risks and a rollback plan.

### 📊 Jira Dashboards, Reporting and Bug Tracking
**What I did:** Built and ran 7 Jira dashboards across two product teams for reporting and bug tracking. Ran bug
prioritisation from them, produced monthly feature-quality reporting
for a year, and built a monthly customer-bug quality report for Product and Engineering leadership. Wrote the
bug-classification rules that product, support and engineering use in triage.

**Why it matters:** Priorities were visible at a glance, and every meeting started from the same numbers.

### 🔍 Finding Risk Before Customers Do
**What I did:** Exploratory and end-to-end workflow testing once each feature was ready, walking the full
clinical workflow the way a vet uses it. As sole QA on a new clinical feature, raised 17 issues in three months,
14 fixed.

**Why it matters:** Issues found by the team, not by clinics.

### 🧪 Test Automation and Coverage
**Problem:** Customers kept reporting lost or changed content in a core clinical feature. The tests that should
have caught it didn't exist or weren't running.

**What I did:**
- Playwright + TypeScript journeys for clinical and billing workflows: consults, medications, procedures and
  treatment plans through to an approved invoice.
- Found test files that never ran on a merge request and brought 183 existing tests into the merge gate, with a
  guard so none are silently skipped again.
- Wrote 91 new data-integrity tests, which found 5 defects before customers did.
- Built a shared quantity fixture and replayed it across the product so every part must agree.
- Took a team from zero to 60 pipeline tests for a new clinical feature.
- PHPUnit and Vitest with mutation checks, and a quality rubric that scores E2E tests on stability.

**Why it matters:** 274 more tests on every merge, aimed where customers were hurting.

### 🔌 Partner-Integration Stand-in
**What I did:** Built and tested a stand-in for an external partner's system, so a new integration could be tested
end to end, including refusal and retry paths, without the partner's live service.

### 🤖 AI-Assisted QA Tooling
**What I did:** Designed and shipped Claude Code skills and plugins the team uses across the testing work:
test scenarios from a code change, test quality audits, a self-review before peer review, a plain-English note
on each ticket after merge, and analysis of end-to-end pipeline failures for the team that owns them. Built a
bug pre-triage agent that checks each client bug against the source code and classifies it (26 tickets reviewed).

**Why it matters:** Repetitive QA work stopped eating testing time, and the tools live in team repos.
[How I build and check them →](https://github.com/tanyasamson14/portfolio/blob/main/docs/ai-assisted-qa-tooling.md)

### 🧭 Quality Coach, Scrum Master and Team Admin
**What I did:** Worked in a quality coach capacity alongside testing. Ran stand-ups, weekly syncs, triage and
retrospectives, and tracked actions to completion. Wrote the Definition of Ready for QA, the regression process
and the team's test standards. Coached developers on what to test before calling work done, and onboarded new
starters. Wrote 51 process, workflow and test documents, and a handover pack.

### 🛒 Earlier
- **Technical Test Lead, retail and point of sale** (Foodstuffs via Expert360, 2022 to 2024): test lead on major
  projects, release sign-off, requirements traceability, testing across POS, Kafka, Grafana, SAP and APIs.
  Expert360 Annual Ka Pai Award, 2023.
- **Software QA Engineer, EROAD**: dashcam software and hardware testing, remote APK releases, AWS IoT.
- **Team Lead, DXC Technology** and **Test Engineer, Capgemini**: integrations and insurance systems.

## Skills 💻

**AI quality:** Testing AI output for accuracy, omissions, hallucinations and consistency; prompt and input
variation; API assertions; comparing models and LLM providers

**Product and analysis:** Go/no-go and pilot sign-off, requirements, user stories, Given/When/Then acceptance
criteria, workflow diagrams, customer insight

**Delivery and reporting:** Scrum Master, meeting facilitation, Jira dashboards and workflows, bug triage,
monthly quality reporting, stakeholder management

**Test automation:** Playwright, TypeScript, API testing, PHPUnit, Vitest, mutation checks, SQL, Go

**Test leadership:** Test strategy, planning and estimation, defect management, release sign-off, mentoring

## Tools I Use 🧰

<p align="left">
  <img src="https://img.shields.io/badge/Playwright-000?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright"> <img src="https://img.shields.io/badge/TypeScript-000?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"> <img src="https://img.shields.io/badge/Claude_Code-000?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Code"> <img src="https://img.shields.io/badge/Cursor-000?style=for-the-badge&logo=cursor&logoColor=white" alt="Cursor"> <img src="https://img.shields.io/badge/Postman-000?style=for-the-badge&logo=postman&logoColor=white" alt="Postman"> <img src="https://img.shields.io/badge/PHPUnit-000?style=for-the-badge&logo=php&logoColor=white" alt="PHPUnit"> <img src="https://img.shields.io/badge/Vitest-000?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest"> <img src="https://img.shields.io/badge/Go-000?style=for-the-badge&logo=go&logoColor=white" alt="Go"> <img src="https://img.shields.io/badge/Jira-000?style=for-the-badge&logo=jira&logoColor=white" alt="Jira"> <img src="https://img.shields.io/badge/Confluence-000?style=for-the-badge&logo=confluence&logoColor=white" alt="Confluence"> <img src="https://img.shields.io/badge/Zephyr-000?style=for-the-badge" alt="Zephyr"> <img src="https://img.shields.io/badge/HP_ALM-000?style=for-the-badge" alt="HP ALM"> <img src="https://img.shields.io/badge/GitLab-000?style=for-the-badge&logo=gitlab&logoColor=white" alt="GitLab"> <img src="https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"> <img src="https://img.shields.io/badge/Unleash_(feature_flags)-000?style=for-the-badge" alt="Unleash (feature flags)"> <img src="https://img.shields.io/badge/AWS-000?style=for-the-badge&logo=amazonwebservices&logoColor=white" alt="AWS"> <img src="https://img.shields.io/badge/Kafka-000?style=for-the-badge&logo=apachekafka&logoColor=white" alt="Kafka"> <img src="https://img.shields.io/badge/Grafana-000?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana"> <img src="https://img.shields.io/badge/Figma-000?style=for-the-badge&logo=figma&logoColor=white" alt="Figma"> <img src="https://img.shields.io/badge/Miro-000?style=for-the-badge&logo=miro&logoColor=white" alt="Miro"> <img src="https://img.shields.io/badge/Salesforce-000?style=for-the-badge&logo=salesforce&logoColor=white" alt="Salesforce">
</p>

## Education & Award 🎓

- MBA (HR Management), University of Madras, 2019 

- B.E. Electronics & Communication, Anna University, 2015 

- Cambridge Business English Certificate, 2013 

- Expert360 Annual Ka Pai Award, 2023

## Other Stuff

![Tanya's GitHub stats](https://github-readme-stats.vercel.app/api?username=tanyasamson14&show_icons=true&hide=[%22issues%22])
