"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  FileText,
  Zap,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Giao dịch", icon: ArrowLeftRight },
  { href: "/contacts", label: "Khách hàng", icon: Users },
  { href: "/documents", label: "Hồ sơ", icon: FileText },
  { href: "/smartplans", label: "SmartPlans", icon: Zap },
  { href: "/reports", label: "Báo cáo", icon: BarChart3 },
  { href: "/settings", label: "Cài đặt", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className={cn("flex items-center h-14 px-4 border-b border-sidebar-border", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary">
            <Building2 className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              RealOS
            </span>
          )}
        </div>

        <nav className="flex-1 py-3 px-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-foreground text-background text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <React.Fragment key={item.href}>{linkContent}</React.Fragment>
          })}
        </nav>

        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="ml-2 text-xs">Thu gọn</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
