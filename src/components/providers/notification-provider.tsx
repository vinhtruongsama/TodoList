'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getUnreadCount } from '@/services/notifications'

interface NotificationContextType {
  unreadCount: number
  refreshCount: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshCount = useCallback(async () => {
    try {
      const count = await getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch notification count:', error)
    }
  }, [])

  useEffect(() => {
    // Gọi initial fetch bên trong một async wrapper để tránh cảnh báo setState trong effect
    const initFetch = async () => {
      await refreshCount()
    }
    initFetch()
    
    const interval = setInterval(refreshCount, 60000)
    return () => clearInterval(interval)
  }, [refreshCount])

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
