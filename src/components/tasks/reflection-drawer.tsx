'use client'

import React, { useState, useEffect } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { recordTaskReflection, recordSkippedReflection } from '@/services/task-history'
import { toast } from 'sonner'
import { Loader2, MessageSquareText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ReflectionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
  taskTitle: string
  onSaved?: () => void
  onSkipped?: () => void
}

export function ReflectionDrawer({
  open,
  onOpenChange,
  taskId,
  taskTitle,
  onSaved,
  onSkipped
}: ReflectionDrawerProps) {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)

  // Reset content when opening for a new task
  useEffect(() => {
    if (open) {
      setContent('')
    }
  }, [open, taskId])

  const handleSave = async () => {
    if (!content.trim() || isSaving) return

    setIsSaving(true)
    try {
      const result = await recordTaskReflection(taskId, content.trim())
      if (result.success) {
        toast.success('Ghi nhận sự tiến bộ của bạn thành công! ✨', {
          description: 'Hành trình của bạn đã được lưu vào nhật ký.'
        })
        onSaved?.()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Không thể lưu phản tư. Hãy thử lại.')
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Hãy kiểm tra kết nối mạng.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkip = async () => {
    if (isSkipping) return

    setIsSkipping(true)
    try {
      // Ghi nhận âm thầm việc bỏ qua
      await recordSkippedReflection(taskId)
      onSkipped?.()
      onOpenChange(false)
    } catch (error) {
      // Bỏ qua lỗi khi skip để không làm phiền người dùng
      onOpenChange(false)
    } finally {
      setIsSkipping(false)
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Drawer.Viewport>
          <Drawer.Popup className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-card rounded-t-[2.5rem] border-t shadow-2xl transition-transform duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full outline-none max-h-[90vh]">
            {/* Handle bar */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mt-4 mb-2" />
            
            <div className="px-6 pb-8 overflow-y-auto custom-scrollbar">
              <header className="flex items-start justify-between py-4">
                <div className="space-y-1 pr-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Learning Reflection</p>
                  <Drawer.Title className="text-xl font-bold tracking-tight leading-tight">
                    Bạn đã hoàn thành: <span className="text-foreground/70">{taskTitle}</span>
                  </Drawer.Title>
                </div>
                <Drawer.Close className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors focus:outline-none">
                  <X className="w-5 h-5" />
                </Drawer.Close>
              </header>

              <div className="space-y-6 mt-4">
                <div className="relative">
                  <div className="absolute left-4 top-4 text-primary/40">
                    <MessageSquareText className="w-5 h-5" />
                  </div>
                  <textarea
                    autoFocus
                    placeholder="Hôm nay bạn học được điều gì quan trọng? Có gì khó nhưng bạn đã vượt qua không?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[160px] pl-12 pr-4 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none text-base leading-relaxed tracking-tight"
                    maxLength={1000}
                  />
                  <div className="absolute right-4 bottom-4">
                    <span className={cn(
                      "text-[10px] font-bold tabular-nums px-2 py-1 rounded-md bg-white/50 dark:bg-black/20 border border-border/50",
                      content.length > 900 ? "text-destructive" : "text-muted-foreground/60"
                    )}>
                      {content.length}/1000
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={!content.trim() || isSaving || isSkipping}
                    className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Lưu lại sự tiến bộ"
                    )}
                  </Button>
                  
                  <button
                    type="button"
                    disabled={isSaving || isSkipping}
                    onClick={handleSkip}
                    className="h-12 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors active:scale-95 disabled:opacity-50"
                  >
                    Để sau
                  </button>
                </div>
              </div>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
