#!/usr/bin/env bun

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ORIGIN = new URL(
  process.env.DEPLOYMENT_ORIGIN?.trim() || 'https://m0code.com',
).origin
const SITE_DESCRIPTION =
  'Product engineer crafting thoughtful digital products, polished interfaces, and design systems where every detail matters.'
const SOCIAL_IMAGE_PATH = '/social/mo-ibrahim-product-engineer.png'
const SOCIAL_IMAGE_URL = `https://m0code.com${SOCIAL_IMAGE_PATH}`
const OUTPUT_PATH =
  process.env.VERIFICATION_OUTPUT_PATH?.trim() ||
  'release/production-verification.json'
const MAX_ATTEMPTS = 12
const RETRY_DELAY_MS = 5_000

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex')
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length
}

async function fetchResponse(url) {
  return fetch(url, {
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
    },
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  })
}

async function responseBytes(response) {
  return Buffer.from(await response.arrayBuffer())
}

async function assertDeployedFile(url, expected, expectedContentType) {
  const response = await fetchResponse(url)
  const bytes = await responseBytes(response)

  assert(response.status === 200, `${url} returned ${response.status}`)
  assert(
    response.headers.get('content-type')?.includes(expectedContentType),
    `${url} returned an unexpected content type`,
  )
  assert(bytes.byteLength === expected.bytes, `${url} byte count differs`)
  assert(sha256(bytes) === expected.sha256, `${url} SHA-256 differs`)
}

async function verifyProduction(manifest, attempt) {
  const token = `${manifest.source.commit.slice(0, 12)}-${attempt}`
  const files = new Map(
    manifest.build.files.map((file) => [file.path, file]),
  )
  const homeResponse = await fetchResponse(`${ORIGIN}/?release-smoke=${token}`)
  const home = await homeResponse.text()

  assert(homeResponse.status === 200, `Homepage returned ${homeResponse.status}`)
  assert(
    home.includes('<title>Mo Ibrahim — Product Engineer</title>'),
    'Homepage title differs',
  )
  assert(home.includes(SITE_DESCRIPTION), 'Homepage description differs')
  assert(
    home.includes('rel="canonical" href="https://m0code.com/"'),
    'Homepage canonical differs',
  )
  assert(home.includes(SOCIAL_IMAGE_URL), 'Homepage social image differs')
  assert(
    home.includes('name="twitter:card" content="summary_large_image"'),
    'Homepage Twitter card differs',
  )
  assert(countMatches(home, /<h1(?:\s|>)/g) === 1, 'Homepage H1 count differs')
  assert(home.includes('Mo Ibrahim — '), 'Homepage identity heading differs')
  assert(home.includes('Product Engineer'), 'Homepage role heading differs')
  assert(
    countMatches(home, /role="group"/g) === 4,
    'Homepage project-group count differs',
  )
  assert(
    !home.includes('nav aria-label="Project controls"'),
    'Homepage contains the retired project navigation landmark',
  )

  const assetPaths = [
    ...new Set(
      [...home.matchAll(/(?:href|src)="(\/assets\/[^"?]+)(?:\?[^" ]*)?"/g)].map(
        (match) => match[1],
      ),
    ),
  ].sort()

  assert(assetPaths.length >= 3, 'Homepage emitted too few generated assets')

  for (const assetPath of assetPaths) {
    const expected = files.get(`client${assetPath}`)
    assert(expected, `Homepage emitted unmanifested asset ${assetPath}`)
    const extension = path.extname(assetPath)
    const contentType = extension === '.css' ? 'text/css' : 'javascript'
    await assertDeployedFile(`${ORIGIN}${assetPath}`, expected, contentType)
  }

  const missingResponse = await fetchResponse(
    `${ORIGIN}/__release-smoke-missing-${token}`,
  )
  const missing = await missingResponse.text()

  assert(missingResponse.status === 404, 'Unknown route is not a hard 404')
  assert(
    missing.includes('<title>Page Not Found — MO</title>'),
    'Unknown route title differs',
  )
  assert(missing.includes('<main'), 'Unknown route has no main landmark')
  assert(missing.includes('<h1'), 'Unknown route has no H1')
  assert(missing.includes('Return home'), 'Unknown route has no recovery link')

  const retiredResponse = await fetchResponse(
    `${ORIGIN}/video-player-lab?release-smoke=${token}`,
  )
  assert(retiredResponse.status === 404, 'Retired video lab no longer returns 404')

  const brandPath = '/brand/mo-mark-v3.svg'
  const brand = files.get(`client${brandPath}`)
  assert(brand, 'Brand mark is absent from the build manifest')
  await assertDeployedFile(`${ORIGIN}${brandPath}`, brand, 'image/svg+xml')

  const faviconPath = '/brand/mo-favicon.svg'
  const favicon = files.get(`client${faviconPath}`)
  assert(favicon, 'Adaptive favicon is absent from the build manifest')
  await assertDeployedFile(`${ORIGIN}${faviconPath}`, favicon, 'image/svg+xml')

  const socialImage = files.get(`client${SOCIAL_IMAGE_PATH}`)
  assert(socialImage, 'Social image is absent from the build manifest')
  await assertDeployedFile(
    `${ORIGIN}${SOCIAL_IMAGE_PATH}`,
    socialImage,
    'image/png',
  )

  const videoPath = '/portfolio/projects/orgo/walkthrough.mp4'
  const video = files.get(`client${videoPath}`)
  assert(video, 'Retained Orgo video is absent from the build manifest')
  await assertDeployedFile(`${ORIGIN}${videoPath}`, video, 'video/mp4')

  return {
    homepageStatus: homeResponse.status,
    missingStatus: missingResponse.status,
    retiredLabStatus: retiredResponse.status,
    generatedAssets: assetPaths,
    brandSha256: brand.sha256,
    faviconSha256: favicon.sha256,
    socialImageSha256: socialImage.sha256,
    orgoVideoSha256: video.sha256,
  }
}

async function writeResult(result) {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`)
}

const manifest = JSON.parse(
  await readFile('release/build-manifest.json', 'utf8'),
)
const attempts = []
let details = null

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  try {
    details = await verifyProduction(manifest, attempt)
    attempts.push({ attempt, passed: true })
    break
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    attempts.push({ attempt, passed: false, error: message })

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }
}

const result = {
  schemaVersion: 1,
  verifiedAt: new Date().toISOString(),
  origin: ORIGIN,
  commit: manifest.source.commit,
  passed: details !== null,
  attempts,
  details,
}

await writeResult(result)

if (!result.passed) {
  throw new Error(
    `Production verification failed: ${attempts.at(-1)?.error ?? 'unknown error'}`,
  )
}

console.log(
  `Verified production on attempt ${attempts.length}: ${details.generatedAssets.length} generated assets and retained Orgo media match the build manifest`,
)
