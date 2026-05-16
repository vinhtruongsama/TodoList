import React from 'react'
import { getMomentumFeed } from '@/services/activities'
import { ActivityCard } from './activity-card'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function MomentumFeed() {
  const result = await getMomentumFeed(undefined, 8)
  
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1 border-b border-border/10 pb-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Dòng chảy tiến bộ</h2>
          </div>
        </div>
        <div className="px-6 py-10 rounded-xl border border-dashed border-border/60 bg-secondary/5 flex flex-col items-center text-center space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-bold tracking-tight">Sẵn sàng để bứt phá?</p>
            <p className="text-[11px] text-muted-foreground max-w-[200px] leading-relaxed">
              Hoàn thành nhiệm vụ đầu tiên của bạn để kích hoạt dòng chảy tiến bộ.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between px-1 border-b border-border/40 pb-1">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Dòng chảy tiến bộ</h2>
        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5 px-2">
          Tất cả <ArrowRight className="ml-1.5 w-3 h-3" />
        </Button>
      </div>

      <div className="relative pl-4 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
        {result.data.map((activity) => (
          <div key={activity.id} className="relative pl-6">
            <div className="absolute left-[-29px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background z-10" />
            <ActivityCard activity={activity} />
          </div>
        ))}
      </div>
    </section>
  )
}
