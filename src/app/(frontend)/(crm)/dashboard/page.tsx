import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders, cookies } from 'next/headers'
import { Users, Calendar, FileText, Euro, ArrowRight } from 'lucide-react'
import { Shift, Invoice, Client } from '@/payload-types'
import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

export default async function DashboardPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  const t = await getTranslations('dashboard')
  const cookieStore = await cookies()
  const locale = cookieStore.get('language')?.value || 'en'

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-red-500">{t('accessDenied')}</h1>
        <p className="text-muted-foreground">{t('pleaseLogin')}</p>
      </div>
    )
  }

  // Fetch stats and recent data
  const [clients, upcomingShifts, invoices, recentShifts, recentInvoices] = await Promise.all([
    payload.find({
      collection: 'clients',
      limit: 0,
      user,
      overrideAccess: false,
      depth: 0,
    }),
    payload.find({
      collection: 'shifts',
      where: {
        and: [
          {
            status: {
              equals: 'scheduled',
            },
          },
          {
            startDate: {
              greater_than: new Date().toISOString(),
            },
          },
        ],
      },
      limit: 0,
      user,
      overrideAccess: false,
      depth: 0,
    }),
    payload.find({
      collection: 'invoices',
      limit: 0,
      user,
      overrideAccess: false,
      depth: 0,
    }),
    payload.find({
      collection: 'shifts',
      limit: 5,
      sort: '-startDate',
      user,
      overrideAccess: false,
      depth: 1,
    }),
    payload.find({
      collection: 'invoices',
      limit: 5,
      sort: '-createdAt',
      user,
      overrideAccess: false,
      depth: 1,
    }),
  ])

  // Get total revenue for the current month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { docs: allInvoices } = await payload.find({
    collection: 'invoices',
    limit: 1000,
    user,
    overrideAccess: false,
    where: {
      createdAt: {
        greater_than_equal: firstDayOfMonth,
      },
    },
    select: {
      totalAmount: true,
    },
    depth: 0,
  })

  const totalRevenue = allInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0)

  const stats = [
    {
      title: t('stats.totalClients'),
      value: clients.totalDocs,
      icon: Users,
      description: t('stats.totalClientsDesc'),
    },
    {
      title: t('stats.upcomingShifts'),
      value: upcomingShifts.totalDocs,
      icon: Calendar,
      description: t('stats.upcomingShiftsDesc'),
    },
    {
      title: t('stats.totalInvoices'),
      value: invoices.totalDocs,
      icon: FileText,
      description: t('stats.totalInvoicesDesc'),
    },
    {
      title: t('stats.totalRevenue'),
      value: new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(totalRevenue),
      icon: Euro,
      description: t('stats.totalRevenueDesc'),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('welcome')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="flex flex-col lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('quickActions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="grid flex-1 gap-3">
            <QuickActionLink
              href="/shifts/create"
              icon={Calendar}
              title={t('quickActions.scheduleShift')}
              description={t('quickActions.scheduleShiftDesc')}
            />
            <QuickActionLink
              href="/clients/create"
              icon={Users}
              title={t('quickActions.addClient')}
              description={t('quickActions.addClientDesc')}
            />
            <QuickActionLink
              href="/invoices/create"
              icon={FileText}
              title={t('quickActions.createInvoice')}
              description={t('quickActions.createInvoiceDesc')}
            />
          </CardContent>
        </Card>

        {/* Recent Shifts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('recentShifts.title')}</CardTitle>
            <a href="/shifts" className="text-sm font-medium text-primary hover:underline">
              {t('recentShifts.viewAll')}
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentShifts.docs.length > 0 ? (
                recentShifts.docs.map((shift: Shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {typeof shift.client === 'object'
                          ? (shift.client as Client).name
                          : t('recentShifts.unknownClient')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(shift.startDate).toLocaleDateString(
                          locale === 'nl' ? 'nl-NL' : 'en-US',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                          shift.status === 'completed'
                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                            : shift.status === 'scheduled'
                              ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                              : 'bg-red-50 text-red-700 ring-red-600/20',
                        )}
                      >
                        {shift.status}
                      </span>
                      <span className="font-semibold text-sm">
                        {new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(shift.totalPrice || 0)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  {t('recentShifts.noShifts')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('recentInvoices.title')}</CardTitle>
            <a href="/invoices" className="text-sm font-medium text-primary hover:underline">
              {t('recentInvoices.viewAll')}
            </a>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentInvoices.docs.length > 0 ? (
                recentInvoices.docs.map((invoice: Invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{invoice.invoiceNumber}</span>
                      <span className="text-sm font-semibold">
                        {new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(invoice.totalAmount || 0)}
                      </span>
                    </div>
                    <div className="flex flex-col text-sm text-muted-foreground">
                      <span>
                        {typeof invoice.client === 'object'
                          ? (invoice.client as Client).name
                          : t('recentInvoices.unknownClient')}
                      </span>
                      <span>
                        {new Date(invoice.createdAt).toLocaleDateString(
                          locale === 'nl' ? 'nl-NL' : 'en-US',
                        )}
                      </span>
                    </div>
                    <a
                      href={`/invoices/${invoice.id}`}
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                    >
                      {t('recentInvoices.viewDetails')} <ArrowRight className="ml-1 w-4 h-4" />
                    </a>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-4">
                  {t('recentInvoices.noInvoices')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuickActionLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string
  icon: any
  title: string
  description: string
}) {
  return (
    <a
      href={href}
      className="flex items-center p-4 transition-all border rounded-xl hover:bg-muted hover:border-primary/50 group"
    >
      <div className="p-2 mr-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </a>
  )
}
