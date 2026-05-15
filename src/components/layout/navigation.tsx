'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Target, BookOpen, User, Star, LogOut } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { signOut } from '@/services/auth'

const mainNavItems = [
  { icon: Home, label: 'common.dashboard', href: ROUTES.HOME },
  { icon: CheckSquare, label: 'common.tasks', href: ROUTES.TASKS },
  { icon: Target, label: 'common.goals', href: ROUTES.GOALS },
  { icon: BookOpen, label: 'common.notes', href: ROUTES.NOTES },
]

export function Navigation() {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <>
      {/* Mobile Bottom Navigation - Simplified & Spaced */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-3xl md:hidden pb-[env(safe-area-inset-bottom)] ring-1 ring-black/5 shadow-[0_-8px_40px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between items-center h-16 px-4 max-w-md mx-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-300 relative",
                  isActive ? "text-primary" : "text-muted-foreground/60 hover:text-muted-foreground"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center h-8 w-12 rounded-2xl transition-all duration-300",
                  isActive ? "bg-primary/10" : "active:bg-secondary/50"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive ? "scale-110 stroke-[2]" : "scale-100 stroke-[1.5]"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-all",
                  isActive ? "opacity-100 translate-y-0" : "opacity-60 scale-95"
                )}>
                  {t(item.label).split('.')[1] || t(item.label)}
                </span>
                
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full blur-[1px]" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
