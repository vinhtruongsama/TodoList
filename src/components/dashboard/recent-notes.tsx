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
      <div className="flex items-center justify-between px-1 border-b border-border/10 pb-1">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Ghi chú mới nhất</h2>
        <Link href="/notes" className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
          Tất cả <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {notes.map((note) => (
          <Link 
            key={note.id} 
            href="/notes"
            className="flex items-center p-4 rounded-2xl border bg-card hover:border-primary/50 transition-all shadow-sm group"
          >
            <StickyNote className="w-4 h-4 text-orange-500 mr-3 opacity-60 group-hover:opacity-100 shrink-0 transition-opacity" />
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
