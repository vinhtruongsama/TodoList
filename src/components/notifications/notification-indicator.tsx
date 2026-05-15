'use client'

import React, { useEffect, useState } from 'react'
import { getUnreadCount } from '@/services/notifications'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationIndicatorProps {
  className?: string
  iconClassName?: string
}

export function NotificationIndicator({ className, iconClassName }: NotificationIndicatorProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function fetchCount() {
      const unreadCount = await getUnreadCount()
      setCount(unreadCount)
    }
    fetchCount()
    
    // Polling nhẹ nhàng mỗi 30s (tùy chọn vì chưa có realtime)
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("relative", className)}>
      <Bell className={cn("w-5 h-5", iconClassName)} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  )
}
