'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { getServicesAction } from './actions'
import { PaginatedDocs } from 'payload'
import { Service } from '@/payload-types'
import DataTable from '../../_components/data-table'
import { getColumns } from './columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ServicesPage() {
  const [services, setServices] = useState<PaginatedDocs<Service> | null>(null)
  const t = useTranslations('services.create')

  const fetchServices = useCallback(async () => {
    const services = await getServicesAction()
    setServices(services)
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const columns = useMemo(() => getColumns(fetchServices), [fetchServices])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button asChild>
          <Link href="/services/create">{t('createService')}</Link>
        </Button>
      </div>
      <DataTable data={services?.docs || []} columns={columns} />
    </div>
  )
}
