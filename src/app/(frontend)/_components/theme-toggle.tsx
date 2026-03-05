'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  )
}
