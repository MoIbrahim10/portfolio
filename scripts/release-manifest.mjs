#!/usr/bin/env bun

import { createHash } from 'node:crypto'
import {
  appendFile,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'

const BUILD_MANIFEST_PATH = 'release/build-manifest.json'
const CANDIDATE_METADATA_PATH = 'release/candidate-metadata.json'
const CANDIDATE_MANIFEST_PATH = 'release/candidate-manifest.json'
const CLOUDFLARE_VERSION_PATH = 'release/cloudflare-version.json'
const PLAYWRIGHT_RESULTS_PATH = 'test-results/results.json'
const PREVIEW_VERIFICATION_PATH = 'release/preview-verification.json'
const PRODUCTION_VERIFICATION_PATH = 'release/production-verification.json'
const RELEASE_MANIFEST_PATH = 'release/release-manifest.json'
const WRANGLER_VERSION = '4.114.0'

const RELEASE_INPUTS = [
  '.bun-version',
  '.github/workflows/cloudflare.yml',
  '.github/workflows/production-health.yml',
  '.github/workflows/release.yml',
  '.github/workflows/rollback.yml',
  'bun.lock',
  'docs/runbooks/production-release.md',
  'package.json',
  'scripts/check-production-health.mjs',
  'scripts/release-guard.mjs',
  'scripts/release-manifest.mjs',
  'scripts/verify-production-release.mjs',
  'wrangler.jsonc',
]

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex')
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function fileRecord(filePath, displayPath = filePath) {
  const bytes = await readFile(filePath)

  return {
    path: toPosix(displayPath),
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  }
}

async function collectFiles(rootPath, currentPath = rootPath) {
  const entries = await readdir(currentPath, { withFileTypes: true })
  const files = []

  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const entryPath = path.join(currentPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(rootPath, entryPath)))
      continue
    }

    if (!entry.isFile()) {
      throw new Error(`Unsupported build entry: ${entryPath}`)
    }

    files.push(await fileRecord(entryPath, path.relative(rootPath, entryPath)))
  }

  return files
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'))
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function requireEnvironment(name) {
  const value = process.env[name]?.trim()

  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} does not match the retained build manifest`)
  }
}

function assertDigest(value) {
  assert(/^(?:sha256:)?[0-9a-f]{64}$/i.test(value), 'Invalid artifact digest')
}

function parseCloudflareVersion(commandOutput) {
  const patterns = [
    /Current Version ID:\s*([0-9a-f-]{36})/i,
    /Version ID:\s*([0-9a-f-]{36})/i,
  ]

  for (const pattern of patterns) {
    const match = commandOutput.match(pattern)
    if (match && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(match[1])) {
      return match[1]
    }
  }

  throw new Error('Wrangler output did not contain a Cloudflare version ID')
}

function parsePreviewUrl(commandOutput) {
  const labeled = commandOutput.match(
    /Version Preview URL:\s*(https:\/\/[^\s)]+)/i,
  )
  const fallback = [...commandOutput.matchAll(/https:\/\/[^\s)]+/gi)].find(
    (match) => match[0].includes('.workers.dev'),
  )
  const value = labeled?.[1] ?? fallback?.[0]

  assert(value, 'Wrangler output did not contain a version preview URL')
  const url = new URL(value)
  assert(url.hostname.endsWith('.workers.dev'), 'Candidate URL is not a Workers preview')
  return url.origin
}

async function writeOutputs(values) {
  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) return

  await appendFile(
    outputPath,
    Object.entries(values)
      .map(([name, value]) => `${name}=${value}\n`)
      .join(''),
  )
}

function summarizePlaywright(results) {
  const stats = results.stats ?? {}
  const summary = {
    expected: Number(stats.expected ?? 0),
    unexpected: Number(stats.unexpected ?? 0),
    flaky: Number(stats.flaky ?? 0),
    skipped: Number(stats.skipped ?? 0),
    durationMs: Number(stats.duration ?? 0),
  }

  return {
    ...summary,
    passed:
      summary.expected > 0 &&
      summary.unexpected === 0 &&
      summary.flaky === 0,
    retries: 0,
  }
}

async function createBuildManifest() {
  const files = await collectFiles('dist')
  const inputFiles = await Promise.all(
    RELEASE_INPUTS.map((filePath) => fileRecord(filePath)),
  )
  const manifest = {
    schemaVersion: 2,
    createdAt: new Date().toISOString(),
    source: {
      repository: process.env.GITHUB_REPOSITORY ?? 'local',
      commit: process.env.GITHUB_SHA ?? 'local',
      ref: process.env.GITHUB_REF ?? 'local',
    },
    workflow: {
      runId: process.env.GITHUB_RUN_ID ?? 'local',
      runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? 'local',
    },
    tools: {
      bun: process.versions.bun ?? null,
      node: process.version,
      wrangler: WRANGLER_VERSION,
    },
    inputFiles,
    build: {
      root: 'dist',
      fileCount: files.length,
      totalBytes: files.reduce((total, file) => total + file.bytes, 0),
      files,
    },
  }

  await writeJson(BUILD_MANIFEST_PATH, manifest)
  console.log(
    `Created ${BUILD_MANIFEST_PATH}: ${manifest.build.fileCount} files, ${manifest.build.totalBytes} bytes`,
  )
}

async function verifyBuildManifest() {
  const manifest = await readJson(BUILD_MANIFEST_PATH)
  const files = await collectFiles('dist')
  const inputFiles = await Promise.all(
    RELEASE_INPUTS.map((filePath) => fileRecord(filePath)),
  )

  assert(manifest.schemaVersion === 2, `Unsupported manifest schema: ${manifest.schemaVersion}`)

  if (process.env.GITHUB_SHA) {
    assert(
      manifest.source.commit === process.env.GITHUB_SHA,
      'Manifest commit does not match the deployment commit',
    )
  }

  assert(manifest.tools.wrangler === WRANGLER_VERSION, 'Manifest Wrangler version differs')
  assertEqual(manifest.inputFiles, inputFiles, 'Release inputs')
  assertEqual(manifest.build.files, files, 'Build files')
  assertEqual(manifest.build.fileCount, files.length, 'Build file count')
  assertEqual(
    manifest.build.totalBytes,
    files.reduce((total, file) => total + file.bytes, 0),
    'Build byte count',
  )

  console.log(
    `Verified ${BUILD_MANIFEST_PATH}: ${files.length} files match byte-for-byte`,
  )
}

async function stageCandidate() {
  const buildManifest = await readJson(BUILD_MANIFEST_PATH)
  const commandOutput = requireEnvironment('WRANGLER_COMMAND_OUTPUT')
  const metadata = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    source: buildManifest.source,
    versionId: parseCloudflareVersion(commandOutput),
    previewUrl: parsePreviewUrl(commandOutput),
  }

  await writeJson(CANDIDATE_METADATA_PATH, metadata)
  await writeOutputs({
    version_id: metadata.versionId,
    preview_url: metadata.previewUrl,
  })
  console.log(`Staged Cloudflare candidate ${metadata.versionId} at ${metadata.previewUrl}`)
}

async function finalizeCandidate() {
  const buildManifest = await readJson(BUILD_MANIFEST_PATH)
  const metadata = await readJson(CANDIDATE_METADATA_PATH)
  const previewVerification = await readJson(PREVIEW_VERIFICATION_PATH)
  const cloudflareVersion = await readJson(CLOUDFLARE_VERSION_PATH)
  const browserVerification = summarizePlaywright(
    await readJson(PLAYWRIGHT_RESULTS_PATH),
  )
  const artifactDigest = requireEnvironment('BUILD_ARTIFACT_DIGEST')

  assertDigest(artifactDigest)
  assert(
    metadata.source.commit === buildManifest.source.commit,
    'Candidate metadata commit differs from the build manifest',
  )
  assert(previewVerification.passed === true, 'Candidate HTTP verification failed')
  assert(
    previewVerification.origin === metadata.previewUrl,
    'Candidate HTTP evidence targets a different origin',
  )
  assert(browserVerification.passed, 'Candidate browser verification failed')
  assert(
    JSON.stringify(cloudflareVersion).includes(metadata.versionId),
    'Cloudflare version evidence does not match the candidate',
  )

  const manifest = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    source: buildManifest.source,
    workflow: buildManifest.workflow,
    artifact: {
      name: requireEnvironment('BUILD_ARTIFACT_NAME'),
      id: requireEnvironment('BUILD_ARTIFACT_ID'),
      digest: artifactDigest,
      url: requireEnvironment('BUILD_ARTIFACT_URL'),
      retentionDays: 30,
    },
    candidate: {
      provider: 'Cloudflare Workers',
      worker: 'portfolio',
      versionId: metadata.versionId,
      previewUrl: metadata.previewUrl,
    },
    previewVerification,
    browserVerification,
  }

  await writeJson(CANDIDATE_MANIFEST_PATH, manifest)
  console.log(
    `Finalized candidate ${metadata.versionId}: ${browserVerification.expected} browser checks passed`,
  )
}

async function verifyCandidate() {
  const manifest = await readJson(CANDIDATE_MANIFEST_PATH)
  const expectedCommit = process.env.GITHUB_SHA

  assert(manifest.schemaVersion === 1, 'Unsupported candidate manifest schema')
  if (expectedCommit) {
    assert(manifest.source.commit === expectedCommit, 'Candidate commit differs')
  }
  assert(manifest.previewVerification.passed === true, 'Candidate HTTP evidence failed')
  assert(
    manifest.previewVerification.origin === manifest.candidate.previewUrl,
    'Candidate HTTP evidence targets a different origin',
  )
  assert(manifest.browserVerification.passed === true, 'Candidate browser evidence failed')

  await writeOutputs({
    version_id: manifest.candidate.versionId,
    preview_url: manifest.candidate.previewUrl,
  })
  console.log(`Verified promotable candidate ${manifest.candidate.versionId}`)
}

async function finalizeReleaseManifest() {
  const candidateManifest = await readJson(CANDIDATE_MANIFEST_PATH)
  const productionVerification = await readJson(PRODUCTION_VERIFICATION_PATH)
  const browserVerification = summarizePlaywright(
    await readJson(PLAYWRIGHT_RESULTS_PATH),
  )
  const versionId = requireEnvironment('CLOUDFLARE_VERSION_ID')

  assert(candidateManifest.candidate.versionId === versionId, 'Promoted version differs')
  assert(productionVerification.passed === true, 'Production HTTP verification failed')
  assert(browserVerification.passed, 'Production browser verification failed')

  const releaseManifest = {
    schemaVersion: 2,
    createdAt: new Date().toISOString(),
    source: candidateManifest.source,
    candidate: candidateManifest.candidate,
    artifact: candidateManifest.artifact,
    deployment: {
      provider: 'Cloudflare Workers',
      worker: 'portfolio',
      versionId,
      url: 'https://m0code.com',
    },
    productionVerification,
    browserVerification,
  }

  await writeJson(RELEASE_MANIFEST_PATH, releaseManifest)
  console.log(
    `Finalized production release ${versionId}: ${browserVerification.expected} browser checks passed`,
  )
}

const command = process.argv[2]

if (command === 'create') {
  await createBuildManifest()
} else if (command === 'verify') {
  await verifyBuildManifest()
} else if (command === 'stage') {
  await stageCandidate()
} else if (command === 'candidate') {
  await finalizeCandidate()
} else if (command === 'verify-candidate') {
  await verifyCandidate()
} else if (command === 'finalize') {
  await finalizeReleaseManifest()
} else {
  throw new Error(
    'Usage: release-manifest.mjs <create|verify|stage|candidate|verify-candidate|finalize>',
  )
}
