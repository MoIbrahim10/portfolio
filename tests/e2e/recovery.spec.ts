import { expect, test } from '@playwright/test'

test('Clockwork Sun is the red error page and winding retries the page', async ({ page }) => {
  await page.goto('/error')
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Something went wrong.')
  await expect(page.locator('[data-error="0"]')).toHaveAttribute('data-theme', 'red')
  const wheel = page.getByRole('slider', { name: 'Wind the sun machine' })
  const reloaded = page.waitForEvent('request', { predicate: request => request.isNavigationRequest() && request.url().endsWith('/error') })
  await wheel.press('End')
  await reloaded
  await expect(wheel).toHaveAttribute('aria-valuenow', '0')
  await page.getByRole('link', { name: '← Back home', exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('offline recovery survives navigation and reload with all radio stations audible', async ({ page, context, request }) => {
  test.setTimeout(90_000)
  const script = await request.get('/sw.js')
  test.skip(!script.ok() || (await script.text()).includes('__ASSETS__'), 'Requires the production offline bundle')
  await page.addInitScript(() => {
    const NativeAudioContext = window.AudioContext
    const probe = { contexts: [] as AudioContext[], analysers: [] as AnalyserNode[] }
    Object.defineProperty(window, 'offlineAudio', { value: probe })
    window.AudioContext = class extends NativeAudioContext {
      constructor() { super(); probe.contexts.push(this) }
      createAnalyser() { const node = super.createAnalyser(); probe.analysers.push(node); return node }
    }
  })
  const energy = () => page.evaluate(() => {
    const probe = (window as typeof window & { offlineAudio: { analysers: AnalyserNode[] } }).offlineAudio
    const analyser = probe.analysers.at(-1)
    if (!analyser) return 0
    const samples = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(samples)
    return samples.reduce((sum, value) => sum + value * value, 0) / samples.length
  })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout: 30_000 }).toBe(true)
  const cachedPaths = await page.evaluate(async () => {
    const cache = await caches.open((await caches.keys()).find(name => name.startsWith('mo-recovery-'))!)
    return (await cache.keys()).map(request => new URL(request.url).pathname)
  })
  expect(cachedPaths).toContain('/offline')
  expect(cachedPaths.some(path => path.startsWith('/api/') || /\.(mp4|webm)$/.test(path))).toBe(false)
  await context.setOffline(true)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('No internet.Still on the air.')
  await page.getByRole('button', { name: 'Check connection ↻' }).click()
  await expect(page.getByText('Still offline. The music can stay.', { exact: true })).toBeVisible()
  await page.goto('/a-route-opened-without-internet')
  await expect(page).toHaveURL(/\/offline$/)
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.locator('[data-offline="1"]')).toHaveAttribute('data-theme', 'paper')
  await expect(page.getByRole('button', { name: 'Turn radio on' })).toBeVisible()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
  await page.getByRole('button', { name: 'Turn radio on' }).click()
  const dial = page.getByRole('slider', { name: 'Tune the radio' })
  for (const [value, label] of [[22, 'DUNE FM'], [56, 'SOLAR RADIO'], [84, 'FUTURE FM']] as const) {
    await dial.press('Home')
    for (let i = 0; i < value; i++) await dial.press('ArrowRight')
    await expect(page.getByText(label, { exact: true })).toBeVisible()
    await expect.poll(energy).toBeGreaterThan(0.000001)
  }
  await page.getByRole('button', { name: 'Turn radio off' }).click()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { offlineAudio: { contexts: AudioContext[] } }).offlineAudio.contexts.every(context => context.state === 'closed'))).toBe(true)
  await page.getByText('Music credits', { exact: true }).click()
  await expect(page.getByText(/Excerpts by Kevin MacLeod/)).toBeVisible()
  await expect(page.getByText(/AI host/i)).toHaveCount(0)
  await context.setOffline(false)
  await page.getByRole('button', { name: 'Check connection ↻' }).click()
  await expect(page).toHaveURL(/\/$/)
  expect(errors).toEqual([])
})
