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

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/20 rounded-2xl border border-dashed border-border/60">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
          <ClipboardList className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold">Bắt đầu ngày mới của bạn</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[240px]">
          Hãy thêm những công việc cần làm đầu tiên để theo dõi tiến độ học tập.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Pending Tasks */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground px-1">
          Chờ thực hiện ({pendingTasks.length})
        </h3>
        
        {pendingTasks.length > 0 ? (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-sm font-medium text-primary">🎉 Tuyệt vời! Bạn đã hoàn thành tất cả nhiệm vụ.</p>
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full px-1 py-1 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <h3 className="text-sm font-bold text-muted-foreground/60">
              Đã hoàn thành ({completedTasks.length})
            </h3>
            {showCompleted ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
          </button>
          
          {showCompleted && (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="opacity-60">
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
