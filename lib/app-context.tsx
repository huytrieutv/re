"use client"

import React, { createContext, useContext, useState, useMemo, useCallback } from "react"
import type {
  Transaction,
  Task,
  ChecklistItem,
  DocumentItem,
  Contact,
  TimelineEvent,
  StageKey,
} from "./types"
import {
  initialTransactions,
  initialTasks,
  initialChecklistItems,
  initialDocuments,
  initialContacts,
  initialTimelineEvents,
} from "./mock-data"

interface AppState {
  transactions: Transaction[]
  tasks: Task[]
  checklistItems: ChecklistItem[]
  documents: DocumentItem[]
  contacts: Contact[]
  timelineEvents: TimelineEvent[]
  addTransaction: (tx: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "missingDocsCount" | "overdueTasksCount">) => void
  updateTransactionStage: (id: string, stage: StageKey) => void
  toggleTaskStatus: (id: string) => void
  addTask: (task: Omit<Task, "id">) => void
  toggleChecklistItem: (id: string) => void
  addChecklistItem: (item: Omit<ChecklistItem, "id">) => void
  addDocument: (doc: Omit<DocumentItem, "id" | "uploadedAt">) => void
  addTimelineEvent: (event: Omit<TimelineEvent, "id">) => void
}

const AppContext = createContext<AppState | null>(null)

let nextId = 100

function generateId(prefix: string) {
  nextId++
  return `${prefix}-${nextId}`
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(initialChecklistItems)
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments)
  const [contacts] = useState<Contact[]>(initialContacts)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimelineEvents)

  const addTransaction = useCallback((tx: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "missingDocsCount" | "overdueTasksCount">) => {
    const today = new Date().toISOString().split("T")[0]
    const newTx: Transaction = {
      ...tx,
      id: generateId("tx"),
      createdAt: today,
      updatedAt: today,
      missingDocsCount: 0,
      overdueTasksCount: 0,
    }
    setTransactions((prev) => [...prev, newTx])
    // TODO: Replace with API call
  }, [])

  const updateTransactionStage = useCallback((id: string, stage: StageKey) => {
    const today = new Date().toISOString().split("T")[0]
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, stage, updatedAt: today } : tx))
    )

    // SmartPlan V1 mock: auto-add checklist + task when moving to deposit
    if (stage === "deposit") {
      setChecklistItems((prev) => {
        const existingForTx = prev.filter((cl) => cl.transactionId === id)
        const hasDepositItems = existingForTx.some((cl) => cl.title.includes("Biên nhận tiền cọc"))
        if (hasDepositItems) return prev
        return [
          ...prev,
          { id: generateId("cl"), transactionId: id, title: "CMND/CCCD người mua", status: "todo" },
          { id: generateId("cl"), transactionId: id, title: "Hợp đồng đặt cọc", status: "todo" },
          { id: generateId("cl"), transactionId: id, title: "Biên nhận tiền cọc", status: "todo", dueAt: today },
        ]
      })
      setTasks((prev) => {
        const existingForTx = prev.filter((t) => t.transactionId === id)
        const hasDepositTask = existingForTx.some((t) => t.title.includes("Thu giấy tờ đặt cọc"))
        if (hasDepositTask) return prev
        return [
          ...prev,
          {
            id: generateId("task"),
            transactionId: id,
            title: "Thu giấy tờ đặt cọc",
            dueAt: today,
            status: "open",
            assigneeName: "Minh Tú",
          },
        ]
      })
    }

    setTimelineEvents((prev) => [
      ...prev,
      {
        id: generateId("ev"),
        transactionId: id,
        action: `Chuyển sang giai đoạn ${stage}`,
        timestamp: new Date().toISOString(),
        actor: "Minh Tú",
      },
    ])
    // TODO: Replace with API call
  }, [])

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "open" ? "done" : "open" } : t))
    )
    // TODO: Replace with API call
  }, [])

  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: generateId("task") }])
    // TODO: Replace with API call
  }, [])

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklistItems((prev) =>
      prev.map((cl) => (cl.id === id ? { ...cl, status: cl.status === "todo" ? "done" : "todo" } : cl))
    )
    // TODO: Replace with API call
  }, [])

  const addChecklistItem = useCallback((item: Omit<ChecklistItem, "id">) => {
    setChecklistItems((prev) => [...prev, { ...item, id: generateId("cl") }])
    // TODO: Replace with API call
  }, [])

  const addDocument = useCallback((doc: Omit<DocumentItem, "id" | "uploadedAt">) => {
    setDocuments((prev) => [
      ...prev,
      { ...doc, id: generateId("doc"), uploadedAt: new Date().toISOString().split("T")[0] },
    ])
    // TODO: Replace with API call
  }, [])

  const addTimelineEvent = useCallback((event: Omit<TimelineEvent, "id">) => {
    setTimelineEvents((prev) => [...prev, { ...event, id: generateId("ev") }])
  }, [])

  const value = useMemo(
    () => ({
      transactions,
      tasks,
      checklistItems,
      documents,
      contacts,
      timelineEvents,
      addTransaction,
      updateTransactionStage,
      toggleTaskStatus,
      addTask,
      toggleChecklistItem,
      addChecklistItem,
      addDocument,
      addTimelineEvent,
    }),
    [transactions, tasks, checklistItems, documents, contacts, timelineEvents, addTransaction, updateTransactionStage, toggleTaskStatus, addTask, toggleChecklistItem, addChecklistItem, addDocument, addTimelineEvent]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}
