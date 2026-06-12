import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronUp, ChevronDown, X, Download, RefreshCw } from 'lucide-react'
import { notificationsData, contractorsData, suppliersData } from '@/data'
import { cn, formatDateTime, statusLabel, downloadCSV } from '@/lib/utils'
import { usePageMeta } from '@/stores/pageStore'
import StatusBadge from '@/components/ui/StatusBadge'

type Notif = typeof notificationsData[0]

const CHANNELS = ['WhatsApp', 'SMS', 'Push']

const CHANNEL_COLORS: Record<string, string> = {
  WhatsApp: 'bg-status-successBg text-status-successText',
  SMS: 'bg-status-infoBg text-status-infoText',
  Push: 'bg-status-pendingBg text-status-pendingText',
}

const DELIVERY_STATUSES = ['sent', 'failed', 'pending']

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
const _cons = contractorsData as { id: string; name: string; phone: string }[]
const _sups = suppliersData as { id: string; name: string; phone: string }[]
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
  usePageMeta('Notifications', 'Platform-wide notification log')

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
    sortKey === k
      ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
      : <ChevronDown size={11} className="opacity-30" />

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

  const selectClass = 'px-3 py-2 rounded-[10px] border border-border-input bg-surface-input text-[12px] text-text-primary focus:outline-none focus:border-border-active focus:shadow-[0_0_0_3px_rgba(230,126,58,0.12)] appearance-none'

  if (loading) return <SkeletonTable />

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-surface-card border border-border-card rounded-[14px] p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder={t('search') + '...'}
              className="w-full ps-9 pe-3 py-2 rounded-[10px] border border-border-input bg-surface-input text-[12px] text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active focus:shadow-[0_0_0_3px_rgba(230,126,58,0.12)]"
            />
          </div>
          <select value={channelFilter} onChange={(e) => { setChannelFilter(e.target.value); setPage(1) }} className={selectClass}>
            <option value="all">Channel: All</option>
            {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }} className={selectClass}>
            <option value="all">Type: All</option>
            {types.map((tp) => <option key={String(tp)} value={String(tp)}>{String(tp).replace(/_/g, ' ')}</option>)}
          </select>
          <select value={deliveryFilter} onChange={(e) => { setDeliveryFilter(e.target.value); setPage(1) }} className={selectClass}>
            <option value="all">Status: All</option>
            {DELIVERY_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-brand-orange text-white text-[12px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_12px_rgba(230,126,58,0.20)]"
          >
            <Download size={14} />{t('export')}
          </button>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setChannelFilter('all'); setTypeFilter('all'); setDeliveryFilter('all'); setPage(1) }}
              className="flex items-center gap-1 px-3 py-2 rounded-[10px] border border-border-card text-[12px] text-text-muted hover:bg-surface-input"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-border-card rounded-[14px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-4 py-[10px] border-b border-border-divider flex items-center justify-between">
          <p className="text-[11px] text-text-muted">{filtered.length} records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-input">
                {([['userName', 'User'], ['phone', 'Phone'], ['channel', 'Channel'], ['type', 'Type'], ['message', 'Message'], ['created_at', 'Time'], ['delivery', 'Status']] as [string, string][]).map(([k, label]) => (
                  <th
                    key={k}
                    onClick={() => sort(k)}
                    className="px-[14px] py-[7px] text-start text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] cursor-pointer hover:text-text-secondary select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1">{label}<SortIcon k={k} /></span>
                  </th>
                ))}
                <th className="px-[14px] py-[7px] text-start text-[9px] font-semibold text-text-label uppercase tracking-[0.8px]">{t('retry')}</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-[14px] py-12 text-center text-[12px] text-text-muted">{t('no_data')}</td>
                </tr>
              ) : pageData.map((n) => (
                <tr key={n.id} className="border-b border-border-divider last:border-0 hover:bg-[#FFFBF4] transition-colors">
                  <td className="px-[14px] py-[9px]">
                    <p className="text-[11px] font-medium text-text-primary whitespace-nowrap">{n.userName}</p>
                    <p className="text-[10px] text-text-muted font-mono mt-px">{n.user_id}</p>
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-secondary whitespace-nowrap">{n.phone}</td>
                  <td className="px-[14px] py-[9px]">
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', CHANNEL_COLORS[n.channel])}>
                      {n.channel}
                    </span>
                  </td>
                  <td className="px-[14px] py-[9px]">
                    <span className="text-[10px] text-text-secondary bg-surface-input px-2 py-0.5 rounded-full whitespace-nowrap">
                      {n.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-[14px] py-[9px] max-w-64">
                    <p className="text-[11px] text-text-secondary truncate" title={n.message}>{n.message}</p>
                  </td>
                  <td className="px-[14px] py-[9px] text-[10px] text-text-muted whitespace-nowrap">{formatDateTime(n.created_at)}</td>
                  <td className="px-[14px] py-[9px]">
                    <StatusBadge status={n.delivery} />
                  </td>
                  <td className="px-[14px] py-[9px]">
                    {n.delivery === 'failed' && (
                      <button
                        onClick={() => retry(n.id)}
                        title="Retry"
                        className="p-1.5 rounded-[6px] hover:bg-status-warningBg text-status-warningText transition-colors"
                      >
                        <RefreshCw size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-divider">
          <p className="text-[11px] text-text-muted">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-40">«</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-40">‹</button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn('w-7 h-7 rounded-[6px] text-[11px] font-medium', p === page ? 'bg-brand-navy text-white' : 'text-text-secondary hover:bg-surface-input')}
                >
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-40">›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-40">»</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="bg-surface-card border border-border-card rounded-[14px] overflow-hidden animate-pulse">
      <div className="p-4 border-b border-border-divider">
        <div className="h-3 bg-surface-input rounded w-32" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-surface-input">
            {[...Array(8)].map((_, i) => (
              <th key={i} className="px-[14px] py-[7px]">
                <div className="h-2 bg-border-card rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, i) => (
            <tr key={i} className="border-b border-border-divider">
              {[...Array(8)].map((_, j) => (
                <td key={j} className="px-[14px] py-[9px]">
                  <div className="h-4 bg-surface-input rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
