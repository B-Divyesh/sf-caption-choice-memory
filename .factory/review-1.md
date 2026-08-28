# Adversarial first-read review 1 — Caption Choice Memory

Date: 2026-08-28 UTC

Live URL: <https://caption-choice-memory.sociobot.in>

Reviewed commit: `ff4134981d551678dab9245a743c2d23fa373df2`

Viewport checks: 390 × 844 and 1440 × 900, fresh Chromium contexts

## Verdict

**FAIL.** There are no blocking findings: the cold first screen, one-click demo,
declared claim tests, live package, privacy behavior, routing, accessibility
scan, and earlier repairs all passed. The required verdict is still FAIL because
there are 37 remaining findings. Most are copy defects, but eight public claims
have no matching entry in `.factory/claims.json` and the 404 omits required
site metadata and the standard shell.

## Findings, ordered by severity

### High — unlisted or insufficiently listed claims

#### F-1-1 — Demo isolation is claimed but not registered

- Quote/location: demo banner, “Demo — sample data, nothing is saved”; README,
  “The demo writes only to the `demo:caption-choice-memory:preference` browser
  key.”
- Why this matters: these are privacy claims a visitor can rely on. Neither has
  a corresponding claim ID. `private-requests` tests the extension, not demo
  storage isolation.
- Fix: add a `demo-isolation` claim and one tagged browser test that seeds a
  non-demo key, changes the demo, confirms only the `demo:` key changes, leaves
  the sentinel untouched, and records same-origin requests. Keep the banner.

#### F-1-2 — Reset behavior is claimed but not registered

- Quote/location: `/privacy`, “Use Reset demo to remove the sample data key.”
- Why this matters: the current tests check the Reset control's size, not its
  result. The reset worked manually, but the public claim remains unlisted.
- Fix: add a `demo-reset` claim and tagged test that changes the sample, clicks
  **Reset demo**, confirms the demo key is absent, and confirms the English-first
  sample is restored.

#### F-1-3 — Future store readiness is an untested claim

- Quote/location: README, “The same package is ready for the factory's later
  store submission.”
- Why this matters: “ready” is a release assertion that the sandbox does not
  prove, and it exposes internal factory process to users.
- Fix: delete the sentence. Store signing and review are correctly described as
  future release work in the handoff.

#### F-1-4 — Reproducibility is claimed without a reproducibility test

- Quote/location: README, “`npm run build` is the reproducible factory build
  command.”
- Why this matters: the tests prove that one build succeeds, not that two clean
  builds are byte-identical.
- Fix: either say “Run `npm run build` to create the release files” or add a
  `reproducible-build` claim that builds twice from clean directories and
  compares every release hash.

#### F-1-5 — The build-safety guarantee is not in the claim registry

- Quote/location: README, “`npm run build:site` also creates this complete
  deployable tree; it is safe as the work order's final build command and cannot
  leave the ZIP or raw worker out.”
- Why this matters: “cannot” is an absolute release guarantee. `verify:dist`
  helps, but no claim entry names this promise.
- Fix: replace it with “`npm run build:site` creates the deployment tree.
  Release checks fail if the ZIP or generated service worker is missing,” then
  register and tag that observable check if it remains public.

#### F-1-6 — Chrome installation behavior is unlisted

- Quote/location: README, “Chrome does not install unsigned zip files
  directly.”
- Why this matters: it is external behavior presented as a dependable fact but
  has no sandbox test or claim entry.
- Fix: remove the assertion and keep the actionable instruction: “Unzip the
  download before choosing **Load unpacked** in Chrome's extension settings.”

#### F-1-7 — Azure deployment compatibility is unlisted

- Quote/location: README, “Azure Static Web Apps can use the included
  `staticwebapp.config.json`.”
- Why this matters: deployment compatibility is an operational claim without a
  declared test.
- Fix: add a tagged configuration validation/deployment-fixture test, or say
  only “The Azure Static Web Apps configuration is
  `site/public/staticwebapp.config.json`.”

#### F-1-8 — The commercial-use license claim is unlisted

- Quote/location: `/terms`, “Caption Choice Memory is free software for personal
  and commercial use under the MIT License.”
- Why this matters: `free-no-account` checks monetization and absence of auth;
  it does not test the stated license grant.
- Fix: add a `mit-license` claim with a test that confirms the shipped `LICENSE`
  is MIT and included in the source/package, or remove the expanded claim and
  link directly to the license.

### Medium — product understanding, leverage, and structure

#### F-1-9 — The core automatic behavior is hidden

- Quote/location: landing, “Use the button or keyboard shortcut on a supported
  player”; source, `entrypoints/content.ts` automatically applies a configured
  choice at load, after metadata, and when a player is inserted.
- Why this matters: a first-time visitor concludes the extension always needs a
  manual action. The more valuable zero-action behavior is neither explained in
  the landing page nor demonstrated or registered as a claim.
- Fix: state “Saved choices apply when a supported video appears. Use the button
  or shortcut to apply again.” Add an `automatic-apply` claim and fresh-profile
  test, and show this behavior in the demo after a simulated page reload.

#### F-1-10 — Local choices have no import or export path

- Quote/location: landing, “Your browser stores each site's choice locally.”
- Why this matters: a person who builds choices across sites has no way to move
  or back them up when changing profiles or reinstalling this unpacked
  extension. Local-only storage makes portability an obvious companion feature.
- Fix: add an extension settings screen with **Export choices (JSON)** and
  **Import choices**, schema validation, conflict preview, and no network use.
  Add tagged import/export claims. Sync and AI are not warranted here.

#### F-1-11 — “Supported player” is undefined

- Quote/location: landing and README, “supported player” / “Unsupported
  players”.
- Why this matters: the adapter contains native text-track and YouTube-specific
  behavior, but a visitor cannot tell whether the site they use is likely to
  work before installing.
- Fix: add a “Supported players” section naming native HTML5 caption tracks and
  the explicitly implemented YouTube controls. Separate tested support from
  best-effort behavior and attach a claim test to each named adapter.

#### F-1-12 — The real 404 omits required metadata and the site shell

- Quote/location: live unknown route; `site/public/404.html`.
- Evidence: HTTP 404 and a designed page are present, but there is no meta
  description, canonical, Open Graph metadata, apple-touch icon, standard
  header, or standard footer.
- Why this matters: the 404 does not meet the required per-route metadata or
  consistent header/footer contract.
- Fix: give the static 404 the same skip link, header, footer, description,
  canonical, Open Graph/Twitter tags, SVG favicon, and apple-touch icon as the
  other routes while preserving the real 404 response.

#### F-1-13 — The 404 headline is a product pun, not the error name

- Quote/location: 404 h1, “This page has no caption track”.
- Why this matters: the heading makes less sense out of context than “Page not
  found” and violates the no-metaphor heading rule.
- Fix: use `<h1>Page not found</h1>` and keep the explanatory sentence and
  **Return home** action.

### Minor — landing copy

#### F-1-14 — The audience sentence uses a vague setting name

- Quote: “For viewers who repeat the same language and caption setting on every
  video site.”
- Why this matters: “caption setting” does not say on/off, and “every video
  site” can be read as universal compatibility.
- Fix: “For viewers who choose the same caption language and on/off setting
  across video sites.”

#### F-1-15 — “Preferences” breaks the chosen terminology

- Quote: “Preferences stay in this browser.”
- Why this matters: the page otherwise calls the stored object a “caption
  choice”.
- Fix: “Caption choices stay in this browser.”

#### F-1-16 — The hero kicker is a slogan

- Quote: “Your captions / remembered”.
- Why this matters: the slash construction does not name a section or explain
  behavior.
- Fix: delete it, or use “Per-site caption choices”.

#### F-1-17 — The hero image label is invented lore

- Quote: “MEM / 01”.
- Why this matters: it is a decorative code that carries no usable information.
- Fix: remove it, or use “Saved caption choice” if the tab needs a label.

#### F-1-18 — The hero caption is a three-part slogan

- Quote: “One control. Your order. Each site.”
- Why this matters: the fragments require inference and could be reused on an
  unrelated preference tool.
- Fix: “The extension remembers an ordered language list for each site.”

#### F-1-19 — “Set the rule once” is vague and changes terms

- Quote/location: product-preview h2, “Set the rule once”.
- Why this matters: “rule” is not the established “caption choice” term.
- Fix: “Save a caption choice for each site”.

#### F-1-20 — “Three moves” is a decorative mood label

- Quote/location: kicker above “How it works”, “Three moves”.
- Why this matters: it adds style but no information beyond the numbered list.
- Fix: delete it.

#### F-1-21 — “Save your order” is vague

- Quote/location: step heading, “Save your order”.
- Why this matters: the object being ordered is missing.
- Fix: “Rank preferred languages”.

#### F-1-22 — The limits heading uses implementation jargon

- Quote: “It changes exposed player controls”.
- Why this matters: “exposed” is developer language and does not name the
  limitation for a viewer.
- Fix: “It works only with available caption controls”.

#### F-1-23 — The installation heading is a metaphor

- Quote: “Add your caption memory”.
- Why this matters: the heading does not name installation.
- Fix: “Install the Chrome extension”.

#### F-1-24 — “FREE / LOCAL” is cryptic shorthand

- Quote/location: download-section tab, “FREE / LOCAL”.
- Why this matters: “local” does not explain what stays local.
- Fix: “Free · choices stay in Chrome”.

#### F-1-25 — The download instruction uses avoidable package jargon

- Quote: “Download the Chrome package, unzip it, then load the folder as an
  unpacked extension.”
- Why this matters: “package” and “unpacked extension” are unexplained on the
  visitor-facing landing page.
- Fix: “Download the ZIP, unzip it, then choose **Load unpacked** in Chrome's
  extension settings.”

#### F-1-26 — The footer contains an internal production note

- Quote: “Generated art disclosed in the design record.”
- Why this matters: the design record is not linked or available on the live
  site, so the sentence gives a visitor no usable information.
- Fix: remove it from the public footer. Keep provenance in
  `.factory/design.md`.

#### F-1-27 — “Start for real” does not name its result

- Quote/location: demo banner link, “Start for real”.
- Why this matters: it clears demo data and jumps to the download section; it
  does not start the extension.
- Fix: label it “Install the extension”.

### Minor — README copy

#### F-1-28 — The README summary uses “default” as an unexplained noun

- Quote: “Keep each site's caption language and default one action away.”
- Why this matters: it does not say that the default is captions on or off.
- Fix: “Keep each site's caption language and on/off choice one action away.”

#### F-1-29 — The introduction uses two unnecessary technical labels

- Quote: “Caption Choice Memory is a free Chrome MV3 extension for
  caption-dependent viewers.”
- Why this matters: “MV3” and “caption-dependent” slow the first read.
- Fix: “Caption Choice Memory is a free Chrome extension for people who rely on
  captions.”

#### F-1-30 — “Isolated demo” is test jargon

- Quote: “Try the isolated demo with sample data.”
- Why this matters: visitors need the consequence, not the architecture word.
- Fix: “Try the demo with sample data. Demo changes do not affect your saved
  choices.” Register the second sentence under F-1-1.

#### F-1-31 — The demo key sentence is implementation-first

- Quote: “The demo writes only to the
  `demo:caption-choice-memory:preference` browser key.”
- Why this matters: “browser key” is unexplained and the namespace detail
  belongs in `.factory/demo.md`.
- Fix: “Demo changes are stored separately from your caption choices.” Add the
  F-1-1 claim test.

#### F-1-32 — The first “What works” bullet starts with browser jargon

- Quote: “Native HTML5 video tracks use the first preferred language
  available.”
- Why this matters: the user-facing result is buried behind “Native HTML5 video
  tracks”.
- Fix: “On supported videos, the extension selects the first preferred language
  available.”

#### F-1-33 — The storage bullet changes terms and uses implementation jargon

- Quote: “Preferences stay in Chrome extension storage and make no remote
  request.”
- Why this matters: “preferences” conflicts with “caption choices”, and
  “extension storage” / “remote request” are developer terms.
- Fix: “Caption choices stay in this browser and are not sent elsewhere.”

#### F-1-34 — “Factory” is internal language in the build description

- Quote: “`npm run build` is the reproducible factory build command.”
- Why this matters: the intended developer action is obscured by internal
  process language.
- Fix: “Run `npm run build` to create the release files.” This also resolves the
  untested reproducibility wording in F-1-4.

#### F-1-35 — The build guarantee exceeds the sentence cap

- Quote: “`npm run build:site` also creates this complete deployable tree; it is
  safe as the work order's final build command and cannot leave the ZIP or raw
  worker out.”
- Evidence: 28 words; hard cap is 22.
- Fix: “`npm run build:site` creates the deployment tree. Release checks fail if
  the ZIP or generated service worker is missing.”

#### F-1-36 — The privacy paragraph uses storage jargon

- Quote: “The extension stores site names and caption choices in local extension
  storage.”
- Why this matters: “local extension storage” is precise for a developer but not
  plain for a user.
- Fix: “Chrome stores site names and caption choices on this device.”

#### F-1-37 — The README heading does not distinguish user and developer content

- Quote/location: README moves directly from “Install the packaged extension”
  to “Develop”, then “Test and build”.
- Why this matters: the first-time user instructions and contributor reference
  read as one undifferentiated document.
- Fix: add the descriptive heading “Developer guide” before Requirements, then
  nest “Develop”, “Test and build”, and “Project map” beneath it.

## Cold first screen

Result: **PASS at 390 px and desktop.** No scrolling was performed before this
assessment.

- What it does, in my words: remembers a caption language/on-off choice for each
  video site and makes it available in one action.
- For whom: viewers who repeatedly choose the same caption language and state.
- First click: **Try it with sample data**.
- Adjacent promised result: “Then apply English captions to a sample player.”

The exact first-screen text that supplied those answers was “Keep caption
choices one action away”, “For viewers who repeat the same language and caption
setting on every video site”, and “Try it with sample data”. At 390 × 844, the
headline, audience sentence, action, result sentence, and all three fact lines
were visible before scrolling. No console error occurred in either context.

## Copy audit

Counts treat a hyphenated term, code token, or shortcut as one word. Repeated
navigation labels are listed once. “Flag” points to the finding containing the
required rewrite.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For viewers who repeat the same language and caption setting on every video site. | 14 | F-1-14 |
| Then apply English captions to a sample player. | 8 | Pass |
| Preferences stay in this browser. | 5 | F-1-15 |
| Caption choices work offline. | 4 | Pass — `offline-action` |
| Free. | 1 | Pass — `free-no-account` |
| No account. | 2 | Pass — `free-no-account` |
| One control. | 2 | F-1-18 |
| Your order. | 2 | F-1-18 |
| Each site. | 2 | F-1-18 |
| Choose a caption default and save up to four languages for each site. | 13 | Pass — `language-limit` / `site-memory` |
| It saves a caption choice for the current site. | 9 | Pass — `site-memory` |
| Pick captions on or off, then rank your languages. | 9 | Pass |
| Use the button or keyboard shortcut on a supported player. | 10 | F-1-9 / F-1-11 |
| Unsupported players get a clear notice. | 6 | Pass — `unsupported-notice` |
| The extension uses exposed caption tracks and player buttons. | 9 | F-1-22 |
| Your browser stores each site's choice locally. | 7 | Pass — `site-memory` |
| Download the Chrome package, unzip it, then load the folder as an unpacked extension. | 14 | F-1-25 |
| Keep each site's caption choice one action away. | 8 | Pass — `one-action` / `site-memory` |
| Generated art disclosed in the design record. | 7 | F-1-26 |

No landing sentence exceeds 22 words. The existing `.factory/copy-audit.md`
reports the audience sentence as 13 words; it contains 14.

### Landing headings, labels, and actions

| Text | Words | Result |
| --- | ---: | --- |
| Caption Choice Memory | 3 | Pass: product name |
| Demo | 1 | Pass: destination link |
| How it works | 3 | Pass: section/destination |
| Privacy | 1 | Pass: destination link |
| Your captions / remembered | 3 | F-1-16 |
| Keep caption choices one action away | 6 | Pass: job-first h1 |
| Try it with sample data | 5 | Pass: result-naming action |
| MEM / 01 | 2 | F-1-17 |
| The extension | 2 | Pass: section label |
| Set the rule once | 4 | F-1-19 |
| Open the working demo | 4 | Pass: action |
| When a video starts | 4 | Pass: control legend |
| Turn captions on | 3 | Pass: result-naming control |
| Keep captions off | 3 | Pass: result-naming control |
| Preferred languages | 2 | Pass: field label |
| Apply caption choice | 3 | Pass: result-naming control |
| Three moves | 2 | F-1-20 |
| How it works | 3 | Pass: section heading |
| Open the extension | 3 | Pass: action heading |
| Save your order | 3 | F-1-21 |
| Apply the choice | 3 | Pass: action heading |
| Clear limits | 2 | Pass: section label |
| It changes exposed player controls | 5 | F-1-22 |
| FREE / LOCAL | 2 | F-1-24 |
| Version 1.0 | 2 | Pass: release label |
| Add your caption memory | 4 | F-1-23 |
| Download extension (.zip) | 3 | Pass: result-naming action |
| Terms | 1 | Pass: destination link |
| Built by Param Factory | 4 | Pass: credited external link |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Keep each site's caption language and default one action away. | 10 | F-1-28 |
| Caption Choice Memory is a free Chrome MV3 extension for caption-dependent viewers. | 12 | F-1-29 |
| It remembers whether captions should start on or off. | 9 | Pass — `site-memory` |
| It also keeps an ordered list of up to four preferred languages for each site. | 15 | Pass — `language-limit` |
| Try the isolated demo with sample data. | 7 | F-1-30 |
| The demo writes only to the `demo:caption-choice-memory:preference` browser key. | 9 | F-1-1 / F-1-31 |
| Native HTML5 video tracks use the first preferred language available. | 10 | F-1-32; behavior covered by `player-controls` test |
| `Alt+Shift+C` applies the saved choice to the current video. | 9 | Pass — `keyboard-shortcut` |
| Unsupported players show a notice with the next step. | 9 | Pass — `unsupported-notice` |
| Preferences stay in Chrome extension storage and make no remote request. | 11 | F-1-33; behavior covered by `site-memory` / `private-requests` |
| Caption choices can be applied without network access. | 8 | Pass — `offline-action` |
| Download `caption-choice-memory.zip` from the product site. | 6 | Pass — `download-package` |
| Unzip it to a permanent folder. | 6 | Pass: instruction |
| Open `chrome://extensions`. | 2 | Pass: instruction |
| Turn on Developer mode. | 4 | Pass: instruction |
| Choose Load unpacked, then select the unzipped folder. | 8 | Pass: instruction |
| Chrome does not install unsigned zip files directly. | 8 | F-1-6 |
| The same package is ready for the factory's later store submission. | 11 | F-1-3 |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass: developer prerequisite |
| Load `.output/chrome-mv3` as an unpacked extension while `npm run dev` runs. | 11 | Pass: developer instruction |
| `npm test` runs unit tests, creates both builds, starts the static preview, and runs the Playwright claim and accessibility checks. | 20 | Pass: developer command description |
| `npm run build` is the reproducible factory build command. | 9 | F-1-4 / F-1-34 |
| It creates: | 2 | Pass: introduces the following list |
| Deploy `dist/site/` as the static root. | 6 | Pass: developer instruction |
| Its `index.html` sits at that root. | 6 | Pass: developer instruction |
| Azure Static Web Apps can use the included `staticwebapp.config.json`. | 9 | F-1-7 |
| `npm run build:site` also creates this complete deployable tree; it is safe as the work order's final build command and cannot leave the ZIP or raw worker out. | 28 | F-1-5 / F-1-35 |
| The extension stores site names and caption choices in local extension storage. | 12 | F-1-36; behavior covered by `site-memory` |
| It has no account, analytics, ads, or remote database. | 9 | Pass — `private-requests` / `free-no-account` |
| Read the full privacy page and terms. | 7 | Pass: instruction |
| MIT. | 1 | Pass as a license label; expanded live claim is F-1-8 |
| See LICENSE. | 2 | Pass: instruction |

### README headings

| Heading | Words | Result |
| --- | ---: | --- |
| Caption Choice Memory | 3 | Pass: product name |
| What works | 2 | Pass |
| Install the packaged extension | 4 | Pass |
| Develop | 1 | F-1-37 in the current information hierarchy |
| Test and build | 3 | F-1-37 in the current information hierarchy |
| Project map | 2 | F-1-37 in the current information hierarchy |
| Privacy and limits | 3 | Pass |
| License | 1 | Pass |

## Demo and sandbox

Result: **PASS, except for the missing claim registration in F-1-1 and F-1-2.**

One click on **Try it with sample data** changed the URL to `/demo`. At 390 px,
the first demo screen already showed the persistent banner, the job heading, a
realistic sample episode/player, and the caption “The tide turns before the
rain.” The saved controls begin at the bottom edge of the first viewport.

Manual fresh-context evidence:

- Initial sample: `watchroom.example`, captions on, English then Spanish,
  supported player.
- Applying French showed “French captions are on” and “La marée tourne avant la
  pluie.”
- The only created key was
  `demo:caption-choice-memory:preference`.
- A seeded non-demo key remained byte-for-byte unchanged.
- **Reset demo** removed the demo key and restored English first.
- The whole landing-to-demo flow requested only
  `https://caption-choice-memory.sociobot.in` resources.
- The declared offline claim and live offline suite passed.

## Declared claims

Every exact command in `.factory/claims.json` was run after `npm ci` in a fresh
local clone. All passed.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `one-action` | `npm test -- --grep @claim:one-action` | PASS |
| `site-memory` | `npm test -- --grep @claim:site-memory` | PASS |
| `offline-action` | `npm test -- --grep @claim:offline-action` | PASS |
| `private-requests` | `npm test -- --grep @claim:private-requests` | PASS |
| `unsupported-notice` | `npm test -- --grep @claim:unsupported-notice` | PASS |
| `keyboard-shortcut` | `npm test -- --grep @claim:keyboard-shortcut` | PASS |
| `player-controls` | `npm run test:unit -- --testNamePattern @claim:player-controls` | PASS |
| `download-package` | `npm test -- --grep @claim:download-package` | PASS |
| `language-limit` | `npm run test:unit -- --testNamePattern @claim:language-limit` | PASS |
| `free-no-account` | `npm run test:unit -- --testNamePattern @claim:free-no-account` | PASS |

Additional release checks passed:

- `npm run build`
- `npm run test:live`: live 28,049-byte ZIP and 1,602-byte service worker match
  the local candidate by SHA-256.
- `npm run test:browser:live`: 13/13 tests.

The unlisted claims are F-1-1 through F-1-8. Therefore this review has untested
claims even though every listed test passes.

## History verification

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
The complete current `.factory/handoff.md` was read. Its historical defects were
rechecked rather than accepted from the recorded status:

| Earlier defect | Live/code confirmation | Result |
| --- | --- | --- |
| Download ZIP returned 404 | Live link returns 200 `application/zip`, 28,049 bytes; SHA-256 matches the fresh build. | Fixed |
| Live service worker was stale with an empty asset list | Live worker is 1,602 bytes, contains generated assets, and matches the fresh build hash. | Fixed |
| Mobile controls were below 44 × 44 px | The live mobile touch-target regression passed for all directly operated demo controls. The header Demo link measured 44 × 44 px. | Fixed |

No earlier finding is being reissued under its old ID.

## Structure, accessibility, and identity

Result: **PASS except F-1-12 and F-1-13.**

- `/`, `/demo`, `/privacy`, and `/terms` returned 200, set route-appropriate
  titles, had `lang="en"`, one h1, one main, canonical URLs, description, OG
  image, SVG favicon, apple-touch icon, consistent header, and consistent
  footer.
- Privacy navigation moved focus to the new h1; Back returned to `/` and focused
  its h1.
- Every discovered internal, download, and external link returned 200.
- An unknown route returned a genuine HTTP 404 and a designed screen.
- Axe found zero serious or critical violations on all four main routes. The
  live browser suite reported no console errors, no 390 px overflow, compliant
  touch targets, and reduced-motion behavior.
- `/opt/fleet/lib/verify-url.sh` passed the live root with one h1, one main,
  `lang="en"`, complete image alt text, labelled buttons, and no console error.
- The built first-load JavaScript is 15,670 bytes raw / 5,180 bytes gzip, with
  no third-party font or script request.
- The title pattern is valid: “Caption Choice Memory — save caption choices” on
  home and “Route — Caption Choice Memory” on other routes.
- The blue/yellow/cream broadcast-control and index-card visual system is
  recognizably product-specific. The generated hero art, hard rules, physical
  shadows, and irregular section rhythm avoid the generic centered-gradient
  SaaS template failure.

## Missed leverage

F-1-9, F-1-10, and F-1-11 cover the useful missing leverage: explain and test
automatic application, provide local import/export, and disclose tested player
compatibility. An AI feature would be decorative for deterministic caption
control, and runtime sync would conflict with the present local-first promise;
neither is recommended.

## What would make this perfect

Resolve F-1-1 through F-1-37, rerun every exact claim command from a clean
clone, then repeat the live mobile/desktop/demo/request-log/route crawl. A
perfect next round has zero copy flags, zero unlisted claims, a complete 404
shell, a test-backed explanation of automatic behavior and supported players,
and an import/export path for locally stored choices. Nothing else is required
by this review.
