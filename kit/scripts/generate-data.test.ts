import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const AS_OF = '2026-09-30'
const readData = (name: string) => readFileSync(new URL(`../data/${name}`, import.meta.url), 'utf8')

const [header, ...rows] = readData('policy-admin-export.csv').trimEnd().split(/\r?\n/)
const columns = header.split(',')
const policies = rows.map((row) => Object.fromEntries(row.split(',').map((value, i) => [columns[i], value])))
const coverRecords: { policyNumber: string; cover: string; deductible: number; addOns: string[] }[] = JSON.parse(
  readData('coverage-feed.json'),
)

const customerIds = [...new Set(policies.map((p) => p.customerId))]
const policiesOf = (customerId: string) => policies.filter((p) => p.customerId === customerId)
const isRunning = (policy: Record<string, string>) =>
  policy.startDate <= AS_OF && (policy.endDate === '' || policy.endDate >= AS_OF)

describe('policy-admin-export.csv', () => {
  it('has the expected columns and one well-formed row per policy', () => {
    expect(columns).toEqual([
      'policyNumber',
      'customerId',
      'firstName',
      'lastName',
      'product',
      'startDate',
      'endDate',
      'paymentTerm',
      'premium',
    ])
    for (const row of rows) expect(row.split(',')).toHaveLength(columns.length)
    expect(new Set(policies.map((p) => p.policyNumber)).size).toBe(policies.length)
  })

  it('covers 50 customers, each with the same name on every policy', () => {
    expect(customerIds).toHaveLength(50)
    for (const id of customerIds) {
      expect(new Set(policiesOf(id).map((p) => `${p.firstName} ${p.lastName}`)).size).toBe(1)
    }
  })

  it('charges positive premiums in euros with two decimals', () => {
    for (const policy of policies) {
      expect(policy.premium).toMatch(/^\d+\.\d{2}$/)
      expect(Number(policy.premium)).toBeGreaterThan(0)
    }
  })

  it('includes monthly, quarterly and yearly payment terms', () => {
    expect(new Set(policies.map((p) => p.paymentTerm))).toEqual(new Set(['monthly', 'quarterly', 'yearly']))
  })

  it('includes C1001, the prototype customer, with policies paid monthly and yearly', () => {
    const c1001 = policiesOf('C1001')
    expect(c1001.every(isRunning)).toBe(true)
    expect(new Set(c1001.map((p) => p.paymentTerm))).toEqual(new Set(['monthly', 'yearly']))
  })

  it('includes C1002, whose policies all run and are paid monthly', () => {
    const c1002 = policiesOf('C1002')
    expect(c1002.length).toBeGreaterThanOrEqual(2)
    expect(c1002.every((p) => isRunning(p) && p.paymentTerm === 'monthly')).toBe(true)
  })

  it('includes ended policies, a policy that starts later, and C1033, who has no running policy', () => {
    for (const policy of policies.filter((p) => p.endDate !== '')) expect(policy.endDate > policy.startDate).toBe(true)
    expect(policies.filter((p) => p.endDate !== '' && p.endDate < AS_OF).length).toBeGreaterThan(0)
    expect(policies.filter((p) => p.startDate > AS_OF).length).toBeGreaterThan(0)
    expect(customerIds.filter((id) => !policiesOf(id).some(isRunning))).toEqual(['C1033'])
  })
})

describe('coverage-feed.json', () => {
  const policyNumbers = new Set(policies.map((p) => p.policyNumber))

  it('has at most one cover record per known policy', () => {
    expect(new Set(coverRecords.map((c) => c.policyNumber)).size).toBe(coverRecords.length)
    for (const record of coverRecords) expect(policyNumbers.has(record.policyNumber)).toBe(true)
  })

  it('uses whole-euro deductibles, including no deductible', () => {
    for (const record of coverRecords) {
      expect(Number.isInteger(record.deductible)).toBe(true)
      expect(record.deductible).toBeGreaterThanOrEqual(0)
    }
    expect(coverRecords.map((c) => c.deductible)).toContain(0)
  })

  it("leaves exactly one running policy without a cover record: one of C1042's", () => {
    const covered = new Set(coverRecords.map((c) => c.policyNumber))
    const uncovered = policies.filter((p) => !covered.has(p.policyNumber))
    expect(uncovered.map((p) => p.customerId)).toEqual(['C1042'])
    expect(uncovered.every(isRunning)).toBe(true)
  })
})
