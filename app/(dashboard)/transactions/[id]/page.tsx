"use client"

import { use, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Phone,
  FileText,
  CheckSquare,
  ListTodo,
  Clock,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAppState } from "@/lib/app-context"
import { stages } from "@/lib/mock-data"
import { formatVND, formatDate, isOverdue } from "@/lib/format"
import type { StageKey } from "@/lib/types"

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const {
    transactions,
    tasks,
    checklistItems,
    documents,
    timelineEvents,
    updateTransactionStage,
    toggleTaskStatus,
    toggleChecklistItem,
    addChecklistItem,
    addTask,
    addDocument,
  } = useAppState()

  const tx = useMemo(() => transactions.find((t) => t.id === id), [transactions, id])
  const txTasks = useMemo(() => tasks.filter((t) => t.transactionId === id), [tasks, id])
  const txChecklist = useMemo(() => checklistItems.filter((c) => c.transactionId === id), [checklistItems, id])
  const txDocs = useMemo(() => documents.filter((d) => d.transactionId === id), [documents, id])
  const txTimeline = useMemo(
    () =>
      timelineEvents
        .filter((e) => e.transactionId === id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [timelineEvents, id]
  )

  const [newChecklistTitle, setNewChecklistTitle] = useState("")
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: "", dueAt: "", assigneeName: "Minh Tú" })
  const [uploadOpen, setUploadOpen] = useState(false)
  const [docForm, setDocForm] = useState({ name: "", type: "misc" as const })

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Không tìm thấy giao dịch</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/transactions")}>
          Quay lại
        </Button>
      </div>
    )
  }

  function handleStageChange(newStage: StageKey) {
    updateTransactionStage(id, newStage)
    toast.success("Đã thay đổi giai đoạn. SmartPlan sẽ chạy các hành động tự động (mock).")
  }

  function handleAddChecklist() {
    if (!newChecklistTitle.trim()) return
    addChecklistItem({ transactionId: id, title: newChecklistTitle, status: "todo" })
    setNewChecklistTitle("")
  }

  function handleAddTask() {
    if (!taskForm.title) return
    addTask({
      transactionId: id,
      title: taskForm.title,
      dueAt: taskForm.dueAt || new Date().toISOString().split("T")[0],
      status: "open",
      assigneeName: taskForm.assigneeName,
    })
    setAddTaskOpen(false)
    setTaskForm({ title: "", dueAt: "", assigneeName: "Minh Tú" })
  }

  function handleUploadDoc() {
    if (!docForm.name) return
    addDocument({ transactionId: id, name: docForm.name, type: docForm.type })
    setUploadOpen(false)
    setDocForm({ name: "", type: "misc" })
    toast.success("Đã tải lên tài liệu (mock)")
  }

  const docTypeLabels: Record<string, string> = {
    deposit_receipt: "Biên nhận cọc",
    id_docs: "Giấy tờ tùy thân",
    red_book: "Sổ đỏ",
    contract: "Hợp đồng",
    misc: "Khác",
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/transactions")} className="mt-1">
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only">Quay lại</span>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-xl font-bold text-foreground text-balance">{tx.title}</h1>
            <Select value={tx.stage} onValueChange={(v) => handleStageChange(v as StageKey)}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stages.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{tx.customerName}</span>
            {tx.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {tx.phone}
              </span>
            )}
            <span className="font-semibold text-primary">{formatVND(tx.value)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="documents">Hồ sơ</TabsTrigger>
          <TabsTrigger value="tasks">Nhắc việc</TabsTrigger>
          <TabsTrigger value="timeline">Lịch sử</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Thông tin giao dịch</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bất động sản</span>
                  <span className="text-foreground font-medium">{tx.propertyLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá trị</span>
                  <span className="text-foreground font-medium">{formatVND(tx.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày tạo</span>
                  <span className="text-foreground">{formatDate(tx.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cập nhật</span>
                  <span className="text-foreground">{formatDate(tx.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tiến độ</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Checklist</span>
                  <span className="text-foreground">
                    {txChecklist.filter((c) => c.status === "done").length}/{txChecklist.length} hoàn thành
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nhắc việc</span>
                  <span className="text-foreground">
                    {txTasks.filter((t) => t.status === "done").length}/{txTasks.length} hoàn thành
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tài liệu</span>
                  <span className="text-foreground">{txDocs.length} tệp</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="mt-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {txChecklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <Checkbox
                    id={item.id}
                    checked={item.status === "done"}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className={`flex-1 text-sm cursor-pointer ${
                      item.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </label>
                  {item.dueAt && isOverdue(item.dueAt) && item.status === "todo" && (
                    <Badge variant="destructive" className="text-[10px]">
                      Quá hạn
                    </Badge>
                  )}
                </div>
              ))}
              {txChecklist.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có mục nào</p>
              )}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                <Input
                  placeholder="Thêm mục mới..."
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  className="h-8 text-sm flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleAddChecklist()}
                />
                <Button size="sm" onClick={handleAddChecklist} className="h-8 bg-primary text-primary-foreground">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Hồ sơ
              </CardTitle>
              <Button size="sm" onClick={() => setUploadOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="w-3 h-3 mr-1" />
                Tải lên
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {txDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {docTypeLabels[doc.type] || doc.type}
                  </Badge>
                </div>
              ))}
              {txDocs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có tài liệu nào</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <ListTodo className="w-4 h-4" />
                Nhắc việc
              </CardTitle>
              <Button size="sm" onClick={() => setAddTaskOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="w-3 h-3 mr-1" />
                Thêm
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {txTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <Checkbox
                    id={task.id}
                    checked={task.status === "done"}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={task.id}
                      className={`text-sm cursor-pointer block ${
                        task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {task.assigneeName} - {formatDate(task.dueAt)}
                    </span>
                  </div>
                  {isOverdue(task.dueAt) && task.status === "open" && (
                    <Badge variant="destructive" className="text-[10px]">
                      Quá hạn
                    </Badge>
                  )}
                </div>
              ))}
              {txTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có nhắc việc nào</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Lịch sử hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-0">
                {txTimeline.map((event, idx) => (
                  <div key={event.id} className="flex gap-4 pb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {idx < txTimeline.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <p className="text-sm text-foreground">{event.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.actor} - {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {txTimeline.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Chưa có hoạt động nào</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm nhắc việc</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>Tiêu đề</Label>
              <Input
                value={taskForm.title}
                onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Tên công việc..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Hạn chót</Label>
              <Input
                type="date"
                value={taskForm.dueAt}
                onChange={(e) => setTaskForm((f) => ({ ...f, dueAt: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Người thực hiện</Label>
              <Input
                value={taskForm.assigneeName}
                onChange={(e) => setTaskForm((f) => ({ ...f, assigneeName: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTaskOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddTask} className="bg-primary text-primary-foreground">
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tải lên tài liệu</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>Tên tài liệu</Label>
              <Input
                value={docForm.name}
                onChange={(e) => setDocForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="VD: CMND khách hàng"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Loại tài liệu</Label>
              <Select
                value={docForm.type}
                onValueChange={(v) => setDocForm((f) => ({ ...f, type: v as typeof f.type }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit_receipt">Biên nhận cọc</SelectItem>
                  <SelectItem value="id_docs">Giấy tờ tùy thân</SelectItem>
                  <SelectItem value="red_book">Sổ đỏ</SelectItem>
                  <SelectItem value="contract">Hợp đồng</SelectItem>
                  <SelectItem value="misc">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUploadDoc} className="bg-primary text-primary-foreground">
              Tải lên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
