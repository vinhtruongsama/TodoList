import React from 'react'
import { getMyNotifications } from '@/services/notifications'
import { NotificationList } from '@/components/notifications/notification-list'
import { Bell } from 'lucide-react'

export const metadata = {
  title: 'Thông báo | EduTrack',
}

export default async function NotificationsPage() {
  const notifications = await getMyNotifications()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thông báo</h1>
          <p className="text-muted-foreground">Cập nhật những hoạt động mới nhất của bạn.</p>
        </div>
      </header>

      <section>
        <NotificationList notifications={notifications} />
      </section>
    </div>
  )
}
