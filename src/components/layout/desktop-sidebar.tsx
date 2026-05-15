'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Target, BookOpen, Settings, Bell, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/services/auth'
import { NotificationIndicator } from '../notifications/notification-indicator'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: BookOpen, label: 'Notes', href: '/notes' },
  { icon: Bell, label: 'Notifications', href: '/notifications', isNotification: true },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r bg-card">
      <div className="p-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          EduTrack
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.isNotification ? (
                <NotificationIndicator iconClassName={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t space-y-2">
        <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
        <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-accent/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Student</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
