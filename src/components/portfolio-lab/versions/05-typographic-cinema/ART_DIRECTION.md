# 05 — Typographic Cinema

## Thesis

A quiet editorial portfolio staged like six precise film cuts: one stable widescreen carries the imagery, while a compact shot list supplies titles, one-sentence context, and deliberate pacing.

**Memory hook:** a slim shot list cues six project stills through one calm widescreen, then the chosen work opens into an inline “intermission” of details.

Imagery is the protagonist. Type behaves like credits and subtitles, never like a billboard; no word may become a full-page graphic.

## skills.sh

- Skill: **frontend-design**
- Exact URL: https://www.skills.sh/block/agent-skills/frontend-design
- Status: **reused; already installed locally** after searching skills.sh before design. No skill was installed.
- Applied: one memorable interaction, restrained but distinctive typography, exact visual tokens, intentional motion, and implementation complexity matched to refined minimalism.

## Reference observations

Principles only; do not reproduce composition, assets, identity, copy, source code, or signature motion.

- **Melius** — https://www.melius.com/  
  A creative process is made legible as ordered media outcomes—boards, stills, and clips—with small labels identifying format. Transfer the sense of authored sequencing and media-first hierarchy, not its product canvas, model labels, or campaign taxonomy.
- **Prototype Studio** — https://www.prototypestudio.fr/  
  A numbered `01 / 11` work sequence, terse project/category pairings, and a reel mindset make browsing feel cinematic without requiring long descriptions. Transfer shot numbering and editorial pacing, not its agency headline, client roster, menu, reel, or project order.
- **Serena Congiu** — https://www.serenacongiu.com/  
  An uninterrupted run of images and videos lets work carry the page while navigation remains extremely utilitarian. Transfer visual confidence and low-chrome navigation, not its archive structure, anonymous next-page links, media, or exact rhythm.
- **Oğuz Bülbül** — https://oguz.design/  
  A sparse identity, direct social actions, and a compact “Worked with” list show how little interface is needed when proof is strong. Transfer brevity and collaborators-as-credits, not its portrait, client logos, copy, or contact interaction.
- **Wildy Riftian** — https://www.wildyriftian.com/  
  “Collection of visual works,” category labels, `01 / 06` progress, and featured-work chapters make projects feel episodic. Transfer chapter clarity and visible progress, not its identity, headlines, coordinates, work descriptions, or playful visual language.

### Anti-copy

- Do not copy Melius’s node/canvas UI, Prototype’s hero or reel, Serena’s full archive stream, Oğuz’s client-logo wall, or Wildy’s chapter compositions.
- Do not borrow any screenshot, video, portrait, logo, icon, cursor, loader, transition timing, typeface, copy, project name, or code.
- No full-screen type, autoplay video, custom cursor, page loader, film grain, sprocket holes, clapperboard motifs, black cinematic bars, or fake production credits.
- Do not build another horizontal rail, carousel, masonry feed, or side drawer. Use the shared portfolio dataset and media unchanged.

## Exact visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Canvas | `#F4F2EC` | Page background |
| Paper | `#FFFEFA` | Shot list and expanded details |
| Screen | `#10151D` | Letterbox-free media stage |
| Glyph navy | `#17233D` | Primary text, rules, focus |
| Carbon | `#202228` | Headings |
| Slate | `#6B7078` | Descriptions and utility labels |
| Rule | `#D8D5CC` | Section and list dividers |
| Solar gold | `#D49A3A` | Active cue and V2 action |
| Signal red | `#9C2926` | One close/error mark |
| Scrim | `#17233D99` | Image-caption legibility only |

Keep each shared project accent unchanged, but use it only as a 3 px active shot marker and gallery position tick. Never tint media or change the page background per project.

### Dependency-free typography

- Project titles/display: `"Avenir Next Condensed", "Helvetica Neue Condensed", "Franklin Gothic Condensed", "Nimbus Sans Narrow", sans-serif`
- Bio/body: `Optima, Candara, "Noto Sans", "Segoe UI", sans-serif`
- Counts/credits: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`
- H1: `clamp(2.25rem, 4.5vw, 4.75rem)`, line-height `0.95`, maximum 11 characters per visual line; project titles `clamp(1.2rem, 2vw, 1.8rem)`; body 16–19 px; credits 11–12 px.
- Do not uppercase paragraphs or exceed two display lines. Letter spacing is neutral for body, `0.08em` only for tiny credits.

### Geometry

- Maximum width 1480 px; desktop gutters 32–56 px; mobile 18–22 px; 8 px spacing base.
- Desktop project area: 12 columns, 32 px gap. Stable screen occupies 8 columns; shot list occupies 4.
- Screen ratio `16 / 10`, maximum height `72vh`, 2 px radius, one 10 px stepped top-right cut echoing Glyph architecture.
- No cards around text, gradients, blur, glow, texture, permanent shadow, or floating decoration. One-pixel rules and negative space create hierarchy.

## Full-page architecture

### 1. Masthead

- Unchanged linked **Glyph Spark with Solar Pulse** at left; never redraw, crop, recolor, mask, or simplify it.
- Right: plain text links for X and GitHub plus existing **V2 CutCornerButton** `Schedule`.
- Exact links: X https://x.com/m0code · GitHub https://github.com/MoIbrahim10 · Schedule https://cal.com/mo-c0de/30min.
- Normal document flow, 64–80 px tall; no hidden menu on desktop.

### 2. Compact hero

- Eyebrow: `Independent design engineer · Cairo`; H1: `Thoughtful products, cut clean.`
- Show this bio exactly and without edits:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- Keep the bio at `48ch`; use one V2 CutCornerButton, `Schedule a call`, pointing to https://cal.com/mo-c0de/30min.
- Selected work begins within the first desktop viewport. The hero must not exceed 52vh.

### 3. Six-scene screening

- Heading `Selected work`; instruction `Scroll scenes · use arrows · Enter opens`.
- Render exactly, in shared-data order: **The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, Stepper**.
- Left: one sticky semantic media stage. Right: six normal-flow `article` chapters, each about 42vh, with count, title, exact shared description, and `Open project`.
- Each chapter crossing a 55% viewport threshold updates the stage. Native document scroll remains untouched; no nested scrolling, pinned-wheel capture, or scroll-jacking.
- Stage holds only current and incoming fixed-ratio images during a cut. The mask is a simple overflow crop whose leading edge moves left-to-right; it never becomes a decorative shape.
- A small stage subtitle shows `03 / 06 · Bits n Pixels`; it sits outside the image on light canvas. No text overlays media.
- Clicking a chapter title scrolls it into the active threshold. Arrow Up/Down moves chapter focus and active still; Home/End reach first/last. Enter or Space opens details.

### 4. Inline intermission details

- Opening a project inserts a full-width details section immediately after the screening grid; this is neither a modal nor a drawer.
- The sticky stage releases, and its current image visually continues into the intermission hero at the same width before settling into a two-column layout.
- Content order: project title, exact shared description, gallery when supplied, collaborators when supplied, available links. Omit absent fields; never invent dates, roles, outcomes, people, or metrics.
- Gallery is a vertical sequence of supplied images with fixed intrinsic ratios, not another carousel. Each image has its shared useful alt text.
- Live link uses existing **V2 CutCornerButton**; repository is a quiet underlined text link. If only one exists, show only one.
- `Close details` returns to the screening grid, restores the triggering chapter focus, and preserves its scroll position. The other five chapters remain present in the document.

### 5. Contact and footer

- Contact line: `Available for thoughtful product collaborations.` with exact X/GitHub text links and Schedule V2 button.
- Footer: unchanged small Glyph Spark, `Mo Ibrahim · Design and code with care.`, current year, `Cairo, Egypt`, and plain `Back to start`.

## Motion storyboard

Use the existing Motion React library only; add no GSAP, Three.js, smooth-scroll library, canvas, WebGL, or dependency.

1. **Arrival:** masthead and hero are immediately readable; stage fades from `0` to `1` and rises 10 px over 280 ms. Shot chapters appear together after 60 ms.
2. **Chapter cue:** when threshold changes, the incoming image is already decoded beneath the current one. Its rectangular mask opens left-to-right over 360 ms with `[0.22, 1, 0.36, 1]`; outgoing image fades during the final 120 ms.
3. **Caption cut:** stage count/title crossfades over 140 ms after the image edge passes 60%; no word-by-word animation.
4. **Hover/focus:** chapter marker grows from 3 × 12 px to 3 × 24 px in 160 ms; title shifts 4 px. Focus outline appears instantly and never animates.
5. **Press:** `scale(0.99)` for 80 ms, then release over 120 ms without bounce.
6. **Open intermission:** current stage and inline hero share a layout identity; screening columns fade to 0.4 while the image settles over 420 ms using a critically damped spring (`stiffness 320`, `damping 34`, `mass 0.8`). Detail copy fades once, 120 ms later.
7. **Gallery:** images reveal on entry with opacity and 8 px rise over 240 ms; animate once, never replay when scrolling upward.
8. **Close:** details fade in 120 ms; shared image returns over 320 ms; focus restoration happens after layout settles.
- All sequences are interruptible and animate only transform, opacity, and the one rectangular clip-path. Never animate layout dimensions per scroll frame.
- Reduced motion: remove rise, mask travel, shared-layout travel, scaling, stagger, crossfades, and smooth scrolling; swap content instantly while keeping focus and announcements.
- Keyboard-triggered chapter changes are instant even when motion is allowed; opening/closing may retain the reduced 140 ms opacity transition.

## Mobile, touch, and responsive transformation

- Below 780 px, remove the sticky split. Render six normal-flow project chapters: media first at `4 / 3`, then count, title, description, and `Open project`.
- No horizontal rail. The inline intermission replaces its originating chapter in place and returns without changing the reader’s page position.
- Masthead keeps logo and Schedule; X/GitHub move to Contact. Hero H1 stays within three lines at 320 px.
- Gallery remains vertical and full-width. Respect safe-area insets and do not intercept native page scrolling or pinch zoom.
- Every control is at least 44 × 44 px. Touch activation has no hover dependency; details close through a visible button, never swipe-only.
- At 200% zoom, use the mobile composition and preserve all content/actions without overlap or page-level horizontal overflow.

## States, accessibility, and performance

- Semantic `header`, `main`, labeled `section`, `article`, `nav`, and `footer`; one H1; sequential project headings; shared useful alt text; decorative mask layers are hidden.
- Active chapter uses `aria-current="true"` plus count/title, never color alone. Announce only settled project changes in one polite live region.
- Visible focus is a 3 px `#17233D` outline with 3 px `#F4F2EC` offset. Contrast remains WCAG AA on every surface.
- Loading reserves exact stage/media geometry using solid `#E3E0D7` blocks; no shimmer. Empty state: `Projects are being prepared.` Error state preserves ratio/title/action and says `Preview unavailable.`
- Preserve supplied image width/height. Eager-load only The Good Invoice hero; lazy-load later hero/gallery assets and decode asynchronously. Preload only the adjacent still, never all galleries.
- Use `IntersectionObserver` for chapter selection and gallery reveal; do not set React state on every scroll frame. Cancel stale image transitions.
- Content and links exist before enhancement. Hashes may identify the active/open project, but history updates use `replaceState` during passive scrolling.
- Validate keyboard-only, coarse touch, 320 px, 200% zoom, reduced motion, loading/empty/error, contrast, slow image decode, hydration, and zero page-level horizontal overflow.

## Exit gate

The page contains Mo’s unchanged Glyph Spark/Solar Pulse, exact bio and links, all six shared projects/media, V2 actions, one readable widescreen-to-intermission sequence, complete non-motion behavior, and no visual or interaction copied from the five references.
