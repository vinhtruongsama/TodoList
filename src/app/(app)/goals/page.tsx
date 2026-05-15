import React from 'react'
import { getGoals } from '@/services/goals'
import { GoalList } from '@/components/goals/goal-list'
import { GoalForm } from '@/components/goals/goal-form'
import { Trophy } from 'lucide-react'

export default async function GoalsPage() {
  const goals = await getGoals()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Mục tiêu của tôi</h1>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Kế hoạch dài hạn và lộ trình phát triển.
        </p>
      </header>

      <GoalForm />

      <GoalList goals={goals} />
    </div>
  )
}
