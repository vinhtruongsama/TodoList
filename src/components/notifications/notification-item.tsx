'use client'

import React from 'react'
import { AppNotification } from '@/types'
import { Bell, CheckCircle2, MessageSquare, UserPlus } from 'lucide-react'
import { markAsRead } from '@/services/notifications'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: AppNotification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const isUnread = !notification.is_read

  const icons = {
    new_review: <MessageSquare className="w-5 h-5 text-blue-500" />,
    new_invitation: <UserPlus className="w-5 h-5 text-purple-500" />,
    invitation_accepted: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    system: <Bell className="w-5 h-5 text-orange-500" />,
  }

  const handleMarkAsRead = async () => {
    if (isUnread) {
      await markAsRead(notification.id)
    }
  }

  return (
    <div 
      onClick={handleMarkAsRead}
      className={cn(
        "p-5 rounded-[1.5rem] border transition-all cursor-pointer relative overflow-hidden group",
        isUnread ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border/50 opacity-80 hover:opacity-100"
      )}
    >
      {isUnread && (
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      )}

      <div className="flex gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
          isUnread ? "bg-white dark:bg-slate-900 shadow-sm" : "bg-accent/50"
        )}>
          {icons[notification.type] || icons.system}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <h4 className={cn("font-bold text-sm", isUnread ? "text-foreground" : "text-muted-foreground")}>
              {notification.title}
            </h4>
            <span className="text-[10px] text-muted-foreground font-medium">
              {new Date(notification.created_at).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  )
}
