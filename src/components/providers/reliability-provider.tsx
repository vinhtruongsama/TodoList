'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { WifiOff, RefreshCw } from 'lucide-react'

interface ReliabilityContextType {
  isOffline: boolean
  pendingCount: number
  addPendingAction: (id: string) => void
  removePendingAction: (id: string) => void
}

const ReliabilityContext = createContext<ReliabilityContextType | undefined>(undefined)

export function ReliabilityProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false)
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      toast.success('Đã khôi phục kết nối mạng', { icon: '🌐' })
    }
    const handleOffline = () => {
      setIsOffline(true)
      toast.error('Mất kết nối mạng. Các thay đổi sẽ được đồng bộ khi có mạng lại.', { 
        duration: Infinity,
        icon: <WifiOff className="w-4 h-4" />
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOffline(!window.navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const addPendingAction = (id: string) => {
    setPendingActions(prev => new Set(prev).add(id))
  }

  const removePendingAction = (id: string) => {
    setPendingActions(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <ReliabilityContext.Provider value={{ 
      isOffline, 
      pendingCount: pendingActions.size,
      addPendingAction,
      removePendingAction
    }}>
      {children}
      
      {/* Global Sync Indicator */}
      {pendingActions.size > 0 && (
        <div className="fixed top-4 right-4 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 font-bold text-xs uppercase tracking-widest">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Đang đồng bộ ({pendingActions.size})
        </div>
      )}
    </ReliabilityContext.Provider>
  )
}

export const useReliability = () => {
  const context = useContext(ReliabilityContext)
  if (!context) throw new Error('useReliability must be used within ReliabilityProvider')
  return context
}
