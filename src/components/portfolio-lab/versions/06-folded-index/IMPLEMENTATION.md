# 06 — Folded Index

## Direction

Six image-led covers form a quiet 3 × 2 catalog index. Selecting one inserts a full-width, two-page signature directly beneath its row; gallery changes behave as restrained inner-leaf turns. On mobile, the selected cover opens into a single vertical folio.

## skills.sh record

- Skill: `frontend-design`
- Exact URL: https://www.skills.sh/block/agent-skills/frontend-design
- Status: reused; already installed locally after searching skills.sh before coding. No skill was installed.
- Applied: one memorable spatial idea, strict hierarchy, refined minimalism, implementation complexity proportional to the concept, and restrained Motion React transitions.

## Interaction and accessibility

- Semantic header, main, sections, articles, navigation, and footer with one H1.
- Roving cover focus: Left/Right, Up/Down, Home, and End; native Enter/Space opens.
- Escape and the visible close control close the inline spread, then restore scroll and trigger focus.
- Gallery thumbnails expose `aria-current`; settled open, close, and image changes use one polite live region.
- Every control is at least 44 px, focus rings remain static, and touch requires no hover or swipe.
- Intrinsic media dimensions reserve layout; only the first cover is eager, later media is lazy, and failures preserve the frame.

## Motion

- Covers arrive together over 240 ms.
- Hover/focus lifts the outer edge by 4 px with a restrained 0.6° rotation.
- A shared image identity settles into the left page while the right page unfolds from the binding.
- Gallery changes use a maximum 3° leaf tip and crossfade.
- Reduced motion removes lift, fold, shared travel, scaling, and delayed focus behavior.
