'use client'

import React from 'react'
import { Task } from '@/types'
import { TaskItem } from './task-item'
import { ClipboardList } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-accent/10 rounded-3xl border-2 border-dashed border-accent/30 flex flex-col items-center">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">Chưa có nhiệm vụ nào</h3>
        <p className="text-muted-foreground text-sm max-w-[240px]">
          Hãy thêm nhiệm vụ đầu tiên để bắt đầu ngày mới đầy năng suất!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
