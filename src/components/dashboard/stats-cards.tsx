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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="p-5 rounded-[2rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex flex-col justify-between aspect-square md:aspect-auto md:h-40">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 fill-white" />
        </div>
        <div>
          <p className="text-3xl font-black">{stats.progressPercent}%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Tiến độ ngày</p>
        </div>
      </div>

      <div className="p-5 rounded-[2rem] bg-card border shadow-sm flex flex-col justify-between aspect-square md:aspect-auto md:h-40">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-3xl font-black">{stats.completedTasks}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Đã xong</p>
        </div>
      </div>

      <div className="p-5 rounded-[2rem] bg-card border shadow-sm flex flex-col justify-between hidden md:flex h-40">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <ListTodo className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-3xl font-black">{stats.totalTasks}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tổng task hôm nay</p>
        </div>
      </div>
    </div>
  )
}
