# 06 — Folded Index

## Thesis

A quiet, image-led portfolio arranged like a designer’s bound catalog: six project covers form the index, and selecting one unfolds an inline two-page signature with details and gallery leaves.

**Memory hook:** six small covers; one opens into a living book spread.

The binding metaphor organizes information rather than decorating it. No fake paper texture, ornate stationery, or theatrical page-flip should compete with the supplied work.

## skills.sh

- Skill: **frontend-design**
- Exact URL: https://www.skills.sh/block/agent-skills/frontend-design
- Status: **reused; already installed locally** after searching skills.sh before design. No skill was installed.
- Applied principle: make refined minimalism memorable through one precise spatial idea, strict hierarchy, restrained motion, and implementation complexity proportional to the concept.

## Reference observations

Principles only; do not reproduce compositions, assets, identity, copy, code, or signature interactions.

- **Bindery** — https://www.bindery.co/  
  Featured work is foregrounded through generous imagery and concise statements of each project’s purpose, while studio/service material stays secondary. Transfer the project-first hierarchy and confident editorial pacing.
- **Favourite** — https://favourite.design/  
  A responsive image index pairs compact title/category/year captions with hover-image changes and optional Shuffle/Reset controls. Transfer the legibility of a visual catalog and the sense that each entry is a discrete collected object.
- **4WIDE** — https://4wide.jp/  
  The site explicitly treats type and grid as craft, numbers selected cases, and separates studio, case, lab, updates, and contact into a rigorous information system. Transfer disciplined indexing, fine labels, and purposeful progression.
- **Midlife Engineering** — https://www.midlife.engineering/  
  Beats and tracks are presented as repeatable media units inside a tactile instrument-like interface, with playback treated as a deliberate state. Transfer the clarity of an object system and controlled state changes, not the audio-player metaphor.
- **Parade Kyoto** — https://parade.kyoto/  
  Large product photography, catalog/collection sections, gift language, and motion-rich transitions make browsing feel like handling a seasonal printed edition. Transfer warmth, product staging, and chapter-like pacing.

### Anti-copy boundary

- Do not copy Bindery’s headlines or project ordering; Favourite’s shuffle/reset behavior or hover swap; 4WIDE’s focus mode, typefaces, bilingual layout, or numbering style; Midlife’s player, autoplay, tracks, or controls; Parade’s red identity, loader, gift copy, pastry imagery, or seasonal catalog composition.
- Do not borrow screenshots, photos, logos, portraits, icons, cursors, loaders, copy, typefaces, timings, easing, source code, or page geometry from any reference.
- Do not simulate a literal book with leather, fibers, page-curl photos, dog-ears, rings, staples, or loud shadows.
- Do not build a horizontal rail, carousel, drawer, modal, blueprint, desktop-window system, or background-changing scene.
- Use only the unchanged Glyph Spark/Solar Pulse, shared portfolio data, supplied media, and existing V2 CutCornerButton.

## Exact visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Desk | `#F2EFE7` | Page canvas |
| Leaf | `#FFFDF7` | Covers and open pages |
| Glyph navy | `#17233D` | Primary text, focus, binding line |
| Carbon | `#22262B` | Project titles |
| Graphite | `#696B6E` | Bio, descriptions, metadata |
| Hairline | `#D6D0C3` | Rules and closed-cover edges |
| Solar gold | `#D49A3A` | Active folio tab and V2 accent |
| Signal red | `#A33A32` | Close marker only |
| Page shadow | `#17233D1A` | Open spread depth only |

Keep each project’s shared accent unchanged, but expose it only as a 4 px page-edge tab on its cover/spread. Never tint media or change the canvas per project.

### Dependency-free typography

- Editorial titles: `Iowan Old Style, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif`
- Interface/body: `"Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", sans-serif`
- Folio labels: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`
- H1 `clamp(2.25rem, 5vw, 4.75rem)` at `0.98`; project cover title `clamp(1.05rem, 1.7vw, 1.4rem)`; body 16–18 px at `1.55`; folios 11–12 px with `0.08em` tracking.
- Sentence case throughout. Uppercase is limited to tiny section labels; never uppercase the bio or descriptions.

### Geometry

- Maximum content width 1320 px; desktop gutters 32–56 px; mobile gutters 18–22 px; 8 px spacing base.
- Desktop uses a 12-column grid. Closed index: three columns × two rows, 24 px gaps. Each cover is `4 / 3`, with image occupying at least 82% of its area.
- Open spread spans all 12 columns after the selected cover’s row: two equal pages, `min-height: 560px`, 1 px central binding rule, 1 px outer border, 2 px radius.
- One 12 px stepped cut at the spread’s outer top corners subtly echoes Glyph architecture. No other clipped geometry, gradients, blur, glow, or permanent card shadow.

## Full-page architecture

### 1. Masthead

- Unchanged linked **Glyph Spark with Solar Pulse** at left; never redraw, crop, recolor, mask, or simplify it.
- Right: plain X and GitHub text links plus existing **V2 CutCornerButton** `Schedule`.
- Exact links: X https://x.com/m0code · GitHub https://github.com/MoIbrahim10 · Schedule https://cal.com/mo-c0de/30min.
- Normal document flow, 64–80 px high; no desktop hamburger or sticky chrome.

### 2. Compact hero

- Eyebrow: `Independent design engineer · Cairo`.
- H1: `Designed with care. Bound by detail.`
- Present this bio exactly, unchanged:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- Bio max `52ch`; one `Schedule a call` V2 CutCornerButton using the exact Cal URL. Selected work begins within the first desktop viewport; hero max height 54vh.

### 3. Closed project index

- Heading `Selected work`; utility line `Choose a cover · Enter opens`.
- Render exactly in shared-data order: **The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, Stepper**.
- Each semantic `article` contains one full-cover button: supplied hero image, then a separate footer strip with `01 / 06`, project title, and a quiet `Open` cue. No description or metadata overlays the media.
- Cards stay aligned and calm. Hover/focus may lift the cover’s outer edge by 4 px and reveal its accent tab; neighboring cards do not move.
- The index is a real grid, not a slider. All six remain discoverable without drag, wheel interception, or custom scrolling.

### 4. Inline bound signature

- Activating a cover inserts one full-width spread immediately after its grid row. It is not an overlay, drawer, route change, or nested scroller; later covers remain in document order below.
- **Left page:** selected hero at its intrinsic ratio, folio `01`, image count, and square gallery thumbnails only when more media exists.
- **Right page:** project title, exact shared description, collaborators only when supplied, available destinations, and a visible `Close project` control. Omit absent fields; invent no dates, roles, outcomes, people, or metrics.
- Primary live/repository destination uses the existing V2 CutCornerButton; a second destination is a quiet underlined link. If neither exists, omit the action area.
- Selecting a gallery thumbnail turns one inner leaf: the next supplied image replaces the left page while title/details remain stable. Show shared useful alt text and `2 of 3`; never autoplay.
- Below the first spread, additional supplied images may appear as one optional two-up proof sheet. Do not duplicate the active image or fabricate crops.
- Opening another cover closes the current signature first, then opens the requested row. Closing restores trigger focus and the reader’s prior scroll position.

### 5. Contact and footer

- Contact line: `Available for thoughtful product collaborations.` followed by exact X/GitHub links and Schedule V2 button.
- Footer: unchanged small Glyph Spark, `Mo Ibrahim · Design and code with care.`, current year, `Cairo, Egypt`, and plain `Back to start`.

## Motion storyboard

Use the existing Motion React library only; add no GSAP, Three.js, smooth-scroll package, canvas, WebGL, or dependency.

1. **Arrival:** masthead and hero are immediately readable; six covers fade from 0 to 1 and rise 8 px together over 240 ms. No loader.
2. **Cover hover/focus:** outer edge translates `-4px` and rotates `0.6deg` around the binding edge over 160 ms; shadow changes only during interaction.
3. **Press:** cover compresses to `scale(0.992)` for 70 ms and releases without bounce.
4. **Open:** the selected hero uses shared layout identity to settle onto the left page over 360 ms; the right page unfolds from `scaleX(0.96)` and opacity 0 around the center binding over 300 ms with `[0.22, 1, 0.36, 1]`. Surrounding grid reflow is handled by layout animation, not per-frame dimensions.
5. **Details:** right-page copy fades once after 100 ms; no line, word, or letter stagger.
6. **Leaf turn:** outgoing gallery image tips `rotateY(-3deg)` and fades for 140 ms; incoming image crossfades for 180 ms. Perspective is subtle and never exceeds 3°.
7. **Close:** details fade in 100 ms; pages fold to 0.98 and shared hero returns over 300 ms; focus restores after layout settles.
- Animate only transform and opacity; sequences are interruptible. Focus outlines never animate.
- Reduced motion: remove lift, rotation, folding, shared-layout travel, scaling, smooth scrolling, and stagger; insert/swap/remove content instantly with focus restoration and live announcements intact.
- Keyboard-triggered index navigation is instant even when motion is allowed.

## Mobile, keyboard, touch, and responsive transform

- Below 760 px, use one closed cover per row. Opening replaces that cover in place with a single vertical folio: hero, thumbnails, title, description, collaborators, links, close.
- Remove binding perspective and two-page geometry; retain a single 1 px rule and stepped top-right cut. Gallery swaps in place; no horizontal carousel.
- Index keys: Left/Right move one cover, Up/Down move one grid row, Home/End move first/last, Enter/Space opens, Escape closes. Mobile/one-column arrows move previous/next.
- Every action is at least 44 × 44 px. Touch needs no hover and no swipe-only action. Preserve native page scroll, pinch zoom, safe-area insets, and momentum.
- At 200% zoom, switch to the mobile composition with no clipped content or page-level horizontal overflow.

## States, accessibility, and performance

- Semantic `header`, `main`, labeled `section`, `article`, `nav`, and `footer`; one H1; sequential project headings; buttons named `Open [title] project`; decorative fold layers hidden from assistive tech.
- Open cover uses `aria-expanded="true"` and `aria-controls`; active gallery thumb uses `aria-current="true"`. Announce only settled open/close/image changes in one polite live region.
- Visible focus: 3 px `#17233D` outline with 3 px `#F2EFE7` offset. Text and controls meet WCAG AA; selection never relies on color alone.
- Loading reserves exact cover/spread ratios with solid `#E2DED4` blocks, no shimmer. Empty: `Projects are being prepared.` Error keeps title/ratio/action and says `Preview unavailable.`
- Preserve every supplied width/height and alt. Eager-load only The Good Invoice hero; lazy-load later covers/details, decode asynchronously, and preload only the selected project’s next gallery image.
- Keep the shared data and links in initial markup. Use stable IDs and no index keys. Do not update React state on scroll; no scroll listener is required.
- Validate keyboard-only, coarse touch, 320 px, 200% zoom, reduced motion, loading/empty/error, slow decode, hydration, contrast, focus restoration, and zero horizontal overflow.

## Exit gate

The page contains the unchanged Glyph Spark/Solar Pulse, exact bio and links, all six shared projects and media, a quiet closed-cover index, one accessible inline bound signature, V2 primary actions, complete non-motion behavior, and no borrowed reference identity or interaction.
