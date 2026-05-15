import React from 'react'
import { Goal } from '@/types'
import { GoalItem } from './goal-item'
import { Trophy } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface GoalListProps {
  goals: Goal[]
}

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <EmptyState 
        icon={Trophy}
        title="Chưa có mục tiêu lớn nào"
        description="Hãy bắt đầu bằng một mục tiêu tham vọng và chia nhỏ nó ra!"
        className="bg-primary/5 border-primary/20 py-20"
      />
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
