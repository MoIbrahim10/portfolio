# 08 — Aperture Zoom

An image-only horizontal snap rail that keeps the canvas quiet. Activating a
cover shared-zooms that exact image into a wide gallery-detail dialog; project
copy follows in a short, restrained reveal.

## Skill

- Name: `nextjs-framer-motion-animations`
- URL: https://www.skills.sh/tristanmanchester/agent-skills/nextjs-framer-motion-animations
- Reused the existing workspace installation; no additional skill or package
  was installed.

## Motion

- Motion React 12 `LayoutGroup` and `layoutId` provide image continuity.
- `AnimatePresence` handles the dialog layer and focus restoration timing.
- Pointer opening uses a damped spring; keyboard and reduced-motion opening are
  instant.
- Detail copy waits for the shared image to settle, then moves only 10px.

## Interaction and accessibility

- Native horizontal scrolling, CSS scroll snap, and multiple visible covers.
- Closed cards contain only project images; accessible names and semantic
  headings remain available to assistive technology.
- ArrowLeft, ArrowRight, Home, and End move focus through the rail.
- Enter and Space open instantly; Escape closes.
- Modal semantics, focus containment, focus restoration, visible focus, and
  44px minimum controls are included.
- Fixed image dimensions, reserved aspect ratios, lazy loading, loading and
  empty states prevent layout shift.
