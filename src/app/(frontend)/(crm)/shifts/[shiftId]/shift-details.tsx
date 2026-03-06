'use client'

import { Shift } from '@/payload-types'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ShiftDetailsProps {
  shift: Shift
}

export default function ShiftDetails({ shift }: ShiftDetailsProps) {
  const t = useTranslations('shifts')
  const tServices = useTranslations('services')
  const tCommon = useTranslations('common')

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{new Date(shift.startDate).toLocaleString()}</CardTitle>
        <CardDescription>
          {typeof shift.client === 'object' ? shift.client.name : shift.client}
        </CardDescription>
        <CardAction>
          <Button asChild variant="outline">
            <Link href={`/shifts/${shift.id}/edit`}>{tCommon('edit')}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground">{t('startDate')}</Label>
            <p>{new Date(shift.startDate).toLocaleString()}</p>
          </div>
          <div className="space-y-1 text-right">
            <Label className="text-muted-foreground">{t('endDate')}</Label>
            <p>{new Date(shift.endDate).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">{t('breakDuration')}</Label>
            <p>{shift.breakDuration} min</p>
          </div>
          <div className="space-y-1 text-right">
            <Label className="text-muted-foreground">{t('status')}</Label>
            <p>{t(`statuses.${shift.status}`)}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground">{t('service')}</Label>
            <p>{typeof shift.service === 'object' ? shift.service.name : shift.service}</p>
          </div>
          <div className="space-y-1 text-right">
            <Label className="text-muted-foreground">{t('totalPrice')}</Label>
            <p className="text-xl font-bold">€{shift.totalPrice.toFixed(2)}</p>
          </div>
          {shift.customRate !== null && shift.customRate !== undefined && (
            <>
              <div className="space-y-1">
                <Label className="text-muted-foreground">{t('customRate')}</Label>
                <p>€{shift.customRate.toFixed(2)}</p>
              </div>
              <div className="space-y-1 text-right">
                <Label className="text-muted-foreground">{t('customRateType')}</Label>
                <p>{shift.customRateType ? tServices(`rateTypes.${shift.customRateType}`) : '-'}</p>
              </div>
            </>
          )}
        </div>

        <Separator />

        <div>
          <Label className="text-muted-foreground">{t('notes')}</Label>
          <p className="whitespace-pre-wrap mt-1">{shift.notes || '-'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
