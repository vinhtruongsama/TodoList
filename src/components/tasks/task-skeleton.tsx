import React from 'react'

export function TaskSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center p-4 rounded-2xl border bg-card animate-pulse">
          <div className="w-6 h-6 rounded-full bg-accent mr-4" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-accent rounded-md w-3/4" />
            <div className="h-3 bg-accent rounded-md w-1/4" />
          </div>
          <div className="w-5 h-5 bg-accent rounded-md ml-2" />
        </div>
      ))}
    </div>
  )
}
