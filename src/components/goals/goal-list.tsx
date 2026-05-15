import React from 'react'
import { Goal } from '@/types'
import { GoalItem } from './goal-item'
import { Trophy } from 'lucide-react'

interface GoalListProps {
  goals: Goal[]
}

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-20 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20">
        <Trophy className="w-12 h-12 text-primary/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Chưa có mục tiêu lớn nào.</p>
        <p className="text-sm text-muted-foreground">Hãy bắt đầu bằng một mục tiêu tham vọng!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {goals.map((goal) => (
        <GoalItem key={goal.id} goal={goal} />
      ))}
    </div>
  )
}
