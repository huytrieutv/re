"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
  TrendingUp,
  Eye,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { useAppState } from "@/lib/app-context"
import { stages } from "@/lib/mock-data"
import { isToday, isOverdue } from "@/lib/format"

export default function DashboardPage() {
  const { transactions, tasks, toggleTaskStatus } = useAppState()

  const stats = useMemo(() => {
    const activeDeals = transactions.filter((tx) =>
      !["aftercare"].includes(tx.stage)
    ).length
    const viewings = transactions.filter((tx) => tx.stage === "viewing").length
    const deposits = transactions.filter((tx) => tx.stage === "deposit").length
    const closings = transactions.filter((tx) =>
      ["handover", "aftercare"].includes(tx.stage)
    ).length
    return { activeDeals, viewings, deposits, closings }
  }, [transactions])

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isToday(t.dueAt) || (t.status === "open" && isOverdue(t.dueAt)))
  }, [tasks])

  const pipelineCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    stages.forEach((s) => {
      counts[s.key] = transactions.filter((tx) => tx.stage === s.key).length
    })
    return counts
  }, [transactions])

  const alerts = useMemo(() => {
    const missingDocs = transactions.filter((tx) => tx.missingDocsCount > 0)
    const overdueTasks = transactions.filter((tx) => tx.overdueTasksCount > 0)
    return { missingDocs, overdueTasks }
  }, [transactions])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Tổng quan hoạt động hôm nay</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Giao dịch đang xử lý"
          value={stats.activeDeals}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          label="Xem nhà hôm nay"
          value={stats.viewings}
          icon={<Eye className="w-5 h-5" />}
        />
        <StatCard
          label="Đang đặt cọc"
          value={stats.deposits}
          icon={<Landmark className="w-5 h-5" />}
        />
        <StatCard
          label="Đã chốt"
          value={stats.closings}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Nhắc việc hôm nay</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Không có công việc nào hôm nay
              </p>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <Checkbox
                    id={task.id}
                    checked={task.status === "done"}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                  />
                  <label
                    htmlFor={task.id}
                    className={`flex-1 text-sm cursor-pointer ${
                      task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </label>
                  {isOverdue(task.dueAt) && task.status === "open" && (
                    <Badge variant="destructive" className="text-[10px]">
                      Quá hạn
                    </Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* SmartPlan Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Cảnh báo SmartPlan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {alerts.missingDocs.map((tx) => (
              <Link
                key={`doc-${tx.id}`}
                href={`/transactions/${tx.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                <span className="text-sm text-foreground flex-1">
                  <span className="font-medium">{tx.title}</span>
                  {" - "}
                  Thiếu {tx.missingDocsCount} giấy tờ
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
            {alerts.overdueTasks.map((tx) => (
              <Link
                key={`task-${tx.id}`}
                href={`/transactions/${tx.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Clock className="w-4 h-4 text-destructive shrink-0" />
                <span className="text-sm text-foreground flex-1">
                  <span className="font-medium">{tx.title}</span>
                  {" - "}
                  {tx.overdueTasksCount} việc quá hạn
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
            {alerts.missingDocs.length === 0 && alerts.overdueTasks.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Không có cảnh báo nào
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Snapshot */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <Link key={stage.key} href={`/transactions?stage=${stage.key}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-foreground border-border hover:bg-secondary"
                >
                  <span className="text-sm">{stage.label}</span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {pipelineCounts[stage.key] || 0}
                  </Badge>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
