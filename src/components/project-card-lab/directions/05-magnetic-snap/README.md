# 05 — Magnetic Snap

A fixed-neutral horizontal image rail with native scroll snapping. On fine pointers, each image follows the pointer by at most a few pixels with a critically damped Motion spring, then returns precisely to rest. Touch, keyboard, and reduced-motion paths stay native and calm.

## skills.sh

- Selected skill: **design-motion-principles**
- URL: https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles
- Install status: already present in the workspace; no second skill or package was installed.

## Interaction and access

- Several image-only project cards remain visible on desktop.
- Swipe or trackpad scroll uses native `scroll-snap`; Arrow Left/Right, Home, and End move focus without animation.
- Click, Enter, or Space opens a semantic modal side sheet with project description, gallery, collaborators, and the V2 Cut Corner project link.
- The sheet traps focus, closes with Escape or backdrop/Close, and restores focus to the originating card.
- All controls meet the 44px target minimum, include focus-visible states, preserve intrinsic media dimensions, and lazy-load non-priority images.
- Loading, empty, touch, active, responsive, and `prefers-reduced-motion` states are included.
