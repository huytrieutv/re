"use client"

import Link from "next/link"
import { Zap, Play, Pause, CheckCircle2, Clock, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { smartPlanEnrollments, smartPlanTemplates, stages } from "@/lib/mock-data"
import { useAppState } from "@/lib/app-context"
import { formatDate } from "@/lib/format"

const statusConfig = {
  active: { label: "Đang chạy", icon: Play, variant: "default" as const, className: "bg-success text-success-foreground" },
  paused: { label: "Tạm dừng", icon: Pause, variant: "secondary" as const, className: "" },
  completed: { label: "Hoàn thành", icon: CheckCircle2, variant: "outline" as const, className: "" },
}

export default function SmartPlansPage() {
  const { transactions } = useAppState()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">SmartPlans</h1>
        <p className="text-sm text-muted-foreground mt-1">Quy trình tự động hóa cho giao dịch bất động sản</p>
      </div>

      {/* Active Enrollments */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">SmartPlans đang hoạt động</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smartPlanEnrollments.map((enrollment) => {
            const tx = transactions.find((t) => t.id === enrollment.transactionId)
            const config = statusConfig[enrollment.status]
            const StatusIcon = config.icon
            return (
              <Card key={enrollment.id}>
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{enrollment.templateName}</p>
                        {tx && (
                          <Link
                            href={`/transactions/${tx.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            {tx.title}
                          </Link>
                        )}
                      </div>
                    </div>
                    <Badge variant={config.variant} className={`text-xs ${config.className}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Hành động tiếp: {enrollment.nextAction}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Thời gian: {formatDate(enrollment.nextActionAt)}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Templates */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Mẫu SmartPlan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {smartPlanTemplates.map((template) => {
            const stageLabel = stages.find((s) => s.key === template.triggerStage)?.label
            return (
              <Card key={template.id}>
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">{template.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="secondary" className="text-[10px]">
                      Kích hoạt: {stageLabel}
                    </Badge>
                    <span className="text-muted-foreground">{template.actionsCount} hành động</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
