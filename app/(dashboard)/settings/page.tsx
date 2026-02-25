"use client"

import { useState } from "react"
import { User, Bell, Building2, Link2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Nguyễn Minh Tú",
    phone: "0901234567",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  })

  function handleSaveProfile() {
    toast.success("Đã lưu thông tin (mock)")
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Cài đặt</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý tài khoản và tùy chọn</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-name">Họ tên</Label>
            <Input
              id="settings-name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-phone">Số điện thoại</Label>
            <Input
              id="settings-phone"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <Button onClick={handleSaveProfile} className="self-start bg-primary text-primary-foreground hover:bg-primary/90">
            Lưu thay đổi
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Thông báo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Thông báo email</p>
              <p className="text-xs text-muted-foreground">Nhận email khi có cập nhật quan trọng</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, email: v }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Thông báo đẩy</p>
              <p className="text-xs text-muted-foreground">Nhận thông báo trên trình duyệt</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, push: v }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Thông báo SMS</p>
              <p className="text-xs text-muted-foreground">Nhận tin nhắn SMS nhắc việc</p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, sms: v }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tenant Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Thông tin tổ chức
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tên công ty</span>
            <span className="text-foreground font-medium">Keller Williams Saigon</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gói dịch vụ</span>
            <span className="text-foreground font-medium">Professional</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mã đại lý</span>
            <span className="text-foreground font-medium">KW-SGN-0042</span>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Tích hợp
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">HubSpot CRM</p>
              <p className="text-xs text-muted-foreground">Đồng bộ khách hàng và giao dịch</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => toast.info("Tính năng kết nối HubSpot sẽ sớm ra mắt")}
            >
              Kết nối HubSpot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
