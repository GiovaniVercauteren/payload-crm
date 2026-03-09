import { Button } from '@/components/ui/button'
import Link from 'next/link'
import OasezorgLogo from '../_components/oasezorg-logo'
import LanguageSwitch from '../_components/language-switch'
import ThemeToggle from '../_components/theme-toggle'
import { getTranslations } from 'next-intl/server'
import { Users, Calendar, FileText, ArrowRight } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'

export default async function HomePage() {
  const t = await getTranslations('landing')
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <OasezorgLogo className="h-8 m-0!" />
          <div className="flex items-center gap-4">
            <LanguageSwitch />
            <ThemeToggle />
            {user ? (
              <Button asChild>
                <Link href="/dashboard">{t('hero.dashboard')}</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">{t('hero.cta')}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 overflow-hidden bg-radial from-green/10 via-background to-background dark:from-green/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {user ? (
                  <Button size="lg" className="h-12 px-8" asChild>
                    <Link href="/dashboard">
                      {t('hero.dashboard')} <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="h-12 px-8" asChild>
                    <Link href="/login">
                      {t('hero.cta')} <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Users}
                title={t('features.clients.title')}
                description={t('features.clients.description')}
              />
              <FeatureCard
                icon={Calendar}
                title={t('features.shifts.title')}
                description={t('features.shifts.description')}
              />
              <FeatureCard
                icon={FileText}
                title={t('features.invoices.title')}
                description={t('features.invoices.description')}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <OasezorgLogo className="h-8 m-0!" />
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {t('footer.rights')}
              </p>
            </div>
            <p className="text-sm text-muted-foreground italic">
              {t('footer.builtWith')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-background border hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-green/10 text-green flex items-center justify-center mb-6">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
