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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          maxLength={100}
          placeholder="Thêm nhiệm vụ mới..."
          className="w-full h-14 pl-5 pr-16 rounded-2xl border bg-card shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all text-lg disabled:opacity-70"
        />
        <Button 
          type="submit" 
          loading={isSubmitting}
          disabled={!title.trim()}
          className="absolute right-2 top-2 h-10 w-10 rounded-xl p-0 transition-transform active:scale-90"
        >
          {!isSubmitting && <Plus className="w-6 h-6" />}
        </Button>
      </form>

      {/* Goal & Priority Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 block ml-1">
            Gắn với Mục tiêu
          </label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/30 border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all appearance-none outline-none"
            >
              <option value="">Không gắn mục tiêu</option>
              {activeGoals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
          </div>
          {activeGoals.length === 0 && (
            <p className="text-[10px] text-muted-foreground mt-1 ml-1 italic">
              Tạo mục tiêu để liên kết tiến độ học tập.
            </p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 block ml-1">
            Độ ưu tiên
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  "flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all border",
                  priority === p 
                    ? p === 'high' ? "bg-red-500 text-white border-red-600 shadow-lg shadow-red-500/20" :
                      p === 'medium' ? "bg-orange-500 text-white border-orange-600 shadow-lg shadow-orange-500/20" :
                      "bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                    : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
