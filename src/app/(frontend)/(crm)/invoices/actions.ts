'use server'

import { Invoice, Shift } from '@/payload-types'
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

export async function getInvoicesAction() {
  const { payload, user } = await getCurrentPayloadUser()

  try {
    const invoices = await payload.find({
      collection: 'invoices',
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
    return invoices
  } catch (error) {
    throw new Error(
      `Failed to fetch invoices: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function getInvoiceAction(invoiceId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const invoice = await payload.findByID({
      collection: 'invoices',
      id: invoiceId,
      overrideAccess: false,
      user,
    })
    return invoice
  } catch (error) {
    throw new Error(
      `Failed to fetch invoice: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function createInvoiceAction(data: CreateData<Invoice>) {
  const { payload, user } = await getCurrentPayloadUser()

  try {
    const newInvoice = await payload.create({
      collection: 'invoices',
      data: {
        ...data,
        user: user.id,
      } as any,
      overrideAccess: false,
      user,
    })
    return newInvoice
  } catch (error) {
    throw new Error(
      `Failed to create invoice: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function updateInvoiceAction(invoiceId: string | number, data: CreateData<Invoice>) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const updatedInvoice = await payload.update({
      collection: 'invoices',
      id: invoiceId,
      data,
      overrideAccess: false,
      user,
    })
    return updatedInvoice
  } catch (error) {
    throw new Error(
      `Failed to update invoice: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function deleteInvoiceAction(invoiceId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    await payload.delete({
      collection: 'invoices',
      id: invoiceId,
      overrideAccess: false,
      user,
    })
  } catch (error) {
    throw new Error(
      `Failed to delete invoice: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function getUninvoicedShiftsAction(clientId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()

  try {
    const shifts = await payload.find({
      collection: 'shifts',
      where: {
        and: [
          {
            client: {
              equals: clientId,
            },
          },
          {
            invoice: {
              equals: null,
            },
          },
          {
            worker: {
              equals: user.id,
            },
          },
        ],
      },
      pagination: false,
      overrideAccess: false,
      user,
    })
    return shifts.docs
  } catch (error) {
    throw new Error(
      `Failed to fetch uninvoiced shifts: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
