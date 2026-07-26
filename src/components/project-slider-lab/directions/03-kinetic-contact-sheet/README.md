# Kinetic Contact Sheet

Direction 03 turns the project selector into a compact square-image contact sheet. The same row acts as progress and navigation for a native horizontal scroll-snap carousel. Every project remains a semantic article with its image on the left and only its name, short description, collaborators, and optional project link on the right.

Project changes crossfade a palette-specific abstract pixel field and send one short, origin-aware ripple through the contact sheet. Keyboard changes are intentionally instant, and `prefers-reduced-motion` removes the field transition, ripple, smooth scrolling, and loading shimmer.

## Interaction coverage

- Click or focus the carousel region, then use ArrowLeft, ArrowRight, Home, or End.
- Trackpad and touch use native horizontal scrolling with mandatory snap points.
- The active square and counter synchronize after scrolling settles.
- Controls meet the 44px target minimum and include focus-visible states.
- Ready, loading/skeleton, and empty states are included without changing media geometry.

## skills.sh

- Skill: `design-motion-principles`
- URL: https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles
- Installation: the skill was already installed in the workspace, so no second copy or additional skill source was used.
