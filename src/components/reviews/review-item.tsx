'use client'

import React from 'react'
import { MentorReview } from '@/types'
import { MessageSquare, Star, Trash2 } from 'lucide-react'

interface ReviewItemProps {
  review: MentorReview
  isOwner?: boolean
  onDelete?: (id: string) => void
}

export function ReviewItem({ review, isOwner, onDelete }: ReviewItemProps) {
  const mentorName = review.profiles?.full_name || 'Mentor'
  const date = new Date(review.created_at).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="p-6 rounded-[2rem] border bg-card shadow-sm hover:shadow-md transition-all relative group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">{mentorName}</h4>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{date}</p>
          </div>
        </div>

        {review.rating && (
          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/30">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{review.rating}</span>
          </div>
        )}
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap italic">
        &quot;{review.comment}&quot;
      </p>

      {isOwner && onDelete && (
        <button 
          onClick={() => onDelete(review.id)}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Target Tag */}
      {review.target_type !== 'dashboard' && (
        <div className="mt-4 flex">
          <span className="text-[9px] px-2 py-0.5 bg-accent rounded-md font-bold uppercase tracking-wider text-muted-foreground">
            {review.target_type} Review
          </span>
        </div>
      )}
    </div>
  )
}
