'use client'

import React from 'react'
import { MobileBottomNav } from './mobile-bottom-nav'
import { DesktopSidebar } from './desktop-sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      {/* Sidebar - Desktop Only */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen transition-all duration-500">
        <div className="max-w-screen-2xl mx-auto pb-24 md:pb-12 pt-6">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <MobileBottomNav />
    </div>
  )
}
