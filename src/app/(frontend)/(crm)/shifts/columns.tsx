'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Shift } from '@/payload-types'
import { useTranslations } from 'next-intl'
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

export const getColumns = (onDelete: () => void): ColumnDef<Shift>[] => [
  {
    accessorKey: 'startDate',
    header: 'Date',
    cell: ({ row }) => {
      return <>{new Date(row.original.startDate).toLocaleDateString()}</>
    },
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const client = row.original.client
      return <>{typeof client === 'object' ? client.name : client}</>
    },
  },
  {
    accessorKey: 'service',
    header: 'Service',
    cell: ({ row }) => {
      const service = row.original.service
      return <>{typeof service === 'object' ? service.name : service}</>
    },
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total Price',
    cell: ({ row }) => {
      return <>€{row.original.totalPrice.toFixed(2)}</>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const t = useTranslations('shifts.statuses')
      return <>{t(row.original.status)}</>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell shift={row.original} onDelete={onDelete} />,
  },
]
