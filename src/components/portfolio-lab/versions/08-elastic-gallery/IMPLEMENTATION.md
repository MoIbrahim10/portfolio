# 08 — Elastic Gallery implementation

## skills.sh

- Skill: **frontend-design**
- Exact URL: https://www.skills.sh/block/agent-skills/frontend-design
- Status: **reused; already installed locally from skills.sh**. The direction brief records that skills.sh was searched before design; no additional skill was installed.
- Applied principle: the page uses refined minimalism with one authored interaction—the six-frame contact sheet flexes at its joints while imagery remains rigid and legible.

## Interaction

- A native horizontal contact sheet keeps all six projects visible as a connected sequence; the centered frame springs open and its neighbors compress.
- Scroll, touch, Left/Right, Home, and End update the settled project without moving focus unexpectedly.
- Click, Enter, or Space unfolds the selected image into a right drawer (bottom sheet on mobile).
- The modal traps focus, closes with Escape or the scrim/close control, restores trigger focus, and makes background content inert.
- Reduced-motion users receive instant layout, scroll, and drawer state changes.

## Content and states

- Uses only `PORTFOLIO_BIO`, `PORTFOLIO_LINKS`, and `PORTFOLIO_PROJECTS` in shared order.
- The drawer renders the supplied description, every supplied media item, collaborators only when present, and only available live/repository links.
- Six intrinsic-ratio frames reserve space while loading; the first hero is eager and the others lazy.
- Empty and image-error states keep the layout and project access intact.
- Glyph Spark/Solar Pulse and V2 Cut Corner controls are reused unchanged.
