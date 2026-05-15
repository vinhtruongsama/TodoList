import React from 'react'
import { LearningNote } from '@/types'
import { NoteItem } from './note-item'
import { BookOpen } from 'lucide-react'

interface NoteListProps {
  notes: LearningNote[]
}

export function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-20 bg-orange-50/50 rounded-3xl border-2 border-dashed border-orange-200/50 flex flex-col items-center">
        <BookOpen className="w-12 h-12 text-orange-200 mb-4" />
        <p className="text-muted-foreground font-medium">Chưa có ghi chú nào.</p>
        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
          Hãy bắt đầu ghi lại những kiến thức quý giá bạn vừa học được!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  )
}
