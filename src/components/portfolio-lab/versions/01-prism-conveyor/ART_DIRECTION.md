# 01 — Prism Conveyor

## Purpose

Create a visual-first portfolio that feels like a compact physical archive: six project images sit together on one tactile horizontal conveyor, and selecting one opens a calm, information-rich drawer. The canvas stays quiet; color lives in thin prismatic edges, focus states, and the work itself.

**Memory hook:** A row of project prints glides through a slim chromatic gate, then the chosen print rises and opens its story.

This direction should feel memorable without becoming busy. The project imagery is always the largest and highest-contrast content. Do not change the page background between projects, add ambient blobs, or place decorative effects behind the rail.

## Design skill

- Skill used: **high-end-visual-design**
- Exact skills.sh URL: https://www.skills.sh/leonxlnx/taste-skill/high-end-visual-design
- Status: already installed locally; its skills.sh page was confirmed before this brief. No additional skill is needed.
- Relevant principles retained: generous whitespace, non-generic typography, purposeful custom easing, transform/opacity-only motion, and disciplined mobile collapse.
- Principles intentionally rejected here: oversized cinematic type, pervasive double bezels, glass effects, and decoration-heavy entry reveals would conflict with the requested simplicity.

## Reference study

These are principle-level observations, not a request to reproduce any page, component, animation, copy, asset, or exact composition.

### Nivedha Nirmal

Source: https://www.nivedhanirmal.com/?ref=lapaninja

- Work is introduced through three compact lenses—brands, spaces, stories—before imagery carries the experience.
- A short, confident positioning statement and repeated contact invitation keep a highly visual portfolio legible and commercially clear.
- Dense image sequences work because the surrounding interface is sparse and the project pages use a consistent title, summary, year, client, and scope cadence.
- Transfer: give Prism Conveyor a tiny index and a predictable drawer hierarchy so color and motion never obscure what can be opened.

### Mike Kus

Source: https://mikekus.com/?ref=lapaninja

- Bold concept-led presentation is balanced by direct navigation and plain-spoken labels.
- A project earns visual authority through scale and a distinct voice rather than through a pile of UI controls.
- Strong declarations are followed by structured proof—principles, recognition, selected work, and a direct contact moment.
- Transfer: each project card may have a different chromatic edge, but the rail and drawer must behave identically across all six.

### Haley Park

Source: https://haleypark.design/?ref=lapaninja

- “Work projects” and “Lil projects” separate major case studies from experiments using compact taxonomy rather than visual ornament.
- Project names, disciplines, and years form a fast-scanning archive; personality appears in small phrases and footer details.
- The broad social/interest index makes the person feel multidimensional without competing with the work list.
- Transfer: keep visible metadata extremely light and let a concise footer/social row carry Mo’s personality.

### Ngan Nguyen

Source: https://www.ngan-nguyen.com/?ref=lapaninja

- The opening immediately states role and disciplines, then rapidly shifts to project title, one-line proposition, and case-study action.
- Visual work is abundant, while deeper industry, role, deliverables, narrative, and outcomes live inside closeable case-study layers.
- The page uses playful archive language and interaction instructions, but project imagery remains the proof.
- Transfer: use an image-only rail for discovery and a right-side drawer for collaborators, links, gallery, and deeper details.

### Cali Castle

Source: https://cali.so/en

- A personal introduction, compact navigation, imagery, writing, projects, and experience are arranged as a practical personal record.
- Repeated rows and small metadata produce a calm, inspectable rhythm; interaction detail adds polish without changing the core layout.
- Projects can remain compact because titles, descriptions, and destination links are consistently located.
- Transfer: the conveyor should feel as reliable as an index—native scrolling first, motion polish second.

## Explicit anti-copy rules

- Do not reproduce Nivedha Nirmal’s category naming, duplicated type treatments, image sequencing, or contact language.
- Do not reproduce Mike Kus’s brand typography, wordmarks, project compositions, studio voice, or grid proportions.
- Do not reproduce Haley Park’s section names, footer joke, project taxonomy, archive shortcuts, or type scale.
- Do not reproduce Ngan Nguyen’s greeting, left/right archive conceit, case-study copy, card composition, or biography statistics.
- Do not reproduce Cali Castle’s portrait treatment, bottom navigation, experience/article rows, noise treatment, labels, or information order.
- Do not borrow screenshots, portraits, logos, icons, project art, copy, cursor behavior, or source code from any reference.
- The implementation must use this portfolio’s existing assets and shared project dataset only.

## Visual system

### Palette

Use color as a narrow edge signal, not as a background spectacle.

| Token | Hex | Use |
|---|---:|---|
| Canvas | `#F4F1EA` | Whole-page background; never changes per project |
| Paper | `#FFFDF8` | Drawer and card underlay |
| Navy ink | `#101C33` | Primary text, focus outline, Glyph Spark context |
| Muted ink | `#5F6672` | Supporting copy only |
| Hairline | `#D8D2C6` | Dividers and inactive rail guides |
| Solar gold | `#E9AC2F` | First/primary prism edge; never body text |
| Vermilion | `#D94A3A` | Second prism edge and active tick |
| Cobalt | `#2857C5` | Third prism edge and links |
| Orchid | `#9A4FBD` | Fourth project edge |
| Teal | `#178C82` | Fifth project edge |
| Coral | `#E36F57` | Sixth project edge |
| Scrim | `#101C33B8` | Drawer backdrop; white text reaches strong contrast |

Prismatic color appears only in 3–6 px card edge strips, active/focus indicators, the tiny conveyor progress line, and restrained gallery position markers. Never tint the supplied project images or cover them with gradients.

### Typography

No web-font dependency is required.

- Display and project titles: `"Avenir Next Condensed", "Avenir Next", "Gill Sans", "Segoe UI Variable Display", sans-serif`
- Body and navigation: `"Avenir Next", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif`
- Numbers and compact labels: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`

Use sentence case. Hero title: 48–72 px desktop, 36–44 px mobile, weight 600, tight but not compressed. Body: 16–18 px with 1.5–1.65 line height. Meta: 11–12 px uppercase with modest 0.08 em tracking. Avoid giant type that delays access to the projects.

### Surfaces and shape

- Main content width: 1440 px maximum; hero text column: 620 px maximum.
- Canvas padding: 32–56 px desktop, 18–24 px mobile.
- Cards: 4:3 project media with fixed intrinsic dimensions and no visible title overlay.
- Corners: 2 px on project images; the slight cut comes from the existing V2 button system, not from rounding every surface.
- The conveyor rests on one hairline. Each image has a paper underlay offset by 4 px and one project-colored edge, creating the feeling of a mounted print without a heavy shadow.
- Use only a soft `0 12px 40px` ambient shadow on the elevated active print and drawer; inactive cards remain flat.

## Page architecture

### 1. Quiet utility header

- Existing **Glyph Spark logo** at the left, unchanged and linked home.
- Compact “Selected work” label near the logo.
- X, GitHub, and Schedule as text links at the right on desktop; collapse them into a single “Contact” V2 CutCornerButton on mobile.
- No sticky full-width bar. The header lives in normal document flow with ample top breathing room.

### 2. Hero / bio

- One short eyebrow: “Design engineering · Cairo”.
- Heading: “Thoughtful products, polished to the last pixel.”
- Include this exact bio, unchanged:

  > Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.

- Place the bio in a narrow column above the rail. Use one restrained V2 CutCornerButton for “Schedule a call,” pointing to https://cal.com/mo-c0de/30min.
- A tiny “Scroll or drag →” instruction appears once beside the projects heading and disappears after the first horizontal movement.

### 3. Prism Conveyor / six projects

Order and spelling must be exact:

1. The Good Invoice
2. Calm AI Studio
3. Bits n Pixels
4. Glazed
5. Orgo
6. Stepper

Use the shared project dataset for every image, description, project URL, gallery image, and collaborator. Do not invent missing collaborators, URLs, outcomes, or responsibilities.

The visible rail contains only project imagery plus an external, minimal index: current number, project name, and total count in one line below the rail. Titles never sit over images. All six cards remain visibly part of one horizontal sequence rather than appearing as isolated hero slides.

### 4. Social and contact strip

- A single hairline-separated row after the conveyor.
- Label: “Elsewhere / available for thoughtful collaborations.”
- Exact links:
  - X — https://x.com/m0code
  - GitHub — https://github.com/MoIbrahim10
  - Schedule — https://cal.com/mo-c0de/30min
- Use plain underlined text links for X and GitHub. Use the V2 CutCornerButton only for Schedule.

### 5. Footer

- Existing Glyph Spark mark repeated at small size, unchanged.
- “Mo Ibrahim · Design and code with care.”
- Current year may be generated by the implementation, followed by “Cairo, Egypt.”
- One “Back to start” text link; no large closing slogan or decorative outro.

## Project presentation mechanics

### Conveyor

- Desktop card width: clamp between 360 and 560 px, approximately 44–52 vw. Gap: 14–20 px. Show one complete card, most of the next, and a sliver of the previous after movement.
- Native horizontal overflow is the source of truth. Use mandatory snap alignment at each card start and preserve trackpad/touch momentum.
- Do not hijack vertical page scrolling. Horizontal wheel input may be honored only when the device naturally reports horizontal intent.
- The active project is the card whose center is nearest the viewport’s conveyor center. Update the external title/index and URL hash without moving focus.
- Dragging is optional enhancement; if provided, it must preserve native scrolling, links, text selection outside the rail, and touch momentum.
- Clicking or pressing Enter/Space on a card opens its drawer. Each card’s accessible name is “Open [project name] project.”

### Chromatic gate

- A stationary 6 px marker at the rail’s leading edge contains the six palette colors in narrow stacked bands.
- As a card crosses the gate, its paper underlay rises 8 px and its own color edge expands from 3 px to 6 px. This is the defining “prism” moment.
- The image itself does not scale beyond 1.015 and never receives a color wash.
- The gate is hidden on screens below 640 px, where the active card uses a simple navy focus frame plus its color edge.

### Detail drawer

- Desktop: a 480–560 px fixed drawer enters from the right above a dim scrim. Mobile: a bottom sheet reaches no more than 88 dynamic viewport height and contains its own vertical scroll region.
- Header: project title, one-sentence shared description, and a 44 px close control.
- Body order: primary gallery image; compact gallery thumbnails when more than one image exists; “Collaborators” list only when supplied; project details from shared data; links.
- Actions: existing **V2 CutCornerButton** for “View project” or “Visit live project” when a URL exists. Use a plain text link for a secondary case study if present.
- Never render empty headings. If there is no collaborator, gallery, or link data, omit that block entirely.
- Drawer opening must focus its heading or close button; closing returns focus to the triggering card. Escape closes it. Background is inert and cannot be tabbed while open.

## Motion storyboard

Use the project’s existing Motion React dependency when available. No additional animation package is required.

### Initial load

1. Glyph Spark and hero copy appear immediately; no loading-logo sequence.
2. The conveyor fades from 0 to 1 and translates from 16 px down to rest over 420 ms.
3. Cards follow with a 35 ms stagger, capped at 175 ms total so the sixth project is never delayed meaningfully.
4. Easing: a restrained deceleration curve equivalent to `0.22, 1, 0.36, 1`.

### Hover and focus

1. Hovered card rises 6 px and its paper underlay shifts 2 px in the opposite direction over 240 ms.
2. Its project edge grows from 3 px to 6 px while the external index switches title in 180 ms.
3. Focus-visible uses a 3 px navy outline with a 3 px canvas offset; it also performs the same rise without depending on hover.
4. Active press compresses the card to 0.992 for 90 ms, then releases. No tilt, wobble, cursor follower, or continuous floating animation.

### Conveyor movement

1. Cards move only through native scroll position.
2. As the nearest card enters the center band, the previous card settles down 8 px while the new card rises 8 px; use a critically damped spring with no visible bounce.
3. The active index swaps using a 6 px vertical mask: old text exits upward, new text enters from below in 180–220 ms.
4. The thin progress line scales from its left origin; never animate its width.

### Drawer open

1. Scrim fades in over 180 ms.
2. The chosen card’s paper underlay briefly flashes its project edge at the rail; do not clone or fly the full image across the page.
3. Drawer translates from 32 px right to rest and fades in over 360 ms using the same deceleration curve.
4. Drawer title, summary, gallery, collaborators, and actions rise 8 px in a 30 ms stagger, capped at 150 ms.
5. Gallery thumbnail selection crossfades the media in 180 ms; retain fixed aspect ratio so no layout shift occurs.

### Drawer close

1. Content fades without stagger in 100 ms.
2. Drawer exits 20 px right over 220 ms; scrim follows over 160 ms.
3. The triggering card receives focus only after the exit completes.

### Keyboard path

- Tab enters the first visible project card; arrow right/left moves focus to adjacent cards and scrolls them into the snap position.
- Home focuses the first project; End focuses the sixth.
- Enter or Space opens the focused project.
- Inside the drawer, Tab remains trapped within meaningful controls; Escape closes and restores card focus.
- The active index must update for keyboard navigation exactly as it does for pointer or touch navigation.

### Reduced motion

- Respect `prefers-reduced-motion`.
- Remove stagger, spring, card rise, press scale, masked text movement, and drawer translation.
- Keep only a 100 ms opacity transition for the scrim and drawer; native scroll should jump to the requested snap position rather than animate.
- Focus changes, active index, URL hash, drawer state, and focus restoration must remain fully functional.

## Loading, empty, and error states

- Loading: preserve six fixed-ratio paper frames in the conveyor. Use a static warm-gray fill and one non-animated navy hairline; no shimmer under reduced motion and preferably no shimmer at all.
- Image loading: retain intrinsic dimensions and a dominant neutral placeholder so card positions never change.
- Empty: replace the rail with one quiet paper panel reading “Projects are being prepared.” Keep the contact row and Schedule action visible.
- Image error: show the project name and “Preview unavailable” inside the same fixed-ratio frame; the card must still open its drawer.
- Drawer content loading: keep drawer dimensions stable and use two or three static skeleton bars, not a spinner.

## Mobile transformation

- Header becomes logo plus one Contact V2 CutCornerButton.
- Hero remains left aligned with no forced full-screen height.
- Conveyor goes edge-to-edge beyond the page padding, while each card is approximately 84 vw and the gap is 10–12 px.
- Preserve horizontal native scrolling, scroll snap, visible next-card cue, and 44 px minimum card/button targets.
- Hide the chromatic gate; retain each card’s colored lower edge and external title/index.
- Drawer becomes a bottom sheet with a visible drag handle as affordance, but closing must never require a drag gesture. Close button and Escape remain available.
- Gallery thumbnails form a horizontal snap row within the sheet; drawer text remains vertical.
- At 320 px width, no title, CTA, link, or collaborator name may overflow; long URLs use human-readable labels.
- Avoid viewport-locked sections. Use dynamic viewport units only for the bottom sheet maximum height.

## Accessibility requirements

- Use a semantic page header, main, projects section, six project articles, social navigation, and footer.
- Projects heading precedes the rail; each article has a programmatic project heading even when the visible title lives below the rail.
- Every project image has useful alt text from shared data; decorative paper layers and prism edges are hidden from assistive technology.
- All interactive targets are at least 44 × 44 px. Hover never reveals essential information unavailable to focus/touch.
- Navy on Canvas and Navy on Paper are primary text combinations. Muted ink is restricted to large supporting text; never place text in Solar gold, Vermilion, Orchid, Teal, or Coral on Canvas.
- Provide a visible skip link. Maintain logical DOM and tab order independent of visual card offsets.
- Drawer uses dialog semantics, a clear accessible name, modal behavior, focus containment, Escape handling, and trigger focus restoration.
- Announce the current project index politely only after deliberate keyboard/button navigation; do not create repetitive announcements during free scrolling.

## Performance requirements

- Use existing local project assets and the shared project dataset. Do not fetch reference-site media.
- Render images with intrinsic width/height or aspect ratio, responsive source sizes, lazy loading after the first likely-visible cards, and asynchronous decoding.
- Preload only the first visible project image. When the drawer opens, load its first gallery image before off-screen gallery media.
- Animate only transform and opacity. The progress line uses scale; the prism edge uses an existing layer rather than layout-changing dimensions.
- Do not run a permanent animation loop, custom canvas, WebGL, Three.js, GSAP, cursor follower, or scroll listener for this direction. Native scrolling plus Motion React is sufficient and materially lighter.
- Use IntersectionObserver or a low-frequency scroll-end strategy to determine the nearest card; avoid per-frame React state updates.
- Lock body scroll only while the drawer is open, preserve the scrollbar gutter, and clean up observers/listeners on unmount.
- Target zero cumulative layout shift, smooth native touch scrolling, and no motion work when the rail or drawer is off screen.

## Implementation acceptance criteria

- The page reads as one quiet portfolio, not an animation demo.
- All six named projects are visible in one horizontal conveyor and use shared content/assets.
- Project cards are image-first and do not contain overlaid metadata.
- Every card opens an accessible drawer with only the available description, gallery, collaborator, and link data.
- The background remains `#F4F1EA` for every project and state.
- Glyph Spark remains unchanged; project/contact primary actions use the existing V2 CutCornerButton.
- Pointer, keyboard, touch, and reduced-motion paths are equally complete.
- The chromatic gate and slim project edges create the memorable identity without competing with the work.
