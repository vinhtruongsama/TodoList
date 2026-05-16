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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/20 rounded-2xl border border-dashed border-border/60">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold">Sổ tay còn trống</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
          Hãy bắt đầu ghi lại những kiến thức và kinh nghiệm quý giá bạn đã học được ngay hôm nay.
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
