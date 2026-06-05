import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronUp, ChevronDown, X, Download, RefreshCw } from 'lucide-react'
import { notificationsData, contractorsData, suppliersData } from '@/data'
import { cn, formatDateTime, statusLabel, downloadCSV } from '@/lib/utils'

type Notif = typeof notificationsData[0]

const CHANNELS = ['WhatsApp', 'SMS', 'Push']
const CHANNEL_COLORS: Record<string, string> = {
  WhatsApp: 'bg-green-100 text-green-700',
  SMS: 'bg-blue-100 text-blue-700',
  Push: 'bg-violet-100 text-violet-700',
}
const DELIVERY_STATUSES = ['sent', 'failed', 'pending']
const DELIVERY_COLORS: Record<string, string> = {
  sent: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
}

function getChannel(id: string) {
  const n = parseInt(id.replace(/\D/g, '')) || 0
  return CHANNELS[n % CHANNELS.length]
}

function getDelivery(id: string) {
  const n = parseInt(id.replace(/\D/g, '')) || 0
  if (n % 7 === 0) return 'failed'
  if (n % 5 === 0) return 'pending'
  return 'sent'
}

const userMap: Record<string, { name: string; phone: string }> = {}
const _cons = contractorsData as {id:string;name:string;phone:string}[]
const _sups = suppliersData as {id:string;name:string;phone:string}[]
_cons.forEach((c) => { userMap[c.id] = { name: c.name, phone: c.phone } })
_sups.forEach((s) => { userMap[s.id] = { name: s.name, phone: s.phone || '—' } })

const enriched = notificationsData.map((n: Notif) => ({
  ...n,
  channel: getChannel(n.id),
  delivery: getDelivery(n.id),
  userName: userMap[n.user_id]?.name || n.user_id,
  phone: userMap[n.user_id]?.phone || '—',
}))

type EnrichedNotif = typeof enriched[0]

const PAGE_SIZE = 20

export default function NotificationsPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<EnrichedNotif[]>(enriched)
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [deliveryFilter, setDeliveryFilter] = useState('all')
  const [sortKey, setSortKey] = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const types = useMemo(() => [...new Set<string>(notificationsData.map((n: Notif) => n.type))], [])

  const filtered = useMemo(() => {
    let data = notifications
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((n) =>
        n.userName.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q)
      )
    }
    if (channelFilter !== 'all') data = data.filter((n) => n.channel === channelFilter)
    if (typeFilter !== 'all') data = data.filter((n) => n.type === typeFilter)
    if (deliveryFilter !== 'all') data = data.filter((n) => n.delivery === deliveryFilter)
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey]
      const bv = (b as Record<string, unknown>)[sortKey]
      const res = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0
      return sortDir === 'asc' ? res : -res
    })
  }, [notifications, search, channelFilter, typeFilter, deliveryFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const sort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: string }) =>
    sortKey === k ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ChevronDown size={13} className="opacity-30" />

  const retry = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, delivery: 'pending' } : n)))

  const handleExport = () => {
    const rows = [
      ['ID', 'User', 'Phone', 'Channel', 'Type', 'Message', 'Time', 'Status'],
      ...filtered.map((n) => [n.id, n.userName, n.phone, n.channel, n.type, n.message, n.created_at, n.delivery]),
    ]
    downloadCSV('notifications.csv', rows)
  }

  const hasFilters = search || channelFilter !== 'all' || typeFilter !== 'all' || deliveryFilter !== 'all'

  if (loading) return <SkeletonTable />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('notifications')}</h1>
          <p className="text-slate-500 text-sm">{filtered.length} records</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A4FBA] text-white text-sm font-medium hover:bg-[#1540a0] transition-colors">
          <Download size={15} />{t('export')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder={t('search') + '...'} className="w-full ps-9 pe-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30" />
          </div>
          <select value={channelFilter} onChange={(e) => { setChannelFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
            <option value="all">Channel: All</option>
            {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
            <option value="all">Type: All</option>
            {types.map((tp) => <option key={String(tp)} value={String(tp)}>{String(tp).replace(/_/g, ' ')}</option>)}
          </select>
          <select value={deliveryFilter} onChange={(e) => { setDeliveryFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
            <option value="all">Status: All</option>
            {DELIVERY_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setChannelFilter('all'); setTypeFilter('all'); setDeliveryFilter('all'); setPage(1) }} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {([['userName', 'User'], ['phone', 'Phone'], ['channel', 'Channel'], ['type', 'Type'], ['message', 'Message'], ['created_at', 'Time'], ['delivery', 'Status']] as [string,string][]).map(([k, label]) => (
                  <th key={k} onClick={() => sort(k)} className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">{label}<SortIcon k={k} /></span>
                  </th>
                ))}
                <th className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('retry')}</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">{t('no_data')}</td></tr>
              ) : pageData.map((n) => (
                <tr key={n.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800 whitespace-nowrap">{n.userName}</p>
                    <p className="text-xs text-slate-400 font-mono">{n.user_id}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{n.phone}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', CHANNEL_COLORS[n.channel])}>
                      {n.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {n.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-64">
                    <p className="text-slate-700 text-xs truncate" title={n.message}>{n.message}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">{formatDateTime(n.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', DELIVERY_COLORS[n.delivery])}>
                      {statusLabel(n.delivery)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {n.delivery === 'failed' && (
                      <button onClick={() => retry(n.id)} title="Retry" className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-600 transition-colors">
                        <RefreshCw size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-sm text-slate-500">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">«</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">‹</button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return <button key={p} onClick={() => setPage(p)} className={cn('w-8 h-8 rounded text-sm', p === page ? 'bg-[#1A4FBA] text-white' : 'text-slate-500 hover:bg-slate-100')}>{p}</button>
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">»</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-100"><div className="h-4 bg-slate-200 rounded w-32" /></div>
      <table className="w-full"><thead><tr className="border-b border-slate-100">{[...Array(8)].map((_, i) => <th key={i} className="px-4 py-3"><div className="h-3 bg-slate-200 rounded" /></th>)}</tr></thead>
        <tbody>{[...Array(8)].map((_, i) => <tr key={i} className="border-b border-slate-50">{[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded" /></td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
