"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Topbar } from "@/components/topbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
