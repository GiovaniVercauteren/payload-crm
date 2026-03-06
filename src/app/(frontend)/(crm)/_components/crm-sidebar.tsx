import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import React from 'react'
import OasezorgLogo from '../../_components/oasezorg-logo'
import CrmSidebarMenu from './crm-sidebar-menu'
import LogoutButton from './logout-button'

export default function CrmSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <OasezorgLogo className="h-10 w-auto" />
      </SidebarHeader>
      <SidebarContent>
        <CrmSidebarMenu />
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}
