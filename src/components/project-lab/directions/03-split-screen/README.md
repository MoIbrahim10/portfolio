# 03 — Split-Screen Register

## Direction

A persistent navy project register sits beside a large, light story stage. Focus,
click, touch, or arrow keys switch the active project without losing the full six-
project index. The stepped media crop, gold datum edges, restrained red active
mark, and solar register point reinterpret the existing brand geometry while
keeping project imagery and text dominant.

## skills.sh research

- Skill: `interaction-design`
- Page: https://www.skills.sh/wshobson/agents/interaction-design
- Source: https://github.com/wshobson/agents
- Install command: `env NPM_CONFIG_CACHE=/tmp/mo-skills-split-cache npx skills add https://github.com/wshobson/agents --skill interaction-design --agent codex -y`
- Applied guidance: purposeful 140–220ms feedback, layout-preserving skeletons,
  transform/opacity transitions, progressive enhancement, and reduced-motion
  support.

No other skill was installed or used for this direction.

## Interaction and state coverage

- Ready: six-project register with complete active media, title, summary, year,
  role, services, case-study action, and optional live-project action.
- Keyboard: Tab focuses every project; Up/Down/Left/Right, Home, and End select and
  move focus. Focus selection works independently of hover.
- Touch/responsive: the split stacks into a horizontally scrollable, snap-aligned
  register above the story at narrow widths; all targets are at least 44px.
- Loading: stable split-shell skeleton with an accessible status and V2 loading
  button.
- Empty: intentional zero-project exhibition state with a V2 recovery action.
- Media: fixed 16:10 aspect ratio, intrinsic dimensions, useful shared alt text,
  eager loading only for the featured image, and lazy loading thereafter.
- Accessibility: semantic section/aside/nav/article/figure structure, live project
  announcement, visible focus, strong contrast, forced-colors fallback, and
  `prefers-reduced-motion` support.
