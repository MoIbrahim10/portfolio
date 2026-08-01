#!/usr/bin/env bun

import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BUILD_MANIFEST_PATH = 'release/build-manifest.json'
const PRODUCTION_VERIFICATION_PATH = 'release/production-verification.json'
const RELEASE_MANIFEST_PATH = 'release/release-manifest.json'
const WRANGLER_VERSION = '4.114.0'

const RELEASE_INPUTS = [
  '.bun-version',
  '.github/workflows/cloudflare.yml',
  'bun.lock',
  'package.json',
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

    files.push(
      await fileRecord(entryPath, path.relative(rootPath, entryPath)),
    )
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

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} does not match the retained build manifest`)
  }
}

async function createBuildManifest() {
  const files = await collectFiles('dist')
  const inputFiles = await Promise.all(
    RELEASE_INPUTS.map((filePath) => fileRecord(filePath)),
  )
  const manifest = {
    schemaVersion: 1,
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

  if (manifest.schemaVersion !== 1) {
    throw new Error(`Unsupported manifest schema: ${manifest.schemaVersion}`)
  }

  if (
    process.env.GITHUB_SHA &&
    manifest.source.commit !== process.env.GITHUB_SHA
  ) {
    throw new Error('Manifest commit does not match the deployment commit')
  }

  if (manifest.tools.wrangler !== WRANGLER_VERSION) {
    throw new Error('Manifest Wrangler version does not match the workflow')
  }

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

function parseCloudflareVersion(commandOutput) {
  const match = commandOutput.match(
    /Current Version ID:\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
  )

  if (!match) {
    throw new Error('Wrangler output did not contain a Cloudflare version ID')
  }

  return match[1]
}

function normalizeDeploymentUrl(value) {
  const candidate = value?.trim() || 'https://m0code.com'
  const match = candidate.match(
    /https?:\/\/[^\s)]+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}/i,
  )

  if (!match) {
    throw new Error('Wrangler output did not contain a deployment URL')
  }

  const url = new URL(match[0].includes('://') ? match[0] : `https://${match[0]}`)

  return url.origin
}

async function finalizeReleaseManifest() {
  const buildManifest = await readJson(BUILD_MANIFEST_PATH)
  const productionVerification = await readJson(PRODUCTION_VERIFICATION_PATH)
  const artifactDigest = requireEnvironment('BUILD_ARTIFACT_DIGEST')
  const productionVerified = requireEnvironment('PRODUCTION_VERIFIED') === 'true'

  if (!/^(?:sha256:)?[0-9a-f]{64}$/i.test(artifactDigest)) {
    throw new Error('Build artifact digest is not a SHA-256 value')
  }

  if (productionVerification.passed !== productionVerified) {
    throw new Error('Production verification result is inconsistent')
  }

  const releaseManifest = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    build: buildManifest,
    artifact: {
      name: requireEnvironment('BUILD_ARTIFACT_NAME'),
      id: requireEnvironment('BUILD_ARTIFACT_ID'),
      digest: artifactDigest,
      url: requireEnvironment('BUILD_ARTIFACT_URL'),
      retentionDays: 30,
    },
    deployment: {
      provider: 'Cloudflare Workers',
      worker: 'portfolio',
      versionId: parseCloudflareVersion(
        requireEnvironment('WRANGLER_COMMAND_OUTPUT'),
      ),
      url: normalizeDeploymentUrl(process.env.DEPLOYMENT_URL),
    },
    productionVerification,
  }

  await writeJson(RELEASE_MANIFEST_PATH, releaseManifest)
  console.log(
    `Created ${RELEASE_MANIFEST_PATH}: Cloudflare ${releaseManifest.deployment.versionId}, verified=${productionVerified}`,
  )
}

const command = process.argv[2]

if (command === 'create') {
  await createBuildManifest()
} else if (command === 'verify') {
  await verifyBuildManifest()
} else if (command === 'finalize') {
  await finalizeReleaseManifest()
} else {
  throw new Error('Usage: release-manifest.mjs <create|verify|finalize>')
}
