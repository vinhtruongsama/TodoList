'use client'

import React, { useState } from 'react'
import { createNote } from '@/services/notes'
import { Plus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VALIDATION } from '@/lib/constants'

export function NoteForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createNote(formData)
    
    if (result.success) {
      setIsOpen(false)
    }
    setIsSubmitting(false)
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full h-14 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold shadow-none"
      >
        <Plus className="w-5 h-5 mr-2" />
        Viết ghi chú mới
      </Button>
    )
  }

  return (
    <div className="p-6 rounded-3xl border-2 border-primary bg-card shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Ghi chú mới</h3>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-accent rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tiêu đề</label>
          <input
            name="title"
            required
            maxLength={VALIDATION.TITLE_MAX_LENGTH}
            className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nội dung</label>
          <textarea
            name="content"
            required
            rows={5}
            placeholder="Bạn đã học được gì mới?..."
            className="w-full p-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-lg font-bold">
          {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Lưu ghi chú'}
        </Button>
      </form>
    </div>
  )
}
