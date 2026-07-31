# 06 — Lighthouse mobile and desktop readiness

Audit date: 2026-07-29
Repository: `/Users/mo/Documents/porfolio` at `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a`
Production: `https://m0code.com`
Verdict: **not ready for an honest all-100 claim.** Both live routes scored 96 Accessibility because of confirmed contrast failures. Performance was excluded by the available Lighthouse MCP audit and no performance score is claimed.

## Method, versions, and limitations

- Inspected the real source, existing `dist/`, live SSR HTML, live assets, and the four Lighthouse JSON reports. No build, install, source/config/lockfile edit, dependency change, Git mutation, or external write was performed.
- Served the already-existing `dist/` with `bun run preview` only long enough to compare SSR output, then stopped it. Local Lighthouse navigation scoring was blocked because this specialist's Chrome DevTools MCP process could not acquire its shared browser profile.
- Live navigation audits used Chrome DevTools MCP `lighthouse_audit`, Lighthouse **13.4.0**, axe-core **4.12.0**, and host Chrome **150.0.0.0**.
- All four reports used `mode=navigation`, storage reset enabled, `onlyCategories=["accessibility","seo","best-practices","agentic-browsing"]`, `onlyAudits=null`, `skipAudits=null`, and no blocked URL patterns. The tool explicitly excludes Performance.
- Mobile profile: `formFactor=mobile`, 412×823, DPR 1.75, simulated 150 ms RTT / 1,638.4 Kbps / 4× CPU. Desktop profile: `formFactor=desktop`, 1350×940, DPR 1. See LH-06-R02 for a desktop user-agent caveat.
- One live run was captured per route/device. Scores are observations, not a distribution. Lighthouse documents score variability and says a perfect Performance 100 is extremely difficult and not expected: [performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/). Accessibility is a pass/fail weighted average, so one affected element fails the entire audit: [accessibility scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring/).
- Separate Chrome DevTools Performance traces were collected immediately before `2026-07-29T15:01:03Z`, at 390×844 viewport, 1× CPU, and no network throttling. They are **not mobile emulation, not Lighthouse runs, and not performance scores**.
- Temporary Lighthouse JSON files were kept outside the repository:

| Route/profile | JSON artifact | SHA-256 |
|---|---|---|
| `/`, mobile | `chrome-devtools-mcp-q0vne0/report.json` | `be4534bccf6f3d7e093b4ec95dd8ca868c548cef7e5c67a7b6b0a6354153405a` |
| `/`, desktop | `chrome-devtools-mcp-8ZU7WO/report.json` | `a34f96fb5a74a2b9ccd6fa7a5a70555ece986eeae2d35c212f9d35bdf4cbce05` |
| `/video-player-lab`, mobile | `chrome-devtools-mcp-AZmCVq/report.json` | `84da3923c866cca02b0c31790349f5c3571f9abef123c28212593cd0f8ad54e1` |
| `/video-player-lab`, desktop | `chrome-devtools-mcp-fonC6R/report.json` | `a2145ff0cdb0d94de46f4bef9de2cfb7777e274e5563d76b4e99a8b8ae1667a2` |

## Score matrix

`—` means the category was not produced; it does not mean zero or pass.

| Route | Profile | Lighthouse fetch time (UTC) | Performance | Accessibility | Best Practices | SEO | Agentic Browsing | Failing scored audit |
|---|---|---:|---:|---:|---:|---:|---:|---|
| `/` | Mobile | 2026-07-29 14:56:50.839 | — | **96** | 100 | 100 | 100 | `color-contrast` (5 nodes) |
| `/` | Desktop | 2026-07-29 14:57:27.496 | — | **96** | 100 | 100 | 100 | `color-contrast` (1 node) |
| `/video-player-lab` | Mobile | 2026-07-29 14:57:50.718 | — | **96** | 100 | 100 | 100 | `color-contrast` (1 node) |
| `/video-player-lab` | Desktop | 2026-07-29 14:58:06.934 | — | **96** | 100 | 100 | 100 | `color-contrast` (1 node) |

Single-run variability is unknown. The same category scores repeated across profiles, but that is not statistical proof of stability.

## Separate performance-trace evidence

| Route | Context | TTFB | LCP | CLS | Trace insight |
|---|---|---:|---:|---:|---|
| `/` | 390×844 viewport, 1× CPU, unthrottled; `NAVIGATION_0` | 169 ms | 332 ms (163 ms render delay) | 0 | `RenderBlocking` estimated 334 ms FCP/LCP savings |
| `/video-player-lab` | Same context; `NAVIGATION_0` | 60 ms | 480 ms (10 ms load delay, 84 ms load, 325 ms render delay) | 0 | `RenderBlocking` estimated 158 ms FCP and 0 ms LCP savings |

These warm-state/unknown-cache traces have no CrUX data, Speed Index, trace-derived TBT, mobile CPU/network throttle, or Lighthouse scoring curve. They show good unthrottled paint and layout stability, but cannot establish a mobile Performance 100.

## Confirmed issues

### LH-06-001 — P1 high — Portfolio captions fail contrast and cap Accessibility at 96

- **Affected:** `https://m0code.com/`; `src/components/v14-exploration-lab/CrossAxisProjectRail.module.css:458-475`, `:565-575`, `:613-620`; captions rendered at `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:823-828`.
- **Evidence / audit IDs:** Lighthouse 13.4.0 `color-contrast` scored 0 on mobile and desktop. The foreground `#d79d40` on `#f1e9d9` measured **1.98:1** at 8.32 px bold; 4.5:1 is required. Mobile reported all five visible Orgo captions; desktop reported the first. Accessibility score was 96 in both runs.
- **Reproduction:** Run an unmodified Lighthouse navigation audit on `/` for mobile or desktop; open `Accessibility → color-contrast`; inspect `div…figure…figcaption > span`.
- **User/business impact:** Low-vision users may not read project captions. The site fails the automated WCAG 2 AA contrast check and cannot score Accessibility 100.
- **Likely root cause:** `.storyChapter figcaption span:first-child` inherits the gold story accent while the editorial card sets a pale `#f1e9d9` background; the very small 0.52 rem type amplifies the failure.
- **Recommended improvement:** Choose a caption foreground that reaches at least 4.5:1 against the actual editorial card background in every story theme, then visually review the brand treatment. Preserve a distinct accent through border, icon, weight, or decoration if necessary.
- **Safer alternatives / tradeoffs:** Increasing type to the WCAG large-text threshold can reduce the required ratio to 3:1 but materially changes layout and still needs proof; darkening only the Orgo caption color is the smallest change but requires checking every theme and state.
- **Estimated effort:** 1–3 hours including theme and breakpoint validation.
- **Dependencies:** Design approval and WCAG specialist review.
- **Objective verification:** Lighthouse `color-contrast` passes on `/` mobile and desktop; axe reports zero caption failures; computed colors independently measure ≥4.5:1 at every project/theme/breakpoint; visual regression review passes.

### LH-06-002 — P1 high — Video-lab footer text fails contrast and caps Accessibility at 96

- **Affected:** `https://m0code.com/video-player-lab`; `src/components/video-player-lab/VideoPlayerLab.module.css:557-572`; footer content at `src/components/video-player-lab/VideoPlayerLab.tsx:255-260`.
- **Evidence / audit IDs:** Lighthouse `color-contrast` scored 0 on both profiles. The footer description measured **3.79:1**, `#74828c` on `#fffaf0`, at 9.28 px bold; expected 4.5:1. Accessibility was 96.
- **Reproduction:** Run an unmodified Lighthouse navigation audit on `/video-player-lab`; inspect `main…div.preview > footer > span` under `color-contrast`.
- **User/business impact:** The selected variant description is hard to read for low-vision users and blocks the requested Accessibility 100.
- **Likely root cause:** `rgb(16 43 67 / 58%)` is composited over the paper background at a very small 0.58 rem size.
- **Recommended improvement:** Increase the effective foreground opacity/darkness until the computed composite reaches ≥4.5:1 while retaining the intended secondary hierarchy.
- **Safer alternatives / tradeoffs:** Increasing font size/weight may improve legibility but does not remove the need to verify the required ratio; using the full navy is safest for contrast but creates stronger visual emphasis.
- **Estimated effort:** Under 1 hour plus validation.
- **Dependencies:** Design approval and accessibility verification.
- **Objective verification:** Both mobile and desktop Lighthouse runs score `color-contrast=1`; independent computed-color measurement is ≥4.5:1; the footer remains readable at 200% zoom.

### LH-06-003 — P1 high — Live `/` is not the reviewed production candidate and still overfetches media

- **Affected:** Live `/`; existing `dist/client`; current loading logic at `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:686-721`, `:861-990`, `:1375-1387`; avatar sources at `src/components/v14-exploration-lab/V14ExplorationLab.tsx:17-24`.
- **Evidence / audit IDs:** Live SSR contains 16 `<video>` and 18 `<img>` elements; the existing `dist` preview contains 1 `<video>` on `/`. Live asset hashes differ from `dist`. The performance specialist's browser capture confirmed all 16 live videos transferred 10,190,739 bytes; see [05-performance.md](./05-performance.md#perf-05-001--p1-high--live--deploy-overfetches-inactive-video-and-multi-megabyte-portrait-assets). Lighthouse Performance was excluded, so no score effect is invented.
- **Reproduction:** Download live `/` and count `<video>` tags; compare with the existing `dist` preview. In a clean browser, record initial Network requests and count MP4 bodies before interaction.
- **User/business impact:** Mobile bandwidth, CPU, battery, and critical-resource contention threaten repeatable Performance 100s and can cause abandonment on constrained connections.
- **Likely root cause:** Production serves an older artifact that predates the current deferred-media and small-WebP portrait logic.
- **Recommended improvement:** Reconcile and approve the candidate artifact before performance tuning; deploy only after preview validation proves inactive media is not requested.
- **Safer alternatives / tradeoffs:** A narrow production patch that removes inactive video elements and replaces full-resolution portraits reduces release scope but prolongs artifact drift. `preload="metadata"` alone does not prevent the observed transfers.
- **Estimated effort:** 0.5–1 day including release verification and rollback preparation.
- **Dependencies:** Release/deployment authorization, scope 05 performance fixes, scope 13 rollback plan, and functional QA.
- **Objective verification:** Live build hashes match the approved artifact; fresh `/` navigation makes at most one initial MP4 request and no portrait request before reveal; transferred initial media is within an approved budget; five cold mobile Lighthouse Performance runs meet the acceptance gate below.

## Risks / unverified

### LH-06-R01 — P1 high — No Lighthouse Performance score exists for either route/device

- **Affected:** Both live routes on mobile and desktop; release score claim.
- **Evidence / audit IDs:** Every JSON report has `onlyCategories` limited to Accessibility, SEO, Best Practices, and Agentic Browsing. `categories.performance` is absent. No installed Lighthouse CLI was available. Separate traces were unthrottled 390×844 viewport captures and cannot be converted into a Lighthouse score.
- **Reproduction:** Inspect any of the four JSON files; `categories.performance` is missing and no FCP/Speed Index/LCP/TBT/CLS weighted Performance score is present.
- **User/business impact:** Publishing “100 Lighthouse” would be unsupported. Mobile regressions can remain hidden despite four visible 100 category badges.
- **Likely root cause:** The Chrome DevTools MCP Lighthouse tool intentionally excludes Performance and instructs callers to use traces; this specialist's MCP profile was unavailable for additional isolated work.
- **Recommended improvement:** Run Lighthouse 13.4.0 or the pinned release version in an isolated Chrome profile with the default Performance category, mobile and desktop, five cold navigations per route, with raw JSON retained.
- **Safer alternatives / tradeoffs:** PageSpeed Insights is independently hosted and useful for corroboration but adds service/load variability; Lighthouse CI is reproducible but requires a separately approved dependency/configuration change.
- **Estimated effort:** 0.5 day to establish evidence; remediation unknown until reports exist.
- **Dependencies:** Isolated Chrome/Lighthouse availability and an approved candidate deployment.
- **Objective verification:** Eight route/profile Performance report sets exist (live and candidate, two routes, two profiles), each exposes `categories.performance.score`, all five runs per set are retained, and no audit is skipped, blocked, delayed, or suppressed.

### LH-06-R02 — P2 medium — Desktop reports retain a mobile emulated user agent

- **Affected:** The two desktop score rows; tool configuration/evidence labeling.
- **Evidence / audit IDs:** Both desktop JSON files say `formFactor=desktop` and 1350×940/DPR 1, but `configSettings.emulatedUserAgent` is Android 11 / moto g power / Chrome 136 Mobile while the host is Chrome 150 desktop.
- **Reproduction:** Inspect `configSettings.formFactor`, `screenEmulation`, and `emulatedUserAgent` in the desktop JSON reports.
- **User/business impact:** The scores remain valid for the reported Lighthouse configuration, but they are not clean proof of a standard desktop-UA run and may miss UA-dependent behavior.
- **Likely root cause:** Chrome DevTools MCP's Lighthouse wrapper reused its mobile emulated user-agent setting while switching form factor and screen emulation.
- **Recommended improvement:** Corroborate desktop scores with a pinned standard Lighthouse desktop preset and confirm the requested/final URL, UA, viewport, and throttling in saved JSON.
- **Safer alternatives / tradeoffs:** Retain these runs as form-factor/viewport evidence if the site is UA-independent, but label them precisely and do not present them as the only desktop proof.
- **Estimated effort:** Under 1 hour.
- **Dependencies:** Isolated Lighthouse runner or corrected MCP configuration.
- **Objective verification:** New desktop JSON shows `formFactor=desktop`, 1350×940 or the agreed viewport, and a desktop emulated user agent; category results match across five runs.

### LH-06-R03 — P2 medium — Single runs do not prove stable 100s

- **Affected:** Both routes and all four scored categories.
- **Evidence / audit IDs:** Only one run exists per route/device. Benchmark index varied from 4098.5 to 4206.5. Official Lighthouse guidance identifies machine, routing, extensions, and page variability as score inputs.
- **Reproduction:** Repeat five cold audits per route/profile in isolated profiles and compare raw scores, audit outcomes, and benchmark index.
- **User/business impact:** A launch claim based on one run may fail in CI, on another machine, or for a reviewer, reducing trust.
- **Likely root cause:** This is a one-time prelaunch observation, not a controlled performance/audit distribution.
- **Recommended improvement:** Report all iterations, median, minimum, maximum, tool version, machine benchmark, and exact candidate hash. Claim a stable 100 only if every retained run is 100.
- **Safer alternatives / tradeoffs:** A median-only gate tolerates noise but is not an honest “always 100” claim; a minimum-score gate is stricter and can be flaky without a controlled runner.
- **Estimated effort:** 1–2 hours per candidate.
- **Dependencies:** Pinned runner, isolated browser, stable test origin, and artifact retention.
- **Objective verification:** Five consecutive cold runs for every route/profile have retained JSON and identical 100 category scores; any deviation is reported rather than discarded.

### LH-06-R04 — P2 medium — Automated 100s exclude material manual and informative audits

- **Affected:** Both routes; Accessibility, SEO, Best Practices, and Agentic Browsing interpretation.
- **Evidence / audit IDs:** `structured-data` is manual; `canonical` is `notApplicable`; `csp-xss`, `has-hsts`, `origin-isolation`, `clickjacking-mitigation`, and `trusted-types-xss` are informative; keyboard/focus/manual accessibility audits are unscored; Agentic Browsing weights only `agent-accessibility-tree` and `cumulative-layout-shift`, while WebMCP and `llms-txt` were not applicable.
- **Reproduction:** Inspect zero-weight audit references and each audit's `scoreDisplayMode` in the Lighthouse JSON.
- **User/business impact:** A 100 badge can be mistaken for complete SEO, security, accessibility, or agent-readiness validation.
- **Likely root cause:** Lighthouse deliberately scopes and weights automated audits; unsupported or manual checks do not reduce category scores.
- **Recommended improvement:** Pair Lighthouse with the manual acceptance gates in scopes 03, 07–09, and 11; publish the exact categories and exclusions with any score claim.
- **Safer alternatives / tradeoffs:** Keep Lighthouse as a fast regression signal, but never use it as the sole launch decision or WCAG/security certification.
- **Estimated effort:** 0.5–1 day to execute and collate the cross-scope gates.
- **Dependencies:** Security, SEO/metadata, and accessibility reports.
- **Objective verification:** Master launch evidence links each unscored/manual audit to an owner, test result, and acceptance criterion; no category 100 is represented as broader certification.

## Opportunities

### LH-06-O01 — P2 medium — Add a pinned, unmodified Lighthouse release matrix

- **Affected:** CI/release readiness for `/` and `/video-player-lab`.
- **Evidence / audit IDs:** No repository Lighthouse/CI script or stored score budget exists; current evidence is manual and Performance is missing.
- **Reproduction:** Inspect `package.json` scripts and repository configuration; no Lighthouse runner, assertions, artifact upload, or route/device matrix is defined.
- **User/business impact:** Contrast, deploy-drift, and performance regressions can recur without an objective pre-release gate.
- **Likely root cause:** Lighthouse has not been integrated into the release process.
- **Recommended improvement:** After dependency/configuration approval, pin the Lighthouse version; audit both routes/mobile/desktop; retain JSON/HTML; fail on any category below the approved threshold or any unexpected not-applicable/error result.
- **Safer alternatives / tradeoffs:** A scheduled external monitor avoids adding a build dependency but is less deterministic; a local release checklist is simpler but easier to skip.
- **Estimated effort:** 0.5–1 day.
- **Dependencies:** Scope 14 CI authorization, stable preview URL, browser runtime, artifact storage, and flake policy.
- **Objective verification:** A pull request check runs the full matrix without skipped audits, uploads every report, and demonstrably fails when a fixture introduces low contrast or exceeds a score threshold.

### LH-06-O02 — P2 medium — Investigate root render-blocking work after artifact reconciliation

- **Affected:** Live `/`; root and route stylesheet delivery from `src/routes/__root.tsx:24-27` and Vite-generated route CSS.
- **Evidence / audit IDs:** The separate unthrottled `NAVIGATION_0` trace reported `RenderBlocking` estimated FCP/LCP savings of 334 ms on `/`. The video-lab insight estimated 158 ms FCP but 0 ms LCP savings, so it is not prioritized for LCP.
- **Reproduction:** On the approved candidate, capture five cache-disabled mobile-throttled DevTools traces and analyze `RenderBlocking`, request chains, and LCP breakdown.
- **User/business impact:** Avoidable CSS blocking may consume the narrow margin needed for repeatable mobile Performance 100s.
- **Likely root cause:** Two document stylesheets are required before first paint; production artifact drift and concurrent media loading may magnify the cost. The trace is insufficient to assign exact source bytes.
- **Recommended improvement:** First reconcile the deploy and repeat traces; only then extract/inline truly critical CSS or defer demonstrably non-critical rules based on coverage and dependency evidence.
- **Safer alternatives / tradeoffs:** Retain the current CSS if repeated throttled traces show negligible savings; critical-CSS inlining increases HTML size and cache duplication, while deferral can cause FOUC/CLS.
- **Estimated effort:** 0.5 day measurement; 1–2 days only if remediation is justified.
- **Dependencies:** LH-06-003, scope 05 performance work, a controlled candidate preview, and CSS coverage tooling.
- **Objective verification:** Five throttled candidate traces show no material render-blocking opportunity, no FOUC/CLS, and improved or unchanged FCP/LCP; subsequent Lighthouse Performance reports retain the target score.

## False positives and score-interpretation traps

- **Do not report Performance 0 or 100.** The category is absent, not failed or passed.
- **Do not treat the five mobile `/` nodes as five root causes.** One shared CSS rule causes the same contrast failure; desktop found one visible instance but the systemic rule remains.
- **SEO 100 does not prove sitemap, canonical, or structured-data readiness.** `robots-txt` only passed Lighthouse's validity audit; `/sitemap.xml` returned 404, `canonical` was not applicable, and structured data was manual.
- **Best Practices 100 does not mean CSP/HSTS/security headers passed.** Those audits were informative/unscored.
- **Agentic Browsing 100 is narrow.** Only accessibility-tree availability and CLS were weighted; WebMCP and `llms.txt` were not applicable.
- **CLS 0 is a passed navigation observation, not field p75 proof.**
- **The separate trace metrics must not be converted into a Lighthouse score.** Lighthouse Performance uses weighted metric scoring distributions, not threshold counting.

## Passed checks

- Aside from `color-contrast`, every scored audit reference passed in all four navigation reports.
- `/`: 21 of 22 weighted Accessibility audits, 12 of 12 Best Practices audits, 9 of 9 SEO audits, and 2 of 2 Agentic Browsing audits passed.
- `/video-player-lab`: 25 of 26 weighted Accessibility audits, 12 of 12 Best Practices audits, 9 of 9 SEO audits, and 2 of 2 Agentic Browsing audits passed.
- `document-title`, `meta-description`, `is-crawlable`, `http-status-code`, `crawlable-anchors`, `robots-txt`, `image-alt`, and `hreflang` passed Lighthouse's scored checks on both routes/profiles.
- `is-on-https`, `doctype`, `charset`, `deprecations`, `errors-in-console`, `inspector-issues`, `image-aspect-ratio`, and `image-size-responsive` passed on both routes/profiles.
- `html-has-lang`, `html-lang-valid`, `heading-order`, `image-alt`, `button-name`, `link-name`, `meta-viewport`, `target-size`, and one-main-landmark checks passed where applicable.
- Lighthouse's `cumulative-layout-shift` numeric value was 0 in all four reports; the separate traces also reported CLS 0.
- No audit was disabled, skipped, blocked, or delayed to improve a score.

## Not tested / blocked

- Lighthouse Performance scores, FCP/Speed Index/LCP/TBT/CLS sub-scores, diagnostics, and opportunities for either route/profile.
- Local `dist` Lighthouse scores and hydration behavior. Static SSR and artifacts were inspected, but the shared Chrome DevTools profile collision prevented local navigation audits.
- Five-run variability, fully cache-disabled traces, Slow 3G, 4× CPU performance traces, true mobile UA/touch traces, and field CrUX/RUM p75 LCP/INP/CLS.
- Dynamic-state Lighthouse snapshots after every project, modal, tab, playback state, error state, reduced-motion state, or JavaScript-disabled state. These belong to functional/accessibility/responsive specialists and are not implied by navigation scores.
- Manual Accessibility audits, screen-reader behavior, zoom/reflow, high contrast, and complete keyboard order.
- Manual structured-data validation, canonical correctness, sitemap coverage, security-header strength, or privacy/consent behavior.
- Safari/Firefox Lighthouse-equivalent evidence; Lighthouse is Chromium-based.

## Honest 100-score acceptance gate

1. Reconcile the approved candidate with live production and record commit plus deployed asset hashes.
2. Fix LH-06-001 and LH-06-002; independently verify all affected colors before rerunning.
3. Use one pinned Lighthouse/Chrome pair and default, unmodified categories. No `skipAudits`, blocked URLs, extensions, artificial waits, score rounding, hidden failures, or discarded bad runs.
4. Run **five consecutive cold navigation audits** for each route on standard mobile and standard desktop presets. Save every JSON/HTML report with timestamp, URL, final URL, version, UA, viewport, throttling, benchmark index, and candidate hash.
5. Claim a stable category 100 only when **every retained run** is exactly 100. If any run is 99 or below, publish the distribution and do not claim stable 100.
6. Performance evidence must include a real `categories.performance.score`, raw FCP/Speed Index/LCP/TBT/CLS values, and diagnostics. Field mobile/desktop p75 LCP, INP, and CLS must separately meet current Web Vitals “good” thresholds; a lab 100 is not field proof.
7. Complete every applicable manual Accessibility, SEO/structured-data, security, and interaction check. A 100 automated badge is not launch acceptance by itself.
8. Re-run the same matrix against the deployed URL after release and confirm the reports match the approved candidate without regressions.

## Implementation tracking — ITEM-01

- **Status:** `Verified locally — production verification pending` (2026-07-31).
- **Disposition:** `LH-06-002` is not applicable to the local candidate because the video-lab route and footer were removed. The release Lighthouse matrix now covers `/` plus the error route; `LH-06-001`, `LH-06-003`, and all honest/stable-score evidence gaps remain open.
- **Verification:** regenerated production artifacts contain no lab route or chunk; local route handling returns `404` for the retired URL; retained homepage media loaded in focused browser QA with no console errors/warnings.
- **Tracking rule:** retire `LH-06-002` only after the public route is absent on the same deployed SHA; never reuse the historical lab score as current evidence.
