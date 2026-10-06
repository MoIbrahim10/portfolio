# Production Release and Recovery

Owner: repository owner / release operator  
Production: `https://m0code.com`  
Worker: `portfolio`  
Detection target: 15 minutes  
Rollback target: restore a known-good version within 15 minutes

## Candidate and promotion

1. Merge only after the `Cloudflare Candidate / build` pull-request job passes.
2. Wait for the resulting `main` push run to upload a version preview and pass HTTP plus the zero-retry browser acceptance matrices.
3. Record the successful candidate run ID, full SHA, preview URL, and version ID from its retained candidate manifest.
4. Dispatch `Promote Production` from `main`. Enter that run ID and SHA, then type `PROMOTE <full-sha>` exactly.
5. Production must promote the retained Cloudflare version without rebuilding, pass byte-level HTTP verification, and pass the same browser suite against `m0code.com`.

Production never deploys on push: an authenticated operator must manually dispatch an exact-current-main SHA whose candidate run succeeded.

## Monitoring and incident threshold

`Production Health` runs every 15 minutes and checks the homepage, emitted assets, security headers, generic and retired-route 404s, and MP4 availability while recording whether the edge returned `200` or `206`. Failure opens or updates one GitHub issue with the failing run and this runbook; recovery closes it. Cloudflare Workers Logs are enabled at 100% sampling for this low-traffic site. Review the rate after 30 days and lower it if volume or privacy requirements demand it.

Roll back when either condition is met:

- two consecutive synthetic failures affect a critical route or asset; or
- a release produces a confirmed hydration, interaction, error-rate, or media regression.

## Rollback

1. Open the last successful production release manifest and identify its Cloudflare version ID.
2. Confirm the current version in Cloudflare before dispatching `Roll Back Production`.
3. Enter current and target version IDs, a reason of at least 10 characters, and `ROLLBACK portfolio TO <target-version>` exactly.
4. The workflow refuses a stale current version, missing target, malformed confirmation, or concurrent production mutation.
5. After rollback it verifies the serving version, production health, and all 12 browser checks; retain the 90-day evidence artifact.
6. If rollback verification fails, keep the incident open and promote a separately tested forward fix. Do not rebuild an old commit during an incident.

This Worker binds `FEEDBACK_DB` to the private `portfolio-feedback` D1 database and uses `FEEDBACK_RATE_LIMITER` for submissions. Cloudflare rollback restores Worker code and static assets, but does not roll back postcards or D1 schema. Keep the feedback table when rolling back to a version without feedback support.

## Feedback storage and local preview

The `/feedback` page submits to `POST /api/feedback`. Only a successful D1 insert triggers the delivered state. Postcards contain the message, category, optional name, UUID, creation time, and visibility. Visibility defaults to `private` for existing records and clients that omit it. The page currently sends every postcard privately; there is no visibility control or public wall in the interface. IP addresses are used for rate limiting, not stored in D1.

`GET /api/feedback/public` returns only public records as `{ postcards, nextCursor }`, with up to 24 postcards containing `id`, `kind`, `message`, `name`, and `created_at`. Results sort by creation time and UUID descending. Pass the opaque `nextCursor` as the `cursor` query parameter to retrieve older cards; `null` means the end of the wall. This endpoint never selects private records and returns uncached results so newly published postcards can appear immediately. Repeating a submission UUID preserves its original message and visibility.

The cloud database and initial table have been provisioned. Before promoting the feedback feature, apply the pending migrations with `bunx wrangler@4.114.0 d1 migrations apply portfolio-feedback --remote`. The first migration is safe to apply to the already-created table. The second adds visibility with a private default and an index for public wall pagination. Apply it before the new Worker version; the added column remains compatible with retained versions that only insert the original fields. Cloud schema changes require operator approval.

For a working local preview, run:

```sh
bun run build
bunx wrangler@4.114.0 d1 migrations apply portfolio-feedback --local
bunx wrangler@4.114.0 dev --local --port 8787
```

Open `http://localhost:8787/feedback`. Local D1 saves persist in `.wrangler/state`; they are separate from the cloud database. The Vite-only development server does not provide Cloudflare bindings, so use the Worker preview to test delivery.

Run the postcard UI and local storage tests against that preview:

```sh
PLAYWRIGHT_TEST_BASE_URL=http://localhost:8787 PLAYWRIGHT_FEEDBACK_STORAGE=1 bun run test:e2e tests/e2e/feedback.spec.ts
```

The storage test is opt-in and restricted to localhost, so normal candidate and production browser tests never insert test postcards. To inspect real feedback privately, use the D1 dashboard or `bunx wrangler@4.114.0 d1 execute portfolio-feedback --remote --command "SELECT kind, message, name, visibility, created_at FROM feedback ORDER BY created_at DESC LIMIT 50"`.

## Drills

Run the controlled health alert once after workflow installation, then a healthy run to prove automatic closure. For a rollback drill, select two releases with identical application bytes, roll back to the previous version, verify it, and immediately re-promote the current tested version. Record run IDs, version IDs, elapsed time, and final health in the pre-launch reports.
