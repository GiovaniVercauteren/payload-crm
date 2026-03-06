import { getServiceAction } from '../actions'
import ServiceDetails from './service-details'
import { notFound } from 'next/navigation'

interface ServicePageProps {
  params: Promise<{
    serviceId: string
  }>
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceId } = await params
  const service = await getServiceAction(serviceId)

  if (!service) {
    notFound()
  }

  return (
    <div>
      <ServiceDetails service={service} />
    </div>
  )
}
