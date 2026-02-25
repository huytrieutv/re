"use client"

import React, { useState, useCallback } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { TransactionCard } from "@/components/transaction-card"
import { useAppState } from "@/lib/app-context"
import { stages } from "@/lib/mock-data"
import type { Transaction, StageKey } from "@/lib/types"
import { cn } from "@/lib/utils"

interface KanbanBoardProps {
  filteredTransactions: Transaction[]
  stageFilter?: StageKey | null
}

export function KanbanBoard({ filteredTransactions, stageFilter }: KanbanBoardProps) {
  const { updateTransactionStage } = useAppState()
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const displayStages = stageFilter
    ? stages.filter((s) => s.key === stageFilter)
    : stages

  const handleDragStart = useCallback((e: React.DragEvent, txId: string) => {
    e.dataTransfer.setData("text/plain", txId)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, stageKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(stageKey)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, stageKey: StageKey) => {
      e.preventDefault()
      const txId = e.dataTransfer.getData("text/plain")
      if (txId) {
        updateTransactionStage(txId, stageKey)
      }
      setDragOverColumn(null)
    },
    [updateTransactionStage]
  )

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4 min-w-max">
        {displayStages.map((stage) => {
          const columnTxs = filteredTransactions.filter((tx) => tx.stage === stage.key)
          return (
            <div
              key={stage.key}
              className={cn(
                "flex flex-col w-72 shrink-0 rounded-lg border border-border bg-secondary/30 transition-colors",
                dragOverColumn === stage.key && "bg-primary/5 border-primary/30"
              )}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                <span className="text-sm font-semibold text-foreground">{stage.label}</span>
                <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
                  {columnTxs.length}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-2 min-h-[120px]">
                {columnTxs.map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    transaction={tx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tx.id)}
                  />
                ))}
                {columnTxs.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                    Kéo thả giao dịch vào đây
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
