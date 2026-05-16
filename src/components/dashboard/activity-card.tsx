import React from 'react'
import { AppActivity } from '@/types'
import { CheckCircle2, PenLine, FileText, Star, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface ActivityCardProps {
  activity: AppActivity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { type, metadata, created_at } = activity

  const config = {
    task_completed: {
      icon: CheckCircle2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      title: 'Hoàn thành nhiệm vụ',
      description: metadata.task_title || 'Nhiệm vụ không tên'
    },
    task_reflection: {
      icon: PenLine,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      title: 'Khoảnh khắc phản tư',
      description: metadata.task_title ? `Về: ${metadata.task_title}` : 'Ghi chép bài học'
    },
    note_created: {
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      title: 'Ghi chú học tập mới',
      description: metadata.note_title || 'Ghi chú không tiêu đề'
    },
    mentor_review_received: {
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      title: 'Lời khuyên từ Mentor',
      description: metadata.mentor_name ? `Nhận phản hồi từ: ${metadata.mentor_name}` : 'Mentor đã phản hồi nỗ lực của bạn'
    }
  }

  const currentConfig = config[type as keyof typeof config] || config.task_completed
  const Icon = currentConfig.icon

  return (
    <div className="group flex flex-col gap-2">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon className={cn("h-4 w-4 opacity-70", currentConfig.color)} />
          <h4 className="text-xs font-bold tracking-tight text-foreground/90">
            {currentConfig.title}
          </h4>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
          <Clock className="w-2.5 h-2.5" />
          {formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: vi })}
        </span>
      </div>

      {/* Main Content Box */}
      <div className="bg-card border border-border/40 rounded-xl p-3 shadow-sm hover:border-primary/20 transition-all">
        <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
          {currentConfig.description}
        </p>
        
        {(metadata.content_preview || metadata.comment_preview) && (
          <div className={cn(
            "mt-2 text-[12px] italic border-l-2 pl-3 py-1.5 line-clamp-2 rounded-r-md bg-secondary/30",
            metadata.comment_preview ? "border-yellow-500/30 text-foreground/80" : "border-primary/20 text-muted-foreground"
          )}>
            "{metadata.content_preview || metadata.comment_preview}..."
          </div>
        )}
      </div>
    </div>
  )
}
