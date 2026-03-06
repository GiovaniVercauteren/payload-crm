import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function CrmHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 px-4 bg-inherit">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
    </header>
  )
}
