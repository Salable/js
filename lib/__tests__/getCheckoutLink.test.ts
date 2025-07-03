import { describe, it, beforeEach, expect } from 'vitest'
import 'vitest-fetch-mock'
import { getCheckoutLink } from 'lib/getCheckoutLink'

describe('getCheckoutLink', () => {
  beforeEach(() => {
    fetchMock.mockOnce(JSON.stringify({ checkoutUrl: 'https://stripe.com/' }))
  })
  it('works', async () => {
    const checkoutUrl = await getCheckoutLink({
      apiKey: 'a-salable-api-key',
      planUuid: 'a-plan-uuid',
      cancelUrl: 'https://www.example.com',
      successUrl: 'https://www.example.com',
      granteeId: 'test-user-1',
      owner: 'test-owner-1',
    })

    expect(checkoutUrl).toEqual('https://stripe.com/')
  })
})
