'use client'

import React, { useState } from 'react'
import { toggleTaskStatus, deleteTask } from '@/services/tasks'
import { recordTaskCompleted, recordTaskEvent } from '@/services/task-history'
import { Task } from '@/types'
import { CheckCircle2, Circle, Trash2, Loader2, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRIORITY_COLORS } from '@/lib/constants'
import { hapticFeedback } from '@/lib/haptic'
import { ReflectionDrawer } from './reflection-drawer'

import { toast } from 'sonner'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [optimisticStatus, setOptimisticStatus] = useState(task.status)
  const [isReflectionOpen, setIsReflectionOpen] = useState(false)
  
  // Gesture State
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  const handleToggle = async () => {
    if (isSwiping || isToggling) return
    const isCompleting = optimisticStatus === 'pending'
    const newStatus = isCompleting ? 'completed' : 'pending'
    
    setOptimisticStatus(newStatus)
    setIsToggling(true)
    hapticFeedback('light')
    
    try {
      const result = await toggleTaskStatus(task.id, optimisticStatus)
      if (result && 'error' in result && result.error) {
        setOptimisticStatus(task.status)
        toast.error(result.error)
      } else {
        if (isCompleting) {
          hapticFeedback('success')
          
          // Ghi nhận lịch sử hoàn thành (Background)
          recordTaskCompleted(task.id).catch(err => {
            console.error('Failed to record task completion history:', err)
          })

          // Quy tắc MVP: Mở Reflection Drawer cho các task liên kết Goal hoặc High Priority
          if (task.priority === 'high' || task.goal_id) {
            setIsReflectionOpen(true)
          }
        } else {
          // Ghi nhận sự kiện Reopened nếu người dùng uncheck
          recordTaskEvent({ task_id: task.id, event_type: 'reopened' }).catch(() => {})
        }
      }
    } catch (error) {
      setOptimisticStatus(task.status)
      toast.error('Không thể kết nối máy chủ')
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    hapticFeedback('medium')
    const result = await deleteTask(task.id)
    if (result && 'error' in result && result.error) {
      toast.error(result.error)
      setIsDeleting(false)
      setSwipeOffset(0)
    } else {
      toast.success('Đã xóa nhiệm vụ')
    }
  }

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsSwiping(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const currentTouch = e.targetTouches[0].clientX
    const diff = currentTouch - touchStart
    
    // Chỉ swipe sang trái (delete)
    if (diff < 0) {
      setIsSwiping(true)
      // Thêm lực cản (Resistance) khi vuốt quá sâu
      const offset = diff < -120 ? -120 + (diff + 120) * 0.2 : diff
      setSwipeOffset(offset)
    }
  }

  const onTouchEnd = () => {
    setTouchStart(null)
    if (swipeOffset < -80) {
      handleDelete()
    } else {
      setSwipeOffset(0)
      setIsSwiping(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Delete Background Action */}
      <div 
        className={cn(
          "absolute inset-0 bg-destructive flex items-center justify-end px-6 transition-opacity",
          swipeOffset < 0 ? "opacity-100" : "opacity-0"
        )}
      >
        <div className={cn(
          "transition-transform duration-200",
          swipeOffset < -80 ? "scale-125" : "scale-100"
        )}>
          <Trash2 className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        className={cn(
          "relative flex items-center p-4 border bg-card transition-all will-change-transform",
          !isSwiping && "transition-[transform] duration-300 ease-out",
          optimisticStatus === 'completed' ? "opacity-60 bg-accent/30" : "shadow-sm",
          isDeleting && "scale-95 opacity-0"
        )}
      >
        <button 
          disabled={isToggling || isDeleting}
          onClick={handleToggle}
          className="mr-4 text-primary transition-transform active:scale-125 disabled:opacity-50 shrink-0"
        >
          {isToggling ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : optimisticStatus === 'completed' ? (
            <CheckCircle2 className="w-6 h-6 fill-primary text-white" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-semibold text-[15px] tracking-tight truncate",
            optimisticStatus === 'completed' ? "text-muted-foreground line-through decoration-1" : "text-foreground"
          )}>
            {task.title}
          </p>
          <div className="flex items-center gap-3 mt-1 text-[11px] font-medium">
            <span className={cn(
              "px-1.5 py-0.5 rounded-md border",
              task.priority === 'high' ? "bg-red-50 text-red-600 border-red-200" :
              task.priority === 'medium' ? "bg-orange-50 text-orange-600 border-orange-200" :
              "bg-blue-50 text-blue-600 border-blue-200"
            )}>
              {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
            </span>
            {task.goal_id && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                <Target className="w-3 h-3" />
                Mục tiêu
              </span>
            )}
            <span className="text-muted-foreground/60">{new Date(task.updated_at).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        {/* Desktop Delete Button (only visible on desktop hover) */}
        <button 
          disabled={isDeleting}
          onClick={handleDelete}
          className="hidden md:flex ml-2 p-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all active:scale-90"
        >
          {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Reflection Anchor */}
      <ReflectionDrawer 
        open={isReflectionOpen}
        onOpenChange={setIsReflectionOpen}
        taskId={task.id}
        taskTitle={task.title}
      />
    </div>
  )
}
