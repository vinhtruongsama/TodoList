'use client'

import * as React from 'react'
import { Popover } from '@base-ui/react/popover'
import { MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContextMenuProps {
  trigger?: React.ReactNode
  onEdit?: () => void
  onDelete?: () => void
  onComplete?: () => void
  className?: string
}

export function ActionMenu({ trigger, onEdit, onDelete, onComplete, className }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger 
        className={cn(
          "p-2 hover:bg-accent rounded-xl transition-colors active:scale-90",
          className
        )}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {trigger || <MoreVertical className="w-5 h-5 text-muted-foreground" />}
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup className="z-[100] min-w-[160px] p-2 bg-card border rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 outline-none">
            <div className="flex flex-col gap-1">
              {onComplete && (
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onComplete(); setOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Đánh dấu hoàn thành
                </button>
              )}
              {onEdit && (
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); setOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-accent transition-colors text-left"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); setOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa mục này
                </button>
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
