# Caption Choice Memory — review 3 handoff

Date: 2026-09-06 UTC

Work order: `caption-choice-memory-review-3`

Live URL: <https://caption-choice-memory.sociobot.in>

## Outcome

**FAIL — 2 findings, 1 untested claim.** No product code was changed. The full
independent report is `.factory/review-3.md`.

The reviewed implementation is
`d167480cdca449a16af610881be3270d1aed2d35`. The documentation SHA before this
review is `5aa219e459c7b60499ed94d8da5966a8a0a74350`. The live ZIP and service worker
match the candidate.

## Findings to repair

1. The clean installed extension reports no assigned shortcut for
   `apply-caption-choice`, and `Alt+Shift+C` does not apply the saved choice.
   The current claim test passes only against the web demo.
2. A malformed JSON import shows raw JavaScript parser text instead of a plain
   error with a next step.

## Verification completed

- Installed dependencies with `npm ci` in a clean checkout.
- Ran all 17 exact commands in `.factory/claims.json`.
- Ran `npm run lint`, `npm test`, `npm run build`, and
  `npm audit --audit-level=high`.
- Ran `npm run test:live` and `npm run test:browser:live`.
- Opened the live product in fresh desktop and phone contexts.
- Checked the one-click sample, populated output, persistent sample label,
  reset, separate storage, normal, boundary, invalid, recovery, keyboard,
  focus, reduced-motion, offline, update, privacy, links, titles, legal routes,
  and designed HTTP 404 paths.
- Loaded the built extension in clean temporary Chromium profiles and exercised
  the popup, native tracks, storage, language limit, per-site off switch,
  settings import, and unsupported browser-page notice.
- Ran live Axe checks, the factory URL verifier, and mobile Lighthouse.

The unfiltered local suite passed 8 Vitest and 24 Playwright tests. The live
suite passed 20 tests. Lighthouse scored 100 in performance, accessibility,
best practices, and SEO, with 1.0 s LCP and 0 CLS.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:live
npm run test:browser:live
```

The installed shortcut failure requires a fresh unpacked-extension profile and
must not be replaced by the `/demo` key listener in its claim test.

## Evidence

The required evidence report and result are at `/work/.evidence/qa-report.md`
and `/work/.evidence/qa-result.json`. Supporting logs, JSON records, Lighthouse
output, and screenshots use the `/work/.evidence/review-3-*` prefix.

## Next steps

Assign or implement the promised installed shortcut and test its full runtime
path. Replace malformed-JSON parser text with a plain recovery instruction and
test invalid imports. Then run every claim command and the installed-artifact
checks again before requesting review 4.
