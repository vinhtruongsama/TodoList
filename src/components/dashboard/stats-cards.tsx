import React from 'react'
import { CheckCircle2, ListTodo, Zap } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalTasks: number
    completedTasks: number
    progressPercent: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 px-8 py-6 rounded-xl bg-card border border-border shadow-sm">
      {/* Primary Progress */}
      <div className="flex items-center gap-6 flex-1 w-full">
        <Zap className="w-5 h-5 text-primary shrink-0 opacity-80" />
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 leading-none">Tiến độ hằng ngày</p>
            <span className="text-xs font-black text-primary/80">{stats.progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-secondary/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out" 
              style={{ width: `${stats.progressPercent}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Secondary Metrics - Naked text badges */}
      <div className="flex gap-4 shrink-0">
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-[10px] font-bold text-green-600/70 uppercase tracking-tighter">{stats.completedTasks}</span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">Xong</span>
        </div>
        <div className="w-px h-6 bg-border/40 hidden sm:block" />
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-[10px] font-bold text-blue-600/70 uppercase tracking-tighter">{stats.totalTasks}</span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">Tổng</span>
        </div>
      </div>
    </div>
  )
}
