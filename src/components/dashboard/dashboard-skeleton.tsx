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
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className={cn("h-40 rounded-[2.5rem]", i === 3 && "hidden md:block")} />
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 ml-1" />
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-3xl" />
          ))}
        </div>
      </div>

      {/* Goals Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 ml-1" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-44 rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    </div>
  )
}
