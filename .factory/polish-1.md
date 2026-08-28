# Polish round 1 — finding closure

Candidate repaired: `d167480cdca449a16af610881be3270d1aed2d35`.
Local evidence: clean clone at `/tmp/caption-choice-memory-polish-1-clean`,
`npm ci`, every command in `.factory/claims.json`, and `npm test` all passed.
Visual evidence: `.factory/evidence/polish-1-desktop.png` and
`.factory/evidence/polish-1-mobile-demo.png`. Live URL checks are recorded in
the handoff after deployment identity matches.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Isolated `?demo=1` storage and no cross-origin request assertion. | `@claim:demo-isolation` |
| F-1-2 | Reset removes the demo key and restores English first. | `@claim:demo-reset` |
| F-1-3 | Removed store-readiness wording. | README audit |
| F-1-4 | Replaced reproducibility assertion with a plain build instruction. | README audit |
| F-1-5 | Removed the absolute deployment-tree guarantee. | README audit |
| F-1-6 | Removed the unsigned-ZIP assertion. | README audit |
| F-1-7 | Names only the configuration file location. | README audit |
| F-1-8 | Added MIT-license claim and shipped standard license heading. | `@claim:mit-license` |
| F-1-9 | Explains automatic application and demonstrates it after demo reload. | `@claim:automatic-apply` |
| F-1-10 | Added local JSON export/import, validation, and replacement preview. | `@claim:choice-export`, `@claim:choice-import` |
| F-1-11 | Names native HTML5 tracks and YouTube controls as supported. | `@claim:native-caption-tracks`, `@claim:youtube-caption-controls` |
| F-1-12 | Added metadata, icons, header, footer, skip link, and nav to static 404. | `static 404 includes the product shell and route metadata` |
| F-1-13 | Changed the 404 heading to “Page not found”. | 404 metadata test |
| F-1-14 | Rewrote the audience sentence with language and on/off setting. | desktop screenshot |
| F-1-15 | Replaced “Preferences” with “Caption choices”. | copy audit |
| F-1-16 | Removed the hero slogan kicker. | desktop screenshot |
| F-1-17 | Replaced “MEM / 01” with “Saved caption choice”. | desktop screenshot |
| F-1-18 | Replaced the three-part slogan with an explanatory caption. | desktop screenshot |
| F-1-19 | Renamed the preview heading to a caption-choice action. | copy audit |
| F-1-20 | Removed “Three moves”. | copy audit |
| F-1-21 | Renamed the language-ranking step. | copy audit |
| F-1-22 | Replaced “exposed” wording with available controls. | copy audit |
| F-1-23 | Renamed installation heading plainly. | copy audit |
| F-1-24 | Expanded the free/local tab. | copy audit |
| F-1-25 | Rewrote installation instructions in Chrome terms. | copy audit |
| F-1-26 | Removed the unlinked art-production footer note. | desktop screenshot |
| F-1-27 | Renamed the demo exit to “Install the extension”. | mobile demo screenshot |
| F-1-28 | Rewrote summary to state the on/off choice. | README audit |
| F-1-29 | Removed MV3 and caption-dependent from the introduction. | README audit |
| F-1-30 | Rewrote demo copy in user terms. | README audit |
| F-1-31 | Moved key detail to demo docs and described separate storage plainly. | `@claim:demo-isolation` |
| F-1-32 | Put the user result before native-track terminology. | README audit |
| F-1-33 | Used consistent caption-choice and plain privacy wording. | `@claim:private-requests` |
| F-1-34 | Rewrote the build command instruction. | README audit |
| F-1-35 | Removed the 28-word build guarantee. | README audit |
| F-1-36 | Rewrote local-storage wording in user terms. | README audit |
| F-1-37 | Added a Developer guide heading and nested sections. | README outline |

Additional regression coverage: full site and extension Axe scans, 44 px mobile
controls, offline reload, keyboard navigation, route titles/focus, real 404
metadata, and extension package/service-worker checks all run in `npm test`.
