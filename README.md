# CoAi Telco Handoff — Evidence Before Interpretation

A browser-only, privacy-first workflow for a **telecom support agent** to prepare a technician handoff brief from a **synthetic connectivity incident**.

## Live demo

https://coai-telco-handoff.vercel.app/

> Deployment state was reported READY by Vercel; public-browser end-to-end availability must be independently confirmed.

## Use

1. Open the demo or `index.html` locally.
2. Select `SIM-101` or edit a synthetic incident.
3. Choose **Generate handoff brief**.
4. Check evidence and missing information, then acknowledge human review.
5. Download or copy the generated `.txt` brief.

## Scope and limitations

- Sample data only. No customer records, mobile network API, verified coverage data or telecom carrier affiliation.
- This is deterministic text processing, not live network diagnostics or an AI-powered diagnosis.
- No backend, API key, login, analytics or persistent storage.
- Human acknowledgement is a demo review gate, **not identity-based authorization**.

## Run and test

The root `index.html` is a directly usable standalone page. For local HTTP testing, run `python -m http.server 8000` from the repository root, then open http://localhost:8000/.

The original release test suite exercises `site/index.html`, a byte-identical copy of the root page:

```bash
node tests/source-check.js
node tests/logic-check.js
python tests/browser-e2e.py
```

Browser tests require their existing environment dependencies. A public deployment must also be checked separately. See `PUBLIC-RELEASE-CHECKLIST.md`.

## KrackedDevs submission

See [SUBMISSION.md](SUBMISSION.md). This source repository by itself does **not** demonstrate an official competition submission.