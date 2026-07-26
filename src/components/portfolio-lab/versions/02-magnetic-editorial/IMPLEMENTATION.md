# 02 — Magnetic Editorial implementation

## Design skill

- **Skill:** `high-end-visual-design`
- **Exact skills.sh URL:** https://www.skills.sh/leonxlnx/taste-skill/high-end-visual-design
- **Status:** reused an already-installed local skill after confirming its skills.sh listing; no installation and no dependency added.
- **Applied selectively:** strong editorial hierarchy, wide spacing, image priority, transform/opacity motion, custom easing, and mobile simplification. The art direction intentionally overrides the skill's glass, pill, double-bezel, gradient, and excessive entrance suggestions.

## System

- A fixed mineral-paper canvas pairs an oversized editorial statement with one image-only, native horizontal poster wall.
- The rail keeps browser-native wheel, trackpad, touch momentum, and center snapping. Fine-pointer dragging is a progressive enhancement.
- A narrow observed center spine selects the nearest poster without React state updates on every scroll frame. Only transforms are written during the restrained 96px magnetic zone.
- Poster selection opens an accessible right drawer on desktop and bottom sheet on mobile. Shared media can be switched through a keyboard-operable gallery.

## Accessibility and states

- Semantic header, main, project section, articles/headings, contact, footer, and named modal dialog.
- Arrow Left/Right and Home/End move between posters; Enter/Space use native button activation. Gallery arrows, Escape, browser Back, focus trap, and trigger-focus restoration are supported.
- Background content becomes inert while the drawer is open; every action is at least 44px and has a visible focus treatment.
- Reduced motion removes entrances, magnetism, lift, parallax, masking, and drawer translation while preserving state and focus behavior.
- Intrinsic image dimensions, fixed 4:3 frames, eager first media, lazy remaining media, static loading frames, exact empty copy, and visible image-error fallbacks prevent layout shift.

## Verification

- `bun run check`
- `git diff --check`
