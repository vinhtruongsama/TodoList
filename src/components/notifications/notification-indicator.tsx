'use client'

import React from 'react'
import { useNotifications } from '@/components/providers/notification-provider'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationIndicatorProps {
  className?: string
  iconClassName?: string
}

export function NotificationIndicator({ className, iconClassName }: NotificationIndicatorProps) {
  const { unreadCount: count } = useNotifications()

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <Bell className={cn("w-5 h-5", iconClassName)} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300 ring-2 ring-background">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  )
}
