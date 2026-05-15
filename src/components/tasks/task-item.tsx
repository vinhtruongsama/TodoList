'use client'

import React, { useState } from 'react'
import { toggleTaskStatus, deleteTask } from '@/services/tasks'
import { Task } from '@/types'
import { CheckCircle2, Circle, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRIORITY_COLORS } from '@/lib/constants'

import { toast } from 'sonner'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [optimisticStatus, setOptimisticStatus] = useState(task.status)

  const handleToggle = async () => {
    const newStatus = optimisticStatus === 'completed' ? 'pending' : 'completed'
    setOptimisticStatus(newStatus)
    setIsToggling(true)
    
    try {
      const result = await toggleTaskStatus(task.id, task.status)
      if (result && 'error' in result && result.error) {
        setOptimisticStatus(task.status) // Rollback
        toast.error(result.error)
      }
    } catch (error) {
      setOptimisticStatus(task.status) // Rollback
      toast.error('Không thể kết nối máy chủ')
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa nhiệm vụ này?')) return
    setIsDeleting(true)
    const result = await deleteTask(task.id)
    if (result && 'error' in result && result.error) {
      toast.error(result.error)
      setIsDeleting(false)
    } else {
      toast.success('Đã xóa nhiệm vụ')
    }
  }

  return (
    <div 
      className={cn(
        "flex items-center p-4 rounded-2xl border bg-card transition-all group",
        optimisticStatus === 'completed' ? "opacity-60 bg-accent/30" : "hover:border-primary/50 shadow-sm",
        isDeleting && "scale-95 opacity-50"
      )}
    >
      <button 
        disabled={isToggling || isDeleting}
        onClick={handleToggle}
        className="mr-4 text-primary hover:scale-110 transition-transform disabled:opacity-50"
      >
        {isToggling ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : optimisticStatus === 'completed' ? (
          <CheckCircle2 className="w-6 h-6 fill-primary text-white" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-semibold text-lg truncate",
          optimisticStatus === 'completed' && "line-through decoration-2"
        )}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
            PRIORITY_COLORS[task.priority]
          )}>
            {task.priority}
          </span>
        </div>
      </div>

      <button 
        disabled={isDeleting}
        onClick={handleDelete}
        className="ml-2 p-3 text-muted-foreground hover:text-destructive md:opacity-0 md:group-hover:opacity-100 transition-all active:scale-90"
      >
        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
      </button>
    </div>
  )
}
