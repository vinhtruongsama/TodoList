import React, { Suspense } from 'react'
import { getStudentSummary, getUserRole } from '@/services/dashboard'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentNotes } from '@/components/dashboard/recent-notes'
import { GoalItem } from '@/components/goals/goal-item'
import { LayoutGrid, Loader2 } from 'lucide-react'

export default async function DashboardPage() {
  const role = await getUserRole()

  if (role === 'mentor') {
    return (
      <div className="p-6 h-[80vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
          <LayoutGrid className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
        <p className="text-muted-foreground max-w-xs">
          Hệ thống đang được xây dựng. Vui lòng quay lại sau ở Phase 7!
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 pb-24">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xin chào! 👋</h1>
          <p className="text-muted-foreground">Hôm nay bạn học gì mới?</p>
        </div>
      </header>

      <Suspense fallback={<DashboardLoading />}>
        <StudentDashboardContent />
      </Suspense>
    </div>
  )
}

async function StudentDashboardContent() {
  const data = await getStudentSummary()

  return (
    <div className="space-y-10">
      {/* Thống kê nhanh */}
      <StatsCards stats={data.stats} />

      {/* Thao tác nhanh */}
      <QuickActions />

      {/* Mục tiêu đang chạy */}
      {data.activeGoals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold">Mục tiêu đang chạy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.activeGoals.map(goal => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      {/* Ghi chú mới nhất */}
      <RecentNotes notes={data.recentNotes} />
    </div>
  )
}

function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}
