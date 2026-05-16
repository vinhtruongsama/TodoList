'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Target, BookOpen, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationIndicator } from '../notifications/notification-indicator'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: BookOpen, label: 'Notes', href: '/notes' },
  { icon: Bell, label: 'Thông báo', href: '/notifications', isNotification: true },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-xl pb-safe">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full pt-1 pb-2 transition-all",
                isActive ? "text-primary" : "text-muted-foreground/80"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
              )}
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full mb-1 transition-colors",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                {item.isNotification ? (
                  <NotificationIndicator iconClassName="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <span className={cn(
                "text-[11px] font-bold tracking-tight",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
