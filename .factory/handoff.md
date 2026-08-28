# Caption Choice Memory — repair handoff

Date: 2026-08-28 (UTC)

Work order: `caption-choice-memory-repair-1`

Base verified: `a58ef481a4fd8f3559a1e7c674222ec42b048724`

## Repair completed

- Made TypeScript and Vitest runnable immediately after `npm ci`: the root
  configuration no longer depends on WXT's build-generated `.wxt/tsconfig.json`.
  Minimal macro declarations live in `types/wxt-globals.d.ts` for the clean
  test/typecheck path.
- Added a strict typecheck/lint command and made `npm test` run it before unit,
  package, and browser tests.
- Replaced demo-only claim coverage for site storage and privacy with Chromium
  extension-profile tests. They use the actual popup, Chrome extension storage,
  content script, and request log.
- Added coverage for the four-language limit and the free/no-account product
  configuration. Every public claim in `.factory/claims.json` now has one exact
  tagged regression command.
- Fixed the demo `Alt+Shift+C` listener so it remains usable after every apply
  and is cleaned up when leaving the demo route.
- Raised all tested demo/navigation/footer touch targets to at least 44 CSS px.
- Changed Static Web Apps routing so only real SPA routes rewrite to the app;
  unknown routes use the designed 404 response. Added immutable cache headers
  for `/assets/*` and `no-cache` for the updating service worker.
- The package regression test now verifies the generated service worker has the
  built JS and CSS precache list, alongside the valid downloadable MV3 ZIP.

## Verification evidence

Clean-install checks, before any WXT build:

```sh
npm ci
npx tsc --noEmit                 # pass
npm run lint                     # pass
npm audit --audit-level=high     # 0 vulnerabilities
```

All ten exact commands from `.factory/claims.json` passed. This includes the
actual extension popup/storage/request checks, repeated keyboard shortcut,
offline reload after service-worker control, and downloadable ZIP/service-worker
checks.

```sh
npm test
# 5 Vitest tests passed; 16 Playwright tests passed
npm run build
# dist/site/ contains the 28,049-byte downloadable MV3 ZIP
```

Browser and accessibility checks passed on desktop and 390 px mobile. Playwright
Axe found no serious or critical findings on `/`, `/demo`, `/privacy`, or
`/terms`; keyboard navigation, focus movement, reduced motion, offline reload,
and touch targets are regression-covered. `/opt/fleet/lib/verify-url.sh` against
the production build reported title/lang/one h1/main/alt/button labels and zero
console errors. Built site assets are 5,205 bytes gzipped JS and 4,065 bytes
gzipped CSS; the extension ZIP validates with `unzip -t`.

## Deploy

Deploy root: `dist/site/`.

Deployed `dist/site/` to `https://caption-choice-memory.sociobot.in` after
commit `ee8854d` (deployment `fb99730f-cb73-4f2b-8782-74ad35f8f2cb`). Live
checks passed:

- `/downloads/caption-choice-memory.zip`: HTTP 200, `application/zip`, `PK`
  signature, 28,049 bytes, SHA-256
  `cee4ed60156eba9dfed986d419602626159c554f5dc55069ca79a690103e16be`
  matching local output.
- `/service-worker.js`: HTTP 200, `Cache-Control: no-cache`, non-empty built
  JS/CSS precache list, SHA-256
  `3cbdeba5b77c60ec133438414457d967d368cda6f8ee10de54d1b0c043f19753`
  matching local output.
- A random route returns HTTP 404 and renders the designed fallback. Hashed
  `/assets/*` responses use `public, max-age=31536000, immutable`.
- Live 390 px Chromium checks passed: offline service-worker reload, repeated
  `Alt+Shift+C`, no horizontal overflow, no console errors, and no serious or
  critical Axe findings.

## Known limits

- YouTube language selection remains dependent on its exposed, English-labelled
  caption menu. On other player structures the extension leaves the current
  caption language and reports the limitation.
- The ZIP is an unsigned unpacked-development package; store signing/listing is
  a factory release task.
