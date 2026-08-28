# Caption Choice Memory

Keep each site's caption language and default one action away.

Caption Choice Memory is a free Chrome MV3 extension for caption-dependent
viewers. It remembers whether captions should start on or off. It also keeps an
ordered list of up to four preferred languages for each site.

[Try the isolated demo](https://caption-choice-memory.sociobot.in/demo) with
sample data. The demo writes only to the
`demo:caption-choice-memory:preference` browser key.

## What works

- Native HTML5 video tracks use the first preferred language available.
- `Alt+Shift+C` applies the saved choice to the current video.
- Unsupported players show a notice with the next step.
- Preferences stay in Chrome extension storage and make no remote request.
- Caption choices can be applied without network access.

## Install the packaged extension

1. Download `caption-choice-memory.zip` from the product site.
2. Unzip it to a permanent folder.
3. Open `chrome://extensions`.
4. Turn on **Developer mode**.
5. Choose **Load unpacked**, then select the unzipped folder.

Chrome does not install unsigned zip files directly. The same package is ready
for the factory's later store submission.

## Develop

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev       # WXT extension development build
npm run dev:site  # static site at http://127.0.0.1:4173
```

Load `.output/chrome-mv3` as an unpacked extension while `npm run dev` runs.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit tests, creates both builds, starts the static preview, and
runs the Playwright claim and accessibility checks.

`npm run build` is the reproducible factory build command. It creates:

- `.output/chrome-mv3/` — unpacked extension
- `.output/caption-choice-memory-1.0.0-chrome.zip` — WXT archive
- `dist/site/` — deployable static site
- `dist/site/downloads/caption-choice-memory.zip` — public extension download

Deploy `dist/site/` as the static root. Its `index.html` sits at that root.
Azure Static Web Apps can use the included `staticwebapp.config.json`.

## Project map

- `entrypoints/` — WXT background, content, and popup entry points
- `shared/` — caption preference types and player adapters
- `site/` — static product site and isolated demo
- `tests/` — Vitest unit tests and Playwright claim tests
- `.factory/` — brief, design thesis, claims, demo notes, and handoff

## Privacy and limits

The extension stores site names and caption choices in local extension storage.
It has no account, analytics, ads, or remote database. Read the full
[privacy page](https://caption-choice-memory.sociobot.in/privacy) and
[terms](https://caption-choice-memory.sociobot.in/terms).

## License

MIT. See [LICENSE](./LICENSE).
