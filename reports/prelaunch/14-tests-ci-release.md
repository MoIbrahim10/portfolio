# 14 — Automated Tests, CI, and Release Readiness

Audit date: 2026-07-29

Repository: `/Users/mo/Documents/porfolio`

Production: `https://m0code.com`

Scope verdict: **Not release-ready in this scope.** No P0 was found, but four P1 findings leave the application without an objective behavioral release gate or a controlled, traceable promotion path.

## Scope and method

### Success criteria

A launch-ready result in this scope requires:

1. An immutable release commit that is identical across the reviewed source, remote default branch, built artifact, GitHub deployment, and live site.
2. Enforced review and environment controls that prevent an unreviewed ref from reaching production.
3. Automated, deterministic checks for the two routes and their critical component states, including browser, accessibility, media, responsive, error, and network behavior.
4. An immutable build artifact promoted to production without rebuilding, plus recorded provenance and a tested rollback procedure.
5. Post-deploy verification that can detect missing assets, SSR/hydration failures, console errors, broken interactions, route failures, and stale or incorrect deployments.

### Audited material

- Application scripts and dependencies: `package.json:1-34`, `bun.lock`, `.bun-version:1`.
- CI/CD workflow: `.github/workflows/cloudflare.yml:1-56`.
- Deployment configuration: `wrangler.jsonc:1-17`.
- Router and route entry points: `src/router.tsx:1-18`, `src/routes/__root.tsx:1-44`, `src/routes/index.tsx:1-5`, `src/routes/video-player-lab.tsx:1-7`.
- State-heavy application code used to define missing coverage:
  - `src/components/v14-exploration-lab/V14ExplorationLab.tsx:135-196`
  - `src/components/v14-exploration-lab/CrossAxisProjectRail.tsx:600-1836`
  - `src/components/video-player-lab/VideoPlayerLab.tsx:69-243`
  - `src/components/brand/AnimatedLogo.tsx:197`
- Existing ignored build output under `dist/client` and `dist/server`; it was inspected but not regenerated.
- Git repository, GitHub Actions, branch/environment settings, deployments, artifacts, releases, and pull-request history through read-only `git` and `gh` queries.
- Live read-only HTTP probes of `/`, `/video-player-lab`, one nonexistent route, and the live/local JavaScript asset names.

### Commands and constraints

- Ran `bun run check`; it completed successfully with `tsc --noEmit` and wrote no output.
- Ran `node --check dist/server/server.js`; the existing server bundle parsed successfully.
- Did **not** install packages, rebuild, generate routes, start a server, run a deployment, trigger CI, create snapshots, write outside this report, or change Git state.
- Product-owned tests were searched with filename and content queries. Test-like fixtures under `.agents/skills/**` were excluded because they are skill assets, not application tests.
- GitHub evidence was collected from repository `MoIbrahim10/portfolio`; latest completed run inspected: `30444677550`.

### Release identity observed

| Layer | Observed identity | Evidence |
|---|---|---|
| Local source candidate | `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a` | `git rev-parse HEAD` |
| Remote `master` | `5d80cbf0d9e818f3e5cc4b65766a947bdcd7ad7c` | `git rev-parse origin/master`; GitHub branch API |
| Latest successful workflow/deployment | `5d80cbf0d9e818f3e5cc4b65766a947bdcd7ad7c` | Actions run `30444677550`; deployment `5655911137` |
| Live root JavaScript | `/assets/index-BTo1nZ1V.js` | SSR HTML and HTTP 200 |
| Existing local `dist` root JavaScript | `/assets/index-COTNhO9J.js` | `dist/client/assets`; live HTTP 404 |
| Live-to-commit binding | Not exposed or independently verifiable | GitHub environment URL empty; HTML has no commit/build identifier |

The local branch is one commit ahead of `origin/master`. The existing local build and live build have different content-addressed asset names. This is expected for different source revisions, but it means the audited local candidate is not the artifact currently running in production.

## Coverage inventory

### Product test assets

- Test scripts in `package.json`: **none**.
- Test runner or browser runner dependencies: **none**.
- Product `*.test.*`, `*.spec.*`, `tests/`, `__tests__/`, `e2e/`, snapshots, or fixtures: **none**.
- Vitest, Jest, Playwright, Cypress, Storybook, Chromatic, Lighthouse CI, axe, or coverage configuration: **none**.
- Lint or formatting gate: **none**.
- Project release checklist, changelog, release notes, tags, GitHub Releases, CODEOWNERS, or dedicated rollback document: **none observed**.

### Routes and behavior with no automated coverage

| Surface | Critical behavior currently ungated |
|---|---|
| `/` | SSR and hydration; entrance/reduced motion; avatar pointer/keyboard reveal; project-dot navigation; horizontal and vertical scrolling; touch/pointer/keyboard control; custom scrollbar; responsive mode switch; ResizeObserver and IntersectionObserver fallbacks; modal open/close/Escape/focus restoration; image fallback/error; video ready/error/autoplay-blocked/play/pause; external links |
| `/video-player-lab` | SSR and hydration; player loading/error state; play/pause; time and duration updates; seek controls; tab selection; arrow-key tab navigation; media loading; responsive layout |
| Unknown route | Correct 404 status and usable error UI |
| Global | Console and network cleanliness; hydration mismatch detection; no-JavaScript output; offline/Slow 3G behavior; reduced motion; keyboard-only flow; screen-reader semantics; color/zoom; cross-browser/mobile/touch; broken media/link detection |

## Current gate matrix

| Gate | Local candidate `ae1ec7c` | Pull request | Push/manual production | Evidence / disposition |
|---|---|---|---|---|
| Pinned Bun runtime | `.bun-version` is `1.3.10` | Yes | Yes | `setup-bun` reads `.bun-version` |
| Frozen dependency install | Not rerun; install prohibited | Yes | Yes | `bun install --frozen-lockfile`, workflow line 33 |
| TypeScript strict check | **Passed in this audit** | Yes | Yes | `bun run check`; workflow lines 35-36 |
| Lint / formatting | Absent | Absent | Absent | No script or workflow step |
| Unit tests | Absent | Absent | Absent | No runner, tests, or script |
| Component/state tests | Absent | Absent | Absent | No runner, tests, or script |
| Integration/API/SSR tests | Absent | Absent | Absent | No runner, tests, or script |
| Browser/E2E tests | Absent | Absent | Absent | No browser runner or workflow step |
| Accessibility automation | Absent | Absent | Absent | No axe/Lighthouse/browser audit |
| Visual/responsive regression | Absent | Absent | Absent | No snapshots or baseline service |
| Cross-browser/mobile/touch | Absent | Absent | Absent | No browser matrix |
| Offline/network/media failure | Absent | Absent | Absent | No failure injection |
| Performance/bundle budgets | Absent | Absent | Absent | No Lighthouse CI or size threshold |
| Dependency/security gate | Absent in this workflow | Absent | Absent | No audit/SAST step; see specialist 04/03 reports |
| Route generation drift check | Absent | Absent | Absent | Script exists, but CI does not run-and-diff it |
| Production build | Not rebuilt; existing `dist` inspected | Yes | Yes | Latest remote build step passed |
| Worker dry run | Not run locally | Yes | Yes | Latest remote dry-run step passed |
| Review/protection approval | Not applicable | Not enforced | Not enforced | `master` unprotected; environment has no rules |
| Immutable artifact promotion | Absent | Absent | Absent | Build and deploy share workspace; zero artifacts |
| Post-deploy smoke | Not run locally | Deploy skipped | Root title only | Workflow lines 54-56 |
| Rollback verification | Absent | Absent | Absent | No scripted or documented drill |

## Confirmed Issues

### CI14-001 — No automated product test suite

- **Severity:** `P1 high`
- **Affected:** `/`, `/video-player-lab`, unknown/error routes; all files under `src/components/**`; `package.json:8-33`; `.github/workflows/cloudflare.yml:32-42`.
- **Evidence:** `package.json` defines only `dev`, `generate-routes`, `build`, `check`, and `preview`. No product-owned test/spec files, test configuration, runner dependency, coverage output, or browser automation was found. The state-heavy rail alone is 1,856 lines and includes modal, media, pointer, touch/scroll, keyboard, observer, responsive, and error logic (`CrossAxisProjectRail.tsx:600-1836`) without executable regression coverage.
- **Reproduction steps:** (1) Run `find src -type f \( -name '*.test.*' -o -name '*.spec.*' \) -print`; observe no results. (2) Inspect `package.json:8-33`; observe no test script or runner. (3) Inspect `.github/workflows/cloudflare.yml:32-42`; observe install, type-check, build, and dry-run only.
- **User/business impact:** A type-correct bundle can deploy while primary navigation, media playback, modal focus, touch swiping, keyboard operation, hydration, or error handling is broken. Every interactive regression depends on manual detection after the code has reached production.
- **Likely root cause:** The release workflow was created around compilation and deployment before a product test strategy and stable browser fixtures were established.
- **Recommended improvement:** Add a layered suite: pure/unit tests for index/direction/media-state calculations; React component tests for loading/error/keyboard/focus behavior; SSR/hydration integration tests for both routes; and Playwright release-critical journeys for desktop and mobile. Include deterministic media stubs and explicit tests for observer absence, autoplay rejection, image/video failure, reduced motion, offline/Slow 3G, Escape/focus restoration, and 404 behavior.
- **Safer alternatives / tradeoffs:** A minimal initial gate can cover only critical journeys in one Chromium desktop and one mobile project, with WebKit/Firefox and visual baselines running nightly. This reduces initial effort and CI time but leaves browser-specific regressions outside the blocking path. Manual checklists are useful as a temporary supplement, not a substitute for repeatable evidence.
- **Estimated effort:** `L` — approximately 4-8 engineering days for harness, fixtures, critical coverage, and CI integration.
- **Dependencies:** Approval to add test dependencies; stable selectors; deterministic media fixtures; agreed browser support matrix; accessibility and performance acceptance thresholds from specialists 05, 06, 09, 10, and 11.
- **Objective verification method:** A fresh checkout must pass documented `test:unit`, `test:component`, and `test:e2e` scripts in CI. The blocking suite must exercise both routes, 404, critical modal/media/keyboard/touch states, and intentional failure fixtures. CI must publish machine-readable results and coverage, and a deliberately broken critical journey on a test branch must make the gate fail.

### CI14-002 — Production deployment is not protected by review, branch, or environment policy

- **Severity:** `P1 high`
- **Affected:** `.github/workflows/cloudflare.yml:3-22`, `.github/workflows/cloudflare.yml:44-56`; GitHub `master` branch; GitHub `production` environment.
- **Evidence:** GitHub reports the only branch as `{"name":"master","protected":false}`. Branch-protection and ruleset APIs return HTTP 403 because the private repository/account tier does not enable those features. The `production` environment has `protection_rules: []`, `deployment_branch_policy: null`, and `can_admins_bypass: true`. Every push to `master` deploys automatically. `workflow_dispatch` is enabled and the deploy condition excludes only pull requests, so a manual run from another ref is not blocked by an explicit ref condition or environment branch policy. Six observed runs were direct push deployments; the repository has no pull-request history.
- **Reproduction steps:** (1) Run `gh api repos/MoIbrahim10/portfolio/branches`; observe `protected:false`. (2) Run `gh api repos/MoIbrahim10/portfolio/environments`; inspect `production` and observe no protection rules or branch policy. (3) Inspect workflow lines 3-10 and 44-56; observe push and manual triggers with no production approval or explicit `github.ref` deploy guard.
- **User/business impact:** A mistaken, compromised, or insufficiently reviewed commit can proceed from source to production using only compile/build checks. Manual dispatch can select an unintended ref. There is no enforced human checkpoint for a portfolio whose interactions and media are not automatically tested.
- **Likely root cause:** Deployment automation was optimized for direct, fast publishing in a private repository whose current GitHub plan does not expose branch protection/rulesets.
- **Recommended improvement:** Use a protected PR-only release path and a separately protected production environment requiring approval and a deployment branch/tag policy. Split validation from deployment. The deploy job should require all blocking checks, accept only the reviewed release SHA, explicitly reject any ref outside the allowed policy, and expose no production credential to validation jobs.
- **Safer alternatives / tradeoffs:** Best long-term: upgrade the GitHub plan or make the repository public if acceptable, then enforce branch/ruleset and environment protections. If the repository must remain private on the current plan, add an explicit workflow ref/SHA guard and a manual approval mechanism outside GitHub, but acknowledge that repository administrators can still bypass a convention-only review process. A manual-only deploy reduces accidental pushes but increases operational toil and is not equivalent to branch protection.
- **Estimated effort:** `M` — 0.5-2 days for workflow separation and policy setup; plan/procurement time excluded.
- **Dependencies:** Repository owner decision on visibility/plan; reviewer ownership; environment permission design; Cloudflare secret placement; release-branch or tag policy.
- **Objective verification method:** Attempt a direct push or manual dispatch from a non-approved branch in a safe test repository/ref and confirm production deployment is blocked. A reviewed PR with all required checks should be the only path to an approved release SHA, and GitHub should display required reviewers and allowed deployment branches/tags for `production`.

### CI14-003 — The post-deploy smoke test can pass despite a materially broken application

- **Severity:** `P1 high`
- **Affected:** `.github/workflows/cloudflare.yml:54-56`; `/`; `/video-player-lab`; all client chunks, media, hydration, navigation, and interactions.
- **Evidence:** The only post-deploy assertion is `curl ... https://m0code.com | grep -aFq '<title>MO — Portfolio</title>'`. It proves only that the root request is below HTTP 400 and contains one static title string. It does not request `/video-player-lab`, parse or fetch referenced CSS/JS, launch a browser, wait for hydration, inspect console/network errors, exercise controls, validate 404/500 behavior, or confirm that the response belongs to the just-deployed commit. The title is defined globally at `src/routes/__root.tsx:22`, so the same sentinel is not route-specific.
- **Reproduction steps:** (1) Inspect workflow lines 54-56. (2) Compare the command’s single URL/string with the two routes in `src/routes/index.tsx:5` and `src/routes/video-player-lab.tsx:5-7`. (3) Observe that no workflow step starts a browser or requests the HTML-referenced asset URLs.
- **User/business impact:** CI may report a successful production release when a JavaScript chunk is missing, hydration crashes, media cannot load, the lab route is down, or every interactive control is unusable. This creates a high-confidence false green at the most consequential gate.
- **Likely root cause:** A fast availability sentinel was treated as a release smoke test rather than one layer of a broader synthetic check.
- **Recommended improvement:** Keep the fast HTTP sentinel, then add a staged browser smoke suite against the exact deployment URL. Verify `/` and `/video-player-lab` status/title/content, load every critical JS/CSS chunk, fail on unexpected console/page/network errors, assert hydration and one critical interaction per route, verify the unknown-route 404, and compare an exposed non-secret build SHA/version with the expected commit. Run the same checks after custom-domain propagation.
- **Safer alternatives / tradeoffs:** A dependency-free interim shell check can request both routes, extract and request all local script/stylesheet URLs, test one known asset and the 404, and assert an `X-Build-SHA` or HTML build meta value. It is faster and simpler but cannot prove hydration or interaction behavior. Browser smoke adds time and occasional flake, which should be controlled with deterministic assertions rather than hidden by broad retries.
- **Estimated effort:** `M` — 1-3 days including deployment URL plumbing and stable smoke assertions.
- **Dependencies:** Browser runner approval; stable selectors; a deployment/build identifier; preview or version URL from Cloudflare; expected console-error allowlist (preferably empty).
- **Objective verification method:** In a nonproduction deployment, intentionally omit a referenced chunk or throw during hydration and confirm the smoke gate fails. A healthy release must show both routes loaded and hydrated, zero unexpected console/page errors, all critical requests successful, correct 404 status, one successful keyboard/pointer journey, and an exact expected build SHA.

### CI14-004 — The audited local release candidate has not passed the remote release pipeline and is not the live artifact

- **Severity:** `P1 high`
- **Affected:** Repository-wide local commit `ae1ec7c`; remote `master`; existing `dist`; production `https://m0code.com`.
- **Evidence:** Local `HEAD` is `ae1ec7cb0b1162be7c0aa01214ed5146f2321d7a`; `origin/master` and the latest successful deployment are `5d80cbf0d9e818f3e5cc4b65766a947bdcd7ad7c`. `git status --branch` reports `[ahead 1]`. The live root references `/assets/index-BTo1nZ1V.js`; the existing local `dist` contains `/assets/index-COTNhO9J.js`. The live local-dist asset returns HTTP 404. The current source passed only the local non-emitting TypeScript check in this audit; its production build and Worker dry run were intentionally not run.
- **Reproduction steps:** (1) Run `git rev-parse HEAD` and `git rev-parse origin/master`. (2) Run `gh run list --repo MoIbrahim10/portfolio`; observe the latest deployment SHA. (3) inspect the root HTML asset URL and compare it with `dist/client/assets`. (4) request the local-dist asset name from production; observe HTTP 404.
- **User/business impact:** Findings based on the current source cannot be assumed to describe the deployed build exactly, and the newest source changes have no remote build/dry-run evidence. Launch sign-off could accidentally mix evidence from two revisions.
- **Likely root cause:** Local changes were committed after the last production deployment, while no formal release-candidate SHA or provenance record was designated.
- **Recommended improvement:** Freeze and name one immutable release-candidate SHA. Run every blocking check against that SHA, build one artifact, promote that artifact, and make the expected SHA visible in the deployment record and non-secret runtime metadata. Attach each audit sign-off to the same SHA.
- **Safer alternatives / tradeoffs:** If `ae1ec7c` is intentionally work-in-progress, explicitly mark `5d80cbf` as the audited release candidate and repeat any source-dependent checks against it. That avoids publishing unfinished work but means the newest changes remain outside launch scope.
- **Estimated effort:** `S` — under 0.5 day once the intended candidate is selected; test remediation is separate.
- **Dependencies:** Owner selection of the intended release commit; authorization for any future push/PR/deploy; completion of the required gates.
- **Objective verification method:** At sign-off, `git rev-parse HEAD`, reviewed remote release SHA, build manifest SHA, GitHub deployment SHA, and live `/version` or equivalent build metadata must be identical. The artifact checksum must match the artifact produced by the approved CI run.

### CI14-005 — Build provenance, immutable promotion, and rollback evidence are absent

- **Severity:** `P2 medium`
- **Affected:** `.github/workflows/cloudflare.yml:19-56`; GitHub Actions artifacts/releases/tags; GitHub deployment `5655911137`; Cloudflare production Worker.
- **Evidence:** Build, dry-run, deploy, and smoke execute in one job/workspace. GitHub reports zero Actions artifacts, zero releases, and no tags. The deployment record identifies the source SHA but its `environment_url` is empty and no bundle checksum or Cloudflare Worker version is recorded in the repository. No rollback command, rollback selection rule, owner, or drill evidence exists.
- **Reproduction steps:** (1) Inspect workflow lines 19-56; observe one job with no upload/download or attestation step. (2) Run the GitHub artifacts API; observe `total_count:0`. (3) run `gh release list` and `git tag --list`; observe no output. (4) inspect deployment `5655911137`; observe source SHA and success but no environment URL or artifact checksum.
- **User/business impact:** A later rebuild of the same source may resolve mutable dependencies or tooling differently, and responders cannot prove which bytes are live. Rollback becomes an improvised dashboard/CLI action under incident pressure rather than a tested restoration of a known-good artifact.
- **Likely root cause:** The workflow treats the CI workspace as the release artifact and relies on platform deployment history rather than making provenance and recovery explicit.
- **Recommended improvement:** Build once in a validation job; package the exact `dist` output; record SHA-256 checksums, source SHA, Bun/tool versions, and dependency lock hash; retain the artifact under an explicit policy; and deploy only that artifact in an approval-gated job. Record the Cloudflare Worker version and custom-domain URL in the GitHub deployment. Add and safely rehearse a documented rollback to the previous known-good version.
- **Safer alternatives / tradeoffs:** A leaner approach can retain only the manifest/checksums and Cloudflare version ID while relying on Cloudflare’s version history. This costs less storage but provides weaker independent reproducibility. Rebuilding for rollback is simplest but is not deterministic enough for incident recovery.
- **Estimated effort:** `M` — 1-3 days for artifact flow, manifest, retention, and rollback rehearsal.
- **Dependencies:** Cloudflare version/deployment capabilities and retention policy validation by specialist 13; artifact retention decision; release ownership; optional provenance/attestation tooling review by specialist 04.
- **Objective verification method:** From a clean runner, deploy the retained candidate artifact without rebuilding and compare its checksum/version to production. In a nonproduction environment, deploy release N+1, roll back to retained release N, and prove the expected SHA, assets, and smoke journeys are restored within the target recovery time.

### CI14-006 — In-progress obsolete releases cannot be superseded

- **Severity:** `P2 medium`
- **Affected:** `.github/workflows/cloudflare.yml:15-17`; all push/manual deployment runs.
- **Evidence:** All production work shares `group: cloudflare-production` and explicitly sets `cancel-in-progress: false`. Validation and production deployment are one job, so a newer commit cannot cancel a currently running older build before that older job reaches the deployment step. The six observed pushes each produced a production deployment.
- **Reproduction steps:** (1) Inspect workflow lines 15-17 and 19-56. (2) Observe that the same job performs validation and deployment. (3) Compare the deployment list; each observed push SHA has a production deployment record.
- **User/business impact:** During rapid fixes, an already superseded commit may still finish and reach production before the newest candidate, creating an unnecessary transient release and delaying the intended fix. A bad in-progress release cannot be stopped automatically by a correcting push.
- **Likely root cause:** Concurrency was configured to serialize production safely, but validation and deploy were not separated and no “still latest approved SHA” check precedes deployment.
- **Recommended improvement:** Use cancelable concurrency for validation jobs, a separate non-cancelable production promotion job, and a final guard that confirms the candidate is still the approved/latest release SHA before deployment. Promote one queued immutable artifact at a time.
- **Safer alternatives / tradeoffs:** Keeping non-cancelable deploys protects an in-progress production mutation from interruption. If the workflow remains monolithic, add a pre-deploy latest-SHA check; this is smaller but still wastes validation time and needs careful semantics for intentional rollback releases.
- **Estimated effort:** `S` — 0.5-1 day after artifact/job separation is designed.
- **Dependencies:** CI14-005 artifact split; release ordering policy; explicit handling for intentional older-version rollback.
- **Objective verification method:** In a nonproduction concurrency test, dispatch candidate A, then supersede it with B before A deploys. A must not reach the environment, B must deploy once, and the deployment record must show only the approved artifact SHA. Separately verify that an intentional rollback artifact can bypass the “latest commit” rule through a documented approval path.

## Risks / Unverified

### CI14-R01 — Workflow action code is referenced by mutable tags

- **Severity:** `P2 medium`
- **Affected:** `.github/workflows/cloudflare.yml:24-30`, `.github/workflows/cloudflare.yml:44-52`; GitHub Actions repository settings.
- **Evidence:** `actions/checkout@v4`, `oven-sh/setup-bun@v2`, and `cloudflare/wrangler-action@v4` use moving major-version tags rather than immutable commit SHAs. GitHub reports `allowed_actions:"all"` and `sha_pinning_required:false`. No evidence was gathered that these tags currently point to compromised code; this is a supply-chain risk, not a confirmed exploit.
- **Reproduction steps:** (1) Inspect workflow lines 24-30 and 44-52. (2) run the repository Actions permissions APIs; observe all actions allowed and SHA pinning disabled.
- **User/business impact:** A future upstream tag move or compromised action release could change privileged build/deploy behavior without a repository diff, including behavior that can access the production token during the deploy step.
- **Likely root cause:** Major tags were chosen for automatic maintenance and convenience; repository policy does not require immutable references.
- **Recommended improvement:** Pin third-party actions to reviewed full commit SHAs, document the corresponding release versions in comments, restrict allowed actions to approved owners/actions, and use controlled update automation with review.
- **Safer alternatives / tradeoffs:** GitHub-owned actions may remain on major tags under a documented trust policy while the privileged Cloudflare action is SHA-pinned first. This reduces maintenance but retains some mutable-code risk. Pinning requires regular, reviewed updates for security fixes.
- **Estimated effort:** `S` — 1-3 hours initially, plus periodic maintenance.
- **Dependencies:** Supply-chain policy from specialist 04; approved action allowlist; update ownership.
- **Objective verification method:** Repository settings require SHA pinning or policy checks reject mutable refs; every external `uses:` entry resolves to a 40-character reviewed commit; update PRs run the complete nonproduction gate before merge.

### CI14-R02 — The pull-request validation path has never been evidenced

- **Severity:** `P2 medium`
- **Affected:** `.github/workflows/cloudflare.yml:3-6`, `.github/workflows/cloudflare.yml:20-56`; GitHub pull-request/review process.
- **Evidence:** The workflow declares a `pull_request` trigger and skips deploy for PR events, but GitHub reports no open, closed, or merged pull requests. All six observed workflow runs are `event:"push"`. Therefore the PR trigger, fork/same-repository permission behavior, production-environment association, and deploy-skip path have not been empirically demonstrated.
- **Reproduction steps:** (1) Run `gh pr list --state all`; observe `[]`. (2) inspect `gh run list`; observe six push runs and no PR runs. (3) inspect workflow lines 3-6 and 44-56 for the intended PR behavior.
- **User/business impact:** Enabling a PR-required process at the last moment may expose permission, secret, environment, or condition errors that delay release or accidentally run the wrong job path.
- **Likely root cause:** Development has used direct pushes to `master`, so the declared PR path is configuration without operational history.
- **Recommended improvement:** After protections are designed, open a safe nonproduction validation PR and prove the full PR path: frozen install, checks, build, dry run, no production credential exposure, and deploy step skipped. Add a workflow-level test or policy lint for event/ref conditions.
- **Safer alternatives / tradeoffs:** A temporary branch-only dispatch can exercise most validation steps without creating a PR, but it cannot validate PR token/secrets/permission semantics.
- **Estimated effort:** `S` — under 0.5 day.
- **Dependencies:** CI14-002 policy decision; a harmless test change/ref; repository owner approval for future PR activity.
- **Objective verification method:** A GitHub Actions run with `event:"pull_request"` completes all intended validation checks, shows the deploy and production-smoke steps skipped, and has no access to the production token. A failed check must block merge once branch rules are enabled.

### CI14-R03 — Generated route-tree drift is not explicitly gated

- **Severity:** `P2 medium`
- **Affected:** `package.json:10`; `src/routeTree.gen.ts`; `.github/workflows/cloudflare.yml:32-42`.
- **Evidence:** The generated route tree is tracked and a `generate-routes` script exists, but CI does not explicitly run it and fail on a resulting Git diff. A build was not run in this audit, so whether the current plugin version regenerates the file as a build side effect was intentionally not tested.
- **Reproduction steps:** (1) Inspect `package.json:10`. (2) confirm `src/routeTree.gen.ts` is tracked. (3) inspect workflow lines 32-42 and observe no explicit generation or cleanliness assertion.
- **User/business impact:** A route addition/removal can be reviewed with stale generated code, or CI can silently generate a route tree that differs from the committed source. Either outcome weakens reproducibility and review evidence.
- **Likely root cause:** Route generation is assumed to be handled by development/build tooling, with no explicit generated-file consistency contract in CI.
- **Recommended improvement:** In validation CI, run the pinned route generator and then fail if `src/routeTree.gen.ts` differs from the reviewed commit. Decide and document whether generated output is committed; enforce that single policy.
- **Safer alternatives / tradeoffs:** Stop committing the generated file and always generate it in a deterministic build. This avoids source drift but makes reviews less explicit and requires generator availability in every environment. Keeping it committed with a diff gate is clearer for this small repository.
- **Estimated effort:** `S` — 1-2 hours.
- **Dependencies:** Confirmation of TanStack Router generator behavior/version; no source change is authorized by this audit.
- **Objective verification method:** In a test branch, add or remove a route without updating `routeTree.gen.ts`; CI must fail with a generated-file diff. Updating the generated file with the approved tool must make the gate pass and leave `git status` clean.

### CI14-R04 — CI has no explicit execution timeout or fixed runner image

- **Severity:** `P3 low`
- **Affected:** `.github/workflows/cloudflare.yml:20-22`.
- **Evidence:** The job uses `runs-on: ubuntu-latest` and has no `timeout-minutes`. No hung run occurred in the six-run sample, and all completed successfully, so this is a resilience/drift risk rather than a current failure.
- **Reproduction steps:** Inspect workflow lines 20-22 and confirm the absence of a job timeout and a versioned Ubuntu label.
- **User/business impact:** Tool or network hangs can occupy the sole production concurrency slot longer than intended. Changes to the `ubuntu-latest` image can alter builds without a repository change, increasing release variance.
- **Likely root cause:** Default runner and timeout behavior were accepted for a short workflow.
- **Recommended improvement:** Set an evidence-based job timeout with margin over the measured healthy duration, and use a deliberate runner image version. Monitor and update the image through reviewed changes.
- **Safer alternatives / tradeoffs:** Keep `ubuntu-latest` to receive platform updates automatically, but pin all toolchains and retain a timeout. A fixed image reduces surprise but requires maintenance before deprecation.
- **Estimated effort:** `XS` — under 1 hour.
- **Dependencies:** Agreed maximum deployment duration; runner support horizon.
- **Objective verification method:** A deliberately hanging nonproduction step is canceled at the configured timeout; ordinary runs remain comfortably below it. Runner image changes appear as reviewed workflow diffs.

## Opportunities

### CI14-O01 — Establish a risk-based browser matrix instead of one oversized blocking suite

- **Severity:** `P2 medium`
- **Affected:** `/`; `/video-player-lab`; future CI job topology.
- **Evidence:** There is currently no browser automation, while the source contains pointer, scroll, keyboard, responsive, observer, modal, and media paths across both routes. Running every permutation on every commit would be expensive; running none leaves the highest-risk behavior unguarded.
- **Reproduction steps:** Review the coverage inventory above and compare it with the workflow’s existing type-check/build-only steps.
- **User/business impact:** A tiered matrix can catch high-value regressions quickly without making every pull request wait for the full cross-browser/performance suite.
- **Likely root cause:** No release test topology has yet been defined.
- **Recommended improvement:** Use three tiers: (1) per-PR unit/component plus Chromium desktop/mobile critical smoke; (2) post-merge WebKit/Firefox, keyboard, reduced-motion, offline/media-failure, visual, and accessibility regression; (3) scheduled full responsive/cross-browser/link/media/performance sweep. Keep production deployment blocked by tier 1 and selected high-risk tier 2 checks.
- **Safer alternatives / tradeoffs:** Make the full matrix blocking for maximum confidence, accepting slower feedback and higher runner cost. A nightly-only broad matrix is cheaper but permits a known regression window.
- **Estimated effort:** `M-L` — 3-7 days after the base test harness exists.
- **Dependencies:** CI14-001; browser support policy; baseline ownership; flake quarantine policy that never suppresses real errors.
- **Objective verification method:** CI documentation maps every critical behavior to a named test and cadence. Measured PR gate duration meets the team target, the scheduled matrix covers all supported browsers/viewports, and no failing required test can be bypassed without a recorded approval.

### CI14-O02 — Publish one machine-readable release manifest and gate summary

- **Severity:** `P3 low`
- **Affected:** CI job summary, build artifact, GitHub deployment, production runtime metadata.
- **Evidence:** Evidence is currently split across Git commit, workflow logs, deployment API, and hashed assets. The environment URL is empty and the live HTML does not expose a build identity, making sign-off reconstruction manual.
- **Reproduction steps:** Compare the release-identity table above; observe that no single record binds source SHA, lock hash, build checksum, Worker version, tests, and live URL.
- **User/business impact:** A compact manifest reduces audit time, avoids sign-off against mixed revisions, and shortens incident diagnosis.
- **Likely root cause:** Release metadata was not part of the initial deploy workflow.
- **Recommended improvement:** Generate a non-secret JSON manifest containing source SHA, lockfile hash, build timestamp, tool versions, artifact checksums, Worker version, test report links, and release URL. Attach it to the retained artifact/deployment and expose only safe identity fields at a runtime endpoint or response header.
- **Safer alternatives / tradeoffs:** A GitHub job summary alone is simpler but cannot be queried from production. A runtime header alone proves identity but does not retain test and artifact evidence.
- **Estimated effort:** `S` — 0.5-1 day after artifact provenance exists.
- **Dependencies:** CI14-005; privacy review of exposed fields; Cloudflare deployment/version output.
- **Objective verification method:** One command against the release record and live URL returns matching source/artifact/version identifiers, and the manifest links to all required passing gate reports.

## False Positives

### CI14-FP01 — Test-like files under `.agents/skills/**` are not application coverage

- **Severity:** `P3 low`
- **Affected:** `.agents/skills/nextjs-framer-motion-animations/assets/evaluation-pack/**`; `.agents/skills/ui-design/direction/testing.md`.
- **Evidence:** Broad filename/content searches find fixture packages, `trigger-tests.json`, and testing guidance under `.agents/skills/**`. None imports application source, is referenced by `package.json`, or runs in `.github/workflows/cloudflare.yml`.
- **Reproduction steps:** Compare broad repository search results with `package.json:8-33` and workflow lines 32-42; observe no execution path from product scripts/CI to these skill assets.
- **User/business impact:** Counting these files as tests would overstate release confidence and conceal CI14-001.
- **Likely root cause:** The repository contains local agent-skill resources alongside application source.
- **Recommended improvement:** Exclude `.agents/**` from future product test inventory and report product coverage only from application-owned runners/configuration.
- **Safer alternatives / tradeoffs:** Move skill resources outside the repository in a separately authorized change; this clarifies inventory but changes developer tooling layout and is not needed to solve the release gap.
- **Estimated effort:** `XS`
- **Dependencies:** None for audit classification.
- **Objective verification method:** A future product test command must list executed application test files and produce coverage against `src/**`; no `.agents/**` fixture may be counted.

### CI14-FP02 — The legacy commit-status API’s `pending` value does not mean the latest Actions job failed

- **Severity:** `P3 low`
- **Affected:** GitHub commit `5d80cbf0d9e818f3e5cc4b65766a947bdcd7ad7c`.
- **Evidence:** The legacy combined-status endpoint returns `state:"pending", total_count:0`, while the Check Runs API reports `validate-and-deploy` as completed/success and Actions run `30444677550` shows every step successful. The absent legacy status contexts must not be read as a CI failure.
- **Reproduction steps:** Query both `/commits/5d80cbf.../status` and `/commits/5d80cbf.../check-runs`; compare the results.
- **User/business impact:** Using the wrong API can falsely classify a healthy workflow run or create an invalid release dashboard.
- **Likely root cause:** GitHub Commit Statuses and Checks are separate reporting systems; this workflow publishes a Check Run, not legacy status contexts.
- **Recommended improvement:** Use Actions run conclusions or Check Runs/check-suite rollups for release evidence.
- **Safer alternatives / tradeoffs:** Publish an explicit legacy status context as well, but that duplicates state and requires write permissions.
- **Estimated effort:** `XS`
- **Dependencies:** Read access to Check Runs/Actions.
- **Objective verification method:** Release tooling reports the same successful conclusion as run `30444677550` and does not treat zero legacy contexts as failure or success.

## Passed Checks

These are narrow evidence-backed passes, not substitutes for the absent tests:

- `bun run check` passed against local `HEAD` `ae1ec7c` with `tsc --noEmit`.
- `node --check dist/server/server.js` passed for the existing local ignored server bundle.
- The latest remote run `30444677550` completed successfully for commit `5d80cbf`; frozen install, type-check, build, Worker dry run, deploy, and the title sentinel all reported success.
- The GitHub deployment record `5655911137` ended in `success` for commit `5d80cbf`.
- The six available workflow runs all completed successfully; no failed run was hidden or reclassified.
- The CI runtime is pinned through `.bun-version` (`1.3.10`), and CI uses `bun install --frozen-lockfile`.
- Workflow token permissions are explicitly `contents: read`; repository default workflow permission is also read.
- Production runs share one concurrency group, preventing simultaneous jobs in this workflow from deploying concurrently.
- Live `HEAD /` returned HTTP 200.
- Live `HEAD /video-player-lab` returned HTTP 200.
- Live `HEAD /__prelaunch-nonexistent-14` returned HTTP 404.
- The JavaScript asset referenced by the live root HTML returned HTTP 200.

## Not Tested

- The current local commit was **not rebuilt** and its Worker bundle was **not** dry-run validated because the specialist brief prohibited builds. The existing `dist` was only inventoried and syntax-checked.
- No dependency installation, route generation, test runner, browser runner, snapshot tool, or coverage tool was invoked.
- No GitHub workflow, pull request, deployment, rollback, release, tag, external write, or Cloudflare mutation was triggered.
- The PR execution path was not tested; no historical PR run exists.
- Production secret values, Cloudflare token scopes, dashboard-only settings, Worker version history, and manual rollback capability were not inspected.
- No failure injection was performed against production: missing chunks, hydration exceptions, media rejection, offline, Slow 3G, 500, DNS/TLS/CDN failure, or stale-cache behavior.
- Interactive browser behavior, responsive/touch/cross-browser behavior, accessibility, performance, security, SEO, PWA, and content quality were not re-audited here; their absence from CI was inventoried, while runtime findings belong to specialists 03, 05-13, and 15.
- Live HTTP success does not prove browser rendering, JavaScript execution, media playback, keyboard behavior, or lack of console/network errors.
- The live asset was not cryptographically bound to deployment `5d80cbf`; that link remains unverified until build identity/provenance is exposed.

## Launch acceptance gate

### Current decision

**Block launch sign-off for tests/CI/release readiness** until CI14-001 through CI14-004 are resolved and objectively verified. CI14-005 and CI14-006 should be resolved before treating the deployment process as repeatable and recoverable.

### Required release sequence

1. **Select one candidate:** record one immutable SHA; require local review source, remote release ref, CI checkout, artifact manifest, GitHub deployment, and live build identifier to match.
2. **Enforce review:** prevent direct or non-approved-ref production deploys; require reviewed PR checks and protected environment approval.
3. **Validate deterministically:** frozen install; generated-route cleanliness; type-check; lint; unit/component/SSR tests; application-owned coverage thresholds.
4. **Exercise critical behavior:** blocking browser smoke for both routes and 404, including hydration, console/network cleanliness, keyboard, modal focus, project navigation, media ready/error/autoplay rejection, and desktop/mobile layouts.
5. **Apply specialist gates:** zero unresolved P0/P1 security/accessibility/SEO/content/runtime findings; agreed Lighthouse/bundle thresholds; dependency/license/secrets checks; broken-link/media checks.
6. **Build once:** create and retain an immutable checksummed artifact and release manifest; dry-run that exact Worker bundle.
7. **Stage first:** deploy the exact artifact to a nonproduction/version URL and run the complete smoke suite without suppressing errors.
8. **Approve and promote:** deploy the same artifact to production only after environment approval and latest-approved-SHA verification.
9. **Verify production:** check both routes, unknown-route 404, critical chunks/assets, browser hydration and interactions, expected build SHA/version, and zero unexpected errors.
10. **Prove recovery:** record the previous known-good version and complete a nonproduction rollback drill within the agreed recovery-time objective.

### Objective acceptance criteria

- Zero open `P0 blocker` or `P1 high` findings in the master prelaunch report.
- 100% of named critical journeys pass; code coverage meets an agreed floor (recommended starting point: at least 80% lines/statements/functions and 70% branches, with higher branch coverage for state-heavy rail/media logic).
- Required PR checks cannot be bypassed by a normal contributor, and a non-approved ref cannot target production.
- Browser gate covers at least Chromium desktop/mobile per PR; supported WebKit/Firefox and the full responsive/accessibility/network matrix pass before final launch.
- No unexpected browser console errors, page errors, failed critical requests, hydration mismatches, broken local links, or missing critical media in the candidate smoke run.
- The retained artifact checksum, source SHA, GitHub deployment SHA, Cloudflare Worker version, and live build identifier match.
- Production post-deploy checks pass without relying only on retries or a static title.
- A documented owner can restore the previous known-good artifact within the agreed rollback objective, with drill evidence attached to the release.

## Implementation tracking — ITEM-01

- **Status:** `Complete — verified in production` (2026-07-31).
- **Local gates passed:** route generation, `bun run check`, `bun run build`, SSR assertions (`/` `200`, retired path `404`), absence of lab strings/chunks, retained-file hash comparison, and focused retained-video browser smoke.
- **Disposition:** the release route matrix is now `/` plus a required `/video-player-lab` negative assertion and generic 404 coverage. The release-drift premise of `CI14-004` is resolved for this release; `CI14-001`, `CI14-003`, `CI14-005`, and broader CI/release-control findings remain open. Manual evidence does not replace automated gates.
- **Production evidence:** PR #1 validation passed; merge SHA `c273f81…` passed Actions run `30657215155` and deployed as Cloudflare version `b8c0dab8…`. Public `404`, homepage assets, retained-video playback, and console health passed independent checks.
