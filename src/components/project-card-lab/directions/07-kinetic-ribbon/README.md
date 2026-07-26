# 07 — Kinetic Ribbon

A fixed-neutral, native horizontal scroll-snap ribbon. Closed project cards are
visually image-only. Scroll velocity creates a restrained shared lean that
settles through a Motion spring; selecting a project opens a wide bottom drawer
with gallery media, description, collaborators, and an optional V2 Cut Corner
project link.

## skills.sh research

- Skill: `ui-animation`
- URL: https://www.skills.sh/mblode/agent-skills/ui-animation
- Install command: `npx skills add https://github.com/mblode/agent-skills --skill ui-animation`

The installed skill informed the transform-only scroll response, asymmetric
drawer timing, instant keyboard path, and reduced-motion behavior.

## Interaction contract

- Native horizontal scrolling, touch panning, and mandatory snap points
- Arrow Left/Right plus Home/End card navigation
- Click, Enter, or Space opens an accessible bottom dialog
- Escape closes; Tab and Shift+Tab remain trapped in the drawer
- Focus returns to the originating project card after close
- Ready, fixed-ratio loading skeleton, and empty states
- Lazy gallery media with intrinsic dimensions and no layout shift
