#!/usr/bin/env bun

import { readFile } from 'node:fs/promises'

const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const SHA = /^[0-9a-f]{40}$/i

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function requireEnvironment(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'))
}

function collectVersionIds(value, ids = new Set()) {
  if (typeof value === 'string' && UUID.test(value)) ids.add(value)
  if (Array.isArray(value)) {
    for (const entry of value) collectVersionIds(entry, ids)
  } else if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) collectVersionIds(entry, ids)
  }
  return ids
}

async function verifyPromotion() {
  const runId = requireEnvironment('CANDIDATE_RUN_ID')
  const candidateSha = requireEnvironment('CANDIDATE_SHA')
  const confirmation = requireEnvironment('RELEASE_CONFIRMATION')
  const repository = requireEnvironment('GITHUB_REPOSITORY')
  const token = requireEnvironment('GH_TOKEN')

  assert(/^\d+$/.test(runId), 'Candidate run ID must be numeric')
  assert(SHA.test(candidateSha), 'Candidate SHA must be a full 40-character SHA')
  assert(process.env.GITHUB_REF === 'refs/heads/main', 'Promotion must run from main')
  assert(process.env.GITHUB_SHA === candidateSha, 'Candidate must be current main')
  assert(
    confirmation === `PROMOTE ${candidateSha}`,
    'Promotion confirmation does not match the candidate SHA',
  )

  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/runs/${runId}`,
    {
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'user-agent': 'portfolio-release-guard',
        'x-github-api-version': '2022-11-28',
      },
      signal: AbortSignal.timeout(15_000),
    },
  )
  assert(response.ok, `Could not read candidate run: HTTP ${response.status}`)
  const run = await response.json()

  assert(run.name === 'Cloudflare Candidate', 'Run is not the candidate workflow')
  assert(run.event === 'push', 'Candidate was not created by a main push')
  assert(run.head_branch === 'main', 'Candidate did not run on main')
  assert(run.head_sha === candidateSha, 'Candidate run SHA differs')
  assert(run.conclusion === 'success', 'Candidate run did not succeed')
  console.log(`Approved candidate run ${runId} at ${candidateSha}`)
}

async function verifyRollbackBefore() {
  const current = requireEnvironment('EXPECTED_CURRENT_VERSION')
  const target = requireEnvironment('ROLLBACK_TARGET_VERSION')
  const confirmation = requireEnvironment('ROLLBACK_CONFIRMATION')
  const reason = requireEnvironment('ROLLBACK_REASON')
  const status = await readJson('release/rollback-before.json')
  const targetDetails = await readJson('release/rollback-target.json')

  assert(process.env.GITHUB_REF === 'refs/heads/main', 'Rollback must run from main')
  assert(UUID.test(current), 'Expected current version is not a UUID')
  assert(UUID.test(target), 'Rollback target version is not a UUID')
  assert(current !== target, 'Rollback target equals the current version')
  assert(reason.length >= 10, 'Rollback reason must contain at least 10 characters')
  assert(
    confirmation === `ROLLBACK portfolio TO ${target}`,
    'Rollback confirmation does not match the target version',
  )
  assert(
    collectVersionIds(status).has(current),
    'Expected current version is not serving production',
  )
  assert(
    collectVersionIds(targetDetails).has(target),
    'Rollback target does not exist in Cloudflare',
  )
  console.log(`Approved rollback from ${current} to ${target}`)
}

async function verifyRollbackAfter() {
  const target = requireEnvironment('ROLLBACK_TARGET_VERSION')
  const status = await readJson('release/rollback-after.json')

  assert(
    collectVersionIds(status).has(target),
    'Rollback target is not serving production',
  )
  console.log(`Verified production now serves rollback target ${target}`)
}

const command = process.argv[2]

if (command === 'promotion') {
  await verifyPromotion()
} else if (command === 'rollback-before') {
  await verifyRollbackBefore()
} else if (command === 'rollback-after') {
  await verifyRollbackAfter()
} else {
  throw new Error(
    'Usage: release-guard.mjs <promotion|rollback-before|rollback-after>',
  )
}
