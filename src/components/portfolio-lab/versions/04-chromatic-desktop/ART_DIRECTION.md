# 04 — Chromatic Desktop

## Thesis

A compact, paper-bright project workspace where image panes reorder with playful precision; it feels like a designer arranging work on a table, never like an operating-system replica.

**Memory hook:** selecting a project pulls its image pane forward while the other five compress into a visible six-color ledge; one click restores the complete workspace.

Projects are the largest and most colorful objects. The fixed canvas, hero, and controls stay quiet.

## skills.sh

- Skill: **ui-design**
- Exact URL: https://www.skills.sh/mblode/agent-skills/ui-design
- Status: **reused; already installed locally**. Its skills.sh page was searched and verified before design; nothing new was installed.
- Mode/track: Direction · Marketing/brand UI, with `aesthetic-direction.md` and `design-in-code.md`.
- Applied: composition before components, one dominant idea per section, exact tokens, image-led hierarchy, complete states, and mobile as a deliberate transformation.

## Reference principles

Principles only; do not reproduce compositions, assets, identity, copy, code, or signature interactions.

- **Recent** — https://recent.design/  
  Dense visual browsing remains legible through strict categories, consistent gutters, and quiet utility chrome. Transfer scan rhythm and image priority, not its masonry feed or sidebar.
- **Cali Castle** — https://cali.so/en  
  A narrow personal column, numbered sections, compact metadata, and shelf-like image groupings make varied content feel authored. Transfer disciplined indexing and warmth, not its biography, portrait treatment, shelves, or site structure.
- **JIB** — https://jib.design/  
  A spare introduction can hand attention directly to one strong selected-work image, while experience and service lists remain plain. Transfer the confidence to leave space around proof, not its mark, copy, proportions, or work presentation.
- **Shed** — https://shedsgns.me/  
  Projects, playground, notes, and contact are clearly grouped with terse labels and dates; personality comes from curation rather than decoration. Transfer decisive grouping and brevity, not its greeting, writing titles, project list, pricing, or identity.
- **Fay Dakrouri** — https://faydakrouri.com/  
  A compact biography, three concise experience columns, small image stacks, and plain secondary links create a personable desktop-scale portfolio. Transfer human scale and light layering, not its portrait, copy, job history, card stacks, or exact arrangement.

### Anti-copy

- Do not copy Recent’s sidebar/feed/filter layout, Cali’s numbered résumé/shelves, JIB’s logo or selected-work composition, Shed’s content taxonomy, or Fay’s three-column résumé and floating mockup stacks.
- No borrowed screenshots, portraits, copy, icons, cursor, loader, motion timing, source code, or typography.
- No traffic lights, taskbar, desktop icons, fake file names, menu bar, draggable-window chaos, boot sequence, system sounds, or “My Computer” language.
- Use only the shared portfolio content/media, unchanged Glyph Spark/Solar Pulse, and existing V2 CutCornerButton.

## Exact visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Canvas | `#F3F1EA` | Fixed page background |
| Window paper | `#FFFDF8` | Pane and detail surfaces |
| Glyph navy | `#17233D` | Primary structure, text links, focus |
| Carbon | `#17191D` | Headings and high-contrast copy |
| Graphite | `#64686F` | Bio support and utility text |
| Rule | `#D8D5CC` | Hairlines and inactive pane edges |
| Solar gold | `#D79D40` | V2 action and active locator |
| Signal red | `#9C1E1B` | Close/error and one tiny corner |
| Scrim | `#17233DB3` | Focus-mode backdrop only |

Project edge colors remain exactly: Good Invoice `#E34D3D`, Calm AI Studio `#B7FF54`, Bits n Pixels `#F1EDE3`, Glazed `#77A7FF`, Orgo `#CF49FF`, Stepper `#A8D900`. Use them only on 4–8 px exposed pane edges, selection ticks, and gallery position markers. Never tint media or recolor the page.

### Dependency-free type

- Display/project names: `"Avenir Next Condensed", "Arial Narrow", "Franklin Gothic Condensed", "Nimbus Sans Narrow", sans-serif`
- Bio/body: `Charter, "Bitstream Charter", "Sitka Text", "Iowan Old Style", Georgia, serif`
- Labels/counts: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`
- H1: `clamp(2.5rem, 6vw, 5.75rem)`, line-height `0.92`; bio: `clamp(1.05rem, 1.6vw, 1.35rem)`, max `48ch`; labels: 11–12 px.

### Geometry

- Maximum content width 1480 px; desktop gutters 32–56 px; mobile 18–22 px; spacing base 8 px.
- Pane corners 2 px; one 8 px stepped top-right cut echoes Glyph architecture. No pills, glass, blur, glow, textures, or permanent large shadows.
- Focused pane shadow only: `0 24px 64px #17233D1F`; inactive panes use one `#D8D5CC` edge.
- “Chromatic” lives in exposed project edges, never in a gradient background.

## Full portfolio architecture

### 1. Masthead

- Unchanged linked **Glyph Spark with Solar Pulse** at left; never redraw, crop, recolor, or simplify it.
- Right: plain X and GitHub links plus existing **V2 CutCornerButton** `Schedule`.
- Exact URLs: X https://x.com/m0code · GitHub https://github.com/MoIbrahim10 · Schedule https://cal.com/mo-c0de/30min.
- Normal flow, 64–80 px high; no sticky desktop chrome or hidden menu.

### 2. Compact introduction

- Eyebrow: `Independent design engineer · Cairo`; H1: `Useful things, carefully made.`
- Show this bio exactly, without edits:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- One V2 CutCornerButton: `Schedule a call` → https://cal.com/mo-c0de/30min.
- Keep the introduction within roughly 45% of the first desktop viewport so project imagery appears immediately below.

### 3. Selected-work workspace

- Heading `Selected work`; instruction `Choose a pane · arrows move · Enter opens`.
- Render all six in shared-data order: **The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, Stepper**.
- Desktop stage uses a 12-column, 2-row composition: one 7-column primary image pane; five smaller image panes form a precise right/bottom queue. Every pane remains visibly image-dominant.
- Each semantic `article` owns an image button plus a quiet external number/title; descriptions never overlay thumbnails.
- Selection reorders panes through shared-layout transforms. The active pane occupies the primary slot; the other five retain stable DOM order and compress into the chromatic ledge at the stage edge.
- A plain `Overview` control restores the six-pane composition; there is no free dragging, resizing, minimizing, or overlapping clutter.

### 4. Contact and footer

- Contact line: `Available for thoughtful product collaborations.` followed by exact X/GitHub links and Schedule V2 button.
- Footer: unchanged small Glyph Spark, `Mo Ibrahim · Design and code with care.`, current year, `Cairo, Egypt`, and plain `Back to start`.

## Project presentation and detail mechanic

- Clicking, tapping, Enter, or Space focuses a pane; Arrow Left/Right moves through project buttons, Home/End reach boundaries, and focus follows without wrapping.
- Focused mode keeps the hero image at least 65% of the stage. A paper detail tray unrolls from its bottom edge, not from the viewport, so image and context remain one object.
- Tray order: number/title, exact shared description, gallery thumbnails when supplied, collaborators when supplied, links. Omit absent blocks; never invent roles, outcomes, dates, metrics, or collaborators.
- Primary live link uses V2 CutCornerButton; repository is a quiet underlined secondary link. If neither exists, omit actions.
- Gallery swaps only the active fixed-ratio image; thumbnails show supplied assets with useful labels.
- Focused pane uses `aria-expanded`/`aria-controls`; the inline tray is not a modal. Escape returns to Overview and restores the trigger; ordinary Tab continues through tray controls and the page.

## Motion storyboard

Use existing Motion React only; add no GSAP, Three.js, smooth-scroll, canvas, or dependency.

1. **Arrival:** logo and bio are immediate; workspace rises 12 px/fades over 320 ms; panes stagger 22 ms, capped at 110 ms.
2. **Hover/focus:** pane rises 3 px; its chromatic edge exposes 4 px over 180 ms. Image scale max `1.008`; focus outline never animates.
3. **Press:** immediate `scale(0.992)`; release settles over 140 ms with no bounce.
4. **Select:** active pane moves to the primary slot via interruptible shared-layout transform over 360 ms; queued panes translate/scale only. No spins, 3D tilt, or flying windows.
5. **Memory ledge:** five inactive edges compress in 28 ms stagger; all remain recognizable by thumbnail and accessible name.
6. **Tray:** reveals with `scaleY` from the selected pane’s bottom edge plus opacity over 240 ms; content fades in together, not as a theatrical cascade.
7. **Gallery:** 140 ms opacity crossfade; no zoom or directional fly-through.
8. **Overview/close:** tray fades in 100 ms; panes restore over 260 ms; return focus after layout settles.
- Reduced motion: remove rise, stagger, shared-layout travel, scaling, ledge compression, tray transform, crossfade, and smooth scrolling; states switch instantly while focus and announcements remain.
- Keyboard-triggered selection is instant even when motion is allowed.

## Responsive and input behavior

- Below 760 px, replace the 12-column stage with one full-width active pane plus a native horizontal snap thumbnail strip; do not squeeze overlapping mini-windows.
- Hero stacks, H1 stays within 3 lines at 320 px, and masthead keeps logo plus Schedule; X/GitHub remain in Contact.
- Detail tray follows the active image in normal flow. Gallery thumbnails scroll horizontally; safe-area padding is honored.
- Touch uses native page/rail scrolling with no pointer magnetism or drag interception. Every target is at least 44 × 44 px.
- At 200% zoom the workspace becomes the mobile composition; no content or controls overlap.

## States, accessibility, and performance

- Semantic `header`, `main`, labeled `section`, `article`, `nav`, and `footer`; one H1, sequential project headings, useful shared alt text, decorative edges hidden.
- Visible focus: 3 px `#17233D` outline with 3 px `#FFFDF8` offset. Never communicate selection by edge color alone; use `aria-current`, title, and number.
- Announce focused project and Overview changes in one polite live region; do not announce raw scroll.
- Loading reserves the exact workspace geometry with solid `#E4E1D8` media blocks and no shimmer. Empty: `Projects are being prepared.` in one ruled pane.
- Image error preserves pane ratio, title/open action, and displays `Preview unavailable.` Error focus/action states remain usable.
- Preserve intrinsic media dimensions; eager-load only Good Invoice hero, lazy-load remaining thumbnails/gallery images, and decode asynchronously. No layout shift.
- Animate only transform and opacity; apply `will-change` only during reordering. Do not update React state on every pointer/scroll frame.
- Validate keyboard-only, coarse touch, 320 px, 200% zoom, reduced motion, loading/empty/error, contrast, no page-level horizontal overflow, and content before hydration.

## Exit gate

The page unmistakably contains Mo’s unchanged identity, exact bio/links, six real projects, and V2 actions; imagery dominates; one orderly pane-to-ledger interaction is memorable; mobile becomes simpler; and removing all shadows still leaves a coherent, non-OS, non-reference-copy portfolio.
