# Direction 06 — Modular Mosaic

A true variable-span mosaic: the featured project occupies an eight-column, two-row keystone; five supporting projects use distinct tall, stepped, portrait, split, and wide-banner structures. Subtle solar geometry and layered block edges reference Egyptian architectural massing while the six shared projects remain the visual focus.

## skills.sh record

- Skill: `flex-grid-flow`
- Page: https://www.skills.sh/oerlellijk/design-system-skill/flex-grid-flow
- Install command: `env NPM_CONFIG_CACHE=/tmp/mo-skills-mosaic-cache npx skills add https://github.com/oerlellijk/design-system-skill --skill flex-grid-flow --agent codex -y`

The skill informed the fluid spacing scale, logical properties, asymmetric responsive grid, explicit flow changes, adaptive states, and accessibility treatment.

## State and interaction coverage

- `ready`: exactly six shared projects, each with media, title, summary, year, role, every service, case-study CTA, and optional live-project CTA
- `loading`: a six-block variable-span skeleton with a live status and loading V2 Cut Corner control
- `empty`: a deliberate stepped-block composition with a recovery CTA
- Responsive recomposition at desktop, tablet, and phone sizes; fixed-ratio media; lazy non-featured images; keyboard focus; hover, active, and touch behavior; reduced-motion and forced-colors support
