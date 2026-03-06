'use server'

import { Admin, Client, User } from '@/payload-types'
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

export async function getClientsAction() {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const clients = await payload.find({
      collection: 'clients',
      pagination: true,
      sort: '-createdAt',
      overrideAccess: false,
      user,
    })
    return clients
  } catch (error) {
    throw new Error(
      `Failed to fetch clients: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function getClientAction(clientId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const client = await payload.findByID({
      collection: 'clients',
      overrideAccess: false,
      user,
      id: clientId,
    })
    return client
  } catch (error) {
    throw new Error(
      `Failed to fetch client: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function createClientAction(data: CreateData<Client>) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const newClient = await payload.create({
      collection: 'clients',
      data,
      overrideAccess: false,
      user,
    })
    return newClient
  } catch (error) {
    throw new Error(
      `Failed to create client: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function updateClientAction(clientId: string | number, data: CreateData<Client>) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const updatedClient = await payload.update({
      collection: 'clients',
      id: clientId,
      data,
      overrideAccess: false,
      user,
    })
    return updatedClient
  } catch (error) {
    throw new Error(
      `Failed to update client: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function deleteClientAction(clientId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    await payload.delete({
      collection: 'clients',
      id: clientId,
      overrideAccess: false,
      user,
    })
  } catch (error) {
    throw new Error(
      `Failed to delete client: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
