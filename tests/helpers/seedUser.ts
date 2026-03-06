import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
  firstName: 'Test',
  lastName: 'User',
  company: 'Test Company',
  phone: '0123456789',
  companyRegistrationNumber: 'BE0123456789',
  address: {
    streetAndNumber: 'Test Street 1',
    city: 'Test City',
    postalCode: '1000',
  },
  bankDetails: {
    name: 'Test Bank',
    iban: 'BE00000000000000',
    bic: 'TESTBEBB',
  },
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  // Create fresh test user
  await payload.create({
    collection: 'users',
    data: testUser,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
