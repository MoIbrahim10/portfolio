# 10 — Quiet Monument implementation

## skills.sh

- Skill: **design-taste-frontend**
- Exact URL: https://www.skills.sh/leonxlnx/taste-skill/design-taste-frontend
- Status: **searched; not installed**. The art-direction research found the
  relevant skill before implementation; no dependency or duplicate skill was
  added.
- Applied principle: commit to one memorable move with deliberately low visual
  density, keeping project imagery—not interface ornament—as the page’s focus.

## Interaction

- Six semantic project articles form a vertical museum wall. Their alternating
  widths create a measured viewing rhythm without horizontal scrolling.
- A slim sticky index jumps keyboard and pointer users to each project window.
- Selecting a window expands a calm full-width exhibit directly in document
  flow; it is not a rail, drawer, dialog, modal, or background transition.
- Motion React animates only small transforms, opacity, and layout continuity.
  Reduced-motion users receive immediate navigation and short opacity changes.
- Native buttons provide Enter/Space activation. Arrow keys move vertically,
  Home/End move to the first/last work, and Escape closes the exhibit and
  restores focus to its project window.

## Content, states, and access

- The page reuses the unchanged AnimatedLogo, Solar Pulse behavior, shared exact
  biography, project order, media, links, collaborator data, and V2 Cut Corner
  buttons.
- Inline exhibits render only supplied secondary gallery media, collaborators,
  live links, and repository links; absent fields are omitted.
- Every target is at least 44 px with a visible focus outline. The DOM has one
  H1, labeled semantic sections, six articles, natural heading order, and useful
  shared alt text.
- Intrinsic dimensions and reserved aspect ratios prevent layout shift. Only the
  first hero is eager; remaining imagery is lazy and decoded asynchronously.
- Quiet solid skeletons preserve layout, image failures retain the project title
  and action, and the data-empty state reads `Projects are being prepared.`
- The layout collapses to a single measured column at 900 px and remains
  operable without page-level horizontal overflow at 320 px.
