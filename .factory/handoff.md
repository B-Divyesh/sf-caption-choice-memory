# Caption Choice Memory v1 handoff

Date: 2026-08-28

Work order: `caption-choice-memory-build-1`

Deploy root: `dist/site/`

## What shipped

- A WXT and TypeScript Chrome MV3 extension.
- Per-site caption on or off policy.
- Ordered list of up to four preferred languages.
- Native HTML5 text-track adapter.
- YouTube caption button adapter with an English-labelled language-menu path.
- `Alt+Shift+C` command for the saved choice.
- A visible per-site off switch.
- Clear no-video, unsupported-player, and changed-player messages.
- A 360 px keyboard-accessible extension popup.
- A responsive product site with `/demo`, `/privacy`, `/terms`, and a designed
  404 response.
- An isolated demo with supported, unsupported, and no-video sample states.
- A service worker that precaches the site shell and built assets.
- A generated and reviewed hero illustration, responsive WebP files, social
  card, favicon, and extension icons.
- A downloadable extension archive at
  `dist/site/downloads/caption-choice-memory.zip`.

The extension does not change new sites until the user saves a choice. Saved
sites apply their choice when a supported player appears.

## How to run

```sh
npm install
npm run dev
npm run dev:site
```

Load `.output/chrome-mv3` from `chrome://extensions` during extension
development.

## How to verify

```sh
npm test
npm run build
npx tsc --noEmit
npm audit
```

Final results:

- Vitest: 3 passed.
- Playwright: 14 passed.
- Claim tests: all 8 claim IDs passed.
- Axe: no serious or critical findings on `/`, `/demo`, `/privacy`, or
  `/terms`.
- Built-extension check: the packaged content script selected an English HTML5
  text track in Chromium.
- Factory URL verifier: passed with no console errors, one `h1`, one `main`,
  `lang="en"`, and no missing image alt text.
- `npm audit`: 0 vulnerabilities.
- Static output: JavaScript 5.27 KB gzip; CSS 4.06 KB gzip.
- Extension unpacked output: 39.28 KB.
- Extension ZIP: 28.05 KB.
- Mobile hero image: 25 KB WebP.

Lighthouse 13.0.1 mobile result on the production build:

- Performance: 100
- Accessibility: 100
- Best practices: 100
- SEO: 100
- LCP: 1.4 s
- CLS: 0
- Total blocking time: 0 ms

The factory verifier output and screenshots are in `.factory/evidence/`.

## Product and privacy notes

- Preferences use `chrome.storage.local` under one key per hostname.
- Demo data uses only `demo:caption-choice-memory:preference`.
- There are no runtime analytics, third-party scripts, remote fonts, accounts,
  payment calls, or model calls.
- Player interaction is limited to browser `TextTrack` APIs and exposed player
  buttons.
- The CSP allows only same-origin runtime resources.

## Known gaps

- YouTube language selection depends on its current DOM and English menu labels.
  Caption on or off still works when that language menu cannot be identified.
- Players that hide caption tracks inside closed components cannot be changed.
  The extension reports this instead of guessing.
- The ZIP is an unsigned unpacked-development package. Store signing and listing
  are factory deployment tasks.
- Browser-defined command conflicts may require changing the shortcut from the
  browser's extension-shortcuts page.

## Next steps

- Submit and sign the Chrome package through the factory release process.
- Add isolated adapters only when a player exposes stable, permitted controls.
- Run the pilot against real caption-heavy sites and record actions-to-caption.
