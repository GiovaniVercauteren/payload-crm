import { getClientAction } from '../../actions'
import EditClientForm from './edit-client-form'
import { notFound } from 'next/navigation'

interface EditClientPageProps {
  params: Promise<{
    clientId: string
  }>
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { clientId } = await params
  const client = await getClientAction(clientId)

  if (!client) {
    notFound()
  }

  return (
    <div>
      <EditClientForm client={client} />
    </div>
  )
}
