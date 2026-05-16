import React, { Suspense } from 'react'
import Link from 'next/link'
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
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 pb-32">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{formattedDate}</h1>
        <p className="text-sm text-muted-foreground">Chào buổi sáng, đây là tổng quan công việc của bạn.</p>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

async function DashboardContent() {
  const [role, data] = await Promise.all([
    getUserRole(),
    getStudentSummary()
  ])

  if (role === 'mentor') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-secondary/20 rounded-2xl border border-dashed">
        <LayoutGrid className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">Bảng điều khiển Mentor</h2>
        <p className="text-muted-foreground mt-1 max-w-xs">
          Tính năng dành cho Mentor đang được cập nhật.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Quick Stats Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Chỉ số hôm nay</h2>
          <QuickActionDrawer />
        </div>
        <div className="bg-card rounded-2xl border shadow-sm">
          <StatsCards stats={data.stats} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Content: Activity Feed */}
          <section className="space-y-6">
            <h2 className="text-lg font-bold">Hoạt động gần đây</h2>
            <Suspense fallback={<ActivitySkeleton />}>
              <MomentumFeed />
            </Suspense>
          </section>

          {/* Goals Section */}
          {data.activeGoals.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Mục tiêu quan trọng</h2>
                <Link href="/goals" className="text-sm font-semibold text-primary hover:underline">
                  Tất cả
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.activeGoals.slice(0, 4).map(goal => (
                  <GoalItem key={goal.id} goal={goal} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-12">
          {/* Notes Card */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Ghi chú</h2>
              <Link href="/notes" className="text-sm font-semibold text-primary hover:underline">
                Xem thêm
              </Link>
            </div>
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              <RecentNotes notes={data.recentNotes} />
            </div>
          </section>

          {/* Daily Quote / Insight */}
          <section className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-3">Lời khuyên</p>
            <p className="text-sm font-medium leading-relaxed italic">
              "Tập trung vào 3 nhiệm vụ quan trọng nhất mỗi ngày để đạt được tiến bộ bền vững nhất."
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
