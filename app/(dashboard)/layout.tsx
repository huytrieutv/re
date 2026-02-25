"use client"

import dynamic from "next/dynamic"
import { AppProvider } from "@/lib/app-context"
import { Toaster } from "sonner"

const AppShell = dynamic(() => import("@/components/app-shell").then((m) => m.AppShell), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary animate-pulse" />
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </div>
    </div>
  ),
})

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
      <Toaster position="top-right" richColors />
    </AppProvider>
  )
}
