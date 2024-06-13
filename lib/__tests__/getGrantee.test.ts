import { describe, it, expect, beforeEach } from 'vitest'
import 'vitest-fetch-mock'
import { getGrantee } from '../getGrantee'
import { mockResponseData } from './getUserData'

const baseGetUserValues = {
  productUuid: '3a88375a-5ea7-4e22-b7fe-b3c10f9367f3',
  apiKey: 'my-api-key',
}

describe('getGrantee', () => {
  describe.only('without license data', () => {
    beforeEach(() => {
      fetchMock.mockOnce(null, { status: 204, statusText: 'No Content' })
    })

    it('works as intended', () => {
      getGrantee({ ...baseGetUserValues, granteeId: 'hi' })
    })
  })
  describe('with license data', () => {
    beforeEach(() => {
      fetchMock.mockOnce(JSON.stringify(mockResponseData))
    })
    it('returns scoped version if granteeId is omitted', () => {
      expect(getGrantee(baseGetUserValues)).toBeTypeOf('function')
    })

    it('returns the correct capabilities', async () => {
      const { capabilities } = await getGrantee({
        ...baseGetUserValues,
        granteeId: 'hi',
      })

      expect(capabilities).toMatchObject([{ name: 'create', status: 'ACTIVE' }])
    })

    it('excludes capabilities on canceled licenses from list', async () => {
      const { capabilities } = await getGrantee({
        ...baseGetUserValues,
        granteeId: 'test-user-1',
      })

      expect(capabilities).not.toMatchObject([{ name: 'notify' }])
    })

    it('filters out products that do not match the provided productUuid', async () => {
      const { licenses, capabilities } = await getGrantee({
        productUuid: 'test',
        apiKey: 'my-api-key',
        granteeId: 'hi',
      })

      expect(licenses.length).toBe(0)
      expect(capabilities.length).toBe(0)
    })

    describe('hasCapability', () => {
      it('correctly checks for individual capabilities', async () => {
        const { hasCapability } = await getGrantee({
          ...baseGetUserValues,
          granteeId: 'test-user-1',
        })

        expect(hasCapability('Edit')).toEqual(false)
        expect(hasCapability('Create')).toEqual(true)
      })

      it('treats capability names as case-insensitive', async () => {
        const { hasCapability } = await getGrantee({
          ...baseGetUserValues,
          granteeId: 'test-user-1',
        })

        expect(hasCapability('Create')).toEqual(true)
        expect(hasCapability('create')).toEqual(true)
        expect(hasCapability('CReaTE')).toEqual(true)
      })

      it('correctly checks multiple capabilities', async () => {
        const { hasCapability } = await getGrantee({
          ...baseGetUserValues,
          granteeId: 'test-user-1',
        })

        expect(hasCapability(['edit', 'create'])).toMatchObject({
          edit: false,
          create: true,
        })
      })

      it('returns false for capabilities on canceled licenses', async () => {
        const { hasCapability } = await getGrantee({
          ...baseGetUserValues,
          granteeId: 'test-user-1',
        })

        expect(hasCapability('notify')).toEqual(false)
      })
    })
  })
})
