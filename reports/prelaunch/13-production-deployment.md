# 13 — Production Deployment, Edge Configuration, Operations, and Privacy Audit

Audit date: 2026-07-29
Repository: `/Users/mo/Documents/porfolio`
Live target: `https://m0code.com`
Audited repository revision: `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a`
Latest observed production deployment revision: `5d80cbf0d9e818f3e5cc4b65766a947bdcd7ad7c`

## Scope and Method

This report covers only production deployment/configuration, custom-domain behavior, TLS, redirects, HTTP headers, compression, caching/CDN behavior, error delivery, environment/configuration validation, deployment permissions, rollback, health checks, observability, analytics, privacy/consent relevance, and incident recovery.

Read-only work performed:

- Inspected `wrangler.jsonc`, `.github/workflows/cloudflare.yml`, `package.json`, the route shell/router, ignored-file policy, existing `dist/client`, and existing `dist/server`.
- Inspected Git history and compared `HEAD`, `origin/master`, the existing build manifest, and live asset manifests without building or altering either artifact.
- Queried public DNS, the live certificate, TLS handshakes, HTTP/HTTPS and hostname variants, redirect behavior, normal and unknown routes, static assets, compressed representations, conditional requests, and MP4 range requests.
- Read the latest GitHub Actions/deployment metadata and production-environment protection metadata through read-only GitHub API/CLI calls. No secret value was read.
- Did not deliberately cause a production exception, deploy, purge caches, edit settings, install packages, run a build, or write outside this report.

Success criteria for this scope were: one identifiable release candidate; HTTPS-only canonical delivery with modern TLS; deterministic route/redirect/error behavior; explicit browser and caching policy; production-equivalent validation before promotion; reversible deployments; observable failures with actionable alerts; documented environment requirements; and privacy-aware analytics with no unapproved visitor tracking.

Current-behavior claims were checked on 2026-07-29 from the `MRS` Cloudflare edge unless otherwise stated. Configuration recommendations are grounded in current Cloudflare primary documentation: [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/), [Minimum TLS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/minimum-tls/), [HSTS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/), [Static Asset Headers](https://developers.cloudflare.com/workers/static-assets/headers/), [Content Compression](https://developers.cloudflare.com/speed/optimization/content/compression/), [Wrangler Source of Truth](https://developers.cloudflare.com/workers/wrangler/configuration/), [Versions and Deployments](https://developers.cloudflare.com/workers/versions-and-deployments/), [Rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/), [Observability](https://developers.cloudflare.com/workers/observability/), [Source Maps](https://developers.cloudflare.com/workers/observability/source-maps/), [GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/), and [Network Error Logging privacy](https://developers.cloudflare.com/network-error-logging/).

## Deployment Surface Matrix

| Surface | Repository/config evidence | Live/read-only evidence | Status |
|---|---|---|---|
| Worker | `wrangler.jsonc:2-5`; `dist/server/server.js` | Cloudflare-served SSR responses | Active |
| Static assets | `wrangler.jsonc:8-10`; `dist/client` (40 MB, 132 files) | `CF-Cache-Status: HIT` on sampled JS/CSS/SVG/MP4 | Active |
| Apex HTTPS | `wrangler.jsonc:11-16` | `https://m0code.com/` → `200` | Active |
| Apex HTTP | No redirect in repository | `http://m0code.com/` and `/video-player-lab` → `200` | Incorrect |
| `www` HTTP/HTTPS | No route or redirect in repository | `www.m0code.com` has no A/AAAA/CNAME; both schemes fail DNS | Unavailable |
| `/` | `src/routes/index.tsx:5` | `200 text/html` | Active |
| `/video-player-lab` | `src/routes/video-player-lab.tsx:5-7` | `200 text/html` | Active |
| `/video-player-lab/` | Framework normalization only | `307` to `/video-player-lab`, query preserved | Temporary redirect |
| Uppercase path | No edge normalization | `/VIDEO-PLAYER-LAB` → `200` | Duplicate |
| Unknown path | No custom not-found component | `404`, body contains only inherited shell plus `<p>Not Found</p>` | Status correct; UX weak |
| Production workflow | `.github/workflows/cloudflare.yml:1-56` | Latest run `30444677550` succeeded at SHA `5d80cbf…` | Active |
| Staging/preview | None declared | No production-equivalent preview discovered | Absent/unverified |
| Rollback | None declared | Cloudflare versions exist by platform design; no tested playbook | Unverified |
| Observability | No `observability`, `logpush`, Tail Worker, or vendor SDK config | Cloudflare dashboard inaccessible | Unverified |
| RUM/analytics | No analytics package/snippet in source or live HTML | No beacon script or analytics cookie observed; NEL headers active | Minimal |

## Confirmed Issues

### DEP-13-001 — HTTP serves the complete site and HSTS is absent

- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in production` (2026-08-01). Historical evidence below describes the 2026-07-29 baseline.
- **Affected route/component/file and line:** `http://m0code.com/*`; `https://m0code.com/*`; `wrangler.jsonc:11-16`
- **Evidence:** `curl -D - http://m0code.com/` and the same probe for `/video-player-lab` returned `200 OK` with the full HTML instead of a redirect. HTTPS responses did not contain `Strict-Transport-Security`. Cloudflare recommends edge-level Always Use HTTPS and documents HSTS as a separate repeat-visit control.
- **Reproduction steps:** Run `curl -I http://m0code.com/`, `curl -I http://m0code.com/video-player-lab`, and `curl -I https://m0code.com/`; observe HTTP `200` and no HTTPS HSTS header.
- **User/business impact:** The first request can remain plaintext, links can be shared insecurely, protocol duplicates remain reachable, and downgrade/on-path manipulation risk is unnecessarily retained.
- **Likely root cause:** The apex custom domain is configured, but no repository-managed redirect or verified zone-level “Always Use HTTPS” policy is present; HSTS is disabled or not emitted.
- **Recommended improvement:** Configure one permanent edge redirect (`308` or `301`) preserving path and query from every HTTP apex request to its HTTPS equivalent. After every intended hostname is confirmed HTTPS-safe, roll out HSTS conservatively, then increase `max-age`; consider `includeSubDomains`/preload only after a complete subdomain inventory.
- **Safer alternatives/tradeoffs:** Start with HTTPS redirects only and a short HSTS lifetime. This is easier to reverse than preload. Do not enable `includeSubDomains` until all subdomains support HTTPS.
- **Estimated effort:** S (1–3 hours including verification); preload decision is M because it requires domain-wide review.
- **Dependencies:** Cloudflare zone access; hostname/subdomain inventory; SEO canonical decision; rollback contact.
- **Objective verification method:** Every `http://m0code.com/<path>?<query>` returns exactly one permanent redirect to the identical HTTPS path/query; HTTPS returns `200`; HSTS appears only after staged enablement; SSL Labs or equivalent confirms no downgrade path.
- **Remediation evidence:** Single Redirect `68b2d9da04134d4e9aef99e85002e36c` (`Enforce HTTPS (308)`) and Response Header Transform `1bf3a525052b4554b7060662c14b2f8d` (`Staged HSTS (300 seconds)`) are active. The former covers HTML, errors, assets, media, and non-GET methods; the latter matches `http.host eq "m0code.com" and ssl` and sets exactly `max-age=300`. Cloudflare managed HSTS, `includeSubDomains`, and preload remain disabled.

### DEP-13-002 — The production edge accepts TLS 1.0 and TLS 1.1

- **Severity:** `P1 high`
- **Affected route/component/file and line:** TLS listener for `m0code.com:443`; Cloudflare zone setting (not represented in repository)
- **Evidence:** Forced handshakes completed and returned `200` with `curl --tlsv1.0 --tls-max 1.0` and `curl --tlsv1.1 --tls-max 1.1`. Verbose output identified `TLSv1 / ECDHE-RSA-AES128-SHA` and `TLSv1.1 / ECDHE-RSA-AES128-SHA`. Cloudflare states TLS 1.0/1.1 are insufficient and documents setting the minimum to TLS 1.2.
- **Reproduction steps:** Run `curl -sv --tlsv1.0 --tls-max 1.0 -o /dev/null https://m0code.com/` and repeat for TLS 1.1; observe successful handshakes and `HTTP/2 200`.
- **User/business impact:** Legacy protocol support expands the cryptographic attack surface and prevents a modern baseline; it may conflict with future compliance requirements.
- **Likely root cause:** The Cloudflare zone’s minimum TLS version remains at a legacy-compatible default.
- **Recommended improvement:** Set the minimum edge TLS version to 1.2 and keep TLS 1.3 enabled.
- **Safer alternatives/tradeoffs:** Measure legacy-client traffic first if supporting obsolete browsers/devices is a stated requirement. A portfolio site has little justification for legacy TLS, but raising the minimum can exclude those clients.
- **Estimated effort:** S (<1 hour plus monitoring).
- **Dependencies:** Cloudflare SSL/TLS setting access; traffic analytics to quantify legacy clients.
- **Objective verification method:** TLS 1.0/1.1 forced probes fail before HTTP; TLS 1.2 and 1.3 probes succeed; a public TLS scanner reports a minimum of TLS 1.2.

### DEP-13-003 — Browser hardening and privacy-control headers are absent

- **Severity:** `P1 high`
- **Affected route/component/file and line:** `/`, `/video-player-lab`, unknown-route `404`, sampled static assets; `src/routes/__root.tsx:32-43`; no `public/_headers`; `wrangler.jsonc:1-17`
- **Evidence:** Live responses omitted `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`/CSP `frame-ancestors`, and cross-origin isolation policies. The repository contains no `_headers` file and no SSR response-header middleware.
- **Reproduction steps:** Run `curl -sS -D - -o /dev/null https://m0code.com/` and repeat for `/video-player-lab`, an unknown route, and a static asset; search the response headers for the names above.
- **User/business impact:** The browser receives no site-specific restraint on framing, MIME sniffing, referrer disclosure, powerful features, or script/resource origins. This weakens defense in depth and makes future third-party additions riskier.
- **Likely root cause:** Deployment relies entirely on Cloudflare Workers’ default static-asset headers, while SSR responses have no application-level header wrapper.
- **Recommended improvement:** Design a tested CSP from the actual SSR output and resource inventory, preferably nonce- or hash-based for framework inline scripts; add `frame-ancestors`, `nosniff`, a deliberate `Referrer-Policy`, and a minimal `Permissions-Policy` to all success and error responses. Apply SSR headers in the Worker response path; use `_headers` only for matching static assets as Cloudflare documents.
- **Safer alternatives/tradeoffs:** Begin with `Content-Security-Policy-Report-Only` and non-CSP headers, collect violations, then enforce. A rushed CSP can break hydration, media, or future analytics; broad `'unsafe-inline'` restores compatibility but weakens the control.
- **Estimated effort:** M (1–2 days including route/error/media validation).
- **Dependencies:** Application-security scope 03; metadata/third-party inventory; error-path tests; any approved analytics provider.
- **Objective verification method:** An automated header test covers `200`, redirect, `404`, static JS/CSS/SVG/media, and a controlled staging `500`; CSP report-only produces no unexplained violations before enforcement; clickjacking and MIME-sniff checks pass.

### DEP-13-004 — Production deploys have no approval gate or production-like preview

- **Severity:** `P1 high`
- **Affected route/component/file and line:** `.github/workflows/cloudflare.yml:3-10,19-56`; GitHub environment `production`
- **Evidence:** Every push to `master` reaches `wrangler deploy`; `workflow_dispatch` can run the workflow from a selectable ref; there is no staging/preview deployment job. The read-only GitHub environment API returned `protection_rules: []` and `deployment_branch_policy: null`. Pull requests build/dry-run but do not produce a deployed preview. The latest six push-triggered runs all deployed production directly.
- **Reproduction steps:** Inspect the workflow triggers/conditions; run `gh api repos/MoIbrahim10/portfolio/environments/production --jq '{protection_rules,deployment_branch_policy}'`; inspect `gh run list --workflow Cloudflare`.
- **User/business impact:** A bad merge, compromised maintainer session, or mistaken manual dispatch can immediately replace all production traffic without human approval or production-equivalent validation.
- **Likely root cause:** CI was optimized for fast personal-site delivery rather than controlled release promotion.
- **Recommended improvement:** Require the approved release branch/SHA, protect the production environment with reviewers and branch/tag policy where plan capabilities allow, deploy the exact validated artifact/version to a preview or 0%-traffic version first, and promote only after smoke/functional/header checks.
- **Safer alternatives/tradeoffs:** If environment protection is unavailable on the current GitHub plan, make production deployment a separate manually invoked workflow that verifies an explicit full SHA and require an out-of-band checklist. This is less enforceable than platform rules but materially safer.
- **Estimated effort:** M (1–2 days).
- **Dependencies:** GitHub plan/repository policy; Cloudflare token scopes; release owner; scope 14 CI gates.
- **Objective verification method:** An unapproved branch/ref cannot enter `production`; PRs create a non-production URL/version; promotion consumes the already validated SHA/artifact; audit logs show the approver and promoted version.

### DEP-13-005 — The audited launch candidate is not the production artifact

- **Severity:** `P1 high`
- **Affected route/component/file and line:** repository `HEAD`; `origin/master`; `dist/client/assets/*`; live `/assets/*`; `.github/workflows/cloudflare.yml:7-9,44-56`
- **Evidence:** `git rev-list --left-right --count origin/master...HEAD` returned `0 1`. Local `HEAD` is `ae1ec7c…`; the latest successful production run/deployment is `5d80cbf…`. Existing `dist` references `index-COTNhO9J.js`, `routes-BXeiZRtJ.js`, and `styles-DDBD8rJB.css`; live HTML references different `index-BTo1nZ1V.js`, `routes-DAvGpumd.js`, and `styles-B9P8SFFr.css`. A new candidate asset, `/avatar/mo-avatar-portrait-01-640.webp`, returns live `404`.
- **Reproduction steps:** Run `git rev-list --left-right --count origin/master...HEAD`; compare `git show -s HEAD origin/master`; list `dist/client/assets`; extract `/assets/*.js|css` from both live routes; request the sampled candidate avatar.
- **User/business impact:** Production observations do not prove the current candidate is deployable or behaves correctly at the edge. Launch sign-off can be given to one revision while a different revision is released.
- **Likely root cause:** The newest commit is local/unpushed and CI deploys only `master`; no immutable release-candidate identifier is recorded in the site or master checklist.
- **Recommended improvement:** Choose one full commit SHA as the release candidate, have every specialist validate the corresponding built artifact, and after authorization deploy exactly that SHA/artifact. Persist the Git SHA, Cloudflare version ID, asset manifest/checksum, run URL, and timestamp in release metadata.
- **Safer alternatives/tradeoffs:** Continue auditing live and candidate separately, labeling every result. This avoids premature deployment but doubles work and cannot establish final production parity until promotion.
- **Estimated effort:** S for identification/metadata; M if artifact promotion must be added.
- **Dependencies:** All audit scopes; authorized push/deployment; reproducible build; release owner.
- **Objective verification method:** `HEAD`, approved remote SHA, build provenance, GitHub deployment SHA, Cloudflare version, and live manifest all map to the same release; a known candidate asset returns its expected status/hash.

### DEP-13-006 — Fingerprinted bundles receive a zero-second browser cache lifetime

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** live `/assets/index-BTo1nZ1V.js`, `/assets/styles-B9P8SFFr.css`, `/assets/routes-DAvGpumd.js`; `wrangler.jsonc:8-10`; missing `public/_headers`
- **Evidence:** Sampled fingerprinted JS/CSS returned `Cache-Control: public, max-age=0, must-revalidate`. They produced `CF-Cache-Status: HIT` and strong ETags, and an `If-None-Match` request correctly returned `304`, but every repeat visit must still contact the edge. Cloudflare explicitly documents long-lived `immutable` caching for fingerprinted assets.
- **Reproduction steps:** Request each asset twice with `curl -D - -o /dev/null`; observe `max-age=0`; repeat with `If-None-Match` to observe `304`.
- **User/business impact:** Repeat navigations incur avoidable request latency and validation traffic, weakening offline/repeat-visit performance despite content-addressed filenames.
- **Likely root cause:** The deployment accepts Cloudflare Workers Static Assets’ safe default and has no path-specific override.
- **Recommended improvement:** Apply a long browser lifetime with `immutable` only to content-hashed JS/CSS and other truly fingerprinted artifacts. Give unversioned media/logo URLs an explicit shorter or revalidation policy unless their filenames are versioned.
- **Safer alternatives/tradeoffs:** Use a shorter initial TTL (for example, one day) while confirming all build references are fingerprinted. Applying a year-long immutable policy to mutable filenames can strand stale content.
- **Estimated effort:** S (2–4 hours including cache tests).
- **Dependencies:** Asset naming inventory; deployment/header implementation; rollback strategy that keeps referenced historical assets available.
- **Objective verification method:** Fingerprinted assets return a long `max-age` plus `immutable`; mutable assets retain the approved shorter policy; a new deployment changes hashed URLs; old HTML references remain retrievable during the rollback window.

### DEP-13-007 — Production MP4 assets ignore byte-range requests

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** `public/portfolio/projects/glazed/studio-scroll.mp4`; live `/portfolio/projects/glazed/studio-scroll.mp4`; `wrangler.jsonc:8-10`
- **Evidence:** `Range: bytes=0-99` returned `HTTP/2 200`, no `Content-Range`/`Accept-Ranges`, and downloaded the entire 1,213,985-byte file. A normal request is a CDN `HIT`, but range requests also omit the default `Cache-Control` header.
- **Reproduction steps:** Run `curl -r 0-99 -D - -o /dev/null -w 'downloaded=%{size_download}\n' https://m0code.com/portfolio/projects/glazed/studio-scroll.mp4`; observe `200` and `downloaded=1213985`, not `206` and 100 bytes.
- **User/business impact:** Seeking and interrupted/retried playback can transfer full files, increasing bandwidth, battery use, and latency on mobile or unreliable networks.
- **Likely root cause:** Direct Workers Static Assets delivery is not producing partial responses for this media path, and no media-specific delivery/caching layer is configured.
- **Recommended improvement:** First verify range behavior on the approved candidate and multiple media files. If still unsupported, serve large/seeking-sensitive media from a delivery path that demonstrably returns correct `206` responses (for example, a carefully tested Worker cache/R2 path or adaptive video service) and keep posters/static short clips simple.
- **Safer alternatives/tradeoffs:** For small decorative autoplay loops, keep direct static delivery and optimize file size/preload behavior rather than adding a paid video service. A custom range implementation is easy to get wrong; prefer a platform-supported path and test cache semantics.
- **Estimated effort:** M (1–3 days depending on delivery choice).
- **Dependencies:** Performance scope 05; functional video scope 10; media inventory and size thresholds; Cloudflare product/cost decision.
- **Objective verification method:** Representative range probes return `206`, exact `Content-Range`, exact requested byte count, and repeat-cache behavior; seeking is tested on Safari/iOS, Chromium, and throttled mobile networks.

### DEP-13-008 — URL normalization is incomplete and uses temporary redirects

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** `/video-player-lab/`, `/VIDEO-PLAYER-LAB`, duplicate slashes; `src/routes/video-player-lab.tsx:5-7`; no edge redirect policy
- **Evidence:** `/video-player-lab/?audit=1` returns `307` with `Location: /video-player-lab?audit=1`; `/VIDEO-PLAYER-LAB` returns `200`; `//` returns a permanent `308`. HTTP is not normalized at all before route handling.
- **Reproduction steps:** Probe each listed URL with `curl -D - -o /dev/null` and compare status and `Location`.
- **User/business impact:** Multiple addresses serve the same application, caches/analytics can fragment, temporary redirects remain ambiguous, and future route-specific policies become harder to reason about.
- **Likely root cause:** Framework defaults handle some slash cases, while no explicit edge canonical-host/path policy exists.
- **Recommended improvement:** Define the intended host, scheme, path case, and trailing-slash policy; implement one-hop permanent redirects that preserve query strings; add a route matrix test.
- **Safer alternatives/tradeoffs:** Normalize only scheme/host/slashes now and leave case alone until route-collision behavior is reviewed. Globally lowercasing URLs can break future case-sensitive asset paths.
- **Estimated effort:** S–M (half to one day).
- **Dependencies:** SEO scope 07; metadata/canonical scope 08; approved route inventory.
- **Objective verification method:** Every approved variant either returns the unique intended `200` URL or one permanent redirect to it; assets are excluded from unsafe path rewriting; automated tests assert status/location/query preservation.

### DEP-13-009 — Error delivery is generic and has no application recovery boundary

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** unknown routes; `src/routes/__root.tsx:10-30,32-43`; `src/router.tsx:5-11`
- **Evidence:** An unknown URL correctly returns `404`, but the HTML body is only the inherited site shell and `<p>Not Found</p>`. There is no route/router-level `notFoundComponent`, `errorComponent`, or error boundary. Existing server output logs framework errors with `console.error`, but no user-facing recovery or release/correlation context exists.
- **Reproduction steps:** Request a unique unknown path and inspect status/body; inspect root/router configuration and search source for error/not-found components.
- **User/business impact:** Visitors hitting stale links get no navigation/recovery path; an actual render/runtime failure may produce a framework-default response and be difficult to correlate with a release.
- **Likely root cause:** Default TanStack Start error behavior was left unchanged.
- **Recommended improvement:** Add intentional `404` and application error experiences with a home/retry path, preserve accurate statuses, and attach safe correlation/release identifiers to logs. Exercise a controlled error only in preview/staging.
- **Safer alternatives/tradeoffs:** A minimal branded 404 and generic “try again” boundary are sufficient; avoid exposing stack traces or internal exception details.
- **Estimated effort:** S–M (half to one day plus tests).
- **Dependencies:** Application architecture; accessibility; observability implementation; preview environment for safe `500` testing.
- **Objective verification method:** Automated preview tests assert useful, accessible, non-sensitive bodies and correct `404`/`500` statuses; retry/home actions work; the associated error event is searchable by correlation/release ID.

### DEP-13-010 — Releases are not captured as promotable artifacts and rollback is undocumented

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** `.github/workflows/cloudflare.yml:31-56`; `wrangler.jsonc:1-17`; no release/rollback runbook
- **Evidence:** CI builds and immediately runs `wrangler deploy`; it does not upload/persist the exact `dist`, build manifest, checksum, Cloudflare version ID, or deployment URL. No rollback job, command, health threshold, owner, or recovery checklist exists. The GitHub deployment record has an empty `environment_url`.
- **Reproduction steps:** Inspect workflow steps and repository files; query the latest GitHub deployment/status metadata; confirm no artifact/promotion/rollback step and blank environment URL.
- **User/business impact:** During an incident, responders must discover the prior version and procedure under pressure; reproducing or proving the exact deployed artifact is harder.
- **Likely root cause:** The pipeline treats a successful deploy as the release record and relies implicitly on Cloudflare’s version history.
- **Recommended improvement:** Persist build provenance and the Cloudflare version ID, document tested rollback and forward-fix procedures, assign an incident owner, define rollback thresholds, and link the production URL/run/version in deployment status. Cloudflare supports rolling back to recent published versions, but storage/binding state is not rolled back.
- **Safer alternatives/tradeoffs:** For this stateless site, a concise manual runbook using Cloudflare’s dashboard/version history is acceptable initially. Automation is faster but dangerous until target-version selection and post-rollback checks are guarded.
- **Estimated effort:** M (1–2 days, including a non-production drill).
- **Dependencies:** Cloudflare deployment permissions; release metadata; observability/health signals; any future stateful binding inventory.
- **Objective verification method:** In a preview/test Worker, promote version A, promote B, roll back to A, and verify routes/assets/headers; record recovery time and evidence. Production documentation identifies the exact previous stable version without rebuilding.

## Risks / Unverified Configuration

### DEP-13-R01 — No verifiable end-to-end observability or alerting contract

- **Severity:** `P1 high`
- **Affected route/component/file and line:** production Worker `portfolio`; `wrangler.jsonc:1-17`; `.github/workflows/cloudflare.yml:54-56`
- **Evidence:** Repository config has no `observability`, sampling, logpush, Tail Worker, error vendor, alert thresholds, or uptime monitor. The only active health evidence is a post-deploy title grep. Cloudflare’s dashboard, Workers Logs, metrics, notification policies, and external monitors were inaccessible, so absence outside the repository is not claimed.
- **Reproduction steps:** Search repository config/source for observability/logging/monitoring integrations; inspect the workflow verification step; review dashboard settings with an authorized operator.
- **User/business impact:** A deployment can pass while a secondary route, asset, interaction, or region is broken; exceptions, latency regressions, and elevated 4xx/5xx may go unnoticed.
- **Likely root cause:** Operations controls may be dashboard-only or not yet defined as release requirements.
- **Recommended improvement:** Define an observable-service baseline: request/error/exception/latency metrics, per-version release markers, structured safe logs, external route/asset uptime checks, and alerts with owner/severity/runbook links. Keep sampling and retention proportional to traffic/privacy.
- **Safer alternatives/tradeoffs:** Start with Cloudflare native metrics/Workers Logs plus one external HTTPS monitor before adding a vendor SDK. Full log export improves retention but adds cost and privacy/security obligations.
- **Estimated effort:** M (1–3 days).
- **Dependencies:** Cloudflare dashboard access; privacy/retention policy; incident owner; budget.
- **Objective verification method:** A controlled preview failure produces a searchable event and alert containing route, status, release/version, and correlation ID; an operator follows the runbook within the target detection/recovery time.

### DEP-13-R02 — Production stack traces are likely not source-mapped

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** `dist/server/server.js`; `wrangler.jsonc:1-17`; live `/assets/*.js`
- **Evidence:** Existing `dist` contains zero `.map` files; live `.js.map` probes return `404`; bundles contain no `sourceMappingURL`; `upload_source_maps` is absent from Wrangler config. Public map absence is good, but private Cloudflare/vendor upload state could not be inspected.
- **Reproduction steps:** `find dist -name '*.map'`; search bundles for `sourceMappingURL`; request sampled live map URLs; inspect authorized Cloudflare source-map status.
- **User/business impact:** Minified Worker/client stack traces can slow diagnosis and increase mean time to recovery.
- **Likely root cause:** Production sourcemap generation/private upload was not configured.
- **Recommended improvement:** Generate maps during the approved release build and upload them privately to Cloudflare or the selected error service, tied to the exact release; do not serve them as public static assets unless intentionally accepted.
- **Safer alternatives/tradeoffs:** Retain maps as restricted CI artifacts if private upload is unavailable. Maps can contain source context, so access/retention must be controlled.
- **Estimated effort:** S–M (half to one day).
- **Dependencies:** Error-monitoring decision; CI artifact retention; privacy/security review.
- **Objective verification method:** A controlled preview exception renders an original source file/line in authorized logs while public `.map` URLs remain unavailable.

### DEP-13-R03 — `keep_vars: true` permits unreviewed dashboard configuration drift

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** `wrangler.jsonc:7`; production Worker variables/bindings
- **Evidence:** Cloudflare documents Wrangler configuration as the preferred source of truth; `keep_vars: true` preserves dashboard-configured variables on deploy. No app environment references, declared `vars`, `secrets.required`, or binding contract were found, and dashboard values were intentionally not inspected.
- **Reproduction steps:** Inspect `wrangler.jsonc:7`; search source for environment/binding access; compare authorized dashboard variable/binding names—not values—against an approved contract.
- **User/business impact:** A production-only variable can persist without code review, making releases less reproducible and potentially retaining obsolete integrations or data paths.
- **Likely root cause:** The setting was used to protect dashboard-managed values during deploy before an explicit environment contract existed.
- **Recommended improvement:** Declare required non-secret configuration and required secret names in version-controlled config where supported; document intentionally dashboard-managed settings; remove `keep_vars` only after a name-only inventory and migration plan.
- **Safer alternatives/tradeoffs:** Keep the flag but add a CI check that compares names/types against an allowlist. Removing it abruptly could erase required plain-text dashboard vars; encrypted secrets are handled differently and must be reviewed separately.
- **Estimated effort:** S for current app; M if hidden bindings/vars exist.
- **Dependencies:** Authorized dashboard inventory; scope 04 secrets review; environment owner.
- **Objective verification method:** A fresh preview Worker configured only from documented inputs deploys and serves all routes; production has no undeclared variable/binding names; missing required inputs fail before promotion.

### DEP-13-R04 — The `www` hostname has no resilience redirect

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** `http(s)://www.m0code.com/*`; `wrangler.jsonc:11-16`
- **Evidence:** `dig` returns no A, AAAA, or CNAME for `www.m0code.com`; both HTTP and HTTPS requests fail DNS. The apex certificate observed includes `*.m0code.com`, but a certificate alone does not create routing/DNS.
- **Reproduction steps:** Run `dig +short www.m0code.com A`, `AAAA`, and `CNAME`; request both schemes.
- **User/business impact:** Commonly guessed or auto-completed brand URLs fail instead of preserving visitors and backlinks.
- **Likely root cause:** Only the apex custom domain was intentionally configured.
- **Recommended improvement:** Decide whether `www` is supported. If yes, add proxied DNS/TLS coverage and a one-hop permanent path/query-preserving redirect to the apex. If no, document it as out of scope.
- **Safer alternatives/tradeoffs:** Leave `www` absent to keep the surface minimal; this is valid if the brand never publishes it, but accepts link-loss risk.
- **Estimated effort:** S (1–2 hours plus DNS propagation/verification).
- **Dependencies:** Brand/SEO decision; Cloudflare DNS and redirect access.
- **Objective verification method:** Supported case: all four `http(s)://www` variants resolve and redirect once to the apex. Unsupported case: release requirements explicitly exclude `www`.

### DEP-13-R05 — Auxiliary Worker hostnames and preview URLs are not explicitly governed

- **Severity:** `P3 low`
- **Affected route/component/file and line:** `*.workers.dev` and Worker preview URLs; `wrangler.jsonc:1-17`
- **Evidence:** `workers_dev` and `preview_urls` are not explicit. Cloudflare documents that routes usually infer `workers_dev: false`, but dashboard state/account subdomain was inaccessible and no account hostname was guessed or enumerated.
- **Reproduction steps:** Inspect Wrangler config and authorized Worker Domains & Routes settings.
- **User/business impact:** An unintended alternate production origin could bypass apex redirects/headers, fragment analytics/indexing, or expose previews.
- **Likely root cause:** Behavior is left to Wrangler inference/dashboard state.
- **Recommended improvement:** Explicitly set the intended `workers_dev`/`preview_urls` posture and, if previews are enabled, protect/noindex them and treat their URLs as non-production.
- **Safer alternatives/tradeoffs:** Keep preview URLs for pre-release QA but restrict access; disabling them reduces attack surface but removes a useful validation surface.
- **Estimated effort:** S (<1 hour).
- **Dependencies:** Preview strategy; Cloudflare access; SEO/security review.
- **Objective verification method:** Authorized domain inventory shows only intended hostnames; alternate hosts are disabled, access-controlled, or return the approved non-indexable preview behavior.

### DEP-13-R06 — DNSSEC and certificate-authority restriction are not visible

- **Severity:** `P3 low`
- **Affected route/component/file and line:** DNS zone for `m0code.com`; outside repository
- **Evidence:** Public `DS` and `CAA` queries returned no records; DNSSEC validation flags were absent. This does not invalidate the current certificate or prove an active attack.
- **Reproduction steps:** Run `dig +short DS m0code.com` and `dig +short CAA m0code.com`; validate with an independent DNSSEC analyzer.
- **User/business impact:** DNS responses lack registrar-to-zone cryptographic validation, and no public CAA policy narrows certificate issuers.
- **Likely root cause:** Optional DNS hardening has not been enabled/published.
- **Recommended improvement:** Evaluate Cloudflare DNSSEC and publish the registrar DS through the documented workflow; add CAA only after inventorying Cloudflare-managed certificate issuers and renewal requirements.
- **Safer alternatives/tradeoffs:** DNSSEC/CAA misconfiguration can cause total resolution or renewal failure. Stage with an owner, monitoring, and rollback instructions; do not guess issuer values.
- **Estimated effort:** M (half to one day plus propagation monitoring).
- **Dependencies:** Registrar and Cloudflare DNS access; certificate issuer inventory; incident owner.
- **Objective verification method:** Independent validators show a complete DNSSEC chain; certificate issuance/renewal remains healthy; CAA permits every required managed issuer and no others.

### DEP-13-R07 — Privacy/analytics controls outside the repository are unverified

- **Severity:** `P3 low`
- **Affected route/component/file and line:** live responses; Cloudflare NEL/edge analytics/Web Analytics settings; no repository file
- **Evidence:** No analytics beacon, third-party in-page script, `Set-Cookie`, or consent storage was observed. Responses do include `NEL` and `Report-To` pointing at `a.nel.cloudflare.com` with `success_fraction: 0`. Cloudflare documents that NEL processes network-failure metadata and purges PII/IP data after request processing. Dashboard Web Analytics, edge analytics retention/access, and DPA/privacy-notice decisions were inaccessible.
- **Reproduction steps:** Inspect live HTML and response headers; review Cloudflare Analytics/NEL settings and organizational privacy records with authorized access.
- **User/business impact:** There is no evidence of cookie-based tracking requiring a banner today, but incomplete processor/retention documentation can create governance gaps if analytics is enabled later.
- **Likely root cause:** Analytics is minimal and privacy decisions are not represented in this small codebase.
- **Recommended improvement:** Record Cloudflare as an infrastructure/data processor, document NEL/edge analytics and retention/access, and require a privacy review before enabling any new beacon or marketing integration.
- **Safer alternatives/tradeoffs:** Keep the current no-beacon posture. Do not add a consent banner without a legal/technical need; unnecessary banners harm UX and can themselves create storage.
- **Estimated effort:** S for inventory; legal review varies.
- **Dependencies:** Content/legal scope 15; Cloudflare account owner; applicable jurisdiction and policy.
- **Objective verification method:** A maintained data-flow inventory matches network evidence and dashboard settings; any enabled client analytics has documented purpose, data fields, retention, access, and consent/legal basis.

## Opportunities

### DEP-13-O01 — Promote Cloudflare versions gradually with version-aware validation

- **Severity:** `P2 medium`
- **Affected route/component/file and line:** `.github/workflows/cloudflare.yml:41-56`; Cloudflare Workers Versions and Deployments
- **Evidence:** Current CI uses immediate `wrangler deploy` to 100% traffic. Cloudflare supports uploaded versions, gradual deployments, version overrides, and rollback.
- **Reproduction steps:** Inspect the deploy command and absence of version upload/promotion steps; review authorized Worker deployment history.
- **User/business impact:** A small canary can expose runtime/header/asset defects before all visitors are affected.
- **Likely root cause:** No distinction exists between uploading a version and making it globally active.
- **Recommended improvement:** Upload an immutable version, test it using preview/version override at 0% or controlled traffic, then promote in stages with error/404 thresholds and version affinity for fingerprinted assets.
- **Safer alternatives/tradeoffs:** A single manual preview followed by full promotion is simpler for low traffic. Gradual deployment without version affinity can mix HTML and asset versions and create false 404s.
- **Estimated effort:** M (1–2 days).
- **Dependencies:** Observability; release metadata; version affinity design; CI authorization.
- **Objective verification method:** A test release is exercised before traffic, promoted through documented stages, maintains asset consistency, and automatically/manual-rolls back when a defined threshold is breached.

### DEP-13-O02 — Add release and request correlation to deployment evidence

- **Severity:** `P3 low`
- **Affected route/component/file and line:** `.github/workflows/cloudflare.yml:44-56`; production logs/deployment status
- **Evidence:** Live responses contain `CF-RAY`, but deployment status has no `environment_url`, and no release/version identifier is persisted with smoke results.
- **Reproduction steps:** Inspect live headers and GitHub deployment status API for deployment `5655911137`.
- **User/business impact:** Support and incident triage require manual correlation between a visitor report, Cloudflare request, GitHub SHA, and Worker version.
- **Likely root cause:** Deployment metadata is not treated as a first-class artifact.
- **Recommended improvement:** Record production URL, full SHA, Worker version ID, manifest/checksum, and verification results in the deployment record; teach incident intake to retain `CF-RAY` and timestamp.
- **Safer alternatives/tradeoffs:** Keep exact version metadata in restricted deployment logs rather than a public response header if repository/release identifiers are considered sensitive.
- **Estimated effort:** S (2–4 hours).
- **Dependencies:** Workflow outputs; Cloudflare deploy output; incident runbook.
- **Objective verification method:** Given a timestamp and `CF-RAY`, an operator identifies the serving Worker version and source SHA from one documented path.

### DEP-13-O03 — Add privacy-preserving RUM only after an explicit measurement decision

- **Severity:** `P3 low`
- **Affected route/component/file and line:** all public HTML; future analytics configuration
- **Evidence:** Current live HTML contains no Cloudflare Web Analytics beacon, so real-user Core Web Vitals and route-level production experience are not visible from repository evidence.
- **Reproduction steps:** Search live HTML for `static.cloudflareinsights.com/beacon.min.js` and inspect `/cdn-cgi/rum` traffic in a browser session; none was observed in raw HTML.
- **User/business impact:** Synthetic checks can miss field-only device/network regressions, but adding measurement creates governance and CSP work.
- **Likely root cause:** Analytics was intentionally omitted or is not configured.
- **Recommended improvement:** If field performance is a launch KPI, evaluate a minimal privacy-preserving RUM setup, define collected fields/retention/access, update CSP and privacy documentation, and avoid marketing trackers by default.
- **Safer alternatives/tradeoffs:** Remain analytics-free and rely on periodic synthetic Lighthouse/uptime tests. This maximizes privacy but provides less evidence about real-user experience.
- **Estimated effort:** S–M depending on governance.
- **Dependencies:** Privacy/legal decision; performance scope 05/06; CSP; dashboard access.
- **Objective verification method:** The approved RUM tool reports only documented metrics, stores no unapproved identifiers, causes no console/CSP errors, and has measured performance overhead below the accepted budget.

## False Positives

### DEP-13-FP01 — The committed Cloudflare account ID is not an authentication secret

- **Severity:** `P3 low`
- **Affected route/component/file and line:** `wrangler.jsonc:6`; `.github/workflows/cloudflare.yml:49`
- **Evidence:** The same account ID is present in configuration and CI, while the actual API token is referenced only as `${{ secrets.CLOUDFLARE_API_TOKEN }}`. No token value was found or inspected.
- **Reproduction steps:** Inspect the named lines; do not print GitHub secret values.
- **User/business impact:** Treating the identifier as a credential would create unnecessary churn without reducing access.
- **Likely root cause:** Account IDs resemble opaque secrets but are routing/account identifiers.
- **Recommended improvement:** No emergency rotation is warranted. Optionally source the ID from a non-secret CI variable for consistency.
- **Safer alternatives/tradeoffs:** Keeping it committed improves reproducibility; moving it reduces duplication but adds dashboard configuration.
- **Estimated effort:** None/S.
- **Dependencies:** None.
- **Objective verification method:** Authentication fails without a valid scoped API token even when the account ID is known.

### DEP-13-FP02 — Missing public source maps is desirable; missing private mapping is the risk

- **Severity:** `P3 low`
- **Affected route/component/file and line:** live `/assets/*.map`; existing `dist`
- **Evidence:** Public map probes return `404`, and bundles have no public mapping directive. This reduces source disclosure; DEP-13-R02 concerns authorized diagnostic mapping, not public exposure.
- **Reproduction steps:** Request sampled `.map` paths and search bundle tails.
- **User/business impact:** Misclassifying public-map absence as a defect could accidentally publish source internals.
- **Likely root cause:** Production builds omit maps by default.
- **Recommended improvement:** Keep maps private and release-bound if introduced.
- **Safer alternatives/tradeoffs:** Restricted CI retention is safer than public hosting but less convenient than integrated private symbolication.
- **Estimated effort:** None for current public posture.
- **Dependencies:** DEP-13-R02.
- **Objective verification method:** Public map URLs remain unavailable while authorized preview exceptions resolve to original lines.

### DEP-13-FP03 — No consent banner is not itself a defect on current network evidence

- **Severity:** `P3 low`
- **Affected route/component/file and line:** `/`; `/video-player-lab`; live response/storage behavior
- **Evidence:** No analytics beacon, marketing script, `Set-Cookie`, local consent storage, or embedded third-party frame was observed. External services are ordinary outbound links. NEL is infrastructure error reporting and Cloudflare documents its privacy processing.
- **Reproduction steps:** Inspect raw HTML/headers and a clean browser’s cookie/storage/network state.
- **User/business impact:** Adding a banner without a data-processing need can reduce trust/accessibility and create its own storage behavior.
- **Likely root cause:** The site is currently tracking-light.
- **Recommended improvement:** Base consent UI on actual technology and legal requirements, not a generic checklist.
- **Safer alternatives/tradeoffs:** Maintain a concise privacy notice describing infrastructure processing even if no consent banner is required.
- **Estimated effort:** None/S.
- **Dependencies:** Legal/content scope 15.
- **Objective verification method:** The technical data-flow inventory and jurisdiction-specific legal review agree on whether consent is required.

## Passed Checks

- Apex DNS resolves to Cloudflare anycast IPv4 and IPv6 addresses; live responses expose `server: cloudflare` and `CF-RAY`.
- The apex certificate validates successfully, covers `m0code.com`, and was valid from 2026-07-28 through 2026-10-26 in the sampled handshake; certificate renewal settings remain dashboard-only.
- TLS 1.2 and TLS 1.3 handshakes succeed. HTTP/2 is active and `alt-svc` advertises HTTP/3.
- Brotli, gzip, and Zstandard are negotiated correctly for sampled JS; Zstandard is also applied to HTML/CSS/SVG when requested. MP4 is not wastefully recompressed.
- Sampled static assets were served as CDN `HIT`s with correct MIME types and ETags; conditional `If-None-Match` returned `304`.
- Unknown application paths return a real `404`, not a soft `200`.
- `/video-player-lab/` preserves the query string while redirecting; duplicate slash normalization uses a permanent `308`.
- The latest observed production workflow run, [30444677550](https://github.com/MoIbrahim10/portfolio/actions/runs/30444677550), completed checkout, frozen install, type-check, build, Wrangler dry-run, deploy, and smoke steps successfully for `5d80cbf…`.
- GitHub workflow token permissions are explicitly limited to `contents: read`; the Cloudflare API token is stored as a GitHub secret reference rather than plaintext.
- Workflow concurrency serializes production deployments with `cancel-in-progress: false`, avoiding overlapping deploy cancellation.
- No application runtime environment-variable access or stateful bindings were found; current source does not require a runtime secret contract.
- No client analytics beacon, third-party in-page script, analytics cookie, or public source map was observed.

## Not Tested / Inaccessible

- No deliberate production `500` was induced. Actual exception status/body, server/client boundary behavior, retry semantics, and alert delivery remain unverified.
- During the original audit, Cloudflare dashboard/API settings were inaccessible. ITEM-02 later inspected and changed only Redirect Rules and Response Header Transform Rules, and inspected the managed-HSTS duration choices. SSL mode, minimum TLS, certificate notifications, WAF/bot/rate-limit rules, Cache/Compression Rules, Cache Reserve, tiered cache, DNSSEC workflow, logging, alerts, analytics, NEL control, and account audit logs remain unverified.
- The Cloudflare API token’s scopes, resource restrictions, age, rotation, and secret value were not inspected. Least privilege is unverified.
- GitHub branch protection/rulesets could not be enabled on the current private-repository plan according to the read-only API response; no write was attempted.
- No rollback, version override, canary, cache purge, DNS change, certificate change, alert test, or incident drill was performed.
- HTTP/3 was advertised but not exercised because the available `curl` lacks HTTP/3 support.
- Only the `MRS` edge was directly sampled; multi-region availability, cache consistency, latency, packet loss, and historical uptime were not tested.
- External uptime/status tooling, Cloudflare Workers Logs/metrics, Logpush destinations, notification recipients, on-call ownership, retention, and incident communications were unavailable.
- Managed robots behavior is inconsistent (`GET /robots.txt` → `200`, `HEAD` → `404`), but ownership of that edge feature is dashboard-only and is covered primarily by scope 07.
- Production asset inventory was sampled rather than exhaustively byte-range/cache-probed; scope 05 should aggregate all media findings.
- Browser offline/cache-disabled/Slow 3G, service-worker behavior, full interaction QA, accessibility, and cross-browser behavior belong to scopes 09–12 and are not claimed here.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Deployed change:** the lab route and its normalization target no longer exist; production `/video-player-lab` is a non-redirecting `404`. `DEP-13-008` remains open for other URL normalization behavior, and all transport, TLS, headers, caching, observability, rollback, and broader artifact-provenance findings remain open.
- **Verification:** check/build pass; generated route/build output contains no lab entry; retained homepage media loads in focused browser QA and its implementation/assets are hash-identical to baseline.
- **Production evidence:** GitHub merge SHA `c273f81f59b8a1d7cd01e3cedb03b948b7d6cd32`, Actions run `30657215155`, and Cloudflare version `b8c0dab8-207e-4568-87ca-289ef74ae6e6` are bound in the deployment log. Public route and retained-viewer acceptance checks passed.

## Implementation tracking — ITEM-02

- **Status:** `Complete — verified in production` (2026-08-01).
- **Edge configuration:** active rule IDs `68b2d9da04134d4e9aef99e85002e36c` (HTTP wildcard → HTTPS wildcard, `308`, preserve query) and `1bf3a525052b4554b7060662c14b2f8d` (HTTPS apex only, set `Strict-Transport-Security: max-age=300`). No Worker source, repository deployment configuration, DNS, certificate, cache, package, secret, or lockfile was changed.
- **Acceptance evidence:** `/`, `/video-player-lab?audit=1`, `/assets/index-CtbOey3K.js?audit=1`, POST `/contact?from=audit`, and `/portfolio/projects/orgo/walkthrough.mp4?audit=2` redirect once with identical path/query. HTTPS `/`, 404, JS, and MP4 responses return expected statuses and HSTS; cache-busted HTTP responses omit HSTS. TLS 1.2 and TLS 1.3 remain healthy.
- **Regression evidence:** browser QA loaded the current homepage and played the retained Orgo MP4 at `readyState=4`, duration `4.534`, `error=null`, with no console errors/warnings. `DEP-13-001` is closed; `DEP-13-002` and the intentional HSTS-duration ramp remain open.
