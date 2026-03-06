'use client'

import { usePathname } from 'next/navigation'
import { Users, Briefcase, FileText, LayoutDashboard, Settings } from 'lucide-react'
import Link from 'next/link'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { useTranslations } from 'next-intl'

export default function CrmSidebarMenu() {
  const pathname = usePathname()
  const t = useTranslations('common')

  const items = [
    {
      title: t('dashboard'),
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: t('clients'),
      url: '/clients',
      icon: Users,
    },
    {
      title: t('services'),
      url: '/services',
      icon: Briefcase,
    },
    {
      title: t('invoices'),
      url: '/invoices',
      icon: FileText,
    },
    {
      title: t('account'),
      url: '/account',
      icon: Settings,
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                <Link href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
