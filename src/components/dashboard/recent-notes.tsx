import React from 'react'
import Link from 'next/link'
import { LearningNote } from '@/types'
import { StickyNote, ArrowRight } from 'lucide-react'

interface RecentNotesProps {
  notes: LearningNote[]
}

export function RecentNotes({ notes }: RecentNotesProps) {
  if (notes.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold">Ghi chú mới nhất</h2>
        <Link href="/notes" className="text-sm font-bold text-primary flex items-center gap-1">
          Tất cả <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {notes.map((note) => (
          <Link 
            key={note.id} 
            href="/notes"
            className="flex items-center p-4 rounded-2xl border bg-card hover:border-primary/50 transition-all shadow-sm group"
          >
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <StickyNote className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{note.title}</p>
              <p className="text-xs text-muted-foreground truncate">{note.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
