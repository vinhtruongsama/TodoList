'use client'

import React, { useState } from 'react'
import { createTask } from '@/services/tasks'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VALIDATION } from '@/lib/constants'

export function TaskForm() {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validation
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    if (cleanTitle.length > VALIDATION.TITLE_MAX_LENGTH) {
      setError(`Tiêu đề quá dài (tối đa ${VALIDATION.TITLE_MAX_LENGTH} ký tự)`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', cleanTitle)
    formData.append('priority', 'medium') // Mặc định là medium
    
    const result = await createTask(formData)
    
    if (result.success) {
      setTitle('')
    } else {
      setError(result.error || 'Có lỗi xảy ra')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError(null)
          }}
          disabled={isSubmitting}
          maxLength={100}
          placeholder="Thêm nhiệm vụ mới..."
          className="w-full h-14 pl-5 pr-16 rounded-2xl border bg-card shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all text-lg disabled:opacity-70"
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || !title.trim()}
          className="absolute right-2 top-2 h-10 w-10 rounded-xl p-0 transition-transform active:scale-90"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive px-2 font-medium">{error}</p>}
    </div>
  )
}
