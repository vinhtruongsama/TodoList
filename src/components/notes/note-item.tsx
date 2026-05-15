'use client'

import React from 'react'
import { deleteNote } from '@/services/notes'
import { LearningNote } from '@/types'
import { Calendar, Trash2, StickyNote } from 'lucide-react'

interface NoteItemProps {
  note: LearningNote
}

export function NoteItem({ note }: NoteItemProps) {
  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa ghi chú này?')) return
    await deleteNote(note.id)
  }

  return (
    <div className="p-6 rounded-3xl border bg-card shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
          <StickyNote className="w-5 h-5 text-orange-600" />
        </div>
        <button 
          onClick={handleDelete}
          className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-xl font-bold mb-2">{note.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 mb-4">
        {note.content}
      </p>

      <div className="flex items-center gap-4 pt-4 border-t border-accent/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {new Date(note.note_date).toLocaleDateString('vi-VN')}
        </div>
        {(note.task_id || note.goal_id) && (
          <div className="px-2 py-0.5 bg-accent rounded-md">
            Liên quan
          </div>
        )}
      </div>
    </div>
  )
}
