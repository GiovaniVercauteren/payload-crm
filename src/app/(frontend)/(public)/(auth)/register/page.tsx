import OasezorgLogo from '@/app/(frontend)/_components/oasezorg-logo'
import { useTranslations } from 'next-intl'

export default function RegisterPage() {
  const t = useTranslations('auth')

  return (
    <section className="w-sm flex flex-col items-center justify-center">
      <OasezorgLogo className="h-24 mb-8" />
      <p>{t('registrationClosed')}</p>
      <p>{t('contactAdminForAccess')}</p>
    </section>
  )
}
