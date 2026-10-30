# Testing AI-Generated Clinical Output

How I test AI features where a wrong answer can affect patient care: AI-generated notes
on a veterinary practice-management platform. The method is real; the examples are
recreated with fictional patients. The runnable version is in [`tests/ai/`](../tests/ai/).

## Why AI output needs a different approach

| Normal feature | AI feature |
| --- | --- |
| Same input gives the same output | Same input can give a different answer every run |
| One passing run is evidence | One passing run proves very little |
| A string match is a good assertion | Wording changes legitimately, so you must compare facts |
| A bug has one cause in the code | A bad answer comes from the model, the prompt, or the data sent to it |

In a clinic, two failures matter most: **something critical is left out** (an allergy, an active medication) and
**something is stated that is not in the record** (a drug the patient was never prescribed). Both look
plausible to a busy vet, which is what makes them dangerous.

## The method

### 1. Start from the source record, not the output
Every check compares the AI output to the record it was generated from. I write down, per scenario, the facts
that must appear: active and expired medications, active and resolved problems, key dates, and where a
medication came from (this clinic or an external one).

### 2. Vary the prompt and the input
- **Prompt variation:** run the same record through different prompt versions and instructions to see which
  facts are stable and which drift.
- **Input variation:** design records that stress the model: historical and expired medications, medications
  from external clinics, long histories, sparse records, resolved versus active problems, similar drug names.
- **Model variation:** compare output across model versions and across LLM providers before choosing one.

### 3. Repeat every scenario
Each scenario runs **five times**. I track the pass rate per scenario, not a single pass or fail. A scenario at
4/5 is a defect, not a pass: one in five vets would see wrong information.

### 4. Assert through the API
UI checks are slow and brittle for this. I call the generation API directly and assert on the response, so a
scenario can run many times cheaply. My checks fell into four groups (14 automated checks in the real suite):

| Check | Fails when |
| --- | --- |
| **Completeness** | a medication, problem or date in the record is missing from the output |
| **Hallucination** | the output lists something that is not in the record |
| **Status and provenance** | an expired drug is shown as current, a resolved problem as active, or an external medication is not labelled |
| **Dates** | a visit, start or end date is wrong or reformatted ambiguously |

### 5. Trace each failure to its cause
For every failure I decide: is it **the model** (it had the right data and got it wrong) or **the input** (the
data sent to it was incomplete, stale or ambiguous)? Input problems are fixed in our code; model problems go to
the data scientists with the scenario, the five outputs and the expected facts. This kept fixes moving instead of
arguing about whose bug it was.

### 6. Prove the checks themselves work
A check that never fails is not a check. The demo has a deliberately broken model version (`v1`) with one defect
of each kind, and a test that requires every defect type to be caught. If someone weakens a check, the build
goes red.

## Acceptance criteria I agreed with product for AI features

```
Given a patient record with an expired medication
When AI notes are generated
Then the medication appears with status "expired"
And it is not described as current treatment
And this holds on 5 out of 5 runs
```

```
Given a patient record
When AI notes are generated
Then every medication listed in the notes exists in the record
```

Clearer prescription and problem statuses in later versions came out of agreeing criteria like these up front.

## Results

- Issues found and fixed in later model versions before wider release.
- Two closed-beta pilots tested end to end before go/no-go.
- Edge cases (historical, expired and external medications) became standing regression scenarios.
