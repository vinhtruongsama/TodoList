'use client'

import React from 'react'
import { Task } from '@/types'
import { TaskItem } from './task-item'
import { ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
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

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
