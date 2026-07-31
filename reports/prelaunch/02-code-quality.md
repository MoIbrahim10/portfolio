# 02 — Code Quality, Architecture, and Maintainability Audit

Audit date: 2026-07-29
Audited repository: `/Users/mo/Documents/porfolio`
Audited commit: `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a` (`master`, one commit ahead of the local `origin/master` ref)
Live target inspected: `https://m0code.com`

## Scope and method

- Inspected all first-party source, route, configuration, workflow, brand-documentation, and generated build files relevant to code structure. `node_modules` was excluded except for identifying available tooling.
- Traced both generated routes (`/` and `/video-player-lab`) from `src/routeTree.gen.ts` through their components, CSS modules, content data, placeholders, and public media.
- Reviewed 6,466 lines across the 18 TypeScript/TSX/CSS source files. The dominant units are `CrossAxisProjectRail.tsx` (1,856 lines) and `CrossAxisProjectRail.module.css` (1,899 lines / 42,982 source bytes).
- Compared source imports, literal media references, derived `*-poster.webp` paths, CSS-module declarations, presentation selectors, and the files copied into the existing `dist/`.
- Inspected the existing local production build without rebuilding it. Its home chunks are `routes-BXeiZRtJ.js`, `routes-DKGiQ1HX.css`, and `styles-DDBD8rJB.css`.
- Fetched both live routes and their live CSS/HTML read-only. The live home chunks are `routes-DAvGpumd.js`, `routes-BvKEGjiQ.css`, and `styles-B9P8SFFr.css`.
- Ran only the non-emitting diagnostic `bun run check` (`tsc --noEmit`); it passed. No build, formatter, installer, source edit, configuration edit, dependency change, Git mutation, or external write was performed.
- Severity reflects launch risk within this scope, not aggregate severity from the other specialist audits.

## Coverage summary

| Area | Evidence reviewed |
|---|---|
| Routes | `/`, `/video-player-lab`, generated route tree, live HTTP 200 responses |
| Main component graph | `V14ExplorationLab`, `AnimatedLogo`, `CrossAxisPresentationLab`, `CrossAxisProjectRail`, `CutCornerButton`, `VideoPlayerLab` |
| State and behavior code | portrait state machine, project rail, nested scrolling, media loading, video playback, full-screen viewer, focus/inert handling |
| Content/data | `portfolio-data.ts`, `portfolio-placeholders.ts`, hard-coded `STORIES` view model |
| Styles | global CSS and all five CSS modules |
| Generated output | existing `dist/client` chunks/assets and `dist/server` bundles |
| Repository hygiene | tracked files, ignore rules, scripts, workflow, branch/remote relationship |

No P0 blocker or P1 high finding was confirmed in scope 02. The deployment/source mismatch must nevertheless be resolved before results from live and local audits can be treated as one release candidate.

## Confirmed Issues

### CQ-01 — The live deployment and audited release candidate are different revisions

- **ID:** CQ-01
- **Severity:** `P2 medium`
- **Affected:** `/`; likely all build output; `.github/workflows/cloudflare.yml:3-10,35-56`; local `dist/client/assets/*`; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:17-24,230-316`; `src/components/brand/AnimatedLogo.tsx:5,72,193-202`
- **Evidence:** `git status -sb` reported `master...origin/master [ahead 1]`. The local existing build references `routes-BXeiZRtJ.js` and `routes-DKGiQ1HX.css`, while live HTML references `routes-DAvGpumd.js` and `routes-BvKEGjiQ.css`. Current source uses six `-640.webp` portraits and only mounts portrait images when `visible`; live SSR emits `mo-avatar-portrait-03.png` and `-04.png` while the reveal is hidden. Current `AnimatedLogo` imports raw SVG markup; live SSR emits the older fallback `<img>`. The one local-only commit is a 48-file media/loading/motion change.
- **Reproduction:** Run `git status -sb`; list `dist/client/assets`; fetch `https://m0code.com/` and extract `/assets/(routes|styles)-*`; compare the live avatar URLs with `V14ExplorationLab.tsx:17-24`.
- **User/business impact:** Audit evidence, bug reproduction, asset reachability, and launch approval can disagree depending on whether a reviewer tests local HEAD, existing `dist`, or production. A production-only regression could be incorrectly declared fixed, and current unpushed behavior could be incorrectly declared live.
- **Likely root cause:** Production deploys on pushes to `master`, while audited local HEAD contains one additional commit. The workflow validates only the page title after deployment and exposes no reviewed commit identifier in the response.
- **Recommended improvement:** Select and record one release-candidate SHA, push/deploy only after approval, generate the artifact from that SHA, and expose or otherwise persist the deployed SHA/build manifest for verification.
- **Safer alternatives/tradeoffs:** If intentionally auditing both versions, label every observation “current live” or “candidate HEAD” and retain both artifact manifests. This avoids a premature deployment but doubles validation work and does not establish a single launch candidate.
- **Estimated effort:** Less than 0.5 day for provenance and deployment verification; excludes remediation found by other audits.
- **Dependencies:** Release-owner approval, CI/CD scope 13/14, completion of current audits, and a deliberate decision about commit `ae1ec7c`.
- **Objective verification:** `origin/master...HEAD` is `0 0` for the approved SHA; a clean build produces the same chunk manifest served by both routes; live HTML/media behavior matches that build; the deployment record maps the live artifact to the approved full SHA.

### CQ-02 — The project rail is a multi-responsibility monolith

- **ID:** CQ-02
- **Severity:** `P2 medium`
- **Affected:** `/`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:1-1856`; `src/components/v14-exploration-lab/CrossAxisProjectRail.module.css:1-1899`
- **Evidence:** One 1,856-line TSX file owns content composition (`80-386`), network heuristics (`390-411`), visual transitions (`447-551`), image lifecycle (`585-659`), pointer parallax and gallery cards (`661-859`), resilient autoplay (`861-994`), viewer playback (`996-1109`), modal focus/inert behavior (`1111-1311`), slide rendering (`1313-1403`), and horizontal/vertical scroll state (`1413-1856`). Its 1,899-line CSS file combines base rail, media, viewer, ten presentation themes, responsive layouts, hover, forced-colors, and reduced-motion rules.
- **Reproduction:** Run `wc -l src/components/v14-exploration-lab/CrossAxisProjectRail.{tsx,module.css}` and inspect the function boundaries listed above.
- **User/business impact:** A change to copy, media loading, modal accessibility, scrolling, or styling requires navigating and regression-testing unrelated behavior in the same unit. The blast radius and merge-conflict probability are high, especially while no behavior tests exist.
- **Likely root cause:** An exploration component accumulated production data, media primitives, modal infrastructure, and cross-axis controller behavior without a consolidation boundary.
- **Recommended improvement:** After behavior characterization, split stable content/view-model data, media primitives, viewer/dialog, and rail controller into cohesive internal modules. Keep the tightly coupled scroll state together rather than fragmenting individual handlers.
- **Safer alternatives/tradeoffs:** First extract only pure data and duplicated media helpers, leaving scroll orchestration untouched. This yields smaller risk and diff size but retains the most complex unit until tests exist.
- **Estimated effort:** 3–5 days including characterization tests and visual/interaction parity checks.
- **Dependencies:** CQ-R02 test coverage, scope 09/10/11 acceptance baselines, and a decision on the presentation variants in CQ-03.
- **Objective verification:** Each extracted module has one documented responsibility; no cyclic imports are introduced; TypeScript, behavior tests, keyboard/touch tests, and approved screenshots pass on all four project stories and the viewer; source behavior and generated markup remain equivalent except for approved changes.

### CQ-03 — Nine unreachable presentation systems are compiled and shipped

- **ID:** CQ-03
- **Severity:** `P2 medium`
- **Affected:** `/`; `src/components/v14-exploration-lab/CrossAxisPresentationLab.tsx:4-8`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:39-49,1313-1353,1413-1417,1772-1820`; `src/components/v14-exploration-lab/CrossAxisProjectRail.module.css:1082-1648,1763-1808`
- **Evidence:** `DetailPresentation` exposes ten variants, but the only repository call site passes the literal `presentation="editorial"`. There is no route, state, or query parameter that can select `archive`, `blueprint`, `catalog`, `cinema`, `ledger`, `mosaic`, `poster`, `split`, or `windows`. Their main CSS blocks occupy 14,912 of 42,982 source bytes (34.7%), plus responsive selectors. The existing local production CSS and live CSS both contain, for example, 15 `ledger` and 13 `archive` selectors.
- **Reproduction:** Run `rg -n "presentation=|DetailPresentation|data-presentation" src`; measure `CrossAxisProjectRail.module.css:1082-1648`; search the compiled and live route CSS for `data-presentation=ledger` and `data-presentation=archive`.
- **User/business impact:** Reviewers must reason about and preserve nine unreachable visual systems. They increase stylesheet payload and make responsive changes more collision-prone without supplying any user-visible route.
- **Likely root cause:** Earlier design explorations remained in the production component after `editorial` became the only selected direction.
- **Recommended improvement:** After visual sign-off, contract the prop to the real production mode and remove unreachable selectors from production. If the experiments retain design value, move them to a non-shipping design archive or an explicitly development-only lab.
- **Safer alternatives/tradeoffs:** Retain the variants temporarily but document them as deprecated and exclude them from production CSS through a separate entry point. This preserves review history but requires build-boundary work.
- **Estimated effort:** 0.5–1 day, plus screenshot review.
- **Dependencies:** Design-owner confirmation, scope 06 visual baseline, CQ-02 module boundary decision, and verification that no untracked/private consumer imports this internal component.
- **Objective verification:** Repository-wide search finds only `editorial`; production route CSS contains no selectors for the nine removed values; screenshots and interaction tests for `editorial` remain approved at all supported breakpoints.

### CQ-04 — The default `navy` button variant emits a literal `undefined` CSS class

- **ID:** CQ-04
- **Severity:** `P3 low`
- **Affected:** `/`; schedule-call control; `src/components/v14-exploration-lab/CutCornerButton.tsx:5,19-21`; `src/components/v14-exploration-lab/CutCornerButton.module.css:1-43`; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:111-119`
- **Evidence:** `Variant` includes `navy` and it is the default, but the CSS module exports only `.control`, `.gold`, `.paper`, `.quiet`, `.hidden`, and `.loading`; there is no `.navy`. `${styles[variant]}` therefore stringifies `undefined`. Live SSR confirms `class="_control_18qgj_1 undefined _callButton_1f254_110"`.
- **Reproduction:** Inspect the type and CSS declarations, then fetch `/` and search the schedule link class for `undefined`.
- **User/business impact:** The button still inherits base navy styling, so immediate visual impact is low. The polluted DOM hides a real type/style mismatch and can break class-based tests, selectors, telemetry, or future variant-specific styling.
- **Likely root cause:** Navy is represented implicitly by `.control` defaults while the component assumes every union member has a CSS-module export.
- **Recommended improvement:** Use an explicit typed variant-class map and represent the base/default variant intentionally (for example, an empty suffix), or add a meaningful `.navy` class and ensure the build exports it.
- **Safer alternatives/tradeoffs:** Filter falsey class fragments before joining. This removes the bad DOM token with a minimal diff but does not make missing variant styles compile-time visible.
- **Estimated effort:** Less than 0.5 day.
- **Dependencies:** None beyond change approval and a small component test.
- **Objective verification:** SSR and hydrated DOM for every button contain no `undefined`; each allowed variant has an explicit tested mapping; TypeScript and component snapshots pass.

### CQ-05 — Shipping content contains confirmed unused exports and an unreachable project record

- **ID:** CQ-05
- **Severity:** `P3 low`
- **Affected:** `/`; `src/components/v14-exploration-lab/portfolio-data.ts:1-8,24-35,112-128`; `src/components/v14-exploration-lab/portfolio-placeholders.ts:16-17`; `src/components/v14-exploration-lab/V14ExplorationLab.tsx:10-15,345-358`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:80-94`
- **Evidence:** `PORTFOLIO_BIO` and `PORTFOLIO_LINKS` have no imports; equivalent bio/link literals are maintained in `V14ExplorationLab`. The `calm-ai-studio` record is present in `PORTFOLIO_PROJECTS` and its placeholder is present, but the only story lookups are `orgo`, `good-invoice`, `lumen`, `bitsnpixels`, `glazed`, `stepper`, and `folders`. The existing client and server route bundles still contain the Calm AI record and placeholder string.
- **Reproduction:** Run `rg -n "PORTFOLIO_BIO|PORTFOLIO_LINKS|calm-ai-studio" src dist/{client,server}` and compare the `projectById` calls with `PORTFOLIO_PROJECTS`.
- **User/business impact:** Copy and social URLs can drift between nominal data and rendered UI. Unreachable records/placeholders add noise to the production model and obscure whether omission is intentional.
- **Likely root cause:** A data-centralization attempt was only partially adopted, and the Calm AI entry was removed from the story composition without being archived or removed from shipping data.
- **Recommended improvement:** Establish one rendered content source. Either consume the shared bio/link constants or remove them; explicitly include Calm AI in the presentation or move it and its placeholder to a documented non-shipping archive.
- **Safer alternatives/tradeoffs:** Add an explicit `status: "archived"` and filter before shipping. This communicates intent but adds configuration for a single current exception.
- **Estimated effort:** Less than 0.5 day after content-owner confirmation.
- **Dependencies:** Content owner, scope 15 content inventory, and decision on Calm AI visibility.
- **Objective verification:** Every exported content constant has a repository consumer; every shipping project is reachable from a route; archived projects are excluded from client/server route chunks; rendered bio and links match the selected source.

### CQ-06 — Legacy global effect-lab CSS is unreachable but shipped on every route

- **ID:** CQ-06
- **Severity:** `P3 low`
- **Affected:** all routes; `src/routes/__root.tsx:8,24-26`; `src/styles.css:16,24-95`
- **Evidence:** No TSX or HTML source references `effect-lab`, `effect-lab__header`, `effect-lab__eyebrow`, `effect-grid`, `effect-card`, `effect-card__logo`, or `interaction-hint`. Root imports the stylesheet globally. The live global CSS still includes all four selector families sampled, and the existing local build emits them in `styles-DDBD8rJB.css`. Current SSR also has no `#app` element, making the `#app` member at line 16 ineffective.
- **Reproduction:** Search the repository for each class while excluding `src/styles.css`; inspect the live/global style asset.
- **User/business impact:** Small payload and parse overhead affect both routes, while stale global selectors increase the chance of accidental collisions and mislead maintainers about supported UI.
- **Likely root cause:** A prior effects laboratory was removed without deleting its global stylesheet rules.
- **Recommended improvement:** Remove only the confirmed unreachable selector block and the unused `#app` selector after approved visual regression checks.
- **Safer alternatives/tradeoffs:** Move legacy styles to a design archive. This preserves reference material but should not keep them in the root production stylesheet.
- **Estimated effort:** Less than 0.5 day.
- **Dependencies:** Visual smoke test on both routes; no dependency changes.
- **Objective verification:** Repository and compiled global CSS contain none of the legacy selectors; both routes remain visually identical at supported breakpoints; root CSS still supplies the intended reset/base rules.

### CQ-07 — Collaboration and video-control behavior is duplicated

- **ID:** CQ-07
- **Severity:** `P3 low`
- **Affected:** `/`, `/video-player-lab`; `CrossAxisProjectRail.tsx:521-545,829-856,996-1105`; `VideoPlayerLab.tsx:61-103,127-190`
- **Evidence:** The collaborator name/site/social markup is duplicated in story headers and experiment cards. `formatTime`/`formatVideoTime` are equivalent implementations. `PreviewPlayer` and `ViewerVideo` independently implement current time, duration, play state, toggle, seek, media event wiring, and progress controls.
- **Reproduction:** Search for `collaborators.map`, `In collaboration with`, `formatTime`, `formatVideoTime`, `togglePlayback`, and `function seek`.
- **User/business impact:** A label, rel attribute, time-format edge case, playback error state, or accessibility fix must be applied in multiple places and can drift between routes.
- **Likely root cause:** The experimental video lab and production viewer evolved separately; collaborator markup was copied to support two placements.
- **Recommended improvement:** Extract only stable, small primitives: collaborator credit, pure time formatting, and a shared playback-state hook if both players remain. Keep route-specific visual controls separate.
- **Safer alternatives/tradeoffs:** Share only the pure formatter and collaborator view first. This avoids prematurely abstracting player semantics but leaves some event duplication.
- **Estimated effort:** 0.5–1 day including tests.
- **Dependencies:** Decision on whether `/video-player-lab` is a retained production route; scope 09/10 behavior baselines.
- **Objective verification:** One implementation formats time and renders collaborator links; both player variants pass the same playback/seek/error tests; visual presentations remain independent.

### CQ-08 — Ignored macOS metadata remains tracked and enters build context

- **ID:** CQ-08
- **Severity:** `P3 low`
- **Affected:** repository root, `design/`, `public/`, generated `dist/client/`; `.gitignore:2`
- **Evidence:** `git ls-files` reports `.DS_Store`, `design/.DS_Store`, and `public/.DS_Store` even though `.gitignore` excludes `.DS_Store`. The public copy is present in the existing generated client asset directory.
- **Reproduction:** Run `git ls-files | rg '(^|/)\\.DS_Store$'` and inspect `dist/client/.DS_Store`.
- **User/business impact:** Binary metadata creates noisy diffs, unnecessary repository/build artifacts, and platform-specific churn.
- **Likely root cause:** The files were committed before or despite the ignore rule; ignore rules do not untrack existing files.
- **Recommended improvement:** With approval, remove these files from version control and ensure generated deployment artifacts exclude them.
- **Safer alternatives/tradeoffs:** Leave local files ignored but untrack them. This preserves Finder metadata locally while keeping it out of Git and builds.
- **Estimated effort:** Less than 0.5 day.
- **Dependencies:** Explicit deletion/change approval.
- **Objective verification:** `git ls-files` and a clean production artifact contain no `.DS_Store`; a fresh macOS checkout does not re-add them.

## Risks / Unverified

### CQ-R01 — Project composition relies on positional arrays and import-time throws

- **ID:** CQ-R01
- **Severity:** `P2 medium`
- **Affected:** `/`; `src/components/v14-exploration-lab/portfolio-data.ts:24-35`; `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:80-92,94-386`
- **Evidence:** `projectById` searches a mutable array and throws while the route module is evaluated if an ID changes or disappears. Story chapters then address media by position (`media[0]`, `media[1]`, etc.) throughout the hard-coded view model. There is no stable media ID or validation tying a caption/video to a media record.
- **Reproduction:** Trace each `projectById` and `.media[index]` access. A hypothetical reorder demonstrates the risk, but source was not modified to trigger production failure.
- **User/business impact:** A routine content edit can prevent the entire home route from loading or silently attach the wrong caption, dimensions, poster, or video to a chapter.
- **Likely root cause:** `PORTFOLIO_PROJECTS` is typed as a general array, while `STORIES` is a second manually synchronized positional view model.
- **Recommended improvement:** Use an immutable object keyed by literal project/media IDs and construct stories with those IDs. Validate the content model during a non-runtime build/check step.
- **Safer alternatives/tradeoffs:** Retain the arrays but add named media constants and a read-only validation test. This is smaller but keeps two synchronized models.
- **Estimated effort:** 1–2 days including migration and content tests.
- **Dependencies:** CQ-02 data extraction, content-owner review, and authorization for test tooling if needed.
- **Objective verification:** Reordering source declarations cannot change story associations; invalid IDs fail a dedicated check with a targeted message; the route does not depend on an unhandled module-initialization throw.

### CQ-R02 — Complex rail behavior has no tracked automated characterization

- **ID:** CQ-R02
- **Severity:** `P2 medium`
- **Affected:** `/`, `/video-player-lab`; `package.json:7-13`; `CrossAxisProjectRail.tsx:585-1856`; `VideoPlayerLab.tsx:68-264`
- **Evidence:** `package.json` defines dev, route generation, build, type-check, and preview scripts but no lint or test script. `git ls-files` found no tracked test/spec files. TypeScript passes, but it cannot verify scroll settling, focus return, inert cleanup, media fallback, autoplay, reduced motion, or state synchronization.
- **Reproduction:** Inspect package scripts and run a tracked-file search for `*.test.*`, `*.spec.*`, `tests/`, and `__tests__/`.
- **User/business impact:** CQ-02/CQ-03 cleanup and ordinary media changes have no automated regression signal for the highest-complexity behavior.
- **Likely root cause:** Exploration code reached production before a behavior harness was established.
- **Recommended improvement:** Before architectural work, add the smallest high-value characterization set: pure navigation/format tests, one rail keyboard/touch/scroll suite, and viewer open/close/focus/media-failure coverage.
- **Safer alternatives/tradeoffs:** Start with one browser smoke path and pure helper tests. This is faster but leaves timing, breakpoints, and error states weakly covered.
- **Estimated effort:** 2–4 days for a useful baseline.
- **Dependencies:** Scope 14 test strategy, dependency-install approval if existing tooling is insufficient, and scope 09/10/11 acceptance cases.
- **Objective verification:** CI runs the approved suite on every PR; tests fail when rail selection, viewer focus return, fallback media, or video controls are intentionally broken; no errors are suppressed to pass.

### CQ-R03 — Thirty-four public files have no current source reference, but removal is not yet safe

- **ID:** CQ-R03
- **Severity:** `P3 low`
- **Affected:** `public/`, generated `dist/client/`, live `/`
- **Evidence:** Literal/derived-path analysis found 34 of 117 public files (15.24 MiB) with no current `src` reference. The set includes six 1.9–2.1 MiB portrait PNGs, `mo-avatar-studio-desk.png`, old project hero/detail images, review SVGs, and `egyptian-frame.webp`. However, live SSR still references two portrait PNGs, and `design/brand/README.md:21-29` explicitly documents the component SVGs as independently reviewable logo sources.
- **Reproduction:** Compare every `public/` path with literals in `src`, add the `mp4 -> -poster.webp` convention, then compare candidates with live HTML/network use and brand documentation.
- **User/business impact:** Keeping truly stale assets inflates artifact storage and review surface; deleting solely from the current source graph could break the still-live revision, documented design workflows, direct URLs, or external embeds.
- **Likely root cause:** Runtime assets, historical design sources, and old-revision assets share one public directory without a manifest or lifecycle label.
- **Recommended improvement:** Resolve CQ-01, then classify every candidate as runtime, documented design source, direct-link contract, or approved removal candidate. Generate an asset manifest for the selected release SHA.
- **Safer alternatives/tradeoffs:** Keep all candidates through launch and remove them in a separately reviewed asset-cleanup change. This costs storage but avoids irreversible breakage.
- **Estimated effort:** 0.5–1 day for classification; deletion is not authorized by this audit.
- **Dependencies:** CQ-01, scope 01 asset inventory, scope 05 artifact analysis, scope 15 link checks, and any available access/CDN logs.
- **Objective verification:** Every public file has a recorded owner/use classification; approved runtime paths pass route/network tests; documented source assets are outside shipping output where feasible; only explicitly approved candidates are later removed.

## Opportunities

### CQ-O01 — Contract internal component APIs to actual consumers

- **ID:** CQ-O01
- **Severity:** `P3 low`
- **Affected:** `V14ExplorationLab.tsx:26-36,133-140,322-375`; `AnimatedLogo.tsx:13-23,47-71,77-105`; `portfolio-data.ts:24-35`; `CutCornerButton.tsx:5-20`
- **Evidence:** `Direction.name` is assigned but never read; `PortfolioProject.accent` is populated but never read; `AnimatedLogo` builds `diagonals`, `heavyDiagonal`, and `fineDiagonal` selector fields that are no longer consumed; no caller selects `mHoverEffect="gold-sweep"`; no caller uses `CutCornerButton` variants `gold`/`quiet` or its `loading` state. These are internal components, not a published package, but future design intent is unverified.
- **Reproduction:** Run repository-wide searches for each property, option, and variant while excluding its declaration/implementation.
- **User/business impact:** Dead options imply supported behavior, enlarge review scope, and make refactors appear riskier than the actual product surface.
- **Likely root cause:** APIs retained options from earlier explorations after production call sites narrowed.
- **Recommended improvement:** After design confirmation, remove unused object properties and contract union/prop surfaces to real consumers. Keep reusable options only when a test, route, or documented design lab exercises them.
- **Safer alternatives/tradeoffs:** Preserve variants in a development-only component story. This retains experimentation without presenting them as production API.
- **Estimated effort:** 0.5–1 day including search-based and visual verification.
- **Dependencies:** Design-owner decision, CQ-03, and tests from CQ-R02.
- **Objective verification:** Every retained prop/union member/property has at least one tracked consumer or test; production bundles contain no removed branches; TypeScript and approved visual checks pass.

## False Positives

### CQ-FP-01 — Generated route suppressions are intentional

- **ID:** CQ-FP-01
- **Severity:** `P3 low`
- **Affected:** `src/routeTree.gen.ts:1-9,79-86`
- **Evidence:** The file declares itself generated and explicitly warns against manual edits. Its `eslint-disable`, `@ts-nocheck`, casts, and module augmentation are generator output; the route list correctly matches the two route files.
- **Reproduction:** Read the generated header and compare imports with `src/routes/`.
- **User/business impact:** Treating these suppressions as hand-written quality defects would create changes that the route generator overwrites and could destabilize routing types.
- **Likely root cause:** Static searches cannot distinguish generated from authored suppressions without reading the header.
- **Recommended improvement:** Keep the file generated and exclude it from authored-code lint/format findings; validate regeneration instead.
- **Safer alternatives/tradeoffs:** None preferable; manual cleanup is specifically unsafe.
- **Estimated effort:** None.
- **Dependencies:** Route generator.
- **Objective verification:** Regeneration at the approved dependency version reproduces the file and both routes remain typed/reachable.

### CQ-FP-02 — Brand component SVGs are design sources, not confirmed dead assets

- **ID:** CQ-FP-02
- **Severity:** `P3 low`
- **Affected:** `public/brand/components/*.svg`; `design/brand/README.md:21-29`
- **Evidence:** Runtime source imports only the self-contained `mo-mark-v3.svg`, but the brand README explicitly names the six component SVGs as independently reviewable sources used to compose the master.
- **Reproduction:** Compare runtime reference search with the “Source of truth” section in the brand README.
- **User/business impact:** Deleting them as “unused” would remove documented editable source material even though the website still renders.
- **Likely root cause:** Runtime reachability and design-source ownership are different asset lifecycles.
- **Recommended improvement:** Retain them as source assets; consider excluding design-only sources from deployment output rather than deleting them.
- **Safer alternatives/tradeoffs:** Move them under `design/` in a future approved change. This clarifies lifecycle but requires updating documentation and composition workflows.
- **Estimated effort:** None to retain; less than 0.5 day for a later approved relocation.
- **Dependencies:** Brand owner and deployment packaging scope.
- **Objective verification:** Brand source documentation resolves to all components, while the production artifact includes only assets intentionally needed at runtime.

### CQ-FP-03 — Current-source “unused” portrait PNGs are still live dependencies

- **ID:** CQ-FP-03
- **Severity:** `P3 low`
- **Affected:** live `/`; `public/avatar/mo-avatar-portrait-01.png` through `-06.png`; current `V14ExplorationLab.tsx:17-24`
- **Evidence:** Current source references only `-640.webp` portraits, but live SSR on the audit date emitted `/avatar/mo-avatar-portrait-03.png` and `-04.png`. This follows CQ-01’s revision mismatch.
- **Reproduction:** Fetch live `/` and search portrait URLs; compare them with the current `AVATARS` array.
- **User/business impact:** Premature removal could break the live reveal before the candidate revision is deployed.
- **Likely root cause:** Reachability was calculated against a newer local commit than production.
- **Recommended improvement:** Do not approve portrait PNG removal until CQ-01 is resolved and the approved deployment no longer requests them.
- **Safer alternatives/tradeoffs:** Retain the PNGs for one release after migration and verify request logs before cleanup.
- **Estimated effort:** None now; later verification is less than 0.5 day.
- **Dependencies:** CQ-01 and production network/log evidence.
- **Objective verification:** The approved live release completes fresh and repeat visits without requesting any legacy portrait PNG, and no supported direct-link contract requires them.

## Generated-code observations

- `src/routeTree.gen.ts` is generated source and was not counted as authored suppression debt.
- `dist/` is ignored generated output and was inspected only as the existing candidate artifact. It was not rebuilt or edited.
- The existing build copies all of `public/`, including design-only/stale candidates and `public/.DS_Store`; reachability is not used to prune public assets.
- Both local and live route CSS include the nine non-editorial presentation systems, confirming CQ-03 is not merely unbuilt source.

## Passed Checks

- `bun run check` completed successfully with strict TypeScript and `--noEmit`.
- All 77 literal first-party media paths found in TS/TSX/CSS exist under `public/`.
- All 17 literal MP4 paths have the `*-poster.webp` file required by `ResilientVideo.tsx:882`.
- Both route files are represented in the generated route tree and have separate client chunks in the existing build.
- All first-party TS/TSX/CSS modules are reachable from a route or the root route; dead-code findings are within reachable modules/data rather than orphan source files.
- No authored `TODO`, `FIXME`, `HACK`, `console.*`, `@ts-ignore`, or broad lint-disable marker was found. Suppressions occur only in the generated route tree.
- Simple CSS-module class declaration/reference comparison found no wholly unreferenced authored class name; CQ-03 is conditional reachability, and `CutCornerButton` variant classes are accessed dynamically.
- The live `/` and `/video-player-lab` endpoints both returned HTTP 200 during read-only inspection.

## Not Tested

- A fresh production build was not run because it would write generated output/caches, contrary to the audit’s no-modification constraint. The existing `dist/` was inspected instead.
- No formatter, linter, duplicate-code package, bundle analyzer, or dead-code package was installed or run; the project does not expose corresponding scripts and installation was prohibited.
- Interactive correctness, timing, accessibility, responsive behavior, browser differences, and performance were not re-audited here; those belong to scopes 05, 06, 09, 10, and 11. Code paths were reviewed only for structure and maintainability.
- Removal safety for direct public URLs could not be confirmed without production request/CDN logs and a single selected release SHA.
- The exact Git SHA serving production is not exposed in the inspected response, so the live revision was inferred from artifact/content differences and the local branch relationship rather than cryptographically proven.
- Untracked/private consumers of internal presentation variants cannot be ruled out, though no repository route or generated build entry exposes them.

## Implementation tracking — ITEM-01

- **Status:** `Verified locally — production verification pending` (2026-07-31).
- **Disposition:** the lab side of `CQ-07` duplication was removed with the retired route; the homepage video implementation was not refactored. The lab portion of `CQ-R02` is no longer applicable, while missing automated characterization for `CrossAxisProjectRail` remains open.
- **Removal safety evidence:** repository import/reference search found no consumer beyond the deleted route; route generation, type checking, and production build pass; generated artifacts contain no lab chunk or identifying text.
- **Regression evidence:** retained player source, CSS, data, MP4, and poster hashes match their pre-change baselines; focused browser QA loaded the retained viewer successfully.
- **Tracking rule:** mark `CQ-07` only `Partially resolved`; mark ITEM-01 `Complete` after the approved SHA is deployed and the public route/player checks pass.
