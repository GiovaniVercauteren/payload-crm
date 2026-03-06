'use client'

import { createInvoiceAction } from '../actions'
import InvoiceForm from '../_components/invoice-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/app/(frontend)/_providers/auth/auth.provider'

export default function CreateInvoicePage() {
  const tInvoicesCreate = useTranslations('invoices.create')
  const tMessages = useTranslations('invoices.messages')
  const router = useRouter()
  const auth = useAuth()

  const handleSubmit = async (values: any) => {
    try {
      if (!auth.user) {
        toast.error('You must be logged in to create an invoice')
        return
      }
      await createInvoiceAction({
        ...values,
        user: auth.user.id,
      })
      toast.success(tMessages('createSuccess'))
      router.push('/invoices')
    } catch (error) {
      toast.error(tMessages('createError'))
    }
  }

  return (
    <div>
      <InvoiceForm
        onSubmit={handleSubmit}
        title={tInvoicesCreate('createInvoice')}
        submitText={tInvoicesCreate('createInvoice')}
      />
    </div>
  )
}
