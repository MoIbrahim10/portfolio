# 06 — Stacked Peel

A fixed, warm-neutral canvas with one native horizontal scroll-snap rail. Project
images overlap like a tidy stack of prints, keeping several projects visible
together without captions or decoration. Hover or focus briefly peels a card
above its neighbors; activation opens a restrained right-hand detail sheet.

## Motion

- Motion React `whileHover`, `whileFocus`, and `whileTap` animate only transform
  properties with a short, damped spring.
- CSS stacking order brings the active card above the overlapping rail.
- `AnimatePresence` combines a brief backdrop fade with a transform-based drawer
  reveal; keyboard activation and `prefers-reduced-motion` use instant changes.
- Escape closes, Tab focus stays inside the drawer, and focus returns to the
  activating project card.

## Skill

- **Name:** `interaction-design`
- **URL:** https://www.skills.sh/wshobson/agents/interaction-design

Searched on skills.sh before design and selected as this direction's only design
skill. The skills CLI found the skill already present in the workspace and could
not overwrite its protected file; the existing skills.sh installation was used.
