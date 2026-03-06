import { useAuth } from '@/app/(frontend)/_providers/auth/auth.provider'
import { getClientAction } from '../actions'
import ClientDetails from './client-details'
import { notFound } from 'next/navigation'

interface ClientPageProps {
  params: Promise<{
    clientId: string
  }>
}

export default async function ClientPage({ params }: ClientPageProps) {
  const auth = useAuth()
  const { clientId } = await params
  const client = await getClientAction(clientId, auth.user!)

  if (!client) {
    notFound()
  }

  return (
    <div>
      <ClientDetails client={client} />
    </div>
  )
}
