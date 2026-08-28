# Caption Choice Memory — visual thesis

## Direction

**Neo-brutalist caption utility.** The interface borrows from broadcast control
labels, punched index cards, and subtitle safe-area guides. Thick rules make
state changes unmissable. A yellow “memory tab” marks saved choices. Controls
look physical without imitating a media player or hiding what they do.

This direction fits a small accessibility tool: it is direct, legible, and
recognisable at extension-popup size. Decoration explains the product's job.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F5F0E6` | page background |
| `white` | `#FFFCF5` | raised surfaces |
| `ink` | `#17170E` | text, outlines, shadows |
| `blue` | `#2646D3` | primary actions and active focus |
| `blue-dark` | `#193197` | hover and pressed states |
| `yellow` | `#F2D12B` | saved choice and memory tab |
| `green` | `#24704A` | supported and applied states |
| `red` | `#A52824` | errors and destructive actions |
| `muted` | `#625F55` | secondary text |

Ink on paper is 16.2:1. White on blue-dark is 10.1:1. Ink on yellow is
12.1:1. Statuses always pair color with text or shape.

The product is deliberately single-mode. The warm paper canvas and printed
control-board metaphor depend on a light ground; explicit colors prevent a
browser theme from changing it.

## Type

- Display: `Arial Black`, `Arial Narrow Bold`, `Arial`, sans-serif. Tight,
  uppercase, broadcast-label rhythm. No external font request.
- Body: `Arial`, `Helvetica`, sans-serif. Clear at 16 px and compact in a
  360 px extension popup.
- Code and shortcut labels: `ui-monospace`, `SFMono-Regular`, `Consolas`,
  monospace with tabular figures.

Type scale: 14, 16, 20, 28, 44, 68 px. Line length stays under 70 characters.

## Spacing and shape

Spacing follows an 8 px base: 4, 8, 12, 16, 24, 32, 48, 72, 96. Controls are
at least 44 px tall. Corners use 0–4 px radii. Key panels have a 3 px ink rule
and a 6 px solid shadow. Offset tabs and clipped corners recall index cards.

## Interaction grammar

- A control depresses by 2 px and loses 2 px of its offset shadow.
- The selected caption policy receives a yellow side tab and explicit label.
- Supported players use a green square; unsupported players use a striped
  notice with a clear next step.
- Focus uses a 3 px yellow ring plus a 2 px ink offset, never color alone.
- The popup leads with the current site and one “Apply caption choice” action.

## Motion policy

The signature motion is a saved preference card sliding into its yellow memory
tab over 180 ms. Status changes use a short 140 ms opacity transition. Nothing
loops or autoplays. Under `prefers-reduced-motion: reduce`, transforms and
smooth scrolling are removed and state changes are instant.

## Responsive behavior

At 390 px, the landing grid becomes one column, proof lines wrap, and the live
preview remains full width. Secondary diagrams stack below the primary action.
The extension popup is designed at 360 px and remains usable down to 320 px.

## Asset plan and provenance

- Hero still life: an original generated paper-and-plastic caption control
  board. It visualises remembered language tabs without showing a fake app UI.
- Product marks, caption brackets, status squares, and diagrams are hand-made
  SVG/CSS primitives.
- Social preview is composed from the original hero still life and live HTML
  typography at build time.

### Prompt sheet

- Subject: tactile caption control board with stacked language index tabs,
  a single large square key, and subtitle-safe-area brackets.
- World: editorial tabletop object, accessibility utility, no real platform.
- Materials: recycled cream paper, cobalt molded plastic, black ink, yellow
  card tabs, visible halftone grain.
- Light/lens: hard top-left studio light, orthographic three-quarter view,
  crisp shadow, 50 mm product lens.
- Palette words: warm paper, registration black, broadcast cobalt, signal
  yellow, restrained green.
- Negative list: no people, no logos, no brands, no readable text, no screens,
  no gradients, no glassmorphism, no watermark, no UI screenshot.

Generation record: created 2026-08-28 with the factory image deployment via
`/opt/fleet/lib/gen-image.sh`. Prompt sidecars are stored in `assets/src/`.
Generated imagery is original to this product.

