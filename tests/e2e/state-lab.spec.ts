import { expect, test, type Page } from '@playwright/test'

import { CONCEPTS } from '../../src/components/state-lab/state-concepts'
import type { StateKind } from '../../src/components/state-lab/state-concepts'

test.beforeEach(() => {
  test.skip(Boolean(process.env.PLAYWRIGHT_TEST_BASE_URL), 'State explorations are local only')
})

async function click(page: Page, name: string) {
  await page.getByRole('button', { exact: true, name }).click()
}

async function clickAll(page: Page, label: string, count: number) {
  for (let i = 1; i <= count; i++) await click(page, `${label} ${i}`)
}

async function orientArchPiece(page: Page, i: number) {
  const piece = page.getByRole('button', { name: `Place arch piece ${i}`, exact: true })
  for (let n = 0; n < 4 && await piece.getAttribute('data-turn') !== '0'; n++) await piece.press('ArrowLeft')
}

async function solveArch(page: Page) {
  for (let i = 1; i <= 6; i++) {
    await orientArchPiece(page, i)
    await page.getByRole('button', { name: `Place arch piece ${i}`, exact: true }).press('Enter')
  }
}

const exercises: Record<StateKind, Array<{ run: (page: Page) => Promise<void>; result: string }>> = {
  '404': [
    { run: async p => {
      await expect(p.getByRole('button', { name: /Open the doorway/ })).toHaveCount(0)
      const doorway = p.getByRole('group', { name: 'Explore the hidden doorway' })
      await doorway.focus()
      await expect(doorway).toBeFocused()
      await p.keyboard.press('ArrowRight')
      await expect(doorway).toHaveAttribute('data-open', 'true')
    }, result: 'A quiet courtyard. A little light on the other side.' },
    { run: async p => {
      await expect(p.locator('input[type="range"]')).toHaveCount(0)
      await p.getByRole('slider', { name: 'Rotate solar compass' }).press('Home')
    }, result: 'North. Home is that way.' },
  ],
  offline: [
    { run: p => clickAll(p, 'Connect wire', 3), result: 'The illustration is connected. Your network may still be offline.' },
    { run: async p => {
      const slider = p.getByRole('slider', { name: 'Tune the radio' })
      await slider.press('Home')
      for (let i = 0; i < 56; i++) await slider.press('ArrowRight')
    }, result: 'Station found. A little music, no internet needed.' },
    { run: async p => { for (let i = 0; i < 4; i++) await click(p, 'Water the oasis') }, result: 'Small things grow with a little care.' },
    { run: p => p.getByRole('slider', { name: 'Move the sun' }).press('End'), result: 'The quiet part of the evening.' },
    { run: async p => {
      const canvas = p.getByRole('group', { name: 'Draw in the sand' }).locator('svg')
      await canvas.scrollIntoViewIfNeeded()
      const box = await canvas.boundingBox()
      if (!box) throw new Error('Sand drawing canvas is missing')
      await p.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3)
      await p.mouse.down()
      await p.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6, { steps: 5 })
      await p.mouse.up()
      await expect(canvas.locator('path[class*=etchedLine]')).toHaveCount(1)
      await click(p, 'Fresh sand')
      await expect(canvas.locator('path[class*=etchedLine]')).toHaveCount(0)
      await p.getByRole('group', { name: 'Draw in the sand' }).press('Enter')
    }, result: 'Draw with a finger or pointer. The sand is yours.' },
    { run: p => clickAll(p, 'Light star', 6), result: 'A whole constellation. All yours.' },
    { run: p => click(p, 'Launch the paper plane'), result: '1 flight of fancy. Zero internet required.' },
    { run: p => clickAll(p, 'Play rhythm pad', 4), result: 'A little rhythm, made visible.' },
    { run: async p => { await click(p, 'Build column 1'); await click(p, 'Build column 1'); await click(p, 'Build column 3') }, result: 'A satisfying little balance.' },
    { run: p => p.getByRole('textbox', { name: 'Your passing thought' }).fill('A little room for curiosity.'), result: 'Just a local doodle. This note isn’t sent or saved.' },
  ],
  error: [
    { run: p => p.getByRole('slider', { name: 'Wind the sun machine' }).press('End'), result: 'Ready. Trying again.' },
    { run: solveArch, result: 'Ready. Trying again.' },
    { run: p => p.getByRole('button', { name: 'Give the sun a soft landing' }).press('Enter'), result: 'Ready. Trying again.' },
  ],
}

for (const kind of ['404', 'offline', 'error'] as const) {
  test(`${kind}: all concepts respond without runtime errors or horizontal overflow`, async ({ page }) => {
    test.setTimeout(60_000)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    const response = await page.goto(`/state-lab#${kind}/1`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
    const preview = page.getByRole('region', { name: 'Selected concept preview' })
    await expect(preview.getByRole('heading', { name: CONCEPTS[kind][0].name, exact: true })).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    await expect(page.getByRole('button', { name: /^Preview \d\d:/ })).toHaveCount(CONCEPTS[kind].length)

    for (let i = 0; i < CONCEPTS[kind].length; i++) {
      await click(page, `Preview ${String(i + 1).padStart(2, '0')}: ${CONCEPTS[kind][i].name}`)
      await expect(preview.getByRole('heading', { name: CONCEPTS[kind][i].name, exact: true })).toBeVisible()
      await exercises[kind][i].run(page)
      await expect(preview.getByText(exercises[kind][i].result, { exact: true })).toHaveText(exercises[kind][i].result)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${kind} concept ${i + 1} fits viewport`).toBe(true)
    }

    await click(page, 'Restart interaction')
    if (kind === 'offline') await expect(page.getByRole('textbox', { name: 'Your passing thought' })).toHaveValue('')
    if (kind === 'error') await expect(page.getByRole('button', { name: 'Give the sun a soft landing' })).toHaveAttribute('aria-pressed', 'false')
    if (kind === '404') await expect(page.getByRole('slider', { name: 'Rotate solar compass' })).toHaveAttribute('aria-valuenow', '135')
    expect(errors).toEqual([])
  })
}

test('picks survive switching states; full-page links, reduced motion and offline play work', async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/state-lab#404/1/page')
  await expect(page.getByRole('button', { name: 'Exit full page ↙', exact: true })).toBeVisible()
  await click(page, 'Pick this 404 ♡')
  await expect(page.getByRole('button', { name: 'Your pick ✓', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Exit full page ↙', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Preview \d\d:/ })).toHaveCount(2)
  await click(page, 'Offline 10')
  await click(page, 'Pick this offline page ♡')
  await click(page, 'Error 3')
  await expect(page.getByRole('button', { name: 'Your pick ✓', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await click(page, 'Your pick ✓')
  await click(page, 'Pick this error page ♡')
  await click(page, '404 2')
  await expect(page.getByRole('button', { name: 'Your pick ✓', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await click(page, 'Next concept')
  await click(page, 'Full page ↗')
  await expect(page).toHaveURL(/#404\/2\/orbit\/page$/)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Solar compass', exact: true })).toBeVisible()
  await click(page, 'Exit full page ↙')
  await click(page, 'Offline 10')
  await context.setOffline(true)
  await clickAll(page, 'Connect wire', 3)
  await expect(page.getByText('The illustration is connected. Your network may still be offline.', { exact: true })).toBeVisible()
  await click(page, 'Check connection ↻')
  await expect(page.getByText('Preview only: the live page will check the connection and retry.', { exact: true })).toBeVisible()
  await context.setOffline(false)
})

test('refined error pages support gestures, keyboard, sound and reduced motion', async ({ page }) => {
  await page.goto('/state-lab#error/1/page')
  const wheel = page.getByRole('slider', { name: 'Wind the sun machine' })
  await expect(wheel).toBeVisible()
  const machine = (await page.locator('[data-error-art="0"] > svg').boundingBox())!
  const machineHeight = await page.locator('[data-error-art="0"] > svg').evaluate(element => (element as SVGSVGElement).viewBox.baseVal.height)
  const wheelPoint = (angle: number) => ({
    x: machine.x + (400 + Math.cos(angle) * 45) / 600 * machine.width,
    y: machine.y + (249 + Math.sin(angle) * 45) / machineHeight * machine.height,
  })
  const start = wheelPoint(0)
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  for (let i = 1; i <= 48; i++) {
    const point = wheelPoint(i * Math.PI / 15)
    await page.mouse.move(point.x, point.y)
  }
  await page.mouse.up()
  await expect(wheel).toHaveAttribute('aria-valuenow', '540')
  await click(page, 'Enable sound')
  await expect(page.getByRole('button', { name: 'Mute sound' })).toHaveAttribute('aria-pressed', 'true')
  await click(page, 'Mute sound')
  await click(page, 'Try again')
  await expect(page.getByRole('button', { name: 'Try again', exact: true })).toHaveAttribute('aria-busy', 'true')
  await expect(page.getByText('Preview retried.', { exact: true })).toBeVisible()

  await page.goto('/state-lab#error/2/page')
  const piece = page.getByRole('button', { name: 'Place arch piece 1' })
  await expect(piece).toBeVisible()
  await orientArchPiece(page, 1)
  const arch = (await page.locator('[data-error-art="1"] > svg').boundingBox())!
  const block = (await piece.boundingBox())!
  await page.mouse.move(block.x + block.width / 2, block.y + block.height / 2)
  await page.mouse.down()
  await page.mouse.move(block.x + block.width / 2 + 125 / 600 * arch.width, block.y + block.height / 2 + 5 / 420 * arch.height, { steps: 8 })
  await page.mouse.up()
  await expect(piece).toHaveAttribute('aria-disabled', 'true')
  for (let i = 2; i <= 6; i++) {
    await orientArchPiece(page, i)
    await page.getByRole('button', { name: `Place arch piece ${i}` }).press('Enter')
  }
  await expect(page.getByText('Ready. Trying again.', { exact: true })).toBeVisible()

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/state-lab#error/3/page')
  const sun = page.getByRole('button', { name: 'Give the sun a soft landing' })
  await sun.press('Enter')
  await expect(sun).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByText('Ready. Trying again.', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Try again', exact: true })).toBeEnabled()
})

test('each solved error retries automatically and recovery actions stay aligned', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (let i = 0; i < 3; i++) {
    await page.goto(`/state-lab#error/${i + 1}/page`)
    const preview = page.locator('[data-error]')
    await expect(preview).toHaveAttribute('data-error', String(i))
    await expect(preview.getByRole('heading', { name: 'Something went wrong.', exact: true })).toBeVisible()
    await expect(preview.getByText('This page couldn’t load. Let’s try again.', { exact: true })).toBeVisible()
    const retry = page.getByRole('button', { name: 'Try again', exact: true })
    const home = preview.getByRole('link', { name: 'Back home', exact: true })
    const r = (await retry.boundingBox())!
    const h = (await home.boundingBox())!
    expect(Math.abs(r.y - h.y)).toBeLessThanOrEqual(1)
    expect(Math.abs(r.height - h.height)).toBeLessThanOrEqual(1)
    await expect(home).toHaveAttribute('href', '/')
    const count = Number(await preview.getAttribute('data-retry-count'))
    await exercises.error[i].run(page)
    await expect(preview).toHaveAttribute('data-retry-count', String(count + 1))
    await expect(retry).toHaveAttribute('aria-busy', 'true')
    await expect(preview).toHaveAttribute('data-retrying', 'false')
    await expect(page.locator('[data-error-art]')).toHaveAttribute('data-solved', 'false')
  }
  await page.getByRole('link', { name: 'Back home', exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Mo Ibrahim — Product Engineer' })).toBeVisible()
})

test('six interlocking arch stones need the right orientation with forgiving placement', async ({ page }) => {
  await page.goto('/state-lab#error/2/page')
  const piece = (i: number) => page.getByRole('button', { name: `Place arch piece ${i}` })
  await expect(page.getByRole('button', { name: /^Place arch piece/ })).toHaveCount(6)
  await piece(1).press('Enter')
  await expect(piece(1)).toHaveAttribute('aria-disabled', 'false')
  await expect(page.getByText('Turn this stone to fit.', { exact: true })).toBeVisible()
  const scene = (await page.locator('[data-error-art="1"] > svg').boundingBox())!
  const block = (await piece(1).boundingBox())!
  const from = { x: block.x + block.width / 2, y: block.y + block.height / 2 }
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(from.x + 110 / 600 * scene.width, from.y + 5 / 420 * scene.height, { steps: 8 })
  await page.mouse.up()
  await expect(piece(1)).toHaveAttribute('aria-disabled', 'false')
  const position = () => piece(1).locator('g').first().evaluate(element => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform)
    return { x: matrix.m41, y: matrix.m42 }
  })
  await expect.poll(async () => { const p = await position(); return Math.hypot(p.x - 30, p.y) }).toBeLessThan(0.1)
  await piece(1).click()
  await expect(piece(1)).toHaveAttribute('data-turn', '180')
  await expect(piece(1)).toHaveAttribute('aria-disabled', 'false')
  await piece(1).click()
  await piece(1).click()
  await expect(piece(1)).toHaveAttribute('aria-disabled', 'true')
  for (const i of [3, 4, 2]) {
    await orientArchPiece(page, i)
    await piece(i).press('Enter')
  }
  const assembly = page.locator('[data-arch-assembly][data-grounded="true"]')
  await expect(assembly).toHaveCount(1)
  expect(Number(await assembly.getAttribute('data-lean'))).toBeGreaterThan(0)
  for (const i of [5, 6]) {
    await orientArchPiece(page, i)
    await piece(i).press('Enter')
  }
  await expect(assembly).toHaveAttribute('data-lean', '0')
  await expect(page.locator('[data-error-art="1"]')).toHaveAttribute('data-solved', 'true')
})

test('soft landing changes direction after misses and retries, and a real catch retries', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeAudioContext = window.AudioContext
    const probe = { tones: 0, ramps: [] as number[] }
    Object.defineProperty(window, 'missAudio', { value: probe })
    window.AudioContext = class extends NativeAudioContext {
      createOscillator() {
        probe.tones++
        const oscillator = super.createOscillator()
        const ramp = oscillator.frequency.exponentialRampToValueAtTime.bind(oscillator.frequency)
        oscillator.frequency.exponentialRampToValueAtTime = (value, time) => { probe.ramps.push(value); return ramp(value, time) }
        return oscillator
      }
    }
  })
  const audioProbe = () => page.evaluate(() => (window as typeof window & { missAudio: { tones: number; ramps: number[] } }).missAudio)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/state-lab#error/3/page')
  const art = page.locator('[data-error-art="2"]')
  const sun = page.getByRole('button', { name: 'Give the sun a soft landing' })
  const ball = sun.locator('g').first()
  await expect(sun).toBeVisible()
  const scene = (await art.locator(':scope > svg').boundingBox())!
  const position = () => ball.evaluate(element => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform)
    return { x: matrix.m41, y: matrix.m42 }
  })
  const moveNet = (x: number) => page.mouse.move(scene.x + x / 600 * scene.width, scene.y + 340 / 420 * scene.height)
  const directions: number[] = []
  let mutedTones = 0
  for (let i = 0; i < 4; i++) {
    if (i === 1) await click(page, 'Enable sound')
    if (i === 2) { await click(page, 'Mute sound'); mutedTones = (await audioProbe()).tones }
    const start = await position()
    await sun.click()
    await expect(art).toHaveAttribute('data-phase', 'falling')
    await expect.poll(async () => Math.abs((await position()).x - start.x)).toBeGreaterThan(20)
    const direction = Math.sign((await position()).x - start.x)
    directions.push(direction)
    await moveNet(direction > 0 ? 175 : 425)
    await expect(art).toHaveAttribute('data-phase', 'bouncing')
    await expect(art.locator('[data-stunned="true"]')).toBeVisible()
    await expect(art).toHaveAttribute('data-solved', 'false')
    await expect(art).toHaveAttribute('data-phase', 'missed')
    expect((await position()).x).not.toBe(start.x)
    if (i === 0) expect(await audioProbe()).toEqual({ tones: 0, ramps: [] })
    if (i === 1) expect((await audioProbe()).ramps).toEqual([76, 38, 130])
    if (i >= 2) expect((await audioProbe()).tones).toBe(mutedTones)
  }
  for (let i = 1; i < directions.length; i++) expect(directions[i]).toBe(-directions[i - 1])

  const beforeRetry = await position()
  await click(page, 'Try again')
  await expect(page.locator('[data-error]')).toHaveAttribute('data-retrying', 'false')
  expect((await position()).x).not.toBe(beforeRetry.x)
  const count = Number(await page.locator('[data-error]').getAttribute('data-retry-count'))
  const beforeCatch = await position()
  await sun.click()
  for (let i = 0; i < 18; i++) {
    await moveNet((await position()).x)
    await page.waitForTimeout(80)
  }
  await expect(art).toHaveAttribute('data-solved', 'true')
  await expect(page.locator('[data-error]')).toHaveAttribute('data-retry-count', String(count + 1))
  await expect(page.locator('[data-error]')).toHaveAttribute('data-retrying', 'false')
  expect((await position()).x).not.toBe(beforeCatch.x)
})

test('soft landing keeps a touch drag active through the catch', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Native touch check')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/state-lab#error/3/page')
  const sun = page.getByRole('button', { name: 'Give the sun a soft landing' })
  const ball = sun.locator('g').first()
  await expect(sun).toBeVisible()
  const scene = (await page.locator('[data-error-art="2"] > svg').boundingBox())!
  const clientX = () => ball.evaluate(element => new DOMPoint(0, 0).matrixTransform((element as SVGGraphicsElement).getScreenCTM()!).x)
  const cdp = await page.context().newCDPSession(page)
  await sun.tap()
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: scene.x + scene.width / 2, y: scene.y + 340 / 420 * scene.height }] })
  for (let i = 0; i < 16; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: await clientX(), y: scene.y + 340 / 420 * scene.height }] })
    await page.waitForTimeout(80)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect(page.locator('[data-error-art="2"]')).toHaveAttribute('data-solved', 'true')
  await expect(page.locator('[data-error]')).toHaveAttribute('data-retry-count', '1')
  await cdp.detach()
})

test('doorway and compass respond to direct gestures and keyboard with reduced motion', async ({ page, isMobile }) => {
  await page.goto('/state-lab#404/1/page')
  await expect(page.getByRole('button', { name: 'Exit full page ↙', exact: true })).toBeVisible()
  const door = page.getByRole('group', { name: 'Explore the hidden doorway' })
  await expect(door).toBeVisible()
  if (isMobile) {
    await door.tap()
  } else {
    await door.hover()
    await expect(door).toHaveAttribute('data-open', 'false')
    await page.mouse.move(0, 0)
    await expect(door).toHaveAttribute('data-open', 'false')
    await door.click()
    await page.mouse.move(0, 0)
  }
  await expect(door).toHaveAttribute('data-open', 'true')
  const courtyard = door.locator('svg').first()
  await expect(courtyard).not.toContainText('↗')
  await door.press('Escape')
  await expect(door).toHaveAttribute('data-open', 'false')
  await expect(page.getByRole('button', { name: 'Exit full page ↙' })).toBeVisible()
  const doorBox = await courtyard.boundingBox()
  if (!doorBox) throw new Error('Doorway is missing')
  await page.mouse.move(doorBox.x + doorBox.width * 214 / 520, doorBox.y + doorBox.height * 220 / 400)
  await page.mouse.down()
  await page.mouse.move(doorBox.x + doorBox.width * 125 / 520, doorBox.y + doorBox.height * 220 / 400, { steps: 10 })
  await page.mouse.up()
  await expect(door).toHaveAttribute('data-open', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await door.press('ArrowRight')
  const leaves = door.locator('[data-side="left"]')
  expect(await leaves.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s')
  await click(page, 'Next concept')
  const compass = page.getByRole('slider', { name: 'Rotate solar compass' })
  await expect(compass).toHaveAttribute('aria-valuenow', '135')
  await compass.scrollIntoViewIfNeeded()
  const box = await compass.locator('svg').boundingBox()
  if (!box) throw new Error('Compass is missing')
  const cx = box.x + box.width / 2
  const cy = box.y + box.height * 205 / 400
  const radius = box.width * 100 / 520
  await page.mouse.move(cx + radius, cy)
  await page.mouse.down()
  await page.mouse.move(cx, cy - radius, { steps: 10 })
  await page.mouse.up()
  await expect(compass).toHaveAttribute('aria-valuenow', '0')
  await compass.press('Home')
  await expect(compass).toHaveAttribute('aria-valuenow', '0')
  await expect(page.getByText('North. Home is that way.', { exact: true })).toHaveText('North. Home is that way.')
  const needle = compass.locator('g[transform="rotate(0 260 205)"]').last()
  expect(await needle.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s')
  await expect(page.locator('input[type="range"]')).toHaveCount(0)
})

test('404 retains two directions, wraps navigation, and resolves removed concept links', async ({ page }) => {
  await page.goto('/state-lab#404/9')
  await expect(page).toHaveURL(/#404\/2\/orbit$/)
  await expect(page.getByRole('button', { name: /^Preview \d\d:/ })).toHaveCount(2)
  await expect(page.getByRole('heading', { name: 'Solar compass', exact: true })).toBeVisible()
  await click(page, 'Next concept')
  await expect(page.getByRole('heading', { name: 'The hidden doorway', exact: true })).toBeVisible()
  await click(page, 'Previous concept')
  await expect(page.getByRole('heading', { name: 'Solar compass', exact: true })).toBeVisible()
  const preview = page.getByRole('region', { name: 'Selected concept preview' })
  await expect(preview.getByRole('heading', { level: 3 })).toHaveCount(1)
  expect(await preview.locator('[data-404] p').evaluateAll(elements => elements.every(element => getComputedStyle(element).clipPath === 'inset(50%)'))).toBe(true)
  const logo = preview.getByRole('link', { name: 'MO portfolio home' })
  expect(await logo.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
})

test('404 keeps only the centered doorway and orbit, and redirects old layout links', async ({ page }) => {
  await page.goto('/state-lab#404/1/night-gate/page')
  await expect(page).toHaveURL(/#404\/1\/page$/)
  await expect(page.getByRole('button', { name: /^Layout:/ })).toHaveCount(0)
  await expect(page.locator('[data-404]')).toHaveAttribute('data-theme', 'paper')
  await page.goto('/state-lab#404/2/atlas/page')
  await expect(page).toHaveURL(/#404\/2\/orbit\/page$/)
  const preview = page.locator('[data-404]')
  await expect(preview).toHaveAttribute('data-theme', 'navy')
  await expect(page.getByRole('button', { name: /^Layout:/ })).toHaveCount(0)
  await page.keyboard.press('Escape')
  await click(page, 'Pick this 404 ♡')
  await click(page, 'Previous concept')
  await page.getByRole('button', { name: /^404.*Solar compass$/ }).click()
  await expect(page.getByRole('button', { name: 'Your pick ✓' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page).toHaveURL(/#404\/2\/orbit$/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('compass flicks coast, grabbing interrupts, and reduced motion skips momentum', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/state-lab#404/2/orbit/page')
  await expect(page.getByRole('button', { name: 'Exit full page ↙', exact: true })).toBeVisible()
  const compass = page.getByRole('slider', { name: 'Rotate solar compass' })
  await compass.scrollIntoViewIfNeeded()
  const box = await compass.locator('svg').boundingBox()
  if (!box) throw new Error('Compass is missing')
  const cx = box.x + box.width / 2
  const cy = box.y + box.height * 205 / 400
  const radius = box.width * 100 / 520

  async function flick() {
    await page.mouse.move(cx + radius, cy)
    await page.mouse.down()
    await page.mouse.move(cx, cy - radius, { steps: 6 })
    await page.mouse.up()
  }

  await flick()
  await expect(compass).toHaveAttribute('data-spinning', 'true')
  const released = await compass.getAttribute('aria-valuenow')
  await expect.poll(() => compass.getAttribute('aria-valuenow')).not.toBe(released)
  await page.mouse.move(cx + radius, cy)
  await page.mouse.down()
  await expect(compass).not.toHaveAttribute('data-spinning', 'true')
  await expect(compass).toHaveAttribute('data-dragging', 'true')
  await page.mouse.up()
  await compass.press('Home')
  await expect(compass).toHaveAttribute('aria-valuenow', '0')
  await expect(compass).toHaveAttribute('data-north', 'true')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await compass.press('PageUp')
  await compass.press('PageUp')
  await compass.press('PageUp')
  await flick()
  await expect(compass).not.toHaveAttribute('data-spinning', 'true')
  await expect(compass).toHaveAttribute('aria-valuenow', '0')
  await compass.press('Home')
  const rays = compass.locator('[class*=sunRays]').last()
  expect(await rays.evaluate(element => getComputedStyle(element).animationName)).toBe('none')
})

test('orbit follows the cursor, responds to hover, and unfolds a sun only at north', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/state-lab#404/2/orbit/page')
  const compass = page.getByRole('slider', { name: 'Rotate solar compass' })
  await compass.scrollIntoViewIfNeeded()
  const box = await compass.boundingBox()
  if (!box) throw new Error('Compass is missing')
  const cx = box.x + box.width / 2
  const cy = box.y + box.height * 205 / 400
  const radius = box.width * 100 / 520
  await page.mouse.move(cx + radius, cy)
  await expect(compass).toHaveAttribute('aria-valuenow', '90')
  await expect(compass).toHaveAttribute('data-following', 'true')
  const surface = compass.locator('div').first()
  expect(await surface.evaluate(element => getComputedStyle(element).transform)).not.toBe('none')
  expect(await surface.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s')
  expect(await compass.locator('g[transform] > g[data-aligned]').evaluate(element => getComputedStyle(element.parentElement!).transitionDuration)).toBe('0s')
  expect(await surface.evaluate(element => getComputedStyle(element, '::after').opacity)).not.toBe('0')
  await page.mouse.move(cx, cy)
  await expect(compass).toHaveAttribute('aria-valuenow', '90')
  await page.mouse.move(cx, box.y - 20)
  await expect(compass).toHaveAttribute('aria-valuenow', '0')
  await expect(compass).not.toHaveAttribute('data-following', 'true')
  await page.mouse.move(cx, cy - radius)
  await expect(compass).toHaveAttribute('aria-valuenow', '0')
  await expect(compass).toHaveAttribute('data-north', 'true')
  const seal = compass.locator('g[data-aligned]').last()
  await expect.poll(() => seal.evaluate(element => getComputedStyle(element).opacity)).toBe('1')
  const pointer = compass.locator('g[transform] > g[data-aligned]')
  await expect.poll(() => pointer.evaluate(element => getComputedStyle(element).opacity)).toBe('0')
  await page.mouse.move(0, 0)
  await expect(compass).not.toHaveAttribute('data-following', 'true')
  await expect(compass).toHaveAttribute('aria-valuenow', '0')
  await compass.press('ArrowRight')
  await expect(compass).toHaveAttribute('aria-valuenow', '5')
  await expect(compass).toHaveAttribute('data-north', 'false')
  await expect.poll(() => seal.evaluate(element => getComputedStyle(element).opacity)).toBe('0')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.mouse.move(cx + radius, cy)
  await expect(compass).toHaveAttribute('aria-valuenow', '90')
  expect(await surface.evaluate(element => getComputedStyle(element).transform)).toBe('none')
})

test('sound is opt-in, plays compass and doorway tones, and stops when muted or reset', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeAudioContext = window.AudioContext
    const probe = { contexts: [] as AudioContext[], tones: 0 }
    Object.defineProperty(window, 'stateLabAudio', { value: probe })
    window.AudioContext = class extends NativeAudioContext {
      constructor() { super(); probe.contexts.push(this) }
      createOscillator() { probe.tones++; return super.createOscillator() }
    }
  })
  const probe = () => page.evaluate(() => {
    const audio = (window as typeof window & { stateLabAudio: { contexts: AudioContext[]; tones: number } }).stateLabAudio
    return { states: audio.contexts.map(context => context.state), tones: audio.tones }
  })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/state-lab#404/2/orbit/page')
  const compass = page.getByRole('slider', { name: 'Rotate solar compass' })
  await compass.press('Home')
  await expect(page.getByRole('button', { name: 'Enable sound' })).toHaveAttribute('aria-pressed', 'false')
  expect(await probe()).toEqual({ states: [], tones: 0 })
  await click(page, 'Enable sound')
  await expect.poll(async () => (await probe()).states).toEqual(['running'])
  await expect.poll(async () => (await probe()).tones).toBe(1)
  await compass.press('PageUp')
  const beforeNorth = (await probe()).tones
  await compass.press('Home')
  await expect.poll(async () => (await probe()).tones).toBe(beforeNorth + 3)
  await click(page, 'Mute sound')
  await expect.poll(async () => (await probe()).states).toEqual(['closed'])
  const muted = (await probe()).tones
  await compass.press('PageUp')
  await compass.press('Home')
  expect((await probe()).tones).toBe(muted)
  await click(page, 'Enable sound')
  await expect.poll(async () => (await probe()).states).toEqual(['closed', 'running'])
  await click(page, 'Restart interaction')
  await expect.poll(async () => (await probe()).states).toEqual(['closed', 'closed'])
  await expect(page.getByRole('button', { name: 'Enable sound' })).toHaveAttribute('aria-pressed', 'false')
  await click(page, 'Previous concept')
  const door = page.getByRole('group', { name: 'Explore the hidden doorway' })
  await click(page, 'Enable sound')
  await expect.poll(async () => (await probe()).states).toEqual(['closed', 'closed', 'running'])
  const beforeDoor = (await probe()).tones
  await door.press('ArrowRight')
  await expect.poll(async () => (await probe()).tones).toBe(beforeDoor + 2)
  await door.press('Escape')
  await expect.poll(async () => (await probe()).tones).toBe(beforeDoor + 4)
  expect(errors).toEqual([])
})

test('radio audio is opt-in, tunes static into music offline, and stops on mute or navigation', async ({ page, context }) => {
  await page.addInitScript(() => {
    const NativeAudioContext = window.AudioContext
    const probe = { contexts: [] as AudioContext[], analysers: [] as AnalyserNode[], sources: [] as AudioBufferSourceNode[] }
    Object.defineProperty(window, 'radioAudio', { value: probe })
    window.AudioContext = class extends NativeAudioContext {
      constructor() { super(); probe.contexts.push(this) }
      createBiquadFilter() {
        const filter = super.createBiquadFilter()
        const analyser = super.createAnalyser()
        analyser.fftSize = 4096
        filter.connect(analyser)
        probe.analysers.push(analyser)
        return filter
      }
      createBufferSource() { const source = super.createBufferSource(); probe.sources.push(source); return source }
    }
  })
  const audio = () => page.evaluate(() => {
    const probe = (window as typeof window & { radioAudio: { contexts: AudioContext[]; analysers: AnalyserNode[]; sources: AudioBufferSourceNode[] } }).radioAudio
    const analyser = probe.analysers.at(-1)
    let low = 0
    let high = 0
    if (analyser) {
      const bands = new Float32Array(analyser.frequencyBinCount)
      analyser.getFloatFrequencyData(bands)
      bands.forEach((db, i) => {
        const hz = i * analyser.context.sampleRate / analyser.fftSize
        if (hz > 150 && hz < 700) low += 10 ** (db / 10)
        if (hz > 1400 && hz < 5000) high += 10 ** (db / 10)
      })
    }
    return { states: probe.contexts.map(c => c.state), sources: probe.sources.filter(source => source.loop).length, energy: low + high, warmth: low / high }
  })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/state-lab#offline/2/page')
  const dial = page.getByRole('slider', { name: 'Tune the radio' })
  await expect(page.getByRole('heading', { level: 3 })).toHaveText('No internet.\nStill on the air.')
  await expect(dial).toBeVisible()
  await context.setOffline(true)
  await dial.press('Home')
  expect((await audio()).states).toEqual([])
  await click(page, 'Turn radio on')
  await expect(page.getByRole('button', { name: 'Mute sound', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(async () => (await audio()).states).toEqual(['running'])
  await expect.poll(async () => (await audio()).energy).toBeGreaterThan(0.0000001)
  await expect.poll(async () => (await audio()).warmth).toBeLessThan(1.2)
  const staticWarmth = (await audio()).warmth
  for (let i = 0; i < 56; i++) await dial.press('ArrowRight')
  await expect(dial).toHaveAttribute('aria-valuetext', '99.2 FM. Solar Radio. piano lounge.')
  await expect(page.getByText('SOLAR RADIO', { exact: true })).toBeVisible()
  await expect.poll(async () => (await audio()).warmth).toBeGreaterThan(staticWarmth * 2)
  expect((await audio()).sources).toBe(4)
  await click(page, 'Check connection ↻')
  await expect(page.getByText('Still offline. The music can stay.', { exact: true })).toBeVisible()
  await expect(dial).toHaveAttribute('aria-valuenow', '56')
  expect((await audio()).states).toEqual(['running'])
  expect((await audio()).sources).toBe(4)
  for (const station of [{ value: 22, label: 'DUNE FM' }, { value: 84, label: 'FUTURE FM' }]) {
    await dial.press('Home')
    for (let i = 0; i < station.value; i++) await dial.press('ArrowRight')
    await expect(page.getByText(station.label, { exact: true })).toBeVisible()
    await expect.poll(async () => (await audio()).energy).toBeGreaterThan(0.0000001)
    expect((await audio()).sources).toBe(4)
  }
  await dial.press('End')
  await expect.poll(async () => (await audio()).warmth).toBeLessThan(1.2)
  expect((await audio()).sources).toBe(4)
  await click(page, 'Turn radio off')
  await expect(page.getByRole('button', { name: 'Enable sound', exact: true })).toHaveAttribute('aria-pressed', 'false')
  await expect.poll(async () => (await audio()).states).toEqual(['closed'])
  await click(page, 'Enable sound')
  await expect.poll(async () => (await audio()).states).toEqual(['closed', 'running'])
  await click(page, 'Restart interaction')
  await expect.poll(async () => (await audio()).states).toEqual(['closed', 'closed'])
  await click(page, 'Enable sound')
  await click(page, 'Next concept')
  await expect.poll(async () => (await audio()).states).toEqual(['closed', 'closed', 'closed'])
  expect(errors).toEqual([])
})

test('radio reloads only after a successful connection check', async ({ page }) => {
  await page.goto('/state-lab#offline/2/page')
  const dial = page.getByRole('slider', { name: 'Tune the radio' })
  await dial.press('End')
  let available = false
  await page.route('**/', route => route.request().method() === 'HEAD'
    ? route.fulfill({ status: available ? 200 : 503 })
    : route.continue())
  await click(page, 'Check connection ↻')
  await expect(page.getByText('The page is still unavailable. Try again shortly.', { exact: true })).toBeVisible()
  await expect(dial).toHaveAttribute('aria-valuenow', '100')
  available = true
  const reload = page.waitForEvent('request', { predicate: request => request.isNavigationRequest() && request.url().includes('/state-lab') })
  await click(page, 'Check connection ↻')
  await reload
  await expect(dial).toHaveAttribute('aria-valuenow', '24')
})

test('offline art supports touch, direct drag, independent sand strokes, and postcard sealing', async ({ page, isMobile, context }) => {
  await page.goto('/state-lab#offline/1/page')
  const canvas = page.getByRole('group', { name: 'Explore offline illustration' })
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Offline canvas is missing')
  await page.mouse.move(box.x + box.width * 213 / 520, box.y + box.height * 98 / 400)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 320 / 520, box.y + box.height * 98 / 400, { steps: 12 })
  await page.mouse.up()
  await expect(page.getByRole('button', { name: 'Connect wire 1' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Connect wire 1' })).toHaveAttribute('aria-pressed', 'true')
  const wire = page.getByRole('button', { name: 'Connect wire 2' })
  if (isMobile) await wire.tap(); else await wire.click()
  await expect(wire).toBeDisabled()
  await click(page, 'Next concept')
  const dial = page.getByRole('slider', { name: 'Tune the radio' })
  const radioBox = await canvas.boundingBox()
  if (!radioBox) throw new Error('Radio is missing')
  const cx = radioBox.x + radioBox.width * 384 / 520
  const cy = radioBox.y + radioBox.height * 257 / 400
  const radius = radioBox.width * 28 / 520
  const dialBounds = await canvas.locator('[data-radio-dial]').evaluate(element => {
    const box = (element as SVGGraphicsElement).getBBox()
    return { left: box.x, right: box.x + box.width, top: box.y, bottom: box.y + box.height }
  })
  expect(dialBounds.left).toBeGreaterThan(62)
  expect(dialBounds.right).toBeLessThan(446)
  expect(dialBounds.top).toBeGreaterThan(186)
  expect(dialBounds.bottom).toBeLessThan(314)
  await dial.press('Home')
  if (isMobile) await dial.tap(); else await dial.click()
  await expect(dial).toHaveAttribute('aria-valuenow', '0')
  for (let i = 0; i < 24; i++) await dial.press('ArrowRight')
  await page.mouse.move(cx, cy - radius)
  await page.mouse.down()
  await page.mouse.move(cx + radius, cy, { steps: 8 })
  await page.mouse.up()
  expect(Number(await dial.getAttribute('aria-valuenow'))).toBeGreaterThan(24)
  await dial.press('Home')
  for (let i = 0; i < 56; i++) await dial.press('ArrowRight')
  await expect(dial).toHaveAttribute('aria-valuenow', '56')
  await dial.press('ArrowRight')
  await expect(dial).toHaveAttribute('aria-valuenow', '57')
  await page.mouse.move(cx, cy - radius)
  await page.mouse.down()
  await page.mouse.move(cx + radius, cy, { steps: 50 })
  await page.mouse.up()
  expect(Number(await dial.getAttribute('aria-valuenow'))).toBeGreaterThan(75)
  await dial.press('Home')
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx, cy - radius, { steps: 8 })
  await page.mouse.up()
  expect(Number(await dial.getAttribute('aria-valuenow'))).toBeGreaterThan(0)

  await click(page, 'Next concept')
  const water = page.getByRole('button', { name: 'Water the oasis' })
  if (isMobile) await water.tap(); else await water.click()
  await expect(page.locator('g[class*=plant]')).toHaveAttribute('transform', /scale\(0.55\)/)
  await context.setOffline(true)
  for (let i = 0; i < 3; i++) await water.click()
  await expect(page.getByText('Small things grow with a little care.', { exact: true })).toHaveText('Small things grow with a little care.')
  await context.setOffline(false)

  await click(page, 'Next concept')
  const sun = page.getByRole('slider', { name: 'Move the sun' })
  const sunBox = await canvas.boundingBox()
  if (!sunBox) throw new Error('Sun is missing')
  await sun.hover()
  const buttonBox = await sun.boundingBox()
  if (!buttonBox) throw new Error('Sun control is missing')
  await page.mouse.move(buttonBox.x + buttonBox.width / 2, buttonBox.y + buttonBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(sunBox.x + sunBox.width * 410 / 520, sunBox.y + sunBox.height * 180 / 400, { steps: 12 })
  await page.mouse.up()
  expect(Number(await sun.getAttribute('aria-valuenow'))).toBeGreaterThan(90)

  await click(page, 'Next concept')
  const sand = page.getByRole('group', { name: 'Draw in the sand' })
  await sand.press('Enter')
  await sand.press('Enter')
  await expect(sand.locator('path[class*=etchedLine]')).toHaveCount(2)
  await sand.press('Delete')
  await expect(sand.locator('path[class*=etchedLine]')).toHaveCount(0)

  await page.goto('/state-lab#offline/10/page')
  const postcard = page.getByRole('textbox', { name: 'Your passing thought' })
  await postcard.fill('Some thoughts can wait.')
  await click(page, 'Seal postcard')
  await expect(postcard).toHaveCount(0)
  await expect(page.getByText('A thought, sealed in a little sunshine.', { exact: true })).toHaveText('A thought, sealed in a little sunshine.')
  await click(page, 'Open postcard')
  await expect(postcard).toHaveValue('Some thoughts can wait.')
  await click(page, 'Restart interaction')
  await expect(postcard).toHaveValue('')
})

test('offline compositions stay minimal and usable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/state-lab#offline/1/page')
  for (let i = 0; i < CONCEPTS.offline.length; i++) {
    const stage = page.locator('[data-offline]')
    await expect(stage).toHaveAttribute('data-offline', String(i))
    await expect(stage.getByRole('heading', { level: 3 })).toHaveCount(1)
    if (i === 1) await expect(stage.getByText('NO INTERNET', { exact: true })).toHaveCount(0)
    else await expect(stage.getByText('NO INTERNET', { exact: true })).toBeVisible()
    await expect(stage.locator('input[type=range]')).toHaveCount(0)
    await expect(stage.locator('[class*=artControls]')).toHaveCount(0)
    const logo = stage.getByRole('link', { name: 'MO portfolio home' })
    expect(await logo.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
    const frame = await stage.boundingBox()
    if (!frame) throw new Error('Offline stage is missing')
    for (const element of [stage.getByRole('heading', { level: 3 }), stage.getByRole('button', { name: 'Check connection ↻' })]) {
      const box = await element.boundingBox()
      if (!box) throw new Error('Offline content is missing')
      expect(box.x).toBeGreaterThanOrEqual(frame.x)
      expect(box.x + box.width).toBeLessThanOrEqual(frame.x + frame.width + 1)
      expect(box.y + box.height).toBeLessThanOrEqual(frame.y + frame.height + 1)
    }
    expect(await stage.locator('button[data-hit]').evaluateAll(buttons => buttons.every(button => button.getBoundingClientRect().width >= 44 && button.getBoundingClientRect().height >= 44))).toBe(true)
    await click(page, 'Next concept')
  }
})
