import {
  expect,
  test,
  type Page,
  type Request,
  type TestInfo,
} from '@playwright/test'

const orgoCaption = 'Entrance animation and interactive icon hovers'
const orgoVideoPath = '/portfolio/projects/orgo/walkthrough.mp4'
const storyNames = ['Orgo', 'The Good Invoice', 'Lumen', 'Selected Experiments']
const expectedTriggerCounts = [5, 5, 7, 15]

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
    allowedConsoleErrors = [],
  }: {
    allowedRequestFailures?: string[]
    allowedConsoleErrors?: RegExp[]
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
    const failure = request.failure()?.errorText ?? 'unknown failure'
    const isExpectedAbort = /abort|cancel|NS_ERROR_PARSED_DATA_CACHED/i.test(
      failure,
    )
    if (
      isExpectedAbort &&
      allowedRequestFailures.some((path) => request.url().includes(path))
    ) {
      return
    }
    requestFailures.push(
      `${request.method()} ${request.url()} — ${failure}`,
    )
  })

  return () => {
    const unexpectedConsoleErrors = consoleErrors.filter(
      (message) => !allowedConsoleErrors.some((pattern) => pattern.test(message)),
    )
    expect(unexpectedConsoleErrors, 'unexpected browser console errors').toEqual([])
    expect(pageErrors, 'unexpected uncaught page errors').toEqual([])
    expect(requestFailures, 'unexpected failed requests').toEqual([])
  }
}

function isMobileProject(testInfo: TestInfo) {
  return testInfo.project.name.startsWith('mobile-')
}

async function loadHome(page: Page) {
  const response = await page.goto('/')
  await waitForHydration(page)
  expect(response?.status()).toBe(200)
}

async function selectStoryForMediaCheck(page: Page, storyIndex: number) {
  const storyName = storyNames[storyIndex]
  const control = page.locator(
    `article[aria-hidden="false"] button[aria-label="Show ${storyName}"]`,
  )
  await control.evaluate((button: HTMLButtonElement) => button.click())
  await expect(
    page.getByRole('article', { name: `${storyName} project story` }),
  ).toBeVisible()
}

async function addCssRules(page: Page, rules: string[]) {
  await page.evaluate((rulesToAdd) => {
    const sheet = [...document.styleSheets].find((candidate) => {
      try {
        return candidate.cssRules.length > 0
      } catch {
        return false
      }
    })
    if (!sheet) throw new Error('No same-origin stylesheet is available')
    for (const rule of rulesToAdd) sheet.insertRule(rule, sheet.cssRules.length)
  }, rules)
}

test('semantic surface exposes one active story and named controls', async ({
  page,
}) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  await loadHome(page)

  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Mo Ibrahim — Design Engineer',
    }),
  ).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Contact links' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Selected project work' })).toBeVisible()
  await expect(page.locator('article[aria-label$="project story"]')).toHaveCount(4)
  await expect(
    page.locator('article[aria-label$="project story"][inert]'),
  ).toHaveCount(3)
  await expect(
    page.locator('article[aria-label$="project story"][aria-hidden="true"]'),
  ).toHaveCount(3)
  const ariaSnapshot = await page.locator('main').ariaSnapshot()
  const exposedInactiveStories = storyNames
    .slice(1)
    .filter((name) => ariaSnapshot.includes(`${name} project story`))
  expect.soft(exposedInactiveStories).toEqual([])
  await expect(page.getByRole('button', { name: 'Mo — reveal portrait' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
  await expect(page.locator('button[aria-label^="View "]')).toHaveCount(32)
  await expect(page.getByRole('link', { name: 'Schedule a call' })).toHaveAttribute(
    'href',
    'https://cal.com/mo-c0de/30min',
  )
  await expect(page.getByRole('link', { name: 'X profile' })).toHaveAttribute(
    'href',
    'https://x.com/m0code',
  )
  await expect(page.getByRole('link', { name: 'Email Mo' })).toHaveAttribute(
    'href',
    'mailto:dev.mo.ibrahim@gmail.com',
  )
  await expect(page.getByRole('link', { name: 'GitHub profile' })).toHaveAttribute(
    'href',
    'https://github.com/MoIbrahim10',
  )

  assertRuntimeClean()
})

test('keyboard project navigation never leaves focus in inert content', async ({
  page,
}, testInfo) => {
  test.skip(isMobileProject(testInfo), 'Project dots are intentionally hidden below 620px')
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  await loadHome(page)

  const rail = page.getByRole('region', {
    name: 'Projects. Swipe or scroll horizontally to change project.',
  })
  await rail.focus()
  await page.keyboard.press('ArrowRight')
  const goodInvoiceStory = page.getByRole('region', {
    name: 'The Good Invoice vertical project story.',
  })
  await expect(goodInvoiceStory).toBeFocused()

  const lumenControl = goodInvoiceStory.getByRole('button', {
    name: 'Show Lumen',
  })
  await lumenControl.focus()
  await page.keyboard.press('Enter')
  const lumenStory = page.getByRole('region', {
    name: 'Lumen vertical project story.',
  })
  await expect(lumenStory).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(() => {
        const active = document.activeElement
        return Boolean(active && !active.closest('[inert]'))
      }),
    )
    .toBe(true)
  await expect(lumenStory).toBeFocused()

  assertRuntimeClean()
})

test('every media trigger opens a labeled, keyboard-contained viewer', async ({
  page,
}, testInfo) => {
  test.slow()
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath, '.mp4'],
  })
  await loadHome(page)

  for (const [storyIndex, storyName] of storyNames.entries()) {
    await selectStoryForMediaCheck(page, storyIndex)
    let story = page.getByRole('article', {
      name: `${storyName} project story`,
    })
    await expect(story).toBeVisible()
    let triggers = story.locator('button[aria-label^="View "]')
    await expect(triggers).toHaveCount(expectedTriggerCounts[storyIndex])
    const triggerIndexes = isMobileProject(testInfo)
      ? [0, expectedTriggerCounts[storyIndex] - 1]
      : Array.from({ length: expectedTriggerCounts[storyIndex] }, (_, index) => index)

    for (const triggerIndex of [...new Set(triggerIndexes)]) {
      if (
        testInfo.project.name === 'desktop-webkit' &&
        triggerIndex > 0 &&
        triggerIndex % 5 === 0
      ) {
        const response = await page.reload()
        await waitForHydration(page)
        expect(response?.status()).toBe(200)
        await selectStoryForMediaCheck(page, storyIndex)
        story = page.getByRole('article', {
          name: `${storyName} project story`,
        })
        triggers = story.locator('button[aria-label^="View "]')
      }
      const trigger = triggers.nth(triggerIndex)
      await trigger.scrollIntoViewIfNeeded()
      await trigger.click()
      const dialog = page.getByRole('dialog')
      const closeButton = dialog.getByRole('button', {
        exact: true,
        name: 'Close',
      })
      await expect(dialog).toBeVisible()
      await expect(closeButton).toBeFocused()
      await expect(
        dialog.locator('button[aria-label="Close full-screen media"]'),
      ).toHaveAttribute('tabindex', '-1')
      await expect
        .poll(() =>
          dialog.locator('img, video').evaluateAll((elements) =>
            elements.filter((element) => {
              const style = getComputedStyle(element)
              const bounds = element.getBoundingClientRect()
              return (
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                bounds.width > 0 &&
                bounds.height > 0
              )
            }).length,
          ),
        )
        .toBeGreaterThanOrEqual(1)
      await page.keyboard.press('Tab')
      await expect
        .poll(() =>
          page.evaluate(() =>
            Boolean(document.activeElement?.closest('[role="dialog"]')),
          ),
        )
        .toBe(true)
      if (storyIndex === 0 && triggerIndex === 0) {
        await page.keyboard.press('Escape')
      } else {
        await closeButton.click()
      }
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
    }
  }

  assertRuntimeClean()
})

test('responsive, landscape, and text-spacing matrix does not overflow', async ({
  page,
}) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath, '/cdn-cgi/rum', '.webp'],
    allowedConsoleErrors: [/Image corrupt or truncated/],
  })
  const viewports = [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
    { width: 1440, height: 1000 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await loadHome(page)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Mo Ibrahim — Design Engineer',
      }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Orgo' })).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      `${viewport.width}×${viewport.height} document overflow`,
    ).toBe(true)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await addCssRules(page, [
    '* { letter-spacing: 0.12em !important; line-height: 1.5 !important; word-spacing: 0.16em !important; }',
    'p { margin-bottom: 2em !important; }',
  ])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= 391)).toBe(true)

  await addCssRules(page, ['html { font-size: 200% !important; }'])
  await expect(page.getByText("Hey, I'm", { exact: false })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= 391)).toBe(true)

  assertRuntimeClean()
})

test('reduced motion keeps automatic video playback paused', async ({ page }) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await loadHome(page)

  const inlineVideo = page.locator(`video[src="${orgoVideoPath}"]`).first()
  await expect(inlineVideo).toBeVisible()
  await expect
    .poll(() => inlineVideo.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(true)
  await page
    .getByRole('button', { name: `View ${orgoCaption} full screen` })
    .click()
  const viewerVideo = page
    .getByRole('dialog')
    .locator(`video[src="${orgoVideoPath}"]`)
  await expect(viewerVideo).toBeVisible()
  await expect
    .poll(() => viewerVideo.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(true)

  assertRuntimeClean()
})

test('forced colors preserves visible focus and selected state', async ({ page }) => {
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  await page.emulateMedia({ forcedColors: 'active' })
  await loadHome(page)

  const schedule = page.getByRole('link', { name: 'Schedule a call' })
  await schedule.focus()
  const scheduleFocus = await schedule.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    }
  })
  expect(scheduleFocus.outlineStyle).not.toBe('none')
  expect(scheduleFocus.outlineWidth).toBeGreaterThanOrEqual(2)

  if ((await page.viewportSize())!.width > 620) {
    const selected = page.getByRole('button', { name: 'Show Orgo' }).first()
    const selectedMarker = await selected.locator('span').evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        borderStyle: style.borderStyle,
        borderWidth: Number.parseFloat(style.borderWidth),
      }
    })
    expect(selectedMarker.borderStyle).not.toBe('none')
    expect(selectedMarker.borderWidth).toBeGreaterThanOrEqual(1)
  }

  assertRuntimeClean()
})

test('touch and pointer contracts match the advertised interaction', async ({
  page,
}, testInfo) => {
  test.slow()
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath, '/cdn-cgi/rum', '.mp4', '.webp'],
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1024, height: 768 })
  await loadHome(page)

  const story = page.getByRole('region', {
    name: 'Orgo vertical project story.',
  })
  const touchAction = await story.evaluate((element) => getComputedStyle(element).touchAction)
  expect.soft(touchAction).toContain('pan-x')

  await story.getByRole('button', { name: 'Show The Good Invoice' }).click()
  await expect(
    page.getByRole('article', { name: 'The Good Invoice project story' }),
  ).toBeVisible()

  await page.setViewportSize({ width: 390, height: 844 })
  await loadHome(page)
  await expect
    .soft(
      page
        .locator('article[aria-hidden="false"]')
        .getByText('Swipe left for the next project'),
    )
    .toBeVisible()

  if (testInfo.project.name === 'hybrid-chromium') {
    await page.setViewportSize({ width: 1024, height: 768 })
    await loadHome(page)
    const rail = page.getByRole('region', {
      name: 'Projects. Swipe or scroll horizontally to change project.',
    })
    await rail.focus()
    await page.keyboard.press('Home')
    await page
      .getByRole('button', { name: `View ${orgoCaption} full screen` })
      .tap()
    const dialog = page.getByRole('dialog')
    const video = dialog.locator(`video[src="${orgoVideoPath}"]`)
    const playbackButton = dialog.getByRole('button', {
      name: /^(Play|Pause) video$/,
    })
    await video.tap()
    await expect(playbackButton).toHaveCSS('pointer-events', 'auto')
  }

  assertRuntimeClean()
})

test('desktop scrollbar target and keyboard operation meet the input contract', async ({
  page,
}, testInfo) => {
  test.skip(isMobileProject(testInfo), 'The custom scrollbar is hidden on mobile')
  const assertRuntimeClean = monitorRuntime(page, {
    allowedRequestFailures: [orgoVideoPath],
  })
  await loadHome(page)

  const scrollbar = page.getByRole('scrollbar', { name: 'Scroll Orgo' })
  const bounds = await scrollbar.boundingBox()
  expect(bounds?.width).toBeGreaterThanOrEqual(24)
  await scrollbar.focus()
  await page.keyboard.press('PageDown')
  await expect
    .poll(async () => Number(await scrollbar.getAttribute('aria-valuenow')))
    .toBeGreaterThan(0)

  assertRuntimeClean()
})

for (const [label, path] of [
  ['unknown route', '/item-12-not-found'],
  ['retired video lab', '/video-player-lab'],
] as const) {
  test(`${label} preserves accessible recovery`, async ({ page }) => {
    const assertRuntimeClean = monitorRuntime(page, {
      allowedConsoleErrors: [
        /Failed to load resource: the server responded with a status of 404/,
      ],
      allowedRequestFailures: ['/cdn-cgi/rum'],
    })
    const response = await page.goto(path, { waitUntil: 'networkidle' })
    expect(response?.status()).toBe(404)
    await expect(page).toHaveTitle('Page Not Found — MO')
    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeVisible()
    const returnHome = page.getByRole('link', { name: 'Return home' })
    await returnHome.focus()
    await expect(returnHome).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/$/)

    assertRuntimeClean()
  })
}
