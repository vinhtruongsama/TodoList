'use client'

import React, { useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-destructive" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Đã có lỗi xảy ra</h1>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Ứng dụng gặp sự cố bất ngờ. Chúng tôi xin lỗi vì sự bất tiện này.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button 
          onClick={() => reset()} 
          className="flex-1 h-12 rounded-2xl"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
        <Link 
          href="/" 
          className={cn(
            buttonVariants({ variant: 'outline' }),
            "flex-1 h-12 rounded-2xl flex items-center justify-center"
          )}
        >
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Link>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 bg-muted rounded-xl text-left overflow-auto max-w-full text-[10px] font-mono">
          {error.message}
        </div>
      )}
    </div>
  )
}
