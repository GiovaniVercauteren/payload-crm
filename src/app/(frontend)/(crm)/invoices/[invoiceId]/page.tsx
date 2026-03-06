import { getInvoiceAction } from '../actions'
import InvoiceDetails from './invoice-details'
import { notFound } from 'next/navigation'

interface InvoicePageProps {
  params: Promise<{
    invoiceId: string
  }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { invoiceId } = await params
  const invoice = await getInvoiceAction(invoiceId)

  if (!invoice) {
    notFound()
  }

  return (
    <div>
      <InvoiceDetails invoice={invoice} />
    </div>
  )
}
