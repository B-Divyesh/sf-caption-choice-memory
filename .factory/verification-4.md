# Independent product verification 4 — PASS

Date: 2026-08-28 UTC  
Work order: `caption-choice-memory-verify-4`  
Candidate commit: `c4525d36cb6508924fa47c758eb6140a63da2feb`  
Live URL: <https://caption-choice-memory.sociobot.in>  
Artifact: Chrome MV3 extension with static product site and isolated demo

## Verdict

**PASS — release candidate accepted.** The fresh deployment is the requested
candidate, including the primary extension-download artifact and generated
service worker. The extension, demo, privacy promises, accessibility baseline,
and build/release checks all passed. No release-blocking defects were found.

## Required initial gates

The clean checkout was already at the requested commit before dependencies
were installed. `.factory/claims.json` exists and declares ten claims. After
`npm ci`, I ran every exact declared command against the shipped demo or a
fresh Chromium extension profile; each passed.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `one-action` | `npm test -- --grep @claim:one-action` | PASS |
| `site-memory` | `npm test -- --grep @claim:site-memory` | PASS |
| `offline-action` | `npm test -- --grep @claim:offline-action` | PASS |
| `private-requests` | `npm test -- --grep @claim:private-requests` | PASS |
| `unsupported-notice` | `npm test -- --grep @claim:unsupported-notice` | PASS |
| `keyboard-shortcut` | `npm test -- --grep @claim:keyboard-shortcut` | PASS |
| `player-controls` | `npm run test:unit -- --testNamePattern @claim:player-controls` | PASS |
| `download-package` | `npm test -- --grep @claim:download-package` | PASS |
| `language-limit` | `npm run test:unit -- --testNamePattern @claim:language-limit` | PASS |
| `free-no-account` | `npm run test:unit -- --testNamePattern @claim:free-no-account` | PASS |

### Cold first read

**PASS.** In a new browser context, the first screen says what it does:
“Keep caption choices one action away”; who it is for: viewers who repeat the
same language and caption setting on video sites; and what to click: the
visible **Try it with sample data** link. Its adjacent explanation says the
sample will apply English captions. One click opens `/demo`, immediately shows
a saved English-first sample rule and player, and keeps the persistent
“Demo — sample data, nothing is saved” banner with **Reset demo** and
**Start for real**.

## Local candidate verification

| Check | Evidence | Result |
| --- | --- | --- |
| Clean install | `npm ci`: 207 packages, 0 audit vulnerabilities | PASS |
| Type/lint | `npm run typecheck`; `npm run lint` | PASS |
| Full suite | `npm test`: 5 Vitest + 16 Playwright tests | PASS |
| Exact production build | `npm run build` creates `.output/` and `dist/site/` | PASS |
| Package integrity | `unzip -t dist/site/downloads/caption-choice-memory.zip`: 11 files, no errors | PASS |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities | PASS |

Build sizes are inside the static-product budgets: site JS is 15,670 bytes raw
/ 5,180 bytes gzip; CSS is 15,107 bytes raw / 4,100 bytes gzip; the mobile
hero is 25,156 bytes; the MV3 ZIP is 28,049 bytes and unpacked extension is
39.28 KB.

## End-to-end product checks

### Real extension

Loaded `.output/chrome-mv3` into a fresh persistent Chromium profile and used
the actual popup/content/background scripts against the shipped HTML5 fixture.

- Saving Spanish and applying showed “Español captions are on”; English became
  `disabled` and Spanish `showing`.
- Selecting the off policy and applying showed “Captions are off”; both tracks
  became `disabled`.
- The **Add** control stopped at four language rows and became disabled.
- With a preference stored after page load, actual `Alt+Shift+C` changed the
  fixture from both tracks disabled to Spanish `showing`.
- The fresh-profile privacy claim observed only the fixture origin and
  `chrome-extension://` requests while saving and applying.
- An independent Axe scan of the popup reported 0 violations, including 0
  serious/critical violations.

### Live demo, recovery, and keyboard

On the live `/demo` at 390 px:

- Spanish application returned “Spanish captions are on”.
- The no-video boundary returned “No video found” with the next step to choose
  a player with a video.
- The off policy returned “Captions are off”; the visible site switch then
  returned “Off on this site” with a recovery instruction.
- Tab reached the skip link, banner controls, navigation, switch, radio,
  language selects, player select, apply button, and footer links. Each tested
  focus stop displayed the designed 4 px yellow outline plus black offset
  ring. Space operated the switch.
- A reduced-motion context reported `0s` transition and animation duration.

The full live browser suite (`npm run test:browser:live`) passed 13/13,
covering normal/demo claims, offline reload, mobile layout and 44 px controls,
history/focus behavior, and route-level accessibility checks.

## Accessibility and browser quality

- `/opt/fleet/lib/verify-url.sh` passed against the live root: HTTP 200, title,
  `lang=en`, one `h1`, one `main`, no missing image alt, no unlabeled buttons,
  and no console errors. Evidence is in
  `.factory/evidence/verification-4/verify.json` with desktop/mobile
  screenshots beside it.
- Playwright Axe found 0 serious/critical findings on `/`, `/demo`, `/privacy`,
  and `/terms`; the independent popup scan also found none.
- No console or page errors occurred during the live landing/demo exercise.
- All internal product routes and the external factory link returned HTTP 200;
  an unknown product route returned the designed page with genuine HTTP 404.

The standalone `npx @axe-core/cli` invocation could not start because this
container has Playwright Chromium but no system Chrome binary. This is an
environmental CLI limitation, not a product result; the installed
`@axe-core/playwright` scanner was run successfully instead.

## Privacy, headers, caching, and deployment identity

A fresh reduced-motion live demo flow recorded only these page requests:
`/demo`, its same-origin hashed JS, and its same-origin CSS. There were no
third-party, analytics, account, payment, database, or model requests.

Observed live response policy:

- Self-only CSP including `connect-src 'self'` and `frame-ancestors 'none'`.
- `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, HSTS, and a restrictive
  permissions policy.
- Hashed JS: `public, max-age=31536000, immutable`; worker: `no-cache`.
- `/downloads/caption-choice-memory.zip`: HTTP 200, `application/zip`.

Byte comparison established that the live deployment matches this candidate:

| Artifact | SHA-256 | Match |
| --- | --- | --- |
| `index.html` | `0e9487a0ac73400fdaa17727cd483e7d9c1a3a2cebe953fff912cbac20c9d5ed` | yes |
| hashed JS | `2bf2dbd5e41d4880c4db3c5c0503fddfb3838f2f70f27adc0792fff2c5f70c10` | yes |
| hashed CSS | `ff8a5e8ab327cf9ba9e39fb7c163fb057f99df2a35cc827f00a2693d7d0dbe30` | yes |
| hero WebP | `d69e21d33a4fee323d18d941551a7811d26582d87639ef77c50f9d99708a585a` | yes |
| service worker | `e8a1b0b3d5a05b9bb28db406df9934a65c1bf0bdc1a3acbbef7b3bd6665cd95a` | yes |
| extension ZIP | `cee4ed60156eba9dfed986d419602626159c554f5dc55069ca79a690103e16be` | yes |

This free static extension has no product server endpoint, sign-in, billing,
or unlock flow. Rate-limit/429, backend concurrency/persistence/health, and
Sociobot Entra checks are not applicable.

## Defects by severity

None found.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:live
npm run test:browser:live
```
