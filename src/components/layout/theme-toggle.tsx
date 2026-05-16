'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className={cn("w-9 h-9 rounded-lg bg-sidebar-accent/50 animate-pulse", className)} />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300",
        "bg-sidebar-accent border border-sidebar-border/50 hover:border-primary/40 group",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 overflow-hidden">
        <Sun 
          className={cn(
            "w-4 h-4 text-primary absolute transition-all duration-500",
            theme === 'dark' ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
          )} 
        />
        <Moon 
          className={cn(
            "w-4 h-4 text-primary absolute transition-all duration-500",
            theme === 'dark' ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )} 
        />
      </div>
    </button>
  )
}
