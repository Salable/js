import { describe, it, expect, beforeEach } from 'vitest'
import 'vitest-fetch-mock'
import { getGrantee } from '../getGrantee'
import { mockResponseData } from './getUserData'

const baseGetUserValues = {
  productUuid: '3a88375a-5ea7-4e22-b7fe-b3c10f9367f3',
  apiKey: 'my-api-key',
}

describe('getGrantee', () => {
  describe('without subscription data', () => {
    beforeEach(() => {
      fetchMock.mockOnce(null, { status: 204, statusText: 'No Content' })
    })

    it('works as intended', () => {
      getGrantee({ ...baseGetUserValues, granteeId: 'hi' })
    })
  })

  describe('with subscription data', () => {
    beforeEach(() => {
      fetchMock.mockOnce(JSON.stringify(mockResponseData))
    })

    it('returns scoped version if granteeId is omitted', () => {
      expect(getGrantee(baseGetUserValues)).toBeTypeOf('function')
    })

    it('returns the correct features', async () => {
      const { features } = await getGrantee({
        ...baseGetUserValues,
        granteeId: 'hi',
      })

      expect(features).toMatchObject(['create', 'read', 'update', 'delete'])
      expect(features).toHaveLength(4)
    })

    describe('hasFeature', () => {
      it('correctly checks for individual features', async () => {
        const { hasFeature } = await getGrantee({
          ...baseGetUserValues,
          granteeId: 'test-user-1',
        })

        expect(hasFeature('Edit')).toEqual(false)
        expect(hasFeature('Create')).toEqual(true)
      })

      it('treats feature names as case-insensitive', async () => {
        const { hasFeature } = await getGrantee({
          ...baseGetUserValues,
          granteeId: 'test-user-1',
        })

        expect(hasFeature('Create')).toEqual(true)
        expect(hasFeature('create')).toEqual(true)
        expect(hasFeature('CReaTE')).toEqual(true)
      })

      it('correctly checks multiple features', async () => {
        const { hasFeature } = await getGrantee({
          ...baseGetUserValues,
          granteeId: 'test-user-1',
        })

        expect(hasFeature(['edit', 'create'])).toMatchObject({
          edit: false,
          create: true,
        })
      })
    })
  })
})
