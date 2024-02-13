export type GetCheckoutLinkArgs = {
  apiKey: string
  planUuid: string
  successUrl: string
  cancelUrl: string
  granteeId: string
  member: string
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
  member,
  checkoutEmail,
  quantity,
  currency,
}: GetCheckoutLinkArgs) {
  const url =
    `https://api.salable.app/plans/${planUuid}/checkoutlink?` +
    new URLSearchParams({
      successUrl,
      cancelUrl,
      granteeId,
      member,
      customerEmail: checkoutEmail,
      quantity: quantity?.toString(),
      currency,
    })
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
