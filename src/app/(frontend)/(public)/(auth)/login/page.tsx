'use client'

import { useTranslations } from 'next-intl'
import LoginForm from './login-form'
import OasezorgLogo from '@/app/(frontend)/_components/oasezorg-logo'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function LoginPage() {
  const t = useTranslations('auth')

  return (
    <section className="w-sm">
      <OasezorgLogo className="h-24 mb-8" />
      <LoginForm />
      <Separator className="my-6" />
      <p className="text-sm text-center">
        {t('noAccount')}{' '}
        <Link href="/register" className="text-green hover:underline">
          {t('register')}
        </Link>
      </p>
    </section>
  )
}
