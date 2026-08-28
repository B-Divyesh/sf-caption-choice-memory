# Demo sandbox

## Entry point

- Production: `https://caption-choice-memory.sociobot.in/?demo=1`
- Local after `npm run build`: `http://127.0.0.1:4173/?demo=1`

The first screen already contains a saved English-first rule and a sample video
frame. Press **Apply caption choice** to prove the one-action path.

## Sample data

- Site: `watchroom.example`
- Policy: turn captions on
- Ordered languages: English, then Spanish
- Sample caption: “The tide turns before the rain.”
- Player states: supported, captions not exposed, and no video

The player state selector exposes success, unsupported, and empty outcomes. The
keyboard path is `Alt+Shift+C`.

## Isolation and reset

Demo changes use only the localStorage key
`demo:caption-choice-memory:preference`. The demo never reads or writes the
extension's `chrome.storage.local` data or any real browser key.

Use **Reset demo** in the persistent banner to remove the demo key and restore
the English-first sample. **Install the extension** also removes the demo key
before opening the download section. `/demo` remains a direct demo route.

The claim tests start with a fresh browser context. No account, network service,
or live website is required.
