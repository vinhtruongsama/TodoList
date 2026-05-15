'use client'

import React from 'react'
import Link from 'next/link'
import { Goal } from '@/types'
import { ROUTES } from '@/lib/constants'
import { Target, ChevronRight } from 'lucide-react'

interface GoalItemProps {
  goal: Goal
}

export function GoalItem({ goal }: GoalItemProps) {
  return (
    <Link 
      href={`${ROUTES.GOALS}/${goal.id}`}
      className="block p-5 rounded-3xl border bg-card hover:border-primary/50 transition-all shadow-sm active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-bold mb-2 truncate">{goal.title}</h3>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
          <span className="text-muted-foreground">Tiến độ</span>
          <span className="text-primary">{goal.progress_percent}%</span>
        </div>
        <div className="h-3 w-full bg-accent rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${goal.progress_percent}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
