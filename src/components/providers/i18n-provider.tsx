'use client'

import React, { createContext, useContext, useState } from 'react'
import vi from '@/locales/vi.json'
import ja from '@/locales/ja.json'
import en from '@/locales/en.json'

type Locale = 'vi' | 'ja' | 'en'

const translations = { vi, ja, en }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale
      if (savedLocale && ['vi', 'ja', 'en'].includes(savedLocale)) {
        return savedLocale
      }
    }
    return 'vi'
  })

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = (keyPath: string) => {
    const keys = keyPath.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = (translations as any)[locale]
    for (const key of keys) {
      if (current[key] === undefined) return keyPath
      current = current[key]
    }
    return current
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
