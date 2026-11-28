# Build 14 — Commercial Validation Protocol

Date: 2026-11-28 (MYT)
Status: **PROTOCOL READY — NO EXTERNAL PARTICIPANTS, NO MEASURED RESULTS**
Scope: private, synthetic, opt-in product research. This is NOT a carrier pilot, an operator endorsement, a commercial deployment or a live network diagnosis.

## Decision to be made

Should CoAi Telco Handoff receive further investment beyond a browser demo?

**Core alternative hypothesis:** The current CRM/ticketing system already captures complete handoffs with less work; an additional standalone CoAi form creates duplication and no material operational value.

## Stage gates

**Gate A — research permission**
- Three distinct opt-in conversations, with the following roles where possible: frontline support, field dispatch/technician coordination, and service operations/QA lead.
- Research only; do not claim organisational approval based on a staff member's personal opinion.
- Consent to collect general process observations; no recordings or attributed quotes without separate agreement.
- Do not use or request live incident/customer data, operator accounts, screenshots of internal tools, proprietary SOPs, or actual tickets.

**Gate B — problem proof**
- At least two of three participants independently describe material repeated handoff omissions or clarification costs.
- Ask for disconfirming examples: where their existing workflow already works well.
- Capture approximate frequency separately from verifiable aggregate process metrics. No fabricated weekly ticket volumes.

**Gate C — controlled synthetic comparison (permission required, after Gate A)**
- Use fictional SIM-101 and SIM-110 only. Their details are not real network measurements.
- Baseline: participant completes their usual approved blank handoff format or a supplied neutral paper/template format; no confidential actual CRM access required.
- Treatment: participant enters the same fictional incident into CoAi and exports a reviewed handoff.
- Counterbalance sequence: participant 1 baseline→CoAi; participant 2 CoAi→baseline; participant 3 alternate to reduce learning bias. Ideally use equivalent fictional cases and randomize ordering.
- Observe *both* completeness and the time spent, with exactly the same mandatory checklist.
- Count extra steps / duplicate entry and whether data must be rekeyed to existing systems.
- Prompt for risks, bad suggestions, ambiguous unverified claims, and reasons to reject the prototype.

**Gate D — authorized pilot feasibility**
- A named-role (not necessarily named-person) process owner can explain who may approve a limited synthetic evaluation and what the approval/compliance route is.
- Privacy/security, procurement and integration constraints captured.
- No actual telecom company data is used without separately documented authorization.

## Common handoff completeness rubric (proposal, to validate with interviewees)

Each check is scored 1 if explicitly captured, 0 if absent; **not a validated industry standard**:
1. Synthetic incident reference
2. General affected area without precise customer address
3. Time window
4. Reported symptom
5. Reported user impact
6. Previous troubleshooting with provenance
7. Observations and evidence provenance
8. Unknown or unverified conditions clearly separated
9. Next safe diagnostic/action owner
10. Explicit human-review or handoff acknowledgement

Completeness = checks present / applicable checks × 100%. Do **not** treat all ten items as required in real carrier operations without role confirmation.

Measure **elapsed task time in seconds**, **missing items**, **clarification queries**, and **duplicate-entry actions** per task. Define a clarification query as a question a downstream reviewer must ask because the brief omits essential information. Avoid extrapolating to annual cost or revenue without verified volumes and prices.

## Data collection (one observation per method and scenario)

Use [BUILD14_OBSERVATIONS.csv](BUILD14_OBSERVATIONS.csv) with fictional respondent aliases P01–P03. Leave unknown values blank. Never enter actual identities, customer numbers, incident/ticket IDs, live operational data, employer confidential information or passwords.

Recommended matched pairs:
- P01 / SIM-101 / baseline + CoAi
- P02 / SIM-110 / CoAi + baseline
- P03 / SIM-101 / baseline + CoAi

Each pair must identify its scenario, sequence, reviewer-approved checklist, direct/self-reported evidence grade, time and completeness. If a participant is not permitted to use CoAi, mark refusal and reason rather than inventing a result.

## Computation / interpretation

For paired tasks per participant and scenario:
- Time change (seconds) = CoAi seconds − baseline seconds. Negative is faster.
- Completeness change (percentage points) = CoAi completeness % − baseline completeness %.
- Count clarification or duplicate-entry changes independently.
- With n=3, descriptive differences are only exploratory, not statistically representative or proof of causal improvement.
- Quote improvements only from actual measured pairs; label estimates explicitly.

## Why Continue | Stop / Kill Criteria

| Why Continue | Stop / Kill Criteria |
|---|---|
| ≥2/3 distinct consenting roles report recurring, material handoff pain | ≤1/3 describes substantive repeated problem |
| Matched synthetic trial shows lower omissions without major duplicate entry | Existing templates equal or outperform CoAi, or rekeying creates more work |
| One real process owner outlines a lawful synthetic pilot route | No owner, procurement path or permitted use |
| Clear non-diagnostic evidence boundary and privacy fit | Product needs real customer data before permission or overstates diagnosis |

**GO — limited synthetic research only** if Gates A/B met, participant agrees to controlled test, no prohibited data, and a meaningful measurable comparison can be conducted.  
**NO-GO — integration, paid pilot or live operations** without actual role-authorised permission, security governance, and separate procurement sign-off.

## Current evidence, not targets

- Previously recorded Windows manual SIM-101 Generate→Review→Download: **PASS by direct user statement** (not a telecom worker interview).
- External opt-in interviews: **0 verified**.
- Matched comparisons: **0 verified**.
- Process owner permission: **0 verified**.
- Paid willingness/contract/revenue: **0 verified**.
- Telecontinent / Brandt Gmail invitations: **DRAFT, UNSENT**. No outreach authorized.
