import React from 'react'
import { getMomentumFeed } from '@/services/activities'
import { ActivityCard } from './activity-card'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function MomentumFeed() {
  const result = await getMomentumFeed(undefined, 8)
  
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Dòng chảy tiến bộ
          </h2>
        </div>
        <div className="bg-secondary/20 rounded-3xl p-10 text-center space-y-4 border border-dashed">
          <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">Bắt đầu hành trình của bạn</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Mỗi nhiệm vụ hoàn thành, mỗi phản tư đều là một dấu mốc trưởng thành. Hãy bắt đầu ngay hôm nay!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Dòng chảy tiến bộ
          </h2>
          <p className="text-xs text-muted-foreground font-medium">Bằng chứng cho sự nỗ lực không ngừng của bạn</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5">
          Xem tất cả <ArrowRight className="ml-2 w-3 h-3" />
        </Button>
      </div>

      <div className="relative pl-2">
        {result.data.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  )
}
