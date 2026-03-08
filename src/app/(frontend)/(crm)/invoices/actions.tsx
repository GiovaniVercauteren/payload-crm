'use server'

import { Invoice, Shift, Client } from '@/payload-types'
import { CreateData } from '../../types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { generatePDF } from '@/lib/pdf'

async function getCurrentPayloadUser() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    throw new Error('Unauthorized')
  }

  return { payload, user, requestHeaders }
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
    return JSON.parse(JSON.stringify(invoices))
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
    return JSON.parse(JSON.stringify(invoice))
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
      depth: 0,
    })
    return JSON.parse(JSON.stringify(newInvoice))
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
      depth: 0,
    })
    return JSON.parse(JSON.stringify(updatedInvoice))
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
    return JSON.parse(JSON.stringify(shifts.docs))
  } catch (error) {
    throw new Error(
      `Failed to fetch uninvoiced shifts: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function generateInvoicePDFAction(invoiceId: string | number) {
  const { requestHeaders } = await getCurrentPayloadUser()

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/invoice/${invoiceId}/html`, {
      headers: requestHeaders,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch HTML: ${response.statusText}`)
    }

    const html = await response.text()
    const pdfBuffer = await generatePDF(html)
    return pdfBuffer.toString('base64')
  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
