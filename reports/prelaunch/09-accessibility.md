# 09 — WCAG 2.2 AA Accessibility Audit

Audit date: 2026-07-29
Repository: `/Users/mo/Documents/porfolio` at `ae1ec7c`
Production: `https://m0code.com`
Routes: `/`, `/video-player-lab`, and `/__prelaunch-a11y-404`

## Scope and method

Success criteria for this audit were: inspect both known routes and an unknown route; review semantic structure, accessible names/roles/values, alternatives, contrast, focus, keyboard behavior, modal behavior, responsive/reflow behavior, motion preferences, touch targets, media alternatives, and failure states; distinguish source-confirmed failures from runtime risks; and make no changes outside this report.

Evidence used:

- Complete source review of route components, shared controls, media data, and all relevant CSS modules.
- Read-only inspection of the existing `dist/client` and `dist/server` artifacts. No build was run.
- Live HTTP/2 requests for all three routes, including status, server-rendered HTML, and deployed CSS. `/` and `/video-player-lab` returned `200`; the unknown route returned `404`.
- Read-only inspection of existing `.playwright-mcp` accessibility-tree snapshots as supplemental evidence only.
- Static sRGB contrast calculations using the declared colors and alpha/color-mix values.
- The current Vercel Web Interface Guidelines fetched from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` on 2026-07-29.

The in-app browser control runtime was initialized according to its documented setup, but reported `No browser is available`; the documented browser list was empty. Therefore direct live keyboard, touch, zoom, reduced-motion, forced-colors, screen-reader, and modal interaction checks could not be performed in this specialist session. No unrelated browser backend was substituted. Automated scores are not treated as WCAG conformance evidence.

Important build observation: production asset hashes (`routes-BvKEGjiQ.css`, `styles-B9P8SFFr.css`) differ from the checked-in `dist` hashes. Findings below state whether evidence applies to source/local dist, live production, or both.

## WCAG coverage matrix

| WCAG 2.2 AA area | Status | Evidence / report IDs |
|---|---|---|
| 1.1.1 Text Alternatives | Source pass; runtime partly unverified | Meaningful portfolio images have descriptive `alt`; decorative posters/icons use empty `alt`/`aria-hidden`. Video equivalence remains `09-R-02`. |
| 1.2.1–1.2.5 Time-based Media | Risk | No `<track>` or transcript is present; media content/audio relevance is unverified (`09-R-02`). |
| 1.3.1 Info and Relationships | Pass for retained routes; manual AT matrix remains open | Homepage has one H1 followed by project H2s; project selectors are labeled groups. Lab-only tab semantics were retired (`09-C-03`, `09-C-05`, ITEM-08). |
| 1.3.2 Meaningful Sequence | Source pass; manual AT unverified | DOM order is coherent; inactive stories use `inert` in source and live SSR. |
| 1.3.3 Sensory Characteristics | Source pass | Project changes expose named buttons in addition to swipe/scroll instructions. |
| 1.3.4 Orientation | Source pass; runtime unverified | No orientation lock found. |
| 1.3.5 Identify Input Purpose | Not applicable | No user-input forms. |
| 1.4.1 Use of Color | Pass for retained homepage | Active project state changes color and scale and exposes `aria-pressed`; ITEM-07 verified state contrast. |
| 1.4.3 Contrast (Minimum) | Pass for retained homepage | ITEM-07 verified every affected story/caption pair at ≥4.5:1 and retired the removed lab portion (`09-C-02`). |
| 1.4.4 Resize Text | Homepage Chromium pass; broader risk remains | ITEM-07 passed 200% text at 390×844 without page overflow; non-Chromium/system scaling remains under `09-R-04`. |
| 1.4.5 Images of Text | Pass for page UI | No essential page text rendered as an image was found; portfolio screenshots are project exhibits. |
| 1.4.10 Reflow | Fail | Video-lab tab grid is fixed to `68rem` and requires horizontal scrolling at 320 CSS px (`09-C-04`). |
| 1.4.11 Non-text Contrast | Pass for retained homepage | ITEM-07 verified selected states at ≥3.95:1 and focus indicators at ≥6.07:1 (`09-C-01`). |
| 1.4.12 Text Spacing | Risk / not tested | Fixed/absolute containers require browser validation (`09-R-04`). |
| 1.4.13 Content on Hover or Focus | Source pass; runtime unverified | Portrait and media cues are focus-triggerable/dismissible by blur; manual persistence/hover tests unavailable. |
| 2.1.1 Keyboard | Source support present; runtime unverified | Native controls, arrow handlers, scrollbar keys, dialog Escape/trap code reviewed. |
| 2.1.2 No Keyboard Trap | Source pass; runtime unverified | Dialog trap cycles and Escape closes; actual browser/AT testing unavailable. |
| 2.1.4 Character Key Shortcuts | Not applicable | No single-character shortcut found. |
| 2.2.1 Timing Adjustable | Pass | No user time limit found. |
| 2.2.2 Pause, Stop, Hide | Risk | Gallery previews loop without a local pause mechanism; duration threshold unverified (`09-R-01`). |
| 2.3.1 Three Flashes | Source pass; media unverified | CSS flicker is below the obvious 3 Hz threshold and disabled for reduced motion; MP4 content was not frame-analyzed. |
| 2.4.1 Bypass Blocks | Opportunity | No skip link; strict applicability to repeated blocks is not established (`09-O-01`). |
| 2.4.2 Page Titled | Fail on 404 | Unknown route retains “MO — Portfolio” rather than identifying the error (`09-C-06`). |
| 2.4.3 Focus Order | Source appears coherent; runtime unverified | Modal, nested regions, tabs, and custom scrollbar require live traversal. |
| 2.4.4 Link Purpose | Source pass | Links have visible purpose or explicit accessible names. |
| 2.4.5 Multiple Ways | Not assessed | Small two-route site; sitemap/search behavior belongs to SEO/functional scopes. |
| 2.4.6 Headings and Labels | Fail / concern | Homepage lacks a primary heading; 404 has no heading (`09-C-03`, `09-C-06`). |
| 2.4.7 Focus Visible | Homepage contrast pass; traversal incomplete | ITEM-07 verified surface-aware and forced-colors indicators; full keyboard/AT traversal remains separate. |
| 2.4.11 Focus Not Obscured (Minimum) | Runtime unverified | Modal, overflow regions, and clipped cards require real focus traversal. |
| 2.5.1 Pointer Gestures | Source pass | Project destinations have single-pointer buttons in addition to swipe/scroll. |
| 2.5.2 Pointer Cancellation | Runtime unverified | Drag scrollbar behavior was not manually exercised. |
| 2.5.3 Label in Name | Source pass | Visible labels are retained in accessible names for primary controls. |
| 2.5.4 Motion Actuation | Not applicable | No device-motion input found. |
| 2.5.7 Dragging Movements | Source pass | Custom scrollbar also supports arrows/Page/Home/End. |
| 2.5.8 Target Size (Minimum) | Risk | Most controls are 44–48 px; custom scrollbar is 10 px wide and spacing exception needs measurement (`09-R-03`). |
| 3.1.1 Language of Page | Pass | `<html lang="en">` in source and all live responses. |
| 3.2.1–3.2.4 Predictable | Source pass; runtime unverified | No focus-triggered navigation or unexpected context change found. |
| 3.3.1–3.3.8 Input Assistance | Mostly not applicable | No forms; silent media/asset failures are an opportunity (`09-O-02`). |
| 4.1.2 Name, Role, Value | Fail / concern | Incomplete tab/tabpanel relationship and control groups exposed as navigation (`09-C-05`). |
| 4.1.3 Status Messages | Opportunity | Loading/error and project/variant changes lack explicit status announcements (`09-O-02`). |

## Confirmed Issues

### 09-C-01 — Focus indicators and active-state graphics fail 3:1 contrast

- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original finding.
- **Severity:** P1 high
- **Affected:** `/` and `/video-player-lab`; `V14ExplorationLab.module.css:20-23`; `CutCornerButton.module.css:35`; `CrossAxisProjectRail.module.css:170-175,273-275,672-675,960-963`; `VideoPlayerLab.module.css:45-50`; same declarations are present in deployed CSS.
- **WCAG:** 1.4.11 Non-text Contrast; 2.4.7 Focus Visible; 2.4.11 Focus Not Obscured (focus appearance contrast aspect).
- **Evidence:** Gold `#d79d40` against homepage cream `#f5ead8` is **2.01:1**, video-lab beige `#f1e9d9` is **1.98:1**, and paper `#fffaf0` is **2.30:1**. Gallery focus accents against editorial-card beige are Orgo **1.98:1**, Good Invoice pink **1.44:1**, and Lumen green **1.66:1**. Selected Experiments red `#9f3732` against gold `#d79d40` is **2.87:1**. The same red/gold combination is used for the active project dot and several focus outlines.
- **Reproduction:** On `/`, press `Tab` through the home link, portrait trigger, contact controls, project controls, story regions, gallery cards, and modal controls; switch to each story and compare the focus outline with its immediate background. Repeat on `/video-player-lab`. Compute contrast of the focused pixels against the unfocused pixels.
- **Impact:** Keyboard and low-vision users can lose track of focus, especially on the primary CTA, gallery cards, video controls, and the gold Selected Experiments surface.
- **Likely root cause:** Decorative accent tokens are reused as focus/state tokens without a contrast contract for each theme/background.
- **Recommended improvement:** Introduce a dedicated focus indicator token per surface that maintains at least 3:1 against adjacent unfocused pixels and has at least a 2 CSS px perimeter-equivalent area. Validate every story/modal theme.
- **Safer alternatives / tradeoffs:** A two-color focus ring (dark inner + light outer) is more robust across media and themes but visually stronger; an inset/outset box-shadow pair avoids clipping but must remain visible in forced colors.
- **Estimated effort:** S–M, 0.5–1 day including theme verification.
- **Dependencies:** Approved focus visual treatment and a reusable contrast test matrix.
- **Objective verification:** Automated color calculations at 3:1 minimum plus screenshot comparison of every focusable element in every theme at 100%/200% zoom, forced colors, and keyboard-only traversal.
- **Current verification:** production selected indicators measure Orgo **6.50:1**, Good Invoice **3.95:1**, Lumen **9.60:1**, and Selected Experiments **6.07:1**. Story focus rings measure **6.07:1–15.94:1** and editorial gallery focus **12.01:1**. Chromium forced-colors exposes solid 3 px system-highlight outlines on project, gallery, and page controls. Full assistive-technology traversal remains outside this finding.

### 09-C-02 — Small text fails minimum contrast in both routes

- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original finding; the removed lab portion was retired under ITEM-01.
- **Severity:** P1 high
- **Affected:** `/`; `CrossAxisProjectRail.module.css:90-96,106-116,458-478,480-489,529-535,613-653`. `/video-player-lab`; `VideoPlayerLab.module.css:135-140,569-572`. Deployed CSS contains the same values.
- **WCAG:** 1.4.3 Contrast (Minimum).
- **Evidence:** Static sRGB calculations give: Good Invoice title description **4.48:1** and Selected Experiments description **4.04:1**; Good Invoice collaboration text **3.52:1**; next-story cues Good Invoice **2.70:1**, Lumen **4.34:1**, Selected Experiments **2.34:1**; Orgo caption accent on beige **1.98:1**; Orgo/Selected Experiments secondary caption labels after nested opacity approximately **2.46:1**; card collaboration text approximately **4.14:1**. On the video lab, unselected tab notes are approximately **4.14:1** and preview footer notes **3.80:1**. All are small text and require 4.5:1.
- **Reproduction:** Open each project story and the video-lab tabs. Inspect computed foreground/background colors for the cited elements and calculate WCAG relative luminance without rounding the threshold upward.
- **Impact:** Low-vision users and users on dim, bright, or low-quality displays may not be able to read project descriptions, captions, collaboration credits, navigation cues, or tab explanations.
- **Likely root cause:** Opacity/color-mix percentages were tuned visually rather than to a minimum contrast token; nested opacity further reduces already-muted text.
- **Recommended improvement:** Replace translucent text colors with tested solid/alpha tokens that provide at least 4.5:1 on every actual surface; remove nested opacity from semantic text.
- **Safer alternatives / tradeoffs:** Increase font size/weight enough to qualify as large text only where the design supports it, but changing color is more reliable and preserves hierarchy; a darker shared editorial caption token is simpler but less theme-specific.
- **Estimated effort:** M, 1–2 days including all story states.
- **Dependencies:** Final palette and visual regression coverage.
- **Objective verification:** Programmatic contrast check of each computed text/background pair plus manual checks on every story, selected/unselected tab state, and video frame label across representative frames.
- **Current verification:** all retained homepage story text measures at least **4.68:1** and all 32 rendered editorial caption pairs at least **5.07:1**. The Good Invoice collaboration text is **4.80:1** and keeps a readable foreground plus a 2 px hover underline. Production Lighthouse mobile/desktop reports pass `color-contrast` and score Accessibility 100.

### 09-C-03 — Homepage has no primary page heading

- **Severity:** P2 medium
- **Affected:** `/`; `V14ExplorationLab.tsx:327-367,371-378`; `CrossAxisProjectRail.tsx:495-520`; live and local-dist accessibility structures.
- **WCAG:** 1.3.1 Info and Relationships; 2.4.6 Headings and Labels.
- **Evidence:** The homepage contains an `article` labeled “Mo Ibrahim portfolio,” paragraphs for “Design Engineer” and the biography, then project titles as `h2`. No `h1` exists in source, live SSR, or the inspected accessibility-tree snapshots.
- **Reproduction:** Load `/` and inspect the headings list. It begins with level-2 “Orgo”; there is no heading identifying the page owner/purpose before the project headings.
- **Impact:** Screen-reader heading navigation starts without a page-level topic, making the page structure harder to understand and scan.
- **Likely root cause:** Visual identity and article labeling were treated as substitutes for document heading structure.
- **Recommended improvement:** Add one concise, visible `h1` identifying Mo and the portfolio/design-engineering purpose, then retain project names as `h2`.
- **Safer alternatives / tradeoffs:** A visually hidden `h1` minimizes layout impact but gives sighted users no corresponding visual heading; promoting the role/identity copy is semantically and visually stronger.
- **Estimated effort:** S, under 0.5 day.
- **Dependencies:** Approved heading copy and placement.
- **Objective verification:** Headings outline contains exactly one descriptive `h1`, followed by logical `h2` project headings, in SSR and hydrated DOM.

### 09-C-04 — Video-lab selector does not reflow at 320 CSS px

- **Severity:** P1 high
- **Affected:** `/video-player-lab`; `VideoPlayerLab.module.css:86-100`; live deployed CSS.
- **WCAG:** 1.4.10 Reflow.
- **Evidence:** `.variantNav` is an overflow-x scroller whose child has `min-width: 68rem`; no mobile rule removes that minimum or changes the five-column layout. At a 320 CSS px viewport (or the 1280 px viewport/400% zoom equivalence), reaching all tabs requires horizontal scrolling in addition to vertical page scrolling. A tab selector is not inherently a two-dimensional-layout exception.
- **Reproduction:** Set the viewport to 320 CSS px or zoom a 1280 px viewport to 400%. Navigate all ten variants and observe the required horizontal scroll within the tab region.
- **Impact:** Low-vision users must pan in two directions and can lose context or overlook variants.
- **Likely root cause:** The desktop film-strip visual was preserved with a fixed minimum width instead of an adaptive control layout.
- **Recommended improvement:** Reflow the tabs to one or two columns, a vertical list, or another fully visible compact selector at narrow/zoomed widths.
- **Safer alternatives / tradeoffs:** A previous/next control plus named current variant is compact but reduces overview; wrapping all tabs preserves discoverability at the cost of vertical space.
- **Estimated effort:** M, 1 day including keyboard and focus-order validation.
- **Dependencies:** Responsive interaction decision and visual QA.
- **Objective verification:** At 320 CSS px and 400% zoom, all selector content and controls are available without horizontal scrolling and without overlap/loss.

### 09-C-05 — Tab and landmark semantics misrepresent the controls

- **Severity:** P2 medium
- **Affected:** `/video-player-lab`; `VideoPlayerLab.tsx:218-262`. `/`; `CrossAxisProjectRail.tsx:553-583`.
- **WCAG:** 1.3.1 Info and Relationships; 4.1.2 Name, Role, Value.
- **Evidence:** Video variant buttons use `role="tab"` inside a `tablist`, but all point to a `<section id="active-player">` that has no `role="tabpanel"` and no `aria-labelledby` relation to the selected tab. Home project-change buttons are wrapped in `<nav aria-label="Project controls">` even though they change an in-page carousel rather than navigate to locations. The video tablist is likewise wrapped in a `<nav>` landmark.
- **Reproduction:** Inspect the accessibility tree on `/video-player-lab`: select each tab and inspect the controlled node’s role/name relationship. List landmarks on both routes and observe “Project controls” / “Video player directions” as navigation landmarks containing buttons rather than navigation links.
- **Impact:** Screen-reader users receive an incomplete tab model and misleading navigation landmarks, increasing landmark noise and weakening the relationship between the chosen variant and its content.
- **Likely root cause:** Visual grouping elements were assigned navigation/tab semantics without implementing the complete ARIA pattern.
- **Recommended improvement:** Implement the full tabs pattern (`tabpanel`, selected-tab labeling, and expected keyboard behavior), or remove tab roles and use a simpler named button/radio group. Replace non-navigation `<nav>` wrappers with labeled sections/groups.
- **Safer alternatives / tradeoffs:** A native radio group is simpler and robust but changes announced terminology; complete tabs preserve the current mental model but require stricter focus/selection management.
- **Estimated effort:** M, 0.5–1 day.
- **Dependencies:** Interaction-model decision and AT regression tests.
- **Objective verification:** Accessibility tree exposes a valid tablist/tab/tabpanel relationship (or valid alternative group), only genuine site/location navigation appears as `navigation`, and NVDA/JAWS/VoiceOver announce selection and content relationship correctly.

### 09-C-06 — 404 page title and structure do not identify or recover from the error

- **Severity:** P1 high
- **Affected:** Unknown routes such as `https://m0code.com/__prelaunch-a11y-404`; root not-found fallback generated by the router; no dedicated source route.
- **WCAG:** 2.4.2 Page Titled; 1.3.1 Info and Relationships; 2.4.6 Headings and Labels.
- **Evidence:** Live response is HTTP `404`, but its document title is `MO — Portfolio` and the complete visible body content is only `<p>Not Found</p>`. It has no `main`, heading, explanation, or return-home link.
- **Reproduction:** Request any unknown route, inspect the browser title and landmarks/headings, then attempt recovery using only page content.
- **Impact:** Screen-reader and cognitive-accessibility users are not told by the title that an error occurred and are given no obvious path back to working content.
- **Likely root cause:** Default router not-found output is shipping without a designed accessible error component or route-specific head metadata.
- **Recommended improvement:** Provide a dedicated 404 document with an error-specific title, `main`, descriptive `h1`, concise explanation, and clear home/portfolio recovery link.
- **Safer alternatives / tradeoffs:** A minimal server fallback can remain small while adding these semantics; a richer suggestion/search page improves recovery but adds maintenance.
- **Estimated effort:** S, 0.5 day.
- **Dependencies:** Error-page copy and route-level head support.
- **Objective verification:** Unknown route returns 404; title identifies “Page not found”; accessibility tree contains `main` + descriptive `h1`; keyboard users can activate a clearly named recovery link.

### 09-C-07 — Production homepage is visually blank when JavaScript is unavailable

- **Severity:** P1 high
- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original 2026-07-29 finding.
- **Affected:** Live `/`; deployed SSR/CSS, especially the production article and animated-logo wrapper. The checked-in source/local dist no longer emits the same page-level initial style.
- **WCAG:** No independent AA failure if JavaScript is an accessibility-supported required technology; however, loss of the entire perceivable/operable page defeats WCAG principles when scripts are blocked or fail and is a required audit state.
- **Evidence:** Live SSR emits the primary `<article>` with inline `filter:blur(4px);opacity:0;transform:translateY(14px)`. The deployed logo wrapper also starts with `opacity:0`. With JavaScript disabled or failing before hydration, the inline article opacity is not advanced to visible. Production hashes differ from local dist, confirming deployment drift.
- **Reproduction:** Disable JavaScript before a fresh load of `https://m0code.com/`; inspect the computed opacity of the portfolio article and compare visible content with the SSR DOM.
- **Impact:** Script blocking, CSP/network failure, extension interference, or hydration failure can make all homepage content unavailable, including identity, contact links, and portfolio work.
- **Likely root cause:** Client-driven entrance animation uses a hidden SSR initial state without a no-JS/default-visible fallback; production is not the same artifact as the checked-in dist.
- **Recommended improvement:** Make SSR content visible by default and apply the entrance initial state only after a small enhancement class confirms JavaScript/animation readiness.
- **Safer alternatives / tradeoffs:** Remove the page-level entrance animation for maximum robustness; a `<noscript>` fallback restores essentials but duplicates content and does not cover partial hydration failure.
- **Estimated effort:** S–M, 0.5–1 day plus deployment verification.
- **Dependencies:** Animation strategy and synchronized production artifact.
- **Objective verification:** Fresh load with JavaScript disabled shows all core content/links; simulated script failure still leaves readable content; normal JS/reduced-motion loads do not flash or double-animate.
- **Current verification:** production passed desktop (1440×1000) and mobile (390×844) Chromium runs with JavaScript disabled and with `/assets/index-DWNzLafz.js` blocked. The bio, Orgo heading, and contact action retained visible geometry; the portfolio article computed to `opacity: 1`, `visibility: visible`, `filter: none`, and `transform: none`. Normal hydration and reduced-motion runs produced no page errors; reduced motion kept the initial video paused. The retained Orgo viewer remained healthy at `readyState=4`, duration `4.534`, `error=null`.

## Risks / Unverified

### 09-R-01 — Autoplaying gallery previews may lack the required pause mechanism

- **Severity:** P1 high
- **Affected:** `/`; `CrossAxisProjectRail.tsx:861-994`, especially `shouldPlay` and the looping preview `<video>`.
- **WCAG:** 2.2.2 Pause, Stop, Hide.
- **Evidence:** Active/in-view previews automatically `play()`, use `loop`, and expose no pause control until the user opens the separate full-screen viewer. Seventeen MP4 assets exist. Asset durations could not be read because `ffprobe`/equivalent tooling was unavailable, so the “more than five seconds” threshold is not confirmed.
- **Reproduction:** On each project, leave every video preview in view for more than five seconds and attempt to pause it without opening a modal.
- **Impact:** Continuous motion can distract users with cognitive, attention, or vestibular disabilities.
- **Likely root cause:** Preview video is treated as decorative motion while retaining an informative accessible label and prominent content role.
- **Recommended improvement:** If any preview runs beyond five seconds, provide a persistent pause/stop control for the preview or do not autoplay/loop it.
- **Safer alternatives / tradeoffs:** Replace autoplay with a poster and explicit play action (most robust, less immediate motion); cap previews at five seconds (preserves motion, may truncate meaning).
- **Estimated effort:** M, 1–2 days depending on shared controls.
- **Dependencies:** Verified asset durations and content classification.
- **Objective verification:** Duration inventory plus manual keyboard/touch test proving every qualifying moving preview can be paused/stopped/hidden independently.

### 09-R-02 — Prerecorded video alternatives cannot be validated

- **Severity:** P1 high
- **Affected:** `/` and `/video-player-lab`; all `public/portfolio/projects/**/*.mp4`; `CrossAxisProjectRail.tsx:94-386,861-1107`; `VideoPlayerLab.tsx:105-193`.
- **WCAG:** 1.2.1 Audio-only and Video-only (Prerecorded); 1.2.2 Captions (Prerecorded); 1.2.3 Audio Description or Media Alternative (Prerecorded).
- **Evidence:** No `<track>`, transcript, audio-description link, or volume/unmute control exists. Sixteen of seventeen MP4 binaries contain a `soun` handler marker, but that does not prove meaningful audible content; all UI video elements are hard-muted. Captions/alt text describe the clip at a high level but were not compared frame-by-frame with the full visual information.
- **Reproduction:** Inventory audio/video streams, play every clip with audio analysis, and compare the complete information conveyed with the adjacent caption/alt text.
- **Impact:** If clips contain meaningful audio or visually convey workflows not covered by surrounding text, deaf, hard-of-hearing, blind, and low-vision users miss equivalent information.
- **Likely root cause:** Portfolio motion assets were added as visual demonstrations without a formal media-alternative classification.
- **Recommended improvement:** Classify each clip as decorative, text-equivalent, video-only, or synchronized media; then provide the required transcript, captions, and/or audio description and expose appropriate controls.
- **Safer alternatives / tradeoffs:** Mark truly decorative previews hidden from AT and rely on equivalent nearby text; use static annotated images for the essential sequence; both reduce media-production cost but may reduce richness.
- **Estimated effort:** M–L, 2–5 days depending on content.
- **Dependencies:** Media stream inspection, content owner review, caption/transcript production.
- **Objective verification:** Per-asset matrix showing duration, audio presence/meaning, alternative type, and human comparison of alternatives to all essential information.

### 09-R-03 — Custom scrollbar may miss the WCAG 2.2 target-size requirement

- **Severity:** P2 medium
- **Affected:** `/`; `CrossAxisProjectRail.module.css:255-288`; `CrossAxisProjectRail.tsx:1826-1842`.
- **WCAG:** 2.5.8 Target Size (Minimum).
- **Evidence:** The pointer target for the custom `role="scrollbar"` is only `10px` wide; the thumb is `6px`. It is hidden at `<=768px`, but desktop/touch-laptop spacing relative to nearby media/link targets was not measurable without a browser.
- **Reproduction:** At each desktop breakpoint, measure the scrollbar target bounding box and the 24 CSS px spacing circles relative to adjacent pointer targets; repeat on a touch laptop.
- **Impact:** Users with tremor, limited dexterity, or coarse pointing devices may struggle to grab the custom scrollbar.
- **Likely root cause:** The visual rail width also defines the hit target.
- **Recommended improvement:** Keep the visible thumb narrow but expand the pointer hit area to at least 24 CSS px without covering adjacent controls.
- **Safer alternatives / tradeoffs:** Use the native scrollbar for platform familiarity; retain the custom rail only as decoration and rely on native scrolling/keys, but discoverability changes.
- **Estimated effort:** S, under 0.5 day plus measurement.
- **Dependencies:** Layout collision check.
- **Objective verification:** Bounding-box/spacing audit passes 2.5.8 at all breakpoints and pointer types.

### 09-R-04 — Resize-text, text-spacing, forced-colors, and modal focus behavior remain runtime-unverified

- **Severity:** P2 medium
- **Affected:** Both routes; absolute/clipped containers in `V14ExplorationLab.module.css:26-74`; fixed/overflow story and dialog surfaces in `CrossAxisProjectRail.module.css:1-35,199-288,748-1057`; video controls in `VideoPlayerLab.module.css:157-339`.
- **WCAG:** 1.4.4 Resize Text; 1.4.12 Text Spacing; 1.4.13 Content on Hover or Focus; 2.1.2 No Keyboard Trap; 2.4.3 Focus Order; 2.4.11 Focus Not Obscured; 1.4.11 Non-text Contrast.
- **Evidence:** Source includes good intent (dialog `aria-modal`, `inert`, Escape, focus trap/return, focus-visible rules, partial forced-colors styles), but the browser was unavailable. Absolute bottom-positioned intro, hidden overflow, 100dvh modal, nested horizontal/vertical scroll regions, and a full-viewport focusable backdrop need computed-layout testing. CrossAxis/video-lab custom controls lack comprehensive forced-colors rules.
- **Reproduction:** Run 200% text-only resize; WCAG text-spacing overrides; 320 CSS px/400% zoom; portrait/landscape; keyboard open/close of every media modal; Windows High Contrast/forced colors.
- **Impact:** Content may clip, focus may be obscured or lost, and custom controls/states may disappear for low-vision, keyboard, and forced-colors users.
- **Likely root cause:** Complex motion/overflow layout has source-level accommodations but no demonstrated cross-mode acceptance suite.
- **Recommended improvement:** Add a manual and automated accessibility-state matrix before launch; fix only failures observed in computed layout/AT.
- **Safer alternatives / tradeoffs:** Simplifying nested scrolling and the focusable backdrop reduces risk but changes the gallery interaction; preserving it requires broader regression coverage.
- **Estimated effort:** M for testing; remediation unknown.
- **Dependencies:** Available browsers, Windows forced-colors environment, and screen readers.
- **Objective verification:** Recorded pass/fail evidence for all listed modes with focus order, clipping, contrast, and modal return assertions.

## Opportunities

### 09-O-01 — Add an efficient bypass path to the main portfolio work

- **Severity:** P3 low
- **Affected:** `/`; `__root.tsx:32-43`; `V14ExplorationLab.tsx:327-378`.
- **WCAG:** 2.4.1 Bypass Blocks (strict failure is not asserted because repeated site-wide blocks were not established).
- **Evidence:** No skip link exists. The outer `main` begins immediately, but reaching project content by keyboard requires traversing the home logo, portrait disclosure, CTA, and social links.
- **Reproduction:** Fresh-load `/`, press `Tab`, and count stops before the Selected Projects region.
- **Impact:** Keyboard and switch users repeat several stops before the primary portfolio content.
- **Likely root cause:** A `main` landmark was considered sufficient for all bypass needs.
- **Recommended improvement:** Add a first-focus “Skip to selected work” link targeting a stable focusable heading/region.
- **Safer alternatives / tradeoffs:** A skip-to-main link adds little value because `main` starts at the top; a landmarks-only strategy avoids visual UI but depends more heavily on AT.
- **Estimated effort:** S, under 0.5 day.
- **Dependencies:** Stable target ID and focus styling that passes `09-C-01`.
- **Objective verification:** First keyboard action exposes the skip link; activation moves visible focus to selected work without unexpected scroll/motion.

### 09-O-02 — Make loading, failure, and content-change feedback explicit

- **Severity:** P2 medium
- **Affected:** `/`; `CrossAxisProjectRail.tsx:585-659,861-994,1413-1855`. `/video-player-lab`; `VideoPlayerLab.tsx:68-193,196-264`.
- **WCAG:** 4.1.3 Status Messages where a visible status is presented; otherwise usability enhancement.
- **Evidence:** Asset surfaces set `aria-busy`, but error states only update internal/data attributes; video failures silently fall back; project and video-variant changes do not expose a dedicated status message. The selected tab/button state may announce when focus remains on the control, so this is not recorded as a blanket conformance failure.
- **Reproduction:** Throttle/fail image and video requests, switch projects by pointer/scroll, and switch video variants while monitoring an AT speech viewer.
- **Impact:** Screen-reader users may not know that media failed, loading finished, or the active content changed.
- **Likely root cause:** Visual state transitions are modeled in React state/CSS without a concise user-facing status channel.
- **Recommended improvement:** Provide visible or visually hidden `role="status"` messages for meaningful load/failure/selection outcomes; include a recovery action for media failures.
- **Safer alternatives / tradeoffs:** Announce only failures and pointer/scroll-driven changes to avoid excessive speech; rely on tab selected-state announcements after completing `09-C-05`.
- **Estimated effort:** S–M, 0.5–1 day.
- **Dependencies:** Final interaction semantics and error copy.
- **Objective verification:** NVDA/JAWS/VoiceOver announce concise, non-duplicative outcomes without moving focus.

### 09-O-03 — Honor reduced motion for the standalone video-lab autoplay

- **Severity:** P2 medium
- **Affected:** `/video-player-lab`; `VideoPlayerLab.tsx:127-148`; `VideoPlayerLab.module.css:613-629`.
- **WCAG:** 2.2.2 is mitigated by the play/pause control; `prefers-reduced-motion` support is a best-practice/AAA-adjacent enhancement rather than a confirmed AA failure here.
- **Evidence:** The CSS disables transitions and flicker under `prefers-reduced-motion`, but the MP4 remains unconditional `autoPlay` + `loop`. The home gallery is better: `useReducedMotion()` prevents automatic preview playback.
- **Reproduction:** Emulate `prefers-reduced-motion: reduce`, fresh-load `/video-player-lab`, and observe whether the video starts.
- **Impact:** Motion-sensitive users who explicitly request reduced motion still receive a moving full-width video.
- **Likely root cause:** Reduced-motion handling covers CSS animation but not media playback on this route.
- **Recommended improvement:** Default to the poster/paused state when reduced motion is requested and let the user explicitly play.
- **Safer alternatives / tradeoffs:** Persist a site-level autoplay preference for finer control, but that adds settings/state complexity.
- **Estimated effort:** S, under 0.5 day.
- **Dependencies:** None beyond a reduced-motion hook.
- **Objective verification:** Fresh load under reduced motion remains paused; explicit play still works with keyboard, pointer, and touch.

## False Positives / Non-issues

- Empty `alt` on decorative logo/poster/portrait layers is intentional; the surrounding link/button/video has an accessible name or the composite portrait has `role="img"`.
- Icon-only social and playback controls have explicit accessible names; decorative SVGs are hidden from AT.
- The hidden range inputs are still native focusable sliders with accessible names; visual hiding by opacity alone is not an accessibility-tree removal.
- Project motion is not pointer-only: named project buttons and arrow/Home/End handlers exist.
- Existing accessibility-tree snapshots list inactive project stories, but source and live SSR apply `inert` to inactive articles. This is not recorded as a failure until post-hydration AT behavior is directly verified.
- A Lighthouse/axe score, including 100, would not prove WCAG 2.2 AA conformance and was not used to dismiss manual issues.

## Passed Checks

These are source/SSR-level passes unless noted; direct multi-browser/AT behavior remains subject to the Not Tested section.

- Both normal routes have one `main`; the video lab has a descriptive `h1`.
- All live documents declare `lang="en"` and the viewport does not disable zoom.
- Meaningful portfolio images have specific alternative text; decorative images/icons use empty alt/`aria-hidden`.
- Actions use native buttons and destinations use native links; icon-only controls are named.
- Social/contact and external-project links expose understandable purposes.
- Primary buttons and social controls are at least 44–48 CSS px; project-dot buttons are 44 px.
- Video play/pause and progress controls have accessible names and native range semantics.
- Video-lab tabs implement roving `tabIndex` and arrow navigation; Home/End is an enhancement opportunity, not an AA requirement by itself.
- Home project regions support arrow/Home/End navigation; the custom scrollbar supports arrows, Page Up/Down, Home/End.
- The media dialog is source-labeled/described, `aria-modal`, closes with Escape, attempts to make siblings inert, traps Tab, and returns focus after exit.
- `MotionConfig reducedMotion="user"` and `useReducedMotion()` are used on the home route; CSS entrance/flicker transitions have reduced-motion overrides.
- No orientation lock, paste blocking, inaccessible custom form fields, or single-character shortcuts were found.
- CSS-only negative flicker is disabled under reduced motion and is not authored at an obvious three-flashes-per-second rate.
- Live unknown route correctly returns HTTP 404 even though its accessible page content is inadequate.

## Not Tested

- Direct live keyboard-only traversal of every link, button, story, scrollbar, range, and modal because the connected browser runtime had no available backend.
- NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome, speech output, rotor/landmark/heading lists, and live-region behavior.
- Computed-layout verification at 200% text resize, 320 CSS px/400% zoom, landscape/portrait, browser text-spacing overrides, and every breakpoint.
- Touch exploration, coarse-pointer target spacing, drag cancellation, pinch zoom, and mobile virtual viewport/safe areas.
- Windows High Contrast/forced colors beyond static CSS review.
- Modal backdrop focus visibility, focus obscuration, focus return, and inert support in Safari/older assistive-technology combinations.
- Contrast of text over moving video/image frames; only deterministic CSS color pairs were calculated.
- MP4 duration, audible content, flashes, captions, transcripts, and audio-description sufficiency; the environment lacked media-probe/playback tooling.
- JavaScript-disabled and blocked-main-module visual rendering was completed in Chromium desktop/mobile under ITEM-05. Full interaction is intentionally unavailable without JavaScript, and equivalent non-Chromium/assistive-technology behavior remains untested.
- Cache-disabled/repeat-visit/Slow 3G/offline accessibility interaction, which overlaps resilience/performance scopes and requires a browser.
- A fresh Lighthouse or axe run. No applicable report artifact was found; automated tools would be supplemental only.
- Execution of the local `dist/server` handler. Existing generated artifacts were inspected read-only, and no rebuild was authorized.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Disposition:** lab-only `09-C-04` and `09-O-03` are not applicable to the deployed release. The lab portion of `09-C-02` is retired; homepage contrast subsequently completed under ITEM-07. Semantics, heading, motion, media alternatives, keyboard traversal, and 404 findings remain open.
- **Verification:** the lab UI/CSS no longer exists in source or build output, the retired path returns `404`, and focused browser QA found the retained Orgo media ready with no media/console error. No claim is made that broader WCAG coverage is complete.
- **Production evidence:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; the lab path is `404` and retained Orgo media passed browser smoke. All mixed/site-wide findings remain open until their own acceptance criteria pass.

## Implementation tracking — ITEM-05

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `09-C-07` is complete. Primary homepage content remains perceivable when JavaScript is disabled or the main bundle fails; other WCAG findings and the broader assistive-technology matrix remain open.
- **Verification:** four desktop/mobile failure-mode runs showed the bio, project, and contact content with visible geometry and safe computed styles. Normal and reduced-motion regressions passed without page errors, and the retained Orgo player remained functional. No runtime source change was required.

## Implementation tracking — ITEM-07

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `09-C-01` and `09-C-02` are complete for the retained site. This does not close semantics, media alternatives, screen-reader, full keyboard traversal, or non-Chromium findings.
- **Verification:** computed production matrices covered every story and all 32 captions at 100% plus homepage reflow at 200% text; selected/focus state contrast and forced colors passed. Production Lighthouse mobile/desktop scored Accessibility 100. Orgo modal playback reached `readyState=4`, played, paused, and closed with zero console/page errors.
- **Release evidence:** PR [#8](https://github.com/MoIbrahim10/portfolio/pull/8), merge `1db9d57008b6db30a32178fc4e83597d76074caa`, Actions run `30700858043`, Cloudflare version `a3299de6-82a2-49d7-9815-25da9fe35f8e`.

## Implementation tracking — ITEM-08

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `09-C-03`, `09-C-05`, and `09-C-06` are complete for the retained site. The lab portion of `09-C-05` was retired under ITEM-01; homepage control semantics and all listed 404 requirements are now satisfied.
- **Semantics evidence:** SSR and hydrated accessibility trees expose one “Mo Ibrahim — Design Engineer” H1, four H2 project headings, and four labeled project groups with no false project-navigation landmarks. Unknown URLs expose `main`, one H1, explanatory copy, and a clearly named home link under the unique error title.
- **Interaction/layout evidence:** keyboard focus and Enter activation pass; the focused recovery link has a 3 px outline. Checks at 320, 390, 768, and 1440 CSS px plus 200% text show no horizontal overflow; both recovery targets meet the 44 CSS px advisory size and the action is 48 px high.
- **Audit/regression evidence:** production desktop/mobile Lighthouse snapshots score Accessibility 100 with zero failed audits. The homepage role block retains its exact pre-change rectangle and computed styling, and the existing Orgo modal/video remains operable with no console/page errors. Real NVDA/JAWS/VoiceOver and non-Chromium coverage remain open under the existing risks.

## Implementation tracking — ITEM-10

- **Status:** `Complete for automated Chromium reduced-motion and modal-focus regression` (2026-08-01).
- **Disposition:** desktop/mobile tests now prove reduced-motion fresh loads keep inline and modal Orgo video paused, the dialog initially focuses Close, Escape dismisses it, and focus returns to the exact media trigger after background inertness clears. This does not close real screen-reader, Safari/Firefox, captions/media-alternatives, or exhaustive keyboard findings.
- **Defects fixed:** hydration now begins from a conservative motion-free state before applying the client preference, eliminating the observed React mismatch; focus restoration waits until the trigger is outside an inert subtree. No visual styling or player controls changed.
- **Evidence:** local CI and public production each passed all 12 tests with zero unexpected console/page/request failures. Release `ebcd8b1…`, Actions `30706793536`, Cloudflare `5c861a15…`.

## Implementation tracking — ITEM-12

- **Status:** `09-R-03 and 09-R-04 resolved locally; release verification pending` (2026-08-02).
- **Fixes:** inactive stories use `aria-hidden` with `inert`; keyboard project selection focuses the committed active story; the modal owns Tab traversal and excludes its invisible backdrop; the custom scrollbar has a 24px interactive width while retaining its 10px visual track.
- **Verification:** Chromium, Firefox, WebKit, mobile Chromium/WebKit, and hybrid touch passed semantic snapshots, modal containment/return, keyboard routing, reduced motion, forced colors, 320px reflow, landscape, WCAG text-spacing overrides, and 200% text. All 32 media triggers were checked on desktop; first/last per story were checked on mobile.
- **Assistive-technology evidence:** with macOS VoiceOver enabled, Safari’s native tree exposed one active Orgo story, H1/H2 hierarchy, named toggle buttons, links, media actions, regions, and scrollbar value; inactive stories were absent. VoiceOver was returned to its previous off state.
- **Boundary:** no NVDA, JAWS, TalkBack, rotor-output transcript, or physical-device certification is claimed.
