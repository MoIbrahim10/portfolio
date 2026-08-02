# 11 — Responsive, Cross-Browser, Touch, Keyboard, and Motion QA

Audit date: 2026-07-29 (Africa/Cairo)
Repository: `/Users/mo/Documents/porfolio`
Candidate artifact: existing `dist/` only; no build was run
Production: `https://m0code.com/` and `https://m0code.com/video-player-lab`

## Scope, Method, and Browser Matrix

Success criteria were: test both routes at 320, 360/390, 768, 1024, and 1440+ CSS pixels; portrait/landscape; 200% zoom/reflow; touch, mouse, keyboard, and hover modes; modal/video/rail behavior; reduced motion; forced colors; and at least Chromium, while never reporting an unexecuted check as a pass.

Read-only work performed:

- Inspected route, component, CSS, and generated `dist/client` artifacts with line-numbered source reads and targeted string searches.
- Requested the mandated browser-control runtime for `https://m0code.com/`; setup succeeded, but browser discovery returned `No browser is available` and the one permitted availability check returned `[]`.
- Per the browser-control instructions, no standalone Playwright or unrelated browser backend was substituted.
- Issued read-only HTTPS GETs. On 2026-07-29 at 15:28:39 GMT, both routes returned HTTP/2 `200`.
- Compared asset identities. Production uses `routes-DAvGpumd.js`, `routes-BvKEGjiQ.css`, and `video-player-lab-uyNDetyZ.js`; the existing candidate uses `routes-BXeiZRtJ.js`, `routes-DKGiQ1HX.css`, and `video-player-lab-D-qZHfvZ.js`. Production and candidate therefore drift, although the specific reduced-motion, swipe, and touch-action patterns below are present in both relevant bundles.
- Reviewed pre-existing `.playwright-mcp/page-2026-07-29T14-*.yml` accessibility snapshots only as collateral evidence of rendered controls and semantics. Their viewport/browser settings are unknown, so they are not counted as this audit's browser executions or responsive passes.

| Browser/surface | Production | Candidate `dist/` | Result |
|---|---:|---:|---|
| Mandated browser-control backend | Attempted | Attempted | No backend available; not tested |
| Chromium | HTTP/source only | Source/bundle only | Interactive and visual QA not tested |
| Safari/WebKit | No automation available through mandated surface | Same | Not tested; no cross-browser pass claimed |
| Firefox/Gecko | No automation available through mandated surface | Same | Not tested; no cross-browser pass claimed |
| JavaScript-disabled browser | No backend | No backend | Not tested |

## Viewport, Input, and Motion Coverage Matrix

| Mode | `/` | `/video-player-lab` | Evidence level |
|---|---|---|---|
| 320 CSS px portrait | Mobile rules at `max-width: 768px` and `620px` inspected | Mobile rules at `max-width: 760px` inspected | Static only; visual/interaction untested |
| 360/390 CSS px portrait | Same | Same | Static only; visual/interaction untested |
| 768 CSS px | CSS and JS both use inclusive `max-width: 768px` | Mobile player layout applies at `<=760px`, so 768 uses desktop header/player rules | Static only; 768 boundary untested |
| 1024 CSS px | Two-panel/nested-scroll mode inspected | Desktop grid/player rules inspected | Static only |
| 1440+ CSS px | Clamp/max-width behavior inspected | `78rem` content cap inspected | Static only |
| Phone landscape (812–932 CSS px typical) | Desktop two-panel mode inferred from width-only breakpoint | Desktop mode inferred above 760px | Risk identified; not rendered |
| 200% zoom/reflow | Breakpoint response inferred from CSS-pixel viewport | Same | Not tested in browser |
| Touch/coarse pointer | `touch-action`, 44px targets, mobile dot hiding inspected | `(hover: none)` control fallback inspected | Static only |
| Mouse/trackpad | Nested x/y scrolling and hover rules inspected | Hover controls inspected | Static only |
| Keyboard-only | Rail, dot, dialog, range, and tab handlers inspected | Tablist, play, range, and back link inspected | Static only |
| Reduced motion | Motion hooks/config and CSS inspected | CSS inspected; autoplay defect confirmed | Static/bundle evidence |
| Forced colors/high contrast | Limited forced-color rules inspected | No route-specific forced-color rules found | Not rendered |
| Orientation resize | `ResizeObserver` and media-query listener inspected | CSS-only reflow inspected | Not executed |

## Confirmed Issues

### RESP-11-001 — `P2 medium` — Reduced-motion users still receive an auto-playing looping video

- **Affected:** `/video-player-lab`; `src/components/video-player-lab/VideoPlayerLab.tsx:127-148`; `src/components/video-player-lab/VideoPlayerLab.module.css:613-629`; candidate `dist/client/assets/video-player-lab-D-qZHfvZ.js`; production `video-player-lab-uyNDetyZ.js`.
- **Evidence:** The `<video>` is unconditionally `autoPlay` and `loop`. The reduced-motion CSS removes transitions/animations but cannot stop HTML media playback. Both production and candidate bundles contain `autoPlay:!0`; neither production JS nor source has a reduced-motion media query around playback.
- **Reproduction:** Enable “Reduce motion” at OS/browser level; fresh-load `/video-player-lab`; do not interact; observe the Orgo video begin and loop. Confirm computed `prefers-reduced-motion: reduce` while `video.paused === false`.
- **Impact:** Users who explicitly request less motion still receive continuous motion on entry, potentially causing discomfort and undermining platform preference support.
- **Likely root cause:** Reduced motion was handled only in CSS; media lifecycle logic does not read the preference.
- **Recommended improvement:** Default the video to paused when reduced motion is active, keep the poster visible, and permit explicit user-initiated playback.
- **Safer alternatives/tradeoffs:** Pause on reduced motion only (least behavioral change); or never autoplay for any user (strongest control and efficiency, larger presentation change). Merely removing progress animation does not address the moving video.
- **Estimated effort:** Small (1–3 hours including tests).
- **Dependencies:** Product decision on autoplay policy; a browser test able to emulate reduced motion.
- **Objective verification:** With reduced motion, fresh and repeat visits show `video.paused === true` until Play is activated; with no preference, approved autoplay behavior remains; test both mobile and desktop.

### RESP-11-002 — `P2 medium` — Mobile-only navigation cue instructs the opposite swipe gesture

- **Affected:** `/`; `CrossAxisProjectRail` at `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:1393-1398`; mobile dot visibility at `src/components/v14-exploration-lab/CrossAxisProjectRail.module.css:1726-1733`.
- **Evidence:** The next project is at increasing horizontal `scrollLeft` (`:1648-1664`), which a direct-touch carousel reaches by swiping the content left. The UI says “Swipe right for the next project.” At widths `<=620px`, project dots are `display: none`, increasing reliance on this cue.
- **Reproduction:** At 320, 360, or 390 CSS px on the first Orgo story, scroll to the end cue; follow “Swipe right”; the rail remains at the first item/overscrolls backward. Swipe left to reach the next item.
- **Impact:** Mobile users can conclude that only one case study exists or that the rail is broken; selected work beyond Orgo becomes less discoverable.
- **Likely root cause:** Copy describes the destination’s position rather than the finger gesture.
- **Recommended improvement:** Use “Swipe left for the next project,” or direction-neutral “Swipe to explore the next project.”
- **Safer alternatives/tradeoffs:** Keep compact project dots visible on small screens (more persistent affordance, more header density); add explicit Previous/Next buttons (clearest, larger UI change).
- **Estimated effort:** Extra small (under 1 hour) plus device verification.
- **Dependencies:** Copy/design approval.
- **Objective verification:** On 320/360/390 portrait and landscape, the displayed instruction matches the gesture that advances from every non-final story; the final story shows only its end state.

### RESP-11-003 — `P2 medium` — Horizontal touch swiping is blocked over the story surface above 768px

- **Affected:** `/`; `src/components/v14-exploration-lab/CrossAxisProjectRail.module.css:199-209` and `:237-249`; interaction label at `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:1787-1794`.
- **Evidence:** The outer horizontal viewport permits `pan-x pan-y pinch-zoom`, but its full-size `.verticalStory` descendant narrows `touch-action` to `pan-y`. Touch-action permissions are intersected along the hit-test ancestry, so a horizontal gesture beginning on story content is not handed to the horizontal scroller. The permissive override applies only at `<=768px` (`:1676-1681`). Production and candidate CSS contain the same rule set.
- **Reproduction:** On a touch-capable device at 769–1024+ CSS px, begin a horizontal swipe over a card or story background, not the 10px rail; the project should not advance despite the region label “Swipe or scroll horizontally.” Project dots remain an alternate input.
- **Impact:** Hybrid laptops, large tablets, and landscape phones receive an advertised gesture that does not work over most of the rail surface.
- **Likely root cause:** Nested horizontal/vertical scroll arbitration was constrained for the inner scroller without preserving horizontal panning for the ancestor.
- **Recommended improvement:** Validate a `pan-x pan-y`/`auto` strategy for the active story so dominant-axis gestures route to the correct native scroller without introducing diagonal jitter.
- **Safer alternatives/tradeoffs:** Retain `pan-y` but remove the swipe promise and provide explicit Previous/Next controls; this is more predictable but sacrifices direct manipulation.
- **Estimated effort:** Medium (0.5–1 day including physical touch testing).
- **Dependencies:** Real Chromium, Safari, and Firefox touch devices or reliable touch automation; regression checks for vertical scrolling and pinch zoom.
- **Objective verification:** At 769, 1024, and a landscape phone width, horizontal swipes starting on media, captions, and whitespace advance exactly one story; vertical swipes still scroll the story; pinch zoom remains enabled; no accidental page navigation occurs.

### RESP-11-004 — `P2 medium` — Keyboard project-dot activation can strand focus inside a newly inert slide

- **Affected:** `/`; dot activation `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:553-579`; active/inert slide state `:1343-1360`; navigation paths `:1648-1665` and `:1732-1746`.
- **Evidence:** Keyboard activation of a dot calls `goTo(index, 'keyboard')`. That updates the active slide and makes the invoking slide `inert`, but `goTo` does not transfer focus. The ArrowLeft/ArrowRight path explicitly focuses the destination story at `:1744-1745`, demonstrating that focus transfer is otherwise required. The dot path lacks it.
- **Reproduction:** At 769px+, Tab to an Orgo project dot; press Space/Enter on another project; inspect `document.activeElement` and continue Tab/Shift+Tab. Expected: focus moves into or to a stable control in the selected story. Current source can leave focus on/around the control whose ancestor just became inert.
- **Impact:** Keyboard and switch users may lose their position, restart at the document, or encounter inconsistent forward/backward focus after changing a project.
- **Likely root cause:** Pointer and keyboard activation share `goTo`, but only the region-level arrow handler performs focus management.
- **Recommended improvement:** On keyboard-origin dot selection, move focus to the destination vertical-story region or its corresponding selected control after the active/inert state commits.
- **Safer alternatives/tradeoffs:** Keep one persistent control group outside all inert slides (more structural work, most stable focus); avoid making the focused slide inert until focus moves (careful timing required).
- **Estimated effort:** Small (2–4 hours including keyboard tests).
- **Dependencies:** Browser confirmation across Chromium, Safari, and Firefox because inert/focus timing can differ.
- **Objective verification:** For every dot, Enter and Space preserve a visible focus indicator in the newly selected story; subsequent Tab/Shift+Tab order is logical; no focused element has an inert ancestor; screen-reader virtual focus follows selection.

## Risks / Unverified

### RESP-11-005 — `P2 medium` — Landscape phones likely receive a low-height desktop scroll-trap pattern

- **Affected:** `/`; `V14ExplorationLab.module.css:26-34`, `:68-74`, and `:244-283`; `CrossAxisPresentationLab.module.css:1-23`; `CrossAxisProjectRail.module.css:237-249`.
- **Evidence:** Mobile stacking is width-only at `max-width: 768px`. Common landscape phones are 812–932 CSS px wide but about 360–430px high, so they retain the two-column layout. The rail has a `44rem` minimum height and contained inner vertical scrolling; the introduction is absolutely positioned near the bottom of the left panel. This combination can put the biography/CTA below the initial landscape viewport while vertical gestures over the right half remain inside the project story.
- **Reproduction:** On 812×375, 844×390, and 932×430, fresh-load `/`; attempt to reach the biography/CTA by swiping vertically from the right panel, then from the left; inspect content visibility and scroll ownership.
- **Impact:** A phone user may see an oversized split experience, miss the primary contact CTA, or feel trapped in nested scrolling.
- **Likely root cause:** Breakpoints consider width but not short viewport height/coarse input.
- **Recommended improvement:** Add a tested short-height/landscape adaptation based on actual content and input behavior, not device names.
- **Safer alternatives/tradeoffs:** Extend stacking to a wider breakpoint (simpler, changes some tablets); or keep the split but place contact content in the first visible 100dvh and relax overscroll containment at boundaries.
- **Estimated effort:** Medium (1–2 days including design and device QA).
- **Dependencies:** Visual approval; physical iOS/Android landscape testing.
- **Objective verification:** At the three target landscape sizes, biography, CTA, and rail are reachable through obvious gestures; no panel traps page scrolling; portrait↔landscape rotation preserves the active story and scroll position.

### RESP-11-006 — `P2 medium` — Hover-gated video controls may require an undisclosed first tap on hybrid devices

- **Affected:** `/video-player-lab`; `VideoPlayerLab.module.css:217-243` and `:605-611`; `/` media viewer at `CrossAxisProjectRail.module.css:918-947` and `:1861-1867`.
- **Evidence:** Controls default to `opacity: 0; pointer-events: none` and appear on `:hover`/`:focus-within`; they are always visible only when the primary input reports `(hover: none)`. Hybrid systems can report hover capability while the user is currently touching. No tap handler on the player toggles control visibility.
- **Reproduction:** On a Windows convertible or tablet with paired mouse at 1024px+, use touch only; tap directly where the hidden Play control sits. Record whether the first tap only establishes sticky hover/reveals controls and requires a second tap.
- **Impact:** Touch users may not discover playback/seek controls, or may need two taps with no explanatory feedback.
- **Likely root cause:** Capability media query is used as a proxy for the current input modality.
- **Recommended improvement:** Make core controls persistently available or reveal them on `pointerdown` when `pointerType === 'touch'`, with a clear dismissal policy.
- **Safer alternatives/tradeoffs:** Keep them always visible (most reliable, more visual chrome); use `any-hover`/`any-pointer` only as supplemental styling, not as the sole accessibility gate.
- **Estimated effort:** Small to medium (0.5–1 day with device testing).
- **Dependencies:** Hybrid hardware or trustworthy pointer emulation.
- **Objective verification:** Mouse hover, keyboard focus, touch-only, and touch-with-mouse all expose and activate Play and seek in one intentional interaction.

### RESP-11-007 — `P2 medium` — Forced-colors project state and custom media controls are not proven distinguishable

- **Affected:** `/`; `CrossAxisProjectRail.module.css:157-197`, `:255-287`, `:656-739`, `:918-1039`; `/video-player-lab`; `VideoPlayerLab.module.css:217-339`.
- **Evidence:** Active dots, progress, and preview cues rely heavily on authored background/accent colors and clip paths. The only route-level forced-colors rule found is a border on `.stage`/`.logoDock` (`V14ExplorationLab.module.css:409-413`); `CutCornerButton` has its own fallback, but the project dots, custom scroll thumb, hidden range visuals, and video progress tracks do not.
- **Reproduction:** Enable Windows High Contrast/`forced-colors: active`; inspect selected versus unselected project dots, both video progress controls, the scrollbar thumb/track, focus rings, and modal controls on every story background.
- **Impact:** High-contrast users may lose selected-state, progress-position, or focus information even when controls remain operable.
- **Likely root cause:** Forced-color treatment covers branded buttons but not bespoke rail/media primitives.
- **Recommended improvement:** Add system-color borders/indicators and ensure active/focus state remains non-color-dependent under forced colors.
- **Safer alternatives/tradeoffs:** Use native range/scrollbar rendering in forced colors (less branded, strongest platform consistency).
- **Estimated effort:** Medium (0.5–1 day).
- **Dependencies:** Windows forced-colors test environment and accessibility review.
- **Objective verification:** In forced colors, every active/selected/focused state has a visible shape/border/text change; range position and scrollbar position remain perceptible at 200% zoom.

### RESP-11-008 — `P3 low` — Full-screen media has no explicit safe-area spacing

- **Affected:** `/` media viewer; `CrossAxisProjectRail.module.css:748-788`, `:781-788`, and `:1816-1858`; viewport meta at `src/routes/__root.tsx:14-17`.
- **Evidence:** The fixed viewer and shell use `100dvh` with fixed/clamped padding, but no `env(safe-area-inset-*)` is present. The viewport meta does not request `viewport-fit=cover`, so current browser behavior may protect the layout; installed/mobile Safari behavior could not be verified.
- **Reproduction:** Open portrait and landscape media on notched iPhones and gesture-navigation Android devices; rotate while open; inspect Close, captions, and video controls against sensor housing, rounded corners, browser bars, and home indicator.
- **Impact:** Controls or captions could sit under unsafe hardware/browser areas in edge-to-edge contexts or future installed-mode changes.
- **Likely root cause:** Dialog sizing uses dynamic viewport units without a documented safe-area policy.
- **Recommended improvement:** Define an intentional safe-area strategy and include inset-aware padding where edge-to-edge rendering is enabled.
- **Safer alternatives/tradeoffs:** Keep non-edge-to-edge viewport behavior and document it (no design expansion); enabling `viewport-fit=cover` without inset padding would increase risk.
- **Estimated effort:** Small (2–4 hours plus device checks).
- **Dependencies:** iOS/Android hardware or simulator with safe-area emulation; decision on edge-to-edge presentation.
- **Objective verification:** In all four rotations on notched/gesture devices, no interactive or textual element intersects unsafe insets and the viewer remains exactly one visible viewport tall.

## Opportunities

### RESP-11-009 — `P3 low` — Make browser Back close the full-screen media viewer before leaving the portfolio

- **Affected:** `/`; modal state at `CrossAxisProjectRail.tsx:1422-1427`, `:1748-1761`, and `:1845-1853`.
- **Evidence:** Modal open/close is React state only. No history entry, `popstate`, dialog route, or URL state is present, so browser Back follows the prior navigation instead of expressing modal dismissal.
- **Reproduction:** Navigate from another page to `/`; open a full-screen media item; press browser/Android Back. Compare with Escape and Close.
- **Impact:** Mobile users commonly use system Back to dismiss overlays and may unexpectedly leave the portfolio or lose their rail position.
- **Likely root cause:** The viewer was designed as a local modal without navigation integration.
- **Recommended improvement:** If product expectations agree, add reversible history state on open and consume one Back action to close while preserving trigger focus and scroll position.
- **Safer alternatives/tradeoffs:** Keep local state and document/test the behavior (simpler, less native on mobile); route each media item (shareable/deep-linkable, substantially more architecture).
- **Estimated effort:** Medium (0.5–1 day including history edge cases).
- **Dependencies:** Product decision; router/history tests; direct-load and multi-modal-open behavior specification.
- **Objective verification:** Back closes an open viewer exactly once, Forward can restore it only if intended, direct loads do not create phantom history, and Back without a viewer retains normal navigation.

### RESP-11-010 — `P2 medium` — Add a reproducible release matrix for viewport, input, motion, and browser behavior

- **Affected:** Both routes; repository-wide QA/release process (no current browser-test files found in the inspected project file inventory).
- **Evidence:** The implementation combines nested native scrollers, inert slides, portals, hover-gated controls, autoplay media, ResizeObserver, dynamic viewport units, and motion preferences. The mandated browser backend was unavailable during audit, leaving all visual breakpoint and cross-engine claims unresolved.
- **Reproduction:** Attempt to answer whether 320px modal controls fit, 200% zoom reflows, or Safari touch swiping works using repository automation; no scoped suite/artifacts are available.
- **Impact:** Regressions can reach production without objective evidence, especially in behaviors that code inspection cannot settle.
- **Likely root cause:** No checked-in responsive/input/motion acceptance matrix is apparent.
- **Recommended improvement:** Add read-only release tests for target widths/heights, zoom/reflow, keyboard order, touch/coarse pointer, reduced motion, forced colors, orientation resize, modal focus/Back, and current Chromium/WebKit/Firefox.
- **Safer alternatives/tradeoffs:** A documented manual device matrix is lower setup cost but less repeatable; screenshot-only tests miss focus, gesture, and media-state failures.
- **Estimated effort:** Medium to large (2–5 days for durable coverage).
- **Dependencies:** Scope-14 test/CI decisions; supported-browser policy; stable fixtures and media behavior.
- **Objective verification:** CI/manual evidence records browser/version, viewport, DPR, input features, motion/contrast settings, pass/fail assertions, screenshots, console/network errors, and production-versus-candidate identity for every release.

## False Positives

- Hidden custom video controls are not categorically keyboard-inaccessible: their descendants remain in tab order, and `:focus-within` reveals the controls. The unresolved problem is touch discoverability on hybrid input, recorded as RESP-11-006.
- The rail does not require JavaScript drag handlers for basic horizontal movement; it intentionally uses native overflow and snap. RESP-11-003 concerns the descendant `touch-action` restriction, not the absence of drag code.
- `scrollend` is not a single-point compatibility failure: the rail also settles after a 120ms scroll timer (`CrossAxisProjectRail.tsx:1714-1729`).
- Portfolio gallery videos do honor reduced motion by making `shouldPlay` false (`CrossAxisProjectRail.tsx:874-933`). RESP-11-001 is limited to `/video-player-lab`.
- Media elements have intrinsic dimensions and `object-fit`/aspect-ratio containment. No source-only claim of stretched imagery was made.

## Passed Checks

These are implementation/artifact checks, not visual cross-browser passes:

- Both production routes returned HTTP/2 `200` in fresh read-only requests.
- Homepage responsive CSS and JS share the same inclusive `768px` breakpoint, avoiding a source-level one-pixel state mismatch.
- Mobile rail rules remove nested vertical scrolling, hide the custom scrollbar, and allow both pan axes at `<=768px`.
- `ResizeObserver` plus a media-query change listener resynchronizes active mobile story height after content/viewport changes (`CrossAxisProjectRail.tsx:1468-1490`).
- Interactive project dots, social links, play controls, gallery buttons, and modal close controls meet or exceed a 44×44 CSS-pixel source target.
- The media viewer implements body scroll lock, background inerting, Escape close, a local Tab trap, autofocus, and trigger-focus restoration (`CrossAxisProjectRail.tsx:1125-1173`, `:1216-1223`, `:1845-1851`).
- Rail ArrowLeft/ArrowRight and Home/End navigation and video-lab tab Arrow navigation are implemented.
- Homepage Motion components read the user preference; keyboard-origin and reduced-motion rail transitions use instant scrolling; CSS entrance/microinteraction transitions are disabled under reduced motion.
- `/video-player-lab` makes controls persistent for primary `hover: none` environments and removes CSS progress/flicker animation under reduced motion.
- Full-screen viewer uses dynamic viewport units and bounded grid rows; media uses `object-fit: contain`; mobile hides time labels before collapsing play/seek controls.
- Source and existing `dist` were not changed or rebuilt during this audit.

## Not Tested

- Actual Chromium rendering or interaction at 320, 360, 390, 768, 1024, 1440, or 1920 CSS pixels.
- Portrait/landscape screenshots, rotation interruption, short-height layouts, safe areas, virtual keyboards, browser chrome expansion/collapse, DPR variation, or pinch zoom.
- 200% browser zoom, WCAG reflow, text-only zoom, system font scaling, or iOS Dynamic Type.
- Real touch gestures, stylus, wheel, precision trackpad, kinetic scrolling, scroll chaining, scroll snap interruption, edge swipes, pull-to-refresh, or hybrid pointer switching.
- Keyboard focus results for dot selection, every modal/media control, browser Back/Forward, tab wrap, interrupted animations, or page restoration beyond ITEM-10's ArrowRight, dialog autofocus, Escape, and trigger-focus-return checks.
- Screen-reader semantics and focus announcements in VoiceOver, NVDA, JAWS, or TalkBack.
- Reduced-motion behavior beyond ITEM-10's desktop/mobile Chromium fresh-load and inline/modal paused-state checks; animation interruption, background-tab suspension, and cross-engine autoplay-policy differences remain untested.
- Forced colors, Windows High Contrast, dark-mode overrides, contrast themes, or print.
- Safari/WebKit, Firefox/Gecko, iOS Safari, Android Chrome, Samsung Internet, or embedded/in-app browsers.
- JavaScript-disabled layout and navigation.
- Fresh/repeat/cache-disabled visual comparisons, Fast/Slow 3G rendering, offline/network failure states, media stalls, or late-loading layout changes.
- Console, hydration, and network behavior beyond ITEM-10's named critical states; memory and CPU behavior remain untested.
- Every link, button, modal, video, image, loading state, navigation path, and error state could not be exhaustively executed because the mandated browser surface exposed no browser backend.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Disposition:** lab-only `RESP-11-001` is not applicable to the deployed release. Lab portions of `RESP-11-006`, `RESP-11-007`, `RESP-11-010`, and the historical matrix are retired; homepage responsive, touch, keyboard, motion, and cross-browser findings remain open.
- **Verification:** current build has no lab CSS/JS route chunk; the retired URL returns `404`; retained player implementation/CSS/data/media hashes are unchanged and its Orgo video loaded in desktop browser QA.
- **Production evidence:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; same-release route verification and desktop retained-viewer smoke passed. This removal does not satisfy the wider device/browser matrix.

## Implementation tracking — ITEM-07

- **Status:** `Complete — verified in production` (2026-08-01) for the contrast/focus subset only.
- **Disposition:** homepage focus/state contrast and 200% text checks related to `M-C07` are complete. `RESP-11-010` and the wider real-device, touch, keyboard, cross-engine, orientation, and motion matrix remain open.
- **Verification:** production Chromium passed 390×844 and 1440×1000 with no document overflow; 200% text remained within the 390 px viewport; reduced-motion rendering remained stable; forced-colors showed solid 3 px system-highlight outlines. The Orgo modal video played, paused, and closed normally with zero console/page errors.
- **Release evidence:** merge `1db9d57008b6db30a32178fc4e83597d76074caa`, Actions run `30700858043`, Cloudflare version `a3299de6-82a2-49d7-9815-25da9fe35f8e`.

## Implementation tracking — ITEM-10

- **Status:** `RESP-11-010 partially resolved — blocking Chromium desktop/mobile matrix complete` (2026-08-01).
- **Verified subset:** Desktop Chrome and Pixel 7 emulation now gate hydration, keyboard rail selection, modal/video controls, Escape/focus return, reduced motion, media failure fallback, and both 404 routes. The public-origin matrix passed 12/12.
- **Defects fixed:** reduced-motion fresh load no longer emits mismatched SSR/client autoplay/motion attributes, and modal focus restoration no longer races inert cleanup. Normal non-reduced autoplay remains after hydration; reduced-motion media remains paused.
- **Remaining scope:** real touch swipes/devices, WebKit, Firefox, orientation, zoom/reflow, forced colors, hybrid input, browser Back, offline/throttled states, and the full breakpoint matrix remain open. Release evidence: `ebcd8b1…`, Actions `30706793536`, Cloudflare `5c861a15…`.

## Implementation tracking — ITEM-12

- **Status:** `RESP-11-002 through RESP-11-007 and RESP-11-010 resolved locally; release verification pending` (2026-08-02).
- **Fixes:** cue direction, tablet/hybrid pan-axis permission, post-commit keyboard focus, WebKit modal Tab containment, inactive-story accessibility exposure, and desktop scrollbar target size. Hybrid video controls remain visible/operable after tapping without changing their visual design.
- **Matrix:** Desktop Chromium/Firefox/WebKit, Pixel 7, iPhone 13/WebKit, and hybrid desktop touch; 320×844, 390×844, 768×1024, 844×390, 1024×768, and 1440×1000; text spacing, 200% text, reduced motion, forced colors, keyboard, touch, semantic snapshots, modal/media, and 404s.
- **Evidence:** 56/56 applicable cases passed with four documented mobile skips and no retries. The prior 42-failure production baseline independently reproduced the six fixed defects before implementation.
- **Remaining opportunities:** RESP-11-008 safe-area testing on physical notched devices and RESP-11-009 browser-history modal behavior remain open P3 items; NVDA/JAWS/TalkBack and physical-device certification are unclaimed.
