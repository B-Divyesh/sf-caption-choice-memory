# Caption Choice Memory — polish round 1 handoff

Date: 2026-08-28 UTC  
Work order: `caption-choice-memory-polish-1`  
Repair commit: `d167480cdca449a16af610881be3270d1aed2d35`  
Live URL: <https://caption-choice-memory.sociobot.in>

## Outcome

All 37 findings in `.factory/review-1.md` are closed. The repair preserves the
neo-brutalist broadcast-control identity and the MV3 extension plus static-site
artifact class. The detailed finding map is in `.factory/polish-1.md`.

Highlights:

- The first screen now uses plain, consistent caption-choice wording.
- `?demo=1` opens an isolated demo with a persistent reset/install banner;
  reset removes only demo data and restores the English-first sample.
- The extension now offers local JSON export/import with schema validation and
  a replacement preview.
- The landing page names automatic application and supported native HTML5 and
  YouTube controls, with tests for each.
- The complete static 404 has route metadata, icons, skip link, standard
  header/footer, and the plain `Page not found` heading.
- `.factory/claims.json` now declares 17 observable claims, each with exactly
  one tagged test. The catalog description is verb-first and 72 characters.

## Verification

Fresh clone: `/tmp/caption-choice-memory-polish-1-clean`.

```sh
npm ci
# Every exact command declared in .factory/claims.json
npm test
npm run build:site
npm run test:live
npm run test:browser:live
/opt/fleet/lib/verify-url.sh https://caption-choice-memory.sociobot.in .factory/evidence/polish-1-live
```

- Fresh `npm ci` installed 207 packages with 0 reported vulnerabilities.
- Every exact claim command passed: 12 browser claims and 5 unit claims.
- `npm test` passed: 8 Vitest tests and 24 Chromium tests, including offline,
  privacy request recording, popup/settings Axe scans, route Axe scans, 44 px
  mobile targets, 404 metadata, and keyboard/history focus checks.
- `npm run build:site` passed. The site bundle is 16.62 KB raw / 5.36 KB gzip;
  CSS is 15.15 KB raw / 4.11 KB gzip; the MV3 ZIP is 31,706 bytes.
- Deployment used the work-order static output, `dist/site`, through Azure
  Static Web Apps `sf-caption-choice-memory`.
- Live `npm run test:live` passed. ZIP SHA-256:
  `62ca858b8e9a981eba87dbc90957d700e7c732a7a940ecd1e3399929a9476287`.
  Service worker SHA-256:
  `4be674649423a921a9b0492c1ae88586f86f0ad53fae0707b58a85a1ac87a738`.
  Both match the local deployment tree.
- Live browser suite passed after the same-origin assertion was made
  environment-neutral. The initial CLI Axe run could not launch ChromeDriver
  against the Playwright browser; the installed Playwright Axe scans passed
  locally and on all live routes instead.
- `verify-url.sh` passed live on retry: HTTPS 200, title, `lang=en`, one h1,
  main landmark, image alt text, labelled buttons, and no console errors.
  Evidence: `.factory/evidence/polish-1-live/verify.json` and screenshots.

## Run and deploy

```sh
npm ci
npm test
npm run build:site
swa deploy dist/site --env production
```

Deploy root: `dist/site/`.

## Known limits

Some players do not expose usable caption controls. The extension leaves those
players unchanged and explains the next step. There are no known unresolved
review findings.
