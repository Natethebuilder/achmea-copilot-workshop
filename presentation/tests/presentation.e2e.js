import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { AGENDA, EVENT, LEVELS, SLIDES, WORKFLOW } from '../src/content.js'

const active = page => page.locator('.slide.active')
const goTo = async (page, id) => {
  const index = SLIDES.findIndex(slide => slide.id === id)
  await page.goto(`#/deck?slide=${index}`)
  await expect(active(page)).toHaveAttribute('data-slide', String(index))
}
const focusBackground = page => page.locator('body').click({ position: { x: 8, y: 80 } })

test('overview, keyboard navigation and accessible slide index work', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('./')
  await expect(page.locator('.site-nav')).toContainText('ACHMEA × MICROSOFT')
  await expect(page).toHaveTitle(/ACHMEA × MICROSOFT/)
  await page.getByRole('link', { name: 'Explore the presentation' }).click()
  await expect(active(page).getByRole('heading', { level: 1 })).toHaveText(`${EVENT.title} ${EVENT.highlight}`)
  await expect(page.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
  await focusBackground(page)
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toHaveAttribute('data-slide', '1')
  await page.getByRole('button', { name: 'All slides' }).click()
  const index = page.getByRole('dialog', { name: 'Slide index' })
  await expect(index).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(index).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'All slides' })).toBeFocused()
  await page.getByRole('button', { name: 'All slides' }).click()
  await index.getByRole('button', { name: '19 Better foundations.' }).click()
  await expect(active(page)).toHaveAttribute('data-slide', '18')
  await expect(page.getByRole('button', { name: 'Next slide' })).toBeDisabled()
  await page.getByRole('button', { name: 'Previous slide' }).click()
  await expect(active(page)).toHaveAttribute('data-slide', '17')
  expect(errors).toEqual([])
})

test('overview chapter links open the requested slide', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('link', { name: 'Your repository. One useful next move.' }).click()
  await expect(active(page)).toHaveAttribute('data-slide', '16')
  await focusBackground(page)
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toHaveAttribute('data-slide', '17')
})

test('every readiness level has a concrete action and evidence', async ({ page }) => {
  await goTo(page, 'ladder')
  for (const level of LEVELS) {
    await active(page).getByRole('button', { name: `${level.level} ${level.title}` }).click()
    await expect(active(page).locator('.level-detail')).toContainText(level.next)
    await expect(active(page).locator('.level-detail')).toContainText(level.example)
  }
})

test('synthetic scenarios explain complete and missing information', async ({ page }) => {
  await goTo(page, 'scenario')
  await expect(active(page).locator('.premium')).toContainText('€98.40')
  await active(page).getByRole('button', { name: 'Missing information', exact: true }).click()
  await expect(active(page).locator('.premium')).toContainText('Cover unavailable')
  await expect(active(page).locator('.policy-result')).toContainText('Never invent insurance cover')
  await active(page).getByRole('button', { name: 'Complete information', exact: true }).click()
  await expect(active(page).locator('.premium')).toContainText('€98.40')
  await expect(active(page)).toContainText('fictional insurance application')
})

test('workflow explorer explains each phase and responsibility', async ({ page }) => {
  await goTo(page, 'workflow')
  for (const phase of WORKFLOW) {
    await active(page).getByRole('button', { name: new RegExp(phase.title) }).click()
    await expect(active(page).locator('.phase-detail')).toContainText(phase.human)
    await expect(active(page).locator('.phase-detail')).toContainText(phase.agent)
    await expect(active(page).locator('.phase-detail')).toContainText(phase.evidence)
  }
})

test('gate requires every example check to pass and runs no commands', async ({ page }) => {
  await goTo(page, 'gate')
  await expect(active(page)).toContainText('No commands run here')
  const result = active(page).locator('.gate-result')
  await expect(result).toContainText('Change needs attention')
  await active(page).getByRole('button', { name: 'Behavior tests Fail' }).click()
  await expect(result).toContainText('Ready to proceed')
  await expect(result).toContainText('normal approval process')
  await active(page).getByRole('button', { name: 'Type checking Pass' }).click()
  await expect(result).toContainText('Change needs attention')
  await active(page).getByRole('button', { name: 'Behavior tests Pass' }).click()
  await expect(result).toContainText('Change needs attention')
})

test('exercise preserves per-level selections only while the page is open', async ({ page }) => {
  const submissions = []
  page.on('request', request => { if (request.method() !== 'GET') submissions.push(request.url()) })
  await goTo(page, 'exercise')
  await expect(active(page).locator('.exercise-recommendation')).toContainText('Add repository guidance')
  await active(page).getByRole('checkbox').first().check()
  await expect(active(page).getByRole('status')).toHaveText('1 of 3 evidence steps explored')
  await active(page).getByRole('button', { name: 'L4', exact: true }).click()
  await expect(active(page).locator('.exercise-recommendation')).toContainText('Add a validation hook')
  await expect(active(page).getByRole('status')).toHaveText('0 of 3 evidence steps explored')
  for (const checkbox of await active(page).getByRole('checkbox').all()) await checkbox.check()
  await expect(active(page).getByRole('status')).toHaveText('3 of 3 evidence steps explored')
  await active(page).getByRole('button', { name: 'L0', exact: true }).click()
  await expect(active(page).getByRole('status')).toHaveText('1 of 3 evidence steps explored')
  await page.reload()
  await expect(active(page).getByRole('status')).toHaveText('0 of 3 evidence steps explored')
  expect(submissions).toEqual([])
})

test('customer build contains no backstage content, private links or source attachments', async ({ page }) => {
  expect(SLIDES.every(slide => !('notes' in slide) && !('source' in slide))).toBe(true)
  const dist = join(import.meta.dirname, '..', 'dist')
  const files = readdirSync(dist, { recursive: true, withFileTypes: true }).filter(file => file.isFile())
  const forbidden = /Natethebuilder|facilitator|rehearsal|stage\/[012]-|guide\.md|GUIDE STEPS?|Total Rewards|prd-achmea|Supplied Achmea deck|85\.4|5217|5176|speaker notes|ACHMEA × GITHUB COPILOT/i
  for (const file of files) {
    expect(file.name).not.toMatch(/\.(?:pptx|pdf|map)$/i)
    if (/\.(?:js|css|html|svg)$/i.test(file.name)) {
      expect(readFileSync(join(file.parentPath, file.name), 'utf8'), file.name).not.toMatch(forbidden)
    }
  }
  await page.goto('./')
  const hrefs = await page.locator('a').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')))
  expect(hrefs.every(href => href.startsWith('#'))).toBe(true)
  await page.getByRole('link', { name: 'Explore the presentation' }).click()
  await focusBackground(page)
  await page.keyboard.press('n')
  await expect(page.getByRole('button', { name: /notes/i })).toHaveCount(0)
  await expect(page.getByRole('complementary')).toHaveCount(0)
})

test('all slides fit desktop and remain readable on a 320px phone', async ({ page }, testInfo) => {
  await page.goto('#/deck?slide=0')
  await expect(page.locator('.slide')).toHaveCount(19)
  expect(AGENDA.reduce((sum, item) => sum + item.mins, 0)).toBe(120)
  for (let index = 0; index < SLIDES.length; index++) {
    await expect(active(page)).toHaveAttribute('data-slide', String(index))
    const sizes = await active(page).evaluate(slide => {
      const content = slide.querySelector('.slide-content').getBoundingClientRect()
      return { slideWidth: slide.clientWidth, scrollWidth: slide.scrollWidth, contentBottom: content.bottom, height: slide.clientHeight }
    })
    expect(sizes.scrollWidth, SLIDES[index].id).toBeLessThanOrEqual(sizes.slideWidth + 1)
    if (testInfo.project.name === 'desktop') expect(sizes.contentBottom, SLIDES[index].id).toBeLessThan(sizes.height - 94)
    else {
      await active(page).evaluate(slide => { slide.scrollTop = slide.scrollHeight })
      await expect(active(page).locator('.takeaway')).toBeInViewport()
    }
    await expect(page.locator('.slide-content:not([inert])')).toHaveCount(1)
    await focusBackground(page)
    await page.keyboard.press('ArrowRight')
  }
})

test('all slides and explorer states fit a 1280px presentation screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Presentation-screen check')
  await page.setViewportSize({ width: 1280, height: 720 })
  for (const slide of SLIDES) {
    await goTo(page, slide.id)
    const buttons = await active(page).locator('button[aria-pressed]').all()
    for (const button of [null, ...buttons]) {
      if (button) await button.click()
      const bounds = await active(page).locator('.slide-content').boundingBox()
      expect(bounds.y, slide.id).toBeGreaterThanOrEqual(80)
      expect(bounds.y + bounds.height, slide.id).toBeLessThan(626)
      const overflow = await active(page).evaluate(element => [...element.querySelectorAll('.slide-content *')].filter(child => {
        const bounds = child.getBoundingClientRect()
        return bounds.width && (bounds.left < 0 || bounds.right > innerWidth + 1)
      }).map(child => child.className))
      expect(overflow, slide.id).toEqual([])
    }
  }
})
