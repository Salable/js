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
  /**
   * A list of combined capabilities that the user has access to based on their
   * active licenses. This array contains both active and in-active
   * capabilities.
   */
  capabilities: string[]
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
    `https://api.salable.app/licenses/check?productUuid=${productUuid}&granteeIds=${granteeId}`,
    {
      headers: {
        'x-api-key': apiKey,
      },
    },
  )

  if (!response.status.toString().startsWith('2'))
    throw new Error('Could not fetch user licenses...')

  let capabilities: string[] = []
  try {
    capabilities = (await response.json()).capabilities
  } catch (error) {}

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
    const activeCapabilities = capabilities.map((capability) =>
      capability.toLowerCase(),
    )

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

  return {
    capabilities,
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
