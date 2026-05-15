import React from 'react'
import { getStudentReviews } from '@/services/reviews'
import { ReviewList } from '@/components/reviews/review-list'
import { MessageSquare, Star } from 'lucide-react'

export default async function StudentReviewsPage() {
  const reviews = await getStudentReviews()
  
  // Tính điểm trung bình
  const totalRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-10 pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nhận xét của Mentor</h1>
            <p className="text-muted-foreground">Những đánh giá và lời khuyên quý giá dành cho bạn.</p>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="flex gap-4">
            <div className="flex-1 bg-card border rounded-3xl p-6 shadow-sm text-center">
              <p className="text-4xl font-black text-primary mb-1">{averageRating}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Điểm trung bình</p>
            </div>
            <div className="flex-1 bg-card border rounded-3xl p-6 shadow-sm text-center">
              <p className="text-4xl font-black text-primary mb-1">{reviews.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tổng nhận xét</p>
            </div>
          </div>
        )}
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Tất cả nhận xét
          </h2>
        </div>

        <ReviewList reviews={reviews} />
      </section>
    </div>
  )
}
