import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from '@/components/ui/sidebar'
import React from 'react'
import OasezorgLogo from '../../_components/oasezorg-logo'

export default function CrmSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <OasezorgLogo className="h-10 w-auto" />
      </SidebarHeader>
      <SidebarContent>{/* TODO: Implement sidebar menu items */}</SidebarContent>
      <SidebarFooter>{/* TODO: Implement sidebar footer */}</SidebarFooter>
    </Sidebar>
  )
}
