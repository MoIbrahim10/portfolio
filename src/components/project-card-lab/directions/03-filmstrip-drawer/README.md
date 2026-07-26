# Direction 03 — Filmstrip Drawer

Equal image-only frames sit almost edge-to-edge in a native horizontal
scroll-snap contact strip. Selecting a frame reveals a fixed, neutral project
drawer with its title, summary, collaborators, gallery, and V2 project link.

## Motion

- pointer and touch activation use a right-origin `clip-path` reveal
- cards lift six pixels on hover and compress subtly on press
- keyboard navigation and keyboard activation remain immediate
- reduced motion removes reveal, hover, image, and skeleton animation

## skills.sh

- Skill: `design-motion-principles`
- URL: https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles
- Install: already present in the repository; no duplicate installation or
  dependency change was made

The chosen guidance favored Jakub Krehel's quiet production polish, Jhey
Tompkins' selective clip-path experimentation, and Emil Kowalski's rule that
keyboard-initiated interactions should not animate.
