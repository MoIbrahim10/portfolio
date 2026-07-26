# 07 — Orbital Studio implementation

## Design skill record

- Skill: `frontend-design`
- Exact source: https://www.skills.sh/block/agent-skills/frontend-design
- Status: reused the already-installed local skill; no install or research was performed.
- Applied: one disciplined interaction, image-led hierarchy, restrained typography, and minimal motion establish the direction without decorative space motifs.

## Implementation

- Six shared projects appear in their source order in a native horizontal snap rail.
- The solar dial is an alternate, keyboard-operable map of the rail; project cards remain the dominant visual.
- The active project follows intersection state and updates the URL hash without moving focus.
- Project details use a modal drawer with trapped focus, Escape close, focus restoration, intrinsic media, gallery controls, and only supplied links or collaborators.
- Mobile converts the dial to a six-node row and the drawer to a safe-area-aware bottom sheet.
- Reduced motion preserves state changes while removing travel, rise, scaling, and drawer translation.

## Verification

- Command: `bun run check`
- Scope: TypeScript compilation for the repository.
