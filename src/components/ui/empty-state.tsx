import React from 'react'
import { LucideIcon, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  className?: string
}

export function EmptyState({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-10 text-center space-y-4 border-2 border-dashed rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500",
      className
    )}>
      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
        <Icon className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          {description}
        </p>
      </div>
    </div>
  )
}
