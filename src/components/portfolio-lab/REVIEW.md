# Portfolio Laboratory — Main Review

Date: 2026-07-25

Status: **10/10 accepted for comparison. No final direction selected or integrated.**

Each direction used two creator roles: an independent art-direction agent and an
independent implementation agent. No-output/stalled attempts were rejected and do
not count as completed creator work.

## Shared acceptance baseline

Every accepted implementation:

- Uses the unchanged shared project dataset and supplied imagery.
- Includes The Good Invoice, Calm AI Studio, Bits n Pixels, Glazed, Orgo, and Stepper.
- Preserves the Glyph Spark/Solar Pulse logo and existing V2 Cut Corner buttons.
- Uses the exact biography, X, GitHub, and Cal.com links.
- Presents real project media with intrinsic dimensions and reserved aspect ratios.
- Includes loading/skeleton, unavailable-image, empty, keyboard, touch, responsive,
  focus-visible, and reduced-motion behavior.
- Uses semantic page landmarks and six project articles.
- Adds no runtime dependency; Motion React is the only animation library used.

## Direction review

| # | Direction | Memorable mechanism | Duplicate-risk review | Verdict |
|---|---|---|---|---|
| 01 | Prism Conveyor | Image prints pass through a restrained chromatic gate before opening a right/bottom story drawer. | Horizontal, but uniquely staged by the gate and external index. | Accepted |
| 02 | Magnetic Editorial | Oversized editorial posters pull toward a magnetic spine and peel into detail. | More typographic and poster-like than every other rail. | Accepted |
| 03 | Living Blueprint | Stepped drafting sheets unfold a full-width inline plan. | Vertical architectural document system; no drawer or carousel. | Accepted after structural correction |
| 04 | Chromatic Desktop | One primary work pane is surrounded by a five-edge memory ledge and inline tray. | Compact workspace composition without OS-window cosplay. | Accepted after contrast correction |
| 05 | Typographic Cinema | A slim shot list cues clean widescreen cuts into an inline intermission. | Uses cinematic sequencing, not cards or a modal gallery. | Accepted after semantic/contrast correction |
| 06 | Folded Index | A calm 3×2 cover catalog opens into a living two-page spread with leaf changes. | Grid-to-book transformation is structurally unique. | Accepted |
| 07 | Orbital Studio | A compact six-node solar dial controls one native image rail and project drawer. | Rail overlap with 01 is offset by one-up framing and functional radial navigation. | Accepted after semantic correction |
| 08 | Elastic Gallery | Six contact-sheet panels redistribute width with spring-like joints before detail opens. | A single elastic composition, not a conventional carousel. | Accepted |
| 09 | Kinetic Mosaic | An unequal fixed mosaic retiles the selected work into a primary region and contact column. | Spatial recomposition is distinct from both static grids and rails. | Accepted |
| 10 | Quiet Monument | Six large vertical museum windows use a sticky index and expand inline into exhibits. | No rail, drawer, dialog, or background transition. | Accepted |

## skills.sh records

| # | Art direction | Implementation |
|---|---|---|
| 01 | [high-end-visual-design](https://www.skills.sh/leonxlnx/taste-skill/high-end-visual-design) | [high-end-visual-design](https://www.skills.sh/leonxlnx/taste-skill/high-end-visual-design) |
| 02 | [high-end-visual-design](https://www.skills.sh/leonxlnx/taste-skill/high-end-visual-design) | [high-end-visual-design](https://www.skills.sh/leonxlnx/taste-skill/high-end-visual-design) |
| 03 | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) | [design-motion-principles](https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles) |
| 04 | [ui-design](https://www.skills.sh/mblode/agent-skills/ui-design) | [ui-design](https://www.skills.sh/mblode/agent-skills/ui-design) |
| 05 | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) |
| 06 | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) |
| 07 | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) |
| 08 | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) | [frontend-design](https://www.skills.sh/block/agent-skills/frontend-design) |
| 09 | [frontend-design](https://www.skills.sh/anthropics/skills/frontend-design) | [frontend-design](https://www.skills.sh/anthropics/skills/frontend-design) |
| 10 | [design-taste-frontend](https://www.skills.sh/leonxlnx/taste-skill/design-taste-frontend) | [design-taste-frontend](https://www.skills.sh/leonxlnx/taste-skill/design-taste-frontend) |

All records state whether the skill was reused or not installed. No agent installed
more than one skill, and no non-skills.sh skill source was used for its assigned
design research.

## Verification

- `bun run check` — passed.
- `bun run build` — passed for client and SSR.
- `git diff --check` — passed.
- Browser sweep at `/portfolio-lab?v=01` through `?v=10` — passed.
- Exact biography and X/GitHub/Cal URLs in all ten — passed.
- Six project articles and project imagery in all ten — passed.
- Open/details, Escape, and focus restoration — passed per implementation.
- Page-level horizontal overflow at the review viewport — none in all ten.
- Responsive breakpoints, reduced-motion media query, and 44 px targets — present
  in all ten stylesheets.

## Selection boundary

The comparison route is the deliverable. The portfolio home and final project
presentation system remain unchanged until the user chooses finalists.
