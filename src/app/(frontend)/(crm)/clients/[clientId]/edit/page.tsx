import { useAuth } from '@/app/(frontend)/_providers/auth/auth.provider'
import { getClientAction } from '../../actions'
import EditClientForm from './edit-client-form'
import { notFound } from 'next/navigation'

interface EditClientPageProps {
  params: Promise<{
    clientId: string
  }>
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const auth = useAuth()
  const { clientId } = await params
  const client = await getClientAction(clientId, auth.user!)

  if (!client) {
    notFound()
  }

  return (
    <div>
      <EditClientForm client={client} />
    </div>
  )
}
