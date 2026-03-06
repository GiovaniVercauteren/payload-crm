'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { getClientsAction } from './actions'
import { PaginatedDocs } from 'payload'
import { Client } from '@/payload-types'
import DataTable from '../../_components/data-table'
import { getColumns } from './columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ClientsPage() {
  const [clients, setClients] = useState<PaginatedDocs<Client> | null>(null)
  const t = useTranslations('clients.create')

  const fetchClients = useCallback(async () => {
    const clients = await getClientsAction()
    setClients(clients)
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const columns = useMemo(() => getColumns(fetchClients), [fetchClients])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/clients/create">{t('createClient')}</Link>
        </Button>
      </div>
      <DataTable data={clients?.docs || []} columns={columns} />
    </div>
  )
}
