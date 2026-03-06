'use client'

import { createServiceAction } from '../actions'
import ServiceForm from '../_components/service-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/app/(frontend)/_providers/auth/auth.provider'

export default function CreateServicePage() {
  const tServicesCreate = useTranslations('services.create')
  const tMessages = useTranslations('services.messages')
  const router = useRouter()
  const auth = useAuth()

  const handleSubmit = async (values: any) => {
    try {
      if (!auth.user) {
        toast.error('You must be logged in to create a service')
        return
      }
      await createServiceAction({
        ...values,
        user: auth.user.id,
      })
      toast.success(tMessages('createSuccess'))
      router.push('/services')
    } catch (error) {
      toast.error(tMessages('createError'))
    }
  }

  return (
    <div>
      <ServiceForm
        onSubmit={handleSubmit}
        title={tServicesCreate('createService')}
        submitText={tServicesCreate('createService')}
      />
    </div>
  )
}
