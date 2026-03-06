'use client'

import { Client } from '@/payload-types'
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

interface ClientDetailsProps {
  client: Client
}

export default function ClientDetails({ client }: ClientDetailsProps) {
  const t = useTranslations('clients')
  const tCommon = useTranslations('common')

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
        <CardDescription>{t(`clientTypes.${client.type}`)}</CardDescription>
        <CardAction>
          <Button asChild variant="outline">
            <Link href={`/clients/${client.id}/edit`}>{tCommon('edit')}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('create.contactInfoLegend')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('contactInfo.email')}</Label>
              <p>{client.contactInfo?.email || '-'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('contactInfo.phone')}</Label>
              <p>{client.contactInfo?.phone || '-'}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">{t('create.addressLegend')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('address.street')}</Label>
              <p>{client.address.street}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('address.city')}</Label>
              <p>{client.address.city}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('address.postalCode')}</Label>
              <p>{client.address.postalCode}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('address.country')}</Label>
              <p>{client.address.country}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">{t('create.additionalInfoLegend')}</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('notes')}</Label>
              <p className="whitespace-pre-wrap">{client.notes || '-'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('defaultRate')}</Label>
              <p>{client.defaultRate ? `€${client.defaultRate.toFixed(2)}` : '-'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
