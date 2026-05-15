import React, { Suspense } from 'react'
import { getStudentSummary, getUserRole } from '@/services/dashboard'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActionDrawer } from '@/components/dashboard/quick-action-drawer'
import { RecentNotes } from '@/components/dashboard/recent-notes'
import { GoalItem } from '@/components/goals/goal-item'
import { LayoutGrid } from 'lucide-react'
import { DashboardSkeleton, ActivitySkeleton } from '@/components/dashboard/dashboard-skeleton'
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
      {/* Header-like Section for Stats */}
      <section className="space-y-6">
        <StatsCards stats={data.stats} />
        <QuickActionDrawer />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Feed Section (Left/Center on Desktop) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Dòng chảy tiến bộ (Momentum Engine) */}
          <Suspense fallback={<ActivitySkeleton />}>
            <MomentumFeed />
          </Suspense>

          {/* Mục tiêu đang chạy */}
          {data.activeGoals.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1 border-b pb-2 border-border/40">
                <h2 className="text-xl font-bold tracking-tight">Mục tiêu đang chạy</h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.activeGoals.slice(0, 4).map(goal => (
                  <GoalItem key={goal.id} goal={goal} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Secondary Info (Right Sidebar on Desktop) */}
        <div className="space-y-12">
          {/* Ghi chú mới nhất */}
          <section className="bg-secondary/10 rounded-[2.5rem] p-8 border border-border/40">
            <RecentNotes notes={data.recentNotes} />
          </section>

          {/* Productivity Tip or Small Static Card (Polish) */}
          <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Productivity Tip
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tập trung vào 3 nhiệm vụ quan trọng nhất mỗi ngày để đạt được đà tiến bộ bền vững nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
