import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: string
  className?: string
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {trend && <p className="text-xs text-muted-foreground mt-0.5">{trend}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
