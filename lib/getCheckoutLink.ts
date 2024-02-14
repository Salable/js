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
  const rawSearchParams = {
    successUrl,
    cancelUrl,
    granteeId,
    member,
    customerEmail: checkoutEmail,
    quantity: quantity?.toString(),
    currency,
  }

  const searchParams = Object.entries(rawSearchParams).reduce(
    (acc, [key, value]) => {
      if (!value) return acc
      return { ...acc, [key]: value }
    },
    {},
  )

  const url =
    `https://api.salable.app/plans/${planUuid}/checkoutlink?` +
    new URLSearchParams(searchParams)

  console.log({ url })
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
