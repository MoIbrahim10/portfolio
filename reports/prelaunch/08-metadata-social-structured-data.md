# 08 — Metadata, Social Cards, Favicons, Manifest, and Structured Data

## Scope and method

- Audit date: 2026-07-29 (Africa/Cairo).
- Repository revision inspected: `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a` on `master`.
- Scope: document metadata, Open Graph, X/Twitter cards, canonical URLs, favicon/icon declarations, web app manifest, and JSON-LD only.
- Source inspected: `src/routes/__root.tsx`, both route files, generated route tree, `public/`, and metadata-related references across `src/`.
- Existing production artifact inspected without rebuilding: `dist/server/assets/router-lIzKAfwM.js`, `dist/server/server.js`, the route manifest, and `dist/client/`.
- Existing `dist/server/server.js` was invoked read-only through its exported `fetch` handler for `/`, `/video-player-lab`, a query variant, and a missing route. No build, install, source edit, or configuration edit was performed.
- Live origin inspected with read-only HTTP requests: `https://m0code.com`, including normal, cache-disabled, repeat, Googlebot, Facebook crawler, and Twitterbot requests.
- Variants inspected: `/`, `/video-player-lab`, `/video-player-lab/`, `/?utm_source=audit`, `/not-a-real-route`, `http://m0code.com/`, and `https://www.m0code.com/`.
- Icon checks covered the declared SVG plus conventional favicon, Apple touch icon, manifest, and social-image paths. The SVG was checked with `xmllint`.
- Every source, artifact, and live response was searched for `canonical`, Open Graph, Twitter/X metadata, `application/ld+json`, manifest, Apple icon, theme color, and robots metadata.
- Reference criteria: [Open Graph protocol](https://ogp.me/), [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google structured-data testing guidance](https://developers.google.com/search/docs/appearance/structured-data), [Schema.org Person](https://schema.org/Person), [WHATWG link types](https://html.spec.whatwg.org/dev/links.html), and [W3C Web App Manifest](https://www.w3.org/TR/appmanifest/).
- No external preview debugger, validator submission, build, dependency install, write to an external system, or source/configuration mutation was performed.

### Coverage inventory

| Surface | Source of truth | Result |
|---|---|---|
| Declared routes | `src/routeTree.gen.ts:15-56` | `/` and `/video-player-lab` |
| Shared document head | `src/routes/__root.tsx:10-28` | One shared title, description, viewport, charset, stylesheet, and SVG favicon |
| Route-specific head | `src/routes/index.tsx:5`; `src/routes/video-player-lab.tsx:5-7` | None |
| Existing built head | `dist/server/assets/router-lIzKAfwM.js:7-29` | Semantically matches source |
| Production SSR | Direct GETs and crawler user agents | Semantically matches source; asset hashes differ as expected |
| JSON-LD | Source, `dist`, live SSR | Zero blocks |
| Social images | Live SSR metadata | No referenced image URL; dimensions/content checks are not applicable |

## Per-route metadata matrix

`—` means absent, not unknown. Counts were measured in the server-returned HTML, before JavaScript.

| Requested URL | HTTP result | `lang` | Title | Description | Canonical | Robots meta | OG tags | Twitter/X tags | JSON-LD | Icons / manifest |
|---|---:|---|---|---|---|---|---:|---:|---:|---|
| `https://m0code.com/` | 200 | `en` | `MO — Portfolio` | `Personal portfolio of MO.` | — | — | 0 | 0 | 0 | One SVG / no manifest |
| `https://m0code.com/video-player-lab` | 200 | `en` | Same as `/` | Same as `/` | — | — | 0 | 0 | 0 | One SVG / no manifest |
| `https://m0code.com/video-player-lab/` | 307 to `/video-player-lab` | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| `https://m0code.com/?utm_source=audit` | 200 | `en` | Same as `/` | Same as `/` | — | — | 0 | 0 | 0 | One SVG / no manifest |
| `https://m0code.com/not-a-real-route` | 404 | `en` | Same as `/` | Same as `/` | — | — | 0 | 0 | 0 | One SVG / no manifest |
| `http://m0code.com/` | 200; no redirect | `en` | Same as HTTPS `/` | Same as HTTPS `/` | — | — | 0 | 0 | 0 | One SVG / no manifest |
| `https://www.m0code.com/` | DNS resolution failed | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

The title is 14 characters and the description is 25 characters. Length alone is not treated as a defect; the confirmed problem is that the text is generic and identical across distinct 200 routes.

## Confirmed Issues

### 08-META-001 — Canonical identity is undeclared while duplicate protocol/query URLs return 200

- **ID:** `08-META-001`
- **Severity:** `P1 high`
- **Remediation status:** `Partially complete` (2026-08-01): the protocol-duplicate portion is production-verified complete; missing self-canonicals and HTTPS query canonicalization remain open. Historical evidence below describes the 2026-07-29 baseline.
- **Affected route/component/file:** `/`, `/video-player-lab`, query variants, and the HTTP origin; `src/routes/__root.tsx:10-28`; `dist/server/assets/router-lIzKAfwM.js:7-29`.
- **Evidence:** No `rel="canonical"` element or canonical HTTP `Link` header exists in source, existing `dist`, or live HTML. `https://m0code.com/?utm_source=audit` returns the same 200 content as `/`. More importantly, `http://m0code.com/` also returns 200 with the same title, description, and content instead of redirecting to HTTPS. Google explicitly treats protocol and parameter variants as canonicalization inputs.
- **Reproduction:** Run `curl -sS https://m0code.com/`, `curl -sS 'https://m0code.com/?utm_source=audit'`, and `curl -sS http://m0code.com/`; inspect each `<head>` for `rel="canonical"` and compare status/content. All three documents omit it; all three return 200.
- **User/business impact:** Search engines and analytics must infer the preferred URL. Link equity, crawl signals, and reporting can be split across HTTP/HTTPS and parameter variants; shared links may preserve an undesirable URL.
- **Likely root cause:** The only head definition is global and static, and the deployment does not enforce HTTP-to-HTTPS canonicalization.
- **Recommended improvement:** After URL policy is approved, emit one absolute, self-referential HTTPS canonical for every indexable route, strip irrelevant tracking parameters in canonical targets, and separately enforce a permanent HTTP-to-HTTPS redirect. Keep sitemap and internal-link URLs consistent with the same policy.
- **Safer alternatives/tradeoffs:** A canonical tag alone is lower-risk than changing redirects but still leaves users on HTTP and is a weaker operational fix. A permanent redirect is the strongest consolidation signal but should be checked for asset/API exceptions. Do not use `robots.txt` or `noindex` as a canonicalization substitute.
- **Estimated effort:** Small, approximately 0.5 day including variant tests.
- **Dependencies:** Approved public URL policy; deployment/redirect owner; sitemap policy from the technical-SEO scope.
- **Objective verification:** Each indexable HTTPS page returns exactly one absolute self-canonical in raw SSR HTML; parameter variants canonicalize to the clean URL; every HTTP path returns one 301/308 hop to the equivalent HTTPS path; Search Console later reports the intended selected canonical.
- **Current evidence:** the HTTP portion now passes for HTML, missing-path/query, JS, POST, and retained MP4 samples via one path/query-preserving `308`. No canonical tag was added, so this aggregate finding is not closed.

### 08-META-002 — Distinct 200 routes share generic title and description

- **ID:** `08-META-002`
- **Severity:** `P2 medium`
- **Affected route/component/file:** `/` and `/video-player-lab`; `src/routes/__root.tsx:18-22`; absent route head overrides at `src/routes/index.tsx:5` and `src/routes/video-player-lab.tsx:5-7`.
- **Evidence:** Both live routes, the local production artifact, and all tested crawler user agents return exactly `MO — Portfolio` and `Personal portfolio of MO.`. The lab route has no route-specific head definition. The description does not identify Mo Ibrahim, the design-engineering focus, or the route's actual content.
- **Reproduction:** Fetch both URLs, extract `<title>` and `<meta name="description">`, and compare. The values are byte-for-byte identical.
- **User/business impact:** Browser history, search snippets, bookmarks, and link unfurls cannot distinguish the lab from the portfolio. The generic homepage copy also misses a high-value opportunity to communicate identity and expertise.
- **Likely root cause:** Metadata is defined once on the root route and inherited by every route.
- **Recommended improvement:** Define reviewed, content-specific title and description values per public route while retaining sensible root defaults. Decide whether `/video-player-lab` is a public content page before writing its metadata.
- **Safer alternatives/tradeoffs:** If the lab is intentionally temporary, exclude it from indexing rather than investing in search copy. Title templates improve consistency but must not create duplicate or excessively repetitive titles.
- **Estimated effort:** Small, approximately 1–2 hours after copy approval.
- **Dependencies:** Content owner approval; the indexing decision in `08-RISK-001`; route-level canonical implementation.
- **Objective verification:** Raw SSR for each 200 indexable route contains exactly one non-empty, route-unique title and description; automated metadata tests compare expected values for all declared routes.

### 08-META-003 — No Open Graph or Twitter/X card contract exists

- **ID:** `08-META-003`
- **Severity:** `P2 medium`
- **Affected route/component/file:** `/` and `/video-player-lab`; `src/routes/__root.tsx:10-28`; both route files; live and existing `dist`.
- **Evidence:** Source search and live responses contain zero `og:*` and zero `twitter:*` properties for normal, Googlebot, Facebook crawler, and Twitterbot requests. There is no `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `twitter:card`, or social image URL. Therefore image reachability, content type, dimensions, and aspect ratio cannot be validated.
- **Reproduction:** Fetch either route with default, `facebookexternalhit`, or `Twitterbot` user agents and search the raw HTML for `property="og:` or `name="twitter:`; counts remain zero.
- **User/business impact:** Shared portfolio links have no deterministic title, description, or preview image contract. Platforms may show a sparse or inconsistent fallback, reducing credibility and click-through for a visual portfolio.
- **Likely root cause:** Social-preview metadata and an approved social-preview asset have not been designed or wired into the route head.
- **Recommended improvement:** Add route-aware, absolute SSR metadata using the approved canonical: at minimum Open Graph title, description, type, URL, and a stable HTTPS image; add `twitter:card` and any platform-specific overrides only where they add value. Publish a purpose-built, legible preview image and declare its secure URL, MIME type, width, height, and descriptive alt text where supported.
- **Safer alternatives/tradeoffs:** A single site-wide social image is simpler and safer initially but makes the lab indistinguishable. Per-route images improve relevance but create an asset maintenance burden. Do not reuse the 790×480 favicon as a social image without visual review; it has the wrong role and an uncommon social aspect ratio.
- **Estimated effort:** Medium, approximately 0.5–1 day including image production and deterministic checks.
- **Dependencies:** Approved brand image/copy; canonical URL policy; public-route/indexing decision; asset hosting/cache policy.
- **Objective verification:** Raw SSR contains one coherent Open Graph object per public route; all URLs are absolute HTTPS; the declared image returns 200 with the declared image MIME type and approved dimensions; platform debuggers are run after deployment without critical warnings.

### 08-META-004 — Hard 404 inherits successful-page metadata

- **ID:** `08-META-004`
- **Severity:** `P3 low`
- **Affected route/component/file:** Every unknown path, demonstrated with `/not-a-real-route`; `src/routes/__root.tsx:18-22`; no route-level not-found head exists.
- **Evidence:** The missing route correctly returns HTTP 404, but its raw head still says `MO — Portfolio` and `Personal portfolio of MO.`. The existing `dist` handler also logs that no custom not-found component is configured. No error-specific title or description is emitted.
- **Reproduction:** Run `curl -i https://m0code.com/not-a-real-route`; confirm `404`, then inspect the title and description.
- **User/business impact:** Browser tabs, copied links, history entries, support screenshots, and any scraper that records metadata mislabel the error as the portfolio homepage.
- **Likely root cause:** The root metadata is inherited by the router's generic not-found response.
- **Recommended improvement:** Add a deliberate not-found head with an error-specific title and concise description; preserve the real 404 status. An explicit `noindex` may be added defensively, but the status code is the primary signal.
- **Safer alternatives/tradeoffs:** Keeping the shared description is harmless to indexing because the response is a hard 404, but it retains poor user-facing labeling. Avoid canonicalizing missing URLs to `/`; that can create soft-404 ambiguity.
- **Estimated effort:** Small, approximately 1 hour once the not-found ownership is clear.
- **Dependencies:** Functional/error-page scope; route framework's not-found metadata mechanism.
- **Objective verification:** Any unknown path returns 404 and raw SSR contains exactly one error-specific title; the page does not claim to be the portfolio home and does not canonicalize to a valid route.

## Risks / Unverified

### 08-RISK-001 — The public indexing intent of `/video-player-lab` is unresolved

- **ID:** `08-RISK-001`
- **Severity:** `P1 high`
- **Affected route/component/file:** `/video-player-lab`; `src/routes/video-player-lab.tsx:5-7`.
- **Evidence:** The route is publicly reachable with status 200, has no robots meta directive, has no authentication, and inherits normal portfolio metadata. For a 200 HTML document, absence of a robots directive normally permits indexing. Repository naming and on-page purpose suggest a development lab, but intent cannot be proven from code.
- **Reproduction:** Fetch `https://m0code.com/video-player-lab`; verify 200 and absence of `meta name="robots"`.
- **User/business impact:** If this is an internal experiment, it can appear in search or previews and expose unfinished UX under the public brand. If it is intended public work, adding `noindex` would unnecessarily hide it.
- **Likely root cause:** No explicit route-publication policy or metadata classification for lab routes.
- **Recommended improvement:** Obtain an explicit owner decision. If public, give it unique metadata, canonical, and social data. If non-public, remove it from the public deployment in an authorized change or add authentication; use `noindex, nofollow` only as a search-control layer, not access control.
- **Safer alternatives/tradeoffs:** `noindex` is quick and reversible but does not make the page private. Authentication is safer for sensitive work but changes access and preview behavior. Removing the deployed route is cleanest if no external users depend on it, but requires authorization and redirect/404 planning.
- **Estimated effort:** Decision: under 1 hour. Implementation later: small to medium depending on chosen control.
- **Dependencies:** Product/content owner decision; security and deployment scopes.
- **Objective verification:** The route has a documented classification. Public: 200 plus unique metadata/canonical. Non-public: no anonymous 200 content, or at minimum raw SSR has the approved noindex directive and Search Console confirms exclusion.

### 08-RISK-002 — Icon coverage and small-square rendering are not assured

- **ID:** `08-RISK-002`
- **Severity:** `P3 low`
- **Affected route/component/file:** All routes; `src/routes/__root.tsx:24-27`; `public/brand/mo-mark-v3.svg:1-2`.
- **Evidence:** The only declaration is an SVG favicon at `/brand/mo-mark-v3.svg`. It is valid XML, returns 200 as `image/svg+xml`, and has a 790×480 (1.65:1) viewBox rather than a square icon canvas. `/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`, and `/apple-touch-icon-precomposed.png` return 404. There are no declared sizes or Apple touch icon.
- **Reproduction:** Inspect the head link and SVG viewBox; request the conventional icon paths and note their 404 responses.
- **User/business impact:** Current browsers that support SVG favicons should render an icon, but tiny-tab legibility, pinned/bookmark appearance, and Apple home-screen/bookmark presentation may be inconsistent or generic.
- **Likely root cause:** A full brand mark was reused as the sole favicon without a documented cross-platform icon set.
- **Recommended improvement:** Visually approve a square, small-size-safe mark; retain SVG where useful and add only the raster/Apple variants required by the supported platform matrix. Declare explicit relations, types, and sizes.
- **Safer alternatives/tradeoffs:** Keep the single SVG if broad icon coverage is not a launch requirement; this avoids asset proliferation. Adding many legacy variants increases maintenance, so each added file should map to a verified consumer.
- **Estimated effort:** Small to medium, approximately 2–4 hours including asset design and device checks.
- **Dependencies:** Brand owner; browser/device support matrix; PWA decision.
- **Objective verification:** Every declared icon returns 200 with the stated MIME type and dimensions; the square source passes visual review at 16, 32, 48, 180, and relevant install sizes; targeted desktop and mobile browsers show the expected icon.

## Opportunities

### 08-OPP-001 — Add truthful Person/WebSite JSON-LD after identity data is approved

- **ID:** `08-OPP-001`
- **Severity:** `P3 low`
- **Affected route/component/file:** Primarily `/`; no current JSON-LD location exists in `src/routes/__root.tsx:10-28` or `src/routes/index.tsx:5`.
- **Evidence:** Source, existing `dist`, and all live responses contain zero `application/ld+json` blocks. There is therefore no malformed structured data, but also no machine-readable entity graph. Schema.org supports `Person`; Google recommends JSON-LD for maintainability but does not guarantee enhanced display.
- **Reproduction:** Search source/build and raw SSR for `application/ld+json`; count is zero.
- **User/business impact:** Optional opportunity to make the portfolio owner, canonical site, image, job title, and verified public profiles easier for machines to interpret. This is not a prerequisite for ordinary indexing and no rich-result eligibility is promised.
- **Likely root cause:** Structured data has not been modeled, and authoritative identity facts have not been approved for publication.
- **Recommended improvement:** After canonical and identity decisions, add a minimal `Person` and/or `WebSite` graph containing only visible, verified facts with stable HTTPS `@id` values. Keep route-specific content aligned with what users can see.
- **Safer alternatives/tradeoffs:** Omit JSON-LD until facts and ownership are stable; inaccurate or overclaimed markup is worse than none. Avoid adding unsupported types solely to chase rich results.
- **Estimated effort:** Small, approximately 2–4 hours including review and validation.
- **Dependencies:** Canonical URL; approved full public name, role, image, and profile URLs; privacy/content review.
- **Objective verification:** JSON parses without error; all URLs resolve; types/properties exist in Schema.org; the generic Schema Markup Validator reports no errors; any Google-supported type also passes Rich Results Test; every asserted fact is visible or independently approved.

### 08-OPP-002 — Add manifest and theme color only if installable-app behavior is intentional

- **ID:** `08-OPP-002`
- **Severity:** `P3 low`
- **Affected route/component/file:** All routes; `src/routes/__root.tsx:10-28`; `public/`.
- **Evidence:** There is no `link rel="manifest"` or `meta name="theme-color"`. `/site.webmanifest`, `/manifest.webmanifest`, and `/manifest.json` return 404. The W3C manifest specification makes manifest members optional; repository evidence does not establish a PWA/installability goal.
- **Reproduction:** Inspect raw SSR and request the three conventional manifest paths.
- **User/business impact:** Conditional opportunity for intentional installed-app identity and browser-chrome color. Without a PWA goal, there is no material launch defect.
- **Likely root cause:** No approved installability or app-shell metadata strategy.
- **Recommended improvement:** Coordinate with the PWA/offline scope. If installation is in scope, add one valid linked manifest with approved `id`, `start_url`, `scope`, names, display mode, colors, and square icons; add matching light/dark theme-color metadata where supported.
- **Safer alternatives/tradeoffs:** Do nothing for a conventional portfolio website. A partial manifest can prompt an install experience that the offline/update strategy does not support.
- **Estimated effort:** Small for metadata alone; medium if installability/offline behavior must be completed.
- **Dependencies:** PWA decision; offline/update strategy; icon assets; brand colors; privacy review of `start_url` parameters.
- **Objective verification:** The linked manifest returns 200 with the correct JSON manifest MIME type, parses without warnings, uses in-scope URLs and reachable icons, and passes target-browser installability checks; theme colors match reviewed UI modes.

## False Positives

- **Missing `meta name="keywords"`:** not a defect and should not be added for modern search ranking.
- **No `noindex` on the demonstrated missing URL:** the response is a real HTTP 404, which is the correct primary signal. The actual finding is misleading error-page metadata, not a claim that the 404 will be indexed.
- **`/og-image.png` returning 404:** no platform requires that conventional path. The defect is absence of declared Open Graph/Twitter image metadata, not absence of this filename.
- **No web app manifest:** not a defect unless installable/PWA behavior is explicitly required; tracked as a conditional opportunity.
- **`www.m0code.com` not resolving:** not a metadata defect unless that hostname is advertised as supported. The active duplicate that was confirmed is the HTTP apex.
- **No JSON-LD:** not a syntax/validation failure because no blocks exist. It is an optional, truth-dependent opportunity.

## Passed Checks

- Exactly one `<title>`, one description, one viewport, and one charset declaration are present in raw SSR for each tested document response.
- `<html lang="en">` is present on both 200 routes and the 404 response.
- Viewport is `width=device-width, initial-scale=1`.
- Metadata is present in SSR and returned equally to normal, Googlebot, Facebook crawler, and Twitterbot user agents; it does not depend on client JavaScript.
- Existing `dist` and production use the same semantic metadata as source; only asset/preload hashes and one route preload differ.
- Fresh, repeat, and `Cache-Control: no-cache` requests produced identical head hashes for `/`, `/video-player-lab`, and the 404.
- `/video-player-lab/` redirects in one 307 hop to `/video-player-lab`; it does not emit a competing document.
- The demonstrated missing route returns a hard 404 rather than a soft-404 200.
- `/brand/mo-mark-v3.svg` returns 200 as `image/svg+xml`; `xmllint --noout` reports valid XML.
- No invalid, duplicate, or contradictory canonical/OG/Twitter/JSON-LD declarations were found because those declaration families are absent.

## Not Tested

- Facebook, LinkedIn, X/Twitter, Slack, iMessage, Discord, or other platform preview debuggers: no authenticated debugger access was used, and the user prohibited external submissions. No social preview success is claimed.
- A rendered/hydrated browser head: the connected browser runtime had no available browser instance. SSR, crawler-user-agent, source, and built-artifact evidence was collected instead; client-side mutation behavior is not claimed.
- Search Console's Google-selected canonical, indexed URL inventory, enhancements, or live URL Inspection: no Search Console access was provided.
- Physical-browser/OS rendering of the SVG favicon, Apple bookmarks, pinned tabs, or install surfaces: no device matrix was available.
- A real 500 response head: there was no safe, deterministic read-only way to force production into a server error. No 500 metadata behavior is claimed.
- Social image dimensions, reachability, MIME type, byte size, crop, and alt text: no `og:image` or `twitter:image` URL exists, so these checks are not applicable yet.
- Structured-data external validation: there are zero JSON-LD blocks to submit. Google Rich Results Test and Schema Markup Validator should be used only after reviewed markup exists.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Disposition:** `08-RISK-001` is complete for the deployed release. The lab-specific portions of `08-META-002` and `08-META-003` are retired; homepage canonical, title/description, social card, icon, and structured-data work remains open.
- **Verification:** only `/` remains in the generated route tree, `/video-player-lab` returns local `404`, and no lab head or chunk is emitted by the new build.
- **Production evidence:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; `/video-player-lab` returns `404` and emits no lab-specific document/head contract.

## Implementation tracking — ITEM-02

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** the protocol-canonicalization requirement in `08-META-001` is complete through active Cloudflare rule `68b2d9da04134d4e9aef99e85002e36c`; every sampled HTTP URL redirects once to the identical HTTPS path/query. The finding remains partially open because raw SSR still lacks an absolute self-canonical and tracking-query targets are not canonicalized to a clean HTTPS URL.
- **Non-impact:** no title, description, Open Graph, Twitter/X, favicon, manifest, or JSON-LD behavior changed.
