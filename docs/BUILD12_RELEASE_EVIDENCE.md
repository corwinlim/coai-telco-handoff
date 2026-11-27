# Build 12 — Release Evidence Ledger (2026-11-26)

| Check | Status | Source of evidence / next action |
|---|---|---|
| Public GitHub repository exists | VERIFIED | https://github.com/corwinlim/coai-telco-handoff |
| Application source at repo root | VERIFIED | `index.html` through GitHub connector |
| Vercel Git link | VERIFIED | Same original Corwin Vercel project connected to `corwinlim/coai-telco-handoff` |
| Production deployment for commit `c1f0e877905bfed96254b0c03ee4c401fd5cba2e` | READY | Vercel deployment `dpl_9A8F65smsgLjDdwWcWWcyA6xSjSn` |
| GitHub Actions source and logic checks | VERIFIED SUCCESS | Run [45694370925](https://github.com/corwinlim/coai-telco-handoff/actions/runs/45694370925), job `Source and logic checks`; individual source and logic steps both `success` |
| Independent CI public homepage HTTP/content smoke test | VERIFIED SUCCESS | Run [45694370925](https://github.com/corwinlim/coai-telco-handoff/actions/runs/45694370925), job `Public homepage smoke test` successful. Test uses `curl --fail --location`, which verifies an HTTP 2xx outcome and expected text, but not strictly HTTP 200 or the full browser workflow. |
| Independent automated Chromium SIM-101 generate/review/download | VERIFIED SUCCESS 2026-11-27 | GitHub Actions run [45888733693](https://github.com/corwinlim/coai-telco-handoff/actions/runs/45888733693), job `Production Chromium interaction and TXT download`: selected SIM-101, generated brief, checked review gate, downloaded and inspected synthetic TXT, revoked authorization after edit. |
| User-reported Generate failure | PREVIOUS FAIL (2026-11-27) | Original issue: Windows Chrome/Edge, clicking Generate produced no report; see [Build 13.3 triage](BUILD13_3_MANUAL_UAT_FAILURE_TRIAGE.md) |
| User-provided SIM-101 report | USER-EVIDENCED PASS (2026-11-28) | User pasted full synthetic SIM-101 field-visit brief and subsequently confirmed it came from clicking **Download .txt** successfully, not from Copy |
| Manual Windows SIM-101 Generate → Review → Download | PASS — USER-REPORTED (2026-11-28) | In follow-up to Windows Chrome/Edge Generate failure, user supplied the report text and explicitly confirmed successful **Download .txt**. No independent screen recording or original TXT attachment collected; limited to the reported workflow |
| Competition submission entry | CLOSED — USER-REPORTED 2026-11-26 | User selected ‘submission entry closed’ after checking the KrackedDevs site. This is a first-party user observation, not an independently verified organizer announcement |
| Competition submission receipt | NONE VERIFIED | No receipt provided. Do not mark as submitted or award eligible |
| External prospect interviews | 0 VERIFIED | See BUILD12_CUSTOMER_DISCOVERY.md |

## Chromium regression evidence (2026-11-27)

- Initial action run [45888675667](https://github.com/corwinlim/coai-telco-handoff/actions/runs/45888675667) failed at Playwright installation because ubuntu-latest resolved to Ubuntu 26.04, unsupported by Playwright 1.56.1. The test never ran in that failed attempt.
- Fixed by pinning only the browser E2E runner to `ubuntu-24.04` in commit `e4bb816fdfa612c0fe49fd53f6c7d280058b8fc7`.
- Subsequent action run [45888733693](https://github.com/corwinlim/coai-telco-handoff/actions/runs/45888733693) returned `success` for all three jobs: `Source and logic checks`, `Public homepage smoke test`, and `Production Chromium interaction and TXT download`.
- Production Chromium test code: `tests/production-browser-e2e.cjs`; tested against `https://coai-telco-handoff.vercel.app/`. No actual telecom customer data or carrier API used.
- This proves automated browser execution, **not** a signed-off user acceptance test, commercial impact, or competition entry.

## Build 13.2 — Automated mobile Chromium acceptance (2026-11-27)

- CI run [45889818535](https://github.com/corwinlim/coai-telco-handoff/actions/runs/45889818535) completed **success** with all three jobs green.
- Actual browser job output: `MOBILE_CHROMIUM_E2E=PASS: 390px viewport, SIM-110, gated TXT export and edit invalidation` and `PRODUCTION_CHROMIUM_E2E=PASS: desktop SIM-101 and mobile SIM-110`.
- Validated simulated mobile Chromium viewport 390 × 844, SIM-110 generation, approval-gated download, synthetic TXT label, and revoked approval on edit. Also reverified desktop SIM-101. This is **automated mobile emulation**, not a physical Android or iPhone test and not a formal accessibility audit.
- Application HTML was not changed. Neither competition submission nor customer interviews were performed.

## Key limitation
Vercel READY confirms build/deployment. Separately, an independent GitHub Actions runner completed an HTTPS homepage content smoke test successfully on push to `main` (run 45694370925; 2026-11-25 20:22:41 UTC). The smoke test does **not** establish exact HTTP 200 (only successful curl 2xx), UI interaction/download behavior, or competition submission.

## Manual UAT regression decision (2026-11-27)

User explicitly reported: website opens, but an operation failed. This is **manual UAT FAIL**. Root cause not yet diagnosed. Prior GitHub Chromium passes remain accurate for their tested scenarios but do not supersede the reported failure. This paragraph records the **historical 2026-11-27 failure**; after the 2026-11-28 user-provided downloaded report and explicit download confirmation, the manual SIM-101 workflow is marked **PASS (user-reported)**. The original root cause remains unknown. Triage: [Build 13.3](BUILD13_3_MANUAL_UAT_FAILURE_TRIAGE.md).

## Build 13.4 — Generate feedback mitigation / revalidation (2026-11-27)

- User's manual Windows Chrome/Edge symptom: page loads but clicking Generate does not produce a report. Exact browser version, screenshot, console log and reproduction trace were not provided; **root cause remains UNVERIFIED**.
- Code inspection confirmed Generate handler present and responsive in earlier Chromium CI. Specific interaction gap addressed: successful generation had only a transient toast and a separate report panel; validation/failure feedback was limited. This is a *usability mitigation*, not proof of the actual cause of the user's failure.
- Commit `6d92f7a705f3361709f25278f7c933c2a5c4055d` adds persistent success status, scroll-to-report, clear missing-field feedback, and error catch with `COAI_GENERATE_ERROR` console marker. No change to synthetic-only rules or review-before-export controls.
- Commit `fa5b273bc0e051f45ac0f56ff805c4e62f008b14` adds Chromium assertions for missing required symptom, visible generate confirmation, report in viewport, plus mobile success label.
- GitHub Actions run [45967386754](https://github.com/corwinlim/coai-telco-handoff/actions/runs/45967386754): 3/3 jobs `success`, including updated production Chromium E2E.
- On 2026-11-28 the user supplied the SIM-101 report and explicitly confirmed obtaining it by clicking **Download .txt**. The previously reported Generate issue is **resolved for the user's tested SIM-101 path** by user confirmation, though original root cause and broader cross-browser coverage remain unverified.
- No messages sent, customer interviews, or external contract claims from this build.

## No-go boundaries
Do not claim: verified network diagnostics, AI-powered inference, customer data integration, production incident approval controls, validated customer demand, award participation after the deadline, or a paid contract.

## Minimum closure
1. **DONE:** GitHub Actions run https://github.com/corwinlim/coai-telco-handoff/actions/runs/45694370925 and its two successful jobs.
2. Optional additional-network HTTP check: run `scripts/verify-public.ps1` from a user network; record exact response/hash.
3. **DONE (USER-REPORTED):** User supplied downloaded SIM-101 report text and confirmed successful **Download .txt** on 2026-11-28, following the Windows Chrome/Edge test. Independent Chromium automated download remains separately PASS.
4. **CLOSED FOR NOW:** user reports the KrackedDevs entry is closed. No receipt exists in supplied evidence; stop submission work unless the organizer explicitly reopens it.
5. **OPEN:** Begin 3 authentic role-specific conversations with consent; see `docs/BUILD12_CUSTOMER_DISCOVERY.md`.

## Build 13.5 — Direct user-provided SIM-101 evidence (2026-11-28)

- User supplied the exact field-visit brief for incident `SIM-101`, with general area `Sample District North`, weekday evenings 19:00–21:00, and synthetic mobile-data interruptions.
- Report includes `SYNTHETIC / UNVERIFIED — HUMAN REVIEW REQUIRED`, customer-reported issue and impact, previous checks, evidence limitations, unknown actual network conditions, three suggested next steps, and the demo review acknowledgement.
- **Evidence strength:** direct user-provided output text, plus explicit confirmation that the **Download .txt** button successfully downloaded the file. This supports user acceptance of the SIM-101 Generate → Review → Download path; the raw downloaded file itself has not been separately attached.
- No real telecom investigation, network diagnosis, or customer interview occurred. No permission to send the two Gmail drafts.
- **Decision updated 2026-11-28:** Manual SIM-101 Generate → Review → Download **PASS (user-reported)**; original failure is closed for that tested path. Wider device coverage, error-free operation across scenarios, and historical root cause are still NOT VERIFIED.

## Build 13.5 — User confirms actual TXT download (2026-11-28)

- User explicitly stated: **"我点击 Download .txt 成功下载文件"** after providing the complete SIM-101 field-visit brief.
- The prior user complaint concerned **Windows Chrome/Edge Generate not producing a report**. The user's next provided report and successful-download statement show the tested SIM-101 flow has recovered from that earlier blocker.
- Manual UAT decision for this specific path: **PASS — USER-REPORTED**, with a clear source distinction from GitHub's independent automated Chromium PASS.
- Full root-cause attribution, recorded video proof, raw TXT attachment, and support for all browsers and scenarios remain **NOT VERIFIED**. Do not claim a certified production rollout.
- No competition submission receipt, paid customer, or real telecom investigation is evidenced.
- Outreach permission remains **WITHHELD**. Telecontinent and Brandt Gmail messages remain unsent drafts.
