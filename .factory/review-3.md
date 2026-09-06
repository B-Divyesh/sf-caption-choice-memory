# Review 3 — keep caption choices one action away

Date: 2026-09-06 UTC

Work order: `caption-choice-memory-review-3`

Live URL: <https://caption-choice-memory.sociobot.in>

Implementation candidate: `d167480cdca449a16af610881be3270d1aed2d35`

Documentation reviewed: `5aa219e459c7b60499ed94d8da5966a8a0a74350`

The only non-documentation change after the implementation candidate is a
test-harness origin fix in `9ec8f0a3c5c3cfc51a2842f81b5d493fb851eff3`.
There is no runtime-file difference between `d167480` and the reviewed branch.

## Verdict

**FAIL.** There are 2 findings: 1 high and 1 medium. One public claim is
incompletely tested and false in the installed artifact, so the untested claim
count is 1. A successful build and test run do not change this product verdict.

## What the user sees first

This assessment was made in fresh 1440 × 1000 desktop and 390 × 844 phone
contexts before scrolling.

- Job: remember each video's site-specific caption language and on/off choice,
  then apply it in one action.
- Audience: viewers who repeatedly choose the same caption language and on/off
  setting across video sites.
- First action: **Try it with sample data**.
- Stated next result: apply English captions to a sample player.

The heading, audience sentence, action, next-result sentence, and three facts
were visible before scrolling on both viewports. Neither viewport overflowed
horizontally.

## Findings

### F-3-1 — High — the installed extension has no Alt+Shift+C shortcut

The landing page, demo, README, popup, and `keyboard-shortcut` claim say that
`Alt+Shift+C` applies the saved caption choice. The declared claim command
passes because it presses the key on `/demo`, where site JavaScript implements
a separate key listener. It does not exercise Chrome's extension command,
background worker, or content script.

In a fresh temporary Chromium profile, I loaded the built unpacked extension,
saved French for the live native-track fixture, disabled both tracks, focused
the fixture, and pressed `Alt+Shift+C` in headed Chromium under Xvfb.
`chrome.commands.getAll()` returned the `apply-caption-choice` command with
`shortcut: ""`. Both tracks remained disabled after the key press. The package
manifest contains the suggested key, but the clean runtime did not assign it.

This makes a public core-action claim false and leaves its real installed path
untested by the claim command. The button and automatic-apply paths still work.

Required repair: make the promised key work in a clean installed profile, then
change `@claim:keyboard-shortcut` to load the extension artifact and assert the
track result through the real command path. The test should also assert that
Chrome reports the expected assigned shortcut.

Evidence: `/work/.evidence/review-3-extension-shortcut.json`.

### F-3-2 — Medium — malformed backup errors expose parser jargon

The settings page correctly rejects wrong schema versions and duplicate sites,
and a valid file works after either error. A malformed JSON file such as
`{broken` instead shows:

> Expected property name or '}' in JSON at position 1 (line 1 column 2)

That is JavaScript parser text. It does not say that the backup is invalid or
tell the user to choose an exported Caption Choice Memory backup. This fails
the required invalid and recovery-path wording standard. The confirm button
does remain disabled, so invalid data is not imported.

Required repair: catch JSON parse errors and show a plain instruction such as
“This file is not a valid Caption Choice Memory backup. Choose a JSON file
exported by this extension.” Add a browser test for malformed JSON, wrong
schema, duplicate sites, and recovery with a valid file.

Evidence: `/work/.evidence/review-3-extension-invalid-imports.json`.

## Demo and real-data isolation

One click from the landing page entered `/?demo=1`. The first demo screen was
already populated with `watchroom.example`, “FIELD NOTES / EPISODE 04”, an
English-first choice, a Spanish second choice, and the caption “The tide turns
before the rain.” The persistent label remained visible after scrolling:
“Demo — sample data, nothing is saved”.

Applying once showed “English captions are on”. French and Spanish changes
worked. Reset removed `demo:caption-choice-memory:preference` and restored
English then Spanish. A seeded non-demo sentinel remained unchanged through
entry, changes, and reset. Browser requests stayed on the product origin.

The unsupported-player, no-video, site-off, captions-off, keyboard, malformed
demo-storage, and recovery-to-supported paths worked. The actual extension
also applied Spanish to the shipped native HTML5 fixture, stopped at four
languages, stored its per-site off state, rejected invalid backups without
writing them, accepted a valid recovery backup, and explained an unsupported
browser page.

## Declared claims

The clean checkout used Node 22.23.2 and npm 10.9.8. `npm ci` installed 207
packages and reported zero vulnerabilities. Every exact command declared in
`.factory/claims.json` exited successfully:

| Claim | Exact command | Command result | Product result |
| --- | --- | --- | --- |
| `one-action` | `npm test -- --grep @claim:one-action` | PASS | PASS |
| `site-memory` | `npm test -- --grep @claim:site-memory` | PASS | PASS |
| `offline-action` | `npm test -- --grep @claim:offline-action` | PASS | PASS |
| `private-requests` | `npm test -- --grep @claim:private-requests` | PASS | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS | PASS |
| `automatic-apply` | `npm test -- --grep @claim:automatic-apply` | PASS | PASS |
| `unsupported-notice` | `npm test -- --grep @claim:unsupported-notice` | PASS | PASS |
| `keyboard-shortcut` | `npm test -- --grep @claim:keyboard-shortcut` | PASS | **FAIL / incompletely tested** |
| `native-caption-tracks` | `npm run test:unit -- --testNamePattern @claim:native-caption-tracks` | PASS | PASS |
| `youtube-caption-controls` | `npm run test:unit -- --testNamePattern @claim:youtube-caption-controls` | PASS | PASS |
| `choice-export` | `npm test -- --grep @claim:choice-export` | PASS | PASS |
| `choice-import` | `npm test -- --grep @claim:choice-import` | PASS | PASS for declared valid-import scope |
| `download-package` | `npm test -- --grep @claim:download-package` | PASS | PASS |
| `language-limit` | `npm run test:unit -- --testNamePattern @claim:language-limit` | PASS | PASS |
| `free-no-account` | `npm run test:unit -- --testNamePattern @claim:free-no-account` | PASS | PASS |
| `mit-license` | `npm run test:unit -- --testNamePattern @claim:mit-license` | PASS | PASS |

There are 17 declared claims and exactly one tagged test location for each ID.
Landing and README claim-like statements map to the registry. F-3-1 is counted
as one untested claim because its tagged test proves only the demo substitute,
not the installed behavior a visitor relies on.

## Build, package, and live identity

| Check | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm test` | PASS: 8 Vitest and 24 Playwright tests |
| `npm run build` | PASS; created `.output/` and `dist/site/` |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `npm run test:browser:live` | PASS: 20/20 live tests |
| Live extension ZIP | PASS: 31,706 bytes, SHA-256 `62ca858b8e9a981eba87dbc90957d700e7c732a7a940ecd1e3399929a9476287` |
| Live service worker | PASS: 1,602 bytes, SHA-256 `4be674649423a921a9b0492c1ae88586f86f0ad53fae0707b58a85a1ac87a738` |

The live ZIP and service worker match the local implementation candidate.
Later commits changed reports and one live-origin test expectation, not runtime
files, so no newer product image is required.

The site JavaScript is 16,617 bytes raw and 5,397 bytes gzip. CSS is 15,145
bytes raw and 4,125 bytes gzip. The mobile hero is 25,156 bytes. These are
inside the supplied budgets.

## Accessibility, mobile, routes, and privacy

- `verify-url.sh` passed: HTTP 200, title, `lang=en`, one h1, one main, image
  alt text, labelled buttons, and no console errors.
- Live Axe checks found zero serious or critical issues on `/`, `/demo`,
  `/privacy`, `/terms`, and the 404 page. Popup and settings scans also found
  zero serious or critical issues.
- Tab order starts with **Skip to main content**, reaches the demo banner,
  navigation, switch, policies, selects, apply action, and footer, then wraps
  without a trap. Focus uses a visible solid outline.
- Directly operated mobile controls passed the 44 × 44 px regression test.
  The 390 px layout has no overflow. A 640 CSS px check represents a 1280 px
  desktop viewport at 200% zoom and retained every demo control without
  horizontal overflow.
- Reduced-motion mode left no element with a non-zero transition or animation
  duration. The visual thesis explicitly uses one painted light mode.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 with distinct titles,
  descriptions, canonicals, one h1, header, main, and footer.
- `/review-3-missing-page` deliberately returns HTTP 404 and shows the designed
  “Page not found” page with a return-home link. The expected 404 is not a
  defect.
- Every discovered internal, download, and credited external link returned a
  successful response. The sitemap lists every public route.
- The landing, demo, privacy, and terms flow requested only
  `caption-choice-memory.sociobot.in`. The extension requested only that fixture
  origin and its own `chrome-extension://` origin. No analytics, ads, payment,
  model, account, or remote database request was observed.
- The privacy and terms routes are present. The privacy route states what is
  stored, what is read, what leaves the device, and how demo data is removed.
- CSP is self-only and is delivered as a response header with
  `frame-ancestors 'none'`. HSTS, nosniff, strict-origin referrer policy, and a
  restrictive permissions policy are present. Hashed assets are immutable;
  the service worker is `no-cache`.
- Offline demo reload and update policy passed the live suite.

Mobile Lighthouse 12.8.2 scored 100 for performance, accessibility, best
practices, and SEO. FCP was 0.8 s, LCP 1.0 s, total blocking time 10 ms, and
CLS 0.

This is a static, free browser extension with no backend, tenant, sign-in,
billing, database, or product API. Tenant isolation, SQLite restart
persistence, health endpoints, live-request quotas, and 429/Retry-After checks
are not applicable. AI would not improve this deterministic caption-control
job; import and export already provide the useful local portability feature.

## Earlier finding disposition

All earlier review and verification reports, including minor findings, were
read and checked against the current source, live deployment, and installed
artifact.

### Earlier verification findings

| Earlier issue | Current evidence | Disposition |
| --- | --- | --- |
| Clean-install claim commands failed before WXT generated types | All 17 exact commands pass immediately after `npm ci`. | Fixed |
| Live extension ZIP returned 404 | Live ZIP returns 200, has a ZIP signature, and matches the candidate hash. | Fixed |
| Live service worker differed and offline reload failed | Worker matches the candidate, precaches hashed assets, uses `no-cache`, and offline live test passes. | Fixed |
| Privacy and site-memory claims tested only the demo | Current tests load the real extension profile and inspect Chrome storage and requests. | Fixed |
| Several public claims were unlisted | The registry now has 17 mapped claims. F-3-1 identifies a new installed-path coverage failure. | Fixed except F-3-1 |
| Demo shortcut worked only once | The current demo test presses it repeatedly and passes. | Fixed |
| Mobile actions were below 44 × 44 px | Current two-dimension mobile regression passes. | Fixed |
| Unknown routes returned HTTP 200 | Unknown live route returns a designed HTTP 404. | Fixed |
| Hashed assets had 30-second caching | Live hashed JS uses one-year immutable caching. | Fixed |
| No lint command existed | `npm run lint` exists and passes. | Fixed |

The critical ZIP and high service-worker findings repeated in verifications 2
and 3; the same live hash evidence closes each repetition. Verification 3's
remaining touch-target finding is also closed by the current two-dimension
test. Verification 4 reported no findings; all of its passing paths still pass
except the newly tested installed shortcut in F-3-1.

### Review 1 findings

| ID | Current evidence | Disposition |
| --- | --- | --- |
| F-1-1 | Demo sentinel and namespace isolation pass. | Fixed |
| F-1-2 | Reset removes the demo key and restores English then Spanish. | Fixed |
| F-1-3 | Store-readiness wording remains absent. | Fixed |
| F-1-4 | README gives a build instruction, not a reproducibility promise. | Fixed |
| F-1-5 | The absolute build-safety guarantee remains absent. | Fixed |
| F-1-6 | The unsigned-ZIP assertion remains absent. | Fixed |
| F-1-7 | README only names the Azure configuration path. | Fixed |
| F-1-8 | MIT claim and tagged license test pass. | Fixed |
| F-1-9 | Automatic apply is explained and the installed extension test passes. | Fixed |
| F-1-10 | JSON export/import and conflict preview exist and pass. | Fixed; malformed-file wording is the separate F-3-2 |
| F-1-11 | Native tracks and YouTube controls are named and tested. | Fixed |
| F-1-12 | The 404 includes route metadata and the standard shell. | Fixed |
| F-1-13 | The 404 h1 is “Page not found”. | Fixed |
| F-1-14 | The hero names caption language and on/off setting. | Fixed |
| F-1-15 | User copy consistently says caption choices. | Fixed |
| F-1-16 | The former hero slogan kicker is absent. | Fixed |
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
| F-1-33 | Real extension privacy and storage tests pass. | Fixed |
| F-1-34 | README has a plain build instruction. | Fixed |
| F-1-35 | The former 28-word build guarantee remains absent. | Fixed |
| F-1-36 | README says choices are stored “on this device”. | Fixed |
| F-1-37 | Developer guide remains the parent heading. | Fixed |

Review 2 reported zero findings. Its demo, copy, route, link, accessibility,
privacy, build, and deployment results remain valid. Its shortcut conclusion
depended on the demo claim test and did not detect F-3-1 in the installed
artifact.

## Evidence

- Claim command log: `/work/.evidence/review-3-claims.log`
- Full local checks: `/work/.evidence/review-3-local.log`
- Live suite: `/work/.evidence/review-3-live-suite.log`
- Desktop and phone browser record: `/work/.evidence/review-3-manual.json`
- Installed shortcut: `/work/.evidence/review-3-extension-shortcut.json`
- Installed normal and boundary paths: `/work/.evidence/review-3-extension-normal.json`
- Invalid imports: `/work/.evidence/review-3-extension-invalid-imports.json`
- Unsupported browser page: `/work/.evidence/review-3-extension-unsupported-page.json`
- Factory URL verification: `/work/.evidence/review-3-verify-url/verify.json`
- Lighthouse: `/work/.evidence/review-3-lighthouse.json`
- Screenshots: `/work/.evidence/review-3-*.png`

## Decision

**FAIL — 2 findings, 1 untested claim.** Repair F-3-1 and F-3-2, add installed
artifact coverage for both, and repeat the independent review before release.
