#!/usr/bin/env bun

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ORIGIN = 'https://m0code.com'
const SITE_DESCRIPTION =
  'Product engineer crafting thoughtful digital products, polished interfaces, and design systems where every detail matters.'
const SOCIAL_IMAGE_URL =
  'https://m0code.com/social/mo-ibrahim-product-engineer.png'
const OUTPUT_PATH =
  process.env.HEALTH_OUTPUT_PATH?.trim() || 'release/health-check.json'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function request(pathname, options = {}) {
  return fetch(`${ORIGIN}${pathname}`, {
    ...options,
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      ...options.headers,
    },
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  })
}

async function runChecks() {
  const token = Date.now()
  const homeResponse = await request(`/?health-check=${token}`)
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
  assert(home.includes('Mo Ibrahim — '), 'Homepage identity is missing')
  assert([...home.matchAll(/role="group"/g)].length === 4, 'Project groups differ')

  const requiredHeaders = [
    'content-security-policy',
    'referrer-policy',
    'strict-transport-security',
    'x-content-type-options',
  ]
  for (const name of requiredHeaders) {
    assert(homeResponse.headers.has(name), `Homepage is missing ${name}`)
  }

  const assets = [
    ...new Set(
      [...home.matchAll(/(?:href|src)="(\/assets\/[^"?]+)/g)].map(
        (match) => match[1],
      ),
    ),
  ]
  assert(assets.length >= 3, 'Homepage emitted too few generated assets')
  for (const asset of assets) {
    const response = await request(asset)
    assert(response.status === 200, `${asset} returned ${response.status}`)
    await response.body?.cancel()
  }

  const missingResponse = await request(`/__health-missing-${token}`)
  const missing = await missingResponse.text()
  assert(missingResponse.status === 404, 'Unknown route is not a hard 404')
  assert(missing.includes('Return home'), 'Unknown route recovery is missing')

  const retiredResponse = await request('/video-player-lab')
  assert(retiredResponse.status === 404, 'Retired video lab no longer returns 404')
  await retiredResponse.body?.cancel()

  const mediaResponse = await request(
    '/portfolio/projects/orgo/walkthrough.mp4',
    { headers: { range: 'bytes=0-1023' } },
  )
  assert(
    mediaResponse.status === 200 || mediaResponse.status === 206,
    `Media availability returned ${mediaResponse.status}`,
  )
  if (mediaResponse.status === 206) {
    assert(mediaResponse.headers.has('content-range'), 'Media range lacks content-range')
  }
  await mediaResponse.body?.cancel()

  if (process.env.SIMULATE_FAILURE === 'true') {
    throw new Error('Controlled alert drill requested')
  }

  return {
    homepageStatus: homeResponse.status,
    generatedAssets: assets.length,
    missingStatus: missingResponse.status,
    retiredLabStatus: retiredResponse.status,
    mediaStatus: mediaResponse.status,
    requiredHeaders,
  }
}

let details = null
let error = null

try {
  details = await runChecks()
} catch (caught) {
  error = caught instanceof Error ? caught.message : String(caught)
}

const result = {
  schemaVersion: 1,
  checkedAt: new Date().toISOString(),
  origin: ORIGIN,
  passed: details !== null,
  details,
  error,
}

await mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
await writeFile(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`)

if (!result.passed) throw new Error(`Production health failed: ${error}`)
console.log(`Production health passed: ${details.generatedAssets} assets and all routes`)
