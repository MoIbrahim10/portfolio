# 00 — Master Prelaunch Audit Report

Audit date: 2026-07-29
Repository: `/Users/mo/Documents/porfolio`
Audited local revision: `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a`
Observed production revision/build: older/different; latest evidenced deployment SHA `5d80cbf0d9e818f3e5cc4b65766a947bdcd7ad7c`
ITEM-09 implementation release evidence: `87864fe684a187c885c788d8b7dd2eda21871f94`; Actions run `30703230758`; Cloudflare version `3666f6f8-cea8-4133-9cf9-945cbc0dd3a0`
ITEM-10 implementation release evidence: `ebcd8b1a8454bb69e37ba3ede9e5c11bb85d8ba8`; Actions run `30706793536`; Cloudflare version `5c861a15-8d73-40ce-8524-c9b46ff1f4eb`
Production origin: `https://m0code.com`

## Executive audit status

**Launch recommendation: HOLD.** No `P0 blocker` was confirmed, but unresolved `P1 high` findings and P1 unknowns remain. Approval/preview/rollback controls, exhaustive cross-browser/assistive-technology evidence, Lighthouse Performance evidence, and asset-rights evidence remain incomplete. The blocking Chromium desktop/mobile product suite is complete. Transport, TLS, browser headers, no-JavaScript visibility, homepage media overfetch, contrast, semantics/404 recovery, release identity, action pinning, and the critical browser gate were remediated or disproved and production-verified by 2026-08-01.

The 2026-07-29 audit baseline found an older production artifact. By 2026-08-01, production and the current build exposed identical root asset hashes, SSR counts, and the same 77 referenced public assets. ITEM-09 then made that parity durable: CI retains and verifies the exact build before deployment and records the source SHA, input/output hashes, tool versions, GitHub artifact digest, Cloudflare version, production URL, and smoke result. `M-C01` is complete and `M-C11` is partially resolved; approval, preview, observability, and rollback remain open. Historical drift evidence is preserved below.

Browser availability varied by specialist. Some Chromium/Lighthouse/Performance evidence was collected, while the configured browser-control backend was unavailable to many specialists. Manual, responsive, assistive-technology, touch, and cross-browser coverage is incomplete. Lighthouse Performance was excluded by the available audit tool, so **no Lighthouse Performance score exists** and no Performance 100 is claimed.

Audit-boundary exception: browser tooling auto-created exactly 10 ignored `.playwright-mcp/page-*.yml` snapshots during read-only diagnostics. They were left untouched because the audit prohibited deletion. No source, dependency, lockfile, configuration, tracked Git state, deployment, or external system was changed.

## Coverage inventory

| Area | Evidence covered | Status |
|---|---|---|
| Routes | `/`, `/video-player-lab`, unknown routes, slash/case/query/protocol variants | Complete HTTP/SSR inventory; interactive coverage incomplete |
| Components/states | Hero, portrait/logo, four-story rail, 32 candidate media chapters, viewer, custom scrollbar, ten video-lab variants | Source-complete; browser state execution incomplete |
| Assets | 119 `public/` files including two `.DS_Store`; 117 content assets; current references, derived posters, `dist`, live URLs | Repository/build complete; current release parity verified |
| Security | Transport, TLS, headers, XSS sinks, framing, secrets, source maps, CORS, third parties | Passive/application review complete; dashboard controls unavailable |
| Dependencies | 15 direct packages, 204 locked records, vendored skills, advisories, licenses, action refs | Snapshot complete; continuous policy/provenance incomplete |
| Performance | SSR, bundle/media sizes, caching, compression, CWV samples, overfetch, range behavior | Useful lab evidence; cold throttled traces/field data/Performance score absent |
| SEO/metadata | Crawl matrix, robots, sitemap, canonicals, headings, metadata, social cards, icons, JSON-LD | HTTP/SSR complete; Search Console/social debugger unavailable |
| Accessibility | WCAG 2.2 AA source/SSR/contrast matrix, Lighthouse accessibility, semantics | Contrast complete; semantic/error and manual AT coverage remain |
| Functional/responsive | Controls, links, modal/media flows, breakpoints, touch/keyboard/motion logic | Static/HTTP complete; exhaustive execution incomplete |
| Offline/PWA | SW/manifest/offline inventory, failures, range/revalidation behavior | Product contract unresolved; browser offline matrix incomplete |
| Deployment/operations | GitHub workflow, environments, Cloudflare delivery, TLS, cache, compression, rollback/observability | Repository/live evidence strong; dashboard-only settings and drills unavailable |
| Tests/CI | Scripts, tests, gates, GitHub runs/deployments, provenance | Blocking Chromium desktop/mobile product gate complete; wider browser/unit/coverage and release-policy controls remain |
| Content/legal/privacy | Visible/dormant copy and links, 117 assets, signatures/duplicates, tracking evidence, rights records | Technical inventory complete; legal/rights conclusions require owner/counsel |

## Launch blockers

The following must be resolved or explicitly disproved against one immutable release candidate before launch sign-off:

1. Remaining portions of `M-C11`: incomplete approval/preview/rollback and production-post-deploy browser controls.
2. `M-R01`, `M-R02`, and `M-R03`: incomplete real-browser evidence, no Lighthouse Performance score, and unverified asset/case-study rights.

`M-C08` was retired with `/video-player-lab` under ITEM-01. `M-C09` is complete under ITEM-08; neither remains a launch blocker.

## Deduplicated prioritized confirmed findings

### M-C01 — Release candidate, build, and production identity do not match

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in production` (2026-08-01). The baseline title/evidence below remains historical audit evidence.
- **Affected:** all routes/assets; local HEAD `ae1ec7c`; existing `dist/client/assets/*`; live deployment `5d80cbf…`; `.github/workflows/cloudflare.yml:3-10,44-56`.
- **Sources:** [INV-C01](./01-inventory.md), [CQ-01](./02-code-quality.md), [PERF-05-001](./05-performance.md), [LH-06-003](./06-lighthouse.md), [SEO-07-R01](./07-technical-seo.md), [FQA-001](./10-functional-interaction-qa.md), [RISK-12-002](./12-offline-pwa-resilience.md), [DEP-13-005](./13-production-deployment.md), [CI14-004](./14-tests-ci-release.md), [C15-001](./15-content-assets-legal-privacy.md).
- **Evidence:** HEAD is one commit ahead of `origin/master`; local and live JS/CSS hashes differ; local SSR has 32 media chapters and one initial video while live has 31 and 16 videos; live uses legacy PNG portraits; candidate-only assets return live 404. Scope 02 rated this P2, but the master uses P1 because the mismatch invalidates release-wide evidence and can produce mixed server/client assets.
- **Reproduction:** Compare `git rev-parse HEAD origin/master`, live HTML asset names, `dist/client/assets`, SSR figure/video counts, and candidate asset responses.
- **Impact/root cause:** Sign-off can target different behavior than deployment; likely no designated immutable candidate, build provenance, or preview promotion.
- **Recommendation:** Select one full SHA, build once in CI, retain checksums/manifest, deploy the exact artifact to a preview, rerun blocking audits, then promote that artifact only.
- **Alternatives/tradeoffs:** Freeze `5d80cbf…` as the candidate and re-audit it, or keep live/candidate baselines separate; both delay newer work but avoid claiming equivalence.
- **Effort/dependencies:** `M`, 0.5–2 days for identity/artifact plumbing plus re-audit; release owner, CI, Cloudflare preview/version access.
- **Objective verification:** source SHA, lock hash, artifact checksum, GitHub deployment SHA, Cloudflare version, runtime build ID, SSR inventory, and live asset hashes all match.
- **Current verification:** ITEM-09 code-release run [30703230758](https://github.com/MoIbrahim10/portfolio/actions/runs/30703230758) built 130 files from `87864fe684a187c885c788d8b7dd2eda21871f94`, retained build artifact `8819491987` with SHA-256 `5ff2c2ad96fddbd48d16e35ba6582daac48d6d9536f14fbed3c8271b6f6ca318`, downloaded and reverified it byte-for-byte, and deployed without rebuilding. Release artifact `8819497837` records Cloudflare version `3666f6f8-cea8-4133-9cf9-945cbc0dd3a0` and `https://m0code.com`. Production verification passed on attempt 1 for `/` `200`, unknown-route `404`, retired-lab `404`, five generated assets, the brand mark, and the retained Orgo MP4 hash. A later reports-only release (`d95ef14…`, run `30703726121`) independently produced an identical 130-file application hash list, so documentation commits do not invalidate this implementation evidence.

### M-C02 — Plaintext HTTP is fully served and HSTS is absent

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in production` (2026-08-01). This heading and the next evidence line preserve the 2026-07-29 audit baseline.
- **Affected:** `http://m0code.com/*`, `https://m0code.com/*`; `wrangler.jsonc:11-16`.
- **Sources:** [SEC-001](./03-application-security.md), [SEO-07-001](./07-technical-seo.md), [08-META-001](./08-metadata-social-structured-data.md), [DEP-13-001](./13-production-deployment.md).
- **Evidence:** HTTP `/` and `/video-player-lab` return full `200` HTML with no redirect; HTTPS omits `Strict-Transport-Security`.
- **Reproduction:** `curl -IL http://m0code.com/<route>` and inspect HTTPS headers.
- **Impact/root cause:** On-path modification/downgrade exposure and duplicate protocol URLs; likely no edge HTTPS redirect or staged HSTS policy.
- **Recommendation:** Add one path/query-preserving permanent HTTP→HTTPS edge redirect, then stage HSTS after every intended hostname/subdomain is HTTPS-ready.
- **Alternatives/tradeoffs:** Redirect first with short/no HSTS; avoid `includeSubDomains`/preload until domain-wide readiness because those controls are sticky.
- **Effort/dependencies:** `S`, 1–3 hours plus observation; Cloudflare zone access, hostname inventory, rollback owner.
- **Objective verification:** every HTTP route/variant redirects once to identical HTTPS path/query; no HTTP `200`; approved HSTS appears after staged rollout.
- **Current verification:** passed for `/`, a removed-route/query variant, a fingerprinted JS asset, a POST request, and the retained Orgo MP4. HTTPS `200`, `404`, JS, and MP4 responses emit `Strict-Transport-Security: max-age=300`; HTTP responses do not. The approved canary excludes subdomains and preload. A deliberate duration increase remains an operational follow-up, not part of ITEM-02 acceptance.

### M-C03 — Production accepts TLS 1.0 and TLS 1.1

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original 2026-07-29 finding.
- **Affected:** `m0code.com:443`; Cloudflare zone TLS minimum.
- **Sources:** [DEP-13-002](./13-production-deployment.md).
- **Evidence:** forced TLS 1.0 and 1.1 handshakes succeeded and returned `200`; TLS 1.2/1.3 also work.
- **Reproduction:** use `curl --tlsv1.0 --tls-max 1.0` and the TLS 1.1 equivalent.
- **Impact/root cause:** expanded cryptographic attack surface and weak modern baseline; likely a legacy Cloudflare minimum.
- **Recommendation:** raise minimum edge TLS to 1.2 while retaining TLS 1.3.
- **Alternatives/tradeoffs:** measure legacy-client traffic first if obsolete-client support is an explicit requirement.
- **Effort/dependencies:** `S`, under 1 hour plus monitoring; Cloudflare SSL/TLS access.
- **Objective verification:** TLS 1.0/1.1 fail before HTTP; TLS 1.2/1.3 succeed; independent scanner reports minimum 1.2.
- **Current verification:** Cloudflare Edge Certificates persists `Minimum TLS Version: TLS 1.2`. Forced TLS 1.0/1.1 `curl` probes now fail before HTTP with exit 35 and a protocol-version alert; forced TLS 1.2 and OpenSSL TLS 1.3 handshakes succeed with certificate verification. SSL Labs engine 2.4.2 graded all four advertised IPv4/IPv6 endpoints `A`, with no warnings and only TLS 1.2/1.3.

### M-C04 — Browser security/privacy headers are absent

- **Severity:** `P2 medium`
- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original finding.
- **Affected:** `/`, HTML `404`, controlled JSON `500`, and static delivery; `src/server.ts:5-56`; `src/router.tsx:7-19`; Cloudflare rule `fad9352426bf49b0b7f2916ed66a5d5d`. The removed `/video-player-lab` route is no longer applicable.
- **Sources:** [SEC-002, SEC-O01](./03-application-security.md), [DEP-13-003](./13-production-deployment.md).
- **Evidence:** no CSP/report-only policy, `frame-ancestors`/X-Frame-Options, `nosniff`, Referrer-Policy, or Permissions-Policy. Scope 13 rated the aggregate P1; the master uses P2 because no attacker-controlled injection path or sensitive state-changing action was found, while retaining launch significance.
- **Reproduction:** inspect headers for `/`, `/video-player-lab`, a 404, and representative static assets.
- **Impact/root cause:** no clickjacking or future-XSS containment and reliance on browser defaults; no centralized response-header policy.
- **Recommendation:** stage CSP report-only with a nonce/hash strategy for the TanStack inline bootstrap, then enforce; add frame protection, `nosniff`, explicit referrer and minimal permissions policies across success/error responses.
- **Alternatives/tradeoffs:** deploy non-CSP headers first; never use broad `unsafe-inline` solely to silence violations.
- **Effort/dependencies:** `M`, 1–2 days plus observation; framework CSP support, Cloudflare header control, browser regression, reporting endpoint.
- **Objective verification:** all relevant responses carry exact approved policies; zero unexplained CSP violations after every route/interaction; external framing is refused.
- **Current verification:** passed. Report-only run [30696115179](https://github.com/MoIbrahim10/portfolio/actions/runs/30696115179) preceded enforcement run [30696408648](https://github.com/MoIbrahim10/portfolio/actions/runs/30696408648). Production HTML `200`/`404` responses have rotating nonce CSP with strict script, object, base, frame, and first-party resource controls; every SSR script matches its response nonce. The active Cloudflare rule sets exact `nosniff`, `DENY`, referrer, and minimal permissions policies on HTML, controlled JSON `500`, JS, CSS, SVG, and the retained Orgo MP4. Browser hydration, modal interaction, Orgo playback, and 404 produced zero warning/error logs under enforcement. The Cloudflare-managed `text/plain` `/robots.txt` bypasses Response Header Transforms; synthetic external-frame rendering was unavailable, while enforced `frame-ancestors 'none'` and `X-Frame-Options: DENY` independently provide frame refusal.

### M-C05 — Live home is visually blank when JavaScript/hydration fails

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original 2026-07-29 finding.
- **Affected:** live `/`; deployed historical home entrance state; current implementation at `src/components/v14-exploration-lab/V14ExplorationLab.tsx:327-367` and `V14ExplorationLab.module.css:354-395`.
- **Sources:** [SEO-07-R02](./07-technical-seo.md), [09-C-07](./09-accessibility.md), [OFF-12-001](./12-offline-pwa-resilience.md).
- **Evidence:** live SSR serializes the primary article with `opacity:0`, blur, and transform; no no-script fallback exists. Current source/dist no longer emits the same hidden state.
- **Reproduction:** block the live main JS module or disable JavaScript and inspect computed visibility/SSR article style.
- **Impact/root cause:** script/network/CSP/extension failure removes all identity, work, and contact content; likely client-controlled entrance animation serialized into SSR in the older release.
- **Recommendation:** make SSR visible by default and apply entrance motion only after enhancement readiness; add no-JS and blocked-main-module gates.
- **Alternatives/tradeoffs:** remove the page-level entrance for maximum resilience; `<noscript>` is only partial containment because it misses runtime hydration failure.
- **Effort/dependencies:** `S–M`, 0.5–1 day plus release verification; M-C01, motion QA, browser tests.
- **Objective verification:** core content is visible within one second with JS disabled and main module blocked, while normal/reduced-motion modes retain approved behavior.
- **Current verification:** passed 6/6 production Chromium scenarios against deployed source revision `3c690b699ae5848fdabfea4aa3ec2d6e16c0f1f2`. Desktop (1440×1000) and mobile (390×844) both showed the bio, Orgo project heading, and contact action with JavaScript disabled and with the current main module `/assets/index-DWNzLafz.js` explicitly blocked. In all four failure-mode runs, the portfolio article computed to `opacity: 1`, `visibility: visible`, `filter: none`, and `transform: none`; screenshots were captured and visually reviewed. Normal hydration and reduced-motion runs produced no page errors. The retained Orgo viewer played at `readyState=4`, duration `4.534`, `error=null`. No runtime source change was required because the current production artifact already uses the visible-by-default CSS implementation.

### M-C06 — Live home overfetches all inactive videos and multi-megabyte portraits

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original 2026-07-29 finding.
- **Affected:** live `/`; candidate loading code at `CrossAxisProjectRail.tsx:686-720,861-990`; portrait sources at `V14ExplorationLab.tsx:17-24`.
- **Sources:** [PERF-05-001](./05-performance.md), [LH-06-003](./06-lighthouse.md), [FQA-001](./10-functional-interaction-qa.md).
- **Evidence:** live SSR has 16 videos; repeat capture requested all 16 for 10,190,739 bytes, with two initial portraits adding 3,871,799 bytes and later portraits about 2 MB each. Candidate uses one initial video/poster and 31–39 KB WebPs.
- **Reproduction:** fresh/cache-disabled live network capture; count MP4 requests and portrait sizes; compare candidate SSR.
- **Impact/root cause:** severe mobile data, latency, battery, and resource contention; live is an older eager-media artifact.
- **Recommendation:** validate the candidate in preview and require at most one initial MP4, no pre-reveal portrait request, and only optimized WebP portraits before promotion.
- **Alternatives/tradeoffs:** ship a narrow eager-video/portrait patch to current live, but that prolongs release drift.
- **Effort/dependencies:** `S–M`, 0.5–1 day; M-C01, deployment approval, functional/mobile validation.
- **Objective verification:** cold desktop/mobile traces show ≤1 initial MP4, no inactive-slide bodies, no portrait before reveal, each revealed portrait ≤40 KB, and an approved initial-media byte budget.
- **Current verification:** passed. Production SSR and the current build match exactly at 1 `<video>`, 32 `<img>` elements, 32 full-screen media triggers, the sole initial `/portfolio/projects/orgo/walkthrough.mp4`, and root asset hashes `index-DWNzLafz.js`, `routes-Ba3vXpwj.js`, and `routes-DKGiQ1HX.css`. Cold cache-disabled desktop/mobile and Slow 3G mobile runs each requested only that one MP4 and zero portraits before interaction; all requested initial images were WebP. Observed initial media files total 401,726 B on desktop and 490,906 B on mobile. Portrait reveal fetched only `-640.webp`; direct production GETs verified all six portraits at 31,426–39,254 B. All 77 referenced public assets returned `200` with the expected MIME type. Desktop/mobile traces measured LCP 492/311 ms and CLS 0 under unthrottled lab conditions. The Orgo viewer remained healthy at `readyState=4`, duration `4.534`, `error=null`, with zero console/page errors. No runtime change was required.

### M-C07 — Text, focus, and state contrast fail WCAG 2.2 AA

- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original 2026-07-29 finding.
- **Severity:** `P1 high`
- **Affected:** both routes; `V14ExplorationLab.module.css:20-23`; `CutCornerButton.module.css:35`; `CrossAxisProjectRail.module.css:90-116,170-175,458-653,672-675,960-963`; `VideoPlayerLab.module.css:45-50,135-140,557-572`.
- **Sources:** [LH-06-001, LH-06-002](./06-lighthouse.md), [09-C-01, 09-C-02](./09-accessibility.md).
- **Evidence:** four Lighthouse navigation audits scored Accessibility 96; caption contrast measured 1.98:1, lab footer 3.79:1, and numerous focus/state/text combinations fall below 3:1 or 4.5:1.
- **Reproduction:** run contrast calculations and keyboard focus checks across every story/theme/tab/modal state.
- **Impact/root cause:** low-vision and keyboard users cannot reliably read text or locate focus; decorative accent tokens are reused as semantic/focus tokens.
- **Recommendation:** define tested text and focus tokens per surface; target ≥4.5:1 for small text and ≥3:1 for focus/non-text indicators, including forced colors.
- **Alternatives/tradeoffs:** two-color focus rings are more robust but visually stronger; increasing text size alone changes layout and still needs proof.
- **Effort/dependencies:** `M`, 1–2 days; design approval, visual regression, accessibility verification.
- **Objective verification:** independent contrast matrix passes; axe/Lighthouse color contrast passes on both routes/profiles; all focusable states remain visible at 100%/200% and forced colors.
- **Current verification:** all rendered homepage story text now measures at least **4.68:1**, all 32 editorial caption pairs at least **5.07:1**, selected indicators at least **3.95:1**, story focus rings at least **6.07:1**, and gallery focus rings **12.01:1**. Production Lighthouse 13.4.0 navigation audits scored Accessibility 100 on mobile and desktop with zero failed audits. Chromium checks passed at 390×844, 1440×1000, 200% text, reduced motion, and forced colors. The retained Orgo modal video reached `readyState=4`, played, paused, and closed with no media, console, or page error.

### M-C08 — Video-lab selector fails 320 CSS px reflow

- **Severity:** `P1 high`
- **Remediation status:** `Complete — retired in production` (2026-07-31). The only affected route was removed under ITEM-01 and now returns a genuine `404`.
- **Affected:** `/video-player-lab`; `VideoPlayerLab.module.css:86-100`.
- **Sources:** [09-C-04](./09-accessibility.md).
- **Evidence:** selector content retains `min-width:68rem` in a horizontal scroller; at 320 CSS px/400% zoom it requires two-dimensional panning.
- **Reproduction:** render at 320 CSS px or 1280 px at 400% zoom and navigate all ten variants.
- **Impact/root cause:** low-vision users must pan horizontally and vertically and may miss options; desktop film-strip layout lacks an adaptive narrow mode.
- **Recommendation:** reflow to a wrapping one/two-column or vertical selector.
- **Alternatives/tradeoffs:** previous/next controls are compact but reduce overview.
- **Effort/dependencies:** `M`, about 1 day; responsive design and keyboard/focus validation.
- **Objective verification:** all tabs/content are available without horizontal page/region scrolling at 320 CSS px and 400% zoom.

### M-C09 — Semantic hierarchy, control relationships, and 404 accessibility are incomplete

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in production` (2026-08-01). Lab-only semantics were retired under ITEM-01; retained homepage and unknown-route requirements were completed under ITEM-08.
- **Affected:** `/`, `/video-player-lab`, unknown routes; `V14ExplorationLab.tsx:327-378`; `CrossAxisProjectRail.tsx:495-583`; `VideoPlayerLab.tsx:218-262`; root/router not-found defaults.
- **Sources:** [INV-C02](./01-inventory.md), [SEO-07-004, SEO-07-005](./07-technical-seo.md), [08-META-004](./08-metadata-social-structured-data.md), [09-C-03, 09-C-05, 09-C-06](./09-accessibility.md), [FQA-005](./10-functional-interaction-qa.md), [DEP-13-009](./13-production-deployment.md), [C15-003](./15-content-assets-legal-privacy.md).
- **Evidence:** home has no H1; lab tabs have no complete tabpanel relationship; button groups are mislabeled as navigation landmarks; 404 body is only `<p>Not Found</p>` with homepage title, no `main`, heading, or recovery link. Other scopes rated the 404 P2/P3, but master retains P1 because WCAG page-title/structure/recovery failures affect every bad URL.
- **Reproduction:** inspect SSR/accessibility tree headings, landmarks, tab relationships, and an unknown URL.
- **Impact/root cause:** AT users receive an unclear outline and incomplete interaction model; bad URLs strand all users; framework defaults and visual groupings substituted for semantic contracts.
- **Recommendation:** add one visible H1; implement complete tabs or a simpler named group; reserve `nav` for navigation; add accessible 404 title/main/H1/home action while preserving status.
- **Alternatives/tradeoffs:** radio/button group semantics are simpler than full tabs; a minimal error page is sufficient.
- **Effort/dependencies:** `M`, 1–2 days; copy/design, AT tests, route metadata.
- **Objective verification:** SSR has one logical H1; accessibility tree exposes valid roles/relations; unknown URLs return 404 with error-specific title, `main`, H1, and keyboard-accessible home link.
- **Current verification:** production `/` contains exactly one H1, “Mo Ibrahim — Design Engineer,” followed by four H2 project headings; its four project selectors are labeled groups and no longer navigation landmarks. A cache-bypassed unknown URL returns HTTP `404` with unique title/description, one `main`, one H1, and a working keyboard-accessible home link. Desktop/mobile Lighthouse snapshots score 100 in Accessibility, Best Practices, SEO, and Agentic Browsing with zero failed audits. The approved homepage heading replacement preserved exact 914×788 position, dimensions, font, margin, and color.

### M-C10 — No automated product test suite exists

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in CI and against production` (2026-08-01). The baseline evidence below remains historical.
- **Affected:** both routes, error states, all `src/components/**`; `package.json:8-33`; `.github/workflows/cloudflare.yml:32-42`.
- **Sources:** [CQ-R02](./02-code-quality.md), [O-FQA-001](./10-functional-interaction-qa.md), [CI14-001](./14-tests-ci-release.md).
- **Evidence:** no test script, runner dependency, product test/spec files, component/SSR/E2E coverage, accessibility/visual/browser matrix, or coverage output exists; only TypeScript/build checks exist.
- **Reproduction:** inspect package scripts, workflow, and tracked product test files.
- **Impact/root cause:** type-correct code can ship broken navigation, media, focus, touch, hydration, or error behavior; exploration code matured without a test strategy.
- **Recommendation:** add layered unit/component/SSR/browser tests with deterministic media/observer/failure fixtures, then gate critical journeys.
- **Alternatives/tradeoffs:** begin with Chromium desktop/mobile critical smoke and nightly WebKit/Firefox; faster but leaves non-blocking gaps.
- **Effort/dependencies:** `L`, 4–8 engineering days; dependency approval, stable selectors, support matrix, specialist acceptance cases.
- **Objective verification:** CI runs named test scripts and intentionally broken rail/modal/media/404 journeys fail the blocking gate with retained results.
- **Current verification:** exact `@playwright/test` 1.61.0 is locked; `bun run test:e2e` executes Chromium desktop and Pixel 7 projects. Twelve cases cover SSR/hydration, keyboard project selection, Orgo modal/video controls, Escape and trigger-focus return, reduced motion, deterministic MP4 failure/poster fallback, generic `404`, and retired-lab `404`, while failing on unexpected console, page, and request errors. Local CI mode and the public origin both passed 12/12. PR #16 passed run `30706719944`; merge `ebcd8b1…` passed the blocking gate and deployed through run `30706793536` as Cloudflare version `5c861a15…`. Failure traces, screenshots, video, HTML, and JSON are retained for 14 days when the browser step fails.

### M-C11 — Production promotion, smoke verification, provenance, and rollback controls are inadequate

- **Severity:** `P1 high`
- **Remediation status:** `Partially resolved — provenance, immutable artifact deployment, HTTP/asset/media smoke, and candidate browser CI verified` (2026-08-01). Approval gates, production-like preview, automated post-deploy browser smoke, observability, and rollback drill remain open.
- **Affected:** `.github/workflows/cloudflare.yml:3-56`; GitHub `master` and `production`; Cloudflare versions/deployments.
- **Sources:** [DEP-13-004, DEP-13-010, DEP-13-R01](./13-production-deployment.md), [CI14-002, CI14-003, CI14-005, CI14-006](./14-tests-ci-release.md).
- **Evidence:** pushes and manual dispatches can deploy; branch/environment protections are absent; no production-equivalent preview; one title grep is the only post-deploy smoke; no retained artifact/checksum/version, rollback runbook/drill, or verified observability/alert contract.
- **Reproduction:** inspect workflow triggers/conditions, GitHub branch/environment APIs, artifacts/deployments, and smoke command.
- **Impact/root cause:** an unreviewed/wrong ref can replace production and pass while chunks, hydration, routes, or interactions are broken; pipeline optimizes direct publishing rather than promotion.
- **Recommendation:** separate validation/build/promotion; guard approved full SHA; require review where platform allows; stage the exact retained artifact; run route/asset/browser/header checks; record version; rehearse rollback.
- **Alternatives/tradeoffs:** on current plan, use manual-only deploy with explicit SHA guard and out-of-band approval; less enforceable but safer than direct push deploy.
- **Effort/dependencies:** `L`, 2–5 days; repository plan/visibility decision, CI14 tests, Cloudflare preview/version access, release/incident owners.
- **Objective verification:** non-approved refs cannot deploy; exact artifact is promoted without rebuild; intentional broken chunk/hydration fails smoke; deployment records SHA/version/checksum; nonproduction rollback restores prior known-good within target time.
- **Current verification:** build and deploy are separate jobs; PRs build/retain but cannot deploy; manual non-`master` dispatches cannot deploy; production consumes the retained artifact and verifies every build/input hash before Wrangler. The build job now blocks on desktop/mobile Chromium product tests before artifact creation. Post-deploy checks compare live JS/CSS/brand/video bytes, statuses, titles, H1/group structure, unknown-route recovery, and the retired route; the same browser suite passed manually against production 12/12. The final manifest retains SHA/tool/artifact/Cloudflare/version/URL/smoke evidence for 90 days. Automated post-deploy browser execution, approval rules, preview promotion, observability, and rollback remain open.

### M-C12 — Privileged GitHub Actions use mutable tags

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in pull-request and production workflows` (2026-08-01).
- **Affected:** `.github/workflows/cloudflare.yml:25,28,46-52`.
- **Sources:** [DEP-001](./04-dependencies-supply-chain.md), [CI14-R01](./14-tests-ci-release.md).
- **Evidence:** checkout, setup-bun, and wrangler-action use moving major tags; the deploy action receives production credentials. Scope 14 labeled this a P2 risk; the master retains P1 because tag movement can execute privileged production code with no repository diff.
- **Reproduction:** inspect every `uses:` reference and repository action policy.
- **Impact/root cause:** upstream tag compromise/movement could steal deployment credentials or publish malicious code; convenience tags and no SHA-pinning policy.
- **Recommendation:** review and pin every action to a full commit SHA, restrict allowed actions, and use controlled update PRs.
- **Alternatives/tradeoffs:** prioritize the privileged Cloudflare action first; leaving GitHub-owned actions on documented major tags reduces maintenance but retains mutable code.
- **Effort/dependencies:** `S`, 2–4 hours plus maintenance; vetted SHAs and policy access.
- **Objective verification:** all `uses:` values are reviewed 40-character SHAs and a policy/test rejects mutable refs.
- **Current verification:** all checkout, Bun setup, Cloudflare deploy, artifact upload, and artifact download actions use exact 40-character official SHAs with adjacent major-version comments. PRs [#12](https://github.com/MoIbrahim10/portfolio/pull/12) and [#13](https://github.com/MoIbrahim10/portfolio/pull/13) passed the pinned workflow; final production run `30703230758` used those exact SHAs. Repository policy still does not enforce pinning, so controlled update ownership remains operational follow-up.

### M-C13 — Browser cache policy and MP4 range delivery are inefficient

- **Severity:** `P2 medium`
- **Affected:** hashed `/assets/*.js|css`, unversioned media, all live MP4s; `wrangler.jsonc:8-10`.
- **Sources:** [PERF-05-002](./05-performance.md), [OFF-12-003](./12-offline-pwa-resilience.md), [DEP-13-006, DEP-13-007](./13-production-deployment.md).
- **Evidence:** hashed assets return `max-age=0,must-revalidate`; representative MP4 Range requests return full `200` bodies with no `Content-Range`/`Accept-Ranges`.
- **Reproduction:** repeat/conditional asset loads and start/mid/suffix byte-range requests.
- **Impact/root cause:** avoidable RTTs, weak repeat/offline resilience, full retransfer on seek/interruption; default static delivery lacks route-specific policy.
- **Recommendation:** use long immutable caching for content-hashed assets, explicit shorter policy for mutable media, and a tested media path with compliant byte ranges.
- **Alternatives/tradeoffs:** moderate media TTL before fingerprinting; keep very small loops on static delivery rather than adding complex video infrastructure.
- **Effort/dependencies:** `M`, 1–3 days; asset-versioning/rollback policy, Cloudflare delivery choice, Safari/Chromium media tests.
- **Objective verification:** second visit makes no network request for fresh hashed assets; range probes return exact `206`/`Content-Range`; seeking does not redownload full files.

### M-C14 — Canonical URL policy, sitemap discovery, and robots delivery are incomplete

- **Severity:** `P2 medium`
- **Affected:** both routes and protocol/case/query/slash variants; `src/routes/__root.tsx:10-28`; router/default edge behavior; `/robots.txt`; `/sitemap.xml`.
- **Sources:** [SEO-07-002, SEO-07-003, SEO-07-R04](./07-technical-seo.md), [08-META-001](./08-metadata-social-structured-data.md), [DEP-13-008](./13-production-deployment.md).
- **Evidence:** no canonical tags; uppercase and arbitrary-query duplicates return identical `200`; slash uses temporary `307`; sitemap is 404; lab is orphaned but indexable; robots GET is Cloudflare-generated `200` while HEAD is `404`.
- **Reproduction:** fetch URL variants, compare normalized bodies/canonicals, enumerate home links, and probe robots/sitemap GET/HEAD.
- **Impact/root cause:** search engines must infer preferred URLs and lab intent; crawl signals/discovery can fragment; no explicit URL/publication policy.
- **Recommendation:** decide public routes; add absolute self-canonicals; permanent safe normalization; deterministic robots with sitemap; include or noindex/protect the lab according to intent.
- **Alternatives/tradeoffs:** self-canonicals first and defer global query stripping; never lowercase asset paths indiscriminately.
- **Effort/dependencies:** `M`, 1–2 days; route-intent, metadata, Cloudflare redirects.
- **Objective verification:** each variant resolves/canonicalizes to one HTTPS lowercase URL; public routes appear once in valid sitemap; robots GET/HEAD agree and reference it.

### M-C15 — Route metadata and social-preview contracts are incomplete

- **Severity:** `P2 medium`
- **Affected:** `/`, `/video-player-lab`, 404s; `src/routes/__root.tsx:10-28`; both route files.
- **Sources:** [08-META-002, 08-META-003, 08-META-004](./08-metadata-social-structured-data.md).
- **Evidence:** both 200 routes share generic title/description; zero Open Graph and Twitter tags; 404 inherits home metadata.
- **Reproduction:** inspect raw SSR for both routes, crawler user agents, and unknown paths.
- **Impact/root cause:** search snippets/bookmarks/unfurls cannot distinguish pages; bad URLs are mislabeled; all metadata is one static root definition.
- **Recommendation:** define route-specific SSR title/description/canonical/social data and an error-specific title; create an approved stable social image.
- **Alternatives/tradeoffs:** one site-wide image is simpler but less relevant; if lab is non-public, noindex/protect it instead of creating promotional metadata.
- **Effort/dependencies:** `M`, 0.5–1 day plus image production; copy, route intent, canonical policy.
- **Objective verification:** every indexable route has one unique title/description/canonical/OG object; social image returns correct MIME/dimensions; platform debuggers report no critical warnings.
- **Current disposition:** the 404 metadata portion (`08-META-004`) is complete under ITEM-08. Homepage canonical, Open Graph/Twitter, social-image, favicon-platform, and structured-data work remains open, so `M-C15` is not closed.

### M-C16 — Media failure recovery is incomplete

- **Severity:** `P2 medium`
- **Affected:** full-screen viewer and 26 deferred images; `CrossAxisProjectRail.tsx:585-659,1003-1108`.
- **Sources:** [FQA-003](./10-functional-interaction-qa.md), [OFF-12-002, OFF-12-004](./12-offline-pwa-resilience.md).
- **Evidence:** viewer video error only clears `playing`, leaving blank frame/invalid controls with no poster/retry; failed selected WebP does not explicitly switch to the valid fallback source.
- **Reproduction:** intercept viewer MP4 and preferred WebP requests with 404/abort/timeout while allowing fallback files.
- **Impact/root cause:** users see blank or blurred portfolio evidence with no recovery; card resilience was not shared with viewer and format fallback was confused with request fallback.
- **Recommendation:** keep posters/placeholders until decode, model ready/error/retry states, disable invalid controls, and switch once to fallback image.
- **Alternatives/tradeoffs:** poster-only terminal fallback is simpler but offers no recovery; bounded manual retry avoids metered-network loops.
- **Effort/dependencies:** `M`, 1–2 days; error-state design, request fixtures, accessibility announcements.
- **Objective verification:** all video/image failure fixtures show stable fallback, announced error, bounded successful retry, no layout shift or uncaught error.

### M-C17 — Reduced-motion, mobile cue, touch-action, and keyboard-focus interactions contain defects

- **Severity:** `P2 medium`
- **Affected:** both routes; `VideoPlayerLab.tsx:127-148`; `CrossAxisProjectRail.tsx:553-579,1393-1398,1648-1665`; `CrossAxisProjectRail.module.css:199-249,1726-1733`.
- **Sources:** [FQA-004](./10-functional-interaction-qa.md), [RESP-11-001 through RESP-11-004](./11-responsive-cross-browser.md).
- **Evidence:** lab video always autoplays/loops under reduced motion; mobile cue says “Swipe right” although left advances; desktop/tablet story `touch-action:pan-y` blocks advertised horizontal swipe; keyboard dot activation can leave focus in a newly inert slide.
- **Reproduction:** emulate reduced motion; test 320–390 px touch cues; swipe at 769–1024 px; activate each project dot by keyboard and inspect active element/inert ancestry.
- **Impact/root cause:** motion-sensitive, touch, keyboard, and switch users receive contradictory or broken behavior; separate interaction implementations and nested-scroll arbitration lack runtime acceptance tests.
- **Recommendation:** pause under reduced motion; correct direction-neutral copy; adopt tested gesture policy or explicit next/previous controls; move keyboard focus after active-state commit.
- **Alternatives/tradeoffs:** disable autoplay for all users; persistent navigation controls are more reliable but add visual chrome.
- **Effort/dependencies:** `M`, 1–2 days; product interaction decisions, physical devices, cross-engine tests.
- **Objective verification:** reduced-motion fresh loads pause; instructions match gesture; horizontal/vertical/pinch gestures coexist; no focused element has inert ancestry after every dot activation.

### M-C18 — Selected Experiments stores destinations that are not rendered

- **Severity:** `P2 medium`
- **Affected:** `/` Selected Experiments; `CrossAxisProjectRail.tsx:422,521,829`; `portfolio-data.ts:139,177`.
- **Sources:** [FQA-002](./10-functional-interaction-qa.md).
- **Evidence:** Bits n Pixels and Glazed `liveHref` values exist but the story suppresses top links and cards render collaborator links only.
- **Reproduction:** select Selected Experiments and inspect DOM for both hostnames.
- **Impact/root cause:** visitors cannot reach project destinations and content data misstates visible capability; single-project link pattern did not adapt to grouped work.
- **Recommendation:** after destination ownership/availability confirmation, render a labeled per-project destination or an explicit approved omission state.
- **Alternatives/tradeoffs:** a compact story-level list reduces repetition but weakens project association; keep unavailable links hidden.
- **Effort/dependencies:** `S`, under 0.5 day after link decisions; content owner and accessibility review.
- **Objective verification:** every enabled project destination has one reachable rendered anchor; data-driven tests map IDs to expected hrefs.

### M-C19 — Dependency and supply-chain policy is incomplete

- **Severity:** `P2 medium`
- **Affected:** `package.json:17-19`; `bun.lock`; workflow dry-run and security gates.
- **Sources:** [DEP-002, DEP-003, DEP-004](./04-dependencies-supply-chain.md).
- **Evidence:** two TanStack runtime packages use `latest`; Wrangler executes outside the project lock; CI has no advisory, dependency-review, secret, license, or SBOM gate.
- **Reproduction:** inspect manifest/lock/workflow and security configuration.
- **Impact/root cause:** lock refreshes or CI downloads can absorb unreviewed code; future vulnerabilities/secrets/licenses can deploy without a stop.
- **Recommendation:** pin reviewed framework versions, lock Wrangler, and add reviewed dependency/secret/license/SBOM policy gates.
- **Alternatives/tradeoffs:** tilde ranges reduce update toil but permit patch drift; native GitHub features reduce custom maintenance but depend on plan/settings.
- **Effort/dependencies:** `M`, 1–2 days; dependency-change approval, scanner policy, alert ownership.
- **Objective verification:** no `latest` or network-resolving Wrangler; clean frozen install; fixture advisories/secrets/licenses block; SBOM matches locked production closure.

### M-C20 — Project rail architecture and shipping dead surface increase change risk

- **Severity:** `P2 medium`
- **Affected:** `CrossAxisProjectRail.tsx:1-1856`; `CrossAxisProjectRail.module.css:1-1899`; presentation variants and content exports.
- **Sources:** [CQ-02, CQ-03, CQ-05 through CQ-08](./02-code-quality.md), [INV-R02](./01-inventory.md).
- **Evidence:** one component owns data, loading, playback, viewer, focus, and nested scroll; nine unreachable presentation systems comprise about 34.7% of its CSS; duplicate content/player logic, unused exports/records, legacy global CSS, tracked `.DS_Store`, and ambiguous assets remain.
- **Reproduction:** inspect line/function boundaries, call sites, CSS presentation selectors, source references, and tracked files.
- **Impact/root cause:** high regression/merge-review surface and payload/ownership ambiguity; exploration code accumulated without production boundaries.
- **Recommendation:** only after characterization tests, extract cohesive data/media/viewer modules and remove or archive owner-approved unreachable shipping surface.
- **Alternatives/tradeoffs:** first extract pure data/formatters and leave scroll orchestration intact; safer but retains the largest complex unit.
- **Effort/dependencies:** `L`, 3–5 days plus asset/content decisions; M-C10, visual/interaction baselines, design owner.
- **Objective verification:** each retained option/asset has a consumer or documented archive purpose; production CSS excludes approved dead variants; behavior/screenshots remain equivalent.

### M-C21 — Content polish and dormant asset records contain confirmed inconsistencies

- **Severity:** `P3 low`
- **Affected:** `portfolio-data.ts:177-217`; dormant Calm AI Studio files; public asset metadata.
- **Sources:** [C15-004, C15-005](./15-content-assets-legal-privacy.md), [CQ-04](./02-code-quality.md).
- **Evidence:** “Glazed”/“Glaze” naming is inconsistent; two `.png` paths contain identical JPEG bytes; default navy button emits literal `undefined` in the class list.
- **Reproduction:** source/SSR case-sensitive searches, `file`/hash checks, and inspect schedule-link SSR class.
- **Impact/root cause:** visible polish, asset-tool/MIME confusion, and hidden style-contract drift; iterative content/assets were not normalized.
- **Recommendation:** obtain owner naming decision, choose one correctly named/encoded canonical dormant asset if retained, and make variant-class mapping explicit.
- **Alternatives/tradeoffs:** preserve historical UI wording as documented exceptions; do not migrate dormant public URLs until ownership/usage is known.
- **Effort/dependencies:** `S`, 2–4 hours after owner decisions; content/design approval and tests.
- **Objective verification:** approved naming sheet matches SSR; signature/extension/MIME agree; no rendered class contains `undefined`.

## Risks / unverified

### M-R01 — Exhaustive real-browser, device, and assistive-technology behavior remains unverified

- **Severity:** `P1 high`
- **Affected:** every interactive state on both routes, 32 candidate media triggers, breakpoints, error/loading/network states.
- **Sources:** [INV-R01](./01-inventory.md), [R-FQA-001](./10-functional-interaction-qa.md), [RESP-11-005 through RESP-11-008](./11-responsive-cross-browser.md), [09-R-04](./09-accessibility.md).
- **Evidence:** browser-control availability was absent for many specialists; source/HTTP cannot prove clicks, focus, touch, scroll, modal, playback, zoom, forced colors, console, or hydration behavior. Some Chromium evidence elsewhere does not cover the full matrix.
- **Reproduction:** run the inventory matrix in clean Chromium/WebKit/Firefox and physical/emulated mobile sessions.
- **Impact/root cause:** interaction or engine-specific regressions can remain undiscovered; audit infrastructure/browser access was inconsistent.
- **Recommendation:** rerun against the immutable preview with route/state/viewport/input/network/expected/actual evidence and retained artifacts.
- **Alternatives/tradeoffs:** recorded manual device QA is acceptable temporarily but less reproducible.
- **Effort/dependencies:** `L`, 1–3 days; M-C01, supported-browser policy, devices/AT.
- **Objective verification:** signed matrix covers every required route/control/state at agreed browsers/viewports with zero unexplained console/network/focus failures.

### M-R02 — Lighthouse Performance, field CWV, and stable-score evidence are absent

- **Severity:** `P1 high`
- **Affected:** both routes, mobile and desktop, honest 100-score claim.
- **Sources:** [PERF-05-R01, PERF-05-R02, PERF-05-O01](./05-performance.md), [LH-06-R01 through LH-06-R03](./06-lighthouse.md).
- **Evidence:** available Lighthouse reports omitted `categories.performance`; one run per route/profile does not establish stability; desktop reports retained a mobile UA; no CrUX/RUM p75 dataset exists.
- **Reproduction:** inspect saved Lighthouse JSON and field-data availability.
- **Impact/root cause:** any Performance 100 or stable all-100 claim is unsupported; tooling/profile limitations and no release performance gate.
- **Recommendation:** after M-C01, run five cold unmodified Performance audits per route/profile with pinned Lighthouse/Chrome, plus mobile/desktop field CWV where available. ITEM-06's focused traces and request matrix do not replace this gate.
- **Alternatives/tradeoffs:** PageSpeed corroboration adds external variability; Lighthouse CI is reproducible but requires approved tooling.
- **Effort/dependencies:** `M`, 0.5–1 day measurement plus remediation; isolated runner and approved preview.
- **Objective verification:** every retained report includes Performance score and raw metrics; all five runs meet declared gate; field p75 LCP/INP/CLS are good or explicitly unavailable.

### M-R03 — Asset, project, collaborator, and client display rights are not evidenced

- **Severity:** `P1 high`
- **Affected:** all 117 content assets, eight project records, portraits, third-party marks, collaborator work.
- **Sources:** [R15-001, R15-003](./15-content-assets-legal-privacy.md), [DEP-R01, DEP-R02](./04-dependencies-supply-chain.md).
- **Evidence:** no product asset rights register, permission/model/client releases, contribution role records, or complete notice/provenance set exists in-repository; vendored skill and distributed-package notice obligations are partly unverified.
- **Reproduction:** inventory rights/license/provenance records and compare with published assets/projects/vendors.
- **Impact/root cause:** possible takedown, confidentiality, attribution, trademark, licensing, or relationship risk; evidence may exist externally but was unavailable.
- **Recommendation:** owner/counsel create a rights register and approve every published project/asset/attribution and applicable software notices.
- **Alternatives/tradeoffs:** withhold uncertain work, redact, or use self-created substitutes until approval.
- **Effort/dependencies:** `M–L`, 1–3+ days; owner, collaborators/clients, legal review.
- **Objective verification:** every shipped item maps to retained permission/license/notice evidence and approved role/status copy; owner/counsel signs off.

### M-R04 — Public intent for `/video-player-lab` is unresolved

- **Severity:** `P1 high`
- **Affected:** `/video-player-lab`; route file and metadata/crawl/navigation policy.
- **Sources:** [SEO-07-003](./07-technical-seo.md), [08-RISK-001](./08-metadata-social-structured-data.md), [R15-004](./15-content-assets-legal-privacy.md).
- **Evidence:** route is anonymous `200`, indexable, orphaned from home, genericly branded, and presents internal exploration variants.
- **Reproduction:** direct-load the route, inspect robots/head, and enumerate home internal links.
- **Impact/root cause:** unfinished/internal content may be indexed, or valuable public content may remain undiscoverable; no publication classification.
- **Recommendation:** owner must classify it public, public-lab, noindex, protected, or excluded; align navigation, metadata, sitemap, and access.
- **Alternatives/tradeoffs:** `noindex` is reversible but not privacy; authentication protects content but changes access.
- **Effort/dependencies:** `S` decision, implementation separate; product/content owner, SEO/security/deployment.
- **Objective verification:** documented classification exactly matches live status, access, crawl, canonical, metadata, and navigation behavior.

### M-R05 — Autoplay previews and media alternatives may fail time-based-media requirements

- **Severity:** `P1 high`
- **Affected:** 17 MP4 chapters and lab player; `CrossAxisProjectRail.tsx:861-1107`; `VideoPlayerLab.tsx:105-193`.
- **Sources:** [09-R-01, 09-R-02](./09-accessibility.md).
- **Evidence:** inline previews loop without local pause; no tracks/transcripts/audio descriptions; 16 MP4s contain audio handler markers, but duration and meaningful audio/content equivalence were not verified.
- **Reproduction:** probe duration/audio and compare every clip against surrounding alternatives; leave previews running beyond five seconds.
- **Impact/root cause:** motion/cognitive and deaf/blind/low-vision users may lack required control or equivalent information; media was added without a classification matrix.
- **Recommendation:** classify each clip and add required pause, captions, transcript, description, or decorative treatment.
- **Alternatives/tradeoffs:** poster/manual play or static annotated images reduce media-production burden but change richness.
- **Effort/dependencies:** `M–L`, 2–5 days; media probing, content owner, accessibility production.
- **Objective verification:** per-asset duration/audio/meaning/alternative matrix and human review prove every applicable WCAG criterion.

### M-R06 — Offline/repeat resilience and route/module recovery contract is undefined

- **Severity:** `P2 medium`
- **Affected:** both routes, hashed assets, route chunks; no service worker; root/router error boundaries.
- **Sources:** [RISK-12-001, RISK-12-003, RISK-12-004](./12-offline-pwa-resilience.md).
- **Evidence:** no SW/offline fallback, cache requires revalidation, no app-specific route/module recovery boundary, and midstream stalls are not modeled.
- **Reproduction:** clean first/repeat offline loads; block route chunks; stall media; inspect bounded recovery.
- **Impact/root cause:** previously viewed pages may fail offline and deploy races/chunk failures may strand users; online-only contract and failure UX were never defined.
- **Recommendation:** decide online-only versus repeat-offline; at minimum provide bounded retry/reload/home recovery and explicit stalled/error states.
- **Alternatives/tradeoffs:** browser-cache improvements without a SW reduce lifecycle risk; full offline shell adds update/storage complexity.
- **Effort/dependencies:** `M–L`, 1–7 days depending contract; caching, error boundaries, tests, deployment versioning.
- **Objective verification:** automated clean-profile matrix proves documented first/repeat offline and chunk/stall recovery without reload loops or mixed-version assets.

### M-R07 — Privacy notice and Cloudflare operational-data governance are unresolved

- **Severity:** `P2 medium`
- **Affected:** all routes; absent privacy/legal pages; Cloudflare NEL/edge analytics settings.
- **Sources:** [DEP-13-R07](./13-production-deployment.md), [R15-002](./15-content-assets-legal-privacy.md).
- **Evidence:** no cookies/forms/analytics beacon were observed, but `NEL`/`Report-To` is active and no data-flow/retention/access record or notice exists.
- **Reproduction:** compare live network/cookies/headers with Cloudflare dashboard settings and legal documents.
- **Impact/root cause:** transparency/governance obligations may be unmet depending on processing and jurisdiction; small-site assumptions were not documented.
- **Recommendation:** map actual data flows and obtain owner/counsel decision before adding any notice, consent UI, or analytics.
- **Alternatives/tradeoffs:** keep the no-beacon/cookieless posture; do not add a generic banner without a technical/legal need.
- **Effort/dependencies:** `S–M`, 0.5–2 days plus legal review; Cloudflare owner and audience/jurisdiction facts.
- **Objective verification:** approved data map matches clean-session requests/storage and any required notice/consent exactly.

### M-R08 — Observability, alerting, private source mapping, and environment drift are unverified

- **Severity:** `P1 high`
- **Affected:** production Worker; `wrangler.jsonc:1-17`; GitHub/Cloudflare dashboards.
- **Sources:** [DEP-13-R01 through DEP-13-R03](./13-production-deployment.md), [CI14-005](./14-tests-ci-release.md).
- **Evidence:** no repository observability contract, alert thresholds, private source-map upload, or declared variable/binding contract; `keep_vars:true` can preserve dashboard drift. Dashboard-only controls were inaccessible.
- **Reproduction:** inspect config/workflow and authorized dashboard names/settings; inject a controlled preview failure.
- **Impact/root cause:** failures may go undetected or be hard to map/reproduce; operational settings may drift outside review.
- **Recommendation:** establish minimal metrics/logs/alerts/release correlation, private release-bound maps, and a name-only environment contract.
- **Alternatives/tradeoffs:** Cloudflare native metrics plus one external monitor is a lower-cost baseline; do not publish maps.
- **Effort/dependencies:** `M`, 1–3 days; dashboard access, privacy/retention, incident owner.
- **Objective verification:** controlled preview error creates a searchable source-mapped event and owned alert; production has no undeclared variable/binding names.

### M-R09 — Responsive/hybrid-input/forced-color layouts contain unresolved source-level risks

- **Severity:** `P2 medium`
- **Affected:** both routes; short-height landscape layouts, hover-gated controls, custom scrollbar, forced-color states, safe areas.
- **Sources:** [09-R-03, 09-R-04](./09-accessibility.md), [RESP-11-005 through RESP-11-008](./11-responsive-cross-browser.md).
- **Evidence:** 10px scrollbar target, width-only landscape breakpoint, hover-dependent controls on hybrids, sparse forced-color rules, and no safe-area policy; no real-device proof.
- **Reproduction:** test landscape phones, touch laptops, forced colors, 200% text/400% zoom, notched devices, modal focus.
- **Impact/root cause:** controls/content may be hard to hit, hidden, trapped, or indistinguishable; complex layout lacks executed acceptance matrix.
- **Recommendation:** measure/fix only observed failures, expanding hit areas and using native/system-color fallbacks where needed.
- **Alternatives/tradeoffs:** native controls/scrollbars reduce branding but improve platform consistency.
- **Effort/dependencies:** `M`, 1–3 days testing/remediation; devices, Windows HC, AT.
- **Objective verification:** recorded matrix passes target-size, zoom/reflow, touch, focus, forced-color, landscape, and safe-area criteria.

### M-R10 — Dormant links/assets are not safe to expose or remove without owner decisions

- **Severity:** `P2 medium`
- **Affected:** 34–36 unreferenced public files; dormant Bits n Pixels/Glaze/GitHub links; Calm AI record; rollback assets.
- **Sources:** [INV-R02, INV-R03](./01-inventory.md), [CQ-R03](./02-code-quality.md), [R-FQA-003](./10-functional-interaction-qa.md), [C15-002, R15-005, R15-006](./15-content-assets-legal-privacy.md).
- **Evidence:** Bits n Pixels is NXDOMAIN; several GitHub URLs return 404 and Glaze timed out; unreferenced assets total about 15.3 MiB, but live still uses legacy portraits and design docs own some SVGs.
- **Reproduction:** map all current/derived/live/rollback references and independently validate dormant destinations.
- **Impact/root cause:** exposure can create dead links; removal can break live/rollback/design workflows; runtime and archive assets share `public/`.
- **Recommendation:** classify ownership/status/rollback/direct-link contracts before any exposure or deletion.
- **Alternatives/tradeoffs:** keep all ambiguous files through launch; costs payload/storage but avoids irreversible breakage.
- **Effort/dependencies:** `M`, 0.5–1 day classification; M-C01, content/design/rollback owners.
- **Objective verification:** every shipped file/link has owner, purpose, status, and accepted availability; approved removals have zero candidate/rollback/direct references.

### M-R11 — Exact production dependency provenance and continuous secret coverage are unverified

- **Severity:** `P2 medium`
- **Affected:** live bundles, lock graph, CI artifacts, repository/history/dashboard secrets.
- **Sources:** [DEP-R03, DEP-R04](./04-dependencies-supply-chain.md).
- **Evidence:** point-in-time audit found no advisories/secrets, but no signed live SBOM/provenance binds bytes to the lock; entropy/history-native scanners and dashboard secret settings were unavailable.
- **Reproduction:** map a production asset digest to build/SBOM/signature and run approved full-history/push-protection fixtures.
- **Impact/root cause:** incident triage cannot prove live exposure and nonstandard/encoded secrets may be missed; no attestation/continuous gate.
- **Recommendation:** retain signed build metadata/SBOM and enable vetted history-aware scanning/push protection.
- **Alternatives/tradeoffs:** commit/build ID plus private artifact record is simpler but proves correlation more than integrity.
- **Effort/dependencies:** `M`, 1–2 days; CI retention, signing identity, repository security access.
- **Objective verification:** a live digest resolves to immutable source/tool/lock/SBOM metadata; documented fake secret is blocked; reviewed full-history scan is clean.

### M-R12 — 500 behavior and incident recovery were not safely exercised

- **Severity:** `P2 medium`
- **Affected:** SSR/router/Worker error paths, monitoring, rollback.
- **Sources:** [03 Not Tested](./03-application-security.md), [07 Not Tested](./07-technical-seo.md), [12 Not Tested](./12-offline-pwa-resilience.md), [13 Not Tested](./13-production-deployment.md), [14 Not Tested](./14-tests-ci-release.md).
- **Evidence:** no deterministic safe production exception exists; no controlled staging 500, alert, canary, rollback, cache purge, or incident drill was run.
- **Reproduction:** add/use an authorized preview-only failure fixture and follow the future incident runbook.
- **Impact/root cause:** actual status/body/privacy/retry/alert/rollback behavior is unknown; no production-like preview or drill.
- **Recommendation:** test controlled 500 and rollback only in preview/nonproduction before sign-off.
- **Alternatives/tradeoffs:** framework-level integration tests are safer but do not prove edge alerts or operational recovery.
- **Effort/dependencies:** `M`, 0.5–1 day after preview/observability exists; M-C11 and M-R08.
- **Objective verification:** preview returns correct accessible non-sensitive 500, alert fires with release/correlation, and rollback restores the prior version within the agreed objective.

## Opportunities and quick wins

### M-O01 — Fix small deterministic UI defects

- **Severity:** `P3 low`
- **Affected:** `CutCornerButton.tsx:5-21`; mobile next-story cue; reduced-motion lab autoplay; 404 shell.
- **Sources:** [CQ-04](./02-code-quality.md), [RESP-11-001, RESP-11-002](./11-responsive-cross-browser.md), [INV-C02](./01-inventory.md).
- **Evidence:** literal `undefined` class, reversed swipe copy, unconditional lab autoplay, and bare 404 are narrowly scoped and independently reproducible.
- **Reproduction:** inspect SSR/classes/copy, emulate reduced motion, request unknown route.
- **Impact/root cause:** visible polish/accessibility/recovery defects with low change surface; missing explicit contracts.
- **Recommendation:** bundle only after authorization as separate surgical fixes with focused tests.
- **Alternatives/tradeoffs:** keep each as an independent patch for easier rollback; more release overhead.
- **Effort/dependencies:** `S`, hours to one day; design/copy and test approval.
- **Objective verification:** no `undefined` class; correct gesture cue; reduced-motion video paused; accessible 404 passes.
- **Current disposition:** the bare-404 sub-item is complete under ITEM-08. The other listed quick-win defects remain separately open.

### M-O02 — Add a versioned release/surface manifest

- **Severity:** `P2 medium`
- **Affected:** routes, stories/media/assets, CI artifact, deployment metadata.
- **Sources:** [INV-O01](./01-inventory.md), [DEP-R03](./04-dependencies-supply-chain.md), [DEP-13-O02](./13-production-deployment.md), [CI14-O02](./14-tests-ci-release.md).
- **Evidence:** manual audit reconciled 2 routes, 32 chapters, 83 current referenced assets, artifact hashes, and multiple release identities with no single contract.
- **Reproduction:** attempt to map a live asset to SHA/lock/SBOM/state counts from one record; none exists.
- **Impact/root cause:** recurring drift and slow incident/audit correlation; release metadata is fragmented.
- **Recommendation:** generate a non-secret JSON/Markdown manifest with SHA, lock/tool versions, route/story counts, asset checksums, Worker version, test links, and release URL.
- **Alternatives/tradeoffs:** job summary only is simpler but cannot be queried from runtime; runtime header only lacks test evidence.
- **Effort/dependencies:** `M`, 0.5–1 day after artifact flow; M-C11.
- **Objective verification:** one command proves live identity and resolves every release gate/artifact from the manifest.

### M-O03 — Add a risk-tiered release QA matrix

- **Severity:** `P2 medium`
- **Affected:** both routes and future CI cadence.
- **Sources:** [LH-06-O01](./06-lighthouse.md), [RESP-11-010](./11-responsive-cross-browser.md), [CI14-O01](./14-tests-ci-release.md), [O-FQA-001](./10-functional-interaction-qa.md).
- **Evidence:** broad state/browser/performance surface has no repeatable matrix, while running every permutation on every PR would be expensive.
- **Reproduction:** map current critical behaviors to existing checks; most have none.
- **Impact/root cause:** either slow oversized gates or no protection; no cadence/ownership model.
- **Recommendation:** PR critical unit/component + Chromium desktop/mobile; prelaunch WebKit/Firefox/a11y/network; scheduled full media/link/performance sweep.
- **Alternatives/tradeoffs:** make the entire matrix blocking for maximum confidence at higher cost/flake exposure.
- **Effort/dependencies:** `L`, 3–7 days after M-C10; browser policy and artifact storage.
- **Objective verification:** every critical behavior maps to a named test/cadence and required failures cannot be suppressed or bypassed silently.

### M-O04 — Add truthful machine-readable identity and social metadata

- **Severity:** `P3 low`
- **Affected:** home head, optional public lab, future social image/JSON-LD.
- **Sources:** [08-OPP-001](./08-metadata-social-structured-data.md), [SEO-07-O01](./07-technical-seo.md).
- **Evidence:** no JSON-LD or project-specific documents; current metadata is generic.
- **Reproduction:** search SSR for `application/ld+json` and inspect route tree/project state.
- **Impact/root cause:** optional discoverability/entity clarity and deep-link opportunity; document model prioritizes one immersive page.
- **Recommendation:** after URL/identity approval, add minimal truthful Person/WebSite JSON-LD and consider project routes only if organic discovery is a goal.
- **Alternatives/tradeoffs:** omit JSON-LD until facts are stable; keep one-page model if search acquisition is not a goal.
- **Effort/dependencies:** `S` for JSON-LD, `L` for case-study routes; canonical/copy/rights decisions.
- **Objective verification:** schema validators pass; every assertion is visible/approved; any project route has unique SSR title/H1/canonical/sitemap entry.

### M-O05 — Adopt field CWV and artifact/media budgets

- **Severity:** `P2 medium`
- **Affected:** both routes, release observability/CI.
- **Sources:** [PERF-05-O01](./05-performance.md), [LH-06-O02](./06-lighthouse.md), [DEP-13-O03](./13-production-deployment.md).
- **Evidence:** live 16-video regression shipped despite good isolated paint samples; no field p75 or request/byte budgets exist.
- **Reproduction:** inspect release checks and available dashboards.
- **Impact/root cause:** regressions can ship without a score or traffic-specific signal; no performance contract.
- **Recommendation:** privacy-review route/device CWV collection and gate compressed JS/CSS plus initial media request/byte counts.
- **Alternatives/tradeoffs:** scheduled synthetic monitoring avoids client telemetry but provides less real-user evidence.
- **Effort/dependencies:** `M`, 1–2 days; privacy decision and observability owner.
- **Objective verification:** dashboard shows route/device p75 LCP/INP/CLS and CI fails approved budget fixtures.

### M-O06 — Add security disclosure and controlled DNS/hostname hardening

- **Severity:** `P3 low`
- **Affected:** `/.well-known/security.txt`, optional `www`, DNSSEC/CAA, alternate Worker hosts.
- **Sources:** [SEC-O02](./03-application-security.md), [SEO-07-O02](./07-technical-seo.md), [DEP-13-R04 through DEP-13-R06](./13-production-deployment.md).
- **Evidence:** no security.txt; `www` is NXDOMAIN; DNSSEC/CAA and auxiliary-host posture are absent/unverified.
- **Reproduction:** probe well-known URL, DNS records, and authorized Worker domain settings.
- **Impact/root cause:** disclosure routing and guessed-host resilience are weaker; optional hardening is not governed.
- **Recommendation:** publish monitored security contact; decide `www` and preview-host policy; stage DNSSEC/CAA only with owner/rollback.
- **Alternatives/tradeoffs:** leaving `www` absent is valid if explicitly unsupported; DNS changes can cause outages if guessed.
- **Effort/dependencies:** `S–M`, hours to one day; security contact, DNS/registrar owner.
- **Objective verification:** security.txt validates; supported host redirects once or is documented unsupported; DNS validators pass without renewal/resolution regression.

### M-O07 — Establish content/asset governance and archive policy

- **Severity:** `P3 low`
- **Affected:** `public/`, portfolio data, external links, rights register.
- **Sources:** [CQ-O01](./02-code-quality.md), [O15-002, O15-003](./15-content-assets-legal-privacy.md).
- **Evidence:** unreferenced assets, duplicates, MIME mismatch, stale destinations, and incomplete rights records are mechanically detectable.
- **Reproduction:** rerun reference, signature, hash, link, and rights-register checks.
- **Impact/root cause:** release size/noise and content/legal regression risk; no asset lifecycle policy.
- **Recommendation:** maintain approved runtime/rollback/design classifications and a non-flaky content/link/MIME/rights gate; archive outside public deploy root only after approval.
- **Alternatives/tradeoffs:** non-blocking scheduled report first avoids flaky external-link blocking.
- **Effort/dependencies:** `M`, 1–2 days; M-C01, rights decisions, CI owner.
- **Objective verification:** public allowlist matches output; checks distinguish NXDOMAIN/404/timeout; rights completeness blocks only approved severity classes.

### M-O08 — Add installability/offline behavior only after a product decision

- **Severity:** `P3 low`
- **Affected:** root head, `public/`, future manifest/service worker.
- **Sources:** [08-OPP-002](./08-metadata-social-structured-data.md), [OPP-12-001, OPP-12-002](./12-offline-pwa-resilience.md).
- **Evidence:** no manifest, install icons, SW, or install promise; client artifact is about 40 MiB and unsafe to precache wholesale.
- **Reproduction:** inspect head/public/SW endpoints and artifact size.
- **Impact/root cause:** optional installed/offline experience; naïve PWA work would add cache/update/quota risk.
- **Recommendation:** remain a conventional site unless installability is approved; if approved, use a small shell and bounded viewed-media caching.
- **Alternatives/tradeoffs:** manifest-only install identity can mislead users about offline support; no PWA is valid.
- **Effort/dependencies:** `S` metadata, `L` robust offline lifecycle; product, brand, caching, tests.
- **Objective verification:** approved contract passes install/update/offline/quota tests within a defined byte budget.

## False positives / non-issues

- The 14 candidate asset URLs missing on live are not all current broken UI requests; live serves an older graph. They prove drift, not 14 visible breakages.
- The 34–36 files without current source references are not approved dead assets. Some support live rollback or documented brand-source workflows.
- GitHub 404s may be private repositories; dormant links become defects only if exposed without validation.
- No service worker, manifest, JSON-LD, consent banner, `www`, or custom font is inherently a defect without an approved product/legal requirement.
- Missing public source maps are a security-positive; the risk is missing private release-bound symbolication.
- Lighthouse Performance is absent, not zero or 100. One 80 ms interaction is not field INP; no trace-derived TBT 0 was claimed.
- The committed Cloudflare account ID is not an authentication secret; the API token value was not found or inspected.
- Test-like files under `.agents/skills/**` are developer-skill fixtures, not application test coverage.
- Framework-generated suppressions in `routeTree.gen.ts` are intentional generated code, not authored quality debt.
- Empty alt on decorative logo/poster/portrait layers is paired with accessible surrounding labels and was not treated as missing alternative text.
- A cookie banner is not justified by current network evidence: no cookies, marketing scripts, or client analytics beacon were observed.

## Passed checks

- Source and generated route tree agree on exactly two routes; both live routes return `200`; unknown routes return real `404`.
- `bun run check` passed for local HEAD; existing `dist/server/server.js` parsed and rendered both routes.
- Latest remote workflow for `5d80cbf…` passed frozen install, type-check, build, Wrangler dry run, deploy, and its narrow title sentinel.
- All current literal/derived asset paths exist locally; all 117 content assets are byte-identical in existing `dist/client`.
- Every currently displayed unique HTTPS destination tested returned `200`; no visible broken HTTPS link was confirmed.
- Point-in-time `bun audit --json` returned no advisories; all 204 lock records carry SHA-512 integrity; no current high-confidence secret was found in tracked history/dist/sampled live bundles.
- No app auth, API mutation, cookie, form, third-party executable script, external font, public source map, attacker-controlled injection source, or sensitive error disclosure was found.
- HTTPS certificate validation, TLS 1.2/1.3, HTTP/2, Brotli/gzip/Zstandard negotiation, correct sampled MIME, ETags, CDN hits, and 304 conditional responses passed.
- Four Lighthouse runs scored Best Practices 100, SEO 100, and Agentic Browsing 100; Accessibility was 96 because of recorded contrast failures. No audits were hidden to improve scores.
- Measured CLS samples were 0; current source reserves media dimensions, supports reduced motion on the home gallery, uses posters/placeholders, and all MP4s place `moov` before `mdat`.
- SSR exposes meaningful primary text and crawlable anchors; Googlebot/browser responses matched; no cloaking or soft 404 was observed.
- Core links/buttons use native elements and most controls are 44–48 CSS px; source includes dialog Escape/trap/inert/focus-return intent and keyboard rail/tab handlers.
- No current service worker/storage queue exists, so there is no stale SW controller, unflushed offline write, or storage quota defect.

## Not tested / coverage gaps

- No fresh production build was permitted. Existing `dist` was inspected, and local HEAD has not passed the remote build/dry-run pipeline.
- Exhaustive pointer/touch/keyboard interactions for every link/button/story/scrollbar/modal/media/tab were not executed by most specialists.
- Safari/WebKit, Firefox/Gecko, Edge, iOS Safari, Android Chrome/TalkBack, Samsung Internet, hybrid touch, physical safe areas, and orientation changes remain incomplete.
- NVDA, JAWS, VoiceOver, TalkBack, rotor/landmark behavior, live announcements, actual modal focus/inert interoperability, and forced-colors runtime were not exercised.
- 200% text resize, 320 CSS px/400% zoom, text-spacing overrides, system font scaling, dark/contrast modes, and print were not comprehensively rendered.
- Cold cache-disabled mobile Lighthouse Performance, Speed Index, trace-derived TBT, five-run variability, CPU/network throttling, packet loss, and field CrUX/RUM p75 data are absent.
- JavaScript-disabled and blocked-main-module Chromium coverage is complete for desktop/mobile. Offline first/repeat navigation, Slow 3G, CSS/route-chunk/image/video failure injection, media stalls, non-Chromium behavior, and mixed-version deployment recovery remain incomplete.
- MP4 duration/audio/codec/frame/caption/transcript/flash analysis and every asset’s visual/rightsholder review were not completed.
- Search Console, Bing Webmaster Tools, selected canonicals, index coverage, URL Inspection, social preview debuggers, and physical favicon/install rendering were unavailable.
- Cloudflare dashboard settings/token scopes/WAF/logs/alerts/analytics/vars, GitHub security consoles, production source-map state, DNS change safety, multi-region availability, and historical uptime were inaccessible.
- A safe production `500`, load/DoS testing, rollback/canary/cache-purge drill, alert delivery, and incident response were intentionally not performed.
- Legal conclusions about privacy, cookies, licenses, trademarks, client permissions, collaborator consent, NDAs, and jurisdiction remain outside this technical audit.

## Recommended implementation phases

These phases are recommendations for later authorization; this audit performs none of them.

1. **Decision freeze:** choose the release SHA; decide lab publication, supported hostnames/browsers, offline/PWA contract, rights status, privacy posture, and launch score thresholds.
2. **Release foundation:** build once, retain manifest/artifact, add preview/promotion/approval, strengthen smoke/observability, and rehearse rollback.
3. **Transport and security:** enforce HTTPS, raise TLS minimum, stage headers/CSP, pin actions, and add supply-chain gates.
4. **User-facing blockers:** fix WCAG contrast/reflow/semantics, 404, reduced motion/touch/focus, and media recovery. The live no-JS and media-overfetch blockers are complete.
5. **Discovery/delivery:** canonicalize URLs, decide sitemap/robots/lab indexing, add route/social metadata, correct caching/ranges, and validate content destinations.
6. **Evidence gate:** add layered tests, full browser/AT/device matrix, five-run Lighthouse Performance, field/synthetic budgets, failure injection, and production parity verification.
7. **Maintainability/content follow-up:** characterize then modularize the rail; archive approved dead assets/styles; complete rights/role records and optional JSON-LD/PWA work.

## Dependency order

`Owner decisions and rights approval` → `immutable candidate SHA` → `retained build/manifest` → `preview/version deployment` → `transport/security/release controls` → `user-facing blocker fixes` → `automated browser/AT/performance/failure gates` → `production promotion` → `post-deploy parity/monitoring` → `optional cleanup/refactor/PWA`.

Key constraints:

- Do not tune or delete against live until M-C01 is resolved.
- M-C10 characterization coverage is now complete; any `CrossAxisProjectRail` refactor must keep its 12-case gate green and still needs the visual/cross-browser baselines listed under M-C13/M-R01.
- Repeat the report-only browser/media gate before any future CSP source-policy expansion.
- Do not add immutable caching to mutable media paths.
- Do not expose or remove dormant links/assets before owner/rights/rollback classification.
- Do not add a service worker before the offline/update/cache-budget contract and release IDs exist.

## Objective launch acceptance criteria

1. Zero unresolved `P0 blocker` or `P1 high` confirmed findings; every P1 risk is either objectively closed or explicitly accepted by the accountable owner with evidence.
2. One full SHA, lock hash, retained artifact checksum, GitHub deployment SHA, Cloudflare version, runtime build ID, and live asset manifest match.
3. HTTP redirects once to HTTPS with path/query preserved; TLS 1.0/1.1 fail; TLS 1.2/1.3 pass; approved HSTS and security headers cover applicable HTTPS 200/404/controlled 500 responses and representative static media.
4. No-JS and blocked-main-module loads visibly retain identity, work, and contact content.
5. Cold mobile/desktop `/` requests meet the approved media budget: ≤1 initial MP4, zero portrait before reveal, no inactive video bodies, optimized portraits only.
6. WCAG 2.2 AA acceptance matrix passes: text/focus contrast, 320 CSS px reflow, H1/landmarks/tabs, keyboard/touch/modal focus, reduced motion, target size, media alternatives, zoom, forced colors, and accessible 404.
7. Product owner records the `/video-player-lab` publication/indexing decision; route status/navigation/metadata/canonical/sitemap policy matches it.
8. Both public routes have unique SSR title/description/canonical and approved social metadata; robots/sitemap/URL variants follow one canonical policy.
9. All expected local assets and enabled outbound links return approved statuses/MIME; image/video failure fixtures show usable fallback/retry; MP4 range behavior meets the chosen delivery contract.
10. CI blocks non-approved refs and runs frozen install, route-tree cleanliness, type-check, lint/format policy, unit/component/SSR/browser/a11y/security/dependency/license/content gates.
11. Critical browser journeys pass in Chromium desktop/mobile and the supported WebKit/Firefox/device/AT matrix; zero unexpected console/page/hydration/network errors.
12. Five consecutive cold, unmodified Lighthouse runs per route/profile retain raw reports and meet the declared category thresholds; Performance score is present; no bad run is discarded.
13. Rights register and role/status copy are approved for every published project/asset; privacy/data-flow review matches observed processing.
14. Controlled preview tests prove 404/500/chunk/media/offline recovery, alert delivery, source-mapped diagnosis, and rollback to the previous artifact within the agreed recovery objective.
15. The same full gate is rerun against production after promotion and proves parity with the approved preview/artifact.

## Unresolved questions

1. Which exact SHA is the launch candidate: live `5d80cbf…`, local `ae1ec7c…`, or another reviewed commit?
2. Is `/video-player-lab` public portfolio content, an explicitly labeled lab, noindex-only, protected, or excluded?
3. Which browsers/devices/assistive technologies and offline behavior are formally supported?
4. Must the launch claim honest stable Lighthouse 100s, or a lower evidence-based threshold with field CWV?
5. Are `www`, Worker preview URLs, and workers.dev intended supported surfaces?
6. Does the owner have permission/release evidence for every project screenshot/video, portrait, mark, collaborator contribution, and client/employer work?
7. What are the approved project names, roles, shipped/concept statuses, dates, collaborators, and destinations—especially Glaze/Glazed, Bits n Pixels, and Calm AI Studio?
8. What Cloudflare data processing, NEL/analytics/log retention, token scopes, vars/bindings, monitoring, and alert policies exist outside the repository?
9. What GitHub plan/visibility and reviewer model can enforce protected release promotion?
10. What are the accepted RTO/rollback threshold, artifact retention window, cache TTLs, media byte budgets, and performance/CWV budgets?
11. Do the videos contain meaningful audio or visual information requiring captions, transcripts, or audio description, and do any autoplay previews exceed five seconds?
12. Is installability/PWA/offline repeat access a product requirement, or should the site remain explicitly online-only?

## Specialist reports

1. [01 — Surface, route, component, state, and asset inventory](./01-inventory.md)
2. [02 — Code quality, architecture, and maintainability](./02-code-quality.md)
3. [03 — Application security and OWASP risks](./03-application-security.md)
4. [04 — Dependencies, supply chain, secrets, and licensing](./04-dependencies-supply-chain.md)
5. [05 — Performance, Core Web Vitals, bundles, and media](./05-performance.md)
6. [06 — Lighthouse mobile and desktop readiness](./06-lighthouse.md)
7. [07 — Technical SEO, crawlability, and indexability](./07-technical-seo.md)
8. [08 — Metadata, social cards, favicons, manifest, and structured data](./08-metadata-social-structured-data.md)
9. [09 — WCAG 2.2 AA accessibility](./09-accessibility.md)
10. [10 — Functional and interaction QA](./10-functional-interaction-qa.md)
11. [11 — Responsive, cross-browser, touch, keyboard, and motion QA](./11-responsive-cross-browser.md)
12. [12 — Offline, PWA, service-worker, and network resilience](./12-offline-pwa-resilience.md)
13. [13 — Production deployment, operations, headers, and privacy](./13-production-deployment.md)
14. [14 — Automated tests, CI, and release readiness](./14-tests-ci-release.md)
15. [15 — Content, links, assets, legal, and privacy](./15-content-assets-legal-privacy.md)

## Implementation progress — ITEM-01 retire `/video-player-lab`

- **Status:** `Complete — verified in production` (2026-07-31).
- **Implemented scope:** removed the standalone route, component, and CSS module; regenerated the TanStack route tree. The Orgo walkthrough asset remains because the portfolio viewer still uses it.
- **Objective evidence:** `bun run check` and `bun run build` pass; local SSR returns `/` as `200` with exactly one retained video and `/video-player-lab` as `404`; the new build contains no lab route/chunk/text; focused browser QA opened the retained Orgo viewer with media `readyState=4`, duration `4.534`, `error=null`, and no console errors/warnings.
- **Regression guard:** SHA-256 hashes for `CrossAxisProjectRail.tsx`, its CSS module, `portfolio-data.ts`, the Orgo MP4, and its poster are unchanged from the pre-change baseline.
- **Finding disposition:** `M-R04` is complete. Lab-only portions of `M-C07`, `M-C08`, `M-C09`, `M-C15`, `M-C17`, and `M-R05` are retired in production. `M-C07` subsequently completed under ITEM-07; the other homepage/site-wide portions remain open. `M-C01` parity was established for that deployed revision and made durable under ITEM-09; ITEM-09 also completed the provenance/immutable-artifact portions of `M-C11` while approval, preview, observability, and rollback remain open.
- **Production acceptance evidence:** GitHub merge SHA `c273f81f59b8a1d7cd01e3cedb03b948b7d6cd32`, Actions run `30657215155`, and Cloudflare version `b8c0dab8-207e-4568-87ca-289ef74ae6e6` are bound by the deployment log. Public `/` returns `200` with the new hashed assets; `/video-player-lab` returns `404` with no redirect; browser QA opened and played the retained Orgo viewer at `readyState=4`, duration `4.534`, `error=null`, with no console errors/warnings.

## Implementation progress — ITEM-02 enforce HTTPS transport

- **Status:** `Complete — verified in production` (2026-08-01).
- **Implemented scope:** Cloudflare Single Redirect rule `68b2d9da04134d4e9aef99e85002e36c` (`Enforce HTTPS (308)`) redirects `http://*` to `https://${1}` with status `308` and query preservation. Response Header Transform rule `1bf3a525052b4554b7060662c14b2f8d` (`Staged HSTS (300 seconds)`) sets `Strict-Transport-Security: max-age=300` only when `http.host eq "m0code.com" and ssl`. Cloudflare managed HSTS, `includeSubDomains`, and preload remain disabled.
- **Objective evidence:** HTTP `/`, `/video-player-lab?audit=1`, `/assets/index-CtbOey3K.js?audit=1`, POST `/contact?from=audit`, and the Orgo MP4 each return one `308` to the identical HTTPS path/query. Following the retired-path URL produces exactly one redirect and the expected final `404`. HTTPS `/` is `200`, the retired path is `404`, JS and MP4 are `200`, and all carry exactly `max-age=300`; cache-busted HTTP responses omit HSTS.
- **Regression evidence:** TLS 1.2 and TLS 1.3 still negotiate. Browser QA loaded the portfolio without console warnings/errors and played the retained Orgo viewer from `https://m0code.com/portfolio/projects/orgo/walkthrough.mp4` at `readyState=4`, duration `4.534`, `error=null`. No repository source, dependency, lockfile, or deployment configuration changed.
- **Finding disposition:** `M-C02`, `SEC-001`, `SEO-07-001`, and `DEP-13-001` are complete. The protocol portion of `08-META-001` is complete; missing canonical/query policy remains open. `M-C03` is now complete under ITEM-03; the deliberate post-canary HSTS duration decision remains a separate follow-up.

## Implementation progress — ITEM-03 require TLS 1.2+

- **Status:** `Complete — verified in production` (2026-08-01).
- **Implemented scope:** changed only the Cloudflare zone-level Edge Certificates `Minimum TLS Version` setting from `TLS 1.0 (default)` to `TLS 1.2`; TLS 1.3 remains enabled. No repository source, dependency, lockfile, Worker, DNS, certificate, redirect, HSTS, cache, or deployment configuration changed.
- **Objective evidence:** after dashboard reload, the setting persisted as `TLS 1.2`. Forced TLS 1.0 and TLS 1.1 requests fail before HTTP with `curl` exit 35 and `tlsv1 alert protocol version`; forced TLS 1.2 returns `200` with certificate verification, and OpenSSL TLS 1.3 negotiates successfully with verification `OK`.
- **Independent evidence:** SSL Labs engine 2.4.2 completed against all four advertised IPv4/IPv6 endpoints; every endpoint received grade `A`, reported no warnings, and exposed only TLS 1.2 and TLS 1.3.
- **Regression evidence:** production `/` remains `200`, the retired `/video-player-lab?tls=1.2` remains `404`, the current JS asset is `200`, and the retained Orgo MP4 is `200 video/mp4`. Browser QA opened the retained Orgo viewer at `readyState=4`, duration `4.534`, `currentTime=0.721`, `paused=false`, `error=null`, with no console errors.
- **Finding disposition:** `M-C03` and `DEP-13-002` are complete. Rollback is restoring the prior Cloudflare minimum only if an approved legacy-client requirement is discovered.

## Implementation progress — ITEM-04 enforce browser security headers

- **Status:** `Complete — verified in production` (2026-08-01).
- **Implemented scope:** added per-response nonce CSP in `src/server.ts:5-56`, TanStack SSR nonce propagation in `src/router.tsx:7-19`, and Cloudflare Response Header Transform `fad9352426bf49b0b7f2916ed66a5d5d` for exact `nosniff`, `DENY`, referrer, and minimal permissions policies. The retained Orgo player/source was not changed.
- **Staged evidence:** report-only production run [30696115179](https://github.com/MoIbrahim10/portfolio/actions/runs/30696115179) completed before enforced run [30696408648](https://github.com/MoIbrahim10/portfolio/actions/runs/30696408648). Both passed frozen install, type-check, build, Worker dry-run, deploy, and smoke verification.
- **Objective evidence:** rotating 32-character nonces match every SSR script on HTML `200` and `404`; no report-only header remains. Exact edge headers pass on HTML, controlled JSON `500`, JS, CSS, SVG, and Orgo MP4. Browser home/hydration, modal, active Orgo playback (`readyState=4`, `duration=4.534`, `paused=false`, `error=null`), and 404 checks emit zero warning/error logs.
- **Documented boundaries:** the Cloudflare-managed `text/plain` `/robots.txt` bypasses Response Header Transforms. The audit browser blocks synthetic test/data iframe harnesses; frame refusal is verified from enforced `frame-ancestors 'none'` plus `X-Frame-Options: DENY` rather than a rendered harness.
- **Finding disposition:** `M-C04`, `SEC-002`, `SEC-O01`, and `DEP-13-003` are complete. Rollback is redeploying the last approved application version and disabling Cloudflare rule `fad9352426bf49b0b7f2916ed66a5d5d` if a verified regression appears.

## Implementation progress — ITEM-05 verify no-JavaScript resilience

- **Status:** `Complete — verified in production` (2026-08-01).
- **Implemented scope:** evidence and tracking only. The deployed homepage already renders its identity, work, and contact content visibly from SSR and uses CSS-only entrance motion; no application, dependency, configuration, lockfile, deployment, or video-player change was necessary.
- **Objective evidence:** a 6/6 production Chromium matrix passed. Desktop (1440×1000) and mobile (390×844) passed with JavaScript disabled and with `/assets/index-DWNzLafz.js` blocked; the article computed to `opacity: 1`, `visibility: visible`, `filter: none`, and `transform: none`, while the bio, Orgo heading, and contact action retained visible geometry.
- **Regression evidence:** normal hydration and reduced-motion loads had no page errors. Reduced motion kept the initial video paused; the normal-flow Orgo viewer played with `readyState=4`, duration `4.534`, `error=null`.
- **Finding disposition:** `M-C05`, `SEO-07-R02`, `09-C-07`, and `OFF-12-001` are complete. Offline navigation, other resource-failure modes, non-Chromium engines, and assistive-technology coverage remain separately open. No rollback is applicable because runtime behavior was not changed.

## Implementation progress — ITEM-06 verify homepage media budget

- **Status:** `Complete — verified in production` (2026-08-01).
- **Implemented scope:** evidence and tracking only. The deployed current artifact already contains deferred inactive media and optimized `-640.webp` portraits; no application, dependency, configuration, lockfile, deployment, or player change was necessary.
- **Objective evidence:** Chrome traces plus a 5/5 cache-disabled browser matrix covered desktop, mobile, Slow 3G mobile, portrait reveal, and the Orgo modal. Every initial load requested exactly one MP4, no pre-reveal portrait, and WebP-only images; observed initial media files totaled 401,726 B desktop and 490,906 B mobile. Direct production GETs verified all six portraits at 31,426–39,254 B, below the 40 KB gate.
- **Parity evidence:** production and the current build match at 1 video, 32 images, 32 full-screen triggers, three root asset hashes, and the sole initial MP4. All 77 referenced assets returned `200` with correct MIME; deployment SHA `370419837bea1232dfb61348d46e1be7a315be6a` maps to Cloudflare version `c290c6be-291c-439d-94a6-119743aa2801`.
- **Regression evidence:** Orgo played at `readyState=4`, duration `4.534`, `paused=false`, `error=null`; the matrix recorded zero request, console, or page failures. `M-C06`, `PERF-05-001`, `LH-06-003`, and `FQA-001` are complete. Lighthouse Performance distributions, field CWV, caching, and broader interaction coverage remain separately open. No rollback applies because runtime behavior was not changed.

## Implementation progress — ITEM-07 meet WCAG contrast requirements

- **Status:** `Complete — verified in production` (2026-08-01).
- **Implemented scope:** raised muted semantic text opacity, assigned tested editorial caption colors, separated surface-aware focus tokens from decorative accents, preserved forced-colors focus, and changed only the failing Selected Experiments active dot. No layout, media source/loading, modal lifecycle, event handling, or video-player logic changed.
- **Objective evidence:** all story text is ≥4.68:1, all 32 caption pairs ≥5.07:1, selected indicators ≥3.95:1, story focus ≥6.07:1, and gallery focus 12.01:1. Production Chromium passed 390×844, 1440×1000, 200% text, reduced motion, forced colors, and Good Invoice hover. Lighthouse mobile/desktop scored Accessibility 100 with zero failed audits.
- **Regression evidence:** the public Orgo modal loaded the unchanged walkthrough at `readyState=4`, played to `currentTime=0.414`, paused, and closed with zero media, console, or page errors. Production serves `routes-BRnAUAbE.css` from merge `1db9d57008b6db30a32178fc4e83597d76074caa`, Actions run `30700858043`, Cloudflare version `a3299de6-82a2-49d7-9815-25da9fe35f8e`.
- **Finding disposition:** `M-C07`, `LH-06-001`, `09-C-01`, and `09-C-02` are complete. Lighthouse Performance, semantics, assistive-technology, full keyboard traversal, and non-Chromium coverage remain separate open items.

## Implementation progress — ITEM-08 complete semantic hierarchy and 404 recovery

- **Status:** `Complete — verified in production` (2026-08-01).
- **Implemented scope:** added a branded root-level not-found surface and root not-found routing, error-specific SSR metadata, one logical homepage H1, and labeled project-control groups. The only approved visible change is the new 404; homepage geometry and styling are unchanged.
- **Objective evidence:** local and production unknown URLs return HTTP `404` with title `Page Not Found — MO`, one description, `main`, H1, explanatory copy, and a working home link. Production `/` returns `200`, exposes one “Mo Ibrahim — Design Engineer” H1 and four labeled project groups, and contains no `Project controls` navigation landmarks.
- **Accessibility/responsive evidence:** 320, 390, 768, and 1440 CSS-pixel checks plus 200% text showed no horizontal overflow; recovery targets are at least 48 CSS px high. Keyboard focus/activation passed. Production desktop/mobile Lighthouse snapshots scored 100 in all four reported categories with zero failures; navigation-mode scoring is explicitly unavailable for a correct non-200 document.
- **Regression/release evidence:** the homepage role block kept the exact pre-change 914×788 rectangle and computed font/margin/color. The retained Orgo modal played the unchanged `/portfolio/projects/orgo/walkthrough.mp4` at `readyState=4` and closed with no console/page errors. PR [#10](https://github.com/MoIbrahim10/portfolio/pull/10), merge `f5bf8335aade35e68f9c5f1981ce6343e5386560`, Actions run `30701980701`, and Cloudflare version `3ba23d32-e67d-4e21-8a78-e92fe81dcaf6` identify the deployed release.
- **Finding disposition:** `M-C09`, `INV-C02`, `SEO-07-004`, `SEO-07-005`, `08-META-004`, `09-C-03`, `09-C-05`, `09-C-06`, `FQA-005`, and `C15-003` are complete. The 404 portion of `DEP-13-009` is complete; application `500` boundaries, observability, and correlation remain open. `M-C08` is confirmed retired under ITEM-01.

## Implementation progress — ITEM-09 establish immutable release provenance

- **Status:** `Complete — verified in production` (2026-08-01).
- **Implemented scope:** split CI into build and deploy jobs; retain the exact `dist` plus build manifest; hash all build files and release inputs; reject tampering before deployment; pin every action to a full SHA; block non-`master` production dispatches; retain the source/tool/artifact/Cloudflare/verification receipt. No UI, player, media, dependency, package manifest, or lockfile changed.
- **Objective evidence:** PR [#12](https://github.com/MoIbrahim10/portfolio/pull/12) proved PR build/artifact creation and deploy exclusion. Final run [30703230758](https://github.com/MoIbrahim10/portfolio/actions/runs/30703230758) built and reverified 130 files (37,637,574 bytes), deployed build artifact `8819491987` with SHA-256 `5ff2c2ad96fddbd48d16e35ba6582daac48d6d9536f14fbed3c8271b6f6ca318`, and retained release artifact `8819497837` with SHA-256 `d3f946304b7abb97ed530bc78b79911b3989627afbb50f299abe502a6ab1dfe0`.
- **Production acceptance:** release `87864fe684a187c885c788d8b7dd2eda21871f94` maps to Cloudflare version `3666f6f8-cea8-4133-9cf9-945cbc0dd3a0` and `https://m0code.com`. Attempt-1 smoke matched five generated asset hashes, brand hash, Orgo MP4 hash, homepage `200`, unknown `404`, and retired-lab `404`.
- **Player regression:** the live Orgo modal loaded the exact retained MP4, reached `readyState=4`, duration `4.534`, `error=null`, played and looped, emitted zero console errors, and closed normally.
- **Finding disposition:** `M-C01` and `M-C12` are complete. The provenance/immutable-artifact/smoke portions of `M-C11`, `DEP-13-010`, `CI14-003`, and `CI14-005` are complete; ITEM-10 subsequently completed candidate browser CI. Approval, preview, automated post-deploy browser execution, observability, and rollback remain open. GitHub warns that pinned checkout/artifact actions still declare Node 20 while the runner forces Node 24; this is tracked as `CI14-R05`.

## Implementation progress — ITEM-10 add the blocking product test gate

- **Status:** `Complete — verified in CI and against production` (2026-08-01).
- **Implemented scope:** locked Playwright 1.61.0; added desktop Chrome and Pixel 7 projects, strict runtime monitoring, deterministic media failure, 12 release-critical cases, CI browser installation/gating, and 14-day failure evidence. No CSS, media asset, source URL, or player UI changed.
- **Defects found and fixed:** reduced-motion SSR/client attributes could mismatch during hydration, and modal focus return could race the background `inert` cleanup. The rail now hydrates from a conservative motion-free state and restores focus only when the trigger is active.
- **Objective evidence:** frozen install, type-check, build, Worker dry-run, local CI 12/12, public production 12/12, PR #16 run `30706719944`, merge `ebcd8b1a8454bb69e37ba3ede9e5c11bb85d8ba8`, master run `30706793536`, and Cloudflare version `5c861a15-8d73-40ce-8524-c9b46ff1f4eb` passed. `M-C10`, `CQ-R02`, `O-FQA-001`, and `CI14-001` are complete; wider browsers/devices, unit coverage, automated post-deploy execution, approval/preview, observability, and rollback remain separately open.
