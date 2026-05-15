'use client'

import React from 'react'
import { AppNotification } from '@/types'
import { NotificationItem } from './notification-item'
import { BellOff, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { markAllAsRead } from '@/services/notifications'

interface NotificationListProps {
  notifications: AppNotification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  const unreadCount = notifications.filter(n => !n.is_read).length

  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 bg-accent/10 rounded-[2.5rem] border-2 border-dashed border-accent/20">
        <BellOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Bạn không có thông báo nào.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {unreadCount > 0 && (
        <div className="flex justify-end px-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => markAllAsRead()}
            className="text-xs font-bold text-primary hover:bg-primary/5 rounded-full"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  )
}
