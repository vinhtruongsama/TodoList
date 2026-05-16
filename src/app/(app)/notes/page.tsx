import React from 'react'
import { getNotes } from '@/services/notes'
import { NoteList } from '@/components/notes/note-list'
import { NoteForm } from '@/components/notes/note-form'
import { StickyNote } from 'lucide-react'

export default async function NotesPage() {
  const notes = await getNotes()

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 pb-32">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sổ tay học tập</h1>
        <p className="text-sm text-muted-foreground">
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
