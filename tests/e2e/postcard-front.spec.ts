import { expect, test } from '@playwright/test'

test('four scenes sit below the centered logo and respond independently without shifting the print', async ({ page, isMobile }, testInfo) => {
  await page.goto('/feedback')
  const card = page.locator('[data-postcard-front]')
  await expect(card.locator('..').locator('..').locator('..').locator('..')).toHaveCSS('opacity', '1')
  const scenes = card.locator('[data-scene]')
  await expect(scenes).toHaveCount(4)
  // Measure within the postcard; touch focus can scroll the page.
  const positions = () => card.evaluate((card) => {
    const paper = card.getBoundingClientRect()
    return Array.from(card.querySelectorAll('img, [data-scene]')).map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect()
      return { x: x - paper.x, y: y - paper.y, width, height }
    })
  })
  const boxes = await positions()
  const paper = (await card.boundingBox())!
  expect(Math.abs(boxes[0].x + boxes[0].width / 2 - paper.width / 2)).toBeLessThan(paper.width * .015)
  const prints = boxes.slice(1)
  expect(Math.max(...prints.map((box) => box.y)) - Math.min(...prints.map((box) => box.y))).toBeGreaterThan(prints[0].height)
  for (const [index, box] of prints.entries()) {
    expect(boxes[0].y + boxes[0].height).toBeLessThan(box.y)
    expect(box.x).toBeGreaterThan(0)
    expect(box.x + box.width).toBeLessThan(paper.width)
    expect(box.y + box.height).toBeLessThan(paper.height)
    for (const other of prints.slice(index + 1)) {
      const overlapX = Math.min(box.x + box.width, other.x + other.width) - Math.max(box.x, other.x)
      const overlapY = Math.min(box.y + box.height, other.y + other.height) - Math.max(box.y, other.y)
      expect(overlapX <= 0 || overlapY <= 0).toBe(true)
    }
  }
  const states = () => scenes.evaluateAll((elements) => elements.map((element) => Array.from(element.querySelectorAll('svg g, svg circle')).map((part) => {
    const style = getComputedStyle(part)
    return `${style.transform} / ${style.opacity}`
  })))
  await page.mouse.move(0, 0)
  await expect.poll(() => card.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length)).toBe(0)
  const resting = await states()
  if (!isMobile) {
    for (const [index, scene] of (await scenes.all()).entries()) {
      await scene.hover()
      await expect.poll(async () => (await states())[index]).not.toEqual(resting[index])
      const active = await states()
      expect(active.filter((_, i) => i !== index)).toEqual(resting.filter((_, i) => i !== index))
      await page.mouse.move(0, 0)
      await expect.poll(states).toEqual(resting)
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const [index, scene] of (await scenes.all()).entries()) {
    if (isMobile) await scene.tap()
    else await scene.focus()
    await expect(scene).toBeFocused()
    expect((await states())[index]).not.toEqual(resting[index])
    expect(await card.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length)).toBe(0)
  }
  const after = await positions()
  expect(after).toEqual(boxes)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Write a note', exact: true }).focus()
  await card.screenshot({ path: `.playwright-mcp/postcard-front-scenes-${testInfo.project.name}.png` })
})
