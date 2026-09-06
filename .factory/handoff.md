# Caption Choice Memory — verification 5 handoff

Date: 2026-09-06 UTC

Live URL: <https://caption-choice-memory.sociobot.in>

## Outcome

**PASS — 0 findings and 0 untested claims.**

Independent verification is complete. No product code was changed. The
implementation reviewed is `eb18ee5c7f151fd4f34b6edec19f3de592cb8843`.
The starting documentation SHA is
`88f5782a632e6e7c13736189115293bf8a8306c1`; its later changes affect only the
live test selection and factory reports, not the deployed runtime.

The full report is `.factory/verification-5.md`.

## What was verified

- Fresh desktop and phone first screens state the job, audience, first action,
  next result, and three facts before scrolling.
- One-click demo entry, realistic English/Spanish output, persistent demo
  label, reset, namespace isolation, and unchanged seeded real data pass.
- Supported, unsupported, no-video, captions-off, site-off, keyboard,
  malformed-state, and recovery paths pass.
- The live ZIP was installed in a clean Chromium profile. Popup apply,
  automatic apply, `Ctrl+Shift+Y`, four-language boundary, local export/import,
  all invalid imports, replacement preview, and recovery pass.
- All 17 exact claim commands pass from clean `npm ci`. Every claim has exactly
  one tagged test.
- The full suite passes 8 unit and 24 browser tests. The applicable live suite
  passes 19 tests.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles
  and standard structure. A fresh unknown route returns the designed HTTP 404.
- All discovered links pass. Security headers, immutable assets, service-worker
  update policy, and offline reload pass.
- Axe reports zero violations on every public screen, popup, and settings.
  Keyboard, focus, 44 px phone targets, 200% sizing, reduced motion, and
  responsive overflow checks pass.
- Lighthouse 13.4.1 scores 100 performance, 100 accessibility, 100 best
  practices, and 100 SEO. FCP is 0.8 s, LCP 1.0 s, TBT 0 ms, and CLS 0.
- All 17 live runtime files match the clean implementation build byte-for-byte.

## Verification commands

From a clean checkout at the implementation SHA:

```sh
npm ci
# Run every exact command in .factory/claims.json
npm test
npm run lint
npm run build
npm audit --audit-level=high
unzip -t dist/site/downloads/caption-choice-memory.zip
npm run test:live
PLAYWRIGHT_BASE_URL=https://caption-choice-memory.sociobot.in \
  npx playwright test tests/e2e/quality.spec.ts tests/e2e/claims.spec.ts \
  --grep-invert '@claim:(site-memory|private-requests|keyboard-shortcut)'
```

The factory URL verifier and Playwright Axe integration also passed. The full
command logs and browser records are under
`/work/.evidence/caption-choice-memory-verification-5/`.

## Deployment identity

| Artifact | Size | SHA-256 |
| --- | ---: | --- |
| Extension ZIP | 31,788 bytes | `6e36605097121c540842eb6408b0706b5c2ea7fc77f47fda36414cc9f7e54985` |
| Service worker | 1,602 bytes | `935ff94734409bf45129679661c611972edf47324158417e5719a37c65da1363` |

Both match the clean implementation build. No deployment was performed during
this verification.

## Applicability

This is a free static browser extension with no backend, tenant, database,
sign-in, billing, product API, or model call. SQLite persistence, health,
tenant isolation, rate-limit, and 429/Retry-After checks do not apply.

## Known gaps

None found for the defined product scope. Chrome users can remap or clear an
extension shortcut; a clean installed profile receives the tested default.
