'use client'

import React, { useState } from 'react'
import { createGoal } from '@/services/goals'
import { Plus } from 'lucide-react'
import { VALIDATION } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface GoalFormProps {
  onSuccess?: () => void
}

import { useReliability } from '../providers/reliability-provider'

export function GoalForm({ onSuccess }: GoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const { addPendingAction, removePendingAction } = useReliability()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return

    if (cleanTitle.length > VALIDATION.TITLE_MAX_LENGTH) {
      toast.error(`Tiêu đề tối đa ${VALIDATION.TITLE_MAX_LENGTH} ký tự`)
      return
    }

    // PHASE 1: Instant feedback
    const actionId = `create-goal-${Date.now()}`
    setIsSubmitting(true)
    addPendingAction(actionId)

    onSuccess?.()
    setTitle('')

    // PHASE 2: Background sync
    try {
      const formData = new FormData()
      formData.append('title', cleanTitle)
      
      const result = await createGoal(formData)
      if (result.success) {
        toast.success('Mục tiêu lớn đã được ghi nhận thành công')
      } else {
        toast.error(`Lỗi tạo mục tiêu: ${result.error}.`, {
          action: { label: 'Thử lại', onClick: () => handleSubmit(e) }
        })
      }
    } catch (err) {
      toast.error('Không thể kết nối. Mục tiêu sẽ được thử lại sau.')
    } finally {
      setIsSubmitting(false)
      removePendingAction(actionId)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
        placeholder="Tạo mục tiêu lớn mới..."
        className="w-full h-14 pl-5 pr-16 rounded-2xl border bg-card shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all text-lg disabled:opacity-70"
      />
      <Button 
        type="submit" 
        loading={isSubmitting}
        disabled={!title.trim()}
        className="absolute right-2 top-2 h-10 w-10 rounded-xl p-0"
      >
        {!isSubmitting && <Plus className="w-6 h-6" />}
      </Button>
    </form>
  )
}
