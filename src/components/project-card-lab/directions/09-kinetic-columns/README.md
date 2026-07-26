# 09 — Kinetic Columns

Tall, visually image-only project columns share a restrained alternating
baseline. Fine-pointer hover settles a column upright and gently uncrops its
image; keyboard focus performs the same change instantly. Activation unrolls a
two-part media/details panel vertically from the rail.

## Skill

- Name: `ui-animation`
- URL: https://www.skills.sh/mblode/agent-skills/ui-animation
- Search: searched skills.sh before implementation
- Install: reused the existing local installation; no new skill was installed

## Interaction and access

- Native horizontal touch/trackpad scrolling with mandatory snap
- Arrow Left/Right, Home, and End navigation with instant keyboard response
- Semantic image-only project articles with screen-reader names
- Click, Enter, or Space opens a modal detail panel
- Focus trap, Escape close, and opener focus restoration
- Fixed-ratio lazy gallery media and 44px controls
- Ready, loading, empty, responsive, and reduced-motion states
- Existing Motion for React and CSS only; no added dependency
