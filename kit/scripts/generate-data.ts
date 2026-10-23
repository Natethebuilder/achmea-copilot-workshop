// Generates the synthetic My Contoso mock data sources in data/:
//   - policy-admin-export.csv: one row per policy, from the policy administration system
//   - coverage-feed.json: the cover of each policy, from the product system
// Seeded, so every run produces identical files. All customers and values are fake.
//
// Conventions:
//   - The data is as of 30 September 2026.
//   - premium is the amount charged each payment term, in euros with two decimals, including
//     insurance premium tax. Yearly payers get a 3% discount, already included in premium.
//   - startDate is the first day of cover. endDate is the last day of cover, and is empty
//     while the policy runs on.
//   - deductible is what the customer pays themselves per claim, in whole euros. 0 means none.
//   - Add-ons are included in the policy premium.
import { mkdirSync, writeFileSync } from 'node:fs'
import { Faker, base, en, generateMersenne53Randomizer, nl } from '@faker-js/faker'

const SEED = 20261012
const CUSTOMER_COUNT = 50
const FIRST_POLICY_NUMBER = 100001
const YEARLY_DISCOUNT = 0.03

const randomizer = generateMersenne53Randomizer()
randomizer.seed(SEED)
const faker = new Faker({ locale: [en, base], randomizer })
const names = new Faker({ locale: [nl, en, base], randomizer })

type Product = 'car' | 'home_contents' | 'home_building' | 'liability' | 'travel' | 'legal_aid'
type PaymentTerm = 'monthly' | 'quarterly' | 'yearly'

const PRODUCTS: Record<
  Product,
  {
    weight: number
    monthlyPremium: [number, number]
    covers: [cover: string, priceFactor: number][]
    deductibles: number[]
    addOns: string[]
  }
> = {
  car: {
    weight: 8,
    monthlyPremium: [28, 64],
    covers: [
      ['third_party', 1],
      ['third_party_plus', 1.35],
      ['comprehensive', 1.8],
    ],
    deductibles: [0, 150, 250, 500],
    addOns: ['roadside_assistance', 'passenger_accident', 'no_claim_protection'],
  },
  home_contents: {
    weight: 7,
    monthlyPremium: [7, 16],
    covers: [
      ['basic', 1],
      ['extended', 1.25],
      ['all_risk', 1.6],
    ],
    deductibles: [0, 100, 250],
    addOns: ['outdoor_cover', 'valuables_cover'],
  },
  home_building: {
    weight: 4,
    monthlyPremium: [14, 32],
    covers: [
      ['basic', 1],
      ['extended', 1.25],
      ['all_risk', 1.6],
    ],
    deductibles: [0, 100, 250, 500],
    addOns: ['glass_cover', 'garden_cover'],
  },
  liability: {
    weight: 7,
    monthlyPremium: [3, 6],
    covers: [
      ['single', 1],
      ['family', 1.4],
    ],
    deductibles: [0, 100],
    addOns: [],
  },
  travel: {
    weight: 4,
    monthlyPremium: [3, 7],
    covers: [
      ['europe', 1],
      ['worldwide', 1.5],
    ],
    deductibles: [0, 50],
    addOns: ['winter_sports', 'cancellation_cover'],
  },
  legal_aid: {
    weight: 3,
    monthlyPremium: [11, 19],
    covers: [
      ['basic', 1],
      ['extended', 1.3],
    ],
    deductibles: [0],
    addOns: ['traffic_cover', 'housing_cover'],
  },
}

const PAYMENT_TERMS: { value: PaymentTerm; weight: number }[] = [
  { value: 'monthly', weight: 14 },
  { value: 'quarterly', weight: 2 },
  { value: 'yearly', weight: 4 },
]
const TERM_MONTHS: Record<PaymentTerm, number> = { monthly: 1, quarterly: 3, yearly: 12 }

type PolicyPin = {
  product: Product
  paymentTerm?: PaymentTerm
  startDate?: string
  endDate?: string
  cover?: string
  deductible?: number
  addOns?: string[]
  withoutCoverRecord?: boolean
}

// Edge cases are pinned so they exist regardless of the random draws.
const OVERRIDES: Record<string, { firstName?: string; lastName?: string; policies?: PolicyPin[] }> = {
  // The prototype customer: four running policies, paid monthly and yearly.
  C1001: {
    policies: [
      { product: 'car', paymentTerm: 'monthly', cover: 'comprehensive', deductible: 250, addOns: ['roadside_assistance'] },
      { product: 'home_contents', paymentTerm: 'monthly', cover: 'all_risk', deductible: 0, addOns: [] },
      { product: 'liability', paymentTerm: 'yearly', cover: 'family' },
      { product: 'travel', paymentTerm: 'yearly', cover: 'worldwide', addOns: ['winter_sports'] },
    ],
  },
  // Every policy runs and is paid monthly: the simplest complete overview.
  C1002: {
    policies: [
      { product: 'car', paymentTerm: 'monthly' },
      { product: 'home_contents', paymentTerm: 'monthly' },
      { product: 'liability', paymentTerm: 'monthly' },
    ],
  },
  C1004: {
    policies: [
      { product: 'home_building', paymentTerm: 'quarterly' },
      { product: 'home_contents', paymentTerm: 'quarterly' },
    ],
  },
  // A policy that starts after the data date.
  C1007: {
    policies: [
      { product: 'car', paymentTerm: 'monthly' },
      { product: 'home_contents', paymentTerm: 'monthly', startDate: '2026-11-01' },
    ],
  },
  // One policy is cancelled but still runs until 31 December 2026, and one has ended.
  C1012: {
    policies: [
      { product: 'car', paymentTerm: 'monthly', endDate: '2026-12-31' },
      { product: 'travel', paymentTerm: 'yearly', startDate: '2021-05-01', endDate: '2026-04-30' },
      { product: 'liability', paymentTerm: 'monthly' },
    ],
  },
  C1019: { firstName: 'Anne-Marie', lastName: 'van der Veldhuizen-Kortenhoeven' },
  // A former customer: every policy ended before the data date.
  C1033: {
    policies: [
      { product: 'car', paymentTerm: 'monthly', startDate: '2017-03-01', endDate: '2026-06-30' },
      { product: 'liability', paymentTerm: 'yearly', startDate: '2017-03-01', endDate: '2026-06-30' },
    ],
  },
  // The coverage feed has no record for one running policy.
  C1042: {
    policies: [
      { product: 'car', paymentTerm: 'monthly' },
      { product: 'home_contents', paymentTerm: 'monthly', withoutCoverRecord: true },
    ],
  },
}

type Customer = { customerId: string; firstName: string; lastName: string }

type Policy = Customer & {
  policyNumber: string
  product: Product
  startDate: string
  endDate: string
  paymentTerm: PaymentTerm
  premium: string
}

type CoverRecord = {
  policyNumber: string
  cover: string
  deductible: number
  addOns: string[]
}

const COLUMNS: (keyof Policy)[] = [
  'policyNumber',
  'customerId',
  'firstName',
  'lastName',
  'product',
  'startDate',
  'endDate',
  'paymentTerm',
  'premium',
]

const isoDate = (date: Date) => date.toISOString().slice(0, 10)
let nextPolicyNumber = FIRST_POLICY_NUMBER

function randomPins(): PolicyPin[] {
  const count = faker.helpers.weightedArrayElement([
    { value: 1, weight: 4 },
    { value: 2, weight: 7 },
    { value: 3, weight: 6 },
    { value: 4, weight: 3 },
  ])
  const products = new Set<Product>()
  while (products.size < count) {
    products.add(
      faker.helpers.weightedArrayElement(
        Object.entries(PRODUCTS).map(([product, { weight }]) => ({ weight, value: product as Product })),
      ),
    )
  }
  return [...products].map((product) => ({ product }))
}

function pickCover(product: Product, pinned?: string): [string, number] {
  const { covers } = PRODUCTS[product]
  if (!pinned) return faker.helpers.arrayElement(covers)
  const match = covers.find(([cover]) => cover === pinned)
  if (!match) throw new Error(`Unknown ${product} cover: ${pinned}`)
  return match
}

function generatePolicy(customer: Customer, pin: PolicyPin): { policy: Policy; coverRecord?: CoverRecord } {
  const config = PRODUCTS[pin.product]
  const [cover, priceFactor] = pickCover(pin.product, pin.cover)
  const paymentTerm = pin.paymentTerm ?? faker.helpers.weightedArrayElement(PAYMENT_TERMS)
  const [min, max] = config.monthlyPremium
  const monthlyCents = Math.round(faker.number.float({ min, max, fractionDigits: 2 }) * priceFactor * 100)
  const discount = paymentTerm === 'yearly' ? 1 - YEARLY_DISCOUNT : 1
  const termCents = Math.round(monthlyCents * TERM_MONTHS[paymentTerm] * discount)
  const policyNumber = `P${nextPolicyNumber++}`

  const policy: Policy = {
    policyNumber,
    ...customer,
    product: pin.product,
    startDate: pin.startDate ?? isoDate(faker.date.between({ from: '2012-01-01', to: '2026-08-31' })),
    endDate: pin.endDate ?? '',
    paymentTerm,
    premium: (termCents / 100).toFixed(2),
  }
  const coverRecord: CoverRecord = {
    policyNumber,
    cover,
    deductible: pin.deductible ?? faker.helpers.arrayElement(config.deductibles),
    addOns: pin.addOns ?? faker.helpers.arrayElements(config.addOns, { min: 0, max: Math.min(2, config.addOns.length) }),
  }
  return { policy, coverRecord: pin.withoutCoverRecord ? undefined : coverRecord }
}

function generateCustomer(index: number) {
  const customerId = `C${1001 + index}`
  const override = OVERRIDES[customerId] ?? {}
  const customer: Customer = {
    customerId,
    firstName: override.firstName ?? names.person.firstName(),
    lastName: override.lastName ?? names.person.lastName(),
  }
  return (override.policies ?? randomPins()).map((pin) => generatePolicy(customer, pin))
}

function toCsv(policies: Policy[]): string {
  const cell = (value: string | number) => {
    const text = String(value)
    if (/[",\r\n]/.test(text)) throw new Error(`Value needs CSV quoting, which this export does not use: ${text}`)
    return text
  }
  const lines = policies.map((policy) => COLUMNS.map((column) => cell(policy[column])).join(','))
  return [COLUMNS.join(','), ...lines].join('\n') + '\n'
}

const generated = Array.from({ length: CUSTOMER_COUNT }, (_, index) => generateCustomer(index)).flat()
const policies = generated.map(({ policy }) => policy)
const coverRecords = generated.flatMap(({ coverRecord }) => (coverRecord ? [coverRecord] : []))

const dataDir = new URL('../data/', import.meta.url)
mkdirSync(dataDir, { recursive: true })
writeFileSync(new URL('policy-admin-export.csv', dataDir), toCsv(policies))
writeFileSync(new URL('coverage-feed.json', dataDir), JSON.stringify(coverRecords, null, 2) + '\n')

console.log(
  `Wrote ${policies.length} policies for ${CUSTOMER_COUNT} customers and ${coverRecords.length} cover records to data/`,
)
