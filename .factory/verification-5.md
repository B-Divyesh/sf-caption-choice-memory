# Verification 5 — keep caption choices one action away

Date: 2026-09-06 UTC  
Work order: `caption-choice-memory-verify-5`  
Live URL: <https://caption-choice-memory.sociobot.in>  
Implementation candidate: `eb18ee5c7f151fd4f34b6edec19f3de592cb8843`  
Documentation reviewed: `88f5782a632e6e7c13736189115293bf8a8306c1`

## Verdict

**PASS — 0 findings and 0 untested claims.**

The live browser extension, product site, isolated demo, legal routes, offline
path, and designed 404 meet the supplied contracts. All 17 declared claim
commands passed from a clean checkout. The full local suite passed 8 unit and
24 browser tests, and all 19 applicable live browser checks passed.

The implementation SHA and documentation SHA differ because later commits
only changed the live test selection and factory reports. The complete live
runtime matches the implementation candidate byte-for-byte.

## First screen before scrolling

Fresh Chromium contexts were opened at 1440 × 1000 and 390 × 844. Neither was
scrolled before this assessment.

| Required point | Text visible on desktop and phone | Result |
| --- | --- | --- |
| Job | “Keep caption choices one action away” | PASS |
| Audience | “For viewers who choose the same caption language and on/off setting across video sites.” | PASS |
| First action | **Try it with sample data** | PASS |
| Immediate result | “Then apply English captions to a sample player.” | PASS |
| Plain facts | Choices stay in this browser; work offline; free with no account | PASS |

All five areas fit within each initial viewport. Both layouts had no horizontal
overflow. The title names the product and job, and the copy uses plain terms.

## Demo and normal user paths

The first action opened `/?demo=1` in one click. The initial screen already
showed `watchroom.example`, “FIELD NOTES / EPISODE 04”, English then Spanish,
the sample line “The tide turns before the rain.”, and “English captions are
on”.

- One Apply click produced the English result and visible caption.
- Selecting Spanish produced “Spanish captions are on” and the Spanish line.
- `Ctrl+Shift+Y` repeatedly applied the selected sample choice.
- The persistent “Demo — sample data, nothing is saved” label, **Reset demo**,
  and **Install the extension** remained visible after scrolling on phone and
  desktop.
- Reset removed `demo:caption-choice-memory:preference`, restored English then
  Spanish, and left a seeded non-demo sentinel unchanged.
- Demo traffic used only `caption-choice-memory.sociobot.in`.

Normal, invalid, boundary, and recovery checks passed:

- Captions-on, captions-off, per-site off, supported-player, unsupported-player,
  and no-video outcomes all gave the expected result and a next step.
- Malformed demo storage fell back to the English-first sample without an
  error or change to the non-demo sentinel.
- A 200%-zoom equivalent viewport retained the full demo without horizontal
  overflow.

## Installed live artifact

The live ZIP was downloaded, unpacked, and loaded as an MV3 extension in a new
Chromium profile. This independent installed-artifact run used the live native
caption fixture.

- Chrome reported `Ctrl+Shift+Y` for `apply-caption-choice`. Pressing it changed
  the Spanish text track from disabled to showing through the background and
  content-script path.
- The popup saved the site choice, applied Spanish, and then disabled both
  tracks for the off policy.
- The language list stopped at four and disabled **Add**.
- Export downloaded valid JSON containing the saved site choice.
- Malformed JSON and wrong-schema files showed the plain recovery instruction.
- A duplicate-site file explained how to remove the duplicate.
- Every invalid import kept Import disabled and left storage unchanged.
- A valid file after each invalid state previewed one replacement and imported
  French then English successfully.
- Observed requests were limited to the product fixture origin and the loaded
  `chrome-extension://` origin.

This directly closes Review 3's installed-shortcut and parser-jargon findings.

## Declared claims

The clean checkout was detached at the implementation candidate before
installing prerequisites. Node 22.23.2 and npm 10.9.8 ran `npm ci`, which
installed the locked 207 packages and reported zero vulnerabilities. Every
exact command in `.factory/claims.json` then passed. Each claim ID occurs at
exactly one tagged test location.

| Claim | Exact declared command | Result |
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

Landing, privacy, terms, extension, and README statements map to these claims
or are instructions and limitations. No false, incomplete, missing, or
untested public claim was found.

## Local gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 207 packages, 0 vulnerabilities |
| `npm test` | PASS — 8 Vitest and 24 Playwright tests |
| `npm run lint` | PASS |
| `npm run build` | PASS — `.output/` and `dist/site/` created |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| ZIP integrity | PASS — 15 files, no archive errors |
| `npm run test:live` | PASS — live ZIP and service worker match |
| Applicable live browser suite | PASS — 19/19 |

The built site JavaScript is 16,619 bytes raw / 5.37 KB gzip and CSS is
15,145 bytes raw / 4.11 KB gzip. The phone hero is 25,156 bytes. These are
inside the supplied budgets.

## Live routes, links, privacy, and offline behavior

| Route | HTTP | Title | H1 |
| --- | ---: | --- | --- |
| `/` | 200 | Caption Choice Memory — save caption choices | Keep caption choices one action away |
| `/demo` | 200 | Demo — Caption Choice Memory | Apply your saved captions |
| `/privacy` | 200 | Privacy — Caption Choice Memory | Your caption choices stay in your browser |
| `/terms` | 200 | Terms — Caption Choice Memory | Use the extension with supported players |
| unknown path | 404 | Page not found — Caption Choice Memory | Page not found |

Every route had `lang="en"`, one h1, one main, header, footer, description, and
canonical URL. The expected unknown-route 404 is correctly designed and is not
a defect. Every discovered internal, download, hash, and credited external
link returned 200. `robots.txt` points to the sitemap, and the sitemap lists
all four public routes.

The live CSP is self-only and includes `frame-ancestors 'none'` as a response
header. HSTS, `nosniff`, strict-origin referrer policy, and restrictive camera,
microphone, geolocation, and payment permissions are present. Hashed assets
use one-year immutable caching; the service worker uses `no-cache`.

After an online visit, the service worker controlled `/demo`, updated
successfully, and cached the shell, every public route, both hashed assets,
the responsive hero, and favicon. A fresh offline reload still applied Spanish
and rendered its sample caption with no console error.

This product is a static, free browser extension. It has no backend, tenant,
database, sign-in, billing, product API, or model call. SQLite persistence,
health, tenant isolation, live request quotas, and 429/Retry-After checks are
therefore not applicable. AI would not improve this deterministic caption
control job; local import/export is the useful portability feature.

## Accessibility, keyboard, mobile, and performance

- The required URL verifier passed: HTTP 200, title, `lang=en`, one h1, one
  main, complete image alt text, labelled buttons, and no console errors.
- Playwright Axe found zero violations of any severity on `/`, `/demo`,
  `/privacy`, `/terms`, the designed 404, popup, and settings page.
- Tab starts at the skip link and reaches banner actions, navigation, the site
  switch, policy choices, language selectors, player selector, Apply, and
  footer links without a trap. Every sampled stop had a 4 px yellow outline
  and 3 px offset.
- All directly operated phone controls passed both 44 px dimensions. The
  390 px layout and 200% text-size equivalent had no horizontal overflow.
- Reduced-motion mode left no non-zero animation or transition duration.
- The product's deliberate single light treatment matches its documented
  visual thesis; Axe found no contrast failure.
- Lighthouse 13.4.1 scored 100 performance, 100 accessibility, 100 best
  practices, and 100 SEO. FCP was 0.8 s, LCP 1.0 s, total blocking time 0 ms,
  and CLS 0.

## Live candidate identity

All 17 deployable runtime files, excluding the Azure configuration consumed at
deployment, matched the clean implementation build byte-for-byte. This covers
HTML, CSS, JavaScript, images, icons, VTT fixtures, legal/404 assets, robots,
sitemap, service worker, and extension ZIP.

| Artifact | Size | SHA-256 | Result |
| --- | ---: | --- | --- |
| Live extension ZIP | 31,788 bytes | `6e36605097121c540842eb6408b0706b5c2ea7fc77f47fda36414cc9f7e54985` | MATCH |
| Live service worker | 1,602 bytes | `935ff94734409bf45129679661c611972edf47324158417e5719a37c65da1363` | MATCH |

## Earlier finding disposition

All prior review, polish, verification, and handoff reports were read.

### Earlier verification findings

| Earlier issue | Current proof | Disposition |
| --- | --- | --- |
| Clean-install claims and TypeScript failed before WXT generated files | All 17 exact commands and the full suite passed immediately after clean `npm ci`. | Fixed |
| Live ZIP was absent | It returns 200 as a valid 31,788-byte MV3 ZIP and matches the candidate. | Fixed |
| Live worker was stale and offline reload failed | Worker matches, precaches hashed assets, updates, and serves a working offline demo. | Fixed |
| Privacy and storage were tested only in the demo | Clean installed-profile checks inspect extension storage and request origins. | Fixed |
| Public claims were missing or incomplete | The registry has 17 claims, one tagged test each, and no uncovered claim was found. | Fixed |
| Demo shortcut worked only once | Repeated application works; the installed command path also passes. | Fixed |
| Mobile targets were under 44 × 44 px | The two-dimension regression and fresh 390 px run pass. | Fixed |
| Unknown routes returned HTTP 200 | A fresh unknown path returns the designed HTTP 404. | Fixed |
| Hashed assets used 30-second caching | Live hashed assets use one-year immutable caching. | Fixed |
| No lint command existed | `npm run lint` exists and passes. | Fixed |

### Review 1 findings

| ID | Current proof | Disposition |
| --- | --- | --- |
| F-1-1 | Seeded real data survived demo changes; only the demo namespace changed. | Fixed |
| F-1-2 | Reset removed the demo key and restored English then Spanish. | Fixed |
| F-1-3 | Store-readiness wording remains absent. | Fixed |
| F-1-4 | README gives a build instruction, not a reproducibility promise. | Fixed |
| F-1-5 | The absolute build-safety guarantee remains absent. | Fixed |
| F-1-6 | The unsigned-ZIP assertion remains absent. | Fixed |
| F-1-7 | README only names the configuration file location. | Fixed |
| F-1-8 | The MIT claim and tagged license test pass. | Fixed |
| F-1-9 | Automatic apply is explained and passes in the installed extension. | Fixed |
| F-1-10 | Local JSON export, preview, import, and recovery pass. | Fixed |
| F-1-11 | Native tracks and YouTube controls are named and tested. | Fixed |
| F-1-12 | The 404 has route metadata and the standard site shell. | Fixed |
| F-1-13 | The 404 h1 is “Page not found”. | Fixed |
| F-1-14 | The first screen names language and the on/off setting. | Fixed |
| F-1-15 | Current user copy consistently says caption choices. | Fixed |
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
| F-1-27 | The demo exit names its result: “Install the extension”. | Fixed |
| F-1-28 | README names the language and on/off choice. | Fixed |
| F-1-29 | README avoids MV3 and “caption-dependent” in its introduction. | Fixed |
| F-1-30 | README says “Try the demo with sample data”. | Fixed |
| F-1-31 | README explains separate demo storage in user terms. | Fixed |
| F-1-32 | README leads with the user result before track terminology. | Fixed |
| F-1-33 | Installed storage and request-isolation tests pass. | Fixed |
| F-1-34 | README has a plain build instruction. | Fixed |
| F-1-35 | The former 28-word build guarantee remains absent. | Fixed |
| F-1-36 | README says choices are stored “on this device”. | Fixed |
| F-1-37 | Developer guide remains the parent heading. | Fixed |

Review 2 and Verification 4 reported zero findings. Their demo, copy, route,
link, accessibility, privacy, build, and deployment results were independently
rechecked here and still pass.

### Review 3 findings

| ID | Current proof | Disposition |
| --- | --- | --- |
| F-3-1 | A clean install reports `Ctrl+Shift+Y`; pressing it activates Spanish through the MV3 command path. | Fixed |
| F-3-2 | Malformed, wrong-schema, and duplicate backups show plain recovery text, preserve storage, and accept a valid file afterward. | Fixed |

## Findings

None.

Untested claim count: **0**.

## Evidence

- `/work/.evidence/caption-choice-memory-verification-5/claims.log`
- `/work/.evidence/caption-choice-memory-verification-5/local-gates.log`
- `/work/.evidence/caption-choice-memory-verification-5/live-suites.log`
- `/work/.evidence/caption-choice-memory-verification-5/live-manual.json`
- `/work/.evidence/caption-choice-memory-verification-5/installed-artifact.json`
- `/work/.evidence/caption-choice-memory-verification-5/live-identity-routes.json`
- `/work/.evidence/caption-choice-memory-verification-5/offline-update.json`
- `/work/.evidence/caption-choice-memory-verification-5/axe.json`
- `/work/.evidence/caption-choice-memory-verification-5/keyboard.json`
- `/work/.evidence/caption-choice-memory-verification-5/lighthouse.json`
- `/work/.evidence/caption-choice-memory-verification-5/verify-url/verify.json`
- `/work/.evidence/caption-choice-memory-verification-5/desktop.png`
- `/work/.evidence/caption-choice-memory-verification-5/phone.png`
