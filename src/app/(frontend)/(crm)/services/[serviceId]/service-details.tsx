'use client'

import { Service } from '@/payload-types'
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

interface ServiceDetailsProps {
  service: Service
}

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  const t = useTranslations('services')
  const tCommon = useTranslations('common')

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>{t(`rateTypes.${service.rateType}`)}</CardDescription>
        <CardAction>
          <Button asChild variant="outline">
            <Link href={`/services/${service.id}/edit`}>{tCommon('edit')}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('create.serviceLegend')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('rate')}</Label>
              <p>€{service.rate.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">{t('deprecated')}</Label>
              <p>{service.deprecated ? tCommon('yes') || 'Yes' : tCommon('no') || 'No'}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">{t('description')}</Label>
            <p className="whitespace-pre-wrap">{service.description || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
