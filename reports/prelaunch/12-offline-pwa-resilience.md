# 12 — Offline, PWA, Service Worker, and Network-Failure Resilience

Audit date: 2026-07-29
Repository: `/Users/mo/Documents/porfolio`
Audited deployment: `https://m0code.com`
Scope owner: specialist 12

## Scope and method

This audit was read-only except for this report. No build, install, source/configuration edit, Git mutation, cache purge, service registration, deployment, or external write was performed.

Success criteria were:

1. Both known routes retain useful content when JavaScript, CSS, media, or the network fails.
2. Any declared PWA surface is internally complete and update-safe.
3. Repeat visits and interrupted media requests recover predictably.
4. Failures are visible, actionable, and do not trap the user.
5. Findings distinguish optional installability from confirmed graceful-degradation defects.

Methods and evidence:

- Inspected `package.json`, `vite.config.ts`, `wrangler.jsonc`, route/root setup, router defaults, all image/video rendering paths, connection heuristics, and the existing `dist/`.
- Searched `src/`, `public/`, and `dist/client/` for manifests, service workers, registration, Cache API use, offline pages, storage use, retry/timeout logic, error boundaries, and install icons.
- Invoked the existing `dist/server/server.js` worker in memory with `Request` objects for `/`, `/video-player-lab`, and a missing route. This did not start a server or write files.
- Probed live documents, missing routes, candidate manifest/service-worker URLs, hashed JS/CSS, images, and MP4s with read-only HTTP GET/conditional/range requests.
- Simulated a constrained transfer with `curl --limit-rate 50k`; this is transport throttling, not a browser Slow 3G profile.
- Attempted to use the required in-app browser control, but the browser runtime reported no available browsers. Browser-only assertions are therefore explicitly unverified.
- Repository inventory covered 26 portfolio image records, 17 gallery videos, 119 public files, 125 current `dist/client` files, and a 41,922,560-byte current client artifact.

## Resilience matrix

| Scenario | `/` | `/video-player-lab` | Evidence/status |
|---|---|---|---|
| Fresh live document | HTTP 200 SSR | HTTP 200 SSR | Confirmed by GET |
| Repeat live document | HTTP 200; no validator/cache directive exposed | HTTP 200; same server behavior | Confirmed by repeated GET |
| Cache-disabled document | HTTP 200 | HTTP 200 | Confirmed using `Cache-Control: no-cache` and `Pragma: no-cache` |
| Existing local production worker | HTTP 200, 59,915-byte SSR | HTTP 200, 6,280-byte SSR | Confirmed by in-memory worker invocation |
| Missing route | HTTP 404, generic `Not Found` HTML | N/A | Confirmed live and in existing local worker |
| JavaScript disabled / main JS blocked | Live home is serialized hidden; fails closed | SSR content remains, but tabs/player controls cannot operate | Home failure confirmed from response state; visual browser test unavailable |
| CSS blocked | Semantic SSR remains in HTML | Semantic SSR remains in HTML | Static/HTTP evidence; visual browser test unavailable |
| Offline first visit | No application fallback | No application fallback | Manifest/SW/offline endpoints are 404; browser test unavailable |
| Offline repeat visit | Network-independent replay not guaranteed | Network-independent replay not guaranteed | Assets require immediate revalidation; browser test unavailable |
| Failed preferred image | LQIP remains, but PNG is not selected after a WebP request error | Poster `<picture>` has format fallback | Home behavior confirmed in source; interception test unavailable |
| Failed gallery video | Current source leaves its poster visible | Poster remains beneath the lab video | Confirmed in source; interception test unavailable |
| Failed full-screen viewer video | Blank/inert media area with live-looking controls | N/A | Confirmed in source and live bundle logic; browser test unavailable |
| Interrupted/seeked MP4 | Range request returned full `200` body | Same asset behavior | Confirmed against two live MP4s |
| Slow transfer | HTML 0.26s; main JS 1.59s at 50 KiB/s | Shared main JS behavior | Transport probe; not a WebPageTest/browser profile |
| Reduced motion | Current gallery uses a static poster and suppresses autoplay | No equivalent reduced-motion hook in lab | Confirmed in source; browser rendering unavailable |
| Installability | Not installable | Not installable | No manifest, registration, or install icon set; treated as optional |

## Confirmed Issues

### OFF-12-001 — Live home fails closed when hydration does not start

- **Severity:** `P1 high`
- **Affected:** `https://m0code.com/`; live deployed SSR output. The current repository uses CSS entrance classes at `src/components/v14-exploration-lab/V14ExplorationLab.tsx:333-366` and reduced-motion overrides at `src/components/v14-exploration-lab/V14ExplorationLab.module.css:354-395`; the problematic inline state was not found in the existing local `dist` home article.
- **Evidence:** At 2026-07-29 15:15–15:18 UTC, the live home response serialized `<article ... style="filter:blur(4px);opacity:0;transform:translateY(14px)">`. The visibility transition depends on `/assets/index-BTo1nZ1V.js`. The current local worker instead serializes `<article aria-label="Mo Ibrahim portfolio" ...>` without a hidden article style.
- **Reproduction:** Disable JavaScript or block `/assets/index-BTo1nZ1V.js`, then load `https://m0code.com/`. Independently, `curl -sS https://m0code.com/` and inspect the opening portfolio `<article>` tag.
- **User/business impact:** Script-blocking privacy users, failed/slow module downloads, restrictive networks, browser extension interference, and transient CDN failures receive a visually blank portfolio. The primary conversion content and contact links exist in HTML but are not perceivable.
- **Likely root cause:** The deployed server bundle serializes the initial state of a JavaScript-controlled entrance animation. The deployment also differs from the audited local source/build, where entrance behavior is CSS-based.
- **Recommended improvement:** Make the server-rendered default fully visible and apply entrance motion only as progressive enhancement after hydration. Add an automated no-JavaScript and blocked-main-module gate before deployment.
- **Safer alternatives/tradeoffs:** A `<noscript>` visibility override is a small containment but does not cover a downloaded document whose JavaScript later fails. A short CSS animation from visible-safe defaults preserves motion with less runtime coupling. Disabling the entrance entirely is the most resilient but changes presentation.
- **Estimated effort:** `S` (roughly 0.5 day including regression checks).
- **Dependencies:** Production artifact reconciliation; scope 10 interaction QA; scope 14 release gate; scope 13 deployment/rollback ownership.
- **Objective verification:** With JavaScript disabled and with the main module URL blocked separately, both mobile and desktop renders show the bio, project content, and contact links within one second; computed opacity on the portfolio article is `1`; no element containing primary content has `visibility:hidden` or an equivalent transform/clip hiding it.

### OFF-12-002 — Full-screen video failure has no fallback or actionable state

- **Severity:** `P2 medium`
- **Affected:** Full-screen media viewer opened from video chapters on `/`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:1003-1108`, especially `:1053-1070`. The live route bundle exposes equivalent `ViewerVideo` behavior.
- **Evidence:** `ViewerVideo` renders only a `<video>` plus controls. `onError` at current source line 1060 changes only `playing`; it supplies no poster, failed state, message, retry, timeout, or alternate link. The range remains `max=0`, while the play control continues to look operable.
- **Reproduction:** On `/`, open any video chapter full screen while blocking that chapter’s `.mp4`, returning 404, or interrupting the request before metadata loads. Observe the viewer media area, progress control, and play action.
- **User/business impact:** A transient media/CDN failure produces an unexplained blank frame inside a modal. Users may repeatedly press a control that cannot recover and may conclude the portfolio itself is broken.
- **Likely root cause:** Resilience logic exists in `ResilientVideo` for gallery cards but was not reused by `ViewerVideo`; the viewer state models playback only, not readiness/failure/recovery.
- **Recommended improvement:** Keep the chapter poster visible until video readiness, add an explicit failed state and retry action, disable or hide unusable seek controls, and preserve the close action. Reuse one failure-state contract between card and viewer players.
- **Safer alternatives/tradeoffs:** Fall back permanently to the poster after one error for deterministic behavior; this avoids retry loops but offers no recovery. A bounded manual retry is preferable to automatic retries on metered networks. An external “open media” link can be a final escape hatch but depends on the same origin.
- **Estimated effort:** `S` (0.5–1 day including tests).
- **Dependencies:** Chapter poster data; media-failure fixtures; keyboard/modal regression coverage.
- **Objective verification:** For every video chapter, abort/404/timeout the MP4 before metadata and after playback begins. The poster remains visible, an announced error appears, seek is disabled, one bounded retry can recover when the block is removed, close remains keyboard-operable, and no uncaught console error occurs.

### OFF-12-003 — Live MP4 responses ignore byte-range requests

- **Severity:** `P2 medium`
- **Affected:** All live MP4 assets under `/portfolio/projects/**`; confirmed with `/portfolio/projects/orgo/walkthrough.mp4` and `/portfolio/projects/glazed/studio-scroll.mp4`. Deployment configuration exposes assets through `wrangler.jsonc:8-10`.
- **Evidence:** `Range: bytes=0-1023` against the 354,266-byte Orgo MP4 returned `HTTP/2 200` with the full `Content-Length: 354266`, not `206`/`Content-Range`. `Range: bytes=1048576-1049599` against the 1,213,985-byte Glazed MP4 also returned `200` and the full body. Neither response advertised `Accept-Ranges`. A 50 KiB/s transfer interrupted after 3 seconds downloaded 176,856 of 1,213,985 bytes and cannot be resumed through a byte-range request.
- **Reproduction:** Run `curl -D - -o /dev/null -H 'Range: bytes=0-1023' https://m0code.com/portfolio/projects/orgo/walkthrough.mp4`.
- **User/business impact:** Seeking and recovery after a mobile network interruption can require another full transfer. This wastes data, increases recovery time, and makes the largest media experiences more fragile on lossy networks.
- **Likely root cause:** The current static-asset serving path/CDN behavior does not honor Range for MP4 assets, or a response transformation prevents partial responses.
- **Recommended improvement:** Serve MP4s from a path that supports RFC-compliant byte ranges and validate CDN passthrough. Preserve stable ETags and correct `Content-Type`.
- **Safer alternatives/tradeoffs:** HLS/DASH improves adaptive recovery but adds packaging/player complexity. Smaller segmented MP4 clips reduce retransmission cost but increase request count. Keeping poster-first playback is still required because Range support alone does not provide a failure UI.
- **Estimated effort:** `M` (1–3 days, depending on hosting/CDN capability).
- **Dependencies:** Scope 13 hosting/CDN configuration; media pipeline; regression checks across Safari and Chromium.
- **Objective verification:** Start, suffix, and mid-file Range requests return `206`, an accurate `Content-Range`, requested byte count, and `Accept-Ranges: bytes`; seeking near the end of each video does not redownload the complete file; an interrupted transfer resumes from a later byte.

### OFF-12-004 — Preferred image request failure does not activate the declared fallback

- **Severity:** `P2 medium`
- **Affected:** The 26 portfolio image records rendered by `DeferredPicture`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:585-659` and `src/components/v14-exploration-lab/portfolio-data.ts:10-16`.
- **Evidence:** `fallbackSrc` is placed on `<img src>` while WebP is declared in `<source>` at lines 634-651. For browsers supporting WebP, a network/decoding error of the selected `<source>` does not trigger source reselection to the `<img>` URL. `onError` only sets `status='error'`; it does not replace the URL or retry. The embedded LQIP remains, which prevents a layout collapse but is deliberately blurred and not a full-quality recovery.
- **Reproduction:** In a WebP-capable browser, block one selected `.webp` while allowing its paired `.png`/`.jpeg`, then scroll the relevant chapter into view.
- **User/business impact:** A localized failed image request leaves a blurred placeholder despite a valid alternate asset being available. Portfolio evidence becomes unreadable while the page provides no retry or failure explanation.
- **Likely root cause:** Format fallback and request-failure fallback are treated as the same mechanism; `<picture>` handles unsupported formats, not a failed selected resource.
- **Recommended improvement:** On the preferred image’s error, perform a single explicit switch to `fallbackSrc`, retain the placeholder until the alternate decodes, and expose a stable terminal state if both fail.
- **Safer alternatives/tradeoffs:** A single canonical modern image removes fallback branching but reduces legacy support. An image CDN with negotiated formats centralizes fallback but adds a runtime dependency. Keeping the LQIP as the terminal fallback is cheap but should be an explicit accepted product decision.
- **Estimated effort:** `S` (0.5–1 day with exhaustive asset tests).
- **Dependencies:** Existing paired fallback assets; deterministic request interception in QA.
- **Objective verification:** For all 26 records, fail only WebP and confirm the paired PNG/JPEG reaches `ready`; fail both and confirm a non-shifting terminal fallback; allow both and confirm exactly one preferred full-resolution request.

## Risks / Unverified

### RISK-12-001 — Repeat-offline navigation remains network-dependent

- **Severity:** `P2 medium`
- **Affected:** Both routes and all live hashed JS/CSS/image assets; no repository line because there is no service worker. Static assets are exposed by `wrangler.jsonc:8-10`.
- **Evidence:** No manifest, service worker, registration, Cache API use, or offline page exists in source/public/current dist; live candidate endpoints `/sw.js`, `/service-worker.js`, and `/offline.html` return 404. Live hashed assets respond `Cache-Control: public, max-age=0, must-revalidate`; conditional requests return 304, proving that repeat use works when the network is available but requires validation.
- **Reproduction:** Load each route once, switch the browser offline, close/reopen the tab, and revisit using navigation and hard reload. This exact browser sequence could not be executed in this audit.
- **User/business impact:** A transient disconnect can turn a previously viewed portfolio into a browser network error or prevent route/module/media recovery. Severity depends on whether offline repeat access is a launch requirement.
- **Likely root cause:** The application is currently designed as online-only, while cache directives prioritize revalidation and no application cache strategy exists.
- **Recommended improvement:** First decide and document the offline support contract. If repeat-offline access is required, cache a small app shell/current SSR fallback and only essential assets; do not cache the entire ~40 MiB client artifact.
- **Safer alternatives/tradeoffs:** Accept online-only behavior and add clear failure/retry affordances; this avoids service-worker lifecycle risk. A browser-cache-only policy with long-lived hashed assets improves repeat resilience without a service worker but cannot provide offline navigation guarantees.
- **Estimated effort:** `M` for cache-policy tuning; `L` for a tested service-worker offline contract.
- **Dependencies:** Product decision; scope 05 cache strategy; scope 13 headers/CDN; scope 14 lifecycle tests.
- **Objective verification:** Under the approved contract, an automated clean-profile test distinguishes first-visit offline from repeat-visit offline, exercises both routes, and proves either a branded fallback or documented browser failure without stale mixed-version assets.

### RISK-12-002 — Live deployment and audited local artifact are not the same release

- **Severity:** `P2 medium`
- **Affected:** Deployment/update/rollback path for `/`; live assets versus `dist/client/**`.
- **Evidence:** Live HTML references `index-BTo1nZ1V.js`, `routes-DAvGpumd.js`, `styles-B9P8SFFr.css`, and `routes-BvKEGjiQ.css`; current `dist/client` contains `index-COTNhO9J.js`, `routes-BXeiZRtJ.js`, `styles-DDBD8rJB.css`, and `routes-DKGiQ1HX.css`. The live SSR home is initially hidden, while the existing local worker’s home article is visible by default.
- **Reproduction:** Compare asset URLs from `curl -sS https://m0code.com/` with `find dist/client/assets -maxdepth 1 -type f`; compare the opening home article from live HTML with an in-memory `dist/server/server.js` fetch.
- **User/business impact:** Evidence from the repository/current build cannot fully establish production recovery behavior. A rollback or partial release could reintroduce the JavaScript-dependent blank page or omit newly added poster assets.
- **Likely root cause:** Production release identity is not exposed in the response/report, or the workspace `dist` was created after the deployed version.
- **Recommended improvement:** Attach commit and immutable artifact identifiers to every release, verify the exact saved artifact before deploy, and retain an atomic rollback mapping.
- **Safer alternatives/tradeoffs:** A response header with commit SHA is simpler than a public build page. A generated release manifest is more auditable but must not expose secrets. Avoid relying solely on filenames because server and client bundles can still be mismatched.
- **Estimated effort:** `S–M` (0.5–2 days depending on release tooling).
- **Dependencies:** Scope 13 deployment process; scope 14 release gates.
- **Objective verification:** A single production release ID maps to a repository commit and archived build checksum; live server/client asset hashes match that archive; rollback restores the prior complete ID atomically.

### RISK-12-003 — Route/module failures have no product-specific recovery boundary

- **Severity:** `P2 medium`
- **Affected:** Root/router configuration at `src/routes/__root.tsx:10-30` and `src/router.tsx:5-11`; both routes.
- **Evidence:** No route-level or router-level `errorComponent`, pending recovery component, or application error boundary is configured. The existing worker emits the framework’s generic `<p>Not Found</p>` and logs a warning for missing routes. Main/route chunk failure behavior could not be intercepted in a browser.
- **Reproduction:** Block the current route chunk after loading another route, trigger client navigation or a lazy import, and observe whether the framework fallback offers retry/home/reload actions.
- **User/business impact:** A deploy race, failed dynamic import, or corrupted cached module may present a generic framework error or inert SSR controls with no recovery path.
- **Likely root cause:** Router defaults are relied on, and no failure UX/reload policy has been defined.
- **Recommended improvement:** Add a minimal root/route recovery boundary with retry, safe full reload, and home navigation; log only sanitized diagnostics.
- **Safer alternatives/tradeoffs:** A full-reload-on-preload-error handler is small but can loop if the new asset is genuinely unavailable. A richer error boundary improves guidance but adds UI/test surface. Bound reload attempts per release/session.
- **Estimated effort:** `S–M` (1–2 days with failure tests).
- **Dependencies:** Router behavior documentation; observability policy; scope 10 and scope 14 tests.
- **Objective verification:** Inject CSS and JS chunk 404/timeout errors on each route; one bounded recovery succeeds after restoring the asset, no reload loop occurs, and an accessible fallback remains when recovery fails.

### RISK-12-004 — Mid-stream stalls are not represented as a state

- **Severity:** `P3 low`
- **Affected:** Gallery and viewer video flows at `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:883-990` and `:1017-1070`; lab player at `src/components/video-player-lab/VideoPlayerLab.tsx:76-148`.
- **Evidence:** Handlers cover `error`, `loadeddata`/`canplay`, pause, and playing, but not `waiting`, `stalled`, `suspend`, `abort`, or a bounded readiness timeout. No retry/backoff policy exists. A true browser stall was not induced.
- **Reproduction:** Begin playback, throttle to an unstable profile, then abort or indefinitely delay the next media bytes without issuing a terminal error.
- **User/business impact:** A frozen frame may look like intentional pause; the user receives no loading state or recovery action.
- **Likely root cause:** The state machines model initial readiness and terminal error, not transport degradation after playback starts.
- **Recommended improvement:** Model `waiting/stalled/recovering/failed`, show a non-blocking status after a short threshold, and offer manual retry after a bounded timeout.
- **Safer alternatives/tradeoffs:** Native controls provide some platform feedback but alter the visual design. Automatic restart may waste metered data; prefer a manual retry after one short automatic recovery attempt at most.
- **Estimated effort:** `M` (1–3 days including cross-browser tests).
- **Dependencies:** Media failure harness; approved player UX; browser matrix.
- **Objective verification:** Deterministic stalled/aborted media tests show and announce the correct state, preserve the poster or last frame, recover once transport resumes, and never retry indefinitely.

## Opportunities

### OPP-12-001 — Add installability only if it is a product requirement

- **Severity:** `P3 low`
- **Affected:** Root head at `src/routes/__root.tsx:10-28`; `public/`; both routes.
- **Evidence:** No `manifest.webmanifest`, `manifest.json`, `site.webmanifest`, manifest `<link>`, 192/512 install icons, maskable icon, theme color, service-worker registration, or install UX exists. All three common manifest URLs return 404 live. The current SVG favicon alone is not an installability definition.
- **Reproduction:** Inspect the root head and candidate manifest URLs; run the browser installability check when a manifest is added.
- **User/business impact:** Users cannot install the portfolio as an app. There is no evidence that installability is currently promised, so this is not a launch defect.
- **Likely root cause:** PWA installation has not been selected as a product capability.
- **Recommended improvement:** Decide explicitly. If approved, add a validated manifest, purpose-specific icons, start URL/scope/display/theme, and only then introduce a lifecycle-tested service worker.
- **Safer alternatives/tradeoffs:** Keep the site non-installable and focus on progressive enhancement; this is simpler and avoids update/cache complexity. Adding a manifest without offline behavior enables install affordances but can create misleading expectations.
- **Estimated effort:** `S` for manifest/icons; `L` when bundled with production-grade offline/update behavior.
- **Dependencies:** Brand assets; product decision; scope 08 metadata; scope 13 headers; scope 14 install/update tests.
- **Objective verification:** Chromium installability reports no errors; installed launch uses the intended scope/start URL; 192/512/maskable icons render correctly; update/uninstall behavior is documented and tested.

### OPP-12-002 — Define a deliberately small offline shell instead of precaching media

- **Severity:** `P3 low`
- **Affected:** Potential future service worker; current ~40 MiB `dist/client`; both routes.
- **Evidence:** The current client artifact is 41,922,560 bytes, including 25 MiB under portfolio project media and 15 MiB under avatars. No storage-budget or quota strategy exists because no application storage is currently used.
- **Reproduction:** Inventory `du -sh dist/client` and its largest files; model a clean install with an explicit cache allowlist.
- **User/business impact:** If a service worker is added naively, precaching the artifact can waste data, hit mobile eviction pressure, delay activation, and create stale-media update problems.
- **Likely root cause:** Offline caching has not yet been designed, so there is no cache budget or media policy.
- **Recommended improvement:** If offline support is approved, precache only the shell, root CSS/JS, favicon, and one lightweight fallback; runtime-cache viewed media with strict entry/byte/age limits and purge by release.
- **Safer alternatives/tradeoffs:** Cache no media and show posters only offline; lowest quota risk but less content. Cache a curated “featured project” set; better offline value but requires editorial/version ownership.
- **Estimated effort:** `M–L` (3–7 days with lifecycle/quota tests).
- **Dependencies:** OPP-12-001 decision; performance asset budget; release ID; browser storage testing.
- **Objective verification:** Fresh install cache stays below an approved byte budget; quota-pressure tests preserve shell recovery; old release caches are removed after activation; media eviction never prevents navigation or update.

## False Positives

- **No service worker is not automatically a defect.** No install/offline promise was found. It becomes a launch requirement only if product owners require repeat-offline access or installability.
- **404 service-worker candidates are correct today.** `/sw.js` and `/service-worker.js` return real 404 responses rather than an HTML app shell with status 200, avoiding accidental registration of HTML as JavaScript.
- **No stale service-worker controller was found.** With no registration code or SW asset, there is no current cache-version cleanup, skip-waiting, scope-conflict, or controller-takeover bug to report.
- **No storage-quota/data-sync defect applies.** The application does not use IndexedDB, Cache Storage, localStorage, or persisted user state.
- **The declared PNG/JPEG sources are valid format fallbacks.** OFF-12-004 concerns request/decoding failure after WebP has already been selected, not unsupported-WebP fallback.

## Passed Checks

- Live `/` and `/video-player-lab` return SSR HTML with status 200; a fabricated route returns status 404.
- The existing local worker returns 200 for both routes and 404 for the fabricated route.
- Current local `/` SSR does not serialize the whole portfolio article at opacity 0.
- Both routes expose meaningful semantic text in SSR; `/video-player-lab` remains readable without hydration even though controls cannot function.
- Current gallery video cards preserve a poster when reduced motion is requested or video playback fails.
- The lab player keeps a poster `<picture>` underneath the video and marks failed playback as not ready.
- Current gallery code suppresses adjacent-story prewarming for Save-Data, slow-2g/2g/3g, downlink below 2 Mbps, or RTT above 500 ms (`CrossAxisProjectRail.tsx:390-410, 716-721`).
- All 17 poster URLs derived by the current gallery source exist in both `public/` and the existing `dist/client/`.
- Hashed live JS/CSS responses are Brotli-compressed when requested, served from a Cloudflare cache hit, expose ETags, and return 304 for matching conditional requests.
- Live missing manifest/SW/offline URLs return 404 rather than silently falling back to the app document.
- No third-party runtime API fetch, background sync, push, periodic sync, or queued mutation exists, so there is no unflushed offline write path.

## Not Tested

- Actual browser fresh/repeat/offline reloads, Cache Storage contents, active service-worker registrations, storage estimates/eviction, install prompt, and update lifecycle: no in-app browser was available.
- Browser DevTools request interception for failed main JS, route JS, CSS, document, images, and video.
- True Slow 3G/latency/loss behavior, CPU/memory under stalls, and mobile radio transitions; only byte-rate throttling was performed.
- Safari, Firefox, Chromium, iOS, and Android differences in offline navigation, autoplay, media ranges, and cache revalidation.
- Screen-reader announcements and keyboard behavior of newly failed/stalled states; the current viewer has no such state to test.
- A genuine server 500 response and recovery page; no safe deterministic error trigger exists in the audited routes.
- DNS failure, TLS interruption, captive portal, proxy rewriting, HTTP/3 fallback, and mid-deploy asset unavailability.
- Real rollback/update across two releases and mixed-version client/server artifacts.
- Whether HTTP cached assets with `must-revalidate` are reused by each target browser during offline history traversal; this behavior must be measured, not assumed.

## Implementation tracking — ITEM-01

- **Status:** `Verified locally — production verification pending` (2026-07-31).
- **Disposition:** all lab-specific resilience rows and references are retired from the local candidate. Homepage media recovery, offline navigation, service-worker/PWA policy, failure boundaries, and deployment-drift risks remain open.
- **Verification:** the retired path is a real local `404`, the new build has no lab route/chunk, and the retained homepage video path, source code, poster, and MP4 are unchanged; focused browser QA loaded that video without media or console errors.
- **Tracking rule:** no offline/PWA success is inferred from route removal; mark ITEM-01 complete only after deployed route and retained-player checks pass.
