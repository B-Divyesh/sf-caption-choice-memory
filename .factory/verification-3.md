# Independent product verification — FAIL

Date: 2026-08-28 UTC  
Work order: `caption-choice-memory-verify-3`  
Candidate commit: `ac7d26da872f45fb902433fb12099ba36c4ec4c3`  
Live URL: https://caption-choice-memory.sociobot.in  
Artifact: Chrome MV3 extension plus static landing page and isolated demo

## Verdict

**FAIL — do not release.** The candidate builds and its local extension works, but the live primary install path returns 404. A visitor therefore cannot obtain the browser extension that performs the job. The live deployment also serves a different generated service worker from the candidate.

## Mandatory initial checks

The repository was initially checked out at `94a3922`, which is a later documentation commit, rather than the requested candidate. No candidate conclusion was drawn from it. I detached HEAD at the requested SHA, ran `npm ci`, then ran every exact test command in `.factory/claims.json` against the product's demo/test entry point.

The first attempted command before installing dependencies exited because `tsc` was not installed; that is expected in an uninstalled clone and is not counted as a product test result. After the locked install, all required commands passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| one-action | `npm test -- --grep @claim:one-action` | PASS |
| site-memory | `npm test -- --grep @claim:site-memory` | PASS |
| offline-action | `npm test -- --grep @claim:offline-action` | PASS |
| private-requests | `npm test -- --grep @claim:private-requests` | PASS |
| unsupported-notice | `npm test -- --grep @claim:unsupported-notice` | PASS |
| keyboard-shortcut | `npm test -- --grep @claim:keyboard-shortcut` | PASS |
| player-controls | `npm run test:unit -- --testNamePattern @claim:player-controls` | PASS |
| download-package | `npm test -- --grep @claim:download-package` | PASS locally |
| language-limit | `npm run test:unit -- --testNamePattern @claim:language-limit` | PASS |
| free-no-account | `npm run test:unit -- --testNamePattern @claim:free-no-account` | PASS |

The claim file exists and declares ten claimed behaviors. The tests use the real demo or a Chromium profile loading the built extension. The local `download-package` result does **not** prove the broken live deployment; see the release blocker below.

## Cold first read

**PASS.** In a fresh 1440 × 900 browser context, the first screen plainly says:

- What it does: “Keep caption choices one action away.”
- Who it is for: viewers who repeat the same language and caption setting on video sites.
- What to click: the visible, one-click **Try it with sample data** link, with the immediate outcome (“Then apply English captions to a sample player.”).

The link opens `/demo`. The first demo screen contains a saved English-first rule, a sample player, and the persistent “Demo — sample data, nothing is saved” banner with Reset demo and Start for real. This satisfies the plain-words and sandbox entry requirements.

## Local build and automated checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 207 packages, 0 reported vulnerabilities |
| `npm test` | PASS — 5 Vitest tests and 16 Playwright tests; final `test-results/.last-run.json` reports `passed` |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (TypeScript no-emit check) |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run build` | PASS — MV3 output, ZIP, and `dist/site/` produced |
| package validation | PASS — `unzip -t .output/caption-choice-memory-1.0.0-chrome.zip` reports no errors |

Production output is within the stated static-product budgets: site JS is 15,670 bytes raw / 5,180 bytes gzip; CSS is 14,936 bytes raw / 4,070 bytes gzip; mobile hero is 25,156 bytes; extension ZIP is 28,049 bytes and unpacked extension is 39.28 KB.

## End-to-end behavior

### Built extension and local demo

PASS:

- The real MV3 extension, loaded into a fresh Chromium profile, saves a site-specific ordered choice, selects the preferred native text track, and switches all exposed tracks off for the off policy.
- An unconfigured site remains unchanged. The popup reports the no-video/unsupported recovery path and limits saved language order to four unique entries.
- The demo applies English, Spanish, and French captions, keeps the repeated `Alt+Shift+C` shortcut working, turns captions off, explains unsupported/no-video states, honors the per-site off switch, resets sample data, and recovers from malformed demo JSON.
- The demo uses only the documented `demo:caption-choice-memory:preference` localStorage namespace. The extension privacy claim records only `chrome-extension://` and fixture-origin requests.

### Live demo

PASS for the deployed web shell: on `/demo`, changing to French and applying showed “French captions are on” and the French sample line; changing to Spanish then pressing `Alt+Shift+C` showed the Spanish result. The page's observed request log contained only `https://caption-choice-memory.sociobot.in`; there were no third-party fonts, analytics, account, payment, or model requests.

After the first online visit, the live service worker controlled `/demo`; an offline reload retained the demo heading and worked. `registration.update()` completed and the active script was `/service-worker.js`. This does not resolve the candidate-identity mismatch described below.

## Deployment identity and availability

The principal HTML, hashed JS/CSS, hero images, social image, `404.html`, `robots.txt`, and `sitemap.xml` were byte-for-byte matches to the candidate build. The generated deployment artifacts were not:

| Artifact | Candidate | Live | Result |
| --- | --- | --- | --- |
| `/downloads/caption-choice-memory.zip` | 28,049-byte MV3 ZIP, SHA-256 `cee4ed60156eba9dfed986d419602626159c554f5dc55069ca79a690103e16be` | HTTP 404, 599-byte HTML page | **FAIL** |
| `/service-worker.js` | SHA-256 `3cbdeba5b77c60ec133438414457d967d368cda6f8ee10de54d1b0c043f19753`, generated CSS/JS precache list | SHA-256 `1b921453a9c0165281e908a68805d59f93fc5eb4b4660266d2627ca6a8a5712e`, `BUILT_ASSETS = []` | **FAIL** |

The landing page’s only installation link targets the missing ZIP. This is not a cosmetic issue: the actual extension cannot be installed, so the user cannot complete the product’s real job outside the illustrative demo.

Known routes returned 200; a random unknown route returned a designed page with genuine HTTP 404. Hashed assets had the required `Cache-Control: public, max-age=31536000, immutable`, while the worker correctly used `Cache-Control: no-cache`.

## Accessibility, keyboard, mobile, and visual checks

PASS:

- `/opt/fleet/lib/verify-url.sh` passed against the live landing page. Evidence is in `.factory/evidence/verification-3/`: one title, `lang=en`, one h1, main landmark, image alts, labelled buttons, and no landing-page console errors.
- Playwright axe found **zero serious or critical** violations on live `/`, `/demo`, `/privacy`, `/terms`, and the designed 404 screen.
- Valid routes had no console or page errors. The 404 navigation alone logs the browser's expected failed-main-document 404 message.
- Keyboard navigation reaches controls, carries a visible yellow 4 px focus outline with a 3 px offset, and repeated keyboard caption application works.
- At 390 px, the page has no horizontal overflow; reduced motion yields `transition-duration: 0s`. The inspected mobile screenshot is in the evidence directory.

FAIL / finding:

- Several actual mobile hit rectangles remain smaller than the required 44 × 44 CSS px. The header **Demo** link is 38.9 × 44 px. The demo's two language `<select>` controls are 275.6 × 34 px. Native radio inputs are visually 13 × 13 px (their labels are larger); the switch's input is 52 × 32 px. The existing regression test asserts only height for a small selected set, so it does not catch these controls. This falls short of the supplied 44 px touch-target requirement.

## Privacy, headers, and non-applicable checks

The live root sent a self-only CSP (`default-src`, `script-src`, `style-src`, `img-src`, `font-src`, and `connect-src`), `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, HSTS, and a permissions policy disabling camera, microphone, geolocation, and payment. No outgoing request during the landing/demo flow used another origin.

This is a free, static browser extension without product server endpoints, sign-in, billing, or a product-unlock call. Rate-limit/429 allowance, backend concurrency/persistence/health identity, and Sociobot Entra tenant checks are not applicable.

## Defects by severity

### Critical — release blocking

1. **The live extension ZIP is missing.** `GET /downloads/caption-choice-memory.zip` is HTTP 404, although the candidate build produces the valid 28,049-byte archive. The primary install action is broken and the real extension cannot be obtained.

### High

2. **Live deployment is not the candidate's complete build.** Its service worker is a different hash and has an empty generated asset list. Update behavior may look functional due to runtime caching, but the candidate’s generated worker was not deployed and build identity cannot be accepted.

### Medium

3. **Mobile touch targets do not meet 44 × 44 px.** The header Demo link and demo language selects are directly operable controls below the required size.

## Required next steps

Deploy the complete `dist/site/` output, including the ZIP and generated `service-worker.js`, then verify both SHA-256 values and the installation link live. Increase the header-link and select control hit areas to at least 44 × 44 px and add an automated regression that checks both dimensions. Re-run this verification after deployment.
