import { AuthProvider } from './_providers/auth/auth.provider'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'

export const metadata = {
  description: 'Oasezorg CRM Frontend built with Next.js and Payload CMS',
  title: 'Oasezorg CRM',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TooltipProvider>
            <main>{children}</main>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
