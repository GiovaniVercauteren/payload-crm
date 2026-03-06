'use client'

import { Invoice, Shift } from '@/payload-types'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface InvoiceDetailsProps {
  invoice: Invoice
}

export default function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const t = useTranslations('invoices')

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{invoice.invoiceNumber}</CardTitle>
        <CardDescription>
          {typeof invoice.client === 'object' ? invoice.client.name : invoice.client}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground">{t('date')}</Label>
            <p>{new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="space-y-1 text-right">
            <Label className="text-muted-foreground">{t('totalAmount')}</Label>
            <p className="text-2xl font-bold">€{invoice.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4">{t('shifts')}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(invoice.shifts as Shift[]).map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell>{new Date(shift.startDate).toLocaleString()}</TableCell>
                  <TableCell>
                    {typeof shift.service === 'object' ? shift.service.name : shift.service}
                  </TableCell>
                  <TableCell className="text-right">€{shift.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
