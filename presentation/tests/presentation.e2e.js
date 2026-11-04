import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { AGENDA, DESIGN, EVENT, EXERCISE, PLANNING, SKILLS, SLIDES } from '../src/content.js'

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
  await index.getByRole('button', { name: '10 Debrief' }).click()
  await expect(active(page)).toHaveAttribute('data-slide', '9')
  await expect(page.getByRole('button', { name: 'Next slide' })).toBeDisabled()
  await page.getByRole('button', { name: 'Previous slide' }).click()
  await expect(active(page)).toHaveAttribute('data-slide', '8')
  expect(errors).toEqual([])
})

test('overview chapter links open the requested slide', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('link', { name: 'Try one repository change' }).click()
  await expect(active(page)).toHaveAttribute('data-slide', '8')
  await focusBackground(page)
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toHaveAttribute('data-slide', '9')
})

test('skill attribution includes the actual workshop commands and working rules', async ({ page }) => {
  await goTo(page, 'skills')
  await expect(active(page).locator('.card')).toHaveCount(3)
  for (const skill of SKILLS) {
    const card = active(page).getByRole('article').filter({ has: page.getByRole('heading', { name: skill.title, exact: true }) })
    await expect(card).toContainText(skill.text)
    await expect(card.locator('pre')).toHaveText(skill.code)
  }
  await expect(active(page)).toContainText('not built-in Copilot features')
  expect(SKILLS.map(skill => skill.code).join('\n')).toMatch(/grill-with-docs[\s\S]*karpathy-guidelines[\s\S]*impeccable audit/)
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

for (const [id, steps] of [['planning', PLANNING], ['design', DESIGN]]) {
  test(`${id} explorer shows each real skill prompt, output and My Contoso example`, async ({ page }) => {
    await goTo(page, id)
    for (const step of steps) {
      await active(page).getByRole('button', { name: new RegExp(step.title) }).click()
      await expect(active(page).locator('.prompt-panel pre')).toHaveText(step.prompt)
      await expect(active(page).locator('.flow-output')).toContainText(step.artifact)
      await expect(active(page).locator('.flow-output')).toContainText(step.output)
      await expect(active(page).locator('.flow-example')).toHaveText(step.example)
    }
  })
}

test('implementation and delegation stay tied to their specific tickets', async ({ page }) => {
  await goTo(page, 'implement')
  await expect(active(page).locator('.prompt-panel pre')).toContainText('/implement #<first-ticket>')
  await expect(active(page).locator('.task-context')).toContainText('€98.40')
  await expect(active(page).locator('.task-checks > div')).toHaveCount(4)
  await expect(active(page)).toContainText('Make surgical changes')
  await goTo(page, 'parallel')
  await expect(active(page)).toContainText('after the first ticket is merged')
  await expect(active(page).locator('.prompt-panel pre')).toContainText('#<missing-information-ticket>')
  await expect(active(page)).toContainText('separate session and worktree')
  await expect(active(page)).toContainText('Never invent coverage')
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

test('exercise uses the workshop skills and keeps selections in page memory only', async ({ page }) => {
  const submissions = []
  page.on('request', request => { if (request.method() !== 'GET') submissions.push(request.url()) })
  await goTo(page, 'exercise')
  for (const option of EXERCISE.options) {
    await active(page).getByRole('button', { name: option.label, exact: true }).click()
    await expect(active(page).locator('.exercise-recommendation')).toContainText(option.action)
    await expect(active(page).locator('.exercise-recommendation pre')).toHaveText(option.prompt)
  }
  await active(page).getByRole('button', { name: 'Matt Pocock', exact: true }).click()
  await active(page).getByRole('checkbox').first().check()
  await expect(active(page).getByRole('status')).toHaveText('1 of 3 checks completed')
  await active(page).getByRole('button', { name: 'Impeccable', exact: true }).click()
  await expect(active(page).locator('.exercise-recommendation')).toContainText('Audit one page')
  await expect(active(page).getByRole('status')).toHaveText('0 of 3 checks completed')
  for (const checkbox of await active(page).getByRole('checkbox').all()) await checkbox.check()
  await expect(active(page).getByRole('status')).toHaveText('3 of 3 checks completed')
  await active(page).getByRole('button', { name: 'Matt Pocock', exact: true }).click()
  await expect(active(page).getByRole('status')).toHaveText('1 of 3 checks completed')
  await page.reload()
  await expect(active(page).getByRole('status')).toHaveText('0 of 3 checks completed')
  expect(submissions).toEqual([])
})

test('customer build contains no backstage content, private links or source attachments', async ({ page }) => {
  expect(SLIDES.every(slide => !('notes' in slide) && !('source' in slide))).toBe(true)
  const dist = join(import.meta.dirname, '..', 'dist')
  const files = readdirSync(dist, { recursive: true, withFileTypes: true }).filter(file => file.isFile())
  const forbidden = /Natethebuilder|facilitator|rehearsal|stage\/[012]-|guide\.md|GUIDE STEPS?|Total Rewards|prd-achmea|Supplied Achmea deck|85\.4|5217|5176|speaker notes|ACHMEA × GITHUB COPILOT|Deliver with confidence|Make delegation deliberate/i
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
  await expect(page.locator('.slide')).toHaveCount(10)
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
