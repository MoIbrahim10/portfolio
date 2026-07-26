# 04 — Minimal Coverflow

Several image-only cards remain visible in a neutral horizontal rail. Their
position within the viewport creates a restrained perspective cue: the centered
card is full scale while neighboring cards turn by at most five degrees and
recede slightly. Opening a project reveals a simple right-side detail sheet.

## Skill research

- Skill: `ui-animation`
- URL: https://www.skills.sh/mblode/agent-skills/ui-animation
- Install: not repeated; the same skills.sh skill was already available in this
  workspace, so no second copy or new dependency was added.

## Motion

- `useScroll` and `useTransform` link card depth to native horizontal scrolling.
- The pointer-opened sheet uses a 280ms iOS-like move curve.
- Keyboard activation and reduced-motion preferences use instant state changes.
- Only transforms and opacity animate; the background never reacts to projects.

## Interaction

- Native horizontal scroll snap works with touch and trackpads.
- Arrow keys, Home, and End move focus between cards without animation.
- The drawer traps focus, closes with Escape or the backdrop, and restores focus.
- Ready, loading, and empty states preserve the rail's media geometry.
