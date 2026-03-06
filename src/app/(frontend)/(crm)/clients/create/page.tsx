'use client'

import { createClientAction } from '../actions'
import ClientForm from '../_components/client-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CreateData } from '@/app/(frontend)/types'
import { Client } from '@/payload-types'
import { useAuth } from '@/app/(frontend)/_providers/auth/auth.provider'

export default function CreateClientPage() {
  const tClientsCreate = useTranslations('clients.create')
  const tMessages = useTranslations('clients.messages')
  const router = useRouter()
  const auth = useAuth()

  const handleSubmit = async (values: CreateData<Client>) => {
    try {
      await createClientAction(values, auth.user!)
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
