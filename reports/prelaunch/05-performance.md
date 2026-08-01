# 05 — Performance, Core Web Vitals, Bundles, and Media

Audit date: 2026-07-29
Repository: `/Users/mo/Documents/porfolio` at `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a`
Production: `https://m0code.com`
Verdict: **the historical live `/` media-overfetch blocker is complete; launch readiness remains held by separate performance evidence, caching, accessibility, release-control, and rights findings.**

## Environment and method

- Read-only repository review covered source, `package.json`, Vite/TanStack Start configuration, Cloudflare configuration, media references, and the existing `dist/` build. No build, install, source/config/lockfile edit, Git mutation, or external write was performed.
- Existing build inspection used file sizes, gzip estimates, MP4 atom ordering, and direct invocation of `dist/server/server.js` with synthetic `Request` objects. The build is SSR-capable: `/` returned 59,915 bytes and `/video-player-lab` 6,280 bytes.
- Live inspection used HTTP/2 `curl` requests plus Playwright/Chrome 150 Performance APIs, Resource Timing, Event Timing, network responses, DOM counts, console capture, and repeat navigation at 1200×687 and viewport-only 390×844.
- Chrome DevTools MCP was called first as required, but both `list_pages` and `navigate_page` failed because its fixed profile was already owned by another browser process. Therefore no DevTools trace, throttled trace, Lighthouse performance run, or insight set was fabricated.
- “First observed” runs were the first route visits available in the shared browser context; the static-resource cache could not be cleared. “Repeat” runs are explicitly warm/revalidated. The 390×844 runs changed viewport only and retained the desktop Chrome user agent; they are not device emulation.
- Threshold references: [Web Vitals](https://web.dev/articles/vitals) defines good LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 at the 75th percentile. It also states that lab results do not replace field data and that Lighthouse cannot measure INP. [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance) describes trace-based runtime analysis.

## Route and Core Web Vitals evidence

These are single lab observations, not Lighthouse scores, CrUX percentiles, or launch SLO proof.

| Route | Context | TTFB | FCP | LCP | CLS | Load event | Evidence/qualification |
|---|---:|---:|---:|---:|---:|---:|---|
| `/` | First observed, 1200×687, cache uncontrolled | 162 ms | 2,280 ms | 2,280 ms — good, close to threshold | 0 — good | 2,266 ms | LCP was the biography text; 28 resources; route assets were not fully warm. |
| `/` | Repeat, 1200×687 | 162 ms | 472 ms | 472 ms — good | 0 — good | 2,322 ms | LCP was the biography text; repeat still initiated 16 video requests. |
| `/` | Repeat, viewport-only 390×844 | 160 ms | 476 ms | 476 ms — good | 0 — good | 2,285 ms | Desktop UA, no CPU/network throttling; 676 DOM nodes, 17 images, 16 videos. |
| `/video-player-lab` | First observed, 1200×687, cache uncontrolled | 127 ms | 416 ms | 580 ms — good | 0 — good | 582 ms | LCP changed from the 52,870-byte WebP poster to the video. |
| `/video-player-lab` | Repeat, 1200×687 | 111 ms | 264 ms | 280 ms — good | 0 — good | 240 ms | Nine resources; the MP4 response was 354,266 bytes. |
| `/video-player-lab` | Repeat, viewport-only 390×844 | 145 ms | 304 ms | 304 ms — good | 0 — good | 280 ms | Desktop UA, no CPU/network throttling. |

No buffered `longtask` entries were emitted in these observations. This is **not** a trace-derived TBT of 0. One synthetic click on “Mo — reveal portrait” produced an 80 ms Event Timing interaction; this is **not** field INP and is not sufficient to pass interactivity.

## Build and delivery inventory

| Artifact/surface | Existing `dist/` | Live production |
|---|---:|---:|
| Shared client JS | 316,836 B raw / 99,433 B gzip estimate | 316,836 B raw / 99,431 B gzip estimate |
| `/` route JS | 201,202 B raw / 63,979 B gzip estimate | 182,828 B raw / 57,907 B gzip estimate |
| `/` CSS total | 52,061 B raw / 9,577 B gzip estimate | 98,266 B raw / 17,873 B gzip estimate |
| `/video-player-lab` route JS | 5,409 B raw / 2,271 B gzip estimate | same raw/gzip |
| `/video-player-lab` CSS total | 12,842 B raw / 3,519 B gzip estimate | 61,864 B raw / 12,273 B gzip estimate |
| Entire `dist/client` | 37,494,129 B (35.76 MiB) | not enumerated remotely |
| MP4 assets | 17 files / 10,484,332 B | live `/` requested 16 files / 10,190,739 B response content |
| PNG assets | 41 files / 24,241,884 B | live portrait PNG responses were 1.91–2.08 MB each |
| WebP assets | 47 files / 1,944,756 B | current 640 px portraits are 31,426–39,254 B each |

## Confirmed issues

### PERF-05-001 — P1 high — Live `/` deploy overfetches inactive video and multi-megabyte portrait assets

- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original 2026-07-29 finding.
- **Affected:** `https://m0code.com/`; live SSR/client artifact; current replacement logic at `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:686-720`, `:950-990`, and `src/components/v14-exploration-lab/V14ExplorationLab.tsx:17-24`, `:230-316`.
- **Evidence:** Live SSR contains 16 `<video>` elements and 17 `<img>` elements. A repeat network capture requested all 16 videos; response `Content-Length` values totaled 10,190,739 bytes (9.72 MiB). Two initially rendered portrait PNGs added 3,871,799 bytes. Activating the portrait subsequently downloaded `mo-avatar-portrait-05.png` (2,076,391 B), `-06.png` (1,950,214 B), and `-01.png` (2,020,360 B). The live response therefore exposes roughly 13.45 MiB across video plus the two initial portraits before JS/CSS/HTML and continued portrait cycling. In contrast, programmatic SSR of the checked-in `dist/` emits one `<video>` on `/`, preloads a 16,890-byte WebP poster, and current source uses 31–39 KB `*-640.webp` portraits. Live asset hashes also differ from `dist/`; live `/` CSS is 98,266 B raw versus 52,061 B in `dist/`.
- **Reproduction:** Open `/` with Network logging; count `video` requests. Inspect response headers for requests 9–24 and sum `Content-Length`. Click “Mo — reveal portrait,” wait for the cycle, and inspect the newly loaded avatar files. Compare with `node --input-type=module` importing `dist/server/server.js` and calling `default.fetch(new Request("https://local.test/"))`.
- **User/business impact:** Large mobile data usage, contention with critical CSS/JS/LCP resources, slower completion and repeat visits, battery/CPU cost from 16 media elements, and avoidable CDN egress. Slow or metered users may abandon before viewing work.
- **Likely root cause:** Production is serving an older artifact that eagerly SSR-renders/loads all videos and full-resolution PNG portraits; current source contains deferred media gating and small WebP portraits that have not reached production.
- **Recommended improvement:** Treat the current artifact as a candidate, not an automatic fix: deploy only after a controlled preview verifies that inactive slides create no video requests, initial `/` creates one poster and at most one video request, and portraits use only `*-640.webp`.
- **Safer alternatives/tradeoffs:** If a full deploy is risky, ship a narrow production patch that omits inactive `<video>` nodes and swaps portrait URLs; this reduces blast radius but prolongs artifact drift. `preload="metadata"` alone is insufficient because the live responses show full-body 200/206 transfers.
- **Estimated effort:** 0.5–1 day including preview validation and rollback preparation.
- **Dependencies:** Deployment approval, release owner, current build verification, and coordination with functional/responsive audits.
- **Objective verification:** Fresh cache-disabled desktop and emulated-mobile Network traces show one or fewer MP4 requests before interaction, zero portrait requests before reveal, every revealed portrait ≤40 KB WebP, no inactive-slide MP4 bodies, and live HTML/assets match the approved build hashes.
- **Current verification:** production and the current build match at 1 video, 32 images, 32 full-screen triggers, the sole initial Orgo MP4, and the three root route asset hashes. Cache-disabled Chromium desktop/mobile plus Slow 3G mobile each requested exactly one MP4, no pre-reveal portraits, and WebP-only initial images; observed initial media files total 401,726 B desktop and 490,906 B mobile. Portrait reveal loaded only optimized `-640.webp` files; direct production GETs verified all six at 31,426–39,254 B. All 77 referenced production assets returned `200` with expected MIME. Unthrottled desktop/mobile traces measured LCP 492/311 ms and CLS 0. The five-test matrix produced no request, console, or page failures; the retained Orgo viewer remained healthy.

### PERF-05-002 — P2 medium — Static delivery forces revalidation on every repeat visit

- **Affected:** Both routes; hashed `/assets/*.js` and `/assets/*.css`; `/brand/*`, `/avatar/*`, `/portfolio/*`; deployment/cache rules. Relevant deployment configuration: `wrangler.jsonc:1-17`.
- **Evidence:** Live hashed JS, CSS, MP4, WebP, PNG, and SVG samples return `Cache-Control: public, max-age=0, must-revalidate`. Repeat `/video-player-lab` made conditional requests for the SVG, two CSS files, two JS files, and poster (all 304), then fetched the 354,266-byte MP4 as 206. Repeat `/` likewise revalidated shared assets and initiated media requests. Cloudflare returned `cf-cache-status: HIT`, so edge caching is working, but browser freshness is intentionally zero.
- **Reproduction:** Load `/video-player-lab` twice in one browser context and inspect Network; observe 304s for requests 2–7 and a 206 MP4 request. Confirm headers with `curl -I https://m0code.com/assets/index-BTo1nZ1V.js` and an image/media URL.
- **User/business impact:** Every navigation pays network RTT and fails to work from a truly warm browser cache without revalidation; hashed assets receive none of their principal caching benefit. The impact grows on high-latency or unreliable networks.
- **Likely root cause:** Default Workers static-asset headers were retained without content-type/path-specific browser cache rules.
- **Recommended improvement:** Serve content-hashed JS/CSS with `Cache-Control: public, max-age=31536000, immutable`. Fingerprint media filenames or put them behind a versioned path before granting similarly long freshness. Keep HTML short-lived or non-cacheable as required by release behavior.
- **Safer alternatives/tradeoffs:** Use a moderate media `max-age` plus explicit purge on release if fingerprinting is deferred; this reduces repeat latency but risks temporarily stale media. Do not make unhashed mutable assets immutable.
- **Estimated effort:** 0.5–1 day plus deployment validation.
- **Dependencies:** Header/configuration approval, asset versioning decision, CDN purge/rollback procedure, and scope 13 deployment review.
- **Objective verification:** A second navigation within the freshness window makes no network request for hashed JS/CSS; DevTools reports disk/memory cache. Versioned media also avoids revalidation, while HTML still follows the chosen release policy.

## Risks / unverified

### PERF-05-R01 — P2 medium — The first observed `/` load has little LCP headroom without throttling

- **Affected:** `https://m0code.com/`; live route JS/CSS/media dependency graph.
- **Evidence:** The first observable 1200×687 route visit recorded FCP/LCP at 2,280 ms with TTFB 162 ms. This is within the 2.5 s LCP threshold but has only 220 ms headroom on an unthrottled desktop-class browser. Route cache state was not fully controllable, so it is a risk, not a confirmed poor-CWV result.
- **Reproduction:** Start from a genuinely isolated browser profile, disable cache, record five navigations with mobile network and CPU throttling, and compare the median and worst run.
- **User/business impact:** LCP may cross into “needs improvement” for mobile users, reducing perceived quality and undermining a 100-score target.
- **Likely root cause:** Live artifact drift, 157 KB-plus compressed route JS, roughly 18 KB compressed route CSS, and concurrent media requests; a trace is required to assign exact delay.
- **Recommended improvement:** Resolve PERF-05-001 first, then use a DevTools trace to inspect LCP breakdown, render blocking, and the network dependency graph before changing bundles or animations.
- **Safer alternatives/tradeoffs:** Do not remove entrance motion or preload additional assets without trace evidence; the current LCP is text on the first run and speculative preloads can increase contention.
- **Estimated effort:** 0.5 day measurement; remediation unknown until trace evidence exists.
- **Dependencies:** Isolated DevTools browser access and deployment of the approved candidate.
- **Objective verification:** Five cache-disabled mobile traces at an agreed throttle show p50 and worst-run LCP ≤2.5 s and FCP ≤1.8 s, with recorded LCP breakdown and no competing low-priority media.

### PERF-05-R02 — P2 medium — Current `/` JavaScript cost lacks execution and coverage evidence

- **Affected:** Existing `dist/client/assets/index-COTNhO9J.js` and `routes-BXeiZRtJ.js`; imports at `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:1-24`.
- **Evidence:** The current `/` path requires 518,038 bytes raw / 163,412 bytes gzip-estimated JS. The route eagerly imports Motion and the full project rail. No coverage, bottom-up CPU trace, or bundle module report was available; therefore unused-code savings and TBT cannot be claimed.
- **Reproduction:** Load the current production candidate under 4× CPU throttling, capture a Performance trace and JS coverage through initial render plus representative interactions, and generate a bundle composition report without changing build inputs.
- **User/business impact:** Low-end devices may pay parse/compile/hydration cost not visible in desktop wall-clock observations.
- **Likely root cause:** Framework/runtime baseline plus a single feature-dense route chunk containing motion and all portfolio interaction code.
- **Recommended improvement:** Establish route JS budgets, then split or remove code only where trace/coverage proves meaningful savings and preserves SSR/interaction behavior.
- **Safer alternatives/tradeoffs:** Retain the current bundle if measured main-thread work is already below budget; code splitting can add request waterfalls and should not be done solely to reduce raw file size.
- **Estimated effort:** 0.5 day analysis; 1–3 days only if measured remediation is justified.
- **Dependencies:** DevTools trace access and a bundle visualizer already compatible with the existing toolchain; adding a dependency requires separate approval.
- **Objective verification:** Candidate trace records TBT <200 ms with no >50 ms avoidable route tasks, and budget checks keep initial `/` JS at or below the approved compressed limit.

### PERF-05-R03 — P3 low — Responsive-image savings are unquantified

- **Affected:** `DeferredPicture` at `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:585-655` and media declarations in `src/components/v14-exploration-lab/portfolio-data.ts:35-320`.
- **Evidence:** Portfolio images provide WebP plus fallback but no width-descriptor `srcset`/`sizes`; declared sources reach 3,020 px wide. Current WebPs total 1,944,756 bytes and the largest individual WebP is 192,440 bytes. They are deferred and already compact, so no saving is asserted.
- **Reproduction:** On a current-build preview, visit each active project at 390, 768, 1200, and 1920 px, record rendered width and decoded/source dimensions, then encode representative smaller variants and compare bytes/visual quality.
- **User/business impact:** Narrow screens may download more pixels than displayed once deferred galleries are opened.
- **Likely root cause:** One high-resolution WebP per composition simplifies art consistency and fallback handling.
- **Recommended improvement:** Add responsive variants only for assets demonstrating ≥20% byte savings at equal visual quality; prioritize the 192 KB files.
- **Safer alternatives/tradeoffs:** Keep single WebPs where variants save little; extra variants increase build/deployment complexity and cache cardinality.
- **Estimated effort:** 0.5 day analysis; 1–2 days if variants are justified.
- **Dependencies:** Image quality review and an approved generation workflow.
- **Objective verification:** At each breakpoint, `currentSrc` is no more than 2× rendered CSS width and transferred bytes fall ≥20% for changed assets without visible regression.

## Opportunities

### PERF-05-O01 — P2 medium — Add route-level field CWV and performance budgets

- **Affected:** Both routes; release/observability pipeline.
- **Evidence:** No field LCP/INP/CLS dataset or performance budget was available. Lab samples cannot establish 75th-percentile mobile/desktop CWV, and the existing Cloudflare beacon was visible but its dashboard/data was not accessible in this audit.
- **Reproduction:** Inspect current analytics/RUM configuration and release checks; confirm there is no auditable per-route p75 dataset or enforced compressed-JS/media-request budget.
- **User/business impact:** Regressions such as the live 16-video overfetch can ship despite good isolated lab paints.
- **Likely root cause:** Performance telemetry and artifact budgets are not represented in repository scripts or accessible audit evidence.
- **Recommended improvement:** Collect privacy-reviewed LCP, INP, CLS, navigation type, route, and device class; add CI/release budgets for compressed route JS/CSS, initial media request count/bytes, and cache headers.
- **Safer alternatives/tradeoffs:** Use CrUX/PageSpeed route data where coverage exists and a scheduled synthetic monitor otherwise; first-party RUM is more diagnostic but adds privacy/consent and operational considerations.
- **Estimated effort:** 1–2 days.
- **Dependencies:** Privacy approval, observability owner, CI/release scope, and metric retention policy.
- **Objective verification:** Dashboard shows mobile/desktop p75 LCP/INP/CLS per route; CI fails a fixture exceeding agreed JS/CSS bytes or more than one initial `/` MP4 request; alerts have a tested owner/runbook.

## False positives

- Do not report TBT = 0 or INP = 80 ms. No trace-derived TBT was produced, and one synthetic Event Timing sample is not INP.
- Do not infer actual transfer bytes from cached Resource Timing alone. Some live 200/206 media responses exposed zero encoded bytes in Resource Timing; response status and `Content-Length` were used for the confirmed overfetch.
- Do not flag fonts: source uses system stacks, defines no `@font-face`, and live captures made zero font requests.
- Do not flag `/video-player-lab` autoplay/preload solely because it is video. Video is the route’s primary content and observed warm LCP was 280–580 ms; cache policy is the evidenced problem.
- Do not count every file in `dist/client` as initial payload. The 35.76 MiB artifact is a deployment inventory; only observed requests are treated as runtime transfer.
- Do not claim render-blocking savings from the current CSS without trace evidence. Compression is active and current CSS is small; live CSS bloat is primarily evidence of artifact drift.

## Passed checks

- Both live routes returned HTTP/2 200 SSR HTML; TTFB observations were 111–199 ms.
- Existing `dist/server/server.js` rendered both routes without an exception. Current `/` SSR emits one video, reserves media dimensions, uses placeholders, and preloads the 16,890-byte likely hero poster at high priority.
- All measured CLS samples were 0.
- Both routes produced zero console errors and zero warnings after hydration; no hydration mismatch was observed.
- Current source sets explicit width/height on portfolio images and videos, uses async image decoding, lazy loading for non-eager media, priority hints, constrained-connection checks, intersection-based loading, and reduced-motion handling.
- Brotli delivery is supported when the client advertises `Accept-Encoding: br`; gzip is also supported.
- All 17 MP4 files place `moov` before `mdat` (fast-start ordering), based on direct atom-offset inspection.
- No production source maps (`*.map`) were present in `dist/client`.
- No external font request or custom-font layout dependency was observed.
- Lab memory snapshots were modest (approximately 4.6–14.0 MB used JS heap), with 77 DOM nodes on `/video-player-lab` and 676 on live `/`; no memory leak conclusion was attempted.

## Not tested / blocked

- Cold desktop/mobile DevTools traces, LCP breakdown, render-blocking, dependency graph, cache-disabled Chromium media-budget runs, and one Slow 3G mobile media-budget run were completed under ITEM-06. Filmstrips, Speed Index, trace-derived TBT, CPU profile, heap snapshot, and memory-leak loops remain untested.
- Fast 3G/4G, 4× CPU throttling, true mobile UA/touch emulation, packet loss, and offline remain untested.
- Field CrUX/RUM p75 LCP, INP, and CLS: no dataset/dashboard access. No field INP claim is made.
- A browser-served current `dist/` preview: not started to avoid any repository/runtime write. Its SSR output and artifacts were inspected directly, but browser hydration/network behavior still requires preview verification.
- Video codec/profile/bitrate and decode-power analysis: `ffprobe` was unavailable. MP4 fast-start ordering was tested independently.
- Safari/Firefox decode, cache, and memory behavior: outside available performance tooling and covered by the cross-browser specialist.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Disposition:** all `/video-player-lab` measurements and bundle rows above are historical and no longer part of the deployed launch matrix. Site-wide caching, homepage media, field CWV, and stable Lighthouse Performance evidence remain open.
- **Verification:** the rebuilt client/server output has no lab-specific JS/CSS chunk or lab text; `/` still SSRs its retained video; the retained player/data/media hashes are unchanged and browser QA loaded the Orgo video without media or console errors.
- **Production evidence:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; production serves the new root chunks, returns `404` for the lab path, and loads the retained Orgo MP4 successfully. No new CWV or Lighthouse claim is inferred.

## Implementation tracking — ITEM-06

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `PERF-05-001` is complete. Initial media is limited to one Orgo MP4, portraits do not load before reveal, and revealed portraits stay below 40 KB WebP. `PERF-05-002`, performance-score/field-CWV evidence, CPU/bundle analysis, and responsive-image opportunities remain open.
- **Verification:** 5/5 cache-disabled browser scenarios passed across desktop, mobile, Slow 3G, portrait reveal, and Orgo playback; two DevTools traces reported LCP 492/311 ms and CLS 0. SSR/build/live hashes and counts match, and all 77 referenced assets pass status/MIME checks. No runtime source change was required.

## Implementation tracking — ITEM-09

- **Status:** `Complete — release parity made durable` (2026-08-01).
- **Disposition:** the artifact-drift dependency attached to `PERF-05-001` is now closed by automated exact-artifact deployment and live asset/media hashing. Caching, Lighthouse Performance distributions, field CWV, CPU/memory, and remaining bundle/media opportunities stay open.
- **Evidence:** final smoke compared five live generated assets plus the retained Orgo MP4 byte-for-byte with build artifact `8819491987`; the MP4 also played and looped in the production modal without media or console errors.
