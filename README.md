# Caption Choice Memory

Keep each site's caption language and on/off choice one action away.

Caption Choice Memory is a free Chrome extension for people who rely on
captions. It keeps an ordered list of up to four preferred languages for each
site.

[Try the demo with sample data](https://caption-choice-memory.sociobot.in/?demo=1).
Demo changes are stored separately from your caption choices.

## What works

- Saved choices apply when a supported video appears.
- On supported videos, the extension selects the first preferred language available.
- It supports native HTML5 caption tracks and YouTube caption controls.
- `Alt+Shift+C` applies the saved choice to the current video.
- Unsupported players show a notice with the next step.
- Caption choices stay in this browser and are not sent elsewhere.
- Caption choices can be applied without network access.
- Settings export choices as JSON and import valid backups with a replacement preview.

## Install the Chrome extension

1. Download `caption-choice-memory.zip` from the product site.
2. Unzip it to a permanent folder.
3. Open `chrome://extensions`.
4. Turn on **Developer mode**.
5. Choose **Load unpacked**, then select the unzipped folder.

## Developer guide

### Requirements

Node.js 20 or newer and npm.

### Develop

```sh
npm install
npm run dev       # WXT extension development build
npm run dev:site  # static site at http://127.0.0.1:4173
```

Load `.output/chrome-mv3` as an unpacked extension while `npm run dev` runs.

### Test and build

```sh
npm test
npm run build
npm run test:live # after deployment; compares the live ZIP and service worker
npm run test:browser:live # after deployment; reruns browser QA against production
```

Run `npm run build` to create the release files:

- `.output/chrome-mv3/` — unpacked extension
- `.output/caption-choice-memory-1.0.0-chrome.zip` — WXT archive
- `dist/site/` — deployable static site
- `dist/site/downloads/caption-choice-memory.zip` — public extension download

Deploy `dist/site/` as the static root. The Azure Static Web Apps configuration
is `site/public/staticwebapp.config.json`.

### Project map

- `entrypoints/` — WXT background, content, popup, and settings entry points
- `shared/` — caption preference types and player adapters
- `site/` — static product site and demo
- `tests/` — Vitest unit tests and Playwright claim tests
- `.factory/` — brief, design thesis, claims, demo notes, and handoff

## Privacy and limits

Chrome stores site names and caption choices on this device. It has no account,
analytics, ads, or remote database. Read the full
[privacy page](https://caption-choice-memory.sociobot.in/privacy) and
[terms](https://caption-choice-memory.sociobot.in/terms).

## License

Available under the MIT License. See [LICENSE](./LICENSE).
