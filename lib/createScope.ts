import { getUser } from './getUser.js'
import { getProduct } from './getProduct.js'
import { GetCheckoutLinkArgs, getCheckoutLink } from './getCheckoutLink.js'

type CreateScopeArgs = {
  apiKey: string
  productUuid: string
}

function createScope({ apiKey, productUuid }: CreateScopeArgs) {
  return {
    getUser: getUser({ apiKey, productUuid }),
    getProduct: ({ withDeprecated }: { withDeprecated: boolean }) =>
      getProduct({ apiKey, productUuid, withDeprecated }),
    getCheckoutLink: (params: Omit<GetCheckoutLinkArgs, 'apiKey'>) =>
      getCheckoutLink({ apiKey, ...params }),
  }
}

export { createScope }
