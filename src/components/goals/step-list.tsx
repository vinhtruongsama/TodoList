'use client'

import React, { useState } from 'react'
import { toggleStepStatus, createStep } from '@/services/goals'
import { GoalStep } from '@/types'
import { CheckCircle2, Circle, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StepListProps {
  goalId: string
  steps: GoalStep[]
}

export function StepList({ goalId, steps }: StepListProps) {
  const [newStep, setNewStep] = useState('')
  const [adding, setAdding] = useState(false)

  async function handleAddStep(e: React.FormEvent) {
    e.preventDefault()
    if (!newStep.trim()) return
    setAdding(true)
    await createStep(goalId, newStep)
    setNewStep('')
    setAdding(false)
  }

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Các bước thực hiện</h4>
      
      <div className="space-y-3">
        {steps.map((step) => (
          <StepItem key={step.id} step={step} />
        ))}
      </div>

      <form onSubmit={handleAddStep} className="flex gap-2">
        <input
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="Thêm bước tiếp theo..."
          className="flex-1 h-12 px-4 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
        />
        <Button size="icon" className="h-12 w-12 rounded-xl shrink-0" disabled={adding || !newStep.trim()}>
          {adding ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  )
}

function StepItem({ step }: { step: GoalStep }) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    await toggleStepStatus(step.id, step.status, step.goal_id)
    setIsToggling(false)
  }

  return (
    <div className={cn(
      "flex items-center p-4 rounded-2xl border transition-all",
      step.status === 'completed' ? "bg-green-50/50 border-green-100 opacity-70" : "bg-card shadow-sm"
    )}>
      <button 
        onClick={handleToggle}
        disabled={isToggling}
        className="mr-3 text-primary disabled:opacity-50"
      >
        {isToggling ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : step.status === 'completed' ? (
          <CheckCircle2 className="w-5 h-5 fill-primary text-white" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>
      <span className={cn(
        "font-medium",
        step.status === 'completed' && "line-through"
      )}>
        {step.title}
      </span>
    </div>
  )
}
