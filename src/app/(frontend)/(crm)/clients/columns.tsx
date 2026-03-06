'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Client } from '@/payload-types'
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
import { deleteClientAction } from './actions'
import { useState } from 'react'
import { toast } from 'sonner'

interface ActionCellProps {
  client: Client
  onDelete: () => void
}

const ActionCell = ({ client, onDelete }: ActionCellProps) => {
  const t = useTranslations('common')
  const tMessages = useTranslations('clients.messages')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteClientAction(client.id.toString())
      toast.success(tMessages('deleteSuccess'))
      onDelete()
    } catch (error) {
      toast.error(tMessages('deleteError'))
      console.error('Failed to delete client:', error)
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
              <Link href={`/clients/${client.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                {t('view')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/clients/${client.id}/edit`}>
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

export const getColumns = (onDelete: () => void): ColumnDef<Client>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const t = useTranslations('clients.clientTypes')
      const type = row.original.type

      return <>{t(type)}</>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell client={row.original} onDelete={onDelete} />,
  },
]
