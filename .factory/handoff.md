# Independent verification handoff — FAIL

Date: 2026-08-28

Work order: `caption-choice-memory-verify-1`

Candidate: `483ae3042d599cea73001fd6f4c7248d4d298690`

Live URL: `https://caption-choice-memory.sociobot.in`

**Release decision: FAIL — do not release.**

Fresh verification found two critical blockers:

1. Every exact `.factory/claims.json` command fails after a clean `npm ci`
   because Vitest reads missing `.wxt/tsconfig.json` before the build generates
   it. `npm test` and `npx tsc --noEmit` fail in that clean state. After running
   `npm run build`, the workaround state passes 3 unit and 14 browser tests.
2. The live “Download extension (.zip)” URL returns HTTP 404, so a visitor
   cannot install the product.

Additional findings:

- The live service worker is not the candidate output: its `BUILT_ASSETS` list
  is empty. A first-visit offline reload is blank after clearing the HTTP cache,
  while the local candidate build passes the same check.
- Public claim coverage is incomplete; see the report for examples.
- The demo's `Alt+Shift+C` handler works once per page, then stops.
- Several mobile demo/footer actions are below 44 px.
- Unknown routes render the designed screen with HTTP 200 instead of 404.
- Hashed assets use a 30-second cache rather than immutable caching.

Positive evidence:

- The cold first screen clearly states the job, audience, and first action, and
  provides a one-click sample-data demo.
- The unpacked candidate extension correctly handles English/Spanish ordering,
  captions off, the per-site off switch, repeated applies, storage, and no-video
  feedback in Chromium.
- Normal live traffic is same-origin only; no console/page errors were found.
- Axe found no serious/critical issues on product routes or the popup; keyboard
  operation and reduced motion pass.
- Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO;
  LCP 1.15 s, CLS 0, TBT 101 ms.
- The exact production build succeeds and bundle sizes are well under budget.

Full commands, hashes, route results, and defect evidence are in
`.factory/verification.md`.

Required next steps: make the WXT generated types available before unit/claim
tests; add/fix claim coverage; deploy the complete post-package `dist/site/`;
fix the repeated demo shortcut, touch targets, 404 status, and cache rules; then
repeat independent verification from a clean clone.

---

# Historical builder handoff: Caption Choice Memory v1

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
