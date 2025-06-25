type GetGranteeParams = {
  apiKey: string
  productUuid: string
  granteeId: string
}

type HasFeature = {
  (feature: string): boolean
  <T extends string>(features: readonly T[]): { [Key in T]: boolean }
}

export type UserData = {
  /**
   * A list of features that the grantee has access to based on their
   * active subscriptions.
   */
  features: string[]
  /**
   * Used to check whether a grantee has an active feature or number of
   * features. Feature names are case insensitive.
   *
   * To check a single feature:
   * ```
   * const hasCreate = hasFeature('create');
   * ```
   *
   * To check a list of features:
   * ```
   * const { create, update } = hasFeature(['create', 'update']);
   * ```
   */
  hasFeature: HasFeature
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

  let features: string[] = []
  try {
    features = (await response.json()).capabilities
  } catch (error) {}

  // Overload for checking an individual capability.
  function hasFeature(feature: string): boolean
  // Overload for checking a list of capabilities and receiving an object with
  // those capabilities as keys.
  function hasFeature<T extends string>(
    features: readonly T[],
  ): { [Key in T]: boolean }

  // Implementation of the hasCapability function based on the above overloads.
  function hasFeature<T extends string>(
    featureOrFeatures: string | readonly string[],
  ): boolean | { [Key in T]: boolean } {
    const lowerCasedFeatures = features.map((f) => f.toLowerCase())

    if (typeof featureOrFeatures === 'string') {
      return lowerCasedFeatures.includes(featureOrFeatures.toLowerCase())
    }

    return featureOrFeatures.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: lowerCasedFeatures.includes(curr.toLowerCase()),
      }
    }, {}) as { [Key in T]: boolean }
  }

  return {
    features,
    hasFeature,
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
