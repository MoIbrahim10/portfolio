# Production Release and Recovery

Owner: repository owner / release operator  
Production: `https://m0code.com`  
Worker: `portfolio`  
Detection target: 15 minutes  
Rollback target: restore a known-good version within 15 minutes

## Candidate and promotion

1. Merge only after the `Cloudflare Candidate / build` pull-request job passes.
2. Wait for the resulting `master` push run to upload a version preview and pass HTTP plus 12 zero-retry desktop/mobile browser checks.
3. Record the successful candidate run ID, full SHA, preview URL, and version ID from its retained candidate manifest.
4. Dispatch `Promote Production` from `master`. Enter that run ID and SHA, then type `PROMOTE <full-sha>` exactly.
5. Production must promote the retained Cloudflare version without rebuilding, pass byte-level HTTP verification, and pass the same browser suite against `m0code.com`.

The private GitHub Free plan cannot enforce required reviewers or branch protection. Production therefore never deploys on push: an authenticated operator must manually dispatch an exact-current-master SHA whose candidate run succeeded.

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

This Worker currently has no application database or stateful binding. Cloudflare rollback restores Worker code and static assets, not future external data or binding state; reassess this runbook before adding state.

## Drills

Run the controlled health alert once after workflow installation, then a healthy run to prove automatic closure. For a rollback drill, select two releases with identical application bytes, roll back to the previous version, verify it, and immediately re-promote the current tested version. Record run IDs, version IDs, elapsed time, and final health in the pre-launch reports.
