'use client'

import React, { useState } from 'react'
import { createGoal } from '@/services/goals'
import { Plus, Loader2, Target } from 'lucide-react'
import { VALIDATION } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export function GoalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    if (title.length > VALIDATION.TITLE_MAX_LENGTH) {
      setError(`Tiêu đề tối đa ${VALIDATION.TITLE_MAX_LENGTH} ký tự`)
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('title', title)
    
    const result = await createGoal(formData)
    if (result.success) {
      setTitle('')
      setError('')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tạo mục tiêu lớn mới..."
        className="w-full h-14 pl-5 pr-16 rounded-2xl border bg-card shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all text-lg"
      />
      <Button 
        type="submit" 
        disabled={isSubmitting || !title.trim()}
        className="absolute right-2 top-2 h-10 w-10 rounded-xl p-0"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
      </Button>
    </form>
  )
}
