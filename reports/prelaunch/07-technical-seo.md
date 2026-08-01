# 07 — Technical SEO, Crawlability, and Indexability Audit

Audit date: 2026-07-29
Repository: `/Users/mo/Documents/porfolio` at `ae1ec7c`
Existing artifact: `dist/` (served read-only on localhost)
Live target: `https://m0code.com`

## Scope and method

- Inspected the generated route tree, root/head configuration, both route components, project-state navigation, deferred media code, Cloudflare route configuration, and the existing client/server artifacts.
- Served the existing `dist/server/server.js` read-only and requested the complete route/variant matrix below. No build was run.
- Probed live GET and HEAD behavior with ordinary, Googlebot, and Bingbot user agents; repeated the primary probes with `Cache-Control: no-cache`.
- Inspected raw response HTML to determine SSR completeness, headings, internal links, canonical/robots directives, image/video discoverability, and JavaScript-independent content availability.
- Requested every repository-referenced static media path with HEAD: 77 paths total.
- Checked all eight HTTPS outbound links exposed in the live home SSR; each resolved to a final `200`.
- Compared normalized response bodies for HTTP/HTTPS, route-case, tracking-query, and arbitrary-query variants. Dynamic SSR timestamps were normalized before SHA-256 comparison.
- Consulted only current primary Google documentation for policy/behavior claims: [canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [robots controls](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), and [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- No source, dependency, configuration, lockfile, Git state, external system, or deployment was changed.

Success criteria for this scope were: enumerate all routable documents; verify their live and built status behavior; identify canonical duplicate clusters; verify crawl directives, SSR content, semantic hierarchy, and crawlable internal links; distinguish confirmed defects from indexing risk; and avoid claiming actual index coverage without Search Console evidence.

## Crawl coverage matrix

| Target | Existing `dist` | Live | Result / evidence |
|---|---:|---:|---|
| `/` | `200`, 59,919 B | `200`, 46,519 B | SSR HTML contains bio, four project headings/descriptions, and outbound anchors |
| `/?foo=bar` | `200`, identical size | `200`, normalized body identical to `/` | Duplicate URL without canonical |
| `/?utm_source=audit` | not separately size-probed | `200`, normalized body identical to `/` | Tracking duplicate without canonical |
| `/video-player-lab` | `200`, 6,282 B | `200`, 5,652 B | Complete SSR title content and controls |
| `/VIDEO-PLAYER-LAB` | `200`, same body size | `200`, normalized body identical to lowercase | Case duplicate without redirect/canonical |
| `/video-player-lab?foo=bar` | behavior implied by router and home query probe | `200`, normalized body identical to clean URL | Arbitrary-query duplicate |
| `/video-player-lab?utm_source=audit` | not separately size-probed | `200`, normalized body identical to clean URL | Tracking duplicate |
| `/video-player-lab/` | `307` to non-slash | `307` to non-slash | Normalized, but temporary rather than permanent redirect |
| `//video-player-lab` | `308` to single slash | `308` to single slash | Passed |
| `/index.html` | `404` | `404` | Correct non-soft-404 status |
| `/definitely-not-a-real-page-20260729` | `404`, 1,217 B | `404`, 1,217 B | Correct status; generic body only |
| `/robots.txt` GET | `404` | `200 text/plain`, 1,248 B | Cloudflare-generated comments only; no crawl block and no sitemap reference |
| `/robots.txt` HEAD | `404` | `404 text/html` | Method inconsistency |
| `/sitemap.xml` | `404` | `404` | No conventional sitemap |
| `/sitemap_index.xml` | not present | `404` | No conventional sitemap index |
| `http://m0code.com/` | not applicable | `200`, same normalized HTML as HTTPS | Confirmed protocol duplicate |
| `http://m0code.com/video-player-lab` | not applicable | `200`, same normalized HTML as HTTPS | Confirmed protocol duplicate |
| `https://www.m0code.com/` | not applicable | DNS resolution failure | No live `www` duplicate, but no redirect safety net |
| `/brand/mo-mark-v3.svg` | present | `200 image/svg+xml` | Crawlable favicon/logo asset |
| 77 current repository media URLs | all present in `dist/client` after path normalization | 69 `200`, 8 `404` | The eight live misses are new/current-build assets not referenced by the older live JS bundle; see SEO-07-R01 |

Normal and cache-disabled requests returned the same status and byte counts for `/`, `/video-player-lab`, the unknown route, and `/robots.txt`. Googlebot and ordinary browser user agents also returned the same status and response size on both documents and the unknown route.

## Confirmed Issues

### SEO-07-001 — HTTP serves indexable duplicate documents instead of redirecting

- **ID:** SEO-07-001
- **Severity:** P1 high
- **Remediation status:** `Complete — verified in production` (2026-08-01). Historical evidence below describes the 2026-07-29 baseline.
- **Affected route/component/file and line:** `http://m0code.com/`; `http://m0code.com/video-player-lab`; `wrangler.jsonc:11-16`
- **Evidence:** Both HTTP URLs return `200 text/html` and the same normalized SHA-256 as their HTTPS equivalents. Neither HTML response contains `rel="canonical"`, and the HTTP response does not redirect. Google documents permanent redirects as a strong canonical signal and explicitly recommends choosing one preferred protocol/host.
- **Reproduction steps:** Run `curl -I http://m0code.com/` and `curl -I http://m0code.com/video-player-lab`; observe `200 OK`. Compare with the HTTPS URLs. Fetch both bodies, replace the dynamic `u:<timestamp>` value, and hash them; each HTTP/HTTPS pair is identical.
- **User/business impact:** Search engines can crawl and potentially select the insecure HTTP URLs, split link/canonical signals, and spend crawl capacity on duplicate documents. Shared HTTP links also expose users to an unnecessary insecure first request.
- **Likely root cause:** The custom-domain configuration declares only the apex Worker route; no edge-level HTTP-to-HTTPS redirect is visible in repository configuration.
- **Recommended improvement:** Add a permanent edge redirect (`301` or `308`) from every HTTP path/query to the exact HTTPS apex equivalent, preserving path and query. Retain self-referencing HTTPS canonicals as defense in depth.
- **Safer alternatives/tradeoffs:** A canonical tag alone is less disruptive but leaves the insecure duplicate reachable and is weaker than a redirect. HSTS helps repeat browsers but is not a substitute for a crawler-visible redirect.
- **Estimated effort:** S (under half a day, including validation).
- **Dependencies:** Cloudflare zone/custom-domain authority; coordination with deployment/configuration scope 13.
- **Objective verification method:** `curl -I http://m0code.com/<each-public-route>` returns one permanent redirect to `https://m0code.com/<same-path-and-query>`; the target returns `200`; a crawler confirms no redirect chain.
- **Remediation evidence:** Cloudflare rule `68b2d9da04134d4e9aef99e85002e36c` is active. HTTP `/`, `/video-player-lab?audit=1`, a fingerprinted JS asset, a POST path, and the retained Orgo MP4 return one `308` to the identical HTTPS path/query. `curl -L` reports exactly one redirect; the retired route then returns its intended HTTPS `404`.

### SEO-07-002 — Canonical duplicate clusters remain for case, query, and slash variants

- **ID:** SEO-07-002
- **Severity:** P2 medium
- **Affected route/component/file and line:** `/`; `/video-player-lab`; `src/routes/__root.tsx:10-28`; `src/router.tsx:5-11`; `src/routeTree.gen.ts:26-43`
- **Evidence:** No live or `dist` route emits an HTML or HTTP canonical. `/video-player-lab`, `/VIDEO-PLAYER-LAB`, `/video-player-lab?foo=bar`, and `/video-player-lab?utm_source=audit` all return `200` and the same normalized SHA-256. `/`, `/?foo=bar`, and `/?utm_source=audit` behave the same way. The slash variant redirects with temporary `307`, while the double-slash variant uses permanent `308`.
- **Reproduction steps:** Fetch the listed URLs, normalize the SSR timestamp, and compare SHA-256 hashes. Inspect each `<head>` for `link[rel=canonical]`; none is present. Run `curl -I https://m0code.com/video-player-lab/` to observe `307`.
- **User/business impact:** Search engines must infer a preferred URL and may crawl duplicate variants, show an undesirable case/query form, or consolidate signals inconsistently. This is a canonicalization risk, not proof of duplicate indexing.
- **Likely root cause:** All routes inherit one root head with no URL-aware canonical, route matching is case-insensitive, and trailing-slash normalization uses the framework default temporary redirect.
- **Recommended improvement:** Emit one absolute, self-referencing canonical per intended public route; permanently redirect path-case and slash variants; preserve only meaningful query parameters and canonicalize ignorable tracking/filter parameters to the clean route.
- **Safer alternatives/tradeoffs:** Start with self-canonicals and permanent case/slash redirects, leaving query handling unchanged until all functional parameters are inventoried. Globally stripping queries is unsafe if future routes use search state.
- **Estimated effort:** M (one day including route/query regression coverage).
- **Dependencies:** Route-intent decision for `/video-player-lab`; metadata scope 08; deployment redirect support.
- **Objective verification method:** Every variant resolves to one preferred HTTPS lowercase URL or carries the same correct canonical; redirects are permanent; automated tests assert status, `Location`, and exactly one absolute canonical.

### SEO-07-003 — The second route is orphaned, omitted from sitemaps, and still indexable

- **ID:** SEO-07-003
- **Severity:** P2 medium
- **Affected route/component/file and line:** `/video-player-lab`; `src/routes/video-player-lab.tsx:1-7`; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:337-343`; `public/` (no robots or sitemap file); `dist/client/` (no sitemap)
- **Evidence:** The generated route inventory contains exactly `/` and `/video-player-lab`, but the home SSR exposes only one same-origin document link, the self-link `/`. The lab links back to `/`, so no crawl starting at home can discover it. Both sitemap endpoints return `404`. The lab returns `200` with neither `noindex` nor `X-Robots-Tag`, so it is eligible for indexing if discovered elsewhere.
- **Reproduction steps:** Extract unique `href` values from `curl https://m0code.com/`; confirm `/video-player-lab` is absent. Request `/sitemap.xml` and `/sitemap_index.xml`; observe `404`. Inspect lab response headers/head; confirm no index-control directive.
- **User/business impact:** If the lab is intended as a public acquisition page, crawlers may never discover it or may discover it without context. If it is an internal experiment, it can be indexed unexpectedly under generic portfolio metadata. Actual index presence is unverified.
- **Likely root cause:** The experimental route was added to the router without an explicit public/private SEO decision, internal navigation, sitemap entry, or index directive.
- **Recommended improvement:** Decide the route’s launch intent first. If public, give it a crawlable contextual link, unique metadata/canonical, and sitemap entry. If non-public, use authentication/removal for privacy or `noindex` for search exclusion; do not rely on `robots.txt` disallow to prevent indexing.
- **Safer alternatives/tradeoffs:** A temporary `noindex` is the smallest reversible launch guard but removes search eligibility. A sitemap-only public solution aids discovery but does not provide users or crawlers with internal context.
- **Estimated effort:** S once intent is decided; M if public navigation/design work is needed.
- **Dependencies:** Product/content owner decision; metadata scope 08; sitemap/deployment ownership.
- **Objective verification method:** Public case: a crawler seeded only with `/` discovers the lab, and the canonical lab URL appears once in a valid sitemap. Private case: live GET remains crawlable and returns an explicit `noindex`, verified with URL Inspection after release.

### SEO-07-004 — Home page has no primary heading

- **ID:** SEO-07-004
- **Severity:** P3 low
- **Affected route/component/file and line:** `/`; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:345-359`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:495-520`
- **Evidence:** Raw live and `dist` HTML contain four project `<h2>` elements—Orgo, The Good Invoice, Lumen, and Selected Experiments—and zero `<h1>` elements. “Design Engineer” and the introductory identity copy are paragraphs.
- **Reproduction steps:** Run `curl -sS https://m0code.com/ | grep -aoE '<h[1-6][^>]*>[^<]+'`; observe only four `<h2>` values. Repeat against the local `dist` server.
- **User/business impact:** The page lacks an explicit top-level topic/name heading, weakening semantic clarity for crawlers and assistive navigation. This is not a verified indexing failure and Google does not require an `<h1>` to index a document.
- **Likely root cause:** Visual composition treated the role/bio as display copy and project names as the first semantic heading level.
- **Recommended improvement:** Make one visible, descriptive identity/topic string—such as “Mo Ibrahim — Design Engineer”—the `<h1>`, retaining project names as `<h2>`.
- **Safer alternatives/tradeoffs:** A visually hidden `<h1>` is lower impact to layout but creates a weaker content/visual alignment. Styling a visible heading to match the current paragraph appearance is preferable.
- **Estimated effort:** S (under two hours including semantic regression checks).
- **Dependencies:** Content wording approval; accessibility scope 09.
- **Objective verification method:** Raw HTML contains exactly one meaningful `<h1>` before the project `<h2>` elements; heading-outline and screen-reader checks confirm the intended hierarchy.

### SEO-07-005 — The 404 response is technically correct but has no recovery or crawl path

- **ID:** SEO-07-005
- **Severity:** P3 low
- **Affected route/component/file and line:** Unknown routes; `src/routes/__root.tsx:10-30`; `src/router.tsx:5-11`
- **Evidence:** Unknown URLs correctly return HTTP `404`, but the body is only `<p>Not Found</p>` under the inherited “MO — Portfolio” title/description and contains no home link. The existing server logs a framework warning that no route or router-level `notFoundComponent` is configured.
- **Reproduction steps:** Request `https://m0code.com/definitely-not-a-real-page-20260729`; inspect status and raw HTML. Serve existing `dist`, request an unknown route, and observe the TanStack Router warning.
- **User/business impact:** Search engines correctly drop the missing URL because of the real `404`, so this is not a soft-404/indexing blocker. Users and crawlers reaching stale links receive no descriptive context or route back to live content.
- **Likely root cause:** The framework’s generic default not-found component is being used.
- **Recommended improvement:** Add a small server-rendered custom 404 with a descriptive heading, concise explanation, and crawlable link to `/`; keep the real `404` status.
- **Safer alternatives/tradeoffs:** A minimal home anchor added to the existing error UI is sufficient for crawl recovery. Adding `noindex` is optional because the `404` status already communicates removal.
- **Estimated effort:** S (under half a day with status regression test).
- **Dependencies:** Design/copy approval; functional QA scope 10.
- **Objective verification method:** Unknown paths return `404`, a non-empty custom title/heading, and a valid `<a href="/">`; automated tests ensure the error never returns `200`.

## Risks / Unverified

### SEO-07-R01 — The live deployment does not match the audited repository artifact

- **ID:** SEO-07-R01
- **Severity:** P2 medium
- **Affected route/component/file and line:** Both routes; live `/assets/*`; current `dist/client/assets/*`; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:322-367`
- **Evidence:** Live assets use hashes such as `index-BTo1nZ1V.js` and `routes-DAvGpumd.js`, while existing `dist` uses `index-COTNhO9J.js` and `routes-BXeiZRtJ.js`. Live home SSR has a motion-hidden article and 1,254 px PNG avatars, while current source/`dist` has no hidden article and uses `-640.webp`. Eight newly referenced current-build paths return live `404`, but they exist in `dist/client` and are not referenced by the older live bundle. The deployed markup is consistent with prior repository state `58ed5af`, but no authoritative deployed SHA was available.
- **Reproduction steps:** Compare the stylesheet/modulepreload names in live and local `dist` HTML. Compare the first portfolio `<article>` tag and avatar URLs. HEAD the six `-640.webp` avatars and two identity assets live, then confirm the files exist locally.
- **User/business impact:** Live findings cannot all be mapped to current lines, and fixes present in the audited artifact are not yet user-visible. A release could materially change crawl/media behavior, so post-deployment revalidation is required.
- **Likely root cause:** Production is deployed from an earlier commit/artifact, or the current artifact has not been promoted.
- **Recommended improvement:** Record the deployed commit/artifact digest and make release verification compare it with the approved audit target; rerun the crawl matrix after deployment.
- **Safer alternatives/tradeoffs:** Keep two baselines—“current live” and “next artifact”—if intentional staged release is required. Do not infer deployment success from repository HEAD alone.
- **Estimated effort:** S for provenance; M for an automated artifact-to-deployment gate.
- **Dependencies:** CI/deployment scope 13/14; Cloudflare deployment metadata access.
- **Objective verification method:** Production exposes or records the approved Git SHA/artifact digest; live asset hashes and SSR signatures match that artifact; all artifact-referenced public assets return expected statuses.

### SEO-07-R02 — Live home content is visually hidden until JavaScript succeeds

- **ID:** SEO-07-R02
- **Severity:** P2 medium
- **Remediation status:** `Complete — verified in production` (2026-08-01). The title and baseline evidence below preserve the original 2026-07-29 risk.
- **Affected route/component/file and line:** Live `/`; deployed historical `V14ExplorationLab.tsx` equivalent around `58ed5af:323-361`; current replacement at `src/components/v14-exploration-lab/V14ExplorationLab.tsx:327-367`
- **Evidence:** Live raw SSR emits `<article ... style="filter:blur(4px);opacity:0;transform:translateY(14px)">` around all primary content. No `<noscript>` fallback is present. The current audited source/`dist` no longer emits this inline hidden state. Raw text and anchors are present, so crawler parsing is possible; a real disabled-JavaScript browser session could not be started in this audit environment.
- **Reproduction steps:** Fetch live `/`, format tags onto separate lines, and inspect the first portfolio article. Disable JavaScript in a browser and reload to complete the visual confirmation.
- **User/business impact:** A script failure, blocked bundle, or non-JavaScript user can receive an apparently blank home experience. Google normally renders JavaScript and can parse the SSR text, so an indexing failure is not established; other crawlers may not render.
- **Likely root cause:** The deployed entrance animation serialized its hidden initial motion state into SSR.
- **Recommended improvement:** Promote the current progressive-enhancement implementation or otherwise make SSR visible by default and apply entrance-only hiding after scripting is known to be active.
- **Safer alternatives/tradeoffs:** A `<noscript>` style override is a narrow fallback but does not protect against bundle/runtime failures when scripting is enabled. Removing the full-page opacity animation is more robust but changes the entrance effect.
- **Estimated effort:** S if current artifact already resolves it; M if motion behavior must be redesigned.
- **Dependencies:** Deployment provenance (SEO-07-R01); interaction/motion scope 11.
- **Objective verification method:** With JavaScript disabled and with the main JS bundle blocked, the home’s identity copy, project headings, and crawlable anchors are visibly present; normal JavaScript mode retains approved motion.
- **Current verification:** production passed desktop (1440×1000) and mobile (390×844) Chromium runs with JavaScript disabled and with `/assets/index-DWNzLafz.js` blocked. The bio, Orgo heading, and contact action remained visible; the portfolio article computed to `opacity: 1`, `visibility: visible`, `filter: none`, and `transform: none`. Current SSR contains no inline hidden article state, and normal JavaScript mode hydrated without page errors.

### SEO-07-R03 — Most next-build portfolio media URLs are absent from raw SSR

- **ID:** SEO-07-R03
- **Severity:** P2 medium
- **Affected route/component/file and line:** `/`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:585-658`, `688-720`, `1375-1388`; `src/components/v14-exploration-lab/portfolio-placeholders.ts:1-54`
- **Evidence:** The current server bundle references 77 static media paths, but raw `dist` home HTML exposes only 18 same-origin portfolio paths—mostly video posters plus the first Orgo video. Deferred screenshots render only inline `data:image` placeholders with empty alt until client-side `load` becomes true through eager/prewarm/IntersectionObserver state. All project text is SSR-complete, and all 77 artifact files are present locally.
- **Reproduction steps:** Serve `dist`, extract unique `/portfolio/*.(webp|png|jpeg|mp4)` strings from raw `/`, and count 18. Compare with the 77 unique strings in `dist/server/assets/routes-D8ADSKwo.js`. Inspect deferred-picture gating at the cited lines.
- **User/business impact:** Page indexing is not blocked, but non-rendering crawlers cannot discover most portfolio images/videos from HTML. Google can render JavaScript, yet lazy/intersection state may still leave off-screen media undiscovered; actual image/video index coverage is unverified.
- **Likely root cause:** Network-saving logic omits real `<img>`/`<video>` URLs from SSR instead of server-rendering lazy elements.
- **Recommended improvement:** If image/video search visibility matters, SSR a curated set of real media URLs using native lazy loading and descriptive alt/posters, and/or publish image/video sitemap entries. Reserve client-only mounting for media intentionally excluded from search.
- **Safer alternatives/tradeoffs:** A curated media sitemap avoids changing runtime loading but adds generation/maintenance. SSR all URLs improves discovery but must be validated to ensure it does not trigger unwanted network or performance costs.
- **Estimated effort:** M (one to three days depending on sitemap scope).
- **Dependencies:** Performance scope 05; metadata/structured-data scope 08; product decision on image/video search value.
- **Objective verification method:** Raw HTML or a valid sitemap exposes every selected indexable media URL; Google URL Inspection rendered HTML confirms discovery; Search Console image/video reports are monitored after release.

### SEO-07-R04 — `robots.txt` GET and HEAD disagree

- **ID:** SEO-07-R04
- **Severity:** P3 low
- **Affected route/component/file and line:** Live `/robots.txt`; `public/` (no repository-backed file); Cloudflare managed robots behavior
- **Evidence:** GET returns `200 text/plain` with 1,248 bytes for Googlebot, Bingbot, browser, and curl user agents. HEAD returns `404 text/html` for every tested user agent. Existing `dist` returns `404` for both because no robots file exists.
- **Reproduction steps:** Run `curl -i https://m0code.com/robots.txt` and `curl -I https://m0code.com/robots.txt`; compare status and content type.
- **User/business impact:** Search crawlers normally fetch robots with GET, so no crawl failure was demonstrated. HEAD-based launch checks, uptime monitors, and validators can report a false missing-robots failure.
- **Likely root cause:** Cloudflare’s managed robots/content-signal response intercepts GET but not HEAD.
- **Recommended improvement:** Serve one deterministic repository- or edge-backed `robots.txt` for GET and HEAD and include the canonical sitemap URL once one exists.
- **Safer alternatives/tradeoffs:** Configure monitoring to validate GET only if managed robots must remain enabled. This avoids configuration overlap but leaves method inconsistency.
- **Estimated effort:** S.
- **Dependencies:** Cloudflare settings authority; sitemap decision from SEO-07-003.
- **Objective verification method:** GET and HEAD both return `200 text/plain`; a standards parser reports no unintended disallow; the sitemap directive resolves to `200`.

## Opportunities

### SEO-07-O01 — Give portfolio projects stable crawlable documents when organic discovery is a goal

- **ID:** SEO-07-O01
- **Severity:** P2 medium
- **Affected route/component/file and line:** Home project rail; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:553-581`, `1344-1401`, `1772-1823`; `src/routeTree.gen.ts:26-43`
- **Evidence:** Orgo, The Good Invoice, Lumen, and Selected Experiments are stateful slides selected with `<button>` controls. They have internal fragment IDs but no distinct routes or crawlable anchors, and the route tree contains only two documents. All four projects share the home title, description, and URL.
- **Reproduction steps:** Inspect the project controls and generated route tree; activate each state and observe that the document URL does not change. Extract home same-origin anchors; no project document URLs exist.
- **User/business impact:** Search engines can understand the combined home text but cannot index or rank a dedicated document for project-specific intent, nor can users deep-link to a stable project case-study state.
- **Likely root cause:** The portfolio was designed as one immersive stateful rail rather than document-oriented case-study routes.
- **Recommended improvement:** If project-level organic acquisition matters, create one SSR route per substantive case study with a unique heading/head/canonical and crawlable contextual links from home; preserve the rail as presentation/navigation.
- **Safer alternatives/tradeoffs:** URL-addressable hash states improve sharing but are not separate indexable documents. Query-addressable states add duplicate-management complexity. Keep the one-page model if search acquisition is not a goal.
- **Estimated effort:** L (multiple days; content and route design required).
- **Dependencies:** Product/content strategy; route inventory scope 01; metadata scope 08; design and QA scopes 10/11.
- **Objective verification method:** Each approved case study has one canonical `200` SSR URL, unique title/description/H1, contextual internal anchor, sitemap entry, and stable direct-load state.

### SEO-07-O02 — Add a `www` redirect alias if brand-link resilience is desired

- **ID:** SEO-07-O02
- **Severity:** P3 low
- **Affected route/component/file and line:** `www.m0code.com`; `wrangler.jsonc:11-16`; DNS/Cloudflare zone (external)
- **Evidence:** Apex A/AAAA records resolve, while `www.m0code.com` has no A/AAAA answer and browser/curl resolution fails. Therefore there is no current `www` duplicate, but links or user input using the common alias fail rather than consolidate.
- **Reproduction steps:** Run `dig +short www.m0code.com A`, `dig +short www.m0code.com AAAA`, and request `https://www.m0code.com/`.
- **User/business impact:** Mistyped or externally authored `www` links lose traffic and cannot pass signals to the apex. No present duplicate-index problem exists.
- **Likely root cause:** Only the apex custom domain is configured.
- **Recommended improvement:** If the alias is part of the brand’s acceptable surface, configure `www` DNS/TLS and a one-hop permanent redirect to the exact apex HTTPS path/query.
- **Safer alternatives/tradeoffs:** Leave `www` nonexistent to minimize DNS/certificate surface if no links or users are expected to use it. Do not serve duplicate content on both hosts.
- **Estimated effort:** S.
- **Dependencies:** DNS/Cloudflare authority; deployment scope 13.
- **Objective verification method:** Every `http(s)://www.m0code.com/<path>?<query>` variant resolves and permanently redirects in one hop to `https://m0code.com/<path>?<query>`.

## False Positives

- **Cloudflare robots comments are not a search block:** The live file contains only `#` comment lines explaining content signals; it contains no `User-agent`, `Disallow`, or `noindex` rule. GET-based search crawling is therefore not blocked by this content.
- **No sitemap is not itself an indexing failure:** Google states a small, comprehensively linked site may not need a sitemap. The actionable issue here is the combination of an orphan route, rich media, and absent sitemap—not the file’s absence alone.
- **No robots meta on public pages means default index/follow:** This is correct for the intended public home. It becomes ambiguous only for the lab because its intended launch status is unknown.
- **The unknown route is not a soft 404:** It returns a real `404` consistently for browser and Googlebot user agents, including cache-disabled probes.
- **Missing home `<h1>` does not prove deindexing:** It is a semantic clarity defect, not a formal indexability gate.
- **`www` is not currently creating duplicates:** It is NXDOMAIN, so SEO-07-O02 is resilience-only.
- **The eight current-source asset `404`s are not confirmed live-path breakage:** The deployed older JS bundle does not reference them; the current `dist` contains them. They are evidence of deployment drift, not a currently executed broken-media path.

## Passed Checks

- Repository and generated route inventory agree on exactly two application routes.
- `/` and `/video-player-lab` return `200 text/html` with substantive server-rendered content.
- Raw home HTML contains the bio, all four project names/descriptions, project media captions, and crawlable external anchors; raw lab HTML contains its H1, intro, ten variant labels/notes, and home anchor.
- The lab has one visible semantic `<h1>` and no heading-level skip in its SSR.
- JavaScript is not required to parse primary text or anchor URLs from either document.
- Googlebot and ordinary-browser probes received matching status, content type, and response size; no user-agent cloaking was observed.
- Unknown URLs and `/index.html` return true `404` responses.
- Double-slash normalization uses a one-hop permanent `308`.
- The live logo/fav icon SVG is reachable as `200 image/svg+xml`.
- All eight HTTPS outbound links found in home SSR resolved to a final `200`: Cal.com, X profile, GitHub, Orgo, The Good Invoice, Lumen, Fay’s site, and Fay’s X profile.
- All 77 media paths referenced by the current server artifact exist in the current `dist/client` artifact after normal path resolution.
- Normal, repeated, and cache-disabled HTTP probes were stable for both routes, the 404, and robots GET.

## Not Tested

- Google Search Console, Bing Webmaster Tools, crawl logs, index coverage, selected canonicals, manual actions, removals, and URL Inspection were unavailable. No statement in this report claims a URL is currently indexed or deindexed.
- JavaScript-disabled and blocked-main-module rendering was completed in Chromium desktop/mobile under ITEM-05. Equivalent non-Chromium crawler/rendering-engine behavior remains untested.
- Slow 3G, offline, and cache-state browser rendering were not duplicated here because they do not change server crawl directives and belong to scopes 05, 06, and 12. Cache-disabled HTTP responses were tested.
- No intentional server exception was triggered against production, so `500` rendering, status, retry semantics, and error-document directives remain unverified. Source inspection found no custom error component.
- No robots/sitemap submission, recrawl request, DNS change, edge redirect, or external-system write was performed.
- No project slide state was claimed as an indexable document; state interaction QA belongs to scopes 10/11.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Disposition:** `SEO-07-003` is complete because the unintended public route is removed in production; its orphan/indexability/sitemap decision no longer applies. Lab-specific duplicate-cluster rows in `SEO-07-001`/`SEO-07-002` are retired, but HTTP, canonical-query, 404 recovery, robots, and homepage SEO findings remain open.
- **Verification:** the generated route tree declares only `/`; local SSR and browser navigation return a genuine `404` for `/video-player-lab`; no lab source or build reference remains.
- **Production evidence:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; clean and cache-bypassed requests return `404` for `/video-player-lab` with no redirect, canonical, sitemap entry, or lab document.

## Implementation tracking — ITEM-02

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `SEO-07-001` is closed because the HTTP protocol duplicate no longer serves content. `SEO-07-002` remains open for HTTPS query/case/slash canonicalization, and sitemap/robots/404 UX findings are unchanged.
- **Verification:** path/query preservation passed for the homepage, retired path, fingerprinted JS, POST, and retained MP4; each HTTP request receives one permanent `308`. HTTPS targets retain their expected `200` or `404` status.

## Implementation tracking — ITEM-05

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `SEO-07-R02` is complete. Current SSR is visible by default, and desktop/mobile Chromium renders preserved primary identity, project, and contact content with JavaScript disabled or the main module blocked.
- **Verification:** four failure-mode runs showed visible geometry and computed `opacity: 1`, `visibility: visible`, `filter: none`, and `transform: none`; normal hydration retained the approved experience without page errors. No source or deployment change was required.
