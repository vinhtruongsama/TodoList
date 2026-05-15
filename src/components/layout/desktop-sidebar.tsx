'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Target, BookOpen, Bell, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/services/auth'
import { NotificationIndicator } from '../notifications/notification-indicator'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: BookOpen, label: 'Notes', href: '/notes' },
  { icon: User, label: 'Mentors', href: '/mentors' },
  { icon: Bell, label: 'Notifications', href: '/notifications', isNotification: true },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r bg-sidebar border-sidebar-border/50">
      <div className="px-7 py-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            EduTrack
          </h1>
        </div>
      </div>
      
      <div className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Workspace Section */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40 mb-2">Workspace</p>
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn(
                  "w-4.5 h-4.5 transition-colors stroke-[1.5]",
                  isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                )} />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Community & Alerts */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40 mb-2">Network</p>
          {navItems.slice(4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {item.isNotification ? (
                  <NotificationIndicator iconClassName={cn("w-4.5 h-4.5 stroke-[1.5]", isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground")} />
                ) : (
                  <Icon className={cn(
                    "w-4.5 h-4.5 transition-colors stroke-[1.5]",
                    isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                  )} />
                )}
                <span className="tracking-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="p-3 rounded-2xl bg-sidebar-accent/30 border border-sidebar-border/50 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate tracking-tight">Student</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">Premium Plan</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-[11px] font-bold text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-all group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:text-destructive" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
