'use client'

import { updateServiceAction } from '../../actions'
import ServiceForm from '../../_components/service-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Service } from '@/payload-types'
import { CreateData } from '@/app/(frontend)/types'
import { toast } from 'sonner'

interface EditServiceFormProps {
  service: Service
}

export default function EditServiceForm({ service }: EditServiceFormProps) {
  const tServices = useTranslations('services')
  const tMessages = useTranslations('services.messages')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const handleSubmit = async (values: CreateData<Service>) => {
    try {
      await updateServiceAction(service.id.toString(), values)
      toast.success(tMessages('updateSuccess'))
      router.push(`/services/${service.id}`)
    } catch (error) {
      toast.error(tMessages('updateError'))
    }
  }

  const initialValues: CreateData<Service> = {
    name: service.name,
    rateType: service.rateType,
    rate: service.rate,
    description: service.description || '',
    deprecated: service.deprecated || false,
    user: typeof service.user === 'object' ? service.user.id : service.user,
  }

  return (
    <div>
      <ServiceForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        title={tServices('editService')}
        submitText={tCommon('save')}
      />
    </div>
  )
}
