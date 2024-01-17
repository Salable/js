import { describe, it, beforeEach, expect } from 'vitest'
import 'vitest-fetch-mock'
import { getCheckoutLink } from 'lib/getCheckoutLink'

describe('getCheckoutLink', () => {
  beforeEach(() => {
    fetchMock.mockOnce(JSON.stringify({ checkoutUrl: 'https://stripe.com/' }))
  })
  it('works', async () => {
    const checkoutUrl = await getCheckoutLink({
      apiKey: 'live_36843f85d817753d68d1d441de7dacd8d3389589',
      planUuid: '3e111a90-e5c0-40d7-b93a-cb395e8ab467',
      cancelUrl: 'https://www.example.com',
      successUrl: 'https://www.example.com',
      granteeId: 'test-user-1',
      member: 'test-owner-1',
    })

    expect(checkoutUrl).toEqual('https://stripe.com/')
  })
})
