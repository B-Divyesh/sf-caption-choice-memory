# Review 4 — keep caption choices one action away

Date: 2026-09-06 UTC

Work order: `caption-choice-memory-review-4`

Live URL: <https://caption-choice-memory.sociobot.in>

Implementation candidate: `eb18ee5c7f151fd4f34b6edec19f3de592cb8843`

Documentation reviewed: `a8edf030cb84e6a6c9db1f0acb7f2f6d69eee7ee`

The SHAs differ because `a52b16e` only changed which installed-extension
claims the live-site suite skips, while `88f5782` and `a8edf03` changed factory
reports. None changes a shipped runtime file. A clean build from the reviewed
branch matches all 17 live runtime files byte-for-byte.

## Verdict

**PASS — 0 findings and 0 untested claims.**

The live site, isolated demo, downloaded MV3 extension, legal pages, offline
path, update policy, and designed 404 meet the supplied contracts. Every exact
claim command passed from a clean checkout. The complete suite passed 8 unit
and 24 browser tests, and the applicable live suite passed 19/19.

## First screen before scrolling

Fresh Chromium contexts were opened at 1440 × 1000 and 390 × 844. Neither was
scrolled before this assessment.

| Required point | Visible text | Result |
| --- | --- | --- |
| Job | “Keep caption choices one action away” | PASS |
| Audience | “For viewers who choose the same caption language and on/off setting across video sites.” | PASS |
| First action | **Try it with sample data** | PASS |
| Next result | “Then apply English captions to a sample player.” | PASS |
| Facts | Choices stay in this browser; work offline; free with no account | PASS |

All five areas fit in both initial viewports. The phone page was 390 CSS px
wide with no horizontal overflow. The title names the product and job. The
copy is plain, consistent, and contains none of the banned marketing words.

## Demo and recovery paths

The first action entered `/?demo=1` in one click. The populated screen already
showed “FIELD NOTES / EPISODE 04”, English then Spanish, “The tide turns before
the rain.”, and “English captions are on”. One Apply action produced the
English result. Selecting Spanish produced “Spanish captions are on” and the
Spanish sample line.

The persistent label “Demo — sample data, nothing is saved”, **Reset demo**,
and **Install the extension** stayed visible after scrolling on phone and
desktop. Reset removed `demo:caption-choice-memory:preference`, restored
English then Spanish, and left a seeded non-demo sentinel unchanged. Demo
requests stayed on the product origin.

Normal, invalid, boundary, and recovery results all passed:

- Captions on, captions off, the per-site off switch, supported player,
  unsupported player, and no-video paths gave the correct result and next
  step.
- Malformed demo storage recovered to the English-first sample without
  changing the non-demo sentinel.
- `Ctrl+Shift+Y` applied French repeatedly after the language changed.
- The live offline claim reloaded the service-worker-controlled demo without
  network access and applied Spanish.
- A 640 CSS px viewport, equivalent to a 1280 px layout at 200% sizing, kept
  all 17 interactive controls present with no horizontal overflow.

## Downloaded extension

The 31,788-byte live ZIP was downloaded, unpacked, and loaded in a new Chromium
profile. The installed artifact used the live native-caption fixture.

- The popup identified `caption-choice-memory.sociobot.in`, saved Spanish, and
  changed the Spanish track from disabled to showing.
- The off policy disabled both tracks.
- Chrome reported `Ctrl+Shift+Y` for `apply-caption-choice`; pressing it
  applied Spanish through the background and content-script path.
- The language list stopped at four and disabled **Add** in the claim suite.
- Export produced valid JSON. Malformed JSON, the wrong schema, and duplicate
  sites kept Import disabled and preserved storage.
- A valid file after an invalid file previewed one replacement and imported
  French then English.
- Requests were limited to the product fixture origin and the extension's own
  `chrome-extension://` origin.

This directly re-proves the repaired shortcut and plain import-error paths from
Review 3 in the live downloadable artifact.

## Declared claims

A detached clean checkout at `a8edf03` used Node 22.23.2 and npm 10.9.8.
`npm ci` installed the locked 207 packages and reported zero vulnerabilities.
Every exact command in `.factory/claims.json` passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `one-action` | `npm test -- --grep @claim:one-action` | PASS |
| `site-memory` | `npm test -- --grep @claim:site-memory` | PASS |
| `offline-action` | `npm test -- --grep @claim:offline-action` | PASS |
| `private-requests` | `npm test -- --grep @claim:private-requests` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `automatic-apply` | `npm test -- --grep @claim:automatic-apply` | PASS |
| `unsupported-notice` | `npm test -- --grep @claim:unsupported-notice` | PASS |
| `keyboard-shortcut` | `npm test -- --grep @claim:keyboard-shortcut` | PASS |
| `native-caption-tracks` | `npm run test:unit -- --testNamePattern @claim:native-caption-tracks` | PASS |
| `youtube-caption-controls` | `npm run test:unit -- --testNamePattern @claim:youtube-caption-controls` | PASS |
| `choice-export` | `npm test -- --grep @claim:choice-export` | PASS |
| `choice-import` | `npm test -- --grep @claim:choice-import` | PASS |
| `download-package` | `npm test -- --grep @claim:download-package` | PASS |
| `language-limit` | `npm run test:unit -- --testNamePattern @claim:language-limit` | PASS |
| `free-no-account` | `npm run test:unit -- --testNamePattern @claim:free-no-account` | PASS |
| `mit-license` | `npm run test:unit -- --testNamePattern @claim:mit-license` | PASS |

Each ID occurs at exactly one tagged test location. Landing, demo, privacy,
terms, extension, package, and README statements map to these claims or are
instructions and stated limitations. No false, incomplete, missing, or
untested public claim was found.

## Local and live gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 207 packages, 0 vulnerabilities |
| All 17 exact claim commands | PASS — 17/17 |
| `npm test` | PASS — 8 Vitest and 24 Playwright tests |
| `npm run lint` | PASS |
| `npm run build` | PASS — `.output/` and `dist/site/` created |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| ZIP integrity | PASS — no errors in compressed data |
| `npm run test:live` | PASS — ZIP and worker hashes match |
| `npm run test:browser:live` | PASS — 19/19 |
| Factory `verify-url.sh` | PASS — HTTP 200 and no console errors |
| Lighthouse 12.8.2 mobile | PASS — 100/100/100/100 |

The static payload remains well below budget: 16,619 bytes of JavaScript,
15,145 bytes of CSS, and a 25,156-byte mobile hero image. Lighthouse measured
FCP 0.8 s, LCP 1.0 s, TBT 10 ms, and CLS 0.

## Routes, access, privacy, and updates

- `/`, `/demo`, `/privacy`, and `/terms` return 200 with distinct plain titles,
  descriptions, canonicals, `lang=en`, one h1, and header/main/footer landmarks.
- `/review-4-deliberate-missing` returns the expected HTTP 404 and the designed
  “Page not found” screen with a return-home action. Its browser failed-resource
  message is the expected result of requesting a 404, not a product defect.
- Every same-origin link discovered on the landing page returned 200, including
  the ZIP. The factory credit is visibly marked as an external site; the review
  did not cross the work order's product boundary to inspect that other host.
- The sitemap lists all four public routes. `robots.txt` points to the sitemap.
- Axe found no serious or critical issue on every public route, the 404,
  popup, or settings. The skip link is the first focus stop and has a visible
  4 px yellow outline. Route navigation focuses the new h1 and browser Back
  restores the prior route.
- Directly operated phone controls pass both 44 px dimensions. Reduced-motion
  mode left zero elements with a non-zero animation or transition duration.
- Successful route and demo flows produced no console or page errors. Requests
  stayed on the product origin; no third-party font, script, analytics, ad,
  payment, account, database, or model request appeared.
- CSP is self-only and sends `frame-ancestors 'none'` as a header. HSTS,
  `nosniff`, strict-origin referrer policy, and a restrictive permissions
  policy are present. Hashed assets are immutable and the service worker is
  `no-cache`.

## Candidate identity

All 17 deployable files, excluding the deployment-only
`staticwebapp.config.json`, returned 200 and matched the clean build by SHA-256.
Key artifacts are:

| Artifact | Size | SHA-256 |
| --- | ---: | --- |
| Extension ZIP | 31,788 bytes | `6e36605097121c540842eb6408b0706b5c2ea7fc77f47fda36414cc9f7e54985` |
| Service worker | 1,602 bytes | `935ff94734409bf45129679661c611972edf47324158417e5719a37c65da1363` |
| Site JavaScript | 16,619 bytes | `31ea1f4bbcd4dd1bf27a1a1c080964bcd30f9aebfcc810e8b6e55805451ab932` |
| Site CSS | 15,145 bytes | `76d830339d4125537a5dca61cc5b9a118aa2d4aa9bb2621c777f8ebc34a060a2` |

No deployment was performed.

## Earlier finding disposition

All earlier reviews, verifications, polish notes, and their minor findings were
read and checked against the live product, current tests, and installed ZIP.

### Earlier verification issues

| Earlier issue | Current proof | Disposition |
| --- | --- | --- |
| Clean claim commands failed before WXT types existed | All 17 exact commands pass immediately after clean `npm ci`. | Fixed |
| Live extension ZIP was missing | ZIP returns 200, passes integrity, installs, and matches the candidate. | Fixed |
| Service worker was stale and offline reload failed | Worker matches, precaches hashed assets, uses `no-cache`, and the offline test passes. | Fixed |
| Storage/privacy tests used only the demo | Tests now load the extension, inspect Chrome storage, and record requests. | Fixed |
| Public claims were unlisted | The 17-item registry maps all current public claims. | Fixed |
| Demo shortcut worked only once | Repeated `Ctrl+Shift+Y` applies the current language. | Fixed |
| Mobile targets were below 44 × 44 px | The two-dimension live regression passes all operated controls. | Fixed |
| Unknown routes returned 200 | A fresh unknown route returns the designed HTTP 404. | Fixed |
| Hashed assets had short caching | Hashed assets use one-year immutable caching. | Fixed |
| No lint command existed | `npm run lint` exists and passes. | Fixed |

### Review 1 findings

| ID | Current proof | Disposition |
| --- | --- | --- |
| F-1-1 | Demo namespace and seeded real-data isolation pass. | Fixed |
| F-1-2 | Reset removes demo data and restores English then Spanish. | Fixed |
| F-1-3 | Store-readiness wording remains absent. | Fixed |
| F-1-4 | README gives an instruction, not a reproducibility promise. | Fixed |
| F-1-5 | The absolute build-safety guarantee remains absent. | Fixed |
| F-1-6 | The unsigned-ZIP assertion remains absent. | Fixed |
| F-1-7 | README only identifies the deployment configuration file. | Fixed |
| F-1-8 | The MIT claim and tagged test pass. | Fixed |
| F-1-9 | Automatic apply is explained and passes in the extension. | Fixed |
| F-1-10 | JSON export, preview, import, invalid input, and recovery pass. | Fixed |
| F-1-11 | Native tracks and YouTube controls are named and tested. | Fixed |
| F-1-12 | The real 404 has route metadata and the standard shell. | Fixed |
| F-1-13 | The 404 h1 is “Page not found”. | Fixed |
| F-1-14 | The first screen names language and the on/off setting. | Fixed |
| F-1-15 | User copy consistently says caption choices. | Fixed |
| F-1-16 | The former hero slogan is absent. | Fixed |
| F-1-17 | The image label says “Saved caption choice”. | Fixed |
| F-1-18 | The caption explains the ordered language list. | Fixed |
| F-1-19 | The preview heading names saving a caption choice. | Fixed |
| F-1-20 | “Three moves” remains absent. | Fixed |
| F-1-21 | The step says “Rank preferred languages”. | Fixed |
| F-1-22 | Limits use “available caption controls”. | Fixed |
| F-1-23 | Installation heading names the Chrome extension. | Fixed |
| F-1-24 | The tab says “Free · choices stay in Chrome”. | Fixed |
| F-1-25 | Installation copy says ZIP, unzip, and Load unpacked. | Fixed |
| F-1-26 | The internal art-production footer note remains absent. | Fixed |
| F-1-27 | Demo exit says “Install the extension”. | Fixed |
| F-1-28 | README names the language and on/off choice. | Fixed |
| F-1-29 | README avoids MV3 and “caption-dependent” in its introduction. | Fixed |
| F-1-30 | README says “Try the demo with sample data”. | Fixed |
| F-1-31 | README explains separate demo storage in user terms. | Fixed |
| F-1-32 | README leads with the result before track terminology. | Fixed |
| F-1-33 | Installed storage and request-isolation tests pass. | Fixed |
| F-1-34 | README has a plain build instruction. | Fixed |
| F-1-35 | The former 28-word guarantee remains absent. | Fixed |
| F-1-36 | README says choices are stored “on this device”. | Fixed |
| F-1-37 | Developer guide remains the parent heading. | Fixed |

### Review 3 findings

| ID | Current proof | Disposition |
| --- | --- | --- |
| F-3-1 | A clean installed artifact reports `Ctrl+Shift+Y`; pressing it shows Spanish through the MV3 command path. | Fixed |
| F-3-2 | Malformed, wrong-schema, and duplicate backups show plain recovery text, preserve storage, and accept a valid file afterward. | Fixed |

Review 2 and Verification 4 reported no findings. Their passing areas were
independently rechecked here.

## Applicability and missed leverage

This is a free static browser extension with no backend, tenant, database,
sign-in, billing, product API, or model call. SQLite restart persistence,
health, tenant isolation, rate limiting, and 429/Retry-After checks do not
apply. Caption control is deterministic, so an AI feature would not improve
the stated job. Local JSON import/export already supplies the useful
portability implied by a local-first product; cloud sync would conflict with
the current privacy promise.

## Evidence

- Required report copy: `/work/.evidence/qa-report.md`
- Required result: `/work/.evidence/qa-result.json`
- URL verifier: `/work/.evidence/review-4-verify-url/verify.json`
- Lighthouse: `/work/.evidence/review-4-lighthouse-rerun.json`
- Fresh first screens: `/work/.evidence/review-4-desktop-first-screen.png`,
  `/work/.evidence/review-4-phone-first-screen.png`
- Fresh demo screens: `/work/.evidence/review-4-desktop-demo.png`,
  `/work/.evidence/review-4-phone-demo.png`
- Installed settings recovery: `/work/.evidence/review-4-live-extension-settings.png`

## Findings

None. Finding count: **0**. Untested claim count: **0**.

## Decision

**PASS — 0 findings and 0 untested claims.**
