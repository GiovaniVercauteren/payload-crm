'use client'

import { updateClientAction } from '../../actions'
import ClientForm from '../../_components/client-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Client } from '@/payload-types'
import { CreateData } from '@/app/(frontend)/types'
import { toast } from 'sonner'

interface EditClientFormProps {
  client: Client
}

export default function EditClientForm({ client }: EditClientFormProps) {
  const tClients = useTranslations('clients')
  const tMessages = useTranslations('clients.messages')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const handleSubmit = async (values: CreateData<Client>) => {
    try {
      await updateClientAction(client.id, values)
      toast.success(tMessages('updateSuccess'))
      router.push(`/clients/${client.id}`)
    } catch (error) {
      toast.error(tMessages('updateError'))
    }
  }

  // Pre-process initial values to match CreateData<Client>
  const initialValues: CreateData<Client> = {
    name: client.name,
    type: client.type,
    contactInfo: {
      email: client.contactInfo?.email || '',
      phone: client.contactInfo?.phone || '',
    },
    address: {
      street: client.address.street,
      city: client.address.city,
      postalCode: client.address.postalCode,
      country: client.address.country,
    },
    notes: client.notes || '',
    defaultRate: client.defaultRate || undefined,
  }

  return (
    <div>
      <ClientForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        title={tClients('editClient')}
        submitText={tCommon('save')}
      />
    </div>
  )
}
