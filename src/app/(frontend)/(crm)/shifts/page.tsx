'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { getShiftsAction } from './actions'
import { PaginatedDocs } from 'payload'
import { Shift } from '@/payload-types'
import DataTable from '../../_components/data-table'
import { getColumns } from './columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { Calendar } from 'lucide-react'

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<PaginatedDocs<Shift> | null>(null)
  const tCommon = useTranslations('common')
  const tShiftsCreate = useTranslations('shifts.create')

  const fetchShifts = useCallback(async () => {
    const result = await getShiftsAction()
    setShifts(result)
  }, [])

  useEffect(() => {
    fetchShifts()
  }, [fetchShifts])

  const columns = useMemo(() => getColumns(fetchShifts), [fetchShifts])

  if (shifts && shifts.docs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Shifts</h1>
          <Button asChild>
            <Link href="/shifts/create">{tShiftsCreate('createShift')}</Link>
          </Button>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar />
            </EmptyMedia>
            <EmptyTitle>No shifts yet</EmptyTitle>
            <EmptyDescription>Your shifts will appear here once you create them.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shifts</h1>
        <Button asChild>
          <Link href="/shifts/create">{tShiftsCreate('createShift')}</Link>
        </Button>
      </div>
      <DataTable data={shifts?.docs || []} columns={columns} />
    </div>
  )
}
