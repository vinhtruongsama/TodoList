'use client'

import { ThemeProvider } from './theme-provider'
import { I18nProvider } from './i18n-provider'
import { NotificationProvider } from './notification-provider'
import { Toaster } from 'sonner'
import { ReliabilityProvider } from './reliability-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <I18nProvider>
        <NotificationProvider>
          <ReliabilityProvider>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </ReliabilityProvider>
        </NotificationProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
