'use client'

import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function LanguageSwitch() {
  const locale = useLocale()
  const router = useRouter()

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'nl' : 'en'
    document.cookie = `language=${newLocale}; path=/; max-age=31536000` // 1 year
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={toggleLanguage} className="w-12 px-0">
      {locale === 'en' ? 'EN' : 'NL'}
    </Button>
  )
}
