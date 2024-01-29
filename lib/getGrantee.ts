type UserLicense = {
  uuid: string
  subscriptionUuid: string
  planUuid: string
  purchaser: string
  granteeId: string
  email: string
  name: string
  startTime: Date
  endTime: Date
  updatedAt: Date
  status:
    | 'ACTIVE'
    | 'CANCELED'
    | 'EVALUATION'
    | 'SCHEDULED'
    | 'TRIALING'
    | 'INACTIVE'
}

type GetGranteeParams = {
  apiKey: string
  productUuid: string
  granteeId: string
}

type HasCapability = {
  (capability: string): boolean
  <T extends string>(capabilities: readonly T[]): { [Key in T]: boolean }
}

export type UserData = {
  isTest: boolean
  licenses: UserLicense[]
  /**
   * A list of combined capabilities that the user has access to based on their
   * active licenses. This array contains both active and in-active
   * capabilities.
   */
  capabilities: { name: string; status: 'ACTIVE' | 'DEPRECATED' }[]
  /**
   * Used to check whether a user has either an active capability, or a list of
   * supplied capabilities. Capability names are case insensitive.
   *
   * All inactive capabilities will return false. This includes capabilities
   * that are on 'canceled' licenses. If you want to check for a capability
   * that isn't active, or is on a canceled license, use the `capabilities`
   * array returned by this hook.
   *
   * To check a single capability:
   * ```
   * const hasCreate = hasCapability('create');
   * ```
   *
   * To check a list of capabilities:
   * ```
   * const { create, update } = hasCapability(['create', 'update']);
   * ```
   */
  hasCapability: HasCapability
}

async function _getGrantee({
  apiKey,
  productUuid,
  granteeId,
}: GetGranteeParams): Promise<UserData> {
  const response = await fetch(
    `https://api.salable.app/licenses/granteeId/${granteeId}`,
    {
      headers: {
        'x-api-key': apiKey,
      },
    },
  )

  if (response.status !== 200)
    throw new Error('Could not fetch user licenses...')

  const allLicenses = await response.json()

  const licenses = allLicenses.filter(
    (license) => license.productUuid === productUuid,
  )

  const capabilities = licenses
    .filter((license) => license.status === 'ACTIVE')
    .flatMap(
      (license) =>
        license.capabilities.flatMap((capability) => ({
          name: capability.name,
          status: capability.status,
        })) ?? [],
    )

  // Overload for checking an individual capability.
  function hasCapability(capability: string): boolean
  // Overload for checking a list of capabilities and receiving an object with
  // those capabilities as keys.
  function hasCapability<T extends string>(
    capabilities: readonly T[],
  ): { [Key in T]: boolean }

  // Implementation of the hasCapability function based on the above overloads.
  function hasCapability<T extends string>(
    capabilityOrCapabilities: string | readonly string[],
  ): boolean | { [Key in T]: boolean } {
    const activeCapabilities = capabilities
      .filter(({ status }) => status === 'ACTIVE')
      .map(({ name }) => name.toLowerCase())

    if (typeof capabilityOrCapabilities === 'string') {
      return activeCapabilities.includes(capabilityOrCapabilities.toLowerCase())
    }

    return capabilityOrCapabilities.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: activeCapabilities.includes(curr.toLowerCase()),
      }
    }, {}) as { [Key in T]: boolean }
  }

  const transformedLicenses: UserLicense[] = licenses.map((license) => ({
    email: license.email as string,
    name: license.name as string,
    purchaser: license.purchaser as string,
    granteeId: license.granteeId as string,
    uuid: license.uuid as string,
    planUuid: license.planUuid as string,
    subscriptionUuid: license.subscriptionUuid as string,
    status: license.status as UserLicense['status'],
    startTime: new Date(license.startTime as string),
    endTime: new Date(license.endTime as string),
    updatedAt: new Date(license.updatedAt as string),
  }))

  return {
    capabilities,
    isTest: licenses.some((license) => license.isTest),
    licenses: transformedLicenses,
    hasCapability,
  }
}

type ScopedReturnFn = ({
  granteeId,
}: {
  granteeId: string
}) => Promise<UserData>

function getGrantee(params: Omit<GetGranteeParams, 'granteeId'>): ScopedReturnFn

function getGrantee(params: GetGranteeParams): Promise<UserData>

function getGrantee({
  apiKey,
  productUuid,
  granteeId,
}: Omit<GetGranteeParams, 'granteeId'> & {
  granteeId?: string
}): ScopedReturnFn | Promise<UserData> {
  if (typeof granteeId === 'undefined') {
    return ({ granteeId }) => _getGrantee({ apiKey, productUuid, granteeId })
  }

  return _getGrantee({ apiKey, productUuid, granteeId })
}

export { getGrantee }
