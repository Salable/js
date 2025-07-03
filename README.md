A set of functions to simplify building Salable applications on the client.

## Installation

```sh
# npm
npm install @salable/js

# pnpm
pnpm add @salable/js

# yarn
yarn add @salable/js
```

## Functions

The library exports both ECMAScript Modules (ESM) and CommonJS (CJS) builds.

```js
import salableJs from '@salable/js'
// or
const salableJs = require('@salable/js')
```

For convenience, the functions documented are also added to the browser's
`window` object as part of the `salable` object. So, `getGrantee` can be
accessed via `window.salable.getGrantee`.

### `getGrantee({ apiKey: string, productUuid: string, granteeId?: string })`

Returns the features the provided grantee has access to.

Also returns a `hasFeature` utility function that simplifies feature checking.

#### Example

```js
import { getGrantee } from '@salable/js'

const { features, hasFeature } = await getGrantee({
  apiKey: 'your-api-key',
  productUuid: 'your-product-uuid',
  granteeId: 'your-users-grantee-id',
})

if (hasFeature('edit')) {
  console.log('Grantee has access to the edit feature!')
}
```

### `getProduct({ apiKey: string, productUuid: string, withDeprecated?: boolean})`

Returns useful data about the current product. Can be used for many things
including the creation of custom pricing tables.

By default, plans and features that are marked as DEPRECATED will be excluded
from the response. If you would like these returned, you can pass in an optional
options object with { withDeprecated: true }.

#### Example

```js
import { getProduct } from '@salable/js'

const { name, plans } = await getProduct({
  apiKey: 'your-api-key',
  productUuid: 'your-product-uuid',
  withDeprecated: true,
})
```

### `getCheckoutLink({ apiKey: string, planUuid: string, successUrl: string, cancelUrl: string, granteeId: string, owner: string })`

Returns a checkout link for the specified `planUuid`.

#### Example

```js
import { getCheckoutLink } from '@salable/js'

const checkoutLink = await getCheckoutLink({
  planUuid: 'your-plan-uuid',
  apiKey: 'your-api-key',
  successUrl: 'https://your.apps/success',
  cancelUrl: 'https://your.apps/cancel',
  granteeId: 'your-users-id',
  owner: 'your-users-id',
  checkoutEmail: '', // optional, pre-fills email field in Stripe checkout
  quantity: 5, // optional, the number of seats purchased on checkout (if using per-seat plan, default is minimum number set on plan)
  currency: 'EUR', // optional, defaults to the product's default currency in Salable
})
```

### `createScope({ apiKey: string, productUuid: string })`

Creates scoped versions of all other functions exposed by this package where the
`productUuid` and `apiKey` are already provided. This allows you to pass these
values in one time, rather than with each call if that's what you'd prefer.

This function isn't available on the `window.salable` object in the browser.

#### Example

```js
import { createScope } from '@salable/js'

const { getGrantee, getProduct } = createScope({
  apiKey: 'your-api-key',
  productUuid: 'your-product-uuid',
})

// This function now only takes the `granteeId`, the other values are already
// passed in by the `createScope` call.
const grantee = await getGrantee({ granteeId: 'the-users-grantee-id' })
```
