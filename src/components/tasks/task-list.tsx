'use client'

import React, { useState } from 'react'
import { Task } from '@/types'
import { TaskItem } from './task-item'
import { ClipboardList, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const [showCompleted, setShowCompleted] = useState(false)

  if (tasks.length === 0) {
    return (
      <EmptyState 
        icon={ClipboardList}
        title="Chưa có nhiệm vụ nào"
        description="Hãy thêm nhiệm vụ đầu tiên để bắt đầu ngày mới đầy năng suất!"
        className="bg-accent/5 border-accent/20 py-16"
      />
    )
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Pending Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">
            Cần hoàn thành ({pendingTasks.length})
          </h3>
        </div>
        
        {pendingTasks.length > 0 ? (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-secondary/10 rounded-3xl border border-dashed">
            <p className="text-sm text-muted-foreground font-medium">🎉 Tuyệt vời! Bạn đã hoàn thành tất cả việc hôm nay.</p>
          </div>
        )}
      </div>

      {/* Completed Tasks - Collapsible to reduce friction */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full px-1 group outline-none"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
              Đã hoàn thành ({completedTasks.length})
            </h3>
            {showCompleted ? <ChevronUp className="w-4 h-4 text-muted-foreground/50" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/50" />}
          </button>
          
          {showCompleted && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              {completedTasks.map((task) => (
                <div key={task.id} className="opacity-60 grayscale-[0.5]">
                  <TaskItem task={task} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
