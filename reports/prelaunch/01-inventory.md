# 01 — Surface, Route, Component, State, and Asset Inventory

## Scope, method, environment

- Scope: repository `/Users/mo/Documents/porfolio`, existing untracked `dist/` artifact, and live `https://m0code.com`.
- Audit time: 2026-07-29, Africa/Cairo.
- Repository revision: `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a` (`✨ feat(portfolio): refine motion and media loading`).
- Runtime observed: Bun `1.3.10`, Node `v24.18.0`; TanStack React Start SSR, Vite, React, and a Cloudflare Worker entry.
- Read-only methods: source and generated-route inspection; file/reference/count/size checks; existing `dist/server/server.js` fetch-handler execution; live HTTP/SSR inspection with `curl`/Node `fetch`; internal and external destination checks.
- No build, install, source edit, dependency change, configuration change, commit, staging action, or external write was performed.
- Browser-based interaction was attempted through the supplied browser runtime, but no browser backend was available. Static/SSR/HTTP evidence is therefore separated from interaction coverage throughout this report.

### Success criteria used

1. Enumerate every declared route and its source, existing-artifact, and live status.
2. Cross-reference reachable components, content groups, interaction states, responsive modes, and assets.
3. Distinguish current source, the existing local artifact, and the deployed runtime.
4. Verify every statically declared or derived local asset exists without rebuilding.
5. Record live link/resource outcomes and explicitly identify everything not exercised.

## Coverage inventory

### Route and document inventory

| Surface | Source declaration | Existing artifact | Live evidence | Notes |
|---|---|---:|---:|---|
| Root document | `src/routes/__root.tsx:10-45` | SSR shell present | SSR shell present | Shared title, description, favicon, stylesheet, scripts |
| `/` | `src/routes/index.tsx:1-5` | `200`, 59,915-character SSR body | `200`, 46,515-character SSR body | Source renders `V14ExplorationLab`; deployed version differs from artifact |
| `/video-player-lab` | `src/routes/video-player-lab.tsx:1-7` | `200`, 6,280-character SSR body | `200`, 5,652-byte response | Ten player-style variants over one Orgo video |
| Unknown path | Router default; no custom declaration | `404`, generic `Not Found` | `404`, 1,217-byte generic `Not Found` | See INV-C02 |
| `/video-player-lab/` | No separate route | Not separately exercised | `307` to `/video-player-lab` | Normalized |
| `//video-player-lab` | No separate route | Not separately exercised | `308` to canonical path | Normalized |
| `http://m0code.com/` | Deployment surface, not source route | N/A | `200` over HTTP | Inventory fact; policy/redirect assessment belongs to deployment audit |
| `www.m0code.com` | Not declared in `wrangler.jsonc:10-15` | N/A | DNS resolution failed | Only apex custom domain is configured |

Generated routing evidence: `src/routeTree.gen.ts:11-31` and `:83-87` contain exactly `/` and `/video-player-lab`. Router-wide scroll restoration and intent preload are configured at `src/router.tsx:5-13`. No route loaders, route-level pending components, route-level error components, custom not-found component, or server route handlers were found.

### Reachable component tree

```text
RootDocument
├── / → V14ExplorationLab
│   └── HeroStage
│       ├── home link → AnimatedLogo
│       ├── MoReveal
│       ├── ContactActions
│       │   ├── Schedule call link
│       │   └── SocialLink ×3 → CutCornerButton
│       └── CrossAxisPresentationLab
│           └── CrossAxisProjectRail(presentation="editorial")
│               ├── BackgroundWipe
│               ├── ProjectStorySlide ×4
│               │   ├── StoryTitle / ProjectControls / StoryTopLinks
│               │   └── StoryMedia ×32
│               │       ├── DeferredPicture or ResilientVideo
│               │       └── full-screen trigger
│               ├── custom stable scrollbar
│               └── MediaViewer portal
│                   ├── DeferredPicture or ViewerVideo
│                   ├── play/pause + seek
│                   └── backdrop/Close/Escape dismissal
└── /video-player-lab → VideoPlayerLab
    ├── home link
    ├── variant tablist (10 tabs)
    └── PreviewPlayer
        ├── poster + video
        └── play/pause + seek
```

Primary definitions:

- `V14ExplorationLab`, `HeroStage`, contact/social controls, and portrait reveal: `src/components/v14-exploration-lab/V14ExplorationLab.tsx:38-379`.
- `CrossAxisPresentationLab`: `src/components/v14-exploration-lab/CrossAxisPresentationLab.tsx:1-10`.
- Project data: `src/components/v14-exploration-lab/portfolio-data.ts:1-320`.
- Story composition and all project-gallery interaction: `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:36-1856`.
- `AnimatedLogo`: `src/components/brand/AnimatedLogo.tsx:23-204`.
- Link/button primitive: `src/components/v14-exploration-lab/CutCornerButton.tsx:5-50`.
- Video laboratory: `src/components/video-player-lab/VideoPlayerLab.tsx:6-264`.

### Content and project inventory

| Group | Reachable content |
|---|---|
| Orgo | 5 chapters: 1 video, 4 images; live project link |
| The Good Invoice | 5 chapters: 2 videos, 3 images; live project link; collaborator links |
| Lumen | 7 chapters: 3 videos, 4 images; live project link |
| Selected Experiments | 15 chapters: Bits n Pixels (3 videos), Stepper (2 videos, 2 images), Folders (1 video, 1 image), Glazed (4 videos, 1 image), MO identity (1 video) |
| Total `/` | 4 horizontal stories, 32 gallery figures, 17 video chapters, 15 image chapters |
| Video Player Lab | 10 variants: Clean Line, Frame Ticks, Red Marker, Quiet Segments, Dual Track, Negative Reveal, Soft Exposure, Frame Count, Center Guide, Slate Cut |

`PORTFOLIO_PROJECTS` has eight records, but seven are composed into `STORIES`. `calm-ai-studio` (`portfolio-data.ts:113-128`) is not selected by `projectById` at `CrossAxisProjectRail.tsx:86-92` and has no current route or visible card. The MO identity chapter is media-only and is not a `PortfolioProject`.

`DetailPresentation` permits ten modes at `CrossAxisProjectRail.tsx:39-49`, while the only caller hard-codes `editorial` at `CrossAxisPresentationLab.tsx:7`. The CSS contains dormant rules for `archive`, `blueprint`, `catalog`, `cinema`, `ledger`, `mosaic`, `poster`, `split`, and `windows`; none has a route or state transition.

### State and interaction inventory

| Component/surface | State space and transitions |
|---|---|
| `MoReveal` | 6-avatar index; visible/hidden; `idle`/`out`/`under` deal phase; instant vs animated; pointer enter/leave, focus/blur, click; reduced motion (`V14ExplorationLab.tsx:133-317`) |
| `AnimatedLogo` | idle/pulsing guard; pointer hover and click; normal/reduced-motion animation (`AnimatedLogo.tsx:72-202`) |
| Project rail | active story 0-3; direction -1/+1; keyboard/pointer/scroll source; horizontal swipe/scroll snap; vertical scroll; draggable/keyboard custom scrollbar; mobile-height synchronization (`CrossAxisProjectRail.tsx:1413-1856`) |
| Story media | eager/queued/requested; near viewport; prewarm; constrained-connection delay; pointer pan/focus; full-screen open (`CrossAxisProjectRail.tsx:585-859`) |
| Deferred image | `queued` → `loading` → `ready` or `error`; placeholder/fallback/WebP; eager/lazy and fetch-priority modes (`CrossAxisProjectRail.tsx:585-659`) |
| Inline video | in/out of viewport; ready/not ready; playing/idle; autoplay blocked; failed poster fallback; reduced motion (`CrossAxisProjectRail.tsx:861-994`) |
| Media viewer | closed or one of 32 selections; instant/animated; modal body lock and sibling inertness; focus trap; Escape, backdrop, and Close; focus restoration (`CrossAxisProjectRail.tsx:1003-1310`, `:1748-1761`, `:1845-1853`) |
| Viewer video | play/pause, current time, duration, seek, loop, error-to-paused (`CrossAxisProjectRail.tsx:1003-1109`) |
| Video lab | one of 10 active tabs; Arrow navigation; video ready/error, play/pause, current time/duration, seek (`VideoPlayerLab.tsx:68-264`) |

No application data store, URL search state, persisted browser storage, authentication state, server mutation, form submission, or route loader state was found.

### Responsive and input-mode inventory

- Home shell: desktop split layout; single-column at `max-width: 768px`; compact adjustments at `620px` (`V14ExplorationLab.module.css:244-321`).
- Project lab minimum-height adjustment at `900px` and `620px` (`CrossAxisPresentationLab.module.css:14-23`).
- Rail changes from nested horizontal/vertical scroll to page-flow mobile behavior at `768px`; single-column cards and compact viewer at `620px` (`CrossAxisProjectRail.module.css:1650-1859`).
- Video lab reflows at `760px`; controls stay exposed for `hover: none` (`VideoPlayerLab.module.css:575-611`).
- Reduced-motion rules exist in the hero, button, rail, and video-lab styles; forced-color rules exist for hero/button surfaces.
- A global `52rem` breakpoint applies only to `.effect-lab`/`.effect-grid` classes in `src/styles.css:24-95`; no current JSX reference to those classes was found.

### Link and control inventory

- `/`: one self-home anchor; schedule, X, email, and GitHub contact anchors; 4 project-selection controls; 32 media-viewer triggers; 3 unique visible project destinations; repeated collaborator site/X anchors; custom scrollbar; modal backdrop/Close; viewer video controls when a video chapter is open.
- `/video-player-lab`: one home anchor; 10 tabs; one play/pause button; one range input.
- Unique displayed HTTP destinations returned `200` during direct checks: Cal booking, Mo GitHub, Mo X, Fay website, Fay X, The Good Invoice, Lumen, and Orgo. `mailto:` cannot be validated by HTTP.
- Dormant/non-rendered data destinations: the Calm AI Studio, Bits n Pixels, Glazed, and Orgo GitHub repository URLs returned `404`; `bitsnpixels.co` did not resolve; `glaze.design` timed out. These are not currently exposed because the record is unreachable, a live URL wins, or the “others” story suppresses top links.

### Asset inventory

| Location/type | Count/size | Reachability evidence |
|---|---:|---|
| `public/` total | 119 files, 35.20 MiB | 11 SVG, 47 WebP, 41 PNG, 17 MP4, 1 JPEG, 2 `.DS_Store` |
| Avatars | 13 files, 13.42 MiB | HEAD uses six `-640.webp`; deployed predecessor uses six full PNG portraits; studio-desk PNG has no current source reference |
| Portfolio media | 21.72 MiB | 17 videos, their derived posters, image/WebP pairs, plus dormant hero/detail iterations |
| Existing `dist/client` | 125 files, 35.76 MiB | All 119 `public/` paths copied plus 6 generated JS/CSS assets |
| Existing `dist/server` | 7 files, 0.16 MiB | Worker SSR entry and route chunks |
| HEAD source asset graph | 83 unique public files | 77 literal paths plus 6 additional `-poster.webp` paths derived from referenced MP4s |
| No HEAD source/derived reference | 36 files, 15.26 MiB | Candidates only; not proven removable because deployed predecessor still uses some |

All 77 literal HEAD asset paths and all 17 derived MP4 poster paths exist under `public/`. Every `public/` file also exists in the existing `dist/client` copy.

The live root SSR referenced 53 unique internal URLs and the live video-lab SSR referenced 8; all returned `200`. Against the intended HEAD asset graph, however, live returned `404` for 14 unique new paths: six `-640.webp` avatars, the identity MP4, and seven derived poster WebPs (Good Invoice ×2, Lumen ×3, Orgo ×1, identity ×1). This is deployment-version evidence, not proof that the currently deployed predecessor visibly requests all 14.

## Confirmed Issues

### INV-C01 — Production does not match HEAD or the inspected build

- **Severity:** P1 high
- **Affected:** all routes; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:17-24`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:367-376`; existing `dist/client/assets/`; live `https://m0code.com/`.
- **Evidence:** HEAD is `ae1ec7c`. Existing artifact `/` SSR contains 32 figures, 1 eagerly emitted video, and the MO identity chapter; live SSR contains 31 figures, 16 eagerly emitted videos, and no identity chapter. Existing root assets are `index-COTNhO9J.js`, `routes-BXeiZRtJ.js`, `routes-DKGiQ1HX.css`, and `styles-DDBD8rJB.css`; live references different hashes (`index-BTo1nZ1V.js`, `routes-DAvGpumd.js`, `routes-BvKEGjiQ.css`, `styles-B9P8SFFr.css`). Live uses full PNG portraits matching the parent revision, while HEAD uses `-640.webp`. Fourteen unique HEAD asset URLs are absent live.
- **Reproduction:** (1) Record `git rev-parse HEAD`. (2) Import `dist/server/server.js` and call its default `fetch` handler for `/`; count `<figure`, `<video`, and `logo-animation`. (3) fetch `https://m0code.com/` and repeat. (4) compare internal asset filenames from both HTML responses. (5) request the six HEAD avatar WebPs and new identity assets on live.
- **User/business impact:** The intended launch candidate cannot be honestly validated against production because source, local artifact, and live behavior represent different versions. Recommendations based on live may miss new media-loading, poster, avatar, identity, and SSR states; a later deployment could introduce behavior that this live audit never exercised.
- **Likely root cause:** Live was deployed from the revision before `ae1ec7c`, without an exposed commit/build provenance value or a release-specific preview URL.
- **Recommended improvement:** Choose one immutable launch-candidate commit, produce a fresh artifact from it in CI, expose commit/build identity in deployment metadata, deploy that artifact to a preview, and rerun every specialist against the matching preview before promotion.
- **Safer alternatives/tradeoffs:** If the current live predecessor is intentionally the launch candidate, freeze and label that revision and audit it separately; this avoids an immediate deployment but excludes all HEAD changes from approval. Do not infer equivalence from similar content or one shared CSS hash.
- **Estimated effort:** Small–medium, 0.5 day for provenance/preview alignment; full re-audit effort is separate.
- **Dependencies:** Deployment owner, CI/release specialist, final choice of launch-candidate commit, immutable preview access.
- **Objective verification:** Source commit, CI artifact manifest, preview response metadata, and deployed asset hashes all identify the same revision; `/` then emits the same 32-figure inventory and identity chapter as the approved artifact, with every referenced asset returning `200`.

### INV-C02 — Unknown routes render a generic navigation dead end

- **Severity:** P2 medium
- **Affected:** all unknown URLs; `src/routes/__root.tsx:10-45`; generated route tree; live 404 response.
- **Evidence:** The existing artifact fetch handler returns `404` and logs that neither a route `notFoundComponent` nor router `defaultNotFoundComponent` is configured. Its body and the live body contain only the shared document shell and `<p>Not Found</p>`; no heading, explanation, home link, primary navigation, or recovery control is present.
- **Reproduction:** Request `/definitely-missing-inventory-audit` from the existing handler and `https://m0code.com/definitely-missing-inventory-audit`; inspect status and body.
- **User/business impact:** Mistyped, stale, or shared bad URLs strand users instead of returning them to the portfolio, weakening recovery and making this declared route state visually inconsistent with the rest of the product.
- **Likely root cause:** The root route relies on TanStack Router’s generic default not-found rendering.
- **Recommended improvement:** Define a branded root-level not-found surface that preserves the real `404` status and provides a clear home action; include it in the route inventory and automated route tests.
- **Safer alternatives/tradeoffs:** A minimal page with one heading and one home link is lower-cost and lower-risk than a full illustration; retaining the current plain paragraph has no implementation cost but preserves the dead end.
- **Estimated effort:** Small, 1–2 hours.
- **Dependencies:** Content wording; route test coverage; SEO specialist review for crawl directives.
- **Objective verification:** Unknown paths return `404`, render the approved heading and keyboard-accessible home link in SSR and hydrated views, and an automated route test confirms recovery navigation.

## Risks / Unverified

### INV-R01 — Most interactive surface states lack runtime evidence in this audit

- **Severity:** P1 high
- **Affected:** `/` and `/video-player-lab`; `MoReveal`, `AnimatedLogo`, project rail, 32 media triggers, modal, 17 viewer-video states, custom scrollbar, 10 video-lab tabs, all responsive/input modes.
- **Evidence:** Browser selection returned “No browser is available”; the runtime browser list was empty. HTTP and SSR inspection proves markup/status/resource presence but cannot prove hydration, event behavior, focus, scroll, touch, media playback, rendering, or console cleanliness.
- **Reproduction:** Attempt browser-runtime selection for `https://m0code.com`; then compare the unexercised state inventory above with the HTTP-only checks.
- **User/business impact:** Interaction regressions can remain undetected even when every URL returns `200`, especially in modal focus restoration, nested scroll axes, touch gestures, media failure fallback, reduced motion, and video controls.
- **Likely root cause:** No browser backend was connected to this specialist’s execution environment.
- **Recommended improvement:** Run the complete state matrix on the immutable matching preview using a real browser, capturing route, viewport, input mode, network mode, action, expected state, actual result, console output, and screenshot/video evidence.
- **Safer alternatives/tradeoffs:** Manual device/browser testing can supply evidence without automation but is slower and harder to reproduce; source review remains useful only as implementation inventory, not a behavioral pass.
- **Estimated effort:** Large, 0.5–1 day for this surface because 32 viewer selections and nested scroll/media states must be sampled systematically.
- **Dependencies:** Browser availability, matching preview from INV-C01, media/network throttling controls, other QA specialists.
- **Objective verification:** A signed run log covers every state row and applicable breakpoint with zero unexplained console/network errors; failures have reproducible evidence rather than inferred status.

### INV-R02 — Asset ownership and removal status are ambiguous

- **Severity:** P2 medium
- **Affected:** `public/`, copied `dist/client` assets, design iterations, current HEAD, and deployed predecessor.
- **Evidence:** 36 files totaling 15.26 MiB have no current HEAD literal or derived reference. They include full-size portrait PNGs, brand component/review SVGs, project hero/detail images, two `.DS_Store` files, and other iterations. At least the six portrait PNGs are dependencies of the deployed predecessor, proving “not referenced by HEAD” is not equivalent to “safe to delete.”
- **Reproduction:** Enumerate `public/`; search all `src/` strings; additionally map each referenced MP4 to `${basename}-poster.webp`; total the remainder; compare that list with live SSR/parent-revision references.
- **User/business impact:** Unreviewed removal could break rollback or the current deployment, while retaining every iteration increases release payload and obscures which assets require regression coverage.
- **Likely root cause:** `public/` mixes production runtime assets, rollback dependencies, design-source fragments, and obsolete iterations without a machine-readable owner/status manifest.
- **Recommended improvement:** Create an asset manifest that records owner, purpose, source route/state, generated/derived relationship, launch-candidate status, rollback retention, and approved removal decision. Decide removals only after INV-C01 is resolved.
- **Safer alternatives/tradeoffs:** Keep all ambiguous files through launch and accept the payload/storage cost; moving design sources outside `public/` later reduces deploy ambiguity but must be separately authorized.
- **Estimated effort:** Medium, 0.5 day for classification; cleanup is out of scope and requires approval.
- **Dependencies:** Launch revision, rollback policy, design owner, performance and deployment audits.
- **Objective verification:** Every shipped public asset has a manifest entry and at least one approved runtime/rollback/design purpose; every removal candidate has zero launch-candidate references and passes route/state network tests before deletion approval.

### INV-R03 — Dormant destination data is not ready to expose without review

- **Severity:** P3 low
- **Affected:** `src/components/v14-exploration-lab/portfolio-data.ts:113-128`, `:129-217`, `:244-318`; future use of repository links or top links for Selected Experiments.
- **Evidence:** Four dormant GitHub repository URLs returned `404`; `bitsnpixels.co` failed DNS resolution; `glaze.design` timed out. These destinations are currently suppressed by reachability rules or live-link preference, so no present visible broken link is confirmed.
- **Reproduction:** Directly request all `liveHref` and `repositoryHref` values, then trace `StoryTopLinks` at `CrossAxisProjectRail.tsx:422-445` and the `story.id !== 'others'` gate at `:521-548`.
- **User/business impact:** A future component that exposes all data fields could immediately publish dead, private, or unavailable destinations.
- **Likely root cause:** Data retains portfolio/history links independent of current presentation and public availability.
- **Recommended improvement:** Add explicit visibility/status fields or a content-validation checklist before any dormant link becomes reachable; confirm whether GitHub `404` responses represent private repositories or stale URLs.
- **Safer alternatives/tradeoffs:** Continue suppressing dormant links; this avoids broken navigation but hides potentially useful source links. Do not delete or rewrite URLs until ownership is confirmed.
- **Estimated effort:** Small, 1–2 hours for owner confirmation and data annotation.
- **Dependencies:** Content owner, repository visibility decisions, broken-link/content specialist.
- **Objective verification:** Every link made reachable returns an accepted status without authentication in a clean session, and a content test fails when an enabled destination becomes unavailable.

## Opportunities

### INV-O01 — Generate a versioned surface contract in CI

- **Severity:** P3 low
- **Affected:** `src/routeTree.gen.ts`, `portfolio-data.ts`, `CrossAxisProjectRail.tsx`, `VideoPlayerLab.tsx`, `public/`, and release artifacts.
- **Evidence:** The current crosswalk required manual reconciliation of 2 routes, 8 project records, 7 displayed projects, 4 stories, 32 chapters, 10 video variants, 83 HEAD-referenced assets, 36 non-referenced assets, and a mismatched deployment.
- **Reproduction:** Repeat the route/data/state/asset enumeration after any content change and observe that no single artifact records the expected counts or ownership decisions.
- **User/business impact:** A generated contract would make missing stories/assets and source/build/live drift obvious before manual QA, reducing launch-audit ambiguity.
- **Likely root cause:** Routes are generated, but content/state/asset reachability and build provenance are not represented as one release artifact.
- **Recommended improvement:** Add a read-only CI job that emits a versioned Markdown/JSON surface manifest with commit, routes, story/chapter counts, public references, derived posters, output assets, and approved dormant entries.
- **Safer alternatives/tradeoffs:** Maintain a reviewed manual Markdown checklist; it is simpler but can drift. Avoid runtime code generation solely for audit purposes.
- **Estimated effort:** Medium, about 1 day.
- **Dependencies:** CI/release specialist, asset manifest decisions, stable data exports.
- **Objective verification:** A CI artifact for the approved commit reproduces the counts in this report and fails on unexplained route, chapter, variant, or asset-reference changes.

## False Positives

- The 36 files without a HEAD reference are **not confirmed dead code/assets**. Six portrait PNGs are used by the deployed predecessor, and design/review SVGs may be intentional source material.
- The fourteen HEAD asset URLs missing live are **not all current user-visible 404s**. Live serves an older JS/SSR graph and all 53 root plus 8 video-lab internal URLs actually emitted by that graph returned `200`.
- The existing artifact emitting only one `<video>` in root SSR is **not a missing-chapter result**. It emits all 32 figures and intentionally defers non-eager media in the current implementation.
- `calm-ai-studio` and nine non-editorial presentation modes are unreachable, but their presence alone does not prove they should be removed; they may be staged exploration content.
- Dormant GitHub `404` responses can indicate private repositories rather than nonexistent projects; they become defects only if exposed without authentication.

## Passed Checks

- Repository was clean before report creation; no pre-existing source/configuration/lockfile changes were observed.
- Source declarations and generated route tree agree on exactly two application routes.
- Existing artifact returned `200` for both declared routes and `404` for the unknown path.
- Live returned `200` for both declared routes and `404` for the unknown path.
- Live normalized trailing and duplicate slashes for the lab route.
- All 77 literal HEAD asset paths exist in `public/`.
- All 17 derived MP4 poster paths exist in `public/`.
- Existing `dist/client` contains all 119 `public/` paths.
- Every internal URL emitted in live SSR for `/` (53 unique) and `/video-player-lab` (8 unique) returned `200`.
- Every currently displayed unique HTTP destination checked returned `200`; no visible broken HTTP link was confirmed.
- The current source includes explicit queued/loading/ready/error image states, blocked/failed video states, modal focus management, reduced-motion branches, touch/no-hover styling, and mobile layout branches. This is implementation presence, not runtime pass evidence.

## Not Tested

- No browser backend was available; therefore no click, hover, focus, keyboard, touch, swipe, drag, scroll, modal, animation, video playback, seek, resize, or visual breakpoint behavior is claimed as passing.
- No fresh-load/repeat-visit/cache-disabled/Fast/Slow 3G/offline network matrix was executed in a browser.
- No JavaScript-disabled rendered-page comparison was executed; raw SSR presence was inspected only.
- No console, hydration, memory, CPU, layout, paint, or browser network timeline was captured.
- No image/video visual decode, aspect-ratio correctness, poster-to-video continuity, or corrupted-media simulation was performed.
- No real assistive technology or screen-reader behavior was exercised.
- Safari, Firefox, Edge, Chrome, iOS, Android, high-DPI, orientation change, and reduced-motion runtime behavior remain unverified.
- Loading, autoplay rejection, image error, video error, no-`IntersectionObserver`, no-`ResizeObserver`, `scrollend` compatibility, and network-failure fallbacks were inventoried from source but not forced.
- `mailto:` launch behavior was not exercised.
- `500` behavior was not induced because no safe read-only route exists to do so.
- No new local build was permitted; only the already-existing `dist/` artifact was inspected and executed.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Current candidate inventory:** `/` is the only declared application route; `/video-player-lab` now returns `404`. `src/routes/video-player-lab.tsx` and `src/components/video-player-lab/` were removed, and `src/routeTree.gen.ts` was regenerated.
- **Preserved dependency:** `/portfolio/projects/orgo/walkthrough.mp4` and its poster remain referenced by the homepage portfolio viewer and were not removed or modified.
- **Verification:** check/build pass, no source/build lab reference remains, local SSR reports `/` `200` and the retired path `404`, and browser QA loaded the retained Orgo video without media or console errors.
- **Production evidence:** merge SHA `c273f81…` deployed as Cloudflare version `b8c0dab8…`; public `/` is `200` with the retained Orgo video and the retired path is a non-redirecting `404`. Browser QA loaded and played that video without media or console errors.
- **Tracking result:** the earlier inventory remains historical audit evidence; its lab rows are superseded for the deployed release.
