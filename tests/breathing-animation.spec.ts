import { expect, test } from '@playwright/test'

const RUNNING_TOOLS = [
  { id: 'coherent-breathing', startName: 'Start', runningName: 'Pause' },
  { id: 'physiological-sigh', startName: 'Start', runningName: 'Pause' },
  { id: 'box-breathing', startName: 'Start breathing exercise', runningName: 'Pause breathing exercise' },
  { id: 'triangle-breathing', startName: 'Start breathing exercise', runningName: 'Pause breathing exercise' },
  { id: 'four-seven-eight', startName: 'Start', runningName: 'Pause' },
  { id: 'alternate-nostril', startName: 'Start', runningName: 'Pause' },
  { id: 'anchor-phrase-breath', startName: 'Start', runningName: 'Pause' },
  { id: 'bellows-breath', startName: 'Start', runningName: 'Pause' },
  { id: 'ocean-breath', startName: 'Begin', runningName: 'Pause' },
]

const SPACING_TOOLS = [
  { id: 'coherent-breathing', startName: 'Start' },
  { id: 'physiological-sigh', startName: 'Start' },
  { id: 'box-breathing', startName: 'Start breathing exercise' },
  { id: 'triangle-breathing', startName: 'Start breathing exercise' },
]

test.describe('breathing animations', () => {
  for (const tool of RUNNING_TOOLS) {
    test(`${tool.id} stays idle until started`, async ({ page }) => {
      await page.goto(`/?tool=${tool.id}&fresh=animation-regression`)
      await expect(page.getByRole('button', { name: tool.startName })).toBeVisible()
      await expect(page.getByRole('button', { name: tool.runningName })).toHaveCount(0)

      await page.waitForTimeout(900)

      await expect(page.getByRole('button', { name: tool.runningName })).toHaveCount(0)
    })

    test(`${tool.id} enters running state from the start control`, async ({ page }) => {
      await page.goto(`/?tool=${tool.id}&fresh=animation-regression`)
      await page.getByRole('button', { name: tool.startName }).click()

      await expect(page.getByRole('button', { name: tool.runningName })).toBeVisible()
    })
  }

  for (const tool of SPACING_TOOLS) {
    test(`${tool.id} keeps visual and phase text separated`, async ({ page }) => {
      await page.goto(`/?tool=${tool.id}&fresh=animation-regression`)
      await page.getByRole('button', { name: tool.startName }).click()
      await page.waitForTimeout(500)

      const visualBox = await page.getByTestId('tool-visual').boundingBox()
      const phaseBox = await page.getByTestId('phase-readout').boundingBox()

      expect(visualBox).not.toBeNull()
      expect(phaseBox).not.toBeNull()
      if (!visualBox || !phaseBox) return

      expect(visualBox.y + visualBox.height).toBeLessThanOrEqual(phaseBox.y + 4)
    })
  }

  test('coherent-breathing keeps the progress ring outside the expanding circle', async ({ page }) => {
    await page.goto('/?tool=coherent-breathing&fresh=animation-regression')
    await page.getByRole('button', { name: 'Start' }).click()
    await page.waitForTimeout(2500)

    const ringBox = await page.getByTestId('breathing-progress-ring').boundingBox()
    const coreBox = await page.getByTestId('breathing-core').boundingBox()

    expect(ringBox).not.toBeNull()
    expect(coreBox).not.toBeNull()
    if (!ringBox || !coreBox) return

    expect(ringBox.width).toBeGreaterThan(coreBox.width + 8)
    expect(ringBox.height).toBeGreaterThan(coreBox.height + 8)
    expect(ringBox.x + ringBox.width / 2).toBeCloseTo(coreBox.x + coreBox.width / 2, 0)
    expect(ringBox.y + ringBox.height / 2).toBeCloseTo(coreBox.y + coreBox.height / 2, 0)
  })
})
