export type GetCheckoutLinkArgs = {
  apiKey: string
  planUuid: string
  successUrl: string
  cancelUrl: string
  granteeId: string
  owner: string
  checkoutEmail?: string
  quantity?: number
  currency?: 'EUR' | 'USD' | 'GBP'
}

export async function getCheckoutLink({
  apiKey,
  planUuid,
  successUrl,
  cancelUrl,
  granteeId,
  owner,
  checkoutEmail,
  quantity,
  currency,
}: GetCheckoutLinkArgs) {
  const searchParams = Object.entries({
    successUrl,
    cancelUrl,
    granteeId,
    owner,
    customerEmail: checkoutEmail,
    quantity: quantity?.toString(),
    currency,
  }).reduce((acc, [key, value]) => {
    if (!value) return acc
    return { ...acc, [key]: value }
  }, {})

  const url =
    `https://api.salable.app/plans/${planUuid}/checkoutlink?` +
    new URLSearchParams(searchParams)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  })

  const { checkoutUrl } = await response.json()

  return checkoutUrl
}
