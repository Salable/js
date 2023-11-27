type ProductFeature = {
  name: string
  displayName: string
  description: string
  visibility: string
  /** Whether the feature should be showcased in the pricing table or not. */
  isPublic: boolean
  valueType: 'enum' | 'boolean' | 'numeric'
  defaultValue: string
}

type PlanCurrency = {
  shortName: string
  longName: string
  symbol: string
  price: number
}

type ProductPlan = {
  name: string
  displayName: string
  description: string
  type: 'Standard' | 'Bespoke' | 'Coming soon'
  trialDays: number
  licenseType:
    | 'licensed'
    | 'user'
    | 'board'
    | 'perSeat'
    | 'metered'
    | 'customId'
  perSeatAmount: number
  interval: 'month' | 'year'
  length: number
  currencies: PlanCurrency[]
  features: ProductFeature[]
}

type ProductData = {
  name: string
  displayName: string
  description: string
  hasPaidPlans: boolean
  status: 'ACTIVE' | 'DEPRECATED'
  isTest: boolean
  plans: ProductPlan[]
}

type GetProductParams = {
  apiKey: string
  productUuid: string
  withDeprecated?: boolean
}

async function getProduct({
  apiKey,
  productUuid,
  withDeprecated = false,
}: GetProductParams): Promise<ProductData> {
  const response = await fetch(
    `https://api.salable.app/products/${productUuid}/pricingtable?globalSuccessUrl='https://example.com/'&globalCancelUrl='https://example.com/'&globalGranteeId=''&member=''`,
    {
      headers: {
        'x-api-key': apiKey,
      },
    },
  )

  if (response.status !== 200)
    throw new Error('Failed to fetch product information')

  const data = await response.json()

  const isDeprecated = (item) => withDeprecated || item.status === 'ACTIVE'

  const transformedData: ProductData = {
    name: data.name,
    displayName: data.displayName,
    description: data.description,
    status: data.status,
    hasPaidPlans: data.plans.some((plan) => plan.pricingType === 'paid'),
    isTest: data.isTest,
    plans: data.plans.filter(isDeprecated).map((plan) => ({
      name: plan.name,
      displayName: plan.displayName,
      description: plan.description,
      type: plan.planType,
      trialDays: plan.trialDays,
      licenseType: plan.licenseType,
      perSeatAmount: plan.perSeatAmount,
      interval: plan.interval,
      length: plan.length,
      currencies: plan.currencies.map((currency) => ({
        price: currency.price,
        shortName: currency.currency.shortName,
        longName: currency.currency.longName,
        symbol: currency.currency.symbol,
      })),
      features: plan.features
        .filter(({ feature }) => isDeprecated(feature))
        .map((feature) => ({
          name: feature.feature.name,
          displayName: feature.feature.displayName,
          description: feature.feature.description,
          isPublic: feature.feature.visibility === 'public',
          valueType: feature.feature.valueType,
          defaultValue: feature.feature.defaultValue,
        })),
    })),
  }

  return transformedData
}

export { getProduct }
