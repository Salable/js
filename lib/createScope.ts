import { getUser } from './getUser.js'
import { getProduct } from './getProduct.js'

type CreateScopeArgs = {
  apiKey: string
  productUuid: string
}

function createScope({ apiKey, productUuid }: CreateScopeArgs) {
  return {
    getUser: getUser({ apiKey, productUuid }),
    getProduct: ({ withDeprecated }: { withDeprecated: boolean }) =>
      getProduct({ apiKey, productUuid, withDeprecated }),
  }
}

export { createScope }
