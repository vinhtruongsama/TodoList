import React from 'react'
import Link from 'next/link'
import { Plus, Target, StickyNote } from 'lucide-react'

import { ROUTES } from '@/lib/constants'

export function QuickActions() {
  const actions = [
    { title: 'Thêm Task', href: ROUTES.TASKS, icon: Plus, color: 'bg-blue-500' },
    { title: 'Tạo Goal', href: ROUTES.GOALS, icon: Target, color: 'bg-purple-500' },
    { title: 'Viết Note', href: ROUTES.NOTES, icon: StickyNote, color: 'bg-orange-500' },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold">Thao tác nhanh</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
        {actions.map((action) => (
          <Link 
            key={action.title}
            href={action.href}
            className="flex-shrink-0 w-32 h-32 p-4 rounded-3xl bg-card border shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all active:scale-95"
          >
            <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white`}>
              <action.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold">{action.title}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
