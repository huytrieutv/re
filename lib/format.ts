export function formatVND(value: number): string {
  if (value >= 1000000000) {
    const billions = value / 1000000000
    return `${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)} tỷ`
  }
  if (value >= 1000000) {
    const millions = value / 1000000
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} triệu`
  }
  return new Intl.NumberFormat("vi-VN").format(value) + " đ"
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0]
  return dateStr.startsWith(today)
}

export function isOverdue(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0]
  return dateStr < today
}
