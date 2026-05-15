'use client'

import React from 'react'
import { MobileBottomNav } from './mobile-bottom-nav'
import { DesktopSidebar } from './desktop-sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop Only */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <MobileBottomNav />
    </div>
  )
}
