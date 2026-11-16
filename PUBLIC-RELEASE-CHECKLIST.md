# Public release verification

## Project
CoAi Telco Handoff — Build 11, static HTML/JavaScript, fictional cases only.

## Source integrity
The production application file is `index.html`. Frozen Build 11 source SHA-256:

`ed927901d0d382880ce5926ea2b35695f605baf2c29fbb0e7cca3155c2b62256`

## Manual acceptance
1. Open https://coai-telco-handoff.vercel.app/ without Vercel login.
2. Select SIM-101 and confirm incident ID maps correctly.
3. Generate handoff brief.
4. Confirm downloading remains blocked until human review.
5. Approve the review and download `coai-handoff-SIM-101.txt`.
6. Edit incident details and verify approval is invalidated.
7. Test a mobile viewport and ensure no horizontal overflow.

## Evidence classification
- Source/logic/browser tests were reported passing on the local Build 11 artifact.
- Vercel deployment status READY does **not** establish live browser acceptance.
- GitHub source publication does **not** establish contest submission.
- Use only synthetic incident details. No real customer records.

## Current release gate
- GitHub source: uploaded to main.
- Vercel production: deployed; external browser E2E not independently confirmed.
- KrackedDevs official submission: not independently verified.
