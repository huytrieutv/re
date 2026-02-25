"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { useAppState } from "@/lib/app-context"
import { formatDate } from "@/lib/format"

const docTypeLabels: Record<string, string> = {
  deposit_receipt: "Biên nhận cọc",
  id_docs: "Giấy tờ tùy thân",
  red_book: "Sổ đỏ",
  contract: "Hợp đồng",
  misc: "Khác",
}

export default function DocumentsPage() {
  const { documents, transactions } = useAppState()
  const [txFilter, setTxFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filteredDocs = useMemo(() => {
    let result = documents
    if (txFilter !== "all") {
      result = result.filter((d) => d.transactionId === txFilter)
    }
    if (typeFilter !== "all") {
      result = result.filter((d) => d.type === typeFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((d) => d.name.toLowerCase().includes(q))
    }
    return result
  }, [documents, txFilter, typeFilter, search])

  const txOptions = useMemo(() => {
    const txIds = [...new Set(documents.map((d) => d.transactionId))]
    return txIds.map((id) => {
      const tx = transactions.find((t) => t.id === id)
      return { id, label: tx ? tx.title : id }
    })
  }, [documents, transactions])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Hồ sơ</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý tài liệu trên tất cả giao dịch</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={txFilter} onValueChange={setTxFilter}>
          <SelectTrigger className="w-full sm:w-52 h-9">
            <SelectValue placeholder="Tất cả giao dịch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả giao dịch</SelectItem>
            {txOptions.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-44 h-9">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="deposit_receipt">Biên nhận cọc</SelectItem>
            <SelectItem value="id_docs">Giấy tờ tùy thân</SelectItem>
            <SelectItem value="red_book">Sổ đỏ</SelectItem>
            <SelectItem value="contract">Hợp đồng</SelectItem>
            <SelectItem value="misc">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-foreground">Tên tài liệu</TableHead>
              <TableHead className="text-foreground">Loại</TableHead>
              <TableHead className="text-foreground hidden sm:table-cell">Giao dịch</TableHead>
              <TableHead className="text-foreground">Ngày tải</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.map((doc) => {
              const tx = transactions.find((t) => t.id === doc.transactionId)
              return (
                <TableRow key={doc.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {docTypeLabels[doc.type] || doc.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {tx ? (
                      <Link
                        href={`/transactions/${tx.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {tx.title}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(doc.uploadedAt)}
                  </TableCell>
                </TableRow>
              )
            })}
            {filteredDocs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy tài liệu nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
