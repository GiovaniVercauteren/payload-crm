'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Invoice } from '@/payload-types'
import { useFormatter, useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Trash, Eye } from 'lucide-react'
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
import { deleteInvoiceAction } from './actions'
import { useState } from 'react'
import { toast } from 'sonner'

interface ActionCellProps {
  invoice: Invoice
  onDelete: () => void
}

const ActionCell = ({ invoice, onDelete }: ActionCellProps) => {
  const t = useTranslations('common')
  const tMessages = useTranslations('invoices.messages')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteInvoiceAction(invoice.id.toString())
      toast.success(tMessages('deleteSuccess'))
      onDelete()
    } catch (error) {
      toast.error(tMessages('deleteError'))
      console.error('Failed to delete invoice:', error)
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
              <Link href={`/invoices/${invoice.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                {t('view')}
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
            <AlertDialogAction
              onClick={handleDelete}
              variant="destructive"
              disabled={isDeleting}
            >
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
): ColumnDef<Invoice>[] => [
  {
    accessorKey: 'invoiceNumber',
    header: t('invoiceNumber'),
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
    accessorKey: 'totalAmount',
    header: t('totalAmount'),
    cell: ({ row }) => {
      const format = useFormatter()
      return (
        <>{format.number(row.original.totalAmount, { style: 'currency', currency: 'EUR' })}</>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: t('date'),
    cell: ({ row }) => {
      return (
        <>{new Date(row.original.createdAt).toLocaleDateString('nl-BE', { timeZone: 'Europe/Brussels' })}</>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell invoice={row.original} onDelete={onDelete} />,
  },
]
