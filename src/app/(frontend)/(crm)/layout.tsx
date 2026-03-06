import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import CrmSidebar from './_components/crm-sidebar'
import CrmHeader from './_components/crm-header'
import CrmFooter from './_components/crm-footer'

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CrmSidebar />
      <SidebarInset>
        <CrmHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
        <CrmFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
