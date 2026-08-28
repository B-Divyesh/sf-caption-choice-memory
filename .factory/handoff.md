# Caption Choice Memory — review 1 handoff

Date: 2026-08-28 UTC

Work order: `caption-choice-memory-review-1`

## Outcome

Adversarial first-read review 1 is complete. Verdict: **FAIL**, with no blocking
finding and 37 high/medium/minor findings. The complete evidence, exact quotes,
word counts, claim results, and concrete fixes are in
`.factory/review-1.md`.

No product code was changed. The review found a clear mobile/desktop first
screen, a working isolated one-click demo, ten passing declared claim commands,
same-origin demo traffic, a distinct visual identity, working navigation, and
confirmed repairs for the former missing ZIP, stale service worker, and small
touch targets. Remaining work is public-copy cleanup, registration/tests for
eight unlisted claims, a complete standard shell and metadata on the real 404,
clear disclosure/testing of automatic application and supported players, and a
local import/export path.

## Verification performed

```sh
npm ci
# Every exact command in .factory/claims.json, from a fresh local clone
npm run build
npm run test:live
npm run test:browser:live
# /opt/fleet/lib/verify-url.sh against the live root
```

All ten exact claim commands passed. The production build passed, live ZIP and
service-worker hashes matched the candidate, and the live browser suite passed
13/13. Custom fresh-context checks covered 390 × 844 and 1440 × 900 cold reads,
demo isolation/reset, request origins, route metadata, link crawling,
history/focus, real 404 status, and Axe scans.
The factory URL verifier also passed with no console error, missing image alt,
or unlabelled button.

## Files changed

- `.factory/review-1.md` — adversarial review and verdict.
- `.factory/handoff.md` — this review handoff; earlier verification and repair
  history remains below.

---

# Caption Choice Memory — verification handoff

## Independent verification 4

**PASS — candidate `c4525d36cb6508924fa47c758eb6140a63da2feb` is accepted for
release at <https://caption-choice-memory.sociobot.in>.** Fresh evidence shows
the live HTML, hashed JS/CSS, hero image, service worker, and extension ZIP
are byte-for-byte identical to the candidate. The primary ZIP install link is
HTTP 200 and serves the valid 28,049-byte MV3 archive.

The verifier ran all ten exact `.factory/claims.json` commands from a clean
`npm ci`; all passed. `npm run lint`, `npm test` (5 Vitest + 16 Playwright),
`npm run build`, `npm run test:live`, and `npm run test:browser:live` (13 live
tests) also passed. Independent fresh-profile checks confirmed the actual
extension popup stores a per-site Spanish preference, selects the Spanish
native text track, disables all tracks for the off policy, caps language rows
at four, and responds to the actual Alt+Shift+C browser command.

Live demo QA covered normal application, off/site-off, unsupported/no-video
recovery, keyboard-only navigation, 390 px mobile, reduced motion, offline
reload, local-first outgoing requests, response headers/caching, and route
navigation. Axe reported no serious/critical finding on the four site routes
or the real extension popup. No product defects remain. Full evidence,
including hashes and command-by-command claims, is in
`.factory/verification-4.md`; browser evidence is in
`.factory/evidence/verification-4/`.

## Reproduce current verification

```sh
npm ci
npm test
npm run build
npm run test:live
npm run test:browser:live
```

The historical repair handoff follows.

# Caption Choice Memory — repair handoff

Date: 2026-08-28 UTC

Work order: `caption-choice-memory-repair-2`

Repair commit: `0e94755a8886f9c953560ae2270eea72ed232014`

Live URL: https://caption-choice-memory.sociobot.in

## Release status

PASS. All findings in the independent verifier's report at `441fdf1` are
repaired. The live install link now serves the candidate MV3 ZIP, and the live
service worker is byte-for-byte the worker generated from this candidate.
There are no known release-blocking gaps.

## Failure reproduction and root cause

Before changing the product, the live download returned HTTP 404, `text/html`,
and the 599-byte designed 404 response. The live service worker had SHA-256
`1b921453a9c0165281e908a68805d59f93fc5eb4b4660266d2627ca6a8a5712e`
and contained `BUILT_ASSETS = []`.

The work order ends its build with `npm run build:site`. That command previously
ran Vite alone. Vite emptied `dist/site`, deleting the ZIP produced during
`npm test`, and recopied the unprocessed worker with an empty asset list. The
same command reproduced both failures locally: no download file and
`BUILT_ASSETS = []`.

## Repairs

- `build:site` now performs the complete release build: extension, ZIP, static
  assets, package copy, generated worker, and release validation. The internal
  Vite-only step is named `build:site:assets`.
- `verify:dist` fails the build unless the deploy tree contains a valid,
  non-empty ZIP; `unzip -t` passes; its root manifest is MV3 with a background
  service worker; the landing application links the ZIP; and the site worker
  precaches the candidate's hashed CSS and JavaScript.
- `test:live` downloads the production ZIP and worker, checks HTTP/content
  policy, and byte-compares both against the local candidate with SHA-256
  diagnostics on any mismatch.
- `test:browser:live` reruns production browser, accessibility, mobile,
  keyboard, offline, package, and navigation checks without a local server.
- Header/footer links, the demo switch, radios, and language selects now have
  at least 44 by 44 CSS-pixel hit rectangles. The 390 px regression asserts
  both dimensions for every directly operated demo control named by the
  verifier.

The researched brief, extension behavior, demo isolation, visual thesis, and
all previously passing behavior are unchanged.

## Local verification

The exact work-order command passed from a clean dependency install and left a
complete `dist/site` tree:

```sh
npm ci && npm test && npm run build:site
```

- `npm ci`: 207 packages, 0 vulnerabilities.
- Typecheck/lint: `tsc --noEmit` passed.
- Unit: 5 Vitest tests passed.
- Browser/integration: 16 Playwright tests passed in Chromium 1.58.2.
- Every exact command in `.factory/claims.json` passed independently: all ten
  claim IDs (`one-action`, `site-memory`, `offline-action`,
  `private-requests`, `unsupported-notice`, `keyboard-shortcut`,
  `player-controls`, `download-package`, `language-limit`, and
  `free-no-account`).
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `unzip -t dist/site/downloads/caption-choice-memory.zip`: all 11 files pass.
- Built extension: 39.28 KB unpacked. ZIP: 28,049 bytes.
- Site JavaScript: 15,670 bytes raw / 5,210 bytes gzip. CSS: 15,107 bytes raw
  / 4,113 bytes gzip. The 25,156-byte mobile hero remains within budget.
- No production source maps remain in `dist/site/assets`.

The local suite covers the real extension popup/storage/content-script flow,
repeated `Alt+Shift+C`, player track selection, the off policy, unsupported and
empty states, demo reset/isolation, keyboard focus, route focus/history,
offline reload, 390 px layout and hit rectangles, and zero serious/critical
Axe findings on `/`, `/demo`, `/privacy`, and `/terms`.

## Deployment and live verification

Azure Static Web Apps deployment
`95293b84-b7d7-434a-8bda-6f9bb9147e78` uploaded the exact `dist/site`
directory. Post-deploy evidence:

- `npm run test:live`: pass.
  - ZIP: HTTP 200, ZIP content type and signature, 28,049 bytes, SHA-256
    `cee4ed60156eba9dfed986d419602626159c554f5dc55069ca79a690103e16be`.
  - Service worker: HTTP 200, `Cache-Control: no-cache`, 1,602 bytes, SHA-256
    `e8a1b0b3d5a05b9bb28db406df9934a65c1bf0bdc1a3acbbef7b3bd6665cd95a`.
  - Both hashes exactly match the final local candidate.
- The downloaded live archive extracts to the same 11 files as
  `.output/chrome-mv3`; no byte differences were found.
- `npm run test:browser:live`: 13 production browser tests passed, including
  offline reload, repeated shortcut use, package availability, desktop and
  390 px behavior, and route-level Axe/console checks.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, `lang=en`, one title/h1/main, no
  missing alt text, no unlabelled buttons, and no console errors. Evidence is
  in `.factory/evidence/repair-2/`.
- A fresh reduced-motion mobile session saw 31 same-origin requests only, zero
  console/page errors, 15 visible keyboard focus stops, `0s` transitions, and
  both generated CSS and JS among nine service-worker-cached shell entries.
- A random missing route returns genuine HTTP 404 with the designed page.
  Hashed assets return `public, max-age=31536000, immutable`; the worker returns
  `no-cache`. CSP is self-only with framing disabled; HSTS,
  `X-Content-Type-Options`, Referrer Policy, and Permissions Policy are present.
- Lighthouse 13 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1,052 ms, CLS 0, total blocking time 0 ms, transfer 36,415
  bytes.

This static, free extension has no product API, authentication, billing,
remote database, or Sociobot model call. Rate-limit, paid-unlock, backend
health, and Entra identity checks are therefore not applicable.

## Run and verify

```sh
npm ci
npm test
npm run build:site
npm run test:live
npm run test:browser:live
```

Deploy root: `dist/site/`.

## Known product limits

- Some players do not expose caption controls. The extension reports this and
  leaves the player unchanged.
- The ZIP is an unsigned unpacked-development package. Store review and signing
  remain factory release tasks, not product defects.
