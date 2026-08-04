# 15 — Content, links, assets, legal, and privacy

Audit date: 2026-07-29
Scope: repository source, existing `dist/`, and passive production checks of `https://m0code.com`
Disposition: evidence and recommendations only; no legal conclusions and no source, dependency, configuration, Git, or external-system changes

## Scope and method

- Read all route and visible-content source, portfolio data, captions, alt text, link definitions, public assets, existing client/server build output, and relevant deployment headers.
- Enumerated all 117 non-`.DS_Store` files under `public/`; checked existence, byte identity in `dist/client`, file signatures, dimensions for raster images, exact duplicates, source references, dormant candidates, and production `HEAD` status.
- Used passive `GET`/`HEAD`, redirect following, DNS lookup, and response-title inspection for internal and external URLs. No forms, calendar actions, emails, messages, downloads, authentication, or mutations were attempted.
- Inspected production SSR for visible copy, links, media references, third-party resources, cookies, and the 404 response.
- Browser control was unavailable (`agent.browsers.list()` returned `[]`). Browser-only link behavior and visual review are explicitly unverified. HTTP bot blocking is not classified as a broken link.
- Success criteria: identify visible and dormant content; account for links and public assets; separate confirmed defects from risks/opportunities/false positives; document privacy/legal facts without inferring legal obligations; give an objective verification for every recommendation.

## Content coverage matrix

| Surface | Content inventoried | State | Evidence/result |
|---|---|---|---|
| `/` identity/contact | MO mark, “Product Engineer,” bio, portrait reveal, Schedule a call, X, email, GitHub | Visible | `src/components/v14-exploration-lab/V14ExplorationLab.tsx:10-24,107-129,322-376`; present in production SSR |
| `/` project stories | Orgo (5 chapters), The Good Invoice (5), Lumen (7), Selected Experiments (15: Bits n Pixels 3, Stepper 4, Folders 2, Glazed 5, MO identity 1) | Visible | `CrossAxisProjectRail.tsx:94-386`; 32 chapters present in production SSR |
| Project descriptions/data | Good Invoice, Lumen, Calm AI Studio, Bits n Pixels, Glazed, Folders, Orgo, Stepper | One dormant | `portfolio-data.ts:35-320`; Calm AI Studio is defined but not included in `STORIES` |
| Collaboration credits | Fay website and X credit on Good Invoice, Bits n Pixels, and Glazed | Visible | `portfolio-data.ts:38-43,131-136,169-174`; rendering at `CrossAxisProjectRail.tsx:521-548,829-856` |
| `/video-player-lab` | Ten named progress-motion variants, Orgo motion study, back-home link | Public but unlinked from `/` | `src/components/video-player-lab/VideoPlayerLab.tsx:6-57,196-264`; production HTTP 200 |
| Unknown route | Bare “Not Found” response | Visible on error | Production `GET /prelaunch-content-audit-nonexistent` returned 404 and only `<p>Not Found</p>` |
| Legal/privacy content | Privacy, terms, cookies, legal, copyright-owner disclosure | Absent | No source content/routes; `/privacy`, `/privacy-policy`, `/terms`, `/terms-of-service`, `/legal`, `/cookies` all returned 404 |

## Link coverage matrix

| Link set | Source/exposure | Passive result on 2026-07-29 |
|---|---|---|
| `/` | Logo and lab back link | 200 |
| `/video-player-lab` | Direct route only; not linked from `/` | 200 |
| `mailto:dev.mo.ibrahim@gmail.com` | Visible contact link | Syntax valid and accessible name present; delivery/inbox ownership not tested |
| `https://cal.com/mo-c0de/30min` | Visible CTA | 200; title identified “30 Min Meeting \| Mo Ibrahim \| Cal.com” |
| `https://github.com/MoIbrahim10` | Visible social link | 200; title identifies Mo Ibrahim |
| `https://x.com/m0code` | Visible social link | 200 HTTP; browser/profile interaction unverified |
| `https://faydakrouri.com/` | Visible repeated collaborator credit | 200; title “Fay \| Product designer” |
| `https://x.com/faydesignsstuff` | Visible repeated collaborator credit | 200 HTTP; browser/profile interaction unverified |
| `https://thegoodinvoice.com/` | Visible project link | 200 |
| `https://lumen.m0code.com/` | Visible project link | 200 |
| `https://orgo.m0code.com/en/` | Visible project link | 200 |
| `https://github.com/MoIbrahim10/the-good-invoice` | Dormant because the live URL takes precedence | 200 |
| `https://bitsnpixels.co` | Dormant because Selected Experiments suppresses project links | DNS `NXDOMAIN`; confirmed unusable as stored |
| `https://github.com/MoIbrahim10/calm-ai-studio` | Dormant project fallback | 404 to unauthenticated GET |
| `https://github.com/MoIbrahim10/bitsnpixels` | Dormant | 404 to unauthenticated GET |
| `https://github.com/MoIbrahim10/glazed` | Dormant | 404 to unauthenticated GET |
| `https://github.com/MoIbrahim10/orgo` | Dormant because live URL takes precedence | 404 to unauthenticated GET |
| `https://glaze.design/` | Dormant because Selected Experiments suppresses project links | DNS resolved, but two passive requests timed out; not classified broken without browser evidence |

All visible HTTPS links render with `target="_blank"` and `rel="noreferrer"` where applicable. No insecure `http://` content link was found.

## Asset coverage matrix

| Category | Repository count | Existing build | Production | Notes |
|---|---:|---|---|---|
| SVG | 11 | All present, byte-identical | Included in 103/117 successful URLs | `mo-mark-v3.svg` is the active mark |
| PNG | 41 | All present, byte-identical | Included in 103/117 successful URLs | Two `.png` files contain JPEG bytes; see C15-005 |
| JPEG | 1 | Present, byte-identical | 200 | Folders fallback |
| WebP | 47 | All present, byte-identical | 14 current URLs return 404; see C15-001 | Includes six optimized avatars and video posters |
| MP4 | 17 | All present, byte-identical | 16 return 200; current MO identity video returns 404 | All recognized as ISO Media by `file`; detailed codec/duration probing unavailable |
| Total | 117 / about 35 MiB | 117/117, byte-identical | 103 HTTP 200; 14 HTTP 404 | Existing `dist/client` is about 40 MiB including bundles |

Current source-reference analysis, including `-poster.webp` paths derived from `.mp4`, found 34 unreferenced public files totaling 15,984,866 bytes. They are candidates, not approved deletions:

- Seven legacy/full-size portrait PNGs: six numbered portraits plus `mo-avatar-studio-desk.png`.
- Ten brand construction/review files: six `brand/components/*.svg`, three review/version marks, and inactive `mo-mark.svg`.
- `portfolio/egyptian-frame.webp`.
- Dormant hero/detail groups: Bits n Pixels (3), root Calm AI Studio duplicate (1), Glazed (3), Good Invoice (2), Orgo (3), Stepper (4).

Exact-byte duplicate pairs:

- `public/portfolio/projects/calm-ai-studio.png` and `public/portfolio/projects/calm-ai-studio/hero.png`.
- `public/portfolio/projects/bitsnpixels/detail-01.webp` and `public/portfolio/projects/glazed/detail-01.webp`.

## Legal/privacy coverage matrix

| Check | Confirmed fact | Interpretation boundary |
|---|---|---|
| First-party collection | No forms, account surface, payment flow, comments, or uploads found | Does not prove that edge/provider logs collect nothing |
| Cookies | No `Set-Cookie` on `/` or `/video-player-lab`; no cookie/consent code found | A banner is not automatically required; applicability depends on actual processing and law |
| Analytics/trackers | No analytics or advertising script found; SSR scripts/assets are same-origin | Cloudflare operational processing remains a data-map question |
| Network reporting | Production emits Cloudflare `Report-To` and `NEL`, endpoint `a.nel.cloudflare.com`, `max_age=604800` | Whether notice/contract language is required needs owner/counsel review |
| Third parties | User-initiated links to Cal.com, X, GitHub, collaborator, and project domains | Destination policies govern after navigation; link disclosure is a product/counsel choice |
| Legal pages | No privacy/terms/cookies/legal route or footer notice | Absence is confirmed; requirement is not |
| Rights/licensing records | No repository-level asset rights register, license, notice, releases, or permission records | Absence of repository evidence does not prove lack of rights |
| Attribution | Fay is credited on three projects | Role split, approval, and other contributor/client rights are not documented in this repository |

## Confirmed Issues

### C15-001 — Production asset set is out of sync with the current repository/build

- **Severity:** P1 high
- **Remediation status:** `Complete — production generated assets/brand/media match the retained approved artifact` (2026-08-01).
- **Affected:** `/`; current `V14ExplorationLab.tsx:17-24`; `CrossAxisProjectRail.tsx:861-990`; `public/avatar/*-640.webp`; six current video posters; MO identity poster/video
- **Evidence:** All 117 public files exist byte-identically in `dist/client`, but production `HEAD` returned 404 for 14: six `*-640.webp` avatars; Good Invoice `editor-workflow-poster.webp` and `feedback-links-poster.webp`; Lumen `composer-controls-poster.webp`, `model-selector-poster.webp`, `prompt-shortcuts-poster.webp`; Orgo `walkthrough-poster.webp`; identity poster and video. Production SSR still references old 1254px PNG portraits, while current source/build references 640px WebP portraits.
- **Reproduction:** Compare `find public -type f` with `dist/client`; `HEAD https://m0code.com/avatar/mo-avatar-portrait-01-640.webp`; fetch `/` and inspect portrait sources.
- **User/business impact:** The checked-in release has not been validated as the production release. A non-atomic or mismatched code/assets deployment can produce missing portraits/posters/video and undermines launch evidence.
- **Likely root cause:** Production is an older or partial deployment whose static asset set does not match current server/client bundles.
- **Recommended improvement:** Treat server bundles and `dist/client` as one immutable release; deploy atomically, then compare a release manifest/hash and smoke-test every referenced asset.
- **Safer alternatives/tradeoffs:** Keep the currently coherent older production release until the complete new artifact is approved; alternatively version asset URLs. Keeping old production avoids partial breakage but does not validate current work.
- **Estimated effort:** S, 2–4 hours including verification.
- **Dependencies:** Deployment owner, release/version identifier, scopes 13 and 14.
- **Objective verification:** Production HTML/JS release ID matches the approved artifact; all 117 expected asset URLs return correct non-HTML media with 200; a clean browser run has zero media 404s.

### C15-002 — Stored Bits n Pixels destination has no DNS record

- **Severity:** P2 medium
- **Affected:** Dormant project link; `src/components/v14-exploration-lab/portfolio-data.ts:140`
- **Evidence:** `dig bitsnpixels.co A` and `AAAA` returned `NXDOMAIN`; passive `curl` could not resolve the host. The link is currently suppressed by `CrossAxisProjectRail.tsx:521-548`, so it is not a live clickable defect today.
- **Reproduction:** Resolve or GET `https://bitsnpixels.co`.
- **User/business impact:** Re-exposing the project link would send visitors to a dead domain and reduce portfolio credibility.
- **Likely root cause:** Expired/removed DNS or stale portfolio data.
- **Recommended improvement:** Confirm the intended canonical destination with the owner/collaborator before exposing or retaining it.
- **Safer alternatives/tradeoffs:** Keep it hidden; point to an approved case-study page; or omit a destination. A replacement must not be guessed.
- **Estimated effort:** XS, under 1 hour after owner confirmation.
- **Dependencies:** Domain owner/collaborator approval.
- **Objective verification:** Public DNS resolves and browser navigation reaches the approved project, or the stale URL is absent from release data.

### C15-003 — The production 404 offers no recovery path

- **Severity:** P2 medium
- **Affected:** Unknown routes; root route lacks a custom not-found surface (`src/routes/__root.tsx:10-44`)
- **Evidence:** `GET /prelaunch-content-audit-nonexistent` returned correct HTTP 404 but only `<p>Not Found</p>`, with no home link, explanation, search, or contact route.
- **Reproduction:** Open any nonexistent path on `m0code.com`.
- **User/business impact:** Visitors following stale links cannot recover to the portfolio, increasing abandonment and making the site feel unfinished.
- **Likely root cause:** Framework default not-found content is being used.
- **Recommended improvement:** Provide concise branded 404 copy with a clearly labeled route home and optional contact link.
- **Safer alternatives/tradeoffs:** A minimal “Page not found — return home” page is sufficient; avoid redirecting all 404s to `/`, which hides broken URLs.
- **Estimated effort:** XS–S, 1–2 hours.
- **Dependencies:** Approved copy/design; functional and SEO verification.
- **Objective verification:** Unknown URLs remain HTTP 404 and expose a keyboard-accessible, working home link plus approved recovery copy.

### C15-004 — One project identity is internally inconsistent

- **Severity:** P3 low
- **Affected:** Glazed/Glaze content; `portfolio-data.ts:177-217`; `CrossAxisProjectRail.tsx:331-365`
- **Evidence:** Project title/labels use “Glazed,” while the domain is `glaze.design` and multiple alt/caption strings say “Glaze studio.” Production SSR displays both forms within the same project group.
- **Reproduction:** Navigate to Selected Experiments and compare project label with Glaze captions, or search source for `Glaze` and `Glazed`.
- **User/business impact:** Naming inconsistency can confuse attribution and weaken professional polish/search consistency.
- **Likely root cause:** Copy was assembled from repository name, domain brand, and earlier captions without one canonical naming decision.
- **Recommended improvement:** Ask the project owner/collaborator which public brand name is correct, then apply it consistently to title, captions, alt text, and destination.
- **Safer alternatives/tradeoffs:** Preserve exact product UI wording inside descriptive alt text if the interface itself uses a different historical name; document that exception.
- **Estimated effort:** XS, under 1 hour after approval.
- **Dependencies:** Owner/collaborator confirmation.
- **Objective verification:** An approved naming sheet and a case-sensitive source/SSR search show only the canonical form or documented exceptions.

### C15-005 — Two `.png` assets contain JPEG data

- **Severity:** P3 low
- **Affected:** Dormant Calm AI Studio assets `public/portfolio/projects/calm-ai-studio.png` and `public/portfolio/projects/calm-ai-studio/hero.png`
- **Evidence:** `file` identifies both as JFIF JPEG despite the `.png` extension; their SHA-1 hashes are identical.
- **Reproduction:** Run `file` and `shasum` on both paths.
- **User/business impact:** Extension/content mismatch can confuse asset tooling, MIME handling, optimizers, and future editors; duplicate storage obscures the canonical asset.
- **Likely root cause:** A JPEG was saved or renamed with `.png`, then copied to a second location.
- **Recommended improvement:** After deciding whether Calm AI Studio will ship, choose one canonical correctly named/encoded asset and update references in an authorized implementation.
- **Safer alternatives/tradeoffs:** Re-encode as real PNG only if transparency/lossless quality is needed; otherwise use JPEG/WebP and preserve a redirect only if the old public URL is already relied upon.
- **Estimated effort:** XS–S, 1–2 hours.
- **Dependencies:** Content-owner decision and authorized asset migration.
- **Objective verification:** File signature, extension, and served `Content-Type` agree; only the approved canonical path is referenced; visual comparison passes.

## Risks / Unverified

### R15-001 — Asset ownership, licenses, releases, and public-display permissions are not evidenced in-repository

- **Severity:** P1 high
- **Affected:** All 117 public assets; screenshots/videos of eight projects; third-party marks named in `CrossAxisProjectRail.tsx:116`; portrait imagery; collaborator work
- **Evidence:** No repository-level LICENSE/NOTICE, rights register, source/owner/license metadata, model release, client permission, or asset provenance record was found. Screenshots visibly/documentarily include Figma, X, Apple, Chrome, Framer, project brands, and collaborator work.
- **Reproduction:** Search repository files for license, notice, credit, permission, release, and provenance documentation; only design notes and code dependency licenses outside the product surface appear.
- **User/business impact:** If any asset or case study lacks permission, launch could create takedown, confidentiality, trademark, relationship, or reputational risk.
- **Likely root cause:** Rights evidence is maintained informally or outside the repository, or has not yet been assembled.
- **Recommended improvement:** Owner/counsel should create an asset and case-study rights register: creator/source, client/project, license/permission, release scope, attribution requirement, approval date, and evidence location.
- **Safer alternatives/tradeoffs:** Temporarily withhold uncertain projects/assets; use redacted or self-created substitutes; private-review the portfolio. These reduce launch content but lower uncertainty.
- **Estimated effort:** M, 1–3 days plus external responses.
- **Dependencies:** Site owner, Fay/other collaborators, any clients/employers, counsel where appropriate.
- **Objective verification:** Every published asset/project maps to retained permission/license evidence and required attribution; owner/counsel signs off on unresolved categories.

### R15-002 — Privacy-notice applicability is unresolved while Cloudflare network reporting is enabled

- **Severity:** P2 medium
- **Affected:** All production routes; absent privacy/legal routes; Cloudflare response headers
- **Evidence:** No privacy route or disclosure exists; no cookies, forms, or analytics were found. Production sends `Report-To`/`NEL` with an `a.nel.cloudflare.com` endpoint and seven-day `max_age`.
- **Reproduction:** Inspect headers for `/`; request `/privacy` and `/privacy-policy` (both 404); search source for privacy/cookie/analytics/consent.
- **User/business impact:** If operational logs/reporting process personal data or the audience/jurisdiction triggers notice duties, visitors may lack required transparency. The audit does not determine that a notice is legally required.
- **Likely root cause:** Static-portfolio assumptions were made without a documented data map/provider review.
- **Recommended improvement:** Document data flows and retention for Cloudflare and linked services; ask counsel/owner which notice, controller/contact identity, rights language, and consent behavior are applicable.
- **Safer alternatives/tradeoffs:** Minimize/disable optional reporting and remain cookieless; if no non-essential cookies exist, avoid adding a consent banner solely for appearance. A simple accurate privacy notice is preferable to boilerplate.
- **Estimated effort:** S–M, 0.5–2 days excluding legal review.
- **Dependencies:** Cloudflare configuration owner, processing terms, audience/jurisdiction facts, counsel.
- **Objective verification:** Approved data map matches observed network/cookie behavior; any required notice is linked and accurate; automated clean-session checks confirm disclosed cookies/requests only.

### R15-003 — Project role, status, and attribution boundaries are too thin to independently substantiate

- **Severity:** P2 medium
- **Affected:** `portfolio-data.ts:35-320`; story descriptions/captions; collaboration credits
- **Evidence:** Projects receive one-sentence qualitative descriptions. Lumen, Calm AI Studio, and Orgo are explicitly called concepts, but other work does not state dates, Mo’s role, collaborator role split, production/concept status, or approved outcome evidence. Fay is credited, but repository evidence does not show approval or division of contribution.
- **Reproduction:** Read each `PortfolioProject` object and visible story title block.
- **User/business impact:** Prospective clients may over- or under-attribute the work, while collaborators/clients may disagree with implied ownership or project status.
- **Likely root cause:** Visual presentation was prioritized over case-study provenance.
- **Recommended improvement:** Obtain collaborator/client-approved role statements and status labels for every project; distinguish concept, shipped product, studio collaboration, and individual contribution.
- **Safer alternatives/tradeoffs:** Use modest, factual labels without metrics; remove uncertain claims until approved. Avoid inventing outcomes or percentages.
- **Estimated effort:** M, 1–3 days plus approvals.
- **Dependencies:** Owner project records, collaborator/client review.
- **Objective verification:** Each published project has an approved role/status/source record and matching public copy; no unsupported outcome claim remains.

### R15-004 — An internal design laboratory is publicly reachable without an explicit launch decision

- **Severity:** P2 medium
- **Affected:** `/video-player-lab`; `src/routes/video-player-lab.tsx:5-7`; `VideoPlayerLab.tsx:196-264`
- **Evidence:** Production returns 200 for the route; it is absent from homepage navigation and presents ten design variants rather than portfolio case-study content.
- **Reproduction:** Directly request `/video-player-lab`; inspect homepage links and confirm none point to it.
- **User/business impact:** Search engines, shared URLs, or curious visitors can encounter internal exploration content that may dilute the intended portfolio narrative.
- **Likely root cause:** A development/exploration route was shipped with the application.
- **Recommended improvement:** Make an explicit product-owner decision: promote it with context, keep it intentionally public as a lab, or exclude/protect it in an authorized change.
- **Safer alternatives/tradeoffs:** Add a clear “experimental lab” context and route home if it remains public; exclusion reduces content but avoids ambiguity.
- **Estimated effort:** XS–S, under 2 hours after decision.
- **Dependencies:** Product/content owner; SEO/deployment implementation if excluded.
- **Objective verification:** Route inventory documents the decision; production behavior and navigation/crawl policy match it.

### R15-005 — Dormant repository and Glaze destinations are not publicly verified

- **Severity:** P3 low
- **Affected:** `portfolio-data.ts:126,164,178,216,280`; dormant repository links and `https://glaze.design/`
- **Evidence:** Four GitHub repository URLs returned 404 unauthenticated; this may mean private/renamed rather than nonexistent. `glaze.design` resolved but timed out twice. These URLs are currently hidden by live-link precedence or Selected Experiments rendering.
- **Reproduction:** Passive unauthenticated GET to the stored URLs.
- **User/business impact:** Future content changes could expose private/dead/unavailable destinations.
- **Likely root cause:** Private repositories, renamed projects, transient host behavior, or stale data.
- **Recommended improvement:** Ask owners which destinations are intended to be public and remove/replace only after confirmation.
- **Safer alternatives/tradeoffs:** Keep hidden URLs out of public content data; use an approved case-study route instead of repository exposure.
- **Estimated effort:** XS, under 1 hour plus confirmation.
- **Dependencies:** Repository/project owners; browser availability for Glaze.
- **Objective verification:** Each retained public destination works in a clean browser without authentication, or the owner marks it intentionally private and it is never rendered.

### R15-006 — Cross-project exact duplicate may be an intentional placeholder or a misfiled asset

- **Severity:** P3 low
- **Affected:** Dormant `bitsnpixels/detail-01.webp` and `glazed/detail-01.webp`
- **Evidence:** Exact SHA-1 match across two different project directories; neither file is referenced by current source.
- **Reproduction:** `shasum` both files.
- **User/business impact:** If resurfaced, the wrong project image could misrepresent work or attribution.
- **Likely root cause:** Shared placeholder, copied export, or directory misclassification.
- **Recommended improvement:** Have the content owner compare against source project files and record whether reuse is intentional.
- **Safer alternatives/tradeoffs:** Keep both while provenance is checked; do not delete based on hash alone.
- **Estimated effort:** XS, under 1 hour.
- **Dependencies:** Original design/project files and owner confirmation.
- **Objective verification:** Rights register records intentional reuse, or each project contains the approved distinct asset.

## Opportunities

### O15-001 — Add concise, substantiated case-study context

- **Severity:** P2 medium
- **Affected:** All project story headers and captions
- **Evidence:** Current entries communicate aesthetic/feature summaries but omit role, timeframe, constraints, status, and verifiable result.
- **Reproduction:** Review `PortfolioProject` fields at `portfolio-data.ts:24-33`; no role/date/outcome fields or equivalent visible copy exist.
- **User/business impact:** Better context would help hiring/client readers understand Mo’s contribution without relying on inference.
- **Likely root cause:** Data model and composition prioritize media.
- **Recommended improvement:** Add only approved facts: role, collaborators, shipped/concept status, year, scope, and one verifiable outcome or learning.
- **Safer alternatives/tradeoffs:** Keep qualitative summaries where metrics are confidential; use “concept”/“prototype” explicitly rather than speculative impact.
- **Estimated effort:** M, 1–3 days of content work.
- **Dependencies:** Project records and collaborator/client approval.
- **Objective verification:** Content checklist is complete per project; every factual claim links internally to evidence/approval and survives owner review.

### O15-002 — Quarantine or archive 34 confirmed unreferenced public assets after release decisions

- **Severity:** P3 low
- **Affected:** The 34 files grouped in the asset matrix, totaling 15,984,866 bytes
- **Evidence:** No literal or derived current source reference was found. The six full-size portrait PNGs are still used by the older live release, demonstrating why immediate deletion would be unsafe.
- **Reproduction:** Compare source asset paths, derived MP4 poster paths, `public/`, current `dist/client`, and production SSR.
- **User/business impact:** A smaller public artifact reduces accidental disclosure, rights-review surface, repository noise, and deployment size.
- **Likely root cause:** Iterative design exports and prior deployment assets accumulated in `public/`.
- **Recommended improvement:** After production is aligned and provenance reviewed, move approved archives outside the public deploy root or remove them in a separately authorized change.
- **Safer alternatives/tradeoffs:** Maintain a documented allowlist; archive rather than delete. Keeping unused assets is safer for rollback but leaves them publicly addressable.
- **Estimated effort:** S–M, 0.5–1 day including visual/rollback verification.
- **Dependencies:** C15-001 resolution, rights review, rollback policy, explicit deletion authorization.
- **Objective verification:** Build/reference scan reports zero missing assets; approved public allowlist matches deploy output; rollback artifact remains available.

### O15-003 — Add automated content/link/asset governance

- **Severity:** P3 low
- **Affected:** Release process and portfolio content data
- **Evidence:** Current stale DNS, deployment drift, MIME mismatch, duplicates, and unverified rights are detectable mechanically but have no visible release gate.
- **Reproduction:** Repeat this audit’s DNS/HTTP, file-signature, reference, hash, and rights-register checks.
- **User/business impact:** A lightweight gate prevents regressions and reduces manual pre-launch effort.
- **Likely root cause:** No content-specific CI policy.
- **Recommended improvement:** Add a read-only release check for internal assets, approved external-link status, MIME signatures, duplicates requiring allowlist entries, and rights-register completeness.
- **Safer alternatives/tradeoffs:** Run it as a non-blocking scheduled report first; external sites can be flaky, so use retries and an allowlist rather than treating every timeout as failure.
- **Estimated effort:** M, 1–2 days.
- **Dependencies:** CI owner, rights-register format, scope 14.
- **Objective verification:** Fixture-backed checks distinguish 404/NXDOMAIN from timeout/bot blocking and block only approved severity classes.

## False positives

- The 14 production 404 asset URLs do **not** prove the current live UI is broken: production SSR is an older release that does not reference most of them. They prove release/artifact drift and make the current repository release unverified.
- X returned HTTP 200 and recognizable titles, but this does not prove that logged-out browser navigation/profile rendering works.
- The `glaze.design` timeout is not classified as broken because DNS resolves and no browser was available.
- GitHub 404s can represent private repositories; they are risks only if rendered as public destinations.
- Absence of a cookie banner is not itself a defect. No cookie or non-essential analytics behavior was observed.
- Empty `alt` on decorative portrait layers and the lab/home logo image is paired with surrounding accessible labels; it is not treated here as missing content.
- Exact duplicates are not automatically erroneous; shared originals, aliases, and rollback assets can be intentional.

## Passed checks

- `/` and `/video-player-lab` return 200; the unknown-route test returns a genuine 404 rather than a soft 200.
- Eight unique visible HTTPS destinations returned 200 in passive GET checks: Cal.com, Mo GitHub, Mo X, Fay site, Fay X, The Good Invoice, Lumen, and Orgo.
- Visible external anchors use HTTPS and `rel="noreferrer"`; no mixed-content link was found.
- The email link has a clear accessible name and syntactically valid address.
- All 117 repository public assets are present byte-identically in the existing client build; no checked-in asset is missing from `dist/client`.
- 103/117 checked-in asset URLs return 200 on production; all media referenced by the older production SSR returned 200 in the passive inventory.
- Raster files were recognized and dimensions were available; current project alt text and captions are generally specific rather than filename-based.
- All 17 MP4 files are recognized as ISO Media containers.
- No first-party form, cookie-setting response, analytics/advertising script, external font, or third-party embedded resource was found on the audited SSR responses.
- Fay receives visible collaborator credit and links on the projects where the data model assigns collaboration.
- No testimonial, numerical performance claim, client logo wall, affiliate disclosure, sponsorship claim, pricing, sale, or user-generated content was found on the portfolio surface.

## Not tested

- Browser clicks, visual layout, hover/modal behavior, social login walls, external-site rendering, and visual text inside images/videos: browser control was unavailable.
- Calendar booking, form submission, email delivery/inbox ownership, messaging, authentication, and any external write: intentionally prohibited.
- Screen-reader and WCAG behavior beyond content-source inspection: delegated to accessibility scope.
- Full video codec, frame dimensions, duration, audio, captions, and visual ownership review: `ffprobe` was unavailable and no media player/browser was available.
- Malware/reputation classification of external domains: only DNS, TLS/HTTP reachability, redirects, and titles were checked.
- Rights, licenses, NDAs, employment/client agreements, trademark permissions, model releases, and collaborator consent stored outside this repository.
- Jurisdiction-specific privacy, cookie, terms, copyright, or disclosure requirements. Owner/counsel must decide applicability from actual audience, processing, contracts, and business facts.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Disposition:** `R15-004` is complete for the deployed release because the public design laboratory was removed. Other content, link, ownership, licensing, attribution, legal, and privacy findings remain open.
- **Asset safety:** the shared Orgo walkthrough MP4 and poster were retained because the homepage viewer consumes them; both hashes match the pre-change baseline. No unrelated public asset was deleted.
- **Verification:** no lab source/build reference remains, the retired path returns `404`, and focused browser QA loaded the retained Orgo video without media or console errors.
- **Production evidence:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; the public route is `404`, and retained shared media passed live browser verification.

## Implementation tracking — ITEM-08

- **Status:** `Complete — verified in production` (2026-08-01).
- **Disposition:** `C15-003` is complete. The approved branded 404 explains the missing address and exposes one clearly labeled route home while preserving the hard `404`; it does not hide broken URLs behind a redirect.
- **Verification:** SSR, hydrated desktop/mobile, keyboard, and 200% text checks pass. The page introduces no form, tracking, third-party script, new external destination, legal claim, cookie, or personal-data flow.
- **Regression evidence:** homepage presentation and the retained Orgo video source remain unchanged in behavior; production playback reaches `readyState=4` and closes with no console/page errors.

## Implementation tracking — ITEM-09

- **Status:** `Complete for production asset-set parity` (2026-08-01).
- **Disposition:** `C15-001` is complete. CI now proves the deployed generated assets, brand, and retained Orgo media match the approved artifact. Rights, releases, attributions, legal policy, dormant-link decisions, and content-specific CI policy remain open.
- **Evidence:** release `87864fe…`/Cloudflare `3666f6f8…` passed exact live hashes for five generated assets, the brand mark, and Orgo MP4. The production modal played the unchanged MP4 without media or console errors.
