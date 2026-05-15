'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Target, BookOpen, User, Star, LogOut } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { signOut } from '@/services/auth'

const navItems = [
  { icon: Home, label: 'common.dashboard', href: ROUTES.HOME },
  { icon: CheckSquare, label: 'common.tasks', href: ROUTES.TASKS },
  { icon: Target, label: 'common.goals', href: ROUTES.GOALS },
  { icon: BookOpen, label: 'common.notes', href: ROUTES.NOTES },
  { icon: Star, label: 'common.reviews', href: ROUTES.REVIEWS },
  { icon: User, label: 'common.mentors', href: ROUTES.MENTORS },
]

export function Navigation() {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <>
      {/* Mobile Bottom Navigation - Premium Glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/60 backdrop-blur-2xl md:hidden pb-[env(safe-area-inset-bottom)] ring-1 ring-white/10 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-300 active:scale-90",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "px-4 py-1.5 rounded-full transition-all duration-300",
                  isActive ? "bg-primary/10 shadow-[inset_0_0_10px_rgba(var(--primary),0.05)]" : ""
                )}>
                  <Icon className={cn(
                    "w-5 h-5 stroke-[1.5]",
                    isActive ? "scale-110" : "scale-100"
                  )} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.05em]">{t(item.label).split('.')[1] || t(item.label)}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
