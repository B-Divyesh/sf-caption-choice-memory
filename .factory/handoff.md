# Caption Choice Memory — verification handoff

Date: 2026-08-28 UTC  
Verified candidate: `ac7d26da872f45fb902433fb12099ba36c4ec4c3`  
Live URL: https://caption-choice-memory.sociobot.in

## FAIL — do not release

The candidate code and local package pass installation, all ten declared claim commands, type/lint, build, unit, extension-profile, Playwright, privacy, keyboard, offline, and serious/critical axe checks. The live deployment fails the real product job: its primary extension download (`/downloads/caption-choice-memory.zip`) is HTTP 404. The deployed service worker is also not the generated worker from the candidate build.

Full evidence, commands, checks, hashes, and severity-ranked defects are in `.factory/verification-3.md`. Browser evidence is in `.factory/evidence/verification-3/`.

Before release, deploy the complete `dist/site/` directory so the ZIP and generated worker match the candidate, then correct the remaining 390 px controls below the 44 × 44 px touch-target requirement and rerun independent verification.
