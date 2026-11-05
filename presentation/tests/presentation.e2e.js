import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { AGENDA, EVENT, HOME, SLIDES } from '../src/content.js'

const active = page => page.locator('.slide.active')
const slide = id => SLIDES.find(item => item.id === id)
const indexOf = id => SLIDES.findIndex(item => item.id === id)
const goTo = async (page, id) => {
  await page.goto(`#/deck?slide=${indexOf(id)}`)
  await expect(active(page)).toHaveAttribute('data-slide', String(indexOf(id)))
}
const focusBackground = page => page.locator('body').click({ position: { x: 8, y: 80 } })
const settle = page => page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)))
const cents = amount => Math.round(Number(amount.replace(/[^\d.]/g, '')) * 100)
const trackSubmissions = page => {
  const submissions = []
  page.on('request', request => { if (request.method() !== 'GET') submissions.push(request.url()) })
  return submissions
}

test('landing page, keyboard navigation and the slide index work', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('./')
  await expect(page.locator('.site-nav')).toContainText('ACHMEA × MICROSOFT')
  await expect(page).toHaveTitle(`${EVENT.title} ${EVENT.highlight} / ${EVENT.brand}`)
  expect(await page.locator('main').evaluate(site => site.scrollWidth - site.clientWidth)).toBeLessThanOrEqual(1)
  await page.getByRole('link', { name: HOME.primary }).click()
  await expect(active(page)).toHaveAttribute('data-slide', '0')
  await expect(active(page).getByRole('heading', { level: 1 })).toHaveText(`${EVENT.title} ${EVENT.highlight}`)
  await expect(page.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
  await focusBackground(page)
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toHaveAttribute('data-slide', '1')
  const menuButton = page.getByRole('button', { name: 'All slides' })
  const index = page.getByRole('dialog', { name: 'Slide index' })
  await menuButton.click()
  await expect(index).toBeVisible()
  await expect(index.locator('.menu-list button')).toHaveCount(SLIDES.length)
  await page.keyboard.press('Escape')
  await expect(index).not.toBeVisible()
  await expect(menuButton).toBeFocused()
  await menuButton.click()
  await index.getByRole('button', { name: `${SLIDES.length} Debrief` }).click()
  await expect(active(page)).toHaveAttribute('data-slide', String(SLIDES.length - 1))
  await expect(page.getByRole('button', { name: 'Next slide' })).toBeDisabled()
  await page.getByRole('button', { name: 'Previous slide' }).click()
  await expect(active(page)).toHaveAttribute('data-slide', String(SLIDES.length - 2))
  expect(errors).toEqual([])
})

test('programme links open the requested slide', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('link', { name: slide('handson').title }).click()
  await expect(active(page)).toHaveAttribute('data-slide', String(indexOf('handson')))
  await focusBackground(page)
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toHaveAttribute('data-slide', String(indexOf('handson') + 1))
})

test('worked examples, expected values, agenda and skill counts agree', () => {
  const [complete, missing] = slide('contoso').examples
  for (const example of [complete, missing]) {
    expect(example.lines.reduce((sum, line) => sum + cents(line.amount), 0), example.ref).toBe(cents(example.total))
  }
  const expected = slide('tdd').proof.expected
  expect(expected[0]).toEqual({ customer: complete.ref, value: complete.total })
  expect(expected[1].customer).toBe(missing.ref)
  expect(expected[1].value).toBe(`${missing.total} + cover details unavailable`)
  let minutes = 0
  for (const item of AGENDA) {
    const [hours, mins] = item.at.split(':').map(Number)
    expect(hours * 60 + mins, item.title).toBe(minutes)
    minutes += item.mins
  }
  expect(minutes).toBe(120)
  const skills = slide('skills')
  for (const source of skills.sources) {
    const names = new Set(skills.skills.filter(skill => skill.src === source.id).map(skill => skill.name.split(' ')[0]))
    expect(names.size, source.name).toBe(source.count)
  }
  expect(skills.skills.filter(skill => skill.used).map(skill => skill.name)).toEqual(expect.arrayContaining([
    'grill-with-docs', 'prototype', 'to-spec', 'to-tickets', 'implement', 'karpathy-guidelines', 'impeccable audit', 'impeccable polish',
  ]))
})

test('My Contoso example shows complete and missing information', async ({ page }) => {
  const contoso = slide('contoso')
  await goTo(page, 'contoso')
  const worked = active(page).locator('.worked')
  await expect(active(page)).toContainText(contoso.join.key)
  await expect(worked).toContainText(`${contoso.examples[0].ref}`)
  await expect(worked).toContainText(contoso.examples[0].total)
  await expect(worked).not.toContainText('cover details unavailable')
  await active(page).getByRole('button', { name: contoso.examples[1].label, exact: true }).click()
  await expect(worked).toContainText(contoso.examples[1].ref)
  await expect(worked).toContainText(contoso.examples[1].total)
  await expect(worked.locator('.flag')).toHaveText('cover details unavailable')
  await active(page).getByRole('button', { name: contoso.examples[0].label, exact: true }).click()
  await expect(worked).toContainText(contoso.examples[0].total)
})

test('context ladder explains every level', async ({ page }) => {
  const ladder = slide('ladder')
  await goTo(page, 'ladder')
  const detail = active(page).locator('.ladder-detail')
  await expect(active(page).getByRole('group', { name: ladder.choiceLabel }).getByRole('button')).toHaveCount(ladder.levels.length)
  await expect(detail).toContainText(ladder.levels[ladder.defaultLevel].text)
  for (const level of ladder.levels) {
    await active(page).getByRole('button', { name: `${level.level} ${level.name}`, exact: true }).click()
    await expect(detail).toContainText(level.text)
    await expect(detail.locator('.ladder-path')).toHaveText(level.path)
  }
})

test('Achmea’s context ladder keeps the task fixed while the prompt shrinks', async ({ page }, testInfo) => {
  const readiness = slide('readiness')
  const words = readiness.levels.map(level => level.prompt.trim().split(/\s+/).length)
  expect(words).toEqual([34, 18, 14, 10, 10, 10])
  await goTo(page, 'readiness')
  await expect(active(page).locator('.task-card')).toContainText(readiness.task.text)
  const rows = active(page).locator('.readiness-table tbody tr')
  await expect(rows).toHaveCount(readiness.levels.length)
  for (const [index, level] of readiness.levels.entries()) {
    const row = rows.nth(index)
    await expect(row.locator('th')).toContainText(`${level.level} ${level.state}`)
    if (level.same) await expect(row.locator('.same-prompt')).toHaveText(level.same)
    else await expect(row.locator('q')).toHaveText(level.prompt)
    await expect(row.locator('.words-n')).toHaveText(String(words[index]))
    for (const line of level.why) await expect(row).toContainText(line)
  }
  const level = readiness.levels[2]
  const button = active(page).getByRole('button', { name: `${level.level} ${level.state}` })
  await button.click()
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  await expect(active(page).locator('tr.is-dim')).toHaveCount(readiness.levels.length - 1)
  await button.click()
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  await expect(active(page).locator('tr.is-dim')).toHaveCount(0)
  if (testInfo.project.name === 'desktop') {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.addStyleTag({ content: ':root { --sans: Arial, "Liberation Sans", sans-serif; --mono: "Courier New", "Liberation Mono", monospace; }' })
    await settle(page)
    const bounds = await active(page).locator('.slide-content').boundingBox()
    expect(bounds.y + bounds.height, 'fits 1280 × 720 in wider fallback fonts').toBeLessThan(626)
  }
})

test('prototype variants show their strength and trade-off', async ({ page }) => {
  const prototype = slide('prototype')
  await goTo(page, 'prototype')
  const detail = active(page).locator('.variant-detail')
  for (const variant of prototype.variants) {
    await active(page).getByRole('button', { name: `${variant.id} ${variant.name}` }).click()
    await expect(detail).toContainText(variant.strength)
    await expect(detail).toContainText(variant.tradeoff)
  }
  await expect(active(page)).toContainText(prototype.decision.title)
})

test('ticket statuses follow the example progress', async ({ page }) => {
  const tickets = slide('tickets')
  const { open, blocked, done } = tickets.statusLabels
  const expected = [
    { first: open, parallel: blocked, other: blocked },
    { first: done, parallel: open, other: open },
    { first: done, parallel: done, other: open },
  ]
  await goTo(page, 'tickets')
  const rows = active(page).locator('.ticket-list li')
  await expect(rows).toHaveCount(tickets.tickets.length)
  for (const [index, state] of tickets.states.entries()) {
    await active(page).getByRole('button', { name: state, exact: true }).click()
    await expect(active(page).locator('.first-ticket .status')).toHaveText(expected[index].first)
    for (const [row, ticket] of tickets.tickets.entries()) {
      await expect(rows.nth(row).locator('.status'), ticket.title).toHaveText(ticket.tag ? expected[index].parallel : expected[index].other)
    }
  }
})

test('sessions show one lane per session with pull requests marked', async ({ page }, testInfo) => {
  const sessions = slide('sessions')
  await goTo(page, 'sessions')
  await expect(active(page).locator('.lane')).toHaveCount(sessions.lanes.length)
  await expect(active(page).locator('.node-pr')).toHaveCount(sessions.lanes.flatMap(lane => lane.nodes).filter(node => node.kind === 'pr').length)
  for (const lane of sessions.lanes) {
    for (const node of lane.nodes) expect(node.to ?? node.from, node.label).toBeLessThanOrEqual(sessions.columns)
  }
  if (testInfo.project.name === 'desktop') {
    const heights = () => active(page).locator('.node').evaluateAll(nodes => nodes.map(node => Math.round(node.getBoundingClientRect().height)))
    expect(new Set(await heights()).size, 'every step label fits on one line').toBe(1)
    // Bold Arial metrics are wider than Segoe UI and close to the Linux and macOS fallbacks.
    await page.addStyleTag({ content: ':root { --sans: Arial, "Liberation Sans", sans-serif; }' })
    expect(new Set(await heights()).size, 'every step label fits on one line in a wider font').toBe(1)
  }
})

test('design findings are routed by priority', async ({ page }) => {
  const design = slide('design')
  await goTo(page, 'design')
  const result = active(page).locator('.triage-result')
  for (const option of design.triage.options) {
    await active(page).getByRole('button', { name: option.label, exact: true }).click()
    await expect(result).toContainText(option.result)
    await expect(result).toContainText(option.text)
  }
})

test('quality gate simulation needs both checks and runs no commands', async ({ page }) => {
  const submissions = trackSubmissions(page)
  const gate = slide('verify').gate
  await goTo(page, 'verify')
  const result = active(page).locator('.gate-result')
  await expect(active(page)).toContainText('no commands run')
  await expect(active(page)).toContainText('not a security boundary')
  await expect(result).toHaveText(gate.blocked)
  await active(page).getByRole('button', { name: /^test/ }).click()
  await expect(result).toHaveText(gate.allowed)
  await active(page).getByRole('button', { name: /^typecheck/ }).click()
  await expect(result).toHaveText(gate.blocked)
  expect(submissions).toEqual([])
})

test('hands-on levels and checklist stay in page memory only', async ({ page }) => {
  const submissions = trackSubmissions(page)
  const handson = slide('handson')
  const total = handson.show.items.length
  await goTo(page, 'handson')
  const plan = active(page).locator('.level-plan')
  for (const option of handson.levels.options) {
    await active(page).getByRole('button', { name: option.from, exact: true }).click()
    await expect(plan.locator('.step-square.solid')).toHaveText(option.to)
    await expect(plan).toContainText(option.text.replaceAll('`', ''))
  }
  await expect(active(page).getByRole('status')).toHaveText(`0 of ${total} ready`)
  await active(page).getByRole('checkbox').first().check()
  await expect(active(page).getByRole('status')).toHaveText(`1 of ${total} ready`)
  await page.reload()
  await expect(active(page)).toHaveAttribute('data-slide', String(indexOf('handson')))
  await expect(active(page).getByRole('status')).toHaveText(`0 of ${total} ready`)
  expect(submissions).toEqual([])
})

test('skills cheat sheet filters to the skills used in this build', async ({ page }) => {
  const skills = slide('skills')
  await goTo(page, 'skills')
  await expect(active(page).locator('.skill')).toHaveCount(skills.skills.length)
  await expect(active(page)).toContainText(skills.note)
  await active(page).getByRole('button', { name: skills.filters[1], exact: true }).click()
  await expect(active(page).locator('.skill.is-dim')).toHaveCount(skills.skills.filter(skill => !skill.used).length)
  await active(page).getByRole('button', { name: skills.filters[0], exact: true }).click()
  await expect(active(page).locator('.skill.is-dim')).toHaveCount(0)
})

test('customer build contains no backstage content, private links or source files', async ({ page }) => {
  expect(SLIDES.every(item => !('notes' in item) && !('source' in item))).toBe(true)
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
  await page.getByRole('link', { name: HOME.primary }).click()
  const deckHrefs = await page.locator('a').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')))
  expect(deckHrefs.every(href => href.startsWith('#'))).toBe(true)
  await focusBackground(page)
  await page.keyboard.press('n')
  await expect(page.getByRole('button', { name: /notes/i })).toHaveCount(0)
  await expect(page.getByRole('complementary')).toHaveCount(0)
})

test('every slide fits the desktop screen and scrolls cleanly on a 320px phone', async ({ page }, testInfo) => {
  test.slow()
  const desktop = testInfo.project.name === 'desktop'
  await page.goto('#/deck?slide=0')
  await expect(page.locator('.slide')).toHaveCount(SLIDES.length)
  for (const [index, item] of SLIDES.entries()) {
    await expect(active(page)).toHaveAttribute('data-slide', String(index))
    await expect(page.locator('.slide-content:not([inert])')).toHaveCount(1)
    await settle(page)
    const sizes = await active(page).evaluate(element => ({
      width: element.clientWidth,
      scrollWidth: element.scrollWidth,
      height: element.clientHeight,
      top: element.querySelector('.slide-content').getBoundingClientRect().top,
      bottom: element.querySelector('.slide-content').getBoundingClientRect().bottom,
      chrome: document.querySelector('.deck-chrome').getBoundingClientRect().bottom,
    }))
    expect(sizes.scrollWidth, item.id).toBeLessThanOrEqual(sizes.width + 1)
    expect(sizes.top, `${item.id} starts below the top bar`).toBeGreaterThanOrEqual(sizes.chrome)
    if (desktop) expect(sizes.bottom, item.id).toBeLessThan(sizes.height - 94)
    else {
      await active(page).evaluate(element => { element.scrollTop = element.scrollHeight })
      await expect(active(page).locator('.slide-content > :last-child'), item.id).toBeInViewport()
    }
    await focusBackground(page)
    await page.keyboard.press('ArrowRight')
  }
})

test('every slide and interactive state fits a 1280 × 720 presentation screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Presentation-screen check')
  test.slow()
  await page.setViewportSize({ width: 1280, height: 720 })
  for (const item of SLIDES) {
    await goTo(page, item.id)
    const buttons = await active(page).locator('button[aria-pressed]').all()
    for (const button of [null, ...buttons]) {
      if (button) await button.click()
      await settle(page)
      const bounds = await active(page).locator('.slide-content').boundingBox()
      expect(bounds.y, item.id).toBeGreaterThanOrEqual(80)
      expect(bounds.y + bounds.height, item.id).toBeLessThan(626)
      const overflow = await active(page).evaluate(element => [...element.querySelectorAll('.slide-content *')].filter(child => {
        const rect = child.getBoundingClientRect()
        return rect.width && (rect.left < 0 || rect.right > innerWidth + 1)
      }).map(child => child.className))
      expect(overflow, item.id).toEqual([])
    }
  }
})
