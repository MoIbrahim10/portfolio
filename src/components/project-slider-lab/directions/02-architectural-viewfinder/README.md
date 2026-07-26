# Architectural Viewfinder

A minimal horizontal project sequence with a fixed split composition: project media on the left, compact context on the right, and a stepped row of square image apertures for direct selection. Native horizontal scroll snap handles wheel and touch input; the active aperture remains synchronized to the nearest slide.

The background is project-responsive without competing with the work. Each selection crossfades its palette while thin datum lines, a solar disc, and a cut corner recompose through short transform/opacity transitions. Arrow keys and reduced-motion mode switch instantly.

## Skill

- Name: `design-motion-principles`
- URL: https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles
- Installation: the existing skills.sh workspace installation was reused; no additional skill was installed.

## Interaction contract

- Click or tap a square aperture to select a project.
- Focus the aperture row or project viewport and use Arrow Left, Arrow Right, Home, or End.
- Swipe or scroll horizontally; each full-width project snaps into place and updates the active aperture.
- Every aperture and text action provides at least a 44px target and a visible focus state.
- `ready`, `loading`, and `empty` states share the same architectural visual language.
