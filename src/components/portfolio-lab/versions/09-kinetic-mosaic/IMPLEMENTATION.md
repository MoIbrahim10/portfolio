# 09 — Kinetic Mosaic implementation

## skills.sh

- Skill: **frontend-design**
- Exact URL: https://www.skills.sh/anthropics/skills/frontend-design
- Status: **searched; not installed**. A relevant local `frontend-design` skill already exists, so installing a duplicate was unnecessary.
- Applied principle: the interface commits to one visual thesis—a quiet six-image field whose measured recomposition makes selection legible while the shared work remains dominant.

## Interaction

- Six semantic project tiles share one fixed-height, 12 × 8 mosaic and retain shared-data order in the DOM.
- Selecting a tile re-tiles it into the primary region while the remaining projects form a compact contact column; `All projects` restores the composed field.
- The expanded media and `Details` control open a full-stage detail layer integrated into the mosaic, never a separate rail or right drawer.
- Arrow keys choose the nearest tile spatially; Home/End, Enter/Space, Escape, touch, and pointer input are supported.
- The detail layer traps focus, closes with Escape, restores its trigger, and makes the underlying mosaic inert.
- Reduced-motion users receive instant grid changes and short opacity-only state changes.

## Content and states

- Uses only the exact shared biography, project order, descriptions, media, links, and collaborator data.
- The full-stage detail layer renders all supplied media and only available live/repository/collaborator fields.
- Intrinsic dimensions reserve media space; only the first hero loads eagerly, while remaining images are lazy and decoded asynchronously.
- Loading, empty-project, and image-error states stay quiet and preserve access to project titles.
- The unchanged AnimatedLogo and V2 CutCornerButton are reused for the required masthead, CTAs, contact block, and footer.
