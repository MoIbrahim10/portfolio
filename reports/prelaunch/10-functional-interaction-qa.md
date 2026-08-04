# 10 — Functional and Interaction QA

Audit date: 2026-07-29
Scope: functional and interaction behavior only for the repository, existing `dist`, and `https://m0code.com`. Responsive layout and accessibility conformance belong to scopes 11 and 09; interaction consequences are noted here.
Release posture: **not functionally cleared**. No source, dependency, build, configuration, lockfile, Git, or external-system mutation was performed.

## Scope and method

- Assumed the checked-in `dist` is the current launch candidate because rebuilding was prohibited.
- Inspected both declared routes (`/`, `/video-player-lab`), the root/router configuration, all rendered controls and state handlers, all 32 candidate media chapters, asset loading/fallback code, modal lifecycle, video controls, and current data-backed outbound URLs.
- Exercised the existing server artifact read-only through its exported `fetch` handler:
  - `/` → `200`, `text/html`, 59,915 bytes.
  - `/video-player-lab` → `200`, `text/html`, 6,280 bytes.
  - `/unknown-prelaunch-audit-route` → `404`, generic `Not Found`, 1,215 bytes.
- Exercised production with read-only HTTP GET/HEAD requests:
  - `/` → `200`, 46,519 bytes.
  - `/video-player-lab` → `200`, 5,652 bytes.
  - `/unknown-prelaunch-audit-route` → `404`, generic `Not Found`, 1,217 bytes.
  - Fresh, repeat, and explicit `no-cache/no-store` GETs returned the same status and body size for each valid route. Response hashes differed because the streamed SSR payload embeds per-request values; this is not treated as state nondeterminism.
- Verified all 77 literal image/video/SVG paths referenced by current source exist in both `public` and `dist/client`. Production returned `200` with the expected MIME family for 69; six current WebP portraits and the two new identity-animation assets returned `404`.
- Performed safe GET resolution of every unique HTTPS destination currently surfaced in production. Calendar, Mo GitHub/X, Orgo, The Good Invoice, Lumen, Fay’s site, and Fay’s X profile returned `200`. `mailto:` was syntax-inspected only. No link was clicked and no form, booking, email, social, or analytics action was initiated.
- The required in-app browser-control runtime was initialized and queried exactly as directed, but discovery returned no available browser. Per the browser skill, no unrelated browser backend was substituted. Consequently, source/SSR/HTTP evidence is distinguished from unexecuted interactive behavior throughout.

## Control and state coverage matrix

| Route / surface | Candidate controls and states traced | Production evidence | Executed interaction status |
|---|---|---|---|
| `/` shell | Logo/home anchor; portrait reveal; schedule, email, GitHub, X | SSR contains all controls and hrefs; route `200` | Hrefs/HTTP only; clicks and animation not executable |
| Project rail | 4 stories; 4 active selector dots (16 SSR copies, inactive stories inert); horizontal viewport; 4 vertical story regions; custom scrollbar | Production SSR contains four stories and all selectors | Scroll, swipe, dot selection, arrow/Home/End, drag, and focus transfer not executable |
| Candidate media grid | 5 Orgo + 5 Good Invoice + 7 Lumen + 15 Selected Experiments = **32 triggers** (15 images, 17 videos) | Production contains **31**; identity trigger absent | No trigger could be activated |
| Media viewer | Dialog, close button, backdrop close, Escape, focus trap, body scroll lock, focus return; video play/pause/range/time | Handlers are present in candidate source; viewer is client-state only and absent from initial SSR | All modal paths and media ready/error states not executable |
| Outbound project links | Orgo, Good Invoice, Lumen | All three surfaced hrefs returned `200` | Destination GET only; no UI click |
| Collaborator links | 18 rendered anchors to 2 unique Fay endpoints | Both unique endpoints returned `200` | Destination GET only |
| `/video-player-lab` | Back-to-home link; 10 tabs; wrapping arrow navigation; autoplay/play/pause; seek; current/duration; ready/error poster state | Route `200`; SSR has 10 tabs, tab 7 active, play control, range, and video source | No tab, keyboard, media, or history interaction executable |
| Unknown route | 404 response | Correct `404`, but only `<p>Not Found</p>` | HTTP executed; no recovery interaction exists |
| Fresh/repeat/cache-disabled | SSR route delivery | Valid routes remained `200` with stable byte sizes | Browser cache, persisted UI state, and service-worker behavior not executable |
| JS disabled | SSR content, anchors, and native media markup are present | Meaningful text and hrefs visible in HTML | Button-driven rail/viewer/lab behavior cannot work without JS; no browser visual test |
| Reduced motion | Main gallery gates autoplay/motion; modal gates autoplay; video lab only disables CSS transitions | Source-confirmed divergence | Preference emulation not executable |

## Confirmed Issues

### FQA-001 — Production is behind the candidate and lacks eight candidate assets

- **Severity:** P1 high
- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original 2026-07-29 finding.
- **Affected:** `/`; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:17`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:370`; production asset namespace
- **Evidence:** Candidate SSR contains 32 full-screen triggers; production contains 31. The candidate-only trigger is `View MO identity mark animation full screen`. Production asset hashes differ from `dist` (`index-BTo1nZ1V.js` vs. `index-COTNhO9J.js`; `routes-DAvGpumd.js` vs. `routes-BXeiZRtJ.js`). Production returns `404` for all six `/avatar/mo-avatar-portrait-0N-640.webp` files and both `/portfolio/projects/identity/logo-animation-poster.webp` and `.mp4`; all eight exist in `public` and `dist/client`. Current production still references older PNG portraits, so the present page does not break on those six 404s.
- **Reproduction:** Compare the count/diff of `aria-label="View … full screen"` in live SSR and candidate SSR; GET the eight candidate URLs on `m0code.com`; compare live and candidate asset manifest names.
- **Impact:** Review of production does not validate the launch candidate. A non-atomic HTML/assets rollout or stale edge cache could ship broken portraits and the new identity viewer.
- **Likely root cause:** Older or partial deployment and/or unsynchronized CDN asset retention.
- **Recommended improvement:** Use an atomic candidate deployment, retain immutable hashed assets across rollout, and invalidate only entry HTML after all public assets are available.
- **Safer alternatives / tradeoffs:** Deploy to a preview hostname and run the complete browser matrix before promotion; slower launch, lower rollback risk.
- **Estimated effort:** S (deployment verification), M if pipeline changes are required.
- **Dependencies:** Scope 13 deployment/rollback plan; browser availability; final approved candidate hash.
- **Objective verification:** Production route assets match the approved `dist`; all 77 current URLs return `200` with correct MIME; production SSR exposes 32 triggers; full browser smoke passes after a cold-cache deploy.
- **Current verification:** production and the rebuilt current artifact expose identical three root asset hashes, 1 video, 32 images, 32 full-screen triggers, and the same sole initial Orgo MP4. All 77 referenced public URLs return `200` with expected MIME. Cache-disabled desktop/mobile, Slow 3G mobile, portrait reveal, and Orgo modal tests passed 5/5 with no request, console, or page errors; the modal video reached `readyState=4`, duration `4.534`, `error=null`.

### FQA-002 — Live links for projects inside “Selected Experiments” are not rendered

- **Severity:** P2 medium
- **Affected:** `/`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:422`, `:521`, `:829`; `src/components/v14-exploration-lab/portfolio-data.ts:139`, `:177`
- **Evidence:** `bitsnpixels.liveHref` and `glazed.liveHref` exist in data, but `StoryTopLinks` uses only `projects[0]` and is omitted when `story.id === 'others'`; experiment cards render collaborator links only. Neither `bitsnpixels.co` nor `glaze.design` appears in live or candidate SSR.
- **Reproduction:** Open `/`, select “Selected Experiments,” inspect each Bits n Pixels and Glazed card/title area, and search the rendered DOM for the two hostnames.
- **Impact:** Visitors can view work but cannot reach two live case-study destinations, reducing portfolio conversion and making the stored URLs misleading.
- **Likely root cause:** The single-project header-link pattern was not adapted when multiple projects were grouped into one story.
- **Recommended improvement:** Add a clearly labeled live/source link to each experiment card using that chapter’s `project`.
- **Safer alternatives / tradeoffs:** Add a compact link list in the Selected Experiments header; less repetition but weaker project-to-link association.
- **Estimated effort:** S
- **Dependencies:** Confirm destination ownership and availability; interaction and accessibility review of the new control.
- **Objective verification:** Each project with `liveHref` or `repositoryHref` has one reachable rendered anchor; automated assertions map project IDs to expected hrefs.

### FQA-003 — Full-screen video failures have no poster, retry, or error state

- **Severity:** P2 medium
- **Affected:** `/` media viewer; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:1003-1108`
- **Evidence:** `ViewerVideo` renders only `<video>` and controls. `onError` merely calls `setPlaying(false)` at line 1060; it does not expose failure state, poster media, retry, or explanatory content. This differs from inline `ResilientVideo`, which retains a poster and tracks `failed`.
- **Reproduction:** Open any video chapter full screen, block its `.mp4` request or go offline before load, then observe the viewer frame and controls.
- **Impact:** A transient CDN/network/media-codec failure produces a blank frame with inert-looking `0:00` controls and no recovery path.
- **Likely root cause:** Resilience logic exists only in the inline gallery player and was not shared with the modal player.
- **Recommended improvement:** Keep the chapter poster visible until ready, expose a deterministic error state, disable invalid seek controls, and offer retry.
- **Safer alternatives / tradeoffs:** Fall back permanently to the poster after one failure; simpler and predictable, but no in-session recovery.
- **Estimated effort:** S–M
- **Dependencies:** Error-state design, media test fixture or request interception, scope 09 announcement semantics.
- **Objective verification:** Block every modal video request; each viewer shows its poster and error message, retry succeeds after unblocking, no console exception occurs, and close/Escape/focus return still pass.

### FQA-004 — Video Player Lab autoplays despite reduced-motion preference

- **Severity:** P2 medium
- **Affected:** `/video-player-lab`; `src/components/video-player-lab/VideoPlayerLab.tsx:127-148`; `VideoPlayerLab.module.css:613-629`
- **Evidence:** The lab `<video>` always has `autoPlay`; the component does not read reduced motion. Its reduced-motion CSS disables transitions/animations only. The main project rail and modal explicitly gate playback with `useReducedMotion`, so behavior is inconsistent.
- **Reproduction:** Enable “Reduce motion,” cold-load `/video-player-lab`, and inspect whether the walkthrough starts without user input.
- **Impact:** Unexpected moving content remains active for motion-sensitive users and makes the lab’s play/pause state inconsistent with the portfolio viewer.
- **Likely root cause:** The lab was implemented separately from the reduced-motion-aware gallery players.
- **Recommended improvement:** Initialize paused and suppress autoplay when reduced motion is requested while retaining the poster and manual play control.
- **Safer alternatives / tradeoffs:** Disable autoplay for everyone; less cinematic but simpler and more predictable.
- **Estimated effort:** S
- **Dependencies:** Scope 11 motion decision; browser preference emulation.
- **Objective verification:** With reduced motion, fresh and repeat loads remain paused until explicit play; without it, the approved autoplay policy works; all 10 variants preserve state correctly.

### FQA-005 — The 404 response provides no recovery path

- **Severity:** P2 medium
- **Affected:** unknown routes; `src/routes/__root.tsx:10-30`; `src/router.tsx:5-11`
- **Evidence:** Both candidate and production return the correct `404` status but render only `<p>Not Found</p>`. Invoking candidate SSR also emits TanStack Router’s warning that no route or router-level `notFoundComponent` is configured.
- **Reproduction:** Request `/unknown-prelaunch-audit-route` directly or reload it.
- **Impact:** Mistyped and stale URLs strand visitors without branding, navigation, or a route back to the portfolio.
- **Likely root cause:** Default router 404 handling was left in place.
- **Recommended improvement:** Add a branded not-found experience with a safe home link while preserving the HTTP 404 status.
- **Safer alternatives / tradeoffs:** Minimal root-level not-found component with one home link; less polished, very low complexity.
- **Estimated effort:** S
- **Dependencies:** Copy/design approval; scope 07 indexability validation.
- **Objective verification:** Unknown URLs return HTTP 404, render the approved recovery UI in SSR and hydrated states, and the home action reaches `/` by pointer and keyboard.

### FQA-006 — Clicking the animated home logo competes with immediate self-navigation

- **Severity:** P3 low
- **Affected:** `/`; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:337-343`; `src/components/brand/AnimatedLogo.tsx:193-202`
- **Evidence:** `AnimatedLogo` starts `playLogoHover()` on click, but it is nested in a plain `<a href="/">`. The default navigation is not prevented; on `/`, the animation can be interrupted by a full self-navigation/reload.
- **Reproduction:** On `/`, click the logo (do not hover first) and observe animation completion, document navigation, media position, and project/scroll state.
- **Impact:** The advertised click interaction may be imperceptible and can reset a visitor’s current project/scroll position.
- **Likely root cause:** Decorative click behavior and navigation behavior are attached to nested elements without a single interaction contract.
- **Recommended improvement:** Choose one primary click outcome: navigate without click animation, or keep the animation hover/focus-only and use client navigation that preserves approved state.
- **Safer alternatives / tradeoffs:** Remove only the logo `onClick` animation while retaining hover; smallest behavior surface, less touch feedback.
- **Estimated effort:** XS–S
- **Dependencies:** Product decision on logo behavior; scope 11 touch validation.
- **Objective verification:** One click produces the approved single outcome, no unintended reload/state loss occurs, and hover/focus animation still completes where intended.

## Risks / Unverified

### R-FQA-001 — Critical interaction coverage could not be executed

- **Severity:** P1 high
- **Affected:** both routes and all client-side states
- **Evidence:** Browser runtime initialization succeeded, but the required discovery call returned an empty browser list. The browser skill prohibits substitution with an unrelated browser backend.
- **Reproduction:** Initialize the configured browser runtime, request the browser for `https://m0code.com/`, then list available browsers; current result is none.
- **Impact:** No evidence exists for real clicks, focus movement, scroll settling, playback, browser history, console/network/hydration behavior, throttling, offline, or visual loading/error transitions.
- **Likely root cause:** Audit environment had no available in-app/Chrome browser binding.
- **Recommended improvement:** Re-run this scope in an environment with the supported browser connected before launch approval.
- **Safer alternatives / tradeoffs:** Manual recorded QA can cover priority paths, but it is less repeatable and weaker for console/network evidence.
- **Estimated effort:** M (full matrix once infrastructure is available)
- **Dependencies:** Browser connection and permission; stable preview deployment.
- **Objective verification:** A timestamped run records every matrix row, all 32 modal triggers, both routes, requested network/preferences, console/network logs, and artifacts for failures.

### R-FQA-002 — Project and viewer state are not represented in URL/history

- **Severity:** P2 medium
- **Affected:** `/` project rail and viewer; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:1418-1424`, `:1648-1665`, `:1748-1761`
- **Evidence:** Active project and media selection are React state only. Selection/open/close code does not update router search/hash or history.
- **Reproduction:** Navigate from another page to `/`, select a later project, open a viewer, then use browser Back/Forward and reload; observe whether Back closes the viewer, project selection is preserved, and Forward restores it.
- **Impact:** Back may leave the portfolio instead of closing the modal, and refresh/deep links cannot preserve or share the selected work.
- **Likely root cause:** Carousel/viewer state was designed as ephemeral local UI state.
- **Recommended improvement:** Decide and document the history contract; if shareability is desired, encode project/media IDs in validated URL state and make Back close/restore predictably.
- **Safer alternatives / tradeoffs:** Add a popstate-aware modal history entry only; improves Back behavior without exposing every carousel position.
- **Estimated effort:** M
- **Dependencies:** Product URL policy, router design, SEO/canonical coordination.
- **Objective verification:** Automated Back/Forward/reload tests assert the approved state transitions from direct and navigated entry.

### R-FQA-003 — Unrendered data URLs already show availability concerns

- **Severity:** P2 medium
- **Affected:** future Selected Experiments links; `src/components/v14-exploration-lab/portfolio-data.ts:126`, `:140`, `:178`
- **Evidence:** These URLs are currently not rendered by the active stories, so they are not live broken links. Read-only probes found `bitsnpixels.co` unresolved by DNS, `glaze.design` timed out at 30 seconds, and `github.com/MoIbrahim10/calm-ai-studio` returned 404.
- **Reproduction:** Resolve/GET each URL from an independent network and inspect the corresponding project’s current render path.
- **Impact:** Surfacing these stored URLs without validation could add dead or unreliable project actions.
- **Likely root cause:** Portfolio data outlived destination availability, or the audit network could not reach the hosts.
- **Recommended improvement:** Confirm ownership and intended canonical destinations before exposing them; add automated outbound-link monitoring after approval.
- **Safer alternatives / tradeoffs:** Omit unavailable links and label work as an archived case study; fewer outbound conversions but no dead end.
- **Estimated effort:** XS for confirmation, S for monitoring.
- **Dependencies:** Domain/repository owner confirmation; scope 15 link audit.
- **Objective verification:** Independent DNS and browser GET checks return the approved result on two networks, then rendered anchors are tested without side effects.

### R-FQA-004 — JavaScript-disabled users receive controls that cannot operate

- **Severity:** P3 low
- **Affected:** `/` rail/viewer and `/video-player-lab`; all button-based handlers
- **Evidence:** SSR contains meaningful text and anchors, but project selection, modal opening, portrait reveal, tab changes, play/pause, and custom seek depend entirely on React handlers. No `<noscript>` guidance or non-JS detail links exist.
- **Reproduction:** Disable JavaScript and load both routes; try selector dots, media buttons, portrait, tabs, and custom video controls.
- **Impact:** Core visual content is present, but most portfolio exploration and all custom player behavior are unavailable without explanation.
- **Likely root cause:** Interactive elements have no progressive-enhancement destination.
- **Recommended improvement:** Define the supported no-JS contract; provide simple media/detail links or a concise notice if full enhancement is intentionally JS-only.
- **Safer alternatives / tradeoffs:** Keep anchors/content usable and formally declare buttons unsupported without JS; minimal code, reduced functionality.
- **Estimated effort:** S–M
- **Dependencies:** Product support policy, scope 07 crawl requirements.
- **Objective verification:** A JS-disabled audit confirms every promised action either works natively or has an explicit, useful fallback.

## Opportunities

### O-FQA-001 — Add a deterministic interaction regression suite

- **Severity:** P2 medium
- **Affected:** both routes; especially `CrossAxisProjectRail` and `VideoPlayerLab`
- **Evidence:** The repository has no test script or checked-in interaction specs, while the surface includes 32 modal triggers, nested horizontal/vertical scroll, media state, focus restoration, and ten tab variants.
- **Reproduction:** Inspect `package.json` scripts and repository test files; no automated functional path exists.
- **Impact:** High-state interactions can regress between candidate and production without a repeatable release gate.
- **Likely root cause:** Exploration components matured without a matching browser test harness.
- **Recommended improvement:** After approval, add data-driven browser tests for controls, all chapter types, modal lifecycle, media failure, history, reduced motion, and both routes.
- **Safer alternatives / tradeoffs:** A smaller smoke suite can cover one image and one video per story plus all navigation; faster, but not exhaustive.
- **Estimated effort:** M–L
- **Dependencies:** Scope 14 test/CI plan; supported browser environment; stable selectors.
- **Objective verification:** CI runs the approved matrix against candidate output and fails on console errors, request failures, state/focus mismatches, or missing controls.

### O-FQA-002 — Make loading and recovery states observable to users and tests

- **Severity:** P3 low
- **Affected:** gallery assets and both video players; `CrossAxisProjectRail.tsx:585-659`, `:861-994`, `:1003-1108`; `VideoPlayerLab.tsx:68-194`
- **Evidence:** Internal states are primarily `data-*` attributes and poster opacity. The lab and modal do not expose retry/status content, and the lab play rejection only resets `playing`.
- **Reproduction:** Throttle or fail image/video requests and inspect visible status, enabled controls, and accessible state.
- **Impact:** Slow or failed loads can look like inert controls, while automated QA has no stable user-facing recovery assertion.
- **Likely root cause:** Loading mechanics were implemented visually before a complete interaction-state contract.
- **Recommended improvement:** Define queued/loading/ready/blocked/error states with visible fallbacks and retry rules shared across player implementations.
- **Safer alternatives / tradeoffs:** Keep poster-only fallback but disable unavailable controls and show one compact status message.
- **Estimated effort:** M
- **Dependencies:** Error/loading copy and design; scope 09 live-region decision.
- **Objective verification:** Request interception deterministically reaches each state; screenshots, semantics, controls, retry, and recovery match acceptance criteria.

## False Positives

- The six WebP portrait `404`s were historical drift evidence, not breakage in the older deployed page. ITEM-06 now confirms all six optimized portrait URLs return production `200` with correct MIME and the current page requests them only after reveal.
- The 16 SSR copies of project selector buttons are not 16 simultaneous active control sets: inactive story articles receive `inert`; runtime behavior still needs browser confirmation.
- A rejected inline-gallery autoplay request is handled by `ResilientVideo` and retains its poster; it is not automatically a blank-media defect. The full-screen `ViewerVideo` lacks that protection.
- Different response hashes across repeated SSR GETs are explained by streamed route payload values; status and response byte size were stable.
- The `bitsnpixels.co`, `glaze.design`, and Calm AI Studio repository results are not current broken-link defects because those hrefs are not rendered in the audited stories.

## Passed Checks

- Current production returns `200` for `/`; the retired `/video-player-lab` route correctly returns `404` under ITEM-01.
- Candidate and production return a real HTTP `404` for an unknown route rather than a `200` soft 404.
- All 77 current source-referenced media/SVG paths exist in `public` and `dist/client`.
- All 77 current source-referenced media/SVG paths return production `200` with the expected MIME type.
- Every media video in the candidate has its derived WebP poster in the candidate artifact.
- All eight unique HTTPS destinations currently surfaced in production returned `200` during the audit; home/self hrefs also resolve to `200`.
- Current build and production SSR each expose exactly 32 full-screen media buttons and identical root asset hashes.
- Historical 2026-07-29 `/video-player-lab` SSR exposed all 10 named tabs and its player controls; ITEM-01 retired that route and implementation.
- Source contains modal close button, backdrop close, Escape handling, focus trapping, body scroll lock, and post-exit trigger focus restoration.
- Current source contains bounded Arrow/Home/End navigation in the project rail; the retired lab previously contained wrapping tab selection.
- Inline gallery video code retains a poster on autoplay block/error and avoids autoplay under reduced motion; modal playback is also suppressed under reduced motion.
- Touch-oriented gallery CSS keeps retained controls visible under `@media (hover: none)`; actual devices remain untested.
- The schedule/email/social checks did not initiate any external action.

## Not Tested

- Exhaustive pointer, touch gesture, keyboard-only, and screen-reader interaction. ITEM-10 now automates pointer modal activation, keyboard rail selection/Escape, and focus return in desktop/mobile Chromium.
- Every one of the 32 candidate media triggers; ITEM-10 covers the retained Orgo video trigger, modal rendering/controls, Escape, and focus return, but not all image triggers, backdrop dismissal, or full Tab wrapping.
- Project dots, horizontal wheel/swipe, Home/End, vertical story scroll, custom scrollbar click/drag/keys, snap settling, and scroll restoration. ITEM-10 covers ArrowRight project change.
- Portrait hover/focus/tap/cycle/hide behavior and logo hover/click animation completion.
- All 10 video-lab tab clicks, wrapping arrow navigation, autoplay, play/pause, seek, duration/time updates, end/loop, ready/error/poster transition, and browser Back/Forward.
- Repeat-visit persistence, offline, partial/stalled media, update/recovery, memory growth, and CPU behavior. ITEM-10 deterministically covers complete inline-video failure/poster fallback and reduced-motion playback; ITEM-06 completed cache-disabled desktop/mobile and one Slow 3G initial-media run; ITEM-05 completed JavaScript-disabled coverage.
- Exhaustive console/network/hydration coverage across every state remains untested; ITEM-10 strictly gates the named critical states with zero unexpected console, page, or request failures.
- Cross-browser and breakpoint execution; scope 11 owns the full responsive/device matrix.
- 500/error-boundary behavior because safe read-only requests cannot induce a server fault and no injectable test boundary exists.
- `mailto:` launch, calendar booking UI, external social/project clicks, or any action that could change external state.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Disposition:** lab-only `FQA-004` is not applicable to the deployed release. Lab rows within `R-FQA-001`, `R-FQA-004`, `O-FQA-001`, and `O-FQA-002` are retired; all homepage and error-route portions remain open.
- **Focused regression evidence:** opened the homepage Orgo full-screen viewer; one video used `/portfolio/projects/orgo/walkthrough.mp4`, reached `readyState=4`, reported duration `4.534`, had `error=null`, and produced no console errors/warnings. Retained implementation/data/media hashes are unchanged.
- **Route evidence:** production `/video-player-lab` renders `Not Found` and returns `404` without redirect; no lab source/build reference remains.
- **Production evidence:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; the retained viewer check above passed on the public origin with no console errors/warnings.

## Implementation tracking — ITEM-06

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `FQA-001` is complete. Production matches the rebuilt artifact and all previously missing candidate assets are healthy. Broader interaction coverage, failure-state behavior, and the dedicated automated suite opportunity remain open.
- **Verification:** exact SSR/root-asset parity, 77/77 production status/MIME passes, and a 5/5 browser matrix covering desktop, mobile, Slow 3G, portrait reveal, and Orgo playback. No application or player source changed.

## Implementation tracking — ITEM-08

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `FQA-005` is complete. Direct-load and hydrated unknown URLs preserve `404`, explain the failure, and provide one working route home; keyboard activation returns to the portfolio.
- **Regression evidence:** fresh/cache-bypassed production checks show no console/page errors. The retained Orgo full-screen viewer still opens, loads and plays `/portfolio/projects/orgo/walkthrough.mp4` at `readyState=4`, restores body scrolling on close, and was not functionally changed.
- **Release evidence:** PR [#10](https://github.com/MoIbrahim10/portfolio/pull/10), merge `f5bf8335…`, Actions run `30701980701`, Cloudflare version `3ba23d32…`.

## Implementation tracking — ITEM-09

- **Status:** `Complete for release parity and retained-player regression` (2026-08-01).
- **Disposition:** the release-identity dependency behind `FQA-001` is automated. ITEM-10 subsequently completed the critical browser CI suite and one deterministic network-failure path; exhaustive 32-trigger, touch-gesture, and cross-browser execution remain open.
- **Evidence:** CI matched production homepage structure, five generated assets, brand, 404s, and Orgo MP4 bytes. Independent production browser QA opened the Orgo dialog; the exact MP4 reached `readyState=4`, duration `4.534`, `error=null`, played and looped, emitted no console errors, and closed normally.

## Implementation tracking — ITEM-10

- **Status:** `O-FQA-001 complete for the approved release-critical baseline` (2026-08-01).
- **Coverage:** checked-in Playwright tests execute desktop and touch-capable mobile Chromium for homepage SSR/hydration, keyboard project navigation, Orgo dialog open/initial focus/media readiness/playback control/Escape/focus return, reduced motion, deterministic inline-video failure with poster fallback, generic `404`, and retired `/video-player-lab` `404`.
- **Strictness:** unexpected console errors, uncaught page errors, and failed requests fail the test, with retries disabled. Only the deliberately aborted Orgo request is scoped as expected in media-state tests; the two 404s are isolated so Cloudflare RUM navigation cancellation is not hidden. CI retains failure trace, screenshot, video, HTML, and JSON artifacts.
- **Defects fixed:** reduced-motion hydration mismatch and modal focus-return timing. No UI, CSS, media file, source URL, or player control was removed or redesigned.
- **Evidence:** three consecutive zero-retry local CI matrices passed 36/36; public production passed 12/12; PR #16 run `30706719944`; merge/release `ebcd8b1…` / run `30706793536` / Cloudflare `5c861a15…`. Exhaustive 32-trigger, touch gesture, offline/Slow 3G, 500, external-action, and cross-engine testing remain open under their existing findings.

## Implementation tracking — ITEM-12

- **Status:** `Complete — R-FQA-001 verified in preview and production` (2026-08-03).
- **Coverage:** all 32 desktop media triggers open a labeled viewer, render visible image/video content, contain Tab focus, close by Escape, and restore the exact trigger. Mobile checks first/last media per story; keyboard story changes, dot activation, scrollbar keys, hybrid taps, reduced motion, forced colors, responsive/text scaling, and both 404 recovery paths are also covered.
- **Strictness:** zero retries; unexpected console errors, page exceptions, and request failures fail the run. Only verified navigation/media cancellations are scoped as expected aborts; non-abort failures remain fatal.
- **Evidence:** immutable candidate `30820151411` and production promotion `30822250655` each passed baseline 12/12 plus cross-browser 98/98 applicable, 10 intentional applicability skips, zero retries, zero unexpected results, and zero flaky results. Production HTTP verification passed on attempt 1 against Cloudflare version `91a275a8…`.
- **Runner boundary:** Linux headless WebKit uses the known-good Orgo MP4 for two deterministic decoder-stall checks; the original Pricing and logo MP4s passed the immutable preview on macOS WebKit and return `200 video/mp4` in production. Application, media URLs, and player code are unchanged by the fixture.
