# 07 — Orbital Studio

## Intent

Present Mo’s work as a quiet studio index in which six project images form one horizontal field and a small solar dial provides orientation.

**Memory hook:** Six pieces of work orbit one precise sun, while the images—not the instrument—remain the center of gravity.

The page is warm, editorial, and exact rather than “space themed.” Solar geometry is useful navigation: one small ring, six reachable nodes, and a progress ray. There are no stars, galaxies, ambient blobs, background changes, WebGL scenes, or ornamental orbits.

## Design skill

- Skill: **frontend-design**
- Exact skills.sh URL: https://www.skills.sh/block/agent-skills/frontend-design
- Status: already installed locally from skills.sh; its source and local lock entry were verified, so no new skill was installed.
- Applied principle: a memorable direction can come from one disciplined interaction, unusual composition, and precise typography rather than visual volume.
- Deliberately rejected: decorative texture, maximal motion, display-type excess, and effects that compete with project imagery.

## Reference observations

These are principle-level observations from the live references; nothing below licenses copying.

### [Dots. by GEEK PICTURES](https://dots-geek.com/)

- A numbered `01–06` sequence makes a media-first reel immediately legible.
- Sparse chrome lets one visual carry nearly all the attention, while a current/total counter provides pacing without explanatory copy.
- Transfer: use a six-position index and media-led rhythm, but expose all work in a native horizontal rail rather than a full-screen reel.

### [Obys Experiment Space](https://experiment.obys.agency/)

- The archive treats experiments as numbered, navigable material rather than conventional cards.
- Horizontal streams and persistent numbers create orientation; its strong conceptual frame works because the archive stays systematic.
- Transfer: make the orbital dial an alternate map of the same six-card rail; unlike the reference, the experience must remain complete on mobile.

### [GENEROSITY](https://generosity.co.jp/)

- One direct statement establishes the studio before image sequences explain its work.
- Repeated “next” cues and modular sections move long-form content while works, capabilities, contact, and company content retain distinct hierarchy.
- Transfer: keep Mo’s hero concise and follow the rail with clearly separated biography and contact—not extra project decoration.

### [Yamanashi Design Project](https://ydc.pref.yamanashi.jp/ydp/)

- Product imagery is treated like catalog evidence, supported by disciplined page numbers and compact metadata.
- Consistent structure unifies different objects; cultural identity comes through proportion, restraint, and craft rather than themed illustration.
- Transfer: give every project the same image frame and drawer anatomy while allowing each image to retain its own character.

### [Osmo](https://www.osmo.supply/)

- Interaction names such as flick cards, radial cards, and directional hover explain behavior before spectacle.
- Drag cues, precise easings, and clear labels make experimental motion usable; the strongest effects demonstrate one idea at a time.
- Transfer: combine native snap scrolling with a small radial selector, using Motion React only for state transitions and feedback.

## Anti-copy rules

- Do not reuse any reference’s logo, imagery, fonts, copy, iconography, cursor, source code, or signature transition.
- Do not recreate Dots’ showreel player, `[01]` counter composition, fullscreen cropping, or play/close treatment.
- Do not recreate Obys’ custom typeface, Pride mode, unfinished-work taxonomy, desktop-only limitation, or spatial composition.
- Do not recreate GENEROSITY’s slogan, bilingual duplication, carousel composition, menu, or “Next” treatment.
- Do not recreate Yamanashi’s product photography, `P.01` notation, bilingual catalog blocks, or cultural motifs.
- Do not recreate Osmo’s radial-card demo, draggable prompts, cursor effects, interface copy, easings library, or dark toolkit styling.
- Use only the existing shared portfolio data, project assets, Glyph Spark, and button system; do not synthesize replacement art.

## Visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Canvas | `#F4F0E7` | Unchanging page background |
| Paper | `#FFFDF8` | Drawer and image backing |
| Solar ink | `#12213B` | Text, outlines, logo context |
| Secondary ink | `#62645F` | Bio and project descriptions |
| Hairline | `#D7D0C3` | Rules, track, inactive orbit |
| Solar gold | `#D8A62A` | Sun, current node, V2 accent |
| Horizon red | `#C94A3A` | One active ray or urgent focus cue |
| Soft gold | `#F0DFC0` | Selected-node halo only |
| Scrim | `#12213BB8` | Detail drawer backdrop |

No project-specific background color changes. Project accent colors may appear only as a 2 px card-edge tick sourced from shared data.

### Typography

- Display: `"Bodoni 72", Didot, "Iowan Old Style", "Palatino Linotype", Georgia, serif`
- Body/UI: `"Avenir Next", Avenir, "Segoe UI", Helvetica, sans-serif`
- Index/numbers: `ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`
- No web-font request or new dependency. Hero: 46–68 px desktop, 36–44 px mobile; body: 16–18 px/1.55; labels: 11–12 px with `0.08em` tracking.
- Sentence case throughout. Never place type over project images.

### Geometry and spacing

- Content max width: 1480 px; page gutters: 28–56 px desktop, 18–24 px mobile.
- The solar dial is 112 px desktop and never exceeds 9% of the rail width; projects occupy the remaining field.
- Rail cards use each asset’s intrinsic ratio inside a consistent `4:3` frame with `object-fit: cover`.
- Corners stay 2 px; shadows are limited to the selected card and drawer.
- One hairline connects the dial to the rail like a measured ray. No additional circles or grid decoration.

## Page architecture

### 1. Header and hero

- Existing Glyph Spark logo at top left, rendered unchanged; do not redraw, mask, recolor, or animate its internals.
- Right side: plain links “X” and “GitHub,” then existing V2 `CutCornerButton` for “Schedule.”
- Eyebrow: “Mo Ibrahim · Design engineer.”
- Heading: “Products built with care, down to the last pixel.”
- Exact bio, unchanged:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- Projects must begin within the first desktop viewport; the hero may not exceed 40vh.

### 2. Orbital work index

- Heading row: “Selected work,” current project name, and `01 / 06`.
- Left: compact solar dial with six evenly spaced 44 px node buttons, each labeled accessibly with its project name.
- Right: one native horizontal snap rail showing one full card, most of the next, and a trace of the previous after movement.
- Exact order: **The Good Invoice**, **Calm AI Studio**, **Bits n Pixels**, **Glazed**, **Orgo**, **Stepper**.
- Each visible card is image-only. A project name and one-line shared description sit below the rail in a stable text slot.
- Clicking a node scrolls its card into place; scrolling updates the dial, count, name, and URL hash without moving keyboard focus.
- Clicking a card opens the project drawer; accessible name: “Open [project title] project details.”

### 3. Project drawer

- Desktop: fixed 520–600 px sheet from the right. Mobile: bottom sheet capped at 90dvh with its own scroll.
- Content order: title, shared description, primary image, gallery thumbnails when present, collaborators when non-empty, and available links.
- Use the existing V2 `CutCornerButton` for the primary live-project or repository action; secondary links are quiet underlined text.
- Never invent collaborators, case-study claims, roles, outcomes, dates, or missing URLs. Omit empty blocks.
- Escape closes; focus enters the close control and returns to the triggering card; page content becomes inert while open.

### 4. About, social, and contact

- After the rail, repeat no biography. Use a compact line: “Available for thoughtful product and interface collaborations.”
- Exact links: X — https://x.com/m0code; GitHub — https://github.com/MoIbrahim10; Schedule — https://cal.com/mo-c0de/30min using the existing V2 `CutCornerButton`.
- Links remain text-first; no social icon pack.

### 5. Footer

- Small unchanged Glyph Spark mark, “Mo Ibrahim · Cairo, Egypt,” current year, and a plain “Back to top” link; no oversized closing phrase or decorative outro.

## Motion storyboard

- Use the existing Motion React library; add no animation dependency and no Three.js/canvas.
- Entry: hero opacity and 10 px rise over 360 ms; rail follows after 70 ms. The logo and controls are immediately usable.
- Rail: native scrolling is the source of truth. The centered card settles from `0.985` to `1` and opacity `0.72` to `1` over 240 ms; neighbors remain flat.
- Dial: the active gold node moves around the fixed ring through the shortest arc in 320 ms; the ring itself never spins.
- Ray: a single line rotates from the dial center toward the active node using the same timing. It does not cross or cover the cards.
- Hover/focus: card rises 5 px and its accent tick extends by 8 px in 180 ms; press scales to `0.992` for 90 ms. No tilt or glow.
- Drawer open: scrim fades 160 ms; sheet moves 28 px to rest over 340 ms; content rises 6 px with a 25 ms stagger capped at 100 ms.
- Gallery change: fixed frame crossfades in 160 ms; never resize the drawer.
- Close: content fades 80 ms, sheet exits over 220 ms, then restore focus.

### Keyboard and reduced motion

- Tab reaches all header links, six dial nodes, six cards, and drawer actions with visible 3 px solar-ink focus.
- Arrow Left/Right on the dial or focused rail card selects and scrolls the adjacent project; Home/End go first/last; Enter/Space opens.
- Dial nodes use `aria-current`; the changing title/count is polite live text, not an interrupting announcement.
- With `prefers-reduced-motion`, remove entry movement, card scale/rise, dial travel, ray rotation, stagger, and drawer translation.
- Reduced motion keeps instantaneous state changes plus a maximum 100 ms opacity fade; native snap remains functional.

## Mobile transformation

- At 720 px and below, header wraps, hero shortens, and cards become 82–88vw with 12 px gaps.
- The dial becomes a horizontal six-node “solar phase” row above the rail; hide the ray and keep the current count/name below.
- The rail remains touch-native with `scroll-snap`, no vertical-wheel hijacking, and at least 24 px end padding.
- The bottom drawer uses safe-area padding, a sticky close control, and 44 px gallery/action targets.

## Accessibility, states, and performance

- Use semantic `header`, `main`, `section`, `article`, `nav`, `aside/dialog`, and `footer`; preserve logical heading order.
- All controls are at least 44×44 px. Text/body contrast meets WCAG AA; gold is never used for body text.
- Use shared useful alt text, intrinsic width/height, fixed aspect-ratio wrappers, first-project eager loading, and lazy loading afterward.
- Loading keeps six static fixed-ratio frames; no shimmer. Empty state says “Projects are being prepared” and keeps contact available.
- Image failure retains the frame, project title, and “Preview unavailable”; drawer access still works.
- Observe active cards with `IntersectionObserver`; schedule scroll-derived updates through animation frames and never read/write layout in a tight loop.
- Animate only transform and opacity. No video, custom cursor, canvas, blur field, autoplay, layout-shifting reveal, or background polling.
- Success means six projects are discoverable without motion, dial and rail never disagree, the drawer is fully keyboard operable, and project imagery remains the largest visual element.
