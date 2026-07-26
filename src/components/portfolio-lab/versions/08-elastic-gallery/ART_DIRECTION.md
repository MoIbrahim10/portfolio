# 08 — Elastic Gallery

## Thesis

A clean white portfolio where six image cards sit in one tactile horizontal strip; the work stays rigid and legible while spacing, scale, and settling carry a soft elastic response.

**Memory hook:** Six project images flex across a white table like a photographic contact sheet with spring in its joints, and one click unfolds the chosen frame into a quiet details drawer.

The elastic quality belongs to interaction, not decoration: no changing backgrounds, warped screenshots, floating ornaments, or effect-heavy scene changes.

## skills.sh

- Skill: **frontend-design**
- Exact URL: https://www.skills.sh/block/agent-skills/frontend-design
- Status: **reused; already installed locally from skills.sh** after searching skills.sh before design. No new skill was installed.
- Applied principle: refined minimalism becomes distinctive through one precise interaction, disciplined typography, deliberate spacing, and implementation complexity matched to the idea.

## Reference observations

Principles only. Do not reproduce any reference’s composition, identity, media, copy, code, or signature motion.

- **Max Milkin** — https://www.maxmilkin.com/  
  The portfolio is described as performance-first, minimal, fast, and fluid, with motion serving meaning. Transfer the restraint and the idea that one responsive gesture can demonstrate engineering craft; do not reproduce its WebGL still life, parallax, letter animation, or photoreal textures.
- **Tanuja Shastri** — https://www.tanujashastri.com/  
  A direct personal thesis leads into numbered projects with concise context, discipline, role, and case-study access. Transfer candid voice and unmistakable project sequencing; do not reuse split words, repeated headlines, playful rectangles, testimonials, or project-card compositions.
- **Trusha Neogi** — https://www.trushaneogi.com/  
  A declarative statement, visible work ethic, and outcome-led project list turn a broad practice into a readable story. Transfer the progression from point of view to proof; do not reuse spaced lettering, dictionary framing, bucket list, metrics, or long case-study summaries.
- **Cory Grossman** — https://www.corygrossman.co/  
  Modern typography and unusual interaction coexist with an explicit selected-work list and direct contact path. Transfer one authored interaction inside a conventional information hierarchy; do not reuse the showreel, service taxonomy, looping media, counter, streetwear language, or oversized contact treatment.
- **Jack Theobald** — https://jacktheobald.com/  
  A plainspoken introduction quickly establishes credibility, followed by media-led work entries, small taxonomies, and compact descriptions. Transfer confidence, image priority, and low-friction scanning; do not reuse its intro wording, client sequence, project grouping, typography specimens, or gallery rhythm.

### Anti-copy boundary

- No reference assets, typefaces, layouts, transition timings, cursors, loaders, wording, numbering style, project metadata, or interaction code.
- No WebGL, Three.js, canvas, smooth-scroll hijacking, custom cursor, autoplay media, parallax scene, marquee, glass, gradient, noise, blur field, or project-specific background.
- Do not imitate a reference’s hero, fullscreen reel, editorial grid, service list, portfolio chronology, or case-study page.
- Use only the existing shared portfolio data, project assets, unchanged Glyph Spark/Solar Pulse, and existing V2 button system.

## Exact visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Canvas | `#FAFAF7` | Unchanging page background |
| Paper | `#FFFFFF` | Drawer and media backing |
| Glyph navy | `#17233D` | Primary text, focus, logo context |
| Graphite | `#2D3036` | Project titles |
| Quiet ink | `#686D75` | Bio, descriptions, utility copy |
| Hairline | `#DADDD8` | Rules and inactive card edge |
| Soft rail | `#ECEEEA` | Loading frames and rail track |
| Solar gold | `#D6A23A` | Active count tick and V2 accent |
| Signal red | `#B73B35` | Close/attention detail only |
| Scrim | `#17233D73` | Drawer backdrop |

Shared project accent colors may appear only as a 2 px active-card edge. Never tint, mask, or recolor project imagery.

### Dependency-free typography

- Display/project titles: `"Helvetica Neue", "Nimbus Sans L", Helvetica, Arial, sans-serif`
- Body/navigation: `"Avenir Next", Avenir, "Segoe UI", Calibri, sans-serif`
- Counts/status: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace`
- H1: `clamp(2.4rem, 5vw, 5.6rem)`, line-height `0.94`, maximum two lines; body 16–19 px/1.55; project caption 15–18 px; utility labels 11–12 px.
- Sentence case. No outlined, stretched, animated, all-caps paragraph, or text over images.

### Geometry

- Maximum page width 1600 px; gutters 24–56 px desktop and 16–22 px mobile; spacing base 8 px.
- Hero max width 720 px and max height 46vh so the first cards enter the desktop viewport.
- Rail cards are image-only `article` buttons, `clamp(300px, 42vw, 680px)` wide, fixed `16 / 10` frame, 2 px corners, and 14–20 px gaps.
- Images use intrinsic dimensions and `object-fit: cover`; elastic response changes container position and gaps, never image aspect ratio.
- No card shadows at rest. The active card receives one 1 px navy edge and a restrained 0 12px 30px `#17233D14` shadow.

## Page architecture

### 1. Masthead and hero

- Keep the existing linked **Glyph Spark with Solar Pulse** unchanged at top left; never redraw, recolor, crop, mask, or animate its internal parts.
- Right side: plain `X` and `GitHub` links plus existing V2 **CutCornerButton** labeled `Schedule`.
- Exact links: X https://x.com/m0code · GitHub https://github.com/MoIbrahim10 · Schedule https://cal.com/mo-c0de/30min.
- Eyebrow: `Mo Ibrahim · Design engineer`; H1: `Small details. Better products.`
- Show this bio exactly, without edits:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- One V2 CutCornerButton, `Schedule a call`, links to the exact Schedule URL. Keep the header and hero in normal document flow.

### 2. Elastic project rail

- Heading row: `Selected work`, a quiet instruction `Drag, scroll, or use arrows`, and settled count `01 / 06`.
- Render exactly in shared-data order: **The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, Stepper**.
- One native horizontally scrolling flex rail with `scroll-snap-type: x mandatory`; show one whole card, most of the next, and a small previous edge after movement.
- Each card displays only its unchanged hero image. Accessible name: `Open [project title] project details`.
- When a card settles at center, its neighboring gaps open by 8 px and the card rises 6 px; cards themselves keep a fixed ratio and undistorted media.
- A stable caption below the rail shows current title and exact shared one-line description. It never overlays or moves the rail.
- Clicking/tapping a card opens details. Passive scrolling updates count, caption, `aria-current`, and URL hash without stealing focus.

### 3. Project details drawer

- Desktop: 560–680 px right drawer over a quiet scrim; mobile: bottom sheet capped at 92dvh with safe-area padding.
- Content order: title, exact shared description, hero image, supplied gallery images, collaborators only when present, then available project links.
- Use existing V2 CutCornerButton for the primary live-project link; repository is an underlined text link. Omit absent links, galleries, and collaborators.
- Never invent people, roles, dates, services, metrics, outcomes, or extra media.
- Drawer is a labeled modal dialog; background becomes inert, focus enters the close button, Escape closes, and focus returns to the triggering card.
- Gallery is a vertical image sequence with intrinsic ratios, not a nested carousel; a compact thumbnail index may jump to supplied images.

### 4. Contact and footer

- Contact line: `Available for thoughtful product collaborations.` followed by plain X and GitHub links and a V2 `Schedule` button using the exact URLs above.
- Footer: unchanged small Glyph Spark, `Mo Ibrahim · Cairo, Egypt`, current year, and plain `Back to top`.
- No repeated bio, oversized outro, social icons, or invented availability status.

## Motion and interaction storyboard

Use the existing Motion React library only; add no dependency.

1. **Arrival:** content is readable immediately; hero fades in over 220 ms and the rail rises 8 px over 300 ms with `[0.22, 1, 0.36, 1]`.
2. **Drag/scroll:** native scrolling remains the source of truth. During direct manipulation, cards follow the pointer exactly; no magnetic pull, wheel conversion, or delayed smoothing.
3. **Settle:** on scroll end, the nearest card snaps to center, overshoots 4 px once, and returns over a critically damped spring (`stiffness 360`, `damping 32`, `mass 0.7`).
4. **Elastic gap:** only after selection settles, the active card’s adjacent gaps expand 8 px over 220 ms; do not update layout continuously while scrolling.
5. **Hover/focus:** media scales to `1.015` inside its clipped frame and the edge tick extends 10 px over 180 ms. Press scales the container to `0.992` for 80 ms.
6. **Open:** the selected image shares layout identity with the drawer hero, moving into place over 380 ms; scrim fades 140 ms and copy follows once after 80 ms.
7. **Close:** copy fades 80 ms, image returns over 300 ms, then focus is restored. Rapid open/close interrupts the active animation cleanly.
- Animate transform and opacity; the one discrete gap change may use Motion layout. Never animate image dimensions, background, filter, or scroll position per frame.

### Keyboard and reduced motion

- Left/Right moves to adjacent cards; Home/End moves first/last; Enter or Space opens; Escape closes the drawer.
- Tab reaches masthead links, each card, and drawer controls in logical order. Scrolling selection never moves keyboard focus.
- With `prefers-reduced-motion`, remove arrival travel, scale, overshoot, elastic gap, shared-layout travel, stagger, and smooth scrolling; use instant state changes and an optional 80 ms opacity fade.

## Mobile, accessibility, states, and performance

- Below 720 px, cards become 84–88vw with 12 px gaps; keep native touch scrolling and snap. Do not intercept vertical gestures or pinch zoom.
- Drawer becomes a bottom sheet with sticky 44 px close control; no swipe-only dismissal. At 200% zoom, use the mobile composition with no horizontal page overflow.
- Semantic `header`, `main`, labeled `section`, six `article` elements, dialog, and `footer`; one H1 and sequential headings.
- All controls are at least 44 × 44 px. Focus is a 3 px `#17233D` outline with 3 px `#FAFAF7` offset. Active state uses edge, count, and `aria-current`, never color alone.
- Use shared useful alt text. Loading reserves all six fixed-ratio frames with solid `#ECEEEA` and no shimmer; empty state says `Projects are being prepared.`; image error retains title, frame, and drawer access with `Preview unavailable.`
- Eager-load only The Good Invoice hero; lazy-load remaining hero/gallery images, retain intrinsic width/height, decode asynchronously, and preload only the adjacent hero.
- Use `IntersectionObserver` for settled-card detection. Avoid continuous React state on scroll, layout thrashing, autoplay, background work, and cumulative layout shift.
- Success means all six projects remain browsable without motion or pointer input, the rail feels tactile but quiet, the drawer is fully operable, and project imagery remains the largest visual element.
