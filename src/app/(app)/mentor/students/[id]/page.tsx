import React from 'react'
import Link from 'next/link'
import { getStudentSummary } from '@/services/dashboard'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentNotes } from '@/components/dashboard/recent-notes'
import { GoalItem } from '@/components/goals/goal-item'
import { ReviewForm } from '@/components/reviews/review-form'
import { ReviewList } from '@/components/reviews/review-list'
import { getReviewsByStudentId } from '@/services/reviews'
import { ChevronLeft, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants'

export default async function MentorStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  // 1. Kiểm tra xem Mentor có quyền xem student này không
  const { data: link, error: linkError } = await supabase
    .from('mentor_student_links')
    .select('id')
    .eq('student_id', id)
    .eq('status', 'accepted')
    .single()

  if (linkError || !link) {
    return (
      <div className="p-10 text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Truy cập bị từ chối</h1>
        <p className="text-muted-foreground">Bạn không có quyền xem dữ liệu của học viên này hoặc kết nối đã bị hủy.</p>
        <Link href={ROUTES.MENTOR_STUDENTS} className="text-primary font-bold block mt-4 underline">Quay lại danh sách</Link>
      </div>
    )
  }

  // 2. Lấy tên student
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', id)
    .single()

  const data = await getStudentSummary(id)
  const reviews = await getReviewsByStudentId(id)
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b">
        <div className="p-4 flex items-center gap-4 max-w-4xl mx-auto">
          <Link href={ROUTES.MENTOR_STUDENTS} className="p-2 hover:bg-accent rounded-full transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 font-bold truncate">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            {profile?.full_name || 'Học viên'}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-10 pb-24">
        <header>
          <p className="text-muted-foreground">Theo dõi tiến trình học tập của học viên.</p>
        </header>

        {/* Thống kê nhanh */}
        <StatsCards stats={data.stats} />

        {/* Mục tiêu đang chạy */}
        {data.activeGoals.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Mục tiêu đang chạy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.activeGoals.map(goal => (
                <GoalItem key={goal.id} goal={goal} />
              ))}
            </div>
          </section>
        )}

        {/* Ghi chú mới nhất */}
        <RecentNotes notes={data.recentNotes} />

        {/* Reviews Section */}
        <section className="space-y-6 pt-6 border-t">
          <h2 className="text-2xl font-bold">Nhận xét & Đánh giá</h2>
          <ReviewForm studentId={id} />
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-muted-foreground">Lịch sử nhận xét</h3>
            <ReviewList reviews={reviews} isMentorView currentUserId={user?.id} />
          </div>
        </section>
      </div>
    </div>
  )
}
