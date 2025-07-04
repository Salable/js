# [5.0.0](https://github.com/Salable/js/compare/v4.1.0...v5.0.0) (2025-07-03)


### Documentation

* update README for v5.0.0 release ([84b0184](https://github.com/Salable/js/commit/84b018436b1a20a7547698aafc5368b7c98a8c05))


### Features

* pass owner rather than member into getCheckoutLink ([c0a0f1a](https://github.com/Salable/js/commit/c0a0f1a740a046d5cc2efb242abc08efa0d6820a))
* rename hasCapability to hasFeature ([784ced9](https://github.com/Salable/js/commit/784ced9411adf4277cf55a18666b7de69aefcdaa))


### BREAKING CHANGES

* hasCapability renamed to hasFeature. And
getCheckoutLink member param renamed to owner

# [4.1.0](https://github.com/Salable/js/compare/v4.0.0...v4.1.0) (2025-02-19)


### Bug Fixes

* added verifyLicenseCheck to index.ts ([147a927](https://github.com/Salable/js/commit/147a9270469a18595af4d4c726daae475c6e0916))


### Features

* **SD-1282:** added verifyLicenseCheck method ([6070325](https://github.com/Salable/js/commit/607032525ac6f3fcb0c46c0e3d38201fbd3433a5))
* updated license check verification method to use subtle crypto ([ac30837](https://github.com/Salable/js/commit/ac3083769fb4386d1fcd54c53a9e9253950f6cfc))

# [4.0.0](https://github.com/Salable/js/compare/v3.1.3...v4.0.0) (2024-07-25)


### Features

* use license check endpoint ([7e693b4](https://github.com/Salable/js/commit/7e693b4685670906cb18c1d976c023469f44cdce))


### BREAKING CHANGES

* Returned data shape has changed to no longer include
`isTest` or `licenses`.

## [3.1.3](https://github.com/Salable/js/compare/v3.1.2...v3.1.3) (2024-06-13)


### Bug Fixes

* getGrantee when no license data available ([3d73574](https://github.com/Salable/js/commit/3d735740e92e5b3b5f78840ca48bae1a229a387a))

## [3.1.2](https://github.com/Salable/js/compare/v3.1.1...v3.1.2) (2024-02-14)


### Bug Fixes

* filter undefined params -> getCheckoutLink ([8430bd9](https://github.com/Salable/js/commit/8430bd9357abe9b4195b7bace732d376c32dfe80))

## [3.1.1](https://github.com/Salable/js/compare/v3.1.0...v3.1.1) (2024-02-13)


### Bug Fixes

* only .toString() quantity if provided ([6378f71](https://github.com/Salable/js/commit/6378f718ceb6e03b1cbcbed12b7afd4c3bc37070))

# [3.1.0](https://github.com/Salable/js/compare/v3.0.0...v3.1.0) (2024-02-12)


### Features

* add optional fields to getCheckoutLink ([1a90851](https://github.com/Salable/js/commit/1a90851bdec5919e9e0b27304f255aebcdae9e49))

# [3.0.0](https://github.com/Salable/js/compare/v2.2.0...v3.0.0) (2024-02-12)


### Bug Fixes

* make scoped version of useGrantee take obj id ([dfecbc0](https://github.com/Salable/js/commit/dfecbc0af72b21b1071857ca478f8283139360cb))


### Code Refactoring

* move useUser to useGrantee ([0113a14](https://github.com/Salable/js/commit/0113a14ba440a1854c0dd5a75fb9015b77250416))


### Features

* add getCheckoutLink function ([6e5cba7](https://github.com/Salable/js/commit/6e5cba724689d345f5ef208c133214c0d4c1b99c))


### BREAKING CHANGES

* all useUser imports now need to be useGrantee

# [2.3.0](https://github.com/Salable/js/compare/v2.2.0...v2.3.0) (2024-01-17)


### Features

* add getCheckoutLink function ([3e53a06](https://github.com/Salable/js/commit/3e53a06961d0e51eebd295bf028a4dc3901d5e83))

# [2.2.0](https://github.com/Salable/js/compare/v2.1.0...v2.2.0) (2024-01-10)


### Features

* add module usage examples to README.md ([8ba0773](https://github.com/Salable/js/commit/8ba0773899e87f5a274f11a0ff19bea26bfb14c9))

# [2.1.0](https://github.com/Salable/js/compare/v2.0.0...v2.1.0) (2024-01-10)


### Features

* add CJS export ([17281a1](https://github.com/Salable/js/commit/17281a198a914b91e8fd6d6c4e058b9a3ada8dfa))

# [2.0.0](https://github.com/Salable/js/compare/v1.0.0...v2.0.0) (2024-01-09)


### Bug Fixes

* remove capabilities from canceled licenses ([5fb2c82](https://github.com/Salable/js/commit/5fb2c82093bd93f0a49cf9d1a0f67b1949555099))


### BREAKING CHANGES

* capabilities on canceled licenses are now ignored

# 1.0.0 (2023-11-27)


### Features

* add getUser, getProduct, and createScope fns ([af856be](https://github.com/Salable/js/commit/af856be034c651f2cede2ba452ced42c15a17e98))
