import { getPayload } from 'payload'
import config from '@payload-config'
import { renderInvoiceHtml } from '@/lib/invoice-template'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { Client, Media } from '@/payload-types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  
  const { user: authUser } = await payload.auth({ headers: requestHeaders })
  if (!authUser) return new Response('Unauthorized', { status: 401 })

  // Fetch full user with logo populated
  const user = await payload.findByID({
    collection: 'users',
    id: authUser.id,
    depth: 2,
    user: authUser,
  })

  if (!user) return new Response('User Not Found', { status: 404 })

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

  const userAgent = requestHeaders.get('user-agent') || ''
  const isGotenberg = userAgent.toLowerCase().includes('gotenberg')
  const baseUrl = isGotenberg ? 'http://payload:3000' : ''
  
  let logoDataUrl = ''
  if (user.logo && typeof user.logo === 'object') {
    const logo = user.logo as Media
    if (logo.url) {
      try {
        const logoUrl = `http://localhost:3000${logo.url}`
        const resp = await fetch(logoUrl)
        if (resp.ok) {
          const buffer = await resp.arrayBuffer()
          const base64 = Buffer.from(buffer).toString('base64')
          logoDataUrl = `data:${logo.mimeType || 'image/png'};base64,${base64}`
        }
      } catch (e) {
        console.error('Failed to fetch logo for base64 encoding:', e)
      }
    }
  }

  const html = renderInvoiceHtml({
    invoice: invoice as any,
    user: user as any,
    client: invoice.client as Client,
    baseUrl,
    logoDataUrl,
    translations: {
      invoiceNumber: tInvoices('invoiceNumber'),
      date: tInvoices('date'),
      client: tInvoices('client'),
      shifts: tInvoices('shifts'),
      totalAmount: tInvoices('totalAmount'),
      service: tShifts('service'),
      price: tShifts('totalPrice'),
      time: tInvoices('time'),
      startTime: tInvoices('startTime'),
      endTime: tInvoices('endTime'),
      duration: tInvoices('duration'),
      hoursUnit: tCommon('hoursUnit'),
      break: tInvoices('break'),
      rate: tInvoices('rate'),
      from: tCommon('from'),
      to: tCommon('to'),
      bankDetails: tAccount('bankDetails'),
      iban: tAccount('bank.iban'),
      bic: tAccount('bank.bic'),
      companyRegistrationNumber: tAccount('companyRegistrationNumber'),
      vatExemption: tInvoices('vatExemption'),
      notesTitle: tInvoices('notes.title'),
      paymentTerms: tInvoices('notes.paymentTerms'),
      conditions: tInvoices('notes.conditions', { name: user.nickname || user.firstName }),
    },
  })

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
