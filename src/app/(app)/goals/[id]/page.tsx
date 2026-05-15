import React from 'react'
import Link from 'next/link'
import { getGoalWithSteps } from '@/services/goals'
import { StepList } from '@/components/goals/step-list'
import { ChevronLeft, Target, Calendar } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { goal, steps } = await getGoalWithSteps(id)

  return (
    <div className="min-h-screen bg-accent/5">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b">
        <div className="p-4 flex items-center gap-4 max-w-2xl mx-auto">
          <Link href={ROUTES.GOALS} className="p-2 hover:bg-accent rounded-full transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-xl font-bold truncate">Chi tiết mục tiêu</h2>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Goal Banner */}
        <section className="bg-primary rounded-[2.5rem] p-8 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold mb-3">{goal.title}</h1>
            <p className="opacity-90 text-lg mb-6 leading-relaxed">
              {goal.description || "Hãy bắt đầu bằng cách thêm các bước nhỏ để đạt được mục tiêu này!"}
            </p>
            
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <Calendar className="w-4 h-4" />
                {new Date(goal.start_date).toLocaleDateString('vi-VN')}
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-full font-bold">
                {goal.progress_percent}%
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mb-32" />
        </section>

        {/* Steps Section */}
        <StepList goalId={goal.id} steps={steps} />
      </div>
    </div>
  )
}
