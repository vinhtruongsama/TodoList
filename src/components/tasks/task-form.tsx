'use client'

import React, { useState, useEffect } from 'react'
import { createTask } from '@/services/tasks'
import { getActiveGoalsForSelect } from '@/services/goals'
import { Plus, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VALIDATION } from '@/lib/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

import { useReliability } from '../providers/reliability-provider'

interface TaskFormProps {
  onSuccess?: () => void
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedGoalId, setSelectedGoalId] = useState<string>('')
  const [activeGoals, setActiveGoals] = useState<{ id: string, title: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addPendingAction, removePendingAction } = useReliability()

  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch active goals for select
  useEffect(() => {
    async function loadGoals() {
      try {
        const goals = await getActiveGoalsForSelect()
        setActiveGoals(goals || [])
      } catch (error) {
        console.error('Failed to load goals:', error)
      }
    }
    loadGoals()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    
    if (cleanTitle.length > VALIDATION.TITLE_MAX_LENGTH) {
      toast.error(`Tiêu đề tối đa ${VALIDATION.TITLE_MAX_LENGTH} ký tự`)
      return
    }

    const actionId = `create-task-${Date.now()}`
    setIsSubmitting(true)
    addPendingAction(actionId)
    
    onSuccess?.()
    setTitle('')
    setIsExpanded(false) // Collapse after submit
    
    try {
      const formData = new FormData()
      formData.append('title', cleanTitle)
      formData.append('priority', priority)
      if (selectedGoalId) {
        formData.append('goal_id', selectedGoalId)
      }
      
      const result = await createTask(formData)
      
      if (result.success) {
        toast.success('Nhiệm vụ đã được lưu thành công')
      } else {
        toast.error(`Lỗi lưu: ${result.error}. Hãy kiểm tra kết nối mạng.`)
      }
    } catch (error) {
      toast.error('Lỗi kết nối. Nhiệm vụ sẽ được đồng bộ sau.')
    } finally {
      setIsSubmitting(false)
      removePendingAction(actionId)
    }
  }

  return (
    <div className={cn(
      "space-y-4 bg-card rounded-[2.5rem] p-3 border shadow-sm transition-all duration-500",
      isExpanded ? "ring-2 ring-primary/20 border-primary/20 p-6" : "hover:border-primary/20"
    )}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          disabled={isSubmitting}
          maxLength={100}
          placeholder="Hôm nay bạn muốn đạt được điều gì?"
          className="w-full h-12 pl-4 pr-14 rounded-2xl bg-transparent focus:ring-0 outline-none transition-all text-lg font-medium placeholder:text-muted-foreground/40 disabled:opacity-70"
        />
        <Button 
          type="submit" 
          loading={isSubmitting}
          disabled={!title.trim()}
          className="absolute right-1 top-1 h-10 w-10 rounded-xl p-0 transition-transform active:scale-90"
        >
          {!isSubmitting && <Plus className="w-5 h-5" />}
        </Button>
      </form>

      {/* Goal & Priority Selectors - Revealed on expansion */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block ml-1">
              Gắn với Mục tiêu
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/40 border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none outline-none cursor-pointer"
              >
                <option value="">Không gắn mục tiêu</option>
                {activeGoals.map(goal => (
                  <option key={goal.id} value={goal.id}>{goal.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block ml-1">
              Độ ưu tiên
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border outline-none",
                    priority === p 
                      ? p === 'high' ? "bg-red-500 text-white border-red-600 shadow-md shadow-red-500/10" :
                        p === 'medium' ? "bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/10" :
                        "bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/10"
                      : "bg-secondary/40 border-transparent text-muted-foreground/60 hover:bg-secondary/60"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
