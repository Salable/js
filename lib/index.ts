import { createScope } from './createScope.js'
import { getUser } from './getUser.js'
import { getProduct } from './getProduct.js'

declare global {
  interface Window {
    salable: {
      getUser: typeof getUser
      getProduct: typeof getProduct
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
    getUser,
    getProduct,
  }
}

addToWindow()

export { createScope, getUser, getProduct }
