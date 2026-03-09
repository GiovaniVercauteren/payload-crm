import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from './_providers/auth/auth.provider'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from 'next-themes'
import ThemeToggle from './_components/theme-toggle'
import { NextIntlClientProvider } from 'next-intl'
import { cookies } from 'next/headers'

export const metadata = {
  description: 'Oasezorg CRM Frontend built with Next.js and Payload CMS',
  title: 'Oasezorg CRM',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('language')?.value || 'en'

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale}>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <main>{children}</main>
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
