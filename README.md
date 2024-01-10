A set of functions to simplify building Salable applications in
JavaScript/Node.js.

## Installation

```sh
# npm
npm install @salable/js

# yarn
yarn add @salable/js

# pnpm
pnpm install @salable/js
```

## Functions

The library features exports for both ECMAScript Modules (ESM) and CommonJS
(CJS).

```js
import salableJs from '@salable/js'
// or
const salableJs = require('@salable/js')
```

For convenience, the functions documented are also added to the `window` object
on the web under the `salable` object. So, `getUser` can be accessed via
`window.salable.getUser`.

### `getUser({ apiKey: string, productUuid: string, granteeId?: string })`

Returns data based on the current user. This function is scoped to a user
(through the provided `granteeId`) and a product (through the provided
`productUuid`).

Also returns a `hasCapability` utility function that simplifies the checking of
the provided user's capabilities.

#### Example

```js
import { getUser } from '@salable/js'

const { hasCapability, licenses, capabilities, isTest } = await getUser({
  apiKey: 'your-api-key',
  productUuid: 'your-product-uuid',
  granteeId: 'your-users-grantee-id',
})

if (hasCapability('edit')) {
  console.log('You have the edit capability!')
}
```

### `withProduct({ apiKey: string, productUuid: string, withDeprecated?: boolean})`

Returns useful data about the current product. Can be used for many things
including the creation of custom pricing tables.

By default, plans and features that are marked as DEPRECATED will be excluded
from the response. If you would like these returned, you can pass in an optional
options object with { withDeprecated: true }.

#### Example

```js
import { getProduct } from '@salable/js'

const { name, plans } = await getProduct({ withDeprecated: true })
```

### `createScope({ apiKey: string, productUuid: string })`

Creates scoped versions of all other functions exposed by this package where the
`productUuid` and `apiKey` are already provided. This allows you to pass these
values in one time, rather than with each call if that's what you'd prefer.

This function isn't available on the `window.salable` object in the browser.

#### Example

```js
import { createScope } from '@salable/js'

const { getUser, getProduct } = createScope({
  apiKey: 'your-api-key',
  productUuid: 'your-product-uuid',
})

// This function now only takes the `granteeId`, the other values are already
// passed in by the `createScope` call.
const user = await getUser({ granteeId: 'the-users-grantee-id' })
```
