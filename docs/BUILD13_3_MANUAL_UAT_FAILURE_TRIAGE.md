# Build 13.3 — Manual UAT Failure Triage

Recorded: 2026-11-27 (MYT)

## Evidence received
- User report: **The webpage opens, but an operation fails**. Manual UAT = **FAIL**.
- Exact failing operation, browser, device, screenshot, error: NOT PROVIDED.
- Automated Chromium regression passed in run https://github.com/corwinlim/coai-telco-handoff/actions/runs/45889818535 (desktop SIM-101 and emulated mobile SIM-110). This does not override user-reported failure.
- Root cause remains UNKNOWN; do not claim release acceptance.

## Isolate the first failing operation
| Code | Symptom | What to check |
|---|---|---|
| UAT-1 | Scenario options fail to load | Does selector still read Loading synthetic examples? |
| UAT-2 | Generate does not update report | Is reported issue + impact present? Any validation message? |
| UAT-3 | Review checkbox cannot be selected | Did Generate complete, or were inputs edited afterward? |
| UAT-4 | Download remains disabled | Tick review checkbox only after last Generate; no subsequent edits |
| UAT-5 | Click Download but no TXT appears | Check downloads panel and download permissions; note browser/platform |
| UAT-6 | Copy failed | Browser clipboard permissions/API can limit copy. This is a hypothesis, not diagnosis |
| UAT-7 | Button hidden or cut off | Note screen width/zoom/device orientation |
| UAT-8 | Blank report or error | Record sanitized error text or screenshot |

## Reproduction (synthetic ONLY)
1. In a normal browser tab open https://coai-telco-handoff.vercel.app/.
2. Choose SIM-101; without editing, click Generate handoff brief.
3. Scroll to section 02; check the review acknowledgment.
4. Click Download .txt. Look for coai-handoff-SIM-101.txt and SYNTHETIC / UNVERIFIED.
5. On first failure stop and note: device OS, browser, operation and error. Do NOT enter actual customer records or telecom identifiers.
6. Optional one private/incognito retest to distinguish possible cache/extension interference.

## Code inspection — possible failure modes, NOT proven
- Download uses Blob, createObjectURL, temporary anchor download, and URL revocation after 1 second. Platform-specific downloads may differ.
- Copy uses navigator.clipboard.writeText and catches errors.
- Any form input change intentionally invalidates the previous review acknowledgment.
- Prior CI covers Chromium, not physical iPhone/Android or enterprise browser restrictions.

## GO / NO-GO
- Automated CI: PASS (limited to tested runners).
- Manual UAT: FAIL (user reported).
- Root cause: NOT VERIFIED.
- Release user-acceptance gate: NO-GO until failing step is isolated and the actual experience retested.
- Gmail invitations: two unsent DRAFTs; no outreach action authorized.
- Repair only after specific defect evidence, with failing-before/passing-after regression.
