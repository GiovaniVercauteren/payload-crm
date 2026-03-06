'use server'

import { Client } from '@/payload-types'
import { CreateData } from '../../types'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getClientsAction() {
  const payload = await getPayload({ config })
  try {
    const clients = await payload.find({
      collection: 'clients',
      pagination: true,
      sort: '-createdAt',
    })
    return clients
  } catch (error) {
    throw new Error(
      `Failed to fetch clients: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function getClientAction(clientId: string | number) {
  const payload = await getPayload({ config })
  try {
    const client = await payload.findByID({
      collection: 'clients',
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
  const payload = await getPayload({ config })
  try {
    const newClient = await payload.create({
      collection: 'clients',
      data,
    })
    return newClient
  } catch (error) {
    throw new Error(
      `Failed to create client: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function updateClientAction(clientId: string | number, data: CreateData<Client>) {
  const payload = await getPayload({ config })
  try {
    const updatedClient = await payload.update({
      collection: 'clients',
      id: clientId,
      data,
    })
    return updatedClient
  } catch (error) {
    throw new Error(
      `Failed to update client: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function deleteClientAction(clientId: string | number) {
  const payload = await getPayload({ config })
  try {
    await payload.delete({
      collection: 'clients',
      id: clientId,
    })
  } catch (error) {
    throw new Error(
      `Failed to delete client: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
