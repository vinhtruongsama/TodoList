'use client'

import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Stats & Actions Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
        <div className="lg:col-span-3">
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-1 space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Momentum Skeleton */}
          <ActivitySkeleton />

          {/* Goals Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/10 pb-1">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-12">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-1 border-b border-border/10 pb-1">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-8 pl-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/40">
        {[1, 2].map((i) => (
          <div key={i} className="relative pl-6 space-y-3">
            <div className="absolute left-[-29px] top-1.5 w-2 h-2 rounded-full bg-muted ring-4 ring-background z-10" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
