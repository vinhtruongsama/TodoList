'use client'

import React from 'react'
import Link from 'next/link'
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/20 rounded-2xl border border-dashed border-border/60">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
          <BellOff className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold">Hộp thư trống</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
          Bạn sẽ nhận được thông báo khi Mentor phản hồi hoặc khi bạn đạt được những cột mốc quan trọng.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Bảng điều khiển</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/tasks">Xem nhiệm vụ</Link>
          </Button>
        </div>
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
