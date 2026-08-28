# Adversarial first-read review 2 — Caption Choice Memory

Date: 2026-08-28 UTC
Live URL: https://caption-choice-memory.sociobot.in
Scope: fresh Chromium at 390 × 844 and 1440 × 1000, live deployment, clean local dependency install.

## Verdict

**PASS.** Zero findings remain. The product is understandable before scrolling, tryable in one click, honest about its limits, and all registered claims passed. No F-2-k finding is issued.

## Cold first screen

No scrolling occurred before this assessment.

- What it does: a Chrome extension that remembers an ordered caption-language and on/off choice for each video site.
- For whom: people who repeat the same caption setup across video sites.
- First click: Try it with sample data.
- Immediate result: a sample player where English captions can be applied.

The exact first-screen copy was “Keep caption choices one action away”, “For viewers who choose the same caption language and on/off setting across video sites.”, “Try it with sample data”, and “Then apply English captions to a sample player.” All of this and the three fact lines were visible at 390 px. Neither fresh context produced a console error.

## Copy audit

Counts treat a shortcut, code token, hyphenated term, and apostrophe-s term as one word. No sentence exceeds 22 words. Every action names its result; no jargon, vague slogan, inconsistent term, or information-free heading remains.

### Landing sentences

| Location | Sentence | Words |
| --- | --- | ---: |
| Hero | For viewers who choose the same caption language and on/off setting across video sites. | 14 |
| Hero action | Then apply English captions to a sample player. | 8 |
| Fact | Caption choices stay in this browser. | 6 |
| Fact | Caption choices work offline. | 4 |
| Fact | Free. | 1 |
| Fact | No account. | 2 |
| Image alt | A paper caption control board with one blue key and stacked choice cards. | 13 |
| Hero caption | The extension remembers an ordered language list for each site. | 10 |
| Preview | Choose whether captions start on or off, then save up to four languages for each site. | 16 |
| Step 1 | It saves a caption choice for the current site. | 8 |
| Step 2 | Pick captions on or off, then rank your languages. | 9 |
| Step 3 | Saved choices apply when a supported video appears. | 8 |
| Step 3 | Apply again with the button or shortcut. | 7 |
| Limits | Supported players: native HTML5 caption tracks and YouTube caption controls. | 10 |
| Limits | Unsupported players get a clear notice. | 6 |
| Limits | It uses captions that the player makes available. | 8 |
| Limits | Caption choices stay in this browser. | 6 |
| Install | Download the ZIP, unzip it, then choose Load unpacked in Chrome's extension settings. | 13 |
| Footer | Keep each site's caption choice one action away. | 7 |

### Landing headings, labels, and actions

| Text | Words | Check |
| --- | ---: | --- |
| Caption Choice Memory | 3 | Product name |
| Demo | 1 | Destination |
| How it works | 3 | Section name/destination |
| Privacy | 1 | Destination |
| Keep caption choices one action away | 6 | Plain job-first h1 |
| Try it with sample data | 5 | Result-naming action |
| Saved caption choice | 3 | Descriptive image label |
| The extension | 2 | Preview context |
| Save a caption choice for each site | 7 | Specific heading |
| Open the working demo | 4 | Result-naming action |
| When a video starts | 4 | Control label |
| Preferred languages | 2 | Control label |
| Open the extension | 3 | Specific step |
| Rank preferred languages | 3 | Specific step |
| Apply the choice | 3 | Specific step |
| Clear limits | 2 | Limits context |
| It works only with available caption controls | 7 | Specific heading |
| Free · choices stay in Chrome | 5 | Plain fact |
| Version 1.0 | 2 | Version label |
| Install the Chrome extension | 4 | Specific heading |
| Download extension (.zip) | 3 | Result-naming action |
| Terms | 1 | Destination |
| Built by Param Factory | 4 | Credited external link |

### README sentences

| Location | Sentence | Words |
| --- | --- | ---: |
| Summary | Keep each site's caption language and on/off choice one action away. | 10 |
| Introduction | Caption Choice Memory is a free Chrome extension for people who rely on captions. | 13 |
| Introduction | It keeps an ordered list of up to four preferred languages for each site. | 13 |
| Demo | Try the demo with sample data. | 6 |
| Demo | Demo changes are stored separately from your caption choices. | 9 |
| What works | Saved choices apply when a supported video appears. | 8 |
| What works | On supported videos, the extension selects the first preferred language available. | 10 |
| What works | It supports native HTML5 caption tracks and YouTube caption controls. | 9 |
| What works | Alt+Shift+C applies the saved choice to the current video. | 8 |
| What works | Unsupported players show a notice with the next step. | 9 |
| What works | Caption choices stay in this browser and are not sent elsewhere. | 10 |
| What works | Caption choices can be applied without network access. | 8 |
| What works | Settings export choices as JSON and import valid backups with a replacement preview. | 12 |
| Install | Download caption-choice-memory.zip from the product site. | 5 |
| Install | Unzip it to a permanent folder. | 6 |
| Install | Open chrome://extensions. | 2 |
| Install | Turn on Developer mode. | 4 |
| Install | Choose Load unpacked, then select the unzipped folder. | 8 |
| Requirements | Node.js 20 or newer and npm. | 6 |
| Develop | Load .output/chrome-mv3 as an unpacked extension while npm run dev runs. | 11 |
| Test/build | Run npm run build to create the release files: | 8 |
| Deploy | Deploy dist/site/ as the static root. | 6 |
| Deploy | The Azure Static Web Apps configuration is site/public/staticwebapp.config.json. | 9 |
| Privacy | Chrome stores site names and caption choices on this device. | 10 |
| Privacy | It has no account, analytics, ads, or remote database. | 9 |
| Privacy | Read the full privacy page and terms. | 7 |
| License | Available under the MIT License. | 5 |
| License | See LICENSE. | 2 |

README headings are also clear and short: What works (2), Install the Chrome extension (4), Developer guide (2), Requirements (1), Develop (1), Test and build (3), Project map (2), Privacy and limits (3), and License (1). Developer material is properly nested below Developer guide.

## Demo and sandbox

**PASS.** The hero action entered ?demo=1 in one click. At 390 px, the first demo screen already showed a believable sample episode, rendered caption, per-site controls, and “English captions are on.” Its persistent banner said “Demo — sample data, nothing is saved” and provided Reset demo and Install the extension.

In a fresh context, applying French created only demo:caption-choice-memory:preference and showed “French captions are on.” Reset removed that key and restored English first. The observed landing-to-demo request log contained only the product origin. The isolation test seeded a real key and confirmed it remained unchanged. The offline action claim passed after first visit.

## Claims

.factory/claims.json has 17 claims and one tagged test per claim. After npm ci, each exact command listed there passed. npm test passed too: 8 Vitest tests and 24 Playwright tests.

| Claim IDs passed |
| --- |
| one-action, site-memory, offline-action, private-requests, demo-isolation, demo-reset |
| automatic-apply, unsupported-notice, keyboard-shortcut, native-caption-tracks, youtube-caption-controls |
| choice-export, choice-import, download-package, language-limit, free-no-account, mit-license |

All landing and README claim-like statements map to these registered IDs. No unlisted claim was found. npm run test:live confirmed the live ZIP and service worker match the local build by SHA-256. npm run test:browser:live passed 20/20 tests.

## Earlier finding recheck

All earlier review, polish, and handoff documents were read. Each earlier finding was verified live and in current source/tests.

| Earlier ID | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | Demo storage is namespaced and isolation test passes. | Fixed |
| F-1-2 | Reset clears sample storage and restores English. | Fixed |
| F-1-3 | Store-readiness assertion is absent. | Fixed |
| F-1-4 | README gives an instruction, not reproducibility promise. | Fixed |
| F-1-5 | Absolute build-safety guarantee is absent. | Fixed |
| F-1-6 | Unsigned-ZIP assertion is absent. | Fixed |
| F-1-7 | README only names the configuration path. | Fixed |
| F-1-8 | MIT claim has tagged test coverage. | Fixed |
| F-1-9 | Landing explains automatic apply; extension test passes. | Fixed |
| F-1-10 | Tested JSON export/import and replacement preview exist. | Fixed |
| F-1-11 | Landing names native tracks and YouTube controls; tests pass. | Fixed |
| F-1-12 | Unknown route is HTTP 404 with shell and metadata. | Fixed |
| F-1-13 | 404 h1 is “Page not found”. | Fixed |
| F-1-14 | Hero names language and on/off setting. | Fixed |
| F-1-15 | Current copy consistently says caption choices. | Fixed |
| F-1-16 | Hero slogan kicker is absent. | Fixed |
| F-1-17 | Image label is “Saved caption choice”. | Fixed |
| F-1-18 | Caption explains ordered language list. | Fixed |
| F-1-19 | Preview heading names saving a caption choice. | Fixed |
| F-1-20 | “Three moves” is absent. | Fixed |
| F-1-21 | Step says “Rank preferred languages”. | Fixed |
| F-1-22 | Limits say “available caption controls”. | Fixed |
| F-1-23 | Installation heading names Chrome extension. | Fixed |
| F-1-24 | Tab says “Free · choices stay in Chrome”. | Fixed |
| F-1-25 | Install copy gives ZIP and Load unpacked action. | Fixed |
| F-1-26 | Unlinked art-production footer note is absent. | Fixed |
| F-1-27 | Demo exit says “Install the extension”. | Fixed |
| F-1-28 | README says on/off choice. | Fixed |
| F-1-29 | README removes MV3 and caption-dependent. | Fixed |
| F-1-30 | README says “Try the demo with sample data”. | Fixed |
| F-1-31 | README describes separate demo storage. | Fixed |
| F-1-32 | README leads with user result. | Fixed |
| F-1-33 | README uses plain storage/privacy wording. | Fixed |
| F-1-34 | README has a plain build instruction. | Fixed |
| F-1-35 | Former 28-word guarantee is absent. | Fixed |
| F-1-36 | README says “on this device”. | Fixed |
| F-1-37 | Developer guide is present as parent heading. | Fixed |

## Structure, access, and identity

**PASS.** /, /demo, /privacy, and /terms returned 200 with their own plain route title, one h1, description, canonical URL, Open Graph/Twitter metadata, favicon, apple-touch icon, skip link, header, footer, and main landmark. A random unknown URL returned a designed real HTTP 404 with Return home. Back navigation focused the new h1. Every discovered internal, download, hash, and credited external link returned 200.

The local and live Axe suites found no serious or critical issue. Mobile checks confirmed directly operated demo controls are at least 44 px. The live request log had no third-party font, analytics, payment, model, or tracking origin. The paper/cobalt/yellow broadcast-control identity, original tactile art, heavy rules, offset shadows, and tabs are product-specific rather than a generic SaaS template.

The brief does not imply an AI feature: caption control is deterministic, so AI would be decorative. Export/import exists; cloud sync would conflict with the explicit local-first promise.

## What would make this perfect

No additional user-facing change is needed for this review. Preserve the claim registry, isolated-demo test, and live deployment-identity check on future releases.
