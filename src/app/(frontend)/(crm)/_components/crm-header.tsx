import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import ThemeToggle from '../../_components/theme-toggle'
import LanguageSwitch from '../../_components/language-switch'

export default function CrmHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-inherit">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    </header>
  )
}
