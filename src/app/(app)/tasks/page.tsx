import React, { Suspense } from 'react'
import { getTodayTasks } from '@/services/tasks'
import { TaskForm } from '@/components/tasks/task-form'
import { TaskList } from '@/components/tasks/task-list'
import { TaskSkeleton } from '@/components/tasks/task-skeleton'
import { Calendar } from 'lucide-react'

// Đây là Server Component - Tải dữ liệu từ server cực nhanh
export default async function TasksPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Nhiệm vụ hôm nay</h1>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </header>

      {/* Form thêm task - Client Component */}
      <TaskForm />

      {/* Danh sách task - Tách biệt logic tải dữ liệu bằng Suspense */}
      <Suspense fallback={<TaskSkeleton />}>
        <TaskContent />
      </Suspense>
    </div>
  )
}

async function TaskContent() {
  const tasks = await getTodayTasks()
  
  // Trả về danh sách - TaskList cũng là Client Component để xử lý tương tác
  return <TaskList tasks={tasks} />
}
