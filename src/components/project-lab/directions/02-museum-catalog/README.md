# Direction 02 — Museum Catalog

A project-first collection system: the featured project is treated as the opening accession, while five supporting projects become ruled, numbered scholarly records. The compact accession index is the distinctive browsing device; restrained stepped media frames, a solar registration dot, and navy/gold/red catalog marks reference the existing brand without competing with the work.

## skills.sh provenance

- Installed skill: `frontend-design`
- skills.sh page: https://www.skills.sh/block/agent-skills/frontend-design
- Source repository: https://github.com/block/agent-skills
- Install command: `env NPM_CONFIG_CACHE=/tmp/mo-skills-museum-cache npx skills add https://github.com/block/agent-skills --skill frontend-design --agent codex -y`

The skill was read before design work. Its direction-setting guidance led to a committed refined/editorial tone, controlled negative space, characterful serif typography, one strong browsing structure, and restrained Motion React reveals rather than scattered decoration.

## States and behavior

- `ready`: one featured accession plus every supporting project from the shared dataset
- `loading`: stable-ratio hero and five record skeletons with reduced-motion support
- `empty`: explicit collection notice and a 48px Cut Corner return action
- Keyboard: a semantic accession navigation list, visible focus, in-page anchors, and native CTA links
- Pointer/touch: hover, focus-within, active, 44px+ targets, and non-hover image-edge affordances
- Responsive: three-column records collapse to two columns and then a single reading column

All project media uses `ProjectMedia` for intrinsic dimensions, fixed 8:5 rendering, useful shared alt text, eager loading only for the featured image, and lazy loading for supporting images.
