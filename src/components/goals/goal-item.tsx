'use client'

import React from 'react'
import Link from 'next/link'
import { Goal } from '@/types'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { Target, ChevronRight, Loader2 } from 'lucide-react'
import { ActionMenu } from '../shared/action-menu'
import { deleteGoal } from '@/services/goals'
import { toast } from 'sonner'

interface GoalItemProps {
  goal: Goal
}

export function GoalItem({ goal }: GoalItemProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!confirm('Xóa mục tiêu này sẽ xóa toàn bộ các bước liên quan. Bạn chắc chứ?')) return
    setIsDeleting(true)
    try {
      // Import from goals service actually
      const { deleteGoal } = await import('@/services/goals')
      const res = await deleteGoal(goal.id)
      if (res.error) {
        toast.error(res.error)
        setIsDeleting(false)
      } else {
        toast.success('Đã xóa mục tiêu')
      }
    } catch (e) {
      toast.error('Lỗi hệ thống')
      setIsDeleting(false)
    }
  }

  return (
    <div className={cn(
      "relative transition-all duration-300",
      isDeleting && "scale-95 opacity-0 grayscale pointer-events-none"
    )}>
      <Link 
        href={`${ROUTES.GOALS}/${goal.id}`}
        className="block p-5 rounded-3xl border bg-card hover:border-primary/50 transition-all shadow-sm active:scale-[0.98]"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            {isDeleting ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <Target className="w-6 h-6 text-primary" />}
          </div>
          <div className="flex items-center gap-1">
            <ActionMenu 
              onDelete={handleDelete}
              onEdit={() => toast.info('Tính năng chỉnh sửa đang phát triển')}
            />
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <h3 className="text-lg font-bold tracking-tight mb-2 truncate group-hover:text-primary transition-colors">{goal.title}</h3>
        
        {/* Progress Bar - Liquid Style */}
        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Completion</span>
              <p className="text-2xl font-black tracking-tighter tabular-nums leading-none">
                {goal.progress_percent}<span className="text-sm font-medium text-muted-foreground/60 ml-0.5">%</span>
              </p>
            </div>
          </div>
          <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(var(--primary),0.3)]" 
              style={{ width: `${goal.progress_percent}%` }}
            />
          </div>
        </div>
      </Link>
    </div>
  )
}
