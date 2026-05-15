'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Target, BookOpen, Settings, User, Star } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

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
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{t(item.label)}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r bg-card">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            EduTrack
          </h1>
        </div>
        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{t(item.label)}</span>
              </Link>
            )
          })}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </div>
        </div>
      </nav>
    </>
  )
}
