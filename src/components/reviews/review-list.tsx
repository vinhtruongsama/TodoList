'use client'

import React from 'react'
import { MentorReview } from '@/types'
import { ReviewItem } from './review-item'
import { MessageSquareOff } from 'lucide-react'
import { deleteReview } from '@/services/reviews'

interface ReviewListProps {
  reviews: MentorReview[]
  isMentorView?: boolean
  currentUserId?: string
}

export function ReviewList({ reviews, isMentorView, currentUserId }: ReviewListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Xóa nhận xét này?')) return
    const studentId = reviews.find(r => r.id === id)?.student_id
    if (studentId) {
      await deleteReview(id, studentId)
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-accent/10 rounded-[2rem] border-2 border-dashed border-accent/30 flex flex-col items-center">
        <MessageSquareOff className="w-10 h-10 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground font-medium">Chưa có nhận xét nào.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem 
          key={review.id} 
          review={review} 
          isOwner={isMentorView && review.mentor_id === currentUserId}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
