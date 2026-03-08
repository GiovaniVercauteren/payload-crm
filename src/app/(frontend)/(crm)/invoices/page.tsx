'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { getInvoicesAction } from './actions'
import { PaginatedDocs } from 'payload'
import { Invoice } from '@/payload-types'
import DataTable from '../../_components/data-table'
import { getColumns } from './columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { FileText } from 'lucide-react'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<PaginatedDocs<Invoice> | null>(null)
  const tCommon = useTranslations('common')
  const tInvoices = useTranslations('invoices')
  const tInvoicesCreate = useTranslations('invoices.create')

  const fetchInvoices = useCallback(async () => {
    const result = await getInvoicesAction()
    setInvoices(result)
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const columns = useMemo(() => getColumns(fetchInvoices, tInvoices), [fetchInvoices, tInvoices])

  if (invoices && invoices.docs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{tCommon('invoices')}</h1>
          <Button asChild>
            <Link href="/invoices/create">{tInvoicesCreate('createInvoice')}</Link>
          </Button>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No invoices yet</EmptyTitle>
            <EmptyDescription>Your invoices will appear here once they are generated.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{tCommon('invoices')}</h1>
        <Button asChild>
          <Link href="/invoices/create">{tInvoicesCreate('createInvoice')}</Link>
        </Button>
      </div>
      <DataTable data={invoices?.docs || []} columns={columns} />
    </div>
  )
}
