'use client'

import { useTranslations } from 'next-intl'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { FileText } from 'lucide-react'

export default function InvoicesPage() {
  const t = useTranslations('common')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('invoices')}</h1>
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
