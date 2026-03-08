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
import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { generateInvoicePDFAction } from '../actions'
import { toast } from 'sonner'

interface InvoiceDetailsProps {
  invoice: Invoice
}

export default function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const t = useTranslations('invoices')
  const tCommon = useTranslations('common')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const base64 = await generateInvoicePDFAction(invoice.id)
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoice.invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('PDF generated successfully')
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{invoice.invoiceNumber}</CardTitle>
          <CardDescription>
            {typeof invoice.client === 'object' ? invoice.client.name : invoice.client}
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDownload} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          {tCommon('downloadPdf')}
        </Button>
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
