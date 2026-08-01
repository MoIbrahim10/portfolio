# 03 — Application Security and OWASP Risk Audit

**Audit date:** 2026-07-29
**Repository:** `/Users/mo/Documents/porfolio` at `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a`
**Production target:** `https://m0code.com`
**Overall status:** The confirmed P1 plaintext-HTTP finding is remediated and production-verified as of 2026-08-01. The P2 CSP/clickjacking finding and broader header hardening remain open. No exposed secret, attacker-controlled injection path, authentication surface, state-changing API, public source map, or detailed error disclosure was confirmed.

## Scope, Method, and Threat Boundaries

### Scope

- Inspected all application routes: `/` and `/video-player-lab`.
- Inspected unknown-route handling with `/security-audit-nonexistent-019fae43`.
- Inspected React/TypeScript source, generated route tree, public SVG assets, Vite/TanStack Start configuration, Cloudflare Worker configuration, CI deployment workflow, existing production build artifacts, and live SSR/client assets.
- Checked OWASP-relevant browser and application concerns: transport enforcement, CSP, clickjacking, MIME sniffing, referrer and permissions policy, XSS/DOM XSS, URL handling, storage, cookies, CSRF relevance, outbound requests, `postMessage`, third-party scripts, source maps, secret patterns, error disclosure, CORS, service workers, and active SVG content.

### Method

- Read-only repository searches traced risky sources and sinks rather than treating string matches as vulnerabilities.
- Passive production GET/HEAD requests checked HTTPS and HTTP routes, response headers, SSR output, unknown and malformed paths, static assets, source-map URLs, cookies, CORS behavior, and query/path reflection.
- TLS certificate inspection used SNI for `m0code.com`.
- High-confidence secret-pattern scans covered tracked app/config/public files and the live HTML and JavaScript assets without printing any candidate value.
- No dependency installation, mutation, exploit with side effects, credential use, authenticated request, external-system change, or source/config/build change was performed.

### Threat Boundaries and Assumptions

- This is currently a public, unauthenticated portfolio. No app-owned API, login, privileged action, payment, upload, user-generated content, or state-changing form was found.
- External project, social, calendar, and email links cross to third-party origins; no third-party JavaScript executes in the portfolio origin.
- Current repository code and the live deployment are not byte-identical: live asset hashes differ from `dist/`, and the live logo implementation fetches then injects the SVG while the repository imports it at build time then injects it. Runtime findings therefore describe the live deployment observed; code findings describe the audited workspace.
- Cloudflare dashboard rules, WAF/bot settings, DNS controls, account audit logs, runtime variables, and secret values were outside the available repository and passive HTTP evidence.

## Confirmed Issues

### SEC-001 — Plaintext HTTP serves the complete application

- **ID:** SEC-001
- **Severity:** `P1 high`
- **Remediation status:** `Complete — verified in production` (2026-08-01). Historical evidence below describes the 2026-07-29 baseline.
- **Affected route/component/file:** `http://m0code.com/`, `http://m0code.com/video-player-lab`; custom-domain declaration at `wrangler.jsonc:11-16`.
- **Evidence:** On 2026-07-29, both HTTP routes returned `200 OK`, HTML, zero redirects, and an `http://` final URL. The equivalent HTTPS routes returned `200`, but HTTPS responses did not include `Strict-Transport-Security`.
- **Reproduction steps:**
  1. Run `curl -sS -o /dev/null -D - http://m0code.com/`.
  2. Repeat for `http://m0code.com/video-player-lab`.
  3. Observe `200 OK` instead of a permanent redirect.
  4. Run `curl -sS -o /dev/null -D - https://m0code.com/` and observe no HSTS header.
- **User/business impact:** A user following or typing an HTTP URL can receive the site without transport confidentiality or integrity. An on-path attacker can alter portfolio content, replace project links, inject script, or impersonate the site before the user reaches HTTPS. This is an OWASP cryptographic/transport protection failure even though the current site has no login.
- **Likely root cause:** Cloudflare “Always Use HTTPS” or an equivalent redirect rule is not enabled, and the Worker/config contains no HTTP-to-HTTPS enforcement. HSTS has not been staged.
- **Recommended improvement:** First enforce a single `301` or `308` redirect from every HTTP path to the identical HTTPS path and query. After confirming HTTPS coverage for the apex and all intended subdomains, stage HSTS with a short `max-age`, monitor, then increase deliberately. Add `includeSubDomains` only after every subdomain is HTTPS-ready; consider preload only after its operational requirements are accepted.
- **Safer alternatives/tradeoffs:** A Cloudflare edge redirect is simpler and applies before Worker execution; Worker-level redirects offer repository visibility but can be bypassed by other routes/configurations. Do not begin with a long-lived/preloaded HSTS policy: HSTS is sticky and can cause outages on unprepared subdomains.
- **Estimated effort:** Small, 1–3 hours plus staged observation time.
- **Dependencies:** Cloudflare zone access; inventory and HTTPS validation of `*.m0code.com`; coordination with deployment scope 13.
- **Objective verification method:** `curl -IL http://m0code.com/<each-route>` must show exactly one permanent redirect to the same HTTPS path/query and no HTTP `200`. HTTPS responses must remain valid. After staged rollout, `curl -sSI https://m0code.com/` must show the approved HSTS value, and every included subdomain must pass HTTPS monitoring.
- **Remediation evidence:** Active Cloudflare rule `68b2d9da04134d4e9aef99e85002e36c` returns a query-preserving `308` for HTML, missing paths, POST, JS, and MP4 requests. Active rule `1bf3a525052b4554b7060662c14b2f8d` sets HTTPS-only, apex-only `Strict-Transport-Security: max-age=300`; `includeSubDomains` and preload are not enabled. HTTPS `200`, `404`, JS, and MP4 probes carry the approved header, while cache-busted HTTP redirects omit it.

### SEC-002 — No CSP or clickjacking protection on HTML responses

- **ID:** SEC-002
- **Severity:** `P2 medium`
- **Affected route/component/file:** `/`, `/video-player-lab`, and unknown-route HTML; document shell at `src/routes/__root.tsx:32-40`; no header policy is present in `wrangler.jsonc:1-16`.
- **Evidence:** Live responses for both valid routes and the tested 404 contained neither `Content-Security-Policy`, `Content-Security-Policy-Report-Only`, `X-Frame-Options`, nor a CSP `frame-ancestors` directive. The app can therefore be framed, and there is no browser-enforced allowlist limiting script, object, base, media, or frame sources. The SSR output contains one TanStack inline stream-barrier script and one same-origin module script, so a strict CSP needs an explicit nonce/hash strategy rather than a blanket policy copied from another app.
- **Reproduction steps:**
  1. Run `curl -sS -o /dev/null -D - https://m0code.com/`.
  2. Repeat for `/video-player-lab` and an unknown route.
  3. Search response headers for `Content-Security-Policy`, `Content-Security-Policy-Report-Only`, and `X-Frame-Options`; none are present.
  4. Inspect SSR HTML and observe the inline `$tsr-stream-barrier` script plus a same-origin module script.
- **User/business impact:** A future or supply-chain XSS defect has no CSP containment, and attackers can embed the portfolio in a deceptive parent page for UI redressing. The present public site has no sensitive action, which limits current clickjacking impact, but project/contact navigation can still be misrepresented.
- **Likely root cause:** Security headers are not configured in the application or visible edge configuration; the framework-generated inline bootstrap script has not been incorporated into a CSP design.
- **Recommended improvement:** Deploy CSP in report-only mode first, exercise both routes and all interactions, then enforce. Use a nonce or stable hash for the framework bootstrap script and keep `script-src` free of `unsafe-eval` and broad wildcards. Include at minimum `object-src 'none'`, `base-uri 'self'`, and `frame-ancestors 'none'` unless embedding is a documented requirement. Add `X-Frame-Options: DENY` as legacy defense where compatible.
- **Safer alternatives/tradeoffs:** If per-response nonces are impractical, a reviewed hash may cover a stable bootstrap script, but framework upgrades can change it. A meta CSP can constrain scripts, but cannot enforce `frame-ancestors` and cannot provide report-only rollout; edge response headers are preferred. Do not add broad `unsafe-inline` merely to avoid CSP work. Inline style attributes are used extensively, so style policy must be tested separately from script policy.
- **Estimated effort:** Medium, 1–2 engineering days plus report-only observation.
- **Dependencies:** TanStack Start SSR nonce/hash support; Cloudflare response-header control; route/interaction regression run; reporting endpoint or provider; deployment scope 13.
- **Objective verification method:** A CSP evaluator must report no high-severity policy weakness. Production responses must include enforced CSP and frame protection. Automated browser tests across both routes must emit zero CSP violations after exercising logo motion, project navigation, media modals, video controls, and error routes; external framing must be refused.

## Risks / Unverified

### SEC-R01 — Raw SVG insertion remains an audited injection sink

- **ID:** SEC-R01
- **Severity:** `P3 low`
- **Affected route/component/file:** `AnimatedLogo` at `src/components/brand/AnimatedLogo.tsx:5`, `29-35`, `72`, and `193-202`; source asset `public/brand/mo-mark-v3.svg:2-140`; live `/` route bundle.
- **Evidence:** The repository imports `/brand/mo-mark-v3.svg?raw`, rewrites IDs with regular expressions, then passes the resulting string to `dangerouslySetInnerHTML`. The live deployment instead fetches the same same-origin SVG and passes transformed text to the same React sink. The audited SVG contains no `<script>`, event-handler attributes, `foreignObject`, active external reference, or `javascript:`/HTML data URL. No URL, storage, message, API, or user input reaches the sink, so exploitable XSS is **not confirmed**.
- **Reproduction steps:**
  1. Inspect the cited `AnimatedLogo.tsx` lines.
  2. Search `public/brand/mo-mark-v3.svg` for active SVG constructs.
  3. Inspect the live route bundle and locate the same-origin SVG fetch followed by `dangerouslySetInnerHTML`.
- **User/business impact:** If the SVG content boundary later changes—from a CMS, upload, remote URL, compromised asset pipeline, or less-reviewed contributor path—active SVG markup could execute with the portfolio origin. Current exploitability requires a prior code/asset or delivery-pipeline compromise.
- **Likely root cause:** Granular SVG-node animation requires inline DOM access, and a raw string was chosen instead of a typed React SVG component.
- **Recommended improvement:** Keep this asset strictly build-time and first-party, and replace raw markup injection with a reviewed SVG React component when practical. If the sink must remain, centralize and document the trust invariant, reject active SVG constructs during validation, and include the sink in CSP/Trusted Types rollout.
- **Safer alternatives/tradeoffs:** Rendering the SVG through `<img>` removes the HTML sink but prevents direct descendant animation. A generated React component retains DOM animation and removes runtime HTML parsing at the cost of generated JSX maintenance. Sanitizing with a vetted SVG-capable sanitizer adds runtime/build complexity and is unnecessary only while the asset is guaranteed static and reviewed.
- **Estimated effort:** Small to medium, 0.5–1.5 days depending on animation migration.
- **Dependencies:** Design acceptance for animation behavior; build tooling for SVG-to-React conversion or a validation test; CSP/Trusted Types work from SEC-002.
- **Objective verification method:** Static search should show no raw-string HTML sink for the logo, or a test must prove the only accepted asset is the reviewed local SVG and rejects `script`, event handlers, `foreignObject`, external active references, and script-bearing URLs. The production CSP report must show no unreviewed Trusted Types violations.

## Opportunities

### SEC-O01 — Add explicit MIME, referrer, and capability policies

- **ID:** SEC-O01
- **Severity:** `P3 low`
- **Affected route/component/file:** All HTML routes; no policy is visible in `wrangler.jsonc:1-16` or production headers.
- **Evidence:** Valid-route and 404 responses omit `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. Current same-origin scripts and media use correct MIME types, and all audited external `_blank` links use `rel="noreferrer"`, so no direct exploit was demonstrated.
- **Reproduction steps:** Request each HTML route with `curl -sS -o /dev/null -D - https://m0code.com/<route>` and inspect the response headers.
- **User/business impact:** The site relies on browser defaults rather than an explicit origin-wide policy. That leaves more room for future MIME confusion, unintended referrer disclosure, or unnecessary access to browser capabilities after new code or third-party content is added.
- **Likely root cause:** No centralized edge header baseline exists.
- **Recommended improvement:** Add `X-Content-Type-Options: nosniff`, an explicit privacy-appropriate `Referrer-Policy` such as `strict-origin-when-cross-origin` or stricter, and a minimal `Permissions-Policy` that disables capabilities the portfolio does not use.
- **Safer alternatives/tradeoffs:** A very restrictive permissions policy is appropriate now but must be reviewed before adding camera, microphone, geolocation, fullscreen, or embedded third-party features. A stricter `no-referrer` policy improves privacy but removes referral attribution. Avoid adding cross-origin isolation headers unless a feature requires them because they can break external integrations.
- **Estimated effort:** Small, 1–3 hours plus route verification.
- **Dependencies:** Cloudflare response-header control; feature inventory; deployment scope 13.
- **Objective verification method:** All HTML responses, including 404s, expose the approved exact header values; MIME-type tests and all current external links/media continue to work.

### SEC-O02 — Publish a coordinated disclosure contact

- **ID:** SEC-O02
- **Severity:** `P3 low`
- **Affected route/component/file:** `/.well-known/security.txt`; no corresponding file exists under `public/`.
- **Evidence:** `GET https://m0code.com/.well-known/security.txt` returned `404` on 2026-07-29.
- **Reproduction steps:** Run `curl -i https://m0code.com/.well-known/security.txt`.
- **User/business impact:** A researcher who finds a vulnerability has no standardized security-reporting channel or disclosure expectations, increasing the chance of delayed, misrouted, or public disclosure.
- **Likely root cause:** A security contact policy has not yet been published.
- **Recommended improvement:** Publish an RFC 9116-compatible file with a monitored `Contact`, future `Expires`, preferred languages, canonical URL, and policy/encryption links if maintained.
- **Safer alternatives/tradeoffs:** A dedicated security mailbox is clearer than a personal address but requires monitoring and spam handling. Do not promise response timelines or rewards that cannot be sustained.
- **Estimated effort:** Small, under 1 hour plus operational ownership.
- **Dependencies:** A monitored reporting channel and owner; legal/communications approval if a disclosure policy is linked.
- **Objective verification method:** The well-known URL returns `200`, `text/plain`, passes an RFC 9116 validator, has a future expiry, and the contact channel is tested periodically.

## False Positives

- **`dangerouslySetInnerHTML` match:** Not reported as confirmed XSS. Both audited implementations consume the fixed first-party logo asset, and the current asset has no active content. It remains SEC-R01 because the sink changes severity if that trust boundary changes.
- **Router Web Storage strings:** The live framework bundle uses `sessionStorage` for TanStack scroll restoration and reload bookkeeping. No session identifier, JWT, bearer token, PII, or app auth state is stored; the app has no auth surface.
- **Cloudflare account identifier:** The Worker config and workflow include an account identifier. This identifier is not an authentication secret; no token value was found in tracked files. The workflow correctly references the deployment token through GitHub Secrets without exposing it.
- **Dynamic `href`/`src` JSX props:** Values come from local constants and project data, not URL/query/storage/messages. External links are HTTPS (or intentional `mailto:`), and audited `_blank` links use `rel="noreferrer"`.
- **SVG `<style>` matches:** A few standalone component-review SVGs contain CSS but no active script/event-handler constructs. The injected production logo asset is `mo-mark-v3.svg`, which did not contain those active constructs.

## Passed Checks

- **Route/status handling:** `/` and `/video-player-lab` returned `200`; the unique unknown route returned a generic `404` with no stack, filesystem path, dependency path, exception detail, or internal host.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Security-surface change:** `/video-player-lab` and its client bundle are absent from production, reducing the public route surface without adding packages, scripts, configuration, secrets, or external calls.
- **Verification:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; the retired path is a non-soft `404`, and the deployed build uses the lab-free asset set. Existing site-wide transport and header findings remain open for `/` and error responses.
- **Tracking result:** historical lab route references are superseded for the deployed release; no broader security finding is closed by this route removal.
- **Malformed paths:** Traversal-like, NUL-encoded, and invalid UTF-8 paths returned `400` rather than application content or a detailed error.
- **SSR escaping/reflection:** A unique query/path marker containing encoded angle brackets was not reflected on either valid route or the 404 response. No application query/hash/route-parameter reader exists in source.
- **XSS source/sink trace:** No attacker-controlled source reaches HTML/URL sinks. No `eval`, `new Function`, string timer, `document.write`, `insertAdjacentHTML`, `DOMParser`, or string event-handler assignment exists in app source.
- **Secrets:** High-confidence scans found zero private keys or common provider-token formats in tracked app/config/public files and live HTML/JavaScript. No client environment-variable access or public runtime config was found. No candidate secret value is reproduced in this report.
- **Third-party execution:** Production HTML loads only same-origin scripts/styles. No tag manager, analytics, ad, CDN script, dynamic third-party script loader, or third-party iframe was found.
- **Outbound network:** Current source has no `fetch`, XHR, WebSocket, EventSource, Axios, credentialed request, Authorization header, or user-controlled destination. The live logo fetch is fixed to a same-origin asset.
- **Authentication/CSRF:** No authentication, cookies, state-changing API, or form submission exists. Live route responses set no cookies; CSRF and frontend authorization are therefore not applicable to the observed app.
- **Cross-window messaging:** No application `postMessage` sender/receiver exists. The production scheduler’s internal `MessageChannel` use is not a cross-origin message handler.
- **External-window safety:** All audited `_blank` links use `rel="noreferrer"`, which also isolates `window.opener` in modern browsers.
- **CORS:** Sending an untrusted `Origin` to the HTML routes did not produce an `Access-Control-Allow-Origin` grant or credential header.
- **Source maps:** Existing `dist/client` contains no `.map` files; both tested live JavaScript `.map` URLs returned `404`; live JavaScript has no trailing source-map reference.
- **TLS endpoint:** HTTPS certificate verification succeeded; the certificate covers `m0code.com` and `*.m0code.com`, is valid from 2026-07-28 through 2026-10-26, and TLS 1.2 and 1.3 sessions negotiated successfully.
- **SVG asset review:** The injected `mo-mark-v3.svg` contains no script, event handler, `foreignObject`, iframe, entity declaration, external HTTP reference, or script-bearing URL.
- **Build posture:** Audited `dist` JavaScript is minified and does not expose source maps. CI uses a frozen Bun lockfile, read-only repository permission, a pinned Wrangler CLI version, type-checking, a production build, and dry-run validation before deploy.

## Not Tested

- Interactive browser runtime was unavailable after the documented connection check; therefore DevTools-observed console events, live DOM mutation, actual storage values, framing in a browser, and CSP report collection could not be independently exercised. Passive HTTP and repository/bundle evidence was used instead.
- No deterministic safe `/500` route exists. A 500 was not induced through fault injection; only normal 404 and malformed-request 400 behavior were tested.
- During the original audit, Cloudflare dashboard configuration, WAF/bot rules, zone TLS minimum, “Always Use HTTPS,” certificate renewal alerts, DNSSEC, access logs, account roles, and remote Worker variables/secrets were not accessible. ITEM-02 later inspected only the Redirect Rules, Response Header Transform Rules, and managed-HSTS controls needed for its approved scope.
- Dependency advisories, package provenance, transitive supply chain, and licensing are intentionally owned by specialist scope 04; no networked package audit or install was run here.
- Authenticated attacks, CSRF, IDOR, broken access control, file upload, SSRF, command injection, SQL/NoSQL injection, and rate limiting are not applicable to the repository surface found; no backend/API endpoints were discovered.
- Active penetration testing, broad fuzzing, denial-of-service/load testing, WAF evasion, third-party target testing, and state-changing external interactions were excluded by the safe read-only boundary.
- Production-to-commit provenance could not be established from passive evidence because live asset hashes and the live logo implementation differ from the current workspace/`dist`; deployment and release attestation belong to scopes 13 and 14.

## Implementation tracking — ITEM-02

- **Status:** `Complete — verified in production` (2026-08-01).
- **Security result:** `SEC-001` is closed. Every sampled HTTP surface redirects once with `308` and preserves path/query/method semantics; the approved HTTPS-only apex HSTS canary is `max-age=300` with no subdomain or preload commitment.
- **Regression result:** HTTPS `/` remains `200`, the removed lab remains a true `404`, the current JS and Orgo MP4 remain `200`, TLS 1.2/1.3 negotiate, and the retained video plays at `readyState=4`, duration `4.534`, `error=null`, with no browser console errors/warnings.
- **Open follow-ups:** increase HSTS duration only after an observation window and explicit approval; CSP, clickjacking, `nosniff`, referrer/permissions policy, and the separate zone minimum-TLS finding remain open.
