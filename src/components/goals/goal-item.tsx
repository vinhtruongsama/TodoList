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
      "relative transition-all duration-700 ease-in-out",
      isDeleting && "scale-95 opacity-0 grayscale pointer-events-none"
    )}>
      <Link 
        href={`/goals/${goal.id}`}
        className="group block bg-card border border-border shadow-sm rounded-2xl overflow-hidden transition-all active:scale-[0.98] hover:border-primary/40"
      >
        <div className="p-5 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mục tiêu</span>
              <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1">
                {goal.title}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 transition-colors group-hover:bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground">{Math.round(goal.progress_percent || 0)}%</span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Tiến độ</span>
              </div>
            </div>
            
            <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="absolute h-full left-0 top-0 bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${goal.progress_percent || 0}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
