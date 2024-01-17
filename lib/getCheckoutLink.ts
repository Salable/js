export type GetCheckoutLinkArgs = {
  apiKey: string
  planUuid: string
  successUrl: string
  cancelUrl: string
  granteeId: string
  member: string
}

export async function getCheckoutLink({
  apiKey,
  planUuid,
  successUrl,
  cancelUrl,
  granteeId,
  member,
}: GetCheckoutLinkArgs) {
  const url =
    `https://api.salable.app/plans/${planUuid}/checkoutlink?` +
    new URLSearchParams({
      successUrl,
      cancelUrl,
      granteeId,
      member,
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
