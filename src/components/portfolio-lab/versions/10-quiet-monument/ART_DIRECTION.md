# 10 — Quiet Monument

## Thesis

A sparse portfolio on one unchanging ivory canvas: a concise personal introduction leads to one monumental horizontal gallery where six image panels carry nearly all the visual weight.

**Memory hook:** A quiet museum wall with six luminous windows—scroll the work, then open one window to read its story.

The page feels bold through scale, proportion, and confident color accents, not through decorative effects. Work is always the largest and highest-contrast element.

## skills.sh

- Search performed first on https://www.skills.sh/ for portfolio art direction, refined minimalism, and frontend visual design.
- Relevant result: **design-taste-frontend**
- Exact URL: https://www.skills.sh/leonxlnx/taste-skill/design-taste-frontend
- Status: **not installed**. Closely related local design skills already exist, and this deliverable is a non-code art-direction brief; another install would add no useful capability.
- Retained principle: infer the direction from the references and existing brand, then commit to one memorable move with deliberately low visual density.

## Reference observations

Principles only. Do not reproduce any reference’s layout, identity, imagery, copy, typeface, code, or signature behavior.

- **Nivedha Nirmal** — https://www.nivedhanirmal.com/  
  A bold opening statement and broad image field establish the practice before a short invitation to collaborate. Transfer the confidence to let imagery occupy the page and keep supporting copy terse; do not copy its split wording, category lettering, image choreography, repeated calls to action, or studio language.
- **Ngan Nguyen** — https://www.ngan-nguyen.com/  
  Projects arrive immediately with short titles, one-line propositions, and explicit case-study access; career context follows after the work. Transfer the work-first order and concise progressive disclosure; do not copy its project grid, archive, playful prompts, biography structure, statistics, or case-study compositions.
- **Jack Theobald** — https://jacktheobald.com/  
  A plainspoken introduction establishes credibility, then large project media, small taxonomies, and compact summaries do the proof. Transfer the balance of direct voice and media-led evidence; do not copy its wording, client order, project grouping, typography specimens, tags, or gallery rhythm.
- **Cali Castle** — https://cali.so/en  
  A narrow personal frame, tiny utilities, repeated hairlines, compact experience rows, and small image-led modules make a long page feel calm and navigable. Transfer disciplined density and quiet metadata; do not copy its portrait treatment, three-tile menu, numbered sections, article list, shelves, dock, or footer coordinates.
- **Gabriel Beaugonin** — https://www.gabrielbeaugonin.com/  
  The direct site was unavailable to the research tools, so no visual behavior should be inferred from it. The safe transferable principle from Gabriel’s publicly credited work is progressive disclosure: product-first storytelling becomes understandable through clear, navigable layers and restrained transitions.

### Anti-copy boundary

- Never borrow screenshots, portraits, artwork, icons, copy, typefaces, dimensions, page sequence, motion timing, cursor behavior, or code from a reference.
- Do not recreate Nivedha’s split hero, Ngan’s archive, Jack’s case-study rhythm, Cali’s narrow résumé/blog composition, or any inaccessible Gabriel behavior.
- No custom cursor, canvas, WebGL, Three.js, GSAP, shader, autoplay, marquee, parallax, grain, glow, glass, gradient, background swap, floating ornament, or loading spectacle.
- Use only shared portfolio data and unchanged supplied assets. Never recolor, mask, distort, or invent project imagery.

## Exact visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Ivory canvas | `#F7F5EF` | Fixed page background |
| Paper | `#FFFFFF` | Media backing and drawer |
| Glyph navy | `#14223B` | Primary text, focus, brand context |
| Graphite | `#303238` | Body copy |
| Quiet gray | `#74766F` | Captions and utilities |
| Hairline | `#D8D5CC` | Rules and panel edges |
| Solar gold | `#D5A22F` | Active locator and V2 accent |
| Signal red | `#B83C35` | One section marker and close emphasis |
| Skeleton | `#E9E6DD` | Reserved loading surfaces |
| Scrim | `#14223B66` | Details backdrop |

Project accent colors may appear only as a 3 px active-card rule. The canvas never changes, and project images are never tinted.

### Dependency-free typography

- Display and project titles: `"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif`
- Body and navigation: `"Avenir Next", Avenir, "Segoe UI", Calibri, sans-serif`
- Counts and micro-labels: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace`
- H1: `clamp(3rem, 8vw, 8.5rem)` at `0.88` line-height, maximum two lines; bio 17–20 px at `1.5`; captions 14–17 px; utilities 11–12 px.
- Sentence case except the single static display word `WORK`. No outlined, animated, stretched, shadowed, or image-overlay text.

### Geometry

- Maximum page width 1760 px; desktop gutters 32–64 px; mobile gutters 16–20 px; 8 px spacing base.
- Masthead and hero use a 12-column grid. Hero copy spans 6–8 columns and stays under 62ch.
- `WORK` occupies a quiet 2-column label beside the gallery, vertically aligned to its top; it never scrolls over imagery.
- The rail uses image-only cards `clamp(340px, 58vw, 920px)` wide, fixed `16 / 10`, 16–24 px gaps, and 2 px corners.
- No resting shadows. Media uses intrinsic dimensions and `object-fit: cover` inside reserved aspect-ratio frames.

## Complete page architecture

### 1. Masthead

- Left: existing linked **Glyph Spark with Solar Pulse**, unchanged. Never redraw, recolor, crop, mask, or animate its internal parts.
- Right: plain `X` and `GitHub` links plus the existing V2 **CutCornerButton** labeled `Schedule`.
- Exact links: X https://x.com/m0code · GitHub https://github.com/MoIbrahim10 · Schedule https://cal.com/mo-c0de/30min.
- Normal document flow; no sticky glass bar, hamburger on desktop, status dot, or availability badge.

### 2. Hero

- Eyebrow: `Mo Ibrahim · Design engineer`
- H1: `Useful products, carefully made.`
- Show this biography exactly once:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- One V2 CutCornerButton, `Schedule a call`, points to the exact Schedule URL.
- Keep the hero short enough that the gallery enters the first desktop viewport. No portrait, service list, metrics, or decorative headline loop.

### 3. Monument gallery

- Heading row: static `WORK`, `Selected projects`, instruction `Scroll or use arrow keys`, and count `01 / 06`.
- Render exactly in shared-data order: **The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, Stepper**.
- Use one native horizontal flex rail with `scroll-snap-type: x mandatory`; show one dominant card, most of the next, and the previous edge after movement.
- Each semantic `article` contains only the unchanged hero image as a button. Accessible name: `Open [project title] project details`.
- Beneath each card—not over it—show project title and shared one-line description. Keep title visible while the card is centered.
- Clicking or pressing a card opens its details drawer. Passive scrolling updates count, caption, active rule, `aria-current`, and URL hash without moving focus.
- Small previous/next controls may sit after the count; they use text arrows with 44 px hit areas, not floating circular buttons.

### 4. Project details

- Desktop: right drawer 580–680 px. Mobile: bottom sheet capped at 92dvh with safe-area padding.
- Order: title, exact shared description, hero image, supplied gallery images, collaborators only when present, then available links.
- Use the existing V2 CutCornerButton for the primary live-project link. Repository is a plain underlined link. Omit absent gallery, collaborators, or actions instead of inventing content.
- Drawer is a labeled modal dialog; background becomes inert, focus enters the close button, Escape closes, and focus returns to the originating card.
- Gallery is a vertical sequence preserving each supplied ratio. No nested carousel, thumbnails, lightbox, duplicated hero, fabricated credits, or extra project metadata.

### 5. Contact and footer

- Contact line: `Available for thoughtful product collaborations.`
- Show plain X and GitHub links and one V2 `Schedule` button using the exact URLs above.
- Footer: unchanged small Glyph Spark, `Mo Ibrahim · Cairo, Egypt`, current year, and plain `Back to top`.
- No repeated biography, newsletter, oversized outro, social icons, live clock, or invented location details.

## Mechanics and motion

Use the existing Motion React library only; add no dependency.

1. Arrival is readable immediately: hero fades from 0.98 opacity over 180 ms; rail rises 6 px over 260 ms with `[0.22, 1, 0.36, 1]`.
2. Native scroll is the source of truth. Never convert the wheel, add inertial smoothing, or delay direct touch movement.
3. Hover/focus lifts a card 4 px and scales media to `1.008` inside its clipped frame over 180 ms. Press returns to scale `0.996` for 70 ms.
4. When a card settles, the 3 px accent rule extends from 12 px to 44 px over 220 ms; title and count crossfade once in 120 ms.
5. Opening uses a restrained shared-image transition into the drawer hero over 360 ms; scrim fades in 140 ms and copy follows after 60 ms.
6. Closing reverses once, then restores focus. Rapid open/close interrupts cleanly. Animate transform and opacity only.

### Keyboard and reduced motion

- Left/Right selects adjacent cards; Home/End selects first/last; Enter or Space opens; Escape closes the drawer.
- Tab order follows shared project order. Scroll selection never moves keyboard focus or announces continuously.
- With `prefers-reduced-motion`, remove arrival travel, lift, scale, smooth scrolling, shared-image travel, and delayed copy. Use instant state changes with an optional 80 ms opacity fade.

## Mobile, accessibility, states, and performance

- Below 720 px, cards become 86vw with 12 px gaps. Keep native touch scroll, vertical gestures, and pinch zoom; never require dragging.
- At 200% zoom, use the mobile composition with no page-level horizontal overflow. The drawer remains scrollable behind a sticky 44 px close control.
- Use semantic `header`, `main`, labeled `section`, six `article` elements, modal `dialog`, and `footer`; one H1 and sequential headings.
- Every control is at least 44 × 44 px. Focus uses a 3 px `#14223B` outline with 3 px `#F7F5EF` offset. Active state uses position, count, rule, and `aria-current`, never color alone.
- Use shared useful alt text. Loading reserves six final-ratio frames with solid `#E9E6DD` and no shimmer. Empty state: `Projects are being prepared.` Error state retains the title and button with `Preview unavailable.`
- Eager-load only The Good Invoice hero. Lazy-load remaining hero/gallery media, preserve intrinsic width/height, decode asynchronously, and preload only the adjacent hero.
- Detect the settled card with `IntersectionObserver`; avoid per-frame React state, repeated layout reads, content duplication, enormous compositor layers, autoplay, background work, and cumulative layout shift.
- Success means the portfolio reads before it moves, all six works remain obvious and operable without pointer or animation, and the unchanged project imagery dominates every viewport.
