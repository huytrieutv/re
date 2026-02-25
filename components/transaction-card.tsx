"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { formatVND } from "@/lib/format"
import { stages } from "@/lib/mock-data"
import { AlertTriangle, Clock } from "lucide-react"

interface TransactionCardProps {
  transaction: Transaction
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
}

export function TransactionCard({ transaction, draggable, onDragStart }: TransactionCardProps) {
  const stageLabel = stages.find((s) => s.key === transaction.stage)?.label || transaction.stage

  return (
    <Link href={`/transactions/${transaction.id}`}>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow border-border"
        draggable={draggable}
        onDragStart={onDragStart}
      >
        <CardContent className="p-3 flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
            {transaction.title}
          </p>
          <p className="text-xs text-muted-foreground">{transaction.customerName}</p>
          <p className="text-xs text-muted-foreground">{transaction.propertyLabel}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">{formatVND(transaction.value)}</span>
            <Badge variant="secondary" className="text-[10px]">
              {stageLabel}
            </Badge>
          </div>
          {(transaction.missingDocsCount > 0 || transaction.overdueTasksCount > 0) && (
            <div className="flex items-center gap-2 pt-1 border-t border-border">
              {transaction.missingDocsCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-warning-foreground">
                  <AlertTriangle className="w-3 h-3" />
                  {transaction.missingDocsCount} giấy tờ
                </span>
              )}
              {transaction.overdueTasksCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-destructive">
                  <Clock className="w-3 h-3" />
                  {transaction.overdueTasksCount} quá hạn
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
