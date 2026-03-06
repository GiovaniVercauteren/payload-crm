import { getServiceAction } from '../../actions'
import EditServiceForm from './edit-service-form'
import { notFound } from 'next/navigation'

interface EditServicePageProps {
  params: Promise<{
    serviceId: string
  }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { serviceId } = await params
  const service = await getServiceAction(serviceId)

  if (!service) {
    notFound()
  }

  return (
    <div>
      <EditServiceForm service={service} />
    </div>
  )
}
