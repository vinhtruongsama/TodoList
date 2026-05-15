'use client'

import { ThemeProvider } from './theme-provider'
import { I18nProvider } from './i18n-provider'
import { NotificationProvider } from './notification-provider'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        <NotificationProvider>
          {children}
          <Toaster position="top-center" richColors />
        </NotificationProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
