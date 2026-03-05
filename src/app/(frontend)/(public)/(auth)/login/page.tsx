'use client'

import { useTranslations } from 'next-intl'
import LoginForm from './login-form'
import OasezorgLogo from '@/app/(frontend)/_components/oasezorg-logo'
import { Separator } from '@/components/ui/separator'

export default function LoginPage() {
  const t = useTranslations('auth')

  return (
    <div className="w-sm">
      <OasezorgLogo className="h-24 mb-8" />
      <h1 className="text-2xl font-bold mb-4 text-center">{t('login')}</h1>
      <LoginForm />
      <Separator className="my-6" />
      <p className="text-sm text-center">
        {t('noAccount')}{' '}
        <a href="/register" className="text-green hover:underline">
          {t('register')}
        </a>
      </p>
    </div>
  )
}
