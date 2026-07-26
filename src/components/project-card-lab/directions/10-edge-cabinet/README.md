# 10 — Edge Cabinet

A quiet row of compact square project covers. Activating a cover gives its left
edge a brief, shallow hinge movement before a restrained project cabinet opens
from the right (or from the bottom on small screens). The canvas stays neutral
and the closed rail contains project imagery only.

## Skill

- Name: `nextjs-framer-motion-animations`
- URL: https://www.skills.sh/tristanmanchester/agent-skills/nextjs-framer-motion-animations
- Reused the existing workspace installation; no additional skill or runtime
  package was installed.

## Motion

- Motion React 12 `motion` and `AnimatePresence` animate only transforms and
  opacity.
- The selected cover rotates 9 degrees around its left edge for 170ms, then the
  side cabinet settles with a restrained easing curve.
- Keyboard activation and reduced-motion preferences use instant transitions.
- The fixed neutral background never changes.

## Interaction and accessibility

- Native horizontal overflow, mouse/trackpad/touch scrolling, and CSS snap.
- Closed cards are image-only with semantic articles, hidden headings, useful
  image alt text, and descriptive button names.
- ArrowLeft, ArrowRight, Home, and End move focus and reveal the target card.
- Native Enter/Space activation opens the cabinet; Escape closes it.
- Modal semantics, focus containment, initial focus, restoration, visible focus,
  and 44px controls are included.
- The cabinet contains title, summary, collaborators, gallery, and the optional
  V2 Cut Corner project link.
- Fixed intrinsic image dimensions and reserved aspect ratios prevent layout
  shift; offscreen media loads lazily.
- Ready, loading, and empty states are included.
