"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  Bell,
  Plus,
  Menu,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  FileText,
  Zap,
  BarChart3,
  Settings,
  Building2,
  User,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/lib/app-context"
import { stages } from "@/lib/mock-data"
import type { StageKey } from "@/lib/types"

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Giao dịch", icon: ArrowLeftRight },
  { href: "/contacts", label: "Khách hàng", icon: Users },
  { href: "/documents", label: "Hồ sơ", icon: FileText },
  { href: "/smartplans", label: "SmartPlans", icon: Zap },
  { href: "/reports", label: "Báo cáo", icon: BarChart3 },
  { href: "/settings", label: "Cài đặt", icon: Settings },
]

const mockAlerts = [
  { id: 1, text: "GD tx-004: Thiếu 2 giấy tờ", type: "warning" as const },
  { id: 2, text: "GD tx-005: 2 công việc quá hạn", type: "error" as const },
  { id: 3, text: "GD tx-012: Lịch xem villa hôm nay", type: "info" as const },
]

export function Topbar() {
  const pathname = usePathname()
  const { addTransaction } = useAppState()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newTxOpen, setNewTxOpen] = useState(false)
  const [txForm, setTxForm] = useState({
    title: "",
    customerName: "",
    phone: "",
    propertyLabel: "",
    stage: "lead" as StageKey,
    value: "",
  })

  function handleCreateTx() {
    if (!txForm.title || !txForm.customerName || !txForm.propertyLabel) return
    addTransaction({
      title: txForm.title,
      customerName: txForm.customerName,
      phone: txForm.phone || undefined,
      propertyLabel: txForm.propertyLabel,
      stage: txForm.stage,
      value: Number(txForm.value) || 0,
    })
    setNewTxOpen(false)
    setTxForm({ title: "", customerName: "", phone: "", propertyLabel: "", stage: "lead", value: "" })
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center h-14 border-b border-border bg-card px-4 gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Menu</span>
        </Button>

        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
            <Building2 className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">RealOS</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm giao dịch, khách hàng..."
              className="pl-9 h-9 bg-secondary border-border text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* New transaction button */}
          <Button
            size="sm"
            className="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setNewTxOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-medium">Giao dịch mới</span>
          </Button>
          <Button
            size="icon"
            className="sm:hidden bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setNewTxOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Giao dịch mới</span>
          </Button>

          {/* Alerts */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-foreground">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                  {mockAlerts.length}
                </span>
                <span className="sr-only">Thông báo</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Thông báo</p>
              </div>
              {mockAlerts.map((alert) => (
                <DropdownMenuItem key={alert.id} className="flex items-start gap-2 py-2.5 cursor-pointer">
                  <Badge
                    variant={alert.type === "error" ? "destructive" : "secondary"}
                    className={cn(
                      "mt-0.5 text-[10px]",
                      alert.type === "warning" && "bg-warning text-warning-foreground",
                      alert.type === "info" && "bg-primary/10 text-primary"
                    )}
                  >
                    {alert.type === "error" ? "Quá hạn" : alert.type === "warning" ? "Cảnh báo" : "Nhắc nhở"}
                  </Badge>
                  <span className="text-sm text-foreground">{alert.text}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="sr-only">Tài khoản</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5 text-sidebar-primary-foreground" />
                </div>
                <span className="text-sm font-semibold">RealOS</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <nav className="flex-1 py-3 px-2 flex flex-col gap-1">
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* New Transaction Dialog */}
      <Dialog open={newTxOpen} onOpenChange={setNewTxOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo giao dịch mới</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-title">Tiêu đề</Label>
              <Input
                id="tx-title"
                value={txForm.title}
                onChange={(e) => setTxForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="VD: Bán căn hộ Vinhomes..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-customer">Khách hàng</Label>
              <Input
                id="tx-customer"
                value={txForm.customerName}
                onChange={(e) => setTxForm((f) => ({ ...f, customerName: e.target.value }))}
                placeholder="Tên khách hàng"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-phone">Số điện thoại</Label>
              <Input
                id="tx-phone"
                value={txForm.phone}
                onChange={(e) => setTxForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="0901234567"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-property">Bất động sản</Label>
              <Input
                id="tx-property"
                value={txForm.propertyLabel}
                onChange={(e) => setTxForm((f) => ({ ...f, propertyLabel: e.target.value }))}
                placeholder="VD: Vinhomes S5.03.12"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Giai đoạn</Label>
              <Select value={txForm.stage} onValueChange={(v) => setTxForm((f) => ({ ...f, stage: v as StageKey }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-value">Giá trị (VND)</Label>
              <Input
                id="tx-value"
                type="number"
                value={txForm.value}
                onChange={(e) => setTxForm((f) => ({ ...f, value: e.target.value }))}
                placeholder="3200000000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTxOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateTx} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
