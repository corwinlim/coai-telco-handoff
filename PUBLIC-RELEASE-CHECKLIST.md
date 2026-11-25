# CoAi Telco Handoff — Public Release and Evidence Gate

Updated 2026-11-26 (MYT). No change to frozen Build 11 application code.

## Verified connected platform evidence

- GitHub repository: https://github.com/corwinlim/coai-telco-handoff
- Branch: `main`. GitHub source and CI workflow are present.
- Vercel project: `coai-telco-handoff`, Corwin's team.
- Production deployment from Git commit `813dc90917bb5bdb33d75e96a789fcc85567fbbc` was reported READY by Vercel.
- Public site alias: https://coai-telco-handoff.vercel.app/
- GitHub Actions workflow file exists. Actual successful GitHub Actions **run** is NOT VERIFIED. A green **Vercel** commit status is not the same as a green Actions run.
- Public HTTP 200 / browser workflow: NOT VERIFIED by independent external browser.
- KrackedDevs submission receipt: NOT VERIFIED; previously stated deadline 2026-11-16 23:59 MYT.

## Windows public-HTTP test (run from a fresh public Internet connection)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-public.ps1
```

This read-only test checks HTTPS, HTTP 200, expected title/disclosure, and the original Build 11 HTML SHA-256. It **cannot** confirm that buttons work or a file downloads. It may report a hash mismatch if a host transforms HTML; investigate before calling that a code regression.

## Browser test — capture screenshots and the downloaded TXT

1. Open https://coai-telco-handoff.vercel.app/ in an incognito window signed out of Vercel.
2. Select SIM-101; verify incident ID and other form fields populate.
3. Generate a brief; distinguish facts vs unknowns.
4. Verify Download remains blocked before human review.
5. Approve human review and download `coai-handoff-SIM-101.txt`; inspect its text and synthetic label.
6. Change an input; verify the previous approval is invalidated.
7. Repeat on a narrow mobile viewport.
8. Check https://github.com/corwinlim/coai-telco-handoff/actions for a successful `CoAi Telco Handoff CI` run. Record the exact run URL.
9. Check https://krackeddevs.com/code/bounty/build-for-better-connectivity in the signed-in user account; obtain a real submission receipt if allowed. No receipt means NO-GO for 'submitted'.

## Commercial validation

Interview three real target stakeholders (two frontline support roles and one lead/dispatcher preferred) using **synthetic** cases only. Do not collect actual customer personal information, call records, or operator account access. Record the interview date, role, qualitative pain, CRM alternative, and permission to follow up. Do not invent participants, metrics or purchasing interest.

## GO / NO-GO

- Engineering: **GO for controlled user demo**, subject to verified public-browser operation.
- CI: **NOT VERIFIED** until the Actions run is green.
- Competition: **NO-GO for a submitted claim** until the platform gives a receipt.
- Paid-pilot design: **NO-GO** until at least three authentic interviews show repeat handoff pain and a credible buyer/pilot path.
