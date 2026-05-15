'use client'

import React, { useState } from 'react'
import { createReview } from '@/services/reviews'
import { Star, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
  studentId: string
}

export function ReviewForm({ studentId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    setError('')

    const formData = new FormData()
    formData.append('studentId', studentId)
    formData.append('comment', comment)
    formData.append('rating', rating.toString())
    formData.append('targetType', 'dashboard')

    const result = await createReview(formData)
    if (result.success) {
      setComment('')
      setRating(5)
    } else {
      setError(result.error || 'Có lỗi xảy ra')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="bg-card border rounded-[2rem] p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Viết nhận xét tổng quan</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div className="flex gap-3 mb-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              className="focus:outline-none transition-transform active:scale-90 p-1"
              aria-label={`Đánh giá ${s} sao`}
            >
              <Star 
                className={cn(
                  "w-8 h-8 transition-colors",
                  s <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"
                )} 
              />
            </button>
          ))}
          <span className="ml-1 text-sm font-bold text-muted-foreground self-center bg-accent/30 px-3 py-1 rounded-full">
            {rating}/5 sao
          </span>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bạn thấy học viên này học tập thế nào? Hãy để lại lời khuyên..."
          className="w-full p-4 rounded-2xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all resize-none min-h-[120px] text-sm"
          required
        />

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}

        <Button 
          type="submit" 
          disabled={isSubmitting || !comment.trim()} 
          className="w-full h-12 rounded-xl font-bold"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          Gửi nhận xét
        </Button>
      </form>
    </div>
  )
}
