'use server'

import { Service } from '@/payload-types'
import { CreateData } from '../../types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

async function getCurrentPayloadUser() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    throw new Error('Unauthorized')
  }

  return { payload, user }
}

export async function getServicesAction() {
  const { payload, user } = await getCurrentPayloadUser()

  try {
    const services = await payload.find({
      collection: 'services',
      where: {
        user: {
          equals: user.id,
        },
      },
      pagination: true,
      sort: '-createdAt',
      overrideAccess: false,
      user,
    })
    return services
  } catch (error) {
    throw new Error(
      `Failed to fetch services: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function getServiceAction(serviceId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const service = await payload.findByID({
      collection: 'services',
      id: serviceId,
      overrideAccess: false,
      user,
    })
    return service
  } catch (error) {
    throw new Error(
      `Failed to fetch service: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function createServiceAction(data: CreateData<Service>) {
  const { payload, user } = await getCurrentPayloadUser()

  try {
    const newService = await payload.create({
      collection: 'services',
      data: {
        ...data,
        user: user.id,
      },
      overrideAccess: false,
      user,
    })
    return newService
  } catch (error) {
    throw new Error(
      `Failed to create service: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function updateServiceAction(serviceId: string | number, data: CreateData<Service>) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const updatedService = await payload.update({
      collection: 'services',
      id: serviceId,
      data,
      overrideAccess: false,
      user,
    })
    return updatedService
  } catch (error) {
    throw new Error(
      `Failed to update service: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function deleteServiceAction(serviceId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    await payload.delete({
      collection: 'services',
      id: serviceId,
      overrideAccess: false,
      user,
    })
  } catch (error) {
    throw new Error(
      `Failed to delete service: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
