import { getPayload } from 'payload'
import config from '@payload-config'
import { renderInvoiceHtml } from '@/lib/invoice-template'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { Client } from '@/payload-types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) return new Response('Unauthorized', { status: 401 })

  const invoice = await payload.findByID({
    collection: 'invoices',
    id,
    depth: 2,
    user,
    overrideAccess: false,
  })

  if (!invoice) return new Response('Not Found', { status: 404 })

  const tInvoices = await getTranslations('invoices')
  const tShifts = await getTranslations('shifts')
  const tAccount = await getTranslations('account')
  const tCommon = await getTranslations('common')

  const html = renderInvoiceHtml({
    invoice: invoice as any,
    user: user as any,
    client: invoice.client as Client,
    translations: {
      invoiceNumber: tInvoices('invoiceNumber'),
      date: tInvoices('date'),
      client: tInvoices('client'),
      shifts: tInvoices('shifts'),
      totalAmount: tInvoices('totalAmount'),
      service: tShifts('service'),
      price: tShifts('totalPrice'),
      from: tCommon('from'),
      to: tCommon('to'),
      bankDetails: tAccount('bankDetails'),
      iban: tAccount('bank.iban'),
      bic: tAccount('bank.bic'),
      companyRegistrationNumber: tAccount('companyRegistrationNumber'),
    },
  })

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
