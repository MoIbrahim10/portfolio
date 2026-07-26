# 01 — Layout Morph

A quiet, image-only horizontal rail. The selected card uses Motion React shared
layout geometry to become the media surface of a centered project sheet. The
sheet then reveals only the useful details: name, description, collaborators,
gallery, and an optional V2 Cut Corner project link.

## Motion

- `LayoutGroup` and a per-project `layoutId` create the card-to-sheet morph.
- `AnimatePresence` fades the modal layer without competing with the shared image.
- Pointer activation uses one restrained spring; keyboard activation and
  `prefers-reduced-motion` use instant spatial changes.
- Escape closes, focus is contained inside the sheet, and focus returns to the
  activating card.

## Skill

- **Name:** `nextjs-framer-motion-animations`
- **URL:** https://www.skills.sh/tristanmanchester/agent-skills/nextjs-framer-motion-animations

Searched and installed from skills.sh before design. No other skill source was
used for this direction.
