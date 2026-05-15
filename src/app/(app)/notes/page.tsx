import React from 'react'
import { getNotes } from '@/services/notes'
import { NoteList } from '@/components/notes/note-list'
import { NoteForm } from '@/components/notes/note-form'
import { StickyNote } from 'lucide-react'

export default async function NotesPage() {
  const notes = await getNotes()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-orange-600 dark:text-orange-500">Sổ tay học tập</h1>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <StickyNote className="w-4 h-4 text-orange-400" />
          Nơi lưu giữ kiến thức và kinh nghiệm của bạn.
        </p>
      </header>

      <NoteForm />

      <section className="space-y-6">
        <h2 className="text-xl font-bold px-1">Ghi chú gần đây</h2>
        <NoteList notes={notes} />
      </section>
    </div>
  )
}
