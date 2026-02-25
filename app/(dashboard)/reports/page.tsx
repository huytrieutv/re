"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppState } from "@/lib/app-context"
import { stages } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

export default function ReportsPage() {
  const { transactions, tasks } = useAppState()

  const stageData = useMemo(() => {
    return stages.map((stage) => ({
      name: stage.label,
      count: transactions.filter((tx) => tx.stage === stage.key).length,
    }))
  }, [transactions])

  const weekTaskData = useMemo(() => {
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
    return days.map((day, i) => ({
      name: day,
      completed: Math.floor(Math.random() * 5) + (i < 5 ? 2 : 0),
    }))
  }, [])

  const totalValue = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.value, 0)
  }, [transactions])

  const completedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === "done").length
  }, [tasks])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Báo cáo</h1>
        <p className="text-sm text-muted-foreground mt-1">Thống kê hoạt động và hiệu suất</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
            <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng giá trị</p>
            <p className="text-2xl font-bold text-foreground">
              {(totalValue / 1000000000).toFixed(1)} tỷ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng nhắc việc</p>
            <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
            <p className="text-2xl font-bold text-foreground">{completedTasks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Giao dịch theo giai đoạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Công việc hoàn thành trong tuần
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekTaskData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "var(--accent)" }}
                    activeDot={{ r: 6, fill: "var(--accent)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
