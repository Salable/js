import { describe, it, beforeEach, expect } from 'vitest'
import 'vitest-fetch-mock'
import { mockResponseData } from './getProductData'
import { getProduct } from '../getProduct'

describe('getProduct', () => {
  beforeEach(() => {
    fetchMock.mockOnce(JSON.stringify(mockResponseData))
  })

  it('returns correctly transformed data', async () => {
    const data = await getProduct({ apiKey: 'test', productUuid: 'test' })

    expect(data).toMatchObject({
      name: 'Delete Card Power Up 2',
      status: 'ACTIVE',
      plans: [
        {
          name: 'Pro',
          currencies: [{ price: 1000 }],
          features: [{ name: 'test' }],
        },
      ],
    })
  })

  it('excludes deprecated resources by default', async () => {
    const data = await getProduct({ apiKey: 'test', productUuid: 'test' })

    expect(data).not.toMatchObject({
      plans: [
        {
          features: [{ name: 'deprecated test' }],
        },
      ],
    })
  })

  it('includes deprecated resources if requested', async () => {
    const data = await getProduct({
      apiKey: 'test',
      productUuid: 'test',
      withDeprecated: true,
    })

    expect(data).toMatchObject({
      plans: [
        {
          features: [
            {
              name: 'test',
            },
            {
              name: 'deprecated test',
            },
          ],
        },
      ],
    })
  })
})
