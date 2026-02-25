"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, LayoutGrid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { KanbanBoard } from "@/components/kanban-board"
import { useAppState } from "@/lib/app-context"
import { stages } from "@/lib/mock-data"
import { formatVND, formatDate } from "@/lib/format"
import type { StageKey } from "@/lib/types"
import Link from "next/link"
import { AlertTriangle, Clock } from "lucide-react"

function TransactionsContent() {
  const searchParams = useSearchParams()
  const { transactions } = useAppState()
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<StageKey | "all">(
    (searchParams.get("stage") as StageKey) || "all"
  )
  const [view, setView] = useState<"kanban" | "list">("kanban")

  const filteredTransactions = useMemo(() => {
    let result = transactions
    if (stageFilter !== "all") {
      result = result.filter((tx) => tx.stage === stageFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (tx) =>
          tx.customerName.toLowerCase().includes(q) ||
          tx.propertyLabel.toLowerCase().includes(q) ||
          tx.title.toLowerCase().includes(q)
      )
    }
    return result
  }, [transactions, stageFilter, search])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Giao dịch</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý pipeline giao dịch bất động sản</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select
          value={stageFilter}
          onValueChange={(v) => setStageFilter(v as StageKey | "all")}
        >
          <SelectTrigger className="w-full sm:w-44 h-9">
            <SelectValue placeholder="Tất cả giai đoạn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả giai đoạn</SelectItem>
            {stages.map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <Button
            variant={view === "kanban" ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-9"
            onClick={() => setView("kanban")}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="sr-only">Kanban</span>
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-9"
            onClick={() => setView("list")}
          >
            <List className="w-4 h-4" />
            <span className="sr-only">Danh sách</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "kanban" ? (
        <KanbanBoard
          filteredTransactions={filteredTransactions}
          stageFilter={stageFilter === "all" ? null : stageFilter}
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="text-foreground">Khách hàng</TableHead>
                <TableHead className="text-foreground">Bất động sản</TableHead>
                <TableHead className="text-foreground">Giai đoạn</TableHead>
                <TableHead className="text-foreground text-right">Giá trị</TableHead>
                <TableHead className="text-foreground">Cảnh báo</TableHead>
                <TableHead className="text-foreground">Cập nhật</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="cursor-pointer hover:bg-secondary/30">
                  <TableCell>
                    <Link href={`/transactions/${tx.id}`} className="font-medium text-foreground hover:text-primary">
                      {tx.customerName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{tx.propertyLabel}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {stages.find((s) => s.key === tx.stage)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatVND(tx.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.missingDocsCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-warning-foreground">
                          <AlertTriangle className="w-3 h-3" />
                          {tx.missingDocsCount}
                        </span>
                      )}
                      {tx.overdueTasksCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-destructive">
                          <Clock className="w-3 h-3" />
                          {tx.overdueTasksCount}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(tx.updatedAt)}</TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy giao dịch nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>}>
      <TransactionsContent />
    </Suspense>
  )
}
