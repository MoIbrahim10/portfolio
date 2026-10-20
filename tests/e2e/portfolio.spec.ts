import { expect, test, type Page, type Request } from '@playwright/test'

const orgoCaption = 'Entrance animation and interactive icon hovers'
const orgoVideoPath = '/portfolio/projects/orgo/walkthrough.mp4'
const siteDescription =
  'Product engineer crafting thoughtful digital products, polished interfaces, and design systems where every detail matters.'
const socialImageUrl =
  'https://m0code.com/social/mo-ibrahim-product-engineer.png'

async function waitForHydration(page: Page) {
  const trigger = page.getByRole('button', { name: 'Mo — reveal portrait' })
  await expect
    .poll(async () => {
      await trigger.press('Enter')
      return trigger.getAttribute('aria-expanded')
    })
    .toBe('true')
  await trigger.evaluate((button: HTMLButtonElement) => button.blur())
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
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
  await expect(page).toHaveTitle('Mo Ibrahim — Product Engineer')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    siteDescription,
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://m0code.com/',
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    socialImageUrl,
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  )
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    socialImageUrl,
  )
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    'href',
    '/brand/mo-favicon.svg',
  )
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Mo Ibrahim — Product Engineer',
    }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: /^Show / })).toHaveCount(4)

  const projectRail = page.getByRole('region', {
    name: 'Projects. Swipe or scroll horizontally to change project.',
  })
  await projectRail.focus()
  await page.keyboard.press('ArrowRight')
  await expect(
    page.locator('article[aria-label="The Good Invoice project story"]'),
  ).not.toHaveAttribute('inert', '')
  await expect(
    page.getByRole('button', { name: 'Show The Good Invoice', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')

  assertRuntimeClean()
})

test('Work and Playground preserve selection and expose live experiments', async ({ page }) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  await page.goto('/')
  await waitForHydration(page)

  const collectionSwitch = page.getByRole('group', { name: 'Portfolio collection' })
  const work = collectionSwitch.getByRole('button', { name: 'Work', exact: true })
  const playground = collectionSwitch.getByRole('button', { name: 'Playground', exact: true })
  const workPanel = page.locator('#portfolio-work')
  const playPanel = page.locator('#portfolio-playground')
  const bounds = await collectionSwitch.boundingBox()
  const title = await workPanel.getByRole('heading', { name: 'Orgo', exact: true }).boundingBox()
  const frame = await collectionSwitch.locator('..').boundingBox()
  expect(bounds!.width).toBe(page.viewportSize()!.width <= 900 ? frame!.width - 8 : 240)
  expect(bounds!.height).toBe(40)
  if (page.viewportSize()!.width <= 900) {
    const rail = await workPanel.locator('section[data-collection="work"]').boundingBox()
    expect(Math.abs(frame!.x + frame!.width / 2 - rail!.x - rail!.width / 2)).toBeLessThan(1)
  } else {
    expect(Math.abs(bounds!.x - title!.x)).toBeLessThan(1)
  }
  expect(bounds!.y + bounds!.height).toBeLessThan(title!.y)
  const workControls = workPanel.getByRole('group', { name: 'Choose a project' })
  await expect(workControls).toBeVisible()
  await expect(workControls.getByRole('button')).toHaveCount(4)
  const workRail = workPanel.getByRole('region', {
    name: 'Projects. Swipe or scroll horizontally to change project.',
  })
  await workRail.focus()
  await page.keyboard.press('ArrowRight')
  const invoice = page.locator('#project-story-good-invoice')
  await expect(invoice.locator('h2')).toHaveText('The Good Invoice')
  const savedScroll = await invoice.evaluate((element) => {
    element.scrollTop = 180
    return element.scrollTop
  })

  await playground.click()
  await expect(playground).toHaveAttribute('aria-pressed', 'true')
  await expect(workPanel).toHaveAttribute('inert', '')
  await expect(playPanel).not.toHaveAttribute('inert', '')
  await expect(playPanel.getByRole('heading', { name: 'PIN', exact: true })).toBeVisible()
  const projectControls = playPanel.getByRole('group', { name: 'Choose a project' })
  expect(await projectControls.getByRole('button').allTextContents()).toEqual(['', '', ''])
  const pinTitle = await playPanel.getByRole('heading', { name: 'PIN', exact: true }).boundingBox()
  const controls = await projectControls.boundingBox()
  if (page.viewportSize()!.width <= 900) {
    expect(controls!.y + controls!.height).toBeLessThanOrEqual(pinTitle!.y)
  } else {
    expect(controls!.x).toBeGreaterThan(pinTitle!.x + pinTitle!.width)
    expect(Math.abs(controls!.y + controls!.height / 2 - pinTitle!.y - pinTitle!.height / 2)).toBeLessThan(1)
  }
  const background = () => playPanel.locator('section[data-collection="playground"]').evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  )
  const pinBackground = await background()
  await expect(playPanel.getByRole('link', { name: 'Open project' })).toHaveAttribute(
    'href', 'https://pin.m0code.com/',
  )

  await playPanel.getByRole('button', { name: 'Show ALIVE', exact: true }).press('Enter')
  await expect(playPanel.getByRole('link', { name: 'Open project' })).toHaveAttribute(
    'href', 'https://alive.m0code.com/',
  )
  const aliveBackground = await background()
  expect(aliveBackground).not.toBe(pinBackground)
  await playPanel.getByRole('button', { name: 'Show Sunline', exact: true }).press('Enter')
  await expect(playPanel.getByRole('link', { name: 'Open project' })).toHaveAttribute(
    'href', 'https://sunline.m0code.com/',
  )
  expect([pinBackground, aliveBackground]).not.toContain(await background())
  await expect.poll(() => playPanel.getByRole('region', {
    name: 'Projects. Swipe or scroll horizontally to change project.',
  }).evaluate((element) => Math.round(element.scrollLeft / element.clientWidth))).toBe(2)

  await work.press('Enter')
  await expect(work).toBeFocused()
  await expect(page.getByRole('heading', { name: 'The Good Invoice', exact: true })).toBeVisible()
  await expect.poll(() => invoice.evaluate((element) => element.scrollTop)).toBe(savedScroll)
  await expect(workPanel).toHaveCSS('transition-duration', '0s')
  await playground.press('Enter')
  await expect(playPanel.getByRole('heading', { name: 'Sunline', exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await work.click()
  await playground.click()
  await expect(playPanel).toHaveCSS('transform', 'none')
  await expect(playPanel).toHaveCSS('transition-duration', '0s')
  assertRuntimeClean()
})

test('mobile project dots and long titles stay separate', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Narrow-screen project controls')
  await page.goto('/')
  await waitForHydration(page)

  const collectionSwitch = page.getByRole('group', { name: 'Portfolio collection' })
  for (const width of [320, 390, 768, 769]) {
    await page.setViewportSize({ width, height: 900 })
    for (const [collection, titles] of [
      ['Work', ['Orgo', 'The Good Invoice', 'Lumen', 'Selected Experiments']],
      ['Playground', ['PIN', 'ALIVE', 'Sunline']],
    ] as const) {
      await collectionSwitch.getByRole('button', { name: collection, exact: true }).press('Enter')
      for (const title of titles) {
        await page.getByRole('button', { name: `Show ${title}`, exact: true }).press('Enter')
        const heading = page.getByRole('heading', { name: title, exact: true })
        const bounds = await heading.boundingBox()
        const controls = page.getByRole('group', { name: 'Choose a project' })
        await expect(controls.getByRole('button', { name: `Show ${title}`, exact: true })).toHaveAttribute('aria-pressed', 'true')
        const controlsBounds = await controls.boundingBox()
        const frame = await collectionSwitch.locator('..').boundingBox()
        const switchBounds = await collectionSwitch.boundingBox()
        const rail = await collectionSwitch.locator('../..').boundingBox()
        expect(Math.abs(frame!.x + frame!.width / 2 - rail!.x - rail!.width / 2)).toBeLessThan(1)
        expect(Math.abs(controlsBounds!.x + controlsBounds!.width / 2 - frame!.x - frame!.width / 2)).toBeLessThan(1)
        expect(controlsBounds!.y).toBeGreaterThanOrEqual(switchBounds!.y + switchBounds!.height)
        expect(controlsBounds!.y + controlsBounds!.height).toBeLessThanOrEqual(frame!.y + frame!.height)
        expect(controlsBounds!.y + controlsBounds!.height).toBeLessThanOrEqual(bounds!.y)
        expect(controlsBounds!.x + controlsBounds!.width).toBeLessThanOrEqual(width)
        expect(await heading.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('favicon preserves its light palette and increases dark contrast', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' })
  const response = await page.goto('/brand/mo-favicon.svg')
  expect(response?.status()).toBe(200)

  const navyShape = page.locator('[fill="#122b3d"]').first()
  const redShape = page.locator('[fill="#9c1e1b"]').first()
  await expect
    .poll(() => navyShape.evaluate((element) => getComputedStyle(element).fill))
    .toBe('rgb(18, 43, 61)')
  await expect
    .poll(() => redShape.evaluate((element) => getComputedStyle(element).fill))
    .toBe('rgb(156, 30, 27)')

  await page.emulateMedia({ colorScheme: 'dark' })
  await expect
    .poll(() => navyShape.evaluate((element) => getComputedStyle(element).fill))
    .toBe('rgb(255, 244, 220)')
  await expect
    .poll(() => redShape.evaluate((element) => getComputedStyle(element).fill))
    .toBe('rgb(255, 118, 109)')
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
  test(`${label} returns a useful 404 document`, async ({ page, isMobile }) => {
    const expected404 =
      /Failed to load resource: the server responded with a status of 404/
    const assertRuntimeClean = monitorRuntime(page, {
      expectedConsoleErrors: [expected404],
    })
    const response = await page.goto(path, { waitUntil: 'networkidle' })
    expect(response?.status(), path).toBe(404)
    await expect(page).toHaveTitle('Page Not Found — MO')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Lost, but not for long.' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Back home ↗' }),
    ).toHaveAttribute('href', '/')
    const compass = page.getByRole('slider', { name: 'Rotate solar compass' })
    await compass.press('Home')
    await expect(compass).toHaveAttribute('data-north', 'true')
    const sound = page.getByRole('button', { name: 'Enable sound' })
    const soundBox = await sound.boundingBox()
    const headingBox = await page.getByRole('heading', { level: 1 }).boundingBox()
    const compassBox = await compass.boundingBox()
    if (!soundBox || !headingBox || !compassBox) throw new Error('404 content is missing')
    expect(soundBox.x + soundBox.width).toBeGreaterThan(page.viewportSize()!.width - 60)
    expect(soundBox.y).toBeLessThan(50)
    expect(headingBox.y - compassBox.y - compassBox.height).toBeGreaterThanOrEqual(23)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)

    await expect(sound).toHaveAttribute('aria-pressed', 'false')
    await sound.click()
    const mute = page.getByRole('button', { name: 'Mute sound' })
    await expect(mute).toHaveAttribute('aria-pressed', 'true')
    await mute.click()
    await expect(sound).toHaveAttribute('aria-pressed', 'false')

    if (!isMobile) {
      await page.mouse.move(compassBox.x + compassBox.width * 0.9, compassBox.y + compassBox.height * 205 / 400)
      await expect(compass).toHaveAttribute('aria-valuenow', '90')
    }

    assertRuntimeClean()

    await page.getByRole('link', { name: 'Back home ↗' }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Mo Ibrahim — Product Engineer' })).toBeVisible()
  })
}
