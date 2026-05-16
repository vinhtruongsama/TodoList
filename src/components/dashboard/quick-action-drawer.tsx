'use client'

import * as React from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { Plus, Target, StickyNote, X } from 'lucide-react'
import { TaskForm } from '../tasks/task-form'
import { GoalForm } from '../goals/goal-form'
import { NoteForm } from '../notes/note-form'
import { cn } from '@/lib/utils'

type ActionType = 'task' | 'goal' | 'note' | null

export function QuickActionDrawer() {
  const [open, setOpen] = React.useState(false)
  const [activeAction, setActiveAction] = React.useState<ActionType>(null)

  const actions = [
    { id: 'task', title: 'Nhiệm vụ', icon: Plus, color: 'bg-blue-500', description: 'Thêm việc cần làm hôm nay' },
    { id: 'goal', title: 'Mục tiêu', icon: Target, color: 'bg-purple-500', description: 'Thiết lập mục tiêu dài hạn' },
    { id: 'note', title: 'Ghi chú', icon: StickyNote, color: 'bg-orange-500', description: 'Lưu lại kiến thức mới' },
  ]

  const handleAction = (id: ActionType) => {
    setActiveAction(id)
  }

  const closeAll = () => {
    setOpen(false)
    setTimeout(() => setActiveAction(null), 300)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1 border-b border-border/10 pb-1">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Thao tác nhanh</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button 
            key={action.id}
            onClick={() => {
              setOpen(true)
              handleAction(action.id as ActionType)
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:bg-secondary/50 transition-all active:scale-95 group"
          >
            <action.icon className={cn("w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity", action.color.replace('bg-', 'text-'))} />
            <span className="text-[11px] font-bold tracking-tight">{action.title}</span>
          </button>
        ))}
      </div>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Drawer.Viewport>
            <Drawer.Popup className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-card rounded-t-[2.5rem] border-t shadow-2xl transition-transform duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full outline-none max-h-[90vh] overflow-hidden">
              
              {/* Handle for mobile feel */}
              <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mt-3 mb-2 shrink-0" />

              <div className="px-6 pb-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-card py-2 z-10">
                  <div className="flex items-center gap-3">
                    {activeAction && (
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                        actions.find(a => a.id === activeAction)?.color
                      )}>
                        {React.createElement(actions.find(a => a.id === activeAction)!.icon, { className: 'w-5 h-5' })}
                      </div>
                    )}
                    <Drawer.Title className="text-xl font-bold">
                      {activeAction === 'task' && 'Thêm nhiệm vụ'}
                      {activeAction === 'goal' && 'Tạo mục tiêu lớn'}
                      {activeAction === 'note' && 'Viết ghi chú mới'}
                    </Drawer.Title>
                  </div>
                  <Drawer.Close className="p-2 hover:bg-accent rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </Drawer.Close>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {activeAction === 'task' && <TaskForm onSuccess={closeAll} />}
                  {activeAction === 'goal' && <GoalForm onSuccess={closeAll} />}
                  {activeAction === 'note' && <NoteForm onSuccess={closeAll} />}
                </div>
              </div>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </section>
  )
}
