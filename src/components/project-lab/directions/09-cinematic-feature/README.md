# Direction 09 — Cinematic Feature

## Direction

A selected project fills a fixed 16:10 feature stage, with its title, sequence,
year, and role layered as restrained opening credits. Its synopsis, services,
facts, case-study action, and optional live link sit immediately below. The full
six-frame programme remains visible beneath the feature, so the other five works
stay discoverable and can become the complete active project without leaving the
page.

## skills.sh provenance

- Installed skill: `design-motion-principles`
- skills.sh page: https://skills.sh/kylezantos/design-motion-principles
- Source repository: https://github.com/kylezantos/design-motion-principles
- Exact install command: `env NPM_CONFIG_CACHE=/tmp/mo-skills-cinema-cache npx skills add https://github.com/kylezantos/design-motion-principles --skill design-motion-principles --agent codex -y`

The skill, its Create workflow, motion cookbook, accessibility and creation-
gotcha guidance, performance notes, and the Jakub Krehel/Jhey Tompkins lenses
were read before design work. Primary Jakub weighting kept the scene change
quiet and production-ready; secondary Jhey weighting informed the cinematic
staging. Pointer selection gets one purposeful, interruptible scene transition;
focus and arrow-key selection are instant. Reduced-motion users also receive
instant cuts. No other skills.sh skill was installed for this direction.

## State and interaction coverage

- `ready`: all six shared projects appear in the programme and each selection
  exposes fixed-ratio media, title, summary, year, role, all services/tags,
  case-study CTA, and optional live-project CTA
- `loading`: stable header, 16:10 stage, project brief, six-frame strip, shared
  loading control, and an accessible busy/status announcement
- `empty`: intentional zero-programme message and shared V2 recovery control
- Pointer, focus, touch, and Left/Right/Up/Down/Home/End keys select projects;
  every control has a visible focus state and a target of at least 44px
- Shared `ProjectMedia` supplies useful alt text, intrinsic 1600×1000 dimensions,
  async decoding, eager initial-feature loading, and lazy supporting media
- Responsive layouts keep the stage 16:10, stack the full detail safely, and turn
  the programme into a touch-scrollable film strip without hiding any project
