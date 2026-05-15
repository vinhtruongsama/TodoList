'use client'

import React, { useState } from 'react'
import { createTask } from '@/services/tasks'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VALIDATION } from '@/lib/constants'
import { toast } from 'sonner'

export function TaskForm() {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    
    if (cleanTitle.length > VALIDATION.TITLE_MAX_LENGTH) {
      toast.error(`Tiêu đề tối đa ${VALIDATION.TITLE_MAX_LENGTH} ký tự`)
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('title', cleanTitle)
    formData.append('priority', 'medium')
    
    const result = await createTask(formData)
    
    if (result.success) {
      setTitle('')
      toast.success('Đã thêm nhiệm vụ mới')
    } else {
      toast.error(result.error || 'Không thể thêm nhiệm vụ')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
        maxLength={100}
        placeholder="Thêm nhiệm vụ mới..."
        className="w-full h-14 pl-5 pr-16 rounded-2xl border bg-card shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all text-lg disabled:opacity-70"
      />
      <Button 
        type="submit" 
        loading={isSubmitting}
        disabled={!title.trim()}
        className="absolute right-2 top-2 h-10 w-10 rounded-xl p-0 transition-transform active:scale-90"
      >
        {!isSubmitting && <Plus className="w-6 h-6" />}
      </Button>
    </form>
  )
}
