# 03 — Living Blueprint

## Intent

Build a quiet, image-first portfolio that feels assembled with architectural precision: six project sheets share one horizontal drafting rail, and opening a sheet reveals its details in a measured side drawer. “Blueprint” means construction logic, not a blue background, technical cosplay, or decorative grids.

**Memory hook:** Six project sheets click along a sunlit drafting rail; selecting one unfolds its annotated edge into a calm project drawer.

Projects remain the largest, darkest, and most colorful elements. The canvas never changes color between projects, and no ambient effect competes with their imagery.

## Design skill

- Skill: **frontend-design**
- Exact skills.sh URL: https://www.skills.sh/block/agent-skills/frontend-design
- Status: **reused; already installed locally**. Its skills.sh listing was verified before design; nothing new was installed.
- Applied principles: one memorable idea, precise minimalist execution, purposeful asymmetry, distinctive dependency-free type, and motion proportional to the restrained concept.
- Deliberately excluded: gradient meshes, custom cursors, oversized spectacle, glass cards, heavy shadows, and decoration-led reveals.

## Source observations

These are principle-level readings only. Do not reproduce any reference’s composition, assets, copy, identity, source code, or signature animation.

### Obys Experiment Space

Source: https://experiment.obys.agency/

- A sparse “Space / About” frame, binary mode language, small status/time detail, and numbered state make experimental media feel intentional.
- Transfer its controlled-viewing principle through one compact rail status; keep experimentation inside card/drawer transitions.

### Dots by GEEK PICTURES

Source: https://dots-geek.com/

- A dominant showreel, terse `01–06` index, current/total counter, and closeable viewing layer create predictable browsing around expressive media.
- Transfer the precise numeric index and single consistent open/close model, not the showreel staging.

### Yamanashi Design Project

Source: https://ydc.pref.yamanashi.jp/ydp/

- Page numbers, dimensions, material, craft, designer, and maker attribution treat products as catalog objects while imagery stays primary.
- Transfer catalog discipline—not metadata density—through sheet numbers, measured spacing, and collaborator attribution when supplied.

### GENEROSITY

Source: https://generosity.co.jp/

- A declarative opening resolves into repeated experience modules, service groupings, work proof, and practical navigation.
- Transfer its consistent module behavior: keep one interaction grammar across projects and move deeper explanation into the drawer.

### Parade Kyoto

Source: https://parade.kyoto/

- Large product photography, compact status labels, numbered sections, and paired image/text passages keep the products primary.
- Transfer small project labels and generous image scale; reserve expressive type for brief sectional punctuation.

## Explicit anti-copy rules

- Do not recreate Obys’s wording, mode switch, cursor, central animation, or unfinished-work language; do not recreate Dots’s showreel, pagination layout, play overlay, transitions, or identity.
- Do not recreate Yamanashi’s bilingual lockup, product pages, typography, metadata order, or photography.
- Do not recreate GENEROSITY’s slogan, bilingual navigation, carousel, taxonomy, or motion; do not recreate Parade’s grid, identity, labels, typography, photography, or retail structure.
- Never borrow screenshots, logos, icons, imagery, copy, 3D assets, loaders, cursor treatments, or source code.
- Use only the unchanged Glyph Spark logo and shared portfolio data/assets.

## Visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Drafting paper | `#F7F4EC` | Fixed page canvas |
| Sheet | `#FFFDF8` | Cards and drawer |
| Navy ink | `#122B3D` | Primary text and structural edges |
| Navy shadow | `#0F2636` | Pressed states and drawer scrim base |
| Graphite | `#58616A` | Body copy and secondary labels |
| Construction line | `#D8D3C7` | Hairlines, ticks, and dividers |
| Solar gold | `#D79D40` | Active index, focus support, measured highlights |
| Vermilion | `#9C1E1B` | One active corner and destructive/close emphasis |
| Scrim | `#0F2636B8` | Drawer backdrop |

Preserve every project’s shared accent value, but use it only as a 3 px sheet edge or gallery position marker. Never recolor, tint, crop unpredictably, or overlay text on project media.

### Dependency-free typography

- Display/project titles: `"Bahnschrift SemiCondensed", "Avenir Next Condensed", "Franklin Gothic Condensed", "Nimbus Sans Narrow", sans-serif`
- Bio/body: `Charter, "Bitstream Charter", "Sitka Text", "Iowan Old Style", serif`
- Labels/counts: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`

Use sentence case. Hero heading is 44–64 px desktop and 34–42 px mobile; body is 16–18 px at 1.55–1.65; labels are 11–12 px with `0.08em` tracking. Avoid oversized text that pushes projects below the first viewport.

### Construction language

- Main width: 1280 px; desktop gutters: 40–64 px; mobile gutters: 18–24 px.
- Use an 8 px spacing base with 4 px optical corrections; limit “blueprint” cues to local 1 px rules, 6–10 px steps, baseline ticks, sheet numbers, and one rail progress line.
- Cards are flat project sheets with fixed media aspect ratios, a 2 px corner radius, one stepped top-right notch, and no permanent shadow.
- The active/hovered sheet may use one soft `0 14px 38px #122B3D14` shadow. No floating panels, glow, texture, or full-page graph paper.

## Full page architecture

### 1. Header

- Place the unchanged **Glyph Spark logo** at left, linked home; do not redraw, crop, recolor, or simplify it.
- At right, use plain text links for X and GitHub plus the existing **V2 CutCornerButton** for Schedule.
- Links: X https://x.com/m0code, GitHub https://github.com/MoIbrahim10, Schedule https://cal.com/mo-c0de/30min.
- Header remains in normal flow; no large navigation bar or sticky chrome.

### 2. Hero

- Two-column desktop composition: a narrow construction label/title at left and the bio at right, aligned to the same baseline.
- Eyebrow: `03 / Living Blueprint`; heading: `Built carefully. Read clearly.`
- Show this bio exactly, without edits:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- Use one V2 CutCornerButton: `Schedule a call` → https://cal.com/mo-c0de/30min.

### 3. Project drafting rail

- Heading: `Selected work`; companion instruction: `Scroll, drag, or use arrow keys →`.
- Render all six projects, in this exact order: **The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, Stepper**.
- Keep shared title, description, image, links, gallery, collaborators, accent, and alt text unchanged; cards form one native horizontal row with image-only surfaces and number/name on a baseline below.

### 4. Contact datum

- One hairline-separated row: `Available for thoughtful product collaborations.`
- Use plain X/GitHub links and a `Schedule` V2 CutCornerButton with the exact URLs above; add no other profiles.

### 5. Footer

- Small unchanged Glyph Spark mark, `Mo Ibrahim · Design and code with care.`, current year, and `Cairo, Egypt`.
- Add one plain `Back to start` link. No oversized outro or additional showcase.

## Project presentation mechanics

- Rail uses native horizontal overflow and mandatory start snapping; card width is `clamp(300px, 42vw, 520px)` with 12–18 px gaps.
- Show one full card plus part of the next. Do not convert vertical-wheel input into horizontal movement or trap page scrolling.
- The nearest card updates `03 / 06 · Bits n Pixels` without moving focus or changing the background; each semantic button/article pair is named `Open [project title] project details`.
- Desktop drawer: fixed right sheet, 480–560 px wide. Mobile: bottom sheet, maximum 88dvh, internally scrollable.
- Drawer order: title, shared description, primary media, gallery thumbnails when present, collaborators when present, available links, close control.
- Omit empty blocks; use the existing **V2 CutCornerButton** for the primary live/repository action and quiet underlined secondary links. Opening focuses the heading/close button; Escape closes; closing restores trigger focus; the page behind is inert.
- Loading keeps exact card ratios with quiet line skeletons. Empty state is one ruled sheet reading `Projects are being prepared.` with no fake cards.

## Motion storyboard

Use the existing Motion React dependency only; add no animation library.

1. **Arrival:** logo and bio render immediately. Rail opacity moves `0 → 1` and `y: 12 → 0` over 320 ms; six sheets stagger by 24 ms, capped at 120 ms.
2. **Hover/focus:** the selected sheet rises 4 px; its stepped edge draws from left to right using transform scale over 180 ms. Image scale is capped at 1.01.
3. **Press:** sheet compresses to 0.992 for 80 ms, then releases. No tilt, bounce, magnetism, or pointer follower.
4. **Snap change:** the external number/name crossfades through a 4 px vertical mask over 160 ms; the gold progress marker scales on x, never animates width.
5. **Drawer open:** scrim fades for 140 ms; the chosen sheet edge visually continues into the drawer header; drawer moves 24 px from the right and fades over 280 ms with `cubic-bezier(0.22, 1, 0.36, 1)`.
6. **Drawer content:** title, summary, media, collaborators, and actions rise 6 px with 20 ms stagger, capped at 100 ms.
7. **Gallery:** fixed-ratio media crossfades over 160 ms. Do not fly images across the viewport.
8. **Close:** content fades in 80 ms; drawer exits 16 px over 180 ms; return focus after exit completes.

### Reduced motion and keyboard

- Under `prefers-reduced-motion: reduce`, remove transforms, stagger, smooth scrolling, crossfades, and spring behavior; use instant state changes while preserving focus.
- Tab reaches header links, rail, drawer controls, contact, and footer in DOM order.
- Within the focused rail, Arrow Right/Left moves to adjacent project, scrolls it into its native snap position, and stops at the ends; Home/End reaches first/last.
- Enter/Space opens; Escape closes; arrow navigation never changes focus while the drawer is open.

## Mobile transformation

- Stack hero title above bio; keep the logo and one Schedule button visible without a menu.
- Rail becomes full-bleed inside page gutters, with cards at `84vw` and 12 px gaps; preserve a clear next-card preview.
- Hide decorative ticks, keep project number/name, move current/total above the rail, and convert the drawer to a button-driven, Escape-capable bottom sheet.
- Gallery thumbnails become a horizontal snap strip. Every interactive target is at least 44 × 44 px.

## Accessibility and performance

- Use semantic `header`, `main`, labeled `section`, `article`, `nav`, and `footer`; maintain one logical `h1` and sequential drawer headings.
- Reuse supplied alt text and hide construction marks from assistive technology; navy/graphite on paper must meet WCAG AA, while gold/red never carry meaning alone.
- Focus-visible: 3 px navy outline with 3 px paper offset; active state also has text and `aria-current`, not color alone.
- Preserve intrinsic dimensions and fixed ratios; eager-load only the first project image, lazy-load the rest, use responsive shared assets, and never preload every gallery image.
- Animate only transform and opacity; native overflow remains the interaction source of truth.
- Drawer locks background scroll without changing scrollbar geometry, exposes dialog semantics, and respects safe-area insets.
- Validate keyboard, touch, 320 px width, 200% zoom, reduced motion, loading, empty, broken-image fallback, and no horizontal page overflow outside the rail.
