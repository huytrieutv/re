export type StageKey =
  | "lead"
  | "consulting"
  | "viewing"
  | "deposit"
  | "docs"
  | "notary"
  | "transfer"
  | "handover"
  | "aftercare"

export interface Stage {
  key: StageKey
  label: string
}

export interface Transaction {
  id: string
  title: string
  customerName: string
  phone?: string
  propertyLabel: string
  stage: StageKey
  value: number
  createdAt: string
  updatedAt: string
  missingDocsCount: number
  overdueTasksCount: number
}

export interface Task {
  id: string
  transactionId?: string
  title: string
  dueAt: string
  status: "open" | "done"
  assigneeName: string
}

export interface ChecklistItem {
  id: string
  transactionId: string
  title: string
  status: "todo" | "done"
  dueAt?: string
}

export interface DocumentItem {
  id: string
  transactionId: string
  name: string
  type: "deposit_receipt" | "id_docs" | "red_book" | "contract" | "misc"
  uploadedAt: string
}

export interface Contact {
  id: string
  name: string
  role: "buyer" | "seller" | "tenant" | "landlord"
  phone?: string
  budget?: number
  area?: string
  lastActivityAt: string
}

export interface TimelineEvent {
  id: string
  transactionId: string
  action: string
  timestamp: string
  actor: string
}

export interface SmartPlanEnrollment {
  id: string
  transactionId: string
  templateName: string
  status: "active" | "paused" | "completed"
  nextActionAt: string
  nextAction: string
}

export interface SmartPlanTemplate {
  id: string
  name: string
  description: string
  triggerStage: StageKey
  actionsCount: number
}
