import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const language = cookieStore.get('language')?.value || 'en'

  return {
    locale: language,
    messages: (await import(`./dictionaries/${language}.json`)).default,
  }
})
