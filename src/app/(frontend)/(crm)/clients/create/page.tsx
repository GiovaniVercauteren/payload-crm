'use client'

import { createClientAction } from '../actions'
import ClientForm from '../_components/client-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CreateClientPage() {
  const tClientsCreate = useTranslations('clients.create')
  const tMessages = useTranslations('clients.messages')
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    try {
      await createClientAction(values)
      toast.success(tMessages('createSuccess'))
      router.push('/clients')
    } catch (error) {
      toast.error(tMessages('createError'))
    }
  }

  return (
    <div>
      <ClientForm
        onSubmit={handleSubmit}
        title={tClientsCreate('createClient')}
        submitText={tClientsCreate('createClient')}
      />
    </div>
  )
}
