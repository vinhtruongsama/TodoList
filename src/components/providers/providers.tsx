'use client'

import { ThemeProvider } from './theme-provider'
import { I18nProvider } from './i18n-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  )
}
