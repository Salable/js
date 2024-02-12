import { createScope } from './createScope.js'
import { getGrantee } from './getGrantee.js'
import { getProduct } from './getProduct.js'
import { getCheckoutLink } from './getCheckoutLink.js'

declare global {
  interface Window {
    salable: {
      getGrantee: typeof getGrantee
      getProduct: typeof getProduct
      getCheckoutLink: typeof getCheckoutLink
    }
  }
}

/**
 * Adds functions exported from this package to the window under the
 * `window.salable` object.
 *
 * This is a good option for users who aren't using ESM and would rather access
 * the functions through a global.
 */
function addToWindow() {
  if (typeof window === 'undefined') return

  window.salable = {
    getGrantee,
    getProduct,
    getCheckoutLink,
  }
}

addToWindow()

export { createScope, getGrantee, getProduct, getCheckoutLink }
