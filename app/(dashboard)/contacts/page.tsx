"use client"

import { useMemo, useState } from "react"
import { Search, Phone, MessageCircle, Plus, X, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/lib/app-context"
import { formatVND, formatDate } from "@/lib/format"
import type { Contact } from "@/lib/types"
import Link from "next/link"

const roleLabels: Record<string, string> = {
  buyer: "Người mua",
  seller: "Người bán",
  tenant: "Người thuê",
  landlord: "Chủ nhà",
}

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  buyer: "default",
  seller: "secondary",
  tenant: "outline",
  landlord: "secondary",
}

export default function ContactsPage() {
  const { contacts, transactions } = useAppState()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const filteredContacts = useMemo(() => {
    let result = contacts
    if (roleFilter !== "all") {
      result = result.filter((c) => c.role === roleFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone?.includes(q) ||
          c.area?.toLowerCase().includes(q)
      )
    }
    return result
  }, [contacts, roleFilter, search])

  const relatedTransactions = useMemo(() => {
    if (!selectedContact) return []
    return transactions.filter((tx) =>
      tx.customerName.toLowerCase() === selectedContact.name.toLowerCase()
    )
  }, [selectedContact, transactions])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Khách hàng</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý danh sách khách hàng và liên hệ</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40 h-9">
            <SelectValue placeholder="Tất cả vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="buyer">Người mua</SelectItem>
            <SelectItem value="seller">Người bán</SelectItem>
            <SelectItem value="tenant">Người thuê</SelectItem>
            <SelectItem value="landlord">Chủ nhà</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-foreground">Tên</TableHead>
              <TableHead className="text-foreground">Vai trò</TableHead>
              <TableHead className="text-foreground hidden sm:table-cell">SĐT</TableHead>
              <TableHead className="text-foreground hidden md:table-cell">Khu vực</TableHead>
              <TableHead className="text-foreground hidden lg:table-cell text-right">Ngân sách</TableHead>
              <TableHead className="text-foreground hidden md:table-cell">Hoạt động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow
                key={contact.id}
                className="cursor-pointer hover:bg-secondary/30"
                onClick={() => setSelectedContact(contact)}
              >
                <TableCell className="font-medium text-foreground">{contact.name}</TableCell>
                <TableCell>
                  <Badge variant={roleBadgeVariant[contact.role]} className="text-xs">
                    {roleLabels[contact.role]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                  {contact.phone || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                  {contact.area || "-"}
                </TableCell>
                <TableCell className="text-foreground text-sm hidden lg:table-cell text-right">
                  {contact.budget ? formatVND(contact.budget) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                  {formatDate(contact.lastActivityAt)}
                </TableCell>
              </TableRow>
            ))}
            {filteredContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy khách hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Contact Detail Drawer */}
      <Sheet open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedContact && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  {selectedContact.name}
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4 px-4">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vai trò</span>
                    <Badge variant={roleBadgeVariant[selectedContact.role]} className="text-xs">
                      {roleLabels[selectedContact.role]}
                    </Badge>
                  </div>
                  {selectedContact.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số điện thoại</span>
                      <span className="text-foreground">{selectedContact.phone}</span>
                    </div>
                  )}
                  {selectedContact.area && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Khu vực</span>
                      <span className="text-foreground">{selectedContact.area}</span>
                    </div>
                  )}
                  {selectedContact.budget && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngân sách</span>
                      <span className="text-foreground font-medium">{formatVND(selectedContact.budget)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-foreground">Hành động nhanh</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Phone className="w-3 h-3 mr-1" />
                      Gọi điện
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Zalo
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Tạo GD
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Related Transactions */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-foreground">Giao dịch liên quan</p>
                  {relatedTransactions.length > 0 ? (
                    relatedTransactions.map((tx) => (
                      <Link
                        key={tx.id}
                        href={`/transactions/${tx.id}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        onClick={() => setSelectedContact(null)}
                      >
                        <div>
                          <p className="text-sm text-foreground font-medium">{tx.title}</p>
                          <p className="text-xs text-muted-foreground">{tx.propertyLabel}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">{formatVND(tx.value)}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-3">
                      Chưa có giao dịch nào
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
