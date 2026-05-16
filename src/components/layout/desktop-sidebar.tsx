'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Target, BookOpen, Bell, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/services/auth'
import { NotificationIndicator } from '../notifications/notification-indicator'
import { ThemeToggle } from './theme-toggle'

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
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-card border-r z-50">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              EduTrack
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <div className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar pb-10">
        {/* Workspace Section */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-2">Không gian học</p>
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Community & Alerts */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-2">Kết nối</p>
          {navItems.slice(4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {item.isNotification ? (
                  <NotificationIndicator iconClassName="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5 shrink-0" />
                )}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t bg-secondary/20">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center border shadow-sm">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Học viên</p>
            <p className="text-[10px] text-primary font-bold uppercase">Gói Premium</p>
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
