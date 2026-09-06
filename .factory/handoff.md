# Caption Choice Memory — repair 3 handoff

Date: 2026-09-06 UTC

Live URL: <https://caption-choice-memory.sociobot.in>

## Outcome

**PASS.** The two Review 3 findings and its untested claim are repaired.

The deployed implementation is
`eb18ee5c7f151fd4f34b6edec19f3de592cb8843`. The later test-harness
documentation SHA is `a52b16ea58cf5f82cb408673b34c59f5bb088b92`; it changes
only the live-browser command's test selection and has no runtime-file change.

## What changed

1. Replaced the clean-profile-unassigned `Alt+Shift+C` suggestion with Chrome's
   supported default `Ctrl+Shift+Y` (`Command+Shift+Y` on macOS). The popup,
   demo, README, demo instructions, claim registry, and manifest use the same
   shortcut.
2. Rewrote `@claim:keyboard-shortcut` as a real installed-artifact test. It
   loads the built MV3 extension in a clean Chromium profile, confirms Chrome
   assigned `Ctrl+Shift+Y`, presses it on the native video fixture, and proves
   that the background worker sends the command to the content script by
   observing the saved Spanish track become active.
3. Caught JSON syntax errors before they reach the settings UI. Malformed and
   wrong-schema files now say: “This file is not a valid Caption Choice Memory
   backup. Choose a JSON file exported by this extension.” Duplicate-site files
   explain how to recover. Import stays disabled and storage stays unchanged
   until a valid backup is selected.
4. Expanded the existing import claim regression to cover malformed JSON,
   wrong schema, duplicate sites, unchanged storage, conflict preview, valid
   import, and recovery after each error.
5. Corrected `test:browser:live` so it does not try to open the local extension
   fixture while the runner is intentionally pointed at HTTPS. The installed
   shortcut remains covered by its declared clean-profile command; the live
   suite continues to check the deployed site and package download.

## Earlier findings

All reports in `.factory/` were read before this repair. The current checks
confirm these dispositions:

| Earlier finding group | Current proof | Disposition |
| --- | --- | --- |
| Verification 1–3 clean-install claims and live ZIP/service-worker failures | Clean `npm ci` then all 17 exact claim commands pass; live ZIP and worker match the build byte-for-byte. | Fixed |
| Verification 1–3 mobile targets, real 404, immutable assets, offline/update | Full 24-test browser suite and 19 applicable live tests pass. The live missing route returns HTTP 404. | Fixed |
| Review 1 F-1-1 through F-1-8, F-1-14 through F-1-37 | Demo isolation/reset, mapped claims, license, route metadata, copy audit, and standard page shell remain present and pass. | Fixed |
| Review 1 F-1-9 through F-1-11 | Automatic apply, local import/export, native tracks, and YouTube controls remain tested. | Fixed |
| Review 1 F-1-12 and F-1-13 | The designed 404 retains metadata, standard shell, and the “Page not found” heading. | Fixed |
| Review 3 F-3-1 and untested `keyboard-shortcut` claim | Clean installed MV3 profile reports `Ctrl+Shift+Y`; pressing it activates the saved track. | Fixed |
| Review 3 F-3-2 | Invalid import cases show a plain recovery instruction, do not write storage, and a valid backup succeeds afterward. | Fixed |

## Verification

From a separate clean clone at implementation SHA:

```sh
npm ci
# every exact command in .factory/claims.json (17/17 passed)
npm test
npm run lint
npm run build
npm audit --audit-level=high
unzip -t dist/site/downloads/caption-choice-memory.zip
```

Results: 8 Vitest tests and 24 Playwright tests passed. The release ZIP passed
integrity checks. The built site JavaScript is 16.62 KB raw / 5.37 KB gzip and
CSS is 15.15 KB raw / 4.11 KB gzip.

After deployment:

```sh
npm run test:live
npm run test:browser:live
/opt/fleet/lib/verify-url.sh https://caption-choice-memory.sociobot.in \
  /work/.evidence/caption-choice-memory-repair-3-verify-url
```

The live ZIP is 31,788 bytes, SHA-256
`6e36605097121c540842eb6408b0706b5c2ea7fc77f47fda36414cc9f7e54985`.
The live worker is 1,602 bytes, SHA-256
`935ff94734409bf45129679661c611972edf47324158417e5719a37c65da1363`.
Both match the deployed implementation. The 19 applicable live browser tests
passed. The URL verifier found one title, `lang="en"`, one h1, one main,
complete image alt text, labelled buttons, and no console errors.

Fresh desktop (1440 × 1000) and phone (390 × 844) contexts both showed the job
(keep a per-site caption choice one action away), audience (people repeating a
language and on/off setting), and first action (**Try it with sample data**)
before scrolling. The sample opened in one click, showed English captions,
kept “Demo — sample data, nothing is saved” visible after scrolling, reset to
English, and never changed a seeded real-data key. Requests stayed same-origin.

Live routes `/`, `/demo`, `/privacy`, and `/terms` returned 200. A deliberate
unknown path returned the designed HTTP 404. Live Axe coverage is included in
the browser suite: zero serious or critical violations on the landing, demo,
legal pages, and static 404. Lighthouse 13.4.1 measured 100 performance, 100
accessibility, 100 best practices, and 100 SEO; FCP 0.8 s, LCP 1.1 s, TBT 40
ms, CLS 0.

## Deployment and privacy

`dist/site/` was deployed to the existing product-owned static app
`sf-caption-choice-memory`. It remains a single static site with no backend,
database, product API, payment, sign-in, analytics, or third-party runtime
requests. SQLite, tenant isolation, health endpoints, and rate-limit checks do
not apply.

The product is free. No billing offer metadata is needed.

## Evidence

- `/work/.evidence/caption-choice-memory-repair-3-verify-url/verify.json`
- `/work/.evidence/caption-choice-memory-repair-3-desktop.png`
- `/work/.evidence/caption-choice-memory-repair-3-phone.png`
- `/work/.evidence/caption-choice-memory-repair-3-lighthouse.json`

## Known gaps

None found for the defined product scope. Chrome allows a person to remap or
clear extension shortcuts; a clean installed profile receives the tested
default `Ctrl+Shift+Y`.
