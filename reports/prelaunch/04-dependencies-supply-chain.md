# 04 — Dependencies, Supply Chain, Secrets, and Licensing

Audit snapshot: `2026-07-29T14:44:28Z`
Repository: `/Users/mo/Documents/porfolio`, `master` at `ae1ec7c` (`origin/master` at `5d80cbf`)
Production sampled: `https://m0code.com`

## Scope and method

This was a read-only audit. No install, update, build, audit fix, lifecycle script, dependency change, configuration change, commit, staging operation, or external write was performed. Manifest/lock checksums were recorded before and after the advisory query and were unchanged.

Examined:

- `package.json`, `bun.lock`, `.bun-version`, `skills-lock.json`, `.gitignore`, `vite.config.ts`, `tsconfig.json`, `tsr.config.json`, `wrangler.jsonc`, and `.github/workflows/cloudflare.yml`.
- The installed dependency tree with Bun 1.3.10, package metadata and lifecycle-script status, dependency imports/usages, Git dependency/submodule surfaces, tracked files, and all 12 local Git commits.
- Existing `dist/` (132 files), live HTML and JavaScript assets, predictable source-map/sensitive-file URLs, external script origins, and secret-pattern matches without printing candidate values.
- Current npm registry metadata for all 15 direct dependencies, GitHub repository license metadata for the 11 skill sources, and Bun's read-only npm advisory query.

Inventory:

| Surface | Evidence |
|---|---|
| Package manager | Bun `1.3.10`; exact version in `.bun-version:1`; CI reads it at `.github/workflows/cloudflare.yml:27-30` |
| Direct dependencies | 8 runtime + 7 development = 15 |
| Locked graph | 204 package records; all 204 include SHA-512 integrity; no Git/URL package sources |
| Installed license metadata | 146 unique installed package versions; 121 MIT, 11 ISC, 4 MPL-2.0, 3 Apache-2.0, 3 BSD-3-Clause, 1 Python-2.0, 1 CC-BY-4.0, 1 Unlicense, 1 0BSD; none missing |
| Vendored agent skills | 12 entries from 11 GitHub repositories, 187 files under `.agents/skills/` |
| Live executable assets | Two same-origin main JavaScript bundles sampled (316,836 and 182,828 bytes); no third-party script origin |
| Advisory result | `bun audit --json` returned `{}` with exit 0; see [Bun audit behavior and coverage](https://bun.com/docs/pm/cli/audit) |

Severity describes launch risk, not certainty. Licensing observations are engineering risk identification, not legal advice.

## Confirmed Issues

### DEP-001 — P1 high — Production workflow actions use mutable major tags

- **Affected:** Production deployment pipeline, `.github/workflows/cloudflare.yml:25`, `:28`, `:46-52`.
- **Evidence:** `actions/checkout@v4`, `oven-sh/setup-bun@v2`, and `cloudflare/wrangler-action@v4` are tags, not immutable full commit SHAs. The Cloudflare action directly receives `CLOUDFLARE_API_TOKEN` and the account identifier. GitHub states that a full-length commit SHA is the only immutable action reference; see [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use).
- **Reproduction:** Run `rg -n 'uses:' .github/workflows/cloudflare.yml`; compare each reference with the 40-hex-character SHA form required by GitHub's immutable-reference guidance.
- **User/business impact:** A compromised or moved upstream tag can execute in the production job. The deploy action has access to deployment credentials, so impact can include malicious deployment, secret theft, downtime, or defacement.
- **Likely root cause:** Convenient major-version tags were selected when the initial deployment workflow was created.
- **Recommended improvement:** Review the source and release provenance of each action, then pin every action to a verified full commit SHA with an adjacent version comment. Restrict allowed actions and require full-SHA pinning in repository/organization policy where available.
- **Safer alternatives/tradeoffs:** Pinning exact release tags is easier to read but still mutable. Replacing third-party actions with reviewed CLI commands reduces action code but moves trust to package downloads and requires equivalent credential isolation. Full SHAs require an update process.
- **Estimated effort:** Small (2–4 hours, including review and a non-production workflow run).
- **Dependencies:** Repository Actions-policy access; vetted upstream release SHAs; Dependabot or another controlled updater for `github-actions`.
- **Objective verification:** All `uses:` entries resolve to reviewed 40-character SHAs; policy rejects a tag-only test workflow; a pull-request dry run passes; production deployment succeeds with no broader token permissions.

### DEP-002 — P2 medium — Two direct runtime dependencies are declared as `latest`

- **Affected:** Dependency resolution, `package.json:17-18`, mirrored at `bun.lock:9-10`; locked records at `bun.lock:153-155`.
- **Evidence:** `@tanstack/react-router` and `@tanstack/react-start` use `"latest"` rather than a controlled version range. The current lock resolves them to `1.170.18` and `1.168.32` respectively. The frozen CI lock prevents drift today, but a deliberate lock refresh or non-frozen install re-evaluates the mutable registry tag. npm documents that installs select versions satisfying manifest specifications; see [dependency specifications](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package.json-file/).
- **Reproduction:** Run `rg -n '"latest"' package.json bun.lock`, then `bun pm ls --all | rg '@tanstack/react-(router|start)'`.
- **User/business impact:** A routine refresh can absorb an unreviewed breaking, compromised, or incompatible release. This is particularly sensitive because TanStack Start supplies routing, SSR, and server runtime behavior.
- **Likely root cause:** Early-stage framework setup optimized for current releases instead of controlled upgrade cadence.
- **Recommended improvement:** Pin reviewed direct TanStack versions (prefer exact versions for maximum reproducibility), update the lock in a dedicated reviewed change, and upgrade the TanStack family together with build, SSR, route-generation, and browser regression checks.
- **Safer alternatives/tradeoffs:** Tilde ranges accept patch fixes with less churn but permit some drift during lock updates; caret ranges accept minor releases. Keeping `latest` is workable only with mandatory frozen installs and tightly reviewed lock diffs, but remains needlessly broad.
- **Estimated effort:** Small (1–3 hours for metadata change and validation; more if the chosen upgrade exposes incompatibilities).
- **Dependencies:** Authorization to change dependency metadata; complete route/build test coverage; coordination with framework upgrade notes.
- **Objective verification:** `package.json` contains no `latest` tags; a clean frozen install resolves exactly the reviewed graph; generated routes, type-check, production build, SSR smoke tests, and all route tests pass.

### DEP-003 — P2 medium — CI executes Wrangler outside the project lock

- **Affected:** Pull-request and production bundle validation, `.github/workflows/cloudflare.yml:41-42`; deployment tooling at `:46-52`.
- **Evidence:** `bunx wrangler@4.114.0 deploy --dry-run` fetches/executes a package that is absent from `package.json` and `bun.lock`. The top-level Wrangler version is exact, but its downloaded package graph and integrity are not represented in the reviewed project lock or covered by this repository's `bun audit` result. The later deploy action is additionally subject to DEP-001.
- **Reproduction:** Run `rg -n 'wrangler|bunx' package.json bun.lock .github/workflows/cloudflare.yml`; Wrangler appears only in the workflow, not the project dependency records.
- **User/business impact:** CI executes registry-delivered code that cannot be reviewed through the committed lock diff, weakening reproducibility and supply-chain review immediately before deployment.
- **Likely root cause:** Keeping a deployment-only CLI out of project dependencies simplified initial setup.
- **Recommended improvement:** After approval, add the reviewed Wrangler version as a development dependency, commit its locked transitive graph, and invoke the locked binary through a package script. Audit it with the rest of the graph.
- **Safer alternatives/tradeoffs:** A pinned, reviewed Cloudflare action can manage Wrangler but still delegates package acquisition to that action. Retaining `bunx` avoids a larger lockfile but should be paired with provenance verification and an isolated, least-privilege job.
- **Estimated effort:** Small (1–3 hours plus lock review).
- **Dependencies:** Approval to add a dependency; Cloudflare compatibility validation; CI dry run.
- **Objective verification:** Wrangler is present at an exact reviewed version in `package.json` and `bun.lock`; CI contains no network-resolving `bunx wrangler`; a clean frozen install plus locked dry run passes; the advisory/SBOM output includes Wrangler.

### DEP-004 — P2 medium — CI has no dependency, secret, license, or SBOM gate

- **Affected:** Pull requests and production releases, `.github/workflows/cloudflare.yml:19-56`; repository-wide dependency and secret governance.
- **Evidence:** The only workflow installs with a frozen lock, type-checks, builds, dry-runs, deploys, and smoke-checks. There is no committed Dependabot configuration, dependency-review gate, `bun audit` step, secret scanner, SBOM generation, license policy, or provenance/attestation step. The manual audit passed only for this snapshot.
- **Reproduction:** Run `git ls-files '.github/*' '.github/**/*'` and inspect the sole workflow; search with `rg -n 'audit|dependabot|secret|license|sbom|attest|provenance|dependency-review' .github package.json`.
- **User/business impact:** A future vulnerable package, leaked credential, prohibited license, or unexpected transitive addition can merge and deploy without an automated stop or review artifact.
- **Likely root cause:** CI was scoped to functional build/deploy readiness, not supply-chain policy.
- **Recommended improvement:** Add reviewed, pinned checks for npm advisories, dependency diffs, secret scanning, SPDX/CycloneDX SBOM generation, and an allow/deny license policy. Run fast checks on pull requests and a scheduled full scan; retain artifacts and fail on agreed severity/policy thresholds.
- **Safer alternatives/tradeoffs:** Native GitHub Dependabot, dependency graph, and secret scanning reduce custom maintenance but availability depends on repository plan/settings. A scheduled report-only phase reduces false-positive disruption but does not prevent risky merges.
- **Estimated effort:** Medium (1–2 days including policy decisions and baseline triage).
- **Dependencies:** Repository security-feature access; approved scanners pinned by SHA/version; severity and license policy; ownership for alert response.
- **Objective verification:** A pull request adding a known test advisory, disallowed test license, or documented fake-secret fixture is blocked; clean main passes; SBOM contains every locked production component; scheduled scans create owned alerts; no production secret is exposed to scan-only jobs.

## Risks / Unverified

### DEP-R01 — P2 medium — Vendored skill licensing and provenance are incomplete

- **Affected:** Developer-tool supply chain, `skills-lock.json:3-75`, all 187 tracked files under `.agents/skills/`.
- **Evidence:** Twelve skills are copied from 11 GitHub repositories. `skills-lock.json` records repository names and content hashes but no source commit/tag. Only `.agents/skills/nextjs-framer-motion-animations/LICENSE.txt` is a vendored license file; two skill manifests declare MIT. GitHub's current repository metadata reports no detectable repository license for `oerlellijk/design-system-skill`, `tristanmanchester/agent-skills`, and `vercel-labs/agent-skills`; eight other source repositories report MIT or Apache-2.0. Repository-level metadata may not describe every nested file, so permission status remains unverified.
- **Reproduction:** Run `nl -ba skills-lock.json`, `find .agents/skills -type f | wc -l`, and `find .agents/skills -type f \\( -iname 'LICENSE*' -o -iname 'NOTICE*' \\)`. Query each listed source's `/license` endpoint in the GitHub API.
- **User/business impact:** Unclear copying/redistribution rights can create legal exposure if the private repository is shared or published. Moving upstream branches and unverified source revisions also weaken the ability to prove where instruction/script content came from.
- **Likely root cause:** The skill installer copied selected content and a computed hash but did not preserve complete licensing/provenance records.
- **Recommended improvement:** Confirm permission for every source and file with counsel/owners; preserve applicable license and notice texts; record immutable source commits and retrieval dates; validate vendored bytes against an approved provenance manifest; isolate or remove content lacking permission after approval.
- **Safer alternatives/tradeoffs:** Keep skills outside the product repository in a controlled developer-tool registry, reducing repository distribution scope but adding setup complexity. Rewriting functionality avoids uncertain licensing but is higher effort and must avoid derivative copying.
- **Estimated effort:** Medium (1–3 days; potentially longer for permissions).
- **Dependencies:** Legal/owner determination; upstream source access; installer capabilities; authorization before any removal or relocation.
- **Objective verification:** Every vendored skill maps to an immutable source revision, approved license/permission record, required notice text, and matching content hash; CI detects unauthorized drift; counsel/owner signs off on the inventory.

### DEP-R02 — P2 medium — Distributed bundle notice obligations are not documented

- **Affected:** Browser and Worker artifacts, local `dist/` and live `/assets/*.js`; repository licensing records.
- **Evidence:** All 146 installed package versions expose license metadata, including permissive licenses with notice conditions and four MPL-2.0 build-tool records. Local `dist/` contains zero LICENSE/NOTICE/COPYING files; the sampled live bundles contain zero `@license`, `MIT License`, or `Copyright (c)` markers. No root third-party notice, SBOM, or license policy exists. Whether separate notices are legally required for this specific hosted distribution needs legal review.
- **Reproduction:** Inventory installed `node_modules/**/package.json` license fields; run `find dist -type f \\( -iname 'LICENSE*' -o -iname 'NOTICE*' \\)`; inspect live bundle text for retained license markers.
- **User/business impact:** Missing legally required notices or source-offer obligations can delay launch, create takedown/compliance risk, or complicate customer/vendor review.
- **Likely root cause:** The build focuses on minification and deployment without a license-compliance output step.
- **Recommended improvement:** Generate an SBOM and reviewed third-party notices from the locked production graph, distinguish shipped runtime code from build-only tools, publish or package notices as counsel directs, and enforce an approved-license policy.
- **Safer alternatives/tradeoffs:** Preserve license banners in bundles for direct attribution but increase bytes and may miss non-banner obligations. A separate notices page/file is compact and auditable but must stay synchronized.
- **Estimated effort:** Medium (0.5–2 days plus legal review).
- **Dependencies:** Production-graph tooling; legal policy; deployment/content placement decision; resolution of DEP-004.
- **Objective verification:** An SBOM matches the locked production closure; every shipped component has a reviewed license classification and required notice/source handling; deployed notices are reachable or packaged as approved; CI fails on unknown/disallowed licenses.

### DEP-R03 — P2 medium — Exact production dependency provenance cannot be independently verified

- **Affected:** `https://m0code.com`, local `dist/`, `bun.lock`, deployment workflow.
- **Evidence:** Live asset hashes (`index-BTo1nZ1V.js`, `routes-DAvGpumd.js`) differ from local ignored `dist/` hashes (`index-COTNhO9J.js`, `routes-BXeiZRtJ.js`), which is expected when source revisions differ. HEAD is one commit ahead of `origin/master`, while `package.json` and `bun.lock` hashes are identical across those commits. Live bundles publish neither source maps nor a build/SBOM identifier, so the audited lock can be correlated with the workflow but not cryptographically tied to the exact deployed bytes.
- **Reproduction:** Compare asset URLs from live HTML with `find dist/client/assets -type f`; run `git diff origin/master..HEAD -- package.json bun.lock`; inspect live JavaScript for a build identifier or source-map reference.
- **User/business impact:** Incident response and vulnerability triage cannot conclusively answer which package graph produced a live artifact, increasing time to assess exposure or roll back.
- **Likely root cause:** Deployment emits content-hashed assets but no signed provenance, SBOM association, or public/internal release identifier.
- **Recommended improvement:** Generate an SBOM and build metadata from the frozen lock, associate them with the commit and deployed artifact digests, retain them as immutable CI artifacts, and add signed build provenance/attestation where supported.
- **Safer alternatives/tradeoffs:** A non-secret commit/build ID endpoint is simpler but proves correlation, not artifact integrity. Source maps improve debugging but can expose source; private artifact retention is safer than public maps.
- **Estimated effort:** Medium (1–2 days).
- **Dependencies:** CI artifact retention; deployment-platform metadata; SBOM format; signing/attestation identity; coordination with release/deployment audit.
- **Objective verification:** Given a production asset digest, an operator can retrieve a signed/immutable record containing source commit, Bun version, lock hash, dependency SBOM, build command, and deployment ID; a rebuild from that record produces the expected dependency graph.

### DEP-R04 — P3 low — Secret scanning coverage is heuristic and not continuous

- **Affected:** Tracked repository/history, ignored local files, CI secrets, local `dist/`, and live bundles.
- **Evidence:** Redacted pattern scans found zero high-confidence credential formats across 338 tracked files and all commits, zero in 132 `dist/` files, and zero in the two live JavaScript bundles. `.env` and `*.local` are ignored. However, `gitleaks`, Trivy, and OSV Scanner were unavailable, no entropy detector ran, and authenticated GitHub secret-scanning results/settings returned 401.
- **Reproduction:** Repeat the redacted format scan over `git ls-files`, each `git rev-list --all` commit, `dist/`, and fetched live bundles; check `command -v gitleaks trivy osv-scanner`; query authenticated repository security endpoints.
- **User/business impact:** An unrecognized token format, encoded secret, deleted historical value, ignored local file, CI log leak, or repository-host alert could be missed.
- **Likely root cause:** No repository-owned scanner/gate and no authenticated security-console access in this audit environment.
- **Recommended improvement:** Enable native secret scanning/push protection where available and add a vetted, pinned history-aware scanner with custom Cloudflare/provider patterns. Review CI logs and rotate any confirmed credential rather than merely deleting it.
- **Safer alternatives/tradeoffs:** Provider-native scanners understand token formats but do not cover every secret; entropy scanners improve breadth but need allowlists and careful log redaction.
- **Estimated effort:** Small–medium (0.5–1 day plus alert triage).
- **Dependencies:** Authenticated repository administration; approved scanner; provider inventory; secure rotation owner.
- **Objective verification:** Push protection blocks a documented fake-token fixture; a full-history scan completes with reviewed zero findings; GitHub security settings and alerts are accessible to named owners; CI logs expose no secret values under success and failure.

## Opportunities

### DEP-O01 — P3 low — Remove an apparently unnecessary direct router-plugin declaration

- **Affected:** Dependency manifest ownership, `package.json:19`; locked package at `bun.lock:171`; Vite integration at `vite.config.ts:1-6`.
- **Evidence:** `@tanstack/router-plugin` is not imported by application/configuration code and appears outside `package.json` only through the lock. `vite.config.ts` uses `@tanstack/react-start/plugin/vite`, and TanStack Start already pulls router-plugin transitively (`bun.lock:179`). Removing the direct declaration may not remove the package from the graph, but it eliminates misleading direct ownership.
- **Reproduction:** Run `rg -n '@tanstack/router-plugin' --glob '!node_modules/**' --glob '!bun.lock' .`; only the manifest declaration appears. Inspect the TanStack Start locked dependency record.
- **User/business impact:** A smaller, intentional direct-dependency surface improves upgrade review and reduces the chance of independently advancing a framework-internal package.
- **Likely root cause:** The plugin was retained from an earlier router setup or scaffold.
- **Recommended improvement:** After authorization, test removal from direct dependencies while retaining the transitive version selected by TanStack Start; do not force a separate version unless official integration requirements demand it.
- **Safer alternatives/tradeoffs:** Keep it direct with a comment/decision record if the project intentionally uses its public API or wants explicit version control. Removal improves clarity but may expose an undocumented peer/setup assumption during future upgrades.
- **Estimated effort:** Small (under 1 hour plus full framework validation).
- **Dependencies:** Authorization to change dependencies; route generation, type-check, build, SSR, and browser tests.
- **Objective verification:** The package is absent from direct manifest entries; frozen install, route generation, type-check, build, SSR smoke, and all route tests pass; dependency tree shows only the framework-required transitive instance.

## False Positives

- The broad manifest ranges do **not** currently make CI installs float: `.github/workflows/cloudflare.yml:33` uses `bun install --frozen-lockfile`, `.bun-version:1` pins Bun 1.3.10, and all 204 lock package records carry SHA-512 integrity. DEP-002 concerns future lock refresh/non-frozen workflows, not current frozen resolution.
- `wrangler.jsonc:6` and `.github/workflows/cloudflare.yml:49` contain a Cloudflare account **identifier**, not an API token. `.github/workflows/cloudflare.yml:48` contains a GitHub secret-context reference, not the secret value. Neither matched the redacted credential scan.
- The four MPL-2.0 records are Lightning CSS/build-platform packages in the installed build toolchain. Their presence alone does not make the application MPL or prove a compliance defect; shipped-file and notice obligations require production-closure analysis and legal review.
- Missing public source maps are not a secret exposure. Predictable live `.js.map` URLs returned 404, and local `dist/` contains no `.map` files.

## Passed Checks

- `bun audit --json` returned `{}` and exit 0 for the installed locked npm graph at the audit timestamp. Package/lock/skills-lock SHA-256 values were identical before and after. This is a point-in-time result, not proof of future safety.
- All 15 direct packages had current npm registry license metadata and no deprecation message. The locked versions, not registry `latest`, are the audited install basis.
- All 204 Bun lock package records contain SHA-512 integrity; no Git/URL dependencies, overrides, patches, workspaces beyond root, or Git submodules were found.
- `bun pm untrusted` reported zero untrusted dependencies with install scripts. No project install/prepare hooks exist in `package.json`.
- Redacted high-confidence secret-pattern scans found zero candidates in current tracked files, all Git commits, local `dist/`, or sampled live bundles; no candidate values were printed.
- `.gitignore:6-7` excludes `*.local` and `.env`. Live requests for `/.env`, `/.git/HEAD`, `/package.json`, and `/bun.lock` returned 404.
- Production HTML referenced no third-party executable script; sampled JavaScript was same-origin and contained no source-map reference.
- The root package has `"private": true` at `package.json:3`, reducing accidental registry publication risk.

## Not Tested

- Authenticated GitHub Dependabot, dependency-graph, secret-scanning, code-scanning, Actions policy, environment protection, and alert state: unauthenticated repository metadata returned 404 and security endpoints returned 401.
- npm package signature/provenance verification, GitHub Action source review, action-tag-to-SHA verification, and Cloudflare action/CLI transitive artifact integrity.
- A clean-room install or reproducible build: prohibited because it would install/write dependencies or build outputs. The existing installed tree and ignored `dist/` were inspected only.
- Full entropy/encoded-secret scanning, CI log review, local ignored-file contents, developer machines, GitHub/Cloudflare secret values, or credential validity. No secret values were accessed.
- Formal legal determination for npm packages, vendored skills, fonts, images, videos, brands, or portfolio project assets. This report inventories software/license signals only.
- Complete live Worker/server dependency extraction: production exposes minified client bundles but no SBOM, source map, build identifier, or authenticated deployment record.
