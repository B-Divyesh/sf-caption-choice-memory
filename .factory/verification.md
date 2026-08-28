# Independent product verification — FAIL

Date: 2026-08-28 (UTC)

- Work order: `caption-choice-memory-verify-1`
- Candidate: `483ae3042d599cea73001fd6f4c7248d4d298690`
- Branch: `main`
- Live URL: `https://caption-choice-memory.sociobot.in`
- Artifact: Chrome MV3 browser extension with a static product/demo site
- Verdict: **FAIL — do not release**

The actual unpacked extension performs its core caption-choice job, and the
first screen, accessibility scans, privacy checks, and performance measurements
are good. Release is blocked because all required claim commands fail from a
clean install and the live site's primary extension download returns 404. The
live service worker is also not the candidate build.

## Mandatory first checks

### Claims gate: FAIL

`.factory/claims.json` exists and lists eight claims. As required, every exact
command was run before broader QA. Before dependencies were installed, each
command exited 127 (`vitest: not found`), as expected in a fresh clone. After
`npm ci`, every exact claim command was run again and **all eight exited 1**
before its tagged test could run:

```text
TSConfckParseError: failed to resolve "extends":"./.wxt/tsconfig.json"
Caused by: Error: Cannot find module './.wxt/tsconfig.json'
```

| Claim | Exact command result after `npm ci` |
| --- | --- |
| `one-action` | FAIL, exit 1 |
| `site-memory` | FAIL, exit 1 |
| `offline-action` | FAIL, exit 1 |
| `private-requests` | FAIL, exit 1 |
| `unsupported-notice` | FAIL, exit 1 |
| `keyboard-shortcut` | FAIL, exit 1 |
| `player-controls` | FAIL, exit 1 |
| `download-package` | FAIL, exit 1 |

Cause: `npm test` runs `test:unit` before `build`; WXT creates the referenced
`.wxt/tsconfig.json` only during the later build. `npm run build` makes the same
commands pass afterward, but that is not a clean-clone claims run. The claims
contract explicitly makes any failing claim command release-blocking.

Claim coverage also does not match the public copy. Examples without a matching
claim/test are “rank up to four languages,” “It reads only the current site's
name,” and the privacy statements that the extension does not read page text,
has no analytics/ads/account/remote database, and makes no remote request. The
`private-requests` claim test watches the web demo, not the installed extension;
the `site-memory` test checks demo `localStorage`, not Chrome extension storage.
Independent checks found those privacy/storage behaviors to be true, but they
are not proved by the declared claim tests.

### Cold first-read: PASS

At 1440 × 900 in a fresh browser context, the first screen says:

- What: “Keep caption choices one action away.”
- For whom: viewers who repeat the same language and caption setting.
- First click: “Try it with sample data,” followed by what that action does.

The action is visible without scrolling and opens `/demo` in one click. The
demo immediately shows realistic saved data and the persistent “Demo — sample
data, nothing is saved” banner with Reset and Start for real actions.

## Build and repository gates

The checkout began clean and `HEAD` exactly matched the requested candidate.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 207 packages, 0 vulnerabilities |
| `npm test` immediately after clean install | **FAIL**; missing `.wxt/tsconfig.json` |
| `npx tsc --noEmit` immediately after clean install | **FAIL**; missing WXT types/config |
| `npm run build` | PASS; created `.output/` and `dist/site/` |
| `npm test` after the build workaround | PASS; 3 unit + 14 Playwright tests |
| `npx tsc --noEmit` after build | PASS |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| Lint | No lint script/config is available |

Production output sizes:

- Site JS: 15,983 bytes raw / 5,303 bytes gzip.
- Site CSS: 14,859 bytes raw / 4,067 bytes gzip.
- Mobile hero WebP: 25,156 bytes.
- Unpacked extension: 39.28 KB.
- Extension ZIP: 28,049 bytes.

These are comfortably within the supplied budgets.

## End-to-end behavior

### Live demo

PASS:

- Default Apply shows English captions in one click.
- Spanish/French choices update the sample caption.
- “Keep captions off” hides captions.
- The per-site off switch blocks changes with a clear status.
- Unsupported-player and no-video states explain recovery.
- Corrupt demo JSON recovers to the sample default.
- Reset removes `demo:caption-choice-memory:preference`.
- Start for real removes the demo key and moves to `/#download`.
- Demo storage contained only the documented `demo:` key.
- Keyboard-only Tab, Space, arrow keys, and Enter operate the demo without a
  trap and show a designed focus ring.

FAIL:

- `Alt+Shift+C` works only once per demo page. After applying French, changing
  the first language to Spanish, and pressing the shortcut again, the result
  remained “French captions are on.” The key listener uses `{ once: true }` and
  is not restored after a successful shortcut.

### Built extension

The candidate unpacked MV3 extension was loaded into a fresh persistent
Chromium profile and tested against its real HTML5 video fixture.

- An unconfigured site remained unchanged.
- Spanish-first storage selected the Spanish track automatically.
- The off policy disabled every exposed text track.
- The site switch returned “Off on this site” and made no player change.
- Repeated content-script applies worked (English, then Spanish).
- A page without video returned the documented “No video found” result.
- The real popup read the current host, stored the choice under
  `site:127.0.0.1`, limited the list to four languages, reordered/removed rows,
  and applied the off policy to the fixture.
- Popup axe scan found no violations and no console/page errors occurred.
- HTTP requests during the extension exercise went only to the local fixture;
  the extension made no third-party request.

This establishes that the smallest useful extension works when manually loaded.

## Deployment identity and availability

### Primary download: release blocker

`GET /downloads/caption-choice-memory.zip` returned **HTTP 404**, `text/html`,
and the 599-byte 404 page. The landing page's primary “Download extension
(.zip)” link therefore cannot deliver the product. Locally, the candidate build
contains a valid 28,049-byte ZIP with an MV3 manifest and 11 package files.

### Candidate comparison

The live HTML, hashed JS/CSS, images, icons, fixtures, VTT files, 404 document,
robots file, and sitemap matched the local candidate byte-for-byte. Two runtime
artifacts did not:

- The candidate service worker contains the generated hashed JS/CSS precache
  list; the live service worker still has `const BUILT_ASSETS = [];`.
- The candidate ZIP exists locally; the live path is missing.

`staticwebapp.config.json` is deployment configuration and is not expected to
be served as a public file.

### Service worker/offline

In a fresh live context, the service-worker cache contained HTML routes and
images but no JS or CSS. After the first visit, clearing the ordinary browser
cache, going offline, and reloading produced a blank page with failed JS/CSS
requests. The same procedure against the local candidate build passed because
its cache contained both hashed assets. `registration.update()` itself
completed, but it could only retrieve the stale live worker.

### 404 and caching

- A random missing route returned HTTP 200 with the SPA's designed not-found
  screen, not a real 404 response.
- Hashed JS/CSS and images use `Cache-Control: public, must-revalidate,
  max-age=30`; they do not receive long-lived immutable caching.

## Privacy and response headers

The complete live landing/demo/privacy/terms flow made requests only to
`https://caption-choice-memory.sociobot.in`. There were no analytics, remote
fonts, model calls, payment calls, or other origins. Normal online flows had no
console or page errors.

Observed main-document headers include:

- CSP restricted to self, with objects and framing disabled.
- `Strict-Transport-Security: max-age=10886400; includeSubDomains; preload`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- camera, microphone, geolocation, and payment disabled by Permissions Policy.

This is a static, free product with no server API, unlock endpoint, payment, or
sign-in. Rate-limit/429 allowance, persistence/concurrency boundaries, health
identity, and Sociobot Entra checks are therefore not applicable.

## Accessibility, mobile, and visual review

- Factory `verify-url.sh`: PASS; HTTP 200, title, `lang=en`, one `h1`, one
  `main`, no missing image alt, no unlabeled buttons, no console errors.
- Independent axe scans: no serious or critical findings on `/`, `/demo`,
  `/privacy`, `/terms`, the SPA 404 screen, or the extension popup.
- 390 px: no horizontal overflow; the demo remains understandable and usable.
- Reduced motion: transition duration becomes 0 seconds and no animations run.
- Visible focus: keyboard targets receive a 4 px yellow outline plus black
  offset ring.
- Touch sizing: FAIL. Examples below 44 px include Reset demo (79 × 36), Start
  for real (83 × 21), the 39 × 44 Demo nav link, and 24 px-high footer links.
  Radio controls and the switch have larger associated labels, but these plain
  links/buttons do not.

The neo-brutalist caption-control visual system is distinctive, legible, and
faithful to `.factory/design.md`. The generated hero has recorded provenance and
showed no visible logo/text/artifact issue.

## Performance

Lighthouse 13.0.1 against the live landing page, mobile defaults:

- Performance 99
- Accessibility 100
- Best practices 100
- SEO 100
- LCP 1,151 ms
- CLS 0
- Total blocking time 101 ms
- Transfer size 36,421 bytes

All measured runtime budgets pass. The short cache lifetime for hashed assets
is still a caching-policy defect.

## Defects by severity

### Critical / release-blocking

1. **The live extension download returns 404.** A visitor cannot install the
   product, so the real job-to-be-done cannot be completed.
2. **All eight exact claim commands fail from a clean install.** `npm test` and
   Vitest depend on generated WXT configuration that the test command creates
   too late. The acceptance contract says any failing claim test is blocking.

### High

3. **The live service worker is not the candidate build and offline reload is
   blank.** Its generated JS/CSS precache list is missing.
4. **Public claims are incompletely declared or tested.** Several landing,
   privacy, and README claims have no matching claim entry, and two declared
   product claims are tested only against demo storage/network behavior.

### Medium

5. **The demo keyboard shortcut is one-shot.** A second `Alt+Shift+C` press on
   the same page does nothing.
6. **Several mobile actions miss the 44 px touch-target minimum.** This affects
   the demo banner and footer/navigation links.
7. **Unknown routes return HTTP 200 instead of 404.** The visual fallback is
   present, but the response status is incorrect.

### Low

8. **Hashed assets are cached for only 30 seconds** rather than with a
   long-lived immutable policy.

## Release decision

**FAIL.** Re-run from a truly clean clone after fixing the test bootstrap, make
every exact claim command pass, deploy the complete `dist/site/` output
(including the ZIP and post-package service worker), and repeat this
verification. The extension's local core behavior is promising, but neither
the mandatory claims gate nor the live install path currently meets the
acceptance contract.
