# Direction 07 — Project Dossier

## Direction

An investigative working archive rather than a card gallery. The featured project is treated as a bound case file: primary evidence fills the left page while an executive brief, labeled facts, service stamps, and actions occupy the right. Five supporting projects form a ruled evidence register using native `<details>` records, preserving familiar keyboard and touch behavior without a custom tab abstraction.

## skills.sh provenance

- Installed skill: `make-interfaces-feel-better`
- skills.sh page: https://www.skills.sh/jakubkrehel/make-interfaces-feel-better
- Source repository: https://github.com/jakubkrehel/make-interfaces-feel-better
- Exact install command: `env NPM_CONFIG_CACHE=/tmp/mo-skills-dossier-cache npx skills add https://github.com/jakubkrehel/make-interfaces-feel-better --skill make-interfaces-feel-better --agent codex -y`

The skill and its typography, surface, animation, and performance references were read before design work. Its guidance informed the 44px disclosure targets, tabular record numbers, balanced headings, pure-black inset media outlines, interruptible open-state icon transitions, exact `0.96` press feedback, restrained Motion entrances, explicit transition properties, and reduced-motion behavior. No other skill was installed or read for this direction.

## State and interaction coverage

- `ready`: all six default shared projects appear as one featured file and five dossier records; every record includes fixed-ratio media, title, summary, year, role, every service/tag, case-study CTA, and optional live-project CTA
- `loading`: stable header, featured-file, five-row register skeletons, accessible busy/status text, and the shared loading button
- `empty`: an intentional zero-file seal, explanatory heading, and conversation CTA
- Keyboard/touch: native summary toggling with visible focus, 44px disclosure/action targets, generous row hit areas, and no hover-only content
- Accessibility/performance: semantic section/article/heading/figure/dl structures, useful shared media alt text, eager featured media, lazy supporting media, intrinsic image dimensions, fixed aspect ratios, strong contrast, forced-colors support, and reduced-motion handling
- Responsive: the bound spread stacks without changing reading order; register metadata simplifies and expanded records become media-first single-column files on smaller screens
