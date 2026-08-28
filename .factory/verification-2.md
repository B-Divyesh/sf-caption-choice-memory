# Independent verification 2 — FAIL

Date: 2026-08-28 UTC  
Verifier work order: `caption-choice-memory-verify-2`  
Candidate commit: `ac7d26da872f45fb902433fb12099ba36c4ec4c3`  
Live URL: `https://caption-choice-memory.sociobot.in`

## Decision

**FAIL — release blocking.** The deployed product's only installable artifact
is unavailable. The visible **Download extension (.zip)** link returns a 404
HTML page, not the packaged MV3 extension. The live service worker is also not
the one built from this candidate. The landing HTML, JavaScript, and CSS do
match the candidate, so this is fresh deployment evidence rather than a local
build failure.

## Required first checks

### Claims

From the clean checkout, the first claim command initially stopped at
`tsc: not found` because dependencies had not yet been installed. After the
standard clean-clone `npm ci`, every exact command in `.factory/claims.json`
passed against its declared demo/extension entry point:

| Claim | Result |
| --- | --- |
| `one-action` | PASS |
| `site-memory` | PASS |
| `offline-action` | PASS |
| `private-requests` | PASS |
| `unsupported-notice` | PASS |
| `keyboard-shortcut` | PASS |
| `player-controls` | PASS |
| `download-package` | PASS locally |
| `language-limit` | PASS |
| `free-no-account` | PASS |

The local `download-package` claim passes because the locally built static
site contains the ZIP. It does not prove the production URL serves that file;
the independent live check below disproves it.

### Cold first read

On a new desktop browser context, the first screen plainly says it keeps
caption choices one action away, says it is for viewers repeating language and
caption settings on video sites, and offers **Try it with sample data**. The
action says it will apply English captions to a sample player. One click opens
`/demo`. This acceptance check passes.

## Local candidate evidence

- `npm ci`: pass; 0 audited vulnerabilities reported.
- `npm test`: pass — TypeScript, 5 Vitest tests, production build, and 16
  Playwright tests passed.
- `npm run lint`: pass (`tsc --noEmit`).
- `npm run build`: pass. Candidate output contains a valid
  `dist/site/downloads/caption-choice-memory.zip` (28,049 bytes), and
  `unzip -t` passes.
- Built static payload: JS 15.67 kB / 5.18 kB gzip; CSS 14.94 kB / 4.07 kB
  gzip. Both are well below the static first-load budgets.
- The real built extension was exercised in Chromium with a clean persistent
  extension profile by the suite: storage, popup apply, content script and
  native text-track behavior passed.

## Live browser QA

Fresh Playwright testing on the live site passed for the deployed demo:

- Normal English apply, Spanish `Alt+Shift+C`, caption-off policy, visible
  per-site off switch, unsupported-player notice, no-video recovery, reset,
  and demo storage isolation (`demo:caption-choice-memory:preference`).
- Desktop and 390 px mobile: no horizontal overflow at 390 px; 44 px controls
  were covered by the product suite; keyboard Tab reached all tested controls
  with a visible `rgb(242, 209, 43) solid 4px` focus ring.
- Reduced-motion context reports a `0s` transition for the tested status
  control. A post-first-visit offline reload of `/demo` succeeded and applied
  the sample English preference.
- Axe serious/critical findings: none on `/`, `/demo`, `/privacy`, `/terms`.
- No live console errors or page errors.
- The whole live landing/demo/privacy/terms exercise made requests only to
  `caption-choice-memory.sociobot.in`; no third-party request was observed.
  This supports the local-first/no-analytics privacy promise for the web demo.
- HTTPS headers include CSP with `frame-ancestors 'none'`,
  `X-Content-Type-Options: nosniff`, strict-origin referrer policy,
  HSTS, and a restrictive permissions policy. Hashed JS has
  `Cache-Control: public, max-age=31536000, immutable`; the service worker is
  `no-cache`.

No product server endpoint or sign-in flow exists, so rate-limit and Entra
tenant checks are not applicable.

## Deployment comparison and defects

### Critical — extension download is broken (release blocker)

`GET /downloads/caption-choice-memory.zip` on the live URL returns:

```text
HTTP/2 404
content-type: text/html
content-length: 599
```

The response starts `<!doctype html>` and cannot be opened by `unzip`; it is
the designed 404 document. The local candidate contains a valid 28,049-byte
ZIP with the `PK` signature and 11 MV3 files. This makes the actual browser
extension unavailable to every visitor despite the live download CTA.

### High — live service worker is stale versus the candidate

The live `service-worker.js` SHA-256 is
`1b921453a9c0165281e908a68805d59f93fc5eb4b4660266d2627ca6a8a5712e`;
the candidate build is
`3cbdeba5b77c60ec133438414457d967d368cda6f8ee10de54d1b0c043f19753`.
The exact difference is:

```diff
-const BUILT_ASSETS = [];
+const BUILT_ASSETS = ["/assets/index-DN8C2zLe.js","/assets/index-BVj570pr.css"];
```

The live root HTML, hashed JS, and CSS did match candidate byte-for-byte, but
the stale service worker means the deployed PWA update/precache artifact is
not the tested candidate.

## Required remediation and re-verification

Deploy the complete `dist/site/` directory from this candidate, preserving
`downloads/caption-choice-memory.zip` and the generated `service-worker.js`.
Then re-run the live ZIP request/signature/`unzip -t` check and byte-compare
the service worker before accepting the release.
