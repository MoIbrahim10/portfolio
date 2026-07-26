# 02 — Magnetic Editorial

## Core idea

A sparse editorial portfolio with one tactile horizontal wall of six image-only project posters. Scroll, drag, or use arrows to bring a poster toward an invisible center spine; select it to open a precise project drawer. The canvas never changes per project.

**Memory hook:** Six quiet posters pull toward an invisible editorial spine, and the chosen print peels forward to reveal its story.

No ambient gradients, particles, cursor followers, WebGL scenes, marquees, or decorative backgrounds. Character comes from proportion, typography, imagery, and one weighted magnetic behavior.

## Design skill

- **Skill:** `high-end-visual-design`
- **Exact skills.sh URL:** https://www.skills.sh/leonxlnx/taste-skill/high-end-visual-design
- **Status:** already installed locally; exact skills.sh page confirmed. No new installation or dependency.
- Retain its strong hierarchy, whitespace, custom easing, GPU-safe motion, and mobile simplification. Reject glass, pervasive double bezels, pill-heavy UI, and excessive entrances because this direction must remain simple.

## Reference principles

All observations are principle-level only.

- **Max Milkin** — https://www.maxmilkin.com/?ref=lapaninja  
  Minimal composition can support immersive motion when navigation and work remain clear. Transfer one authored interaction—the center pull—rather than reproducing WebGL spectacle.
- **Seba PRT** — https://www.sebaprt.com/?ref=lapaninja  
  Editorial serif/sans contrast and measured scrolling can provide identity without dense chrome. Transfer type contrast and pacing, not its exact composition.
- **Tanaya Khadke** — https://tanayakhadke.com/?ref=lapaninja  
  Visual range stays coherent when work dominates and interaction guidance is a small invitation (“tap to cycle”), not permanent UI. Show the drag hint once, then recede.
- **Trusha Neogi** — https://www.trushaneogi.com/?ref=lapaninja  
  Strong positioning followed by consistently located project context makes dense proof scannable. Keep the wall silent, but make each drawer structurally predictable.
- **Cory Grossman** — https://www.corygrossman.co/?ref=lapaninja  
  Physical-poster confidence can coexist with clear selected work and direct contact paths. Use bold editorial presence while keeping Mo’s own assets and project data primary.

### Anti-copy

- Do not reproduce Max’s WebGL scene, cursor, scattered letters, loader, palette, or project list.
- Do not reproduce Seba’s exact type pairing, spacing ratios, card treatment, scroll choreography, or page order.
- Do not reproduce Tanaya’s duplicated lettering, rolling text, cycling-card composition, menu language, colors, or illustrations.
- Do not reproduce Trusha’s spaced headings, dictionary/bucket-list modules, statistics, testimonial system, or case-study cards.
- Do not reproduce Cory’s service accordion, streetwear/surf styling, videos, archive numbering, contact copy, or typography.
- Never borrow screenshots, portraits, project art, copy, icons, motion timings, cursor assets, or code. Use only existing Glyph Spark, V2 CutCornerButton, shared project content, and supplied media.

## Visual system

### Palette

| Token | Hex | Use |
|---|---:|---|
| Canvas | `#F1EFE8` | Fixed full-page mineral paper |
| Poster | `#FCFBF7` | Card underlay and drawer |
| Carbon | `#111318` | Primary text |
| Glyph navy | `#17233D` | Logo context, focus, primary action |
| Graphite | `#696B70` | Supporting copy |
| Rule | `#D4D0C5` | Hairlines and progress |
| Solar gold | `#D99A1A` | One locator and V2 accent |
| Signal red | `#C84737` | Small press/corner tick |
| Scrim | `#111318B8` | Modal backdrop |

Gold/red cover less than roughly 5% of the initial viewport. Never tint project media.

### Dependency-free type

- Statement: `"Franklin Gothic Heavy", "Avenir Next Condensed", Impact, Haettenschweiler, sans-serif`
- UI/titles: `"Avenir Next", "Century Gothic", Futura, "Trebuchet MS", sans-serif`
- Bio/narrative: `Charter, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`
- Indices: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace`
- Statement: 72–128 px desktop, 44–60 px mobile, 0.86–0.94 line-height. Bio: 20–24 px desktop, 18–20 px mobile. Utility: 11–12 px.

### Geometry

- Max width 1560 px; inline padding 28–56 px desktop, 18–24 px mobile.
- Posters are fixed `4:3` media, 0–2 px corners, with a 2 px paper underlay (6 px active). No text overlays.
- Inactive posters are flat; active/hover shadow only: `0 18px 44px #1113181A`.
- Drawer is one uninterrupted paper plane with a vertical rule; no glass or nested cards.

## Page architecture

1. **Masthead:** unchanged linked Glyph Spark logo with existing accessible label and Solar Pulse; “Mo Ibrahim / design + code”; X, GitHub, Schedule as quiet links. Normal document flow, no hamburger.
2. **Hero:** eyebrow “Independent design engineer · Cairo”; statement “MAKE THE USEFUL / FEEL UNMISSABLE.” with one 8–10 px gold square; one V2 CutCornerButton, “Schedule a call.”
3. **Exact bio:**  
   `Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look.`
4. **Selected projects:** one horizontal poster wall, heading plus a temporary “Drag, scroll, or use arrows →” hint. Show exactly, in order: **The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, Stepper**.
5. **Active caption:** outside media, e.g. `02 / 06 — Calm AI Studio`, plus one 1 px progress rule. No dots or overlay labels.
6. **Contact:** “Available for thoughtful product collaborations.” Exact links: X https://x.com/m0code, GitHub https://github.com/MoIbrahim10, Schedule https://cal.com/mo-c0de/30min. X/GitHub are underlined text; Schedule uses V2 CutCornerButton.
7. **Footer:** small unchanged Glyph Spark; “Mo Ibrahim · Design and code with care.”; current year; “Cairo, Egypt”; “Back to top.”

## Poster wall mechanics

- Native horizontal overflow and center snap are the source of truth; preserve trackpad, touch momentum, and natural vertical page scrolling.
- Desktop cards are 420–560 px wide with 18–28 px gaps. Rail aligns left to the grid and bleeds right so the next poster remains visible.
- Alternating posters may offset vertically by at most 24 px; do not create a chaotic collage.
- Each poster is an article containing a semantic button/link named “Open [project name] project.” Click, tap, Enter, or Space opens details.
- Arrow Left/Right focuses adjacent posters and centers them; Home/End reach boundaries. Pointer scrolling updates caption/hash without stealing focus.
- In a 96 px center zone, the nearest poster may translate at most 10 px, rise 8 px, and scale to `1.012`; neighbors yield at most 6 px. No blur; rotation max 0.6°.
- Optional pointer drag must preserve native touch scroll and ordinary tap activation. Never convert vertical wheel input to horizontal.

## Detail drawer

- Desktop: right drawer, 500–600 px wide, independent scrolling, opaque scrim. Mobile: bottom sheet up to 90dvh.
- Order: index/title, shared one-line description, close control, hero image, optional gallery, optional “Collaborated with,” useful shared details, destination.
- Use shared data only. Omit absent blocks; never invent collaborators, URLs, outcomes, roles, metrics, galleries, or responsibilities.
- Gallery thumbnails are square; selection crossfades fixed-ratio media. Primary destination uses existing V2 CutCornerButton; secondary destinations are text links.
- Opening makes background inert, locks scroll without a jump, and focuses heading/close. Escape or Back closes; closing restores the triggering poster’s focus.

## Motion storyboard

Use existing Motion React only; add no GSAP, Three.js, smooth-scroll, or 3D dependency.

- **Load:** logo renders immediately; second statement line rises 12 px/fades over 440 ms; bio follows by 60 ms; wall rises 16 px/fades over 480 ms; poster stagger 35 ms, capped at 175 ms. Easing `0.22, 1, 0.36, 1`.
- **Hover/focus:** poster rises 6 px, paper separates 4 px, shadow fades over 220 ms. Focus adds a 3 px navy outline with 4 px canvas offset. Fine pointers may add only 4 px inverse image parallax.
- **Press:** scale to `0.992` for 90 ms; show a 3 px red corner tick, not a border.
- **Scroll settle:** only active and neighboring posters transform. Use an overdamped spring around stiffness 260, damping 34, mass 0.85; no bounce. Caption masks vertically by 8 px over 180 ms; progress uses `scaleX`.
- **Drawer open:** source poster lifts 10 px; scrim fades 180 ms; drawer enters 40 px from right over 380 ms; content rises 8 px with 28 ms stagger capped at 112 ms. Do not clone/fly the poster.
- **Gallery:** old image fades/translates 6 px left in 110 ms; new image enters 6 px right over 180 ms.
- **Close:** content fades 100 ms; drawer exits 24 px right over 220 ms; scrim 160 ms; then restore focus.

### Keyboard and reduced motion

- Tab order follows page order. Rail arrows/Home/End navigate; Enter/Space opens. Drawer traps Tab; gallery arrows switch media; Escape closes.
- One polite live region announces active caption and drawer title, never raw scrolling.
- With `prefers-reduced-motion`, remove hero movement, stagger, magnetism, parallax, lift, scale, masks, springs, and drawer translation. Keep at most a 100 ms opacity fade; use instant keyboard scrolling. All focus, URL, drawer, and gallery behavior remains.

## Mobile transformation

- Below 768 px: logo plus one Contact V2 button in masthead; X/GitHub stay in contact section.
- Hero becomes a compact two/three-line statement; bio is full-width; nothing clips at 320 px.
- Rail uses 84–88vw cards, 14 px gaps, center snap, and enough end padding to center first/last cards.
- Remove vertical offsets, parallax, and rotation; keep a 4 px active paper underlay.
- Drawer becomes a bottom sheet with visible 44 px close control, `4:3` media, horizontal thumbnails, safe-area padding, and internal scrolling.

## Accessibility, states, performance

- One `h1`, “Selected projects” `h2`, semantic project articles/headings, useful image alt text, and decorative underlays/rules hidden from assistive technology.
- Minimum contrast: 4.5:1 body/control, 3:1 large type. Every action is at least 44×44 px with visible focus. Dialog is correctly named/modal; background is inert.
- Loading reserves six fixed `4:3` paper frames with no shimmer. Empty says “Projects are being prepared.” Image failure keeps the frame/open action and says “Preview unavailable.” Never rely on color alone.
- First poster eager-loads; remaining media lazy-loads with intrinsic dimensions. Animate transform/opacity only; apply `will-change` only while dragging/settling.
- Use center/intersection observation instead of React state on every scroll tick; throttle fine-pointer parallax and disable it for coarse pointers/reduced motion.
- No filters, canvas, WebGL, backdrop blur, autoplay, or background effects. The rail remains meaningful before hydration and produces no layout shift.

## Acceptance

The final page contains the unchanged Glyph Spark/Solar Pulse, exact bio/links/projects, image-only native snap wall, magnetic enhancement, accessible drawer/gallery, V2 primary actions, complete keyboard/touch/reduced-motion behavior, fixed background, and no invented content or new dependency.
