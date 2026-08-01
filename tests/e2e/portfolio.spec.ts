import { expect, test, type Page, type Request } from '@playwright/test'

const orgoCaption = 'Entrance animation and interactive icon hovers'
const orgoVideoPath = '/portfolio/projects/orgo/walkthrough.mp4'

async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const trigger = document.querySelector(
      'button[aria-label="Mo — reveal portrait"]',
    )
    return (
      trigger &&
      Object.keys(trigger).some((key) => key.startsWith('__reactProps$'))
    )
  })
}

function monitorRuntime(
  page: Page,
  {
    allowedRequestFailures = [],
    expectedConsoleErrors = [],
  }: {
    allowedRequestFailures?: string[]
    expectedConsoleErrors?: RegExp[]
  } = {},
) {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  const requestFailures: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('requestfailed', (request: Request) => {
    if (allowedRequestFailures.some((path) => request.url().includes(path))) {
      return
    }
    requestFailures.push(
      `${request.method()} ${request.url()} — ${request.failure()?.errorText ?? 'unknown failure'}`,
    )
  })

  return () => {
    expect(consoleErrors, 'browser console error count').toHaveLength(
      expectedConsoleErrors.length,
    )
    expectedConsoleErrors.forEach((pattern, index) => {
      expect(consoleErrors[index], 'expected browser console error').toMatch(
        pattern,
      )
    })
    expect(pageErrors, 'unexpected uncaught page errors').toEqual([])
    expect(requestFailures, 'unexpected failed requests').toEqual([])
  }
}

test('SSR hydrates and project selection remains interactive', async ({
  page,
}) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  const response = await page.goto('/')
  await waitForHydration(page)

  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle('MO — Portfolio')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Mo Ibrahim — Design Engineer',
    }),
  ).toBeVisible()
  await expect(page.locator('button[aria-label^="Show "]')).toHaveCount(16)

  const projectRail = page.getByRole('region', {
    name: 'Projects. Swipe or scroll horizontally to change project.',
  })
  await projectRail.focus()
  await page.keyboard.press('ArrowRight')
  await expect(
    page.locator('article[aria-label="The Good Invoice project story"]'),
  ).not.toHaveAttribute('inert', '')
  await expect(
    page.locator(
      'button[aria-label="Show The Good Invoice"][aria-pressed="true"]',
    ),
  ).toHaveCount(4)

  assertRuntimeClean()
})

test('Orgo video viewer controls, Escape, and focus return work', async ({
  page,
}) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  await page.goto('/')
  await waitForHydration(page)

  const trigger = page.getByRole('button', {
    name: `View ${orgoCaption} full screen`,
  })
  await trigger.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog')
  const closeButton = dialog.getByRole('button', {
    exact: true,
    name: 'Close',
  })
  const video = dialog.locator(`video[src="${orgoVideoPath}"]`)
  await expect(dialog).toBeVisible()
  await expect(closeButton).toBeFocused()
  await expect(video).toHaveAttribute('src', orgoVideoPath)
  await expect
    .poll(() =>
      video.evaluate((element: HTMLVideoElement) => element.readyState),
    )
    .toBeGreaterThanOrEqual(2)

  const playbackButton = dialog.getByRole('button', {
    name: /^(Play|Pause) video$/,
  })
  await expect(playbackButton).toBeVisible()
  await video.hover()
  await expect(playbackButton).toHaveCSS('pointer-events', 'auto')
  await playbackButton.click()
  await expect(dialog.getByLabel('Video progress')).toBeEnabled()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()

  assertRuntimeClean()
})

test('reduced motion suppresses automatic video playback', async ({ page }) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await waitForHydration(page)

  const inlineVideo = page.locator(`video[src="${orgoVideoPath}"]`).first()
  await expect(inlineVideo).toBeVisible()
  await expect
    .poll(() =>
      inlineVideo.evaluate((video) => (video as HTMLVideoElement).paused),
    )
    .toBe(true)

  await page
    .getByRole('button', { name: `View ${orgoCaption} full screen` })
    .click()
  const viewerVideo = page
    .getByRole('dialog')
    .locator(`video[src="${orgoVideoPath}"]`)
  await expect(viewerVideo).toBeVisible()
  await expect
    .poll(() =>
      viewerVideo.evaluate((video) => (video as HTMLVideoElement).paused),
    )
    .toBe(true)

  assertRuntimeClean()
})

test('inline video failure preserves the poster fallback', async ({ page }) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
    expectedConsoleErrors: [/Failed to load resource: net::ERR_FAILED/],
  })
  let releaseFailure = () => {}
  const hydrated = new Promise<void>((resolve) => {
    releaseFailure = resolve
  })
  await page.route(`**${orgoVideoPath}`, async (route) => {
    await hydrated
    await route.abort('failed')
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await waitForHydration(page)
  const reveal = page.getByRole('button', { name: 'Mo — reveal portrait' })
  await reveal.click()
  await expect(reveal).toHaveAttribute('aria-expanded', 'true')
  releaseFailure()

  const fallback = page.locator('[data-playback="failed"]').first()
  await expect(fallback).toBeVisible()
  await expect(fallback.locator('img[aria-hidden="true"]')).toBeVisible()
  await expect(fallback.locator('video')).toHaveCount(0)

  assertRuntimeClean()
})

for (const [label, path] of [
  ['unknown route', '/not-a-real-route'],
  ['retired video lab', '/video-player-lab'],
] as const) {
  test(`${label} returns a useful 404 document`, async ({ page }) => {
    const expected404 =
      /Failed to load resource: the server responded with a status of 404/
    const assertRuntimeClean = monitorRuntime(page, {
      expectedConsoleErrors: [expected404],
    })
    const response = await page.goto(path, { waitUntil: 'networkidle' })
    expect(response?.status(), path).toBe(404)
    await expect(page).toHaveTitle('Page Not Found — MO')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Return home' }),
    ).toHaveAttribute('href', '/')

    assertRuntimeClean()
  })
}
