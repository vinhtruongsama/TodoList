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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.isNotification ? (
                <NotificationIndicator iconClassName={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
