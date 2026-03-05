import React, { createContext } from 'react'
import { ThemeContext } from './types'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

const Context = createContext({} as ThemeContext)

export const ThemeProvider: React.FC<React.ComponentProps<typeof NextThemesProvider>> = ({
  children,
  ...props
}) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
