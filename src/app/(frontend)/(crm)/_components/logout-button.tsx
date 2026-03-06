'use client'

import { LogOut } from 'lucide-react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { logoutAction } from '@/app/(frontend)/_providers/auth/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export default function LogoutButton() {
  const router = useRouter()
  const t = useTranslations('common')

  const handleLogout = async () => {
    try {
      await logoutAction()
      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleLogout}>
          <LogOut className="size-4" />
          <span>{t('logout')}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
