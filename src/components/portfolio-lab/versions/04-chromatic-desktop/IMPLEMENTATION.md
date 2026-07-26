# 04 — Chromatic Desktop

## Skill record

- Skill: `ui-design`
- URL: https://www.skills.sh/mblode/agent-skills/ui-design
- Status: reused; already installed locally
- Source: skills.sh only
- Mode: Build, following the supplied Direction · Marketing/brand UI brief
- Local guidance loaded: `design-guidelines.md`, plus border radius, buttons,
  colors, copywriting, flexbox, footers, general, headers, heading groups,
  images, landing pages, navigation, responsive design, section layout,
  shadows, surfaces, and typography.

## Unique interaction

The six media panes begin as one orderly two-row workspace. Selecting any pane
moves it into the two-thirds primary position through Motion shared-layout
transforms; the other five retain DOM order and compress into a recognizable
five-step chromatic ledge. A paper detail tray opens from the selected pane
instead of becoming a viewport drawer. `Overview` restores the original
composition. Mobile deliberately replaces the desktop arrangement with one
full-width project and a native horizontal snap thumbnail rail.

## Content and accessibility

- Uses the unchanged `AnimatedLogo`, Solar Pulse behavior, shared bio, links,
  six projects, media, descriptions, collaborators, and project actions.
- Uses the existing V2 `CutCornerButton` for scheduling and live-project CTAs.
- Native buttons provide click, touch, Enter, and Space behavior.
- Arrow Left/Right and Home/End move focus without wrapping; Escape restores
  Overview and returns focus to the opening control.
- Details are inline, connected with `aria-expanded` and `aria-controls`, and
  announced through one polite live region.
- Visible 3 px focus outlines, 44 px minimum controls, reduced-motion
  substitutions, semantic page landmarks, one H1, articles, and sequential
  project headings are included.
- Media keeps intrinsic dimensions and fixed frames, eagerly loads only the
  first hero, lazily loads the rest, and provides static loading, empty, and
  image-error states without layout shift.

## Verification

- `bun run check`
- `git diff --check`
