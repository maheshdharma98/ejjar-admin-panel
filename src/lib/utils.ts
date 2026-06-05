import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateTime(date: string) {
  return format(new Date(date), 'dd MMM yyyy HH:mm')
}

export function timeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  supplier_responded: 'bg-yellow-100 text-yellow-700',
  negotiation: 'bg-orange-100 text-orange-700',
  accepted: 'bg-green-100 text-green-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  in_progress: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-700',
  inactive: 'bg-gray-100 text-gray-700',
  sent: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
}

export function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
