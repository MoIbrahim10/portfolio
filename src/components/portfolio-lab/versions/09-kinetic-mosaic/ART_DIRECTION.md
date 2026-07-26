# 09 — Kinetic Mosaic

## Thesis

A quiet portfolio built around one horizontal image mosaic: six projects form a single composed strip, then re-tile with measured choreography when one is selected.

**Memory hook:** The portfolio is a calm contact sheet that briefly becomes a moving edit table, arranging the chosen project into focus without changing the page around it.

The mosaic is the only spectacle. Background, typography, logo, navigation, biography, and details stay restrained so the work remains the loudest element.

## skills.sh

- Search performed first on https://www.skills.sh/ for portfolio, mosaic, collage, and frontend visual-design skills.
- Relevant result: **frontend-design**
- Exact URL: https://www.skills.sh/anthropics/skills/frontend-design
- Status: **not installed**. A local frontend-design skill is already available, and this task is an art-direction document rather than implementation; installing another copy would add no useful capability.
- Principle retained from the search: choose one memorable visual thesis, keep structure meaningful, and match interaction complexity to that thesis.

## Reference observations

These are principle-level observations only. Do not reproduce any source’s layout, styling, copy, assets, code, or signature interaction.

- **Recent** — https://recent.design/  
  A dense visual field remains usable because taxonomy, filters, and chrome are quiet and consistent. Transfer the separation between neutral navigation and expressive work; do not recreate its masonry feed, category pills, sidebar, cursor, or submissions.
- **Favourite** — https://favourite.design/  
  A simple monochrome index lets varied projects coexist, while shuffle/reset suggests recombination as a meaningful browsing action. Transfer the idea of rearrangement as editorial discovery; do not copy its project list, Japanese typography, shuffle control, menu language, or transitions.
- **Gabriel Beaugonin** — https://www.gabrielbeaugonin.com/  
  The direct site yielded limited indexable content during research, so do not infer or imitate its visual identity. The safe transferable principle from Gabriel’s publicly credited work is progressive disclosure: immersive material becomes understandable through clear navigable layers rather than one long effect sequence.
- **Gianluca Patti** — https://glcpatti.com/  
  Featured, Playground, and Ad & Animation separate professional work from experiments while image sequences carry most of the personality. Transfer image-led grouping and concise wayfinding; do not copy the character art, category names, studio narrative, illustration language, or playful transitions.
- **Sebastiano Pierotti** — https://www.sebaprt.com/  
  A short identity statement, light/dark utility, and a long project record balance authored interaction with explicit labels, clients, and years. Transfer the confidence to pair expressive viewing with plain metadata; do not copy its opening statement, chronology, award list, theme control, scroll cue, or immersive transitions.

### Explicit anti-copy boundary

- Never borrow reference screenshots, portraits, artwork, icons, copy, typefaces, proportions, page order, transition timings, cursor behavior, or code.
- Do not recreate Recent’s masonry board, Favourite’s shuffled text index, Patti’s illustration world, Pierotti’s chronology, or any inaccessible behavior guessed from Beaugonin’s site.
- No custom cursor, WebGL, Three.js, GSAP, canvas, shader, autoplay media, parallax, marquee, loader, background swap, grain, glow, glass, gradient, or decorative 3D.
- Use only the shared portfolio data and unchanged supplied assets. Never crop media into a new composition that conceals its product context.

## Exact visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Canvas | `#F8F8F4` | Fixed page background |
| Paper | `#FFFFFF` | Drawer and media backing |
| Glyph navy | `#15223B` | Primary text, focus, logo context |
| Graphite | `#30343A` | Titles and active labels |
| Quiet ink | `#747980` | Bio and secondary copy |
| Hairline | `#D9DCD7` | Rules and tile boundaries |
| Soft fill | `#ECEEE9` | Loading and unavailable media |
| Solar gold | `#D5A438` | One active locator and V2 accent |
| Signal red | `#B83D37` | Destructive/close emphasis only |
| Scrim | `#15223B5C` | Drawer backdrop |

Project accent colors may appear only as a 3 px selection tick beside a title. The canvas never changes and project imagery is never tinted.

### Dependency-free typography

- Display and project titles: `"Helvetica Neue", "Nimbus Sans L", Helvetica, Arial, sans-serif`
- Body and navigation: `"Avenir Next", Avenir, "Segoe UI", Calibri, sans-serif`
- Counts and micro-labels: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace`
- H1: `clamp(2.2rem, 4.5vw, 4.8rem)` at `0.98`; body: 16–18 px at `1.55`; tile labels: 13–15 px; utilities: 11–12 px.
- Sentence case only. No oversized manifesto, outlined type, moving type, or text over project images.

### Geometry

- Page max width 1560 px; desktop gutters 32–56 px; mobile gutters 16–20 px; 8 px spacing base.
- Header and hero share a 12-column grid; hero copy spans 5–6 columns and stays below 48ch.
- Mosaic occupies one fixed `min(68vh, 720px)` stage on desktop and never changes outer height during recomposition.
- Resting mosaic uses a 12 × 8 internal grid with 8 px gutters: six image tiles have deliberately unequal footprints but equivalent visual prominence across the full set.
- Tile corners are 2 px, with no resting shadow. Every image retains its declared aspect ratio using an inner fitted frame; no stretch or layout shift.

## Complete page architecture

### 1. Masthead

- Left: existing linked **Glyph Spark with Solar Pulse**, unchanged. Never redraw, recolor, crop, mask, or animate its internal parts.
- Right: plain links `X` and `GitHub`, followed by the existing V2 **CutCornerButton** labeled `Schedule`.
- Exact links: X https://x.com/m0code · GitHub https://github.com/MoIbrahim10 · Schedule https://cal.com/mo-c0de/30min.
- Keep the masthead in normal document flow; no hamburger on desktop and no sticky overlay above media.

### 2. Hero

- Eyebrow: `Mo Ibrahim · Design engineer`
- H1: `Products, arranged with care.`
- Show this biography exactly and only once:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- Use one V2 CutCornerButton, `Schedule a call`, pointing to the exact Schedule URL.
- `Selected work` should enter the first desktop viewport. Do not pad the hero into a full-screen introduction.

### 3. Kinetic mosaic

- Render exactly in shared-data order: **The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, Stepper**.
- At rest, all six unchanged hero images are visible together. Each semantic `article` contains one image button and a caption below it; accessible name: `Open [project title] project details`.
- Hover/focus lifts the tile 4 px, exposes its 3 px accent tick, and slightly dims only the other tile containers to 88% opacity. Images themselves remain unfiltered.
- Selecting a tile does not navigate immediately. The chosen tile expands to the left two-thirds of the stage; the other five pack into a single-column contact strip on the right.
- If the selected project has gallery media, its supplied images replace the five contact-strip cells in original order, repeating no image. Remaining empty cells become plain labeled project selectors, not decorative placeholders.
- Beneath the stage, show only current title, exact shared description, `01 / 06`, and a plain `Details` text button. Clicking the expanded media or Details opens the drawer.
- A persistent `All projects` control restores the six-project mosaic. Passive recomposition never changes the URL or steals focus.

### 4. Project details drawer

- Desktop: right drawer, 560–660 px; mobile: bottom sheet, maximum 92dvh, with a quiet fixed scrim.
- Order: project title, exact shared description, hero, supplied gallery, collaborators only when present, then available links.
- Use the existing V2 CutCornerButton for the primary live-project link. Repository is an underlined text link. Omit empty collaborators, gallery, and actions rather than inventing content.
- Dialog is labeled and modal; background becomes inert, focus enters the close button, Escape closes, and focus returns to the originating tile.
- Gallery is a vertical sequence with intrinsic ratios. No nested carousel, lightbox, pagination theater, or duplicate hero.

### 5. Social, contact, and footer

- Contact line: `Available for thoughtful product collaborations.`
- Show plain X and GitHub links and one V2 `Schedule` button using the exact URLs above.
- Footer: unchanged small Glyph Spark, `Mo Ibrahim · Cairo, Egypt`, current year, and plain `Back to top`.
- No social icons, availability badge, repeated bio, oversized outro, newsletter, or invented location/time data.

## Mechanics and motion

Use the existing Motion React library only; add no dependency.

1. Arrival is readable immediately: mosaic fades from 0.96 opacity and rises 6 px over 240 ms.
2. Hover/focus uses 160 ms transform/opacity transitions; press scales to `0.995` for 70 ms.
3. Selection uses keyed CSS-grid placement plus Motion layout: chosen tile reaches its destination in 420 ms with spring `stiffness 390`, `damping 38`, `mass 0.8`.
4. Neighbor tiles travel directly to their cells with a 24 ms cascade ordered by geometric distance from the selected tile, never DOM order.
5. Gallery cells crossfade only after layout settles: 140 ms out, 180 ms in. There is no blur, spin, overshoot, or image morph.
6. Drawer scrim fades in 140 ms; drawer translates 24 px over 260 ms. Closing reverses once and restores focus after exit completes.
7. Rapid selection interrupts and resolves to the newest target. Animate transform and opacity only; never animate the stage height or intrinsic media dimensions.

### Keyboard and reduced motion

- In the mosaic: Arrow keys move to the nearest tile spatially; Home/End focus first/last; Enter or Space selects; Escape returns to all projects or closes the drawer.
- Tab order follows shared project data order regardless of visual tile placement. Recomposition never reorders the DOM.
- With `prefers-reduced-motion`, remove arrival travel, tile movement, scale, cascade, and drawer translation. Switch grid states instantly with an optional 80 ms opacity fade.

## Mobile, accessibility, states, and performance

- Below 760 px, replace the mosaic with one native horizontal snap rail of 82–88vw image cards. Selection opens the details bottom sheet directly; do not run a tiny re-tiled grid.
- Preserve touch scrolling, vertical page gestures, and pinch zoom. Never convert wheel movement, trap horizontal swipes, or require drag.
- Use semantic `header`, `main`, labeled `section`, six `article` elements, modal `dialog`, and `footer`; one H1 and sequential headings.
- Every control is at least 44 × 44 px. Focus uses a 3 px `#15223B` outline with 3 px `#F8F8F4` offset. Selection is conveyed by position, tick, label, and `aria-current`, not color alone.
- Use shared useful alt text. Loading reserves every final grid cell with `#ECEEE9` and no shimmer. Empty state: `Projects are being prepared.` Error state keeps title and button with `Preview unavailable.`
- Eager-load only The Good Invoice hero. Lazy-load remaining hero/gallery media, preserve intrinsic dimensions, decode asynchronously, and preload only the chosen project’s first detail image.
- Use one layout measurement per state transition, not per animation frame. No continuous scroll state, background work, enormous compositor layers, content duplication, or cumulative layout shift.
- Success means all six projects remain identifiable at rest, recomposition clarifies rather than decorates, every path works without motion or pointer input, and the unchanged work imagery occupies the strongest visual hierarchy.
