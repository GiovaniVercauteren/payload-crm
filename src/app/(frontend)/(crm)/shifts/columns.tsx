'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Shift } from '@/payload-types'
import { useFormatter, useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Trash, Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteShiftAction } from './actions'
import { useState } from 'react'
import { toast } from 'sonner'

interface ActionCellProps {
  shift: Shift
  onDelete: () => void
}

const ActionCell = ({ shift, onDelete }: ActionCellProps) => {
  const t = useTranslations('common')
  const tMessages = useTranslations('shifts.messages')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteShiftAction(shift.id.toString())
      toast.success(tMessages('deleteSuccess'))
      onDelete()
    } catch (error) {
      toast.error(tMessages('deleteError'))
      console.error('Failed to delete shift:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/shifts/${shift.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                {t('view')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/shifts/${shift.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('edit')}
              </Link>
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                {t('delete')}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmation.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteConfirmation.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteConfirmation.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} variant="destructive" disabled={isDeleting}>
              {t('deleteConfirmation.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const getColumns = (
  onDelete: () => void,
  t: (key: string) => string,
): ColumnDef<Shift>[] => [
  {
    accessorKey: 'startDate',
    header: t('startDate'),
    cell: ({ row }) => {
      const format = useFormatter()
      return <>{format.dateTime(new Date(row.original.startDate), { dateStyle: 'medium' })}</>
    },
  },
  {
    accessorKey: 'client',
    header: t('client'),
    cell: ({ row }) => {
      const client = row.original.client
      return <>{typeof client === 'object' ? client.name : client}</>
    },
  },
  {
    accessorKey: 'service',
    header: t('service'),
    cell: ({ row }) => {
      const service = row.original.service
      return <>{typeof service === 'object' ? service.name : service}</>
    },
  },
  {
    accessorKey: 'totalPrice',
    header: t('totalPrice'),
    cell: ({ row }) => {
      const format = useFormatter()
      return <>{format.number(row.original.totalPrice, { style: 'currency', currency: 'EUR' })}</>
    },
  },
  {
    accessorKey: 'status',
    header: t('status'),
    cell: ({ row }) => {
      const tStatuses = useTranslations('shifts.statuses')
      return <>{tStatuses(row.original.status)}</>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell shift={row.original} onDelete={onDelete} />,
  },
]
