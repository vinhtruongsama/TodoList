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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[0_20px_50px_rgba(var(--primary),0.2)] flex flex-col justify-between aspect-square md:aspect-auto md:h-48 group hover:scale-[1.02] transition-transform duration-500">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm ring-1 ring-white/30">
          <Zap className="w-6 h-6 fill-white animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-5xl font-black tracking-tighter tabular-nums leading-none">{stats.progressPercent}<span className="text-xl font-medium opacity-60 ml-1">%</span></p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Day Progress</p>
        </div>
      </div>

      <div className="p-6 rounded-[2.5rem] bg-card/50 backdrop-blur-md border border-foreground/5 shadow-sm flex flex-col justify-between aspect-square md:aspect-auto md:h-48 group hover:border-primary/20 transition-all duration-500">
        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center ring-1 ring-green-500/20">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <div className="space-y-1">
          <p className="text-5xl font-black tracking-tighter tabular-nums leading-none">{stats.completedTasks}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Completed</p>
        </div>
      </div>

      <div className="p-6 rounded-[2.5rem] bg-card/50 backdrop-blur-md border border-foreground/5 shadow-sm flex flex-col justify-between hidden md:flex h-48 group hover:border-primary/20 transition-all duration-500">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center ring-1 ring-blue-500/20">
          <ListTodo className="w-6 h-6 text-blue-500" />
        </div>
        <div className="space-y-1">
          <p className="text-5xl font-black tracking-tighter tabular-nums leading-none">{stats.totalTasks}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Total Scope</p>
        </div>
      </div>
    </div>
  )
}
