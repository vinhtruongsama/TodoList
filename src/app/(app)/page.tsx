import React, { Suspense } from 'react'
import { getStudentSummary, getUserRole } from '@/services/dashboard'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActionDrawer } from '@/components/dashboard/quick-action-drawer'
import { RecentNotes } from '@/components/dashboard/recent-notes'
import { GoalItem } from '@/components/goals/goal-item'
import { LayoutGrid } from 'lucide-react'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { MomentumFeed } from '@/components/dashboard/momentum-feed'

export default async function DashboardPage() {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12 pb-40">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="animate-in fade-in slide-in-from-left-4 duration-1000">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Workspace Overview</p>
          <h1 className="text-4xl font-black tracking-tighter">Chào buổi sáng! 👋</h1>
          <p className="text-muted-foreground mt-1 font-medium">{formattedDate}</p>
        </div>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

async function DashboardContent() {
  // Fetch song song để tối ưu tốc độ
  const [role, data] = await Promise.all([
    getUserRole(),
    getStudentSummary()
  ])

  if (role === 'mentor') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Thống kê nhanh */}
      <StatsCards stats={data.stats} />

      {/* Thao tác nhanh */}
      <QuickActionDrawer />

      {/* Dòng chảy tiến bộ (Momentum Engine) */}
      <Suspense fallback={<div className="h-40 bg-secondary/10 animate-pulse rounded-3xl" />}>
        <MomentumFeed />
      </Suspense>

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
