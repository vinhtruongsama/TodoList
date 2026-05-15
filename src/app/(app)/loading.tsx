import React from 'react'
import { Loader2 } from 'lucide-react'

export default function AppLoading() {
  return (
    <div className="h-[70vh] w-full flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-2xl"></div>
      </div>
      <p className="text-muted-foreground font-medium animate-pulse">Đang tải dữ liệu...</p>
    </div>
  )
}
