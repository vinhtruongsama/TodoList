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
      description: metadata.mentor_name ? `Từ: ${metadata.mentor_name}` : 'Mentor đã phản hồi'
    }
  }

  const currentConfig = config[type as keyof typeof config] || config.task_completed
  const Icon = currentConfig.icon

  return (
    <div className="group relative flex gap-4 pb-8 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-border/40 group-last:hidden" />
      
      {/* Icon Node */}
      <div className={cn(
        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
        currentConfig.bgColor
      )}>
        <Icon className={cn("h-5 w-5", currentConfig.color)} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold tracking-tight text-foreground/90">
            {currentConfig.title}
          </h4>
          <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
            <Clock className="w-2.5 h-2.5" />
            {formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: vi })}
          </span>
        </div>

        <div className="bg-card/50 border rounded-2xl p-4 shadow-sm group-hover:shadow-md transition-all">
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {currentConfig.description}
          </p>
          
          {metadata.content_preview && (
            <div className="mt-3 text-sm text-foreground/80 italic border-l-2 border-primary/20 pl-3 py-1 line-clamp-2 bg-primary/5 rounded-r-lg">
              "{metadata.content_preview}..."
            </div>
          )}

          {metadata.comment_preview && (
            <div className="mt-3 text-sm text-foreground/80 font-medium border-l-2 border-yellow-500/20 pl-3 py-1 line-clamp-2 bg-yellow-500/5 rounded-r-lg">
              "{metadata.comment_preview}..."
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
