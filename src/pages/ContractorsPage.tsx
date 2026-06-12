// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronUp, ChevronDown, X, MoreVertical, Download, Eye } from 'lucide-react'
import {
  ADMIN_CONTRACTORS,
  getField,
} from '../adminDemoData'
import { cn, downloadCSV } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { usePageMeta } from '@/stores/pageStore'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'

type Contractor = typeof ADMIN_CONTRACTORS[0] & { status: string }

const PAGE_SIZE = 20

export default function ContractorsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar' : 'en'
  const role = useAuthStore((s) => s.role)
  usePageMeta('Contractor Management', `${ADMIN_CONTRACTORS.length} contractors · 🇴🇲 Oman`)

  const [contractors, setContractors] = useState<Contractor[]>(
    ADMIN_CONTRACTORS.map((c) => ({ ...c }))
  )
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [viewCon, setViewCon] = useState<Contractor | null>(null)
  const [dialog, setDialog] = useState<{ type: string; contractor: Contractor } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDialog(null); setViewCon(null); setDropdown(null) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const filtered = useMemo(() => {
    let data = contractors
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') data = data.filter((c) => c.status === statusFilter)
    return [...data].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortKey]
      const bv = (b as unknown as Record<string, unknown>)[sortKey]
      const res = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0
      return sortDir === 'asc' ? res : -res
    })
  }, [contractors, search, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const sort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: string }) =>
    sortKey === k ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : <ChevronDown size={11} className="opacity-30" />

  const mutate = (id: string, patch: Partial<Contractor>) =>
    setContractors((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const handleAction = (type: string, con: Contractor) => {
    setDropdown(null)
    if (type === 'view') { setViewCon(con); return }
    setDialog({ type, contractor: con })
  }

  const confirmDialog = () => {
    if (!dialog) return
    const { type, contractor } = dialog
    if (type === 'block') mutate(contractor.id, { status: 'blocked' })
    if (type === 'unblock') mutate(contractor.id, { status: 'active' })
    setDialog(null)
  }

  const handleExport = () => {
    const rows = [
      ['ID', 'Name', 'Company', 'City', 'Rating', 'Jobs', 'Verified', 'Status'],
      ...filtered.map((c) => [c.id, c.name, c.company, c.city, String(c.rating), String(c.jobs), String(c.verified), c.status]),
    ]
    downloadCSV('contractors.csv', rows)
  }

  if (loading) return <SkeletonTable />

  return (
    <div onClick={() => setDropdown(null)}>
      {/* Filter bar */}
      <div className="bg-surface-card border border-border-card rounded-[14px] p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={13} className="absolute start-3 top-1/2 -translate-y-1/2 text-brand-skyblue" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder={t('search') + '...'}
              className="w-full ps-8 pe-3 py-[10px] rounded-[12px] border-[1.5px] border-border-input bg-surface-input text-[13px] text-text-primary placeholder-text-label focus:outline-none focus:border-border-active focus:shadow-[0_0_0_3px_rgba(230,126,58,0.12)]"
            />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="px-3 py-[10px] rounded-[12px] border-[1.5px] border-border-input bg-surface-input text-[13px] text-text-primary focus:outline-none focus:border-border-active">
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          {(search || statusFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setPage(1) }} className="flex items-center gap-1 px-3 py-[10px] rounded-[12px] border-[1.5px] border-border-input text-[13px] text-text-secondary hover:bg-surface-input">
              <X size={12} /> Clear
            </button>
          )}
          <div className="ms-auto">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-brand-orange text-white text-[13px] font-bold hover:bg-[#D4692E] transition-colors shadow-[0_2px_12px_rgba(230,126,58,0.20)]">
              <Download size={13} strokeWidth={2} /> {t('export')}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-border-card rounded-[14px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-input">
                {[['name','Name'],['company','Company'],['city','City'],['rating','Rating'],['jobs','Jobs'],['status','Status'],['','']].map(([k,label]) => (
                  <th key={label||k} onClick={k ? () => sort(k) : undefined} className={cn('px-[14px] py-[7px] text-start text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] whitespace-nowrap', k && 'cursor-pointer hover:text-text-secondary select-none')}>
                    {label && <span className="inline-flex items-center gap-1">{label}{k && <SortIcon k={k} />}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={7}><EmptyState title="No contractors found" subtitle="Try adjusting your filters." /></td></tr>
              ) : pageData.map((con) => (
                <tr key={con.id} onClick={() => handleAction('view', con)} className="border-b border-border-divider hover:bg-[#FFFBF4] cursor-pointer transition-colors">
                  <td className="px-[14px] py-[9px]">
                    <p className="text-[11px] font-medium text-text-primary">{getField(con as unknown as Record<string, unknown>, 'name', lang)}</p>
                    <p className="font-mono text-[10px] text-text-muted">{con.id}</p>
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary">
                    {getField(con as unknown as Record<string, unknown>, 'company', lang)}
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary whitespace-nowrap">
                    🇴🇲 {getField(con as unknown as Record<string, unknown>, 'city', lang)}
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary">⭐ {con.rating}</td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary">{con.jobs}</td>
                  <td className="px-[14px] py-[9px]">
                    <StatusBadge status={con.status} />
                  </td>
                  {role !== 'Viewer' && (
                    <td className="px-[14px] py-[9px]">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setDropdown(dropdown === con.id ? null : con.id)} className="w-6 h-6 rounded-[6px] bg-surface-input flex items-center justify-center hover:bg-status-warningBg transition-colors group">
                          <MoreVertical size={11} className="text-text-muted group-hover:text-brand-orange" />
                        </button>
                        {dropdown === con.id && (
                          <div className="absolute end-0 top-8 z-20 bg-surface-card rounded-[10px] shadow-lg border border-border-card py-1 min-w-36">
                            <DropItem onClick={() => handleAction('view', con)}>View Details</DropItem>
                            {role === 'Super Admin' && (
                              con.status === 'active'
                                ? <DropItem onClick={() => handleAction('block', con)} danger>Block</DropItem>
                                : <DropItem onClick={() => handleAction('unblock', con)}>Unblock</DropItem>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} />
      </div>

      {/* Detail modal */}
      {viewCon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setViewCon(null)}>
          <div className="bg-surface-card rounded-[14px] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-divider">
              <p className="text-[13px] font-semibold text-text-primary">Contractor Details</p>
              <button onClick={() => setViewCon(null)} className="w-7 h-7 rounded-[6px] bg-surface-input flex items-center justify-center"><X size={14} className="text-text-muted" /></button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[10px] bg-brand-skyblue/10 flex items-center justify-center">
                  <span className="text-brand-skyblue font-bold text-lg">{viewCon.name[0]}</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-text-primary">{viewCon.name}</p>
                  <p className="text-[11px] text-text-muted">{viewCon.nameAr}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['ID', viewCon.id],
                  ['Company', viewCon.company],
                  ['City', `🇴🇲 ${viewCon.city}`],
                  ['Rating', `⭐ ${viewCon.rating}`],
                  ['Total Jobs', String(viewCon.jobs)],
                  ['Verified', viewCon.verified ? 'Yes ✓' : 'No'],
                ].map(([lbl, val]) => (
                  <div key={lbl}>
                    <p className="text-[9px] font-semibold text-text-label uppercase tracking-[0.7px] mb-[2px]">{lbl}</p>
                    <p className={cn('text-[12px] text-text-primary', lbl === 'ID' && 'font-mono text-text-muted')}>{val}</p>
                  </div>
                ))}
                <div>
                  <p className="text-[9px] font-semibold text-text-label uppercase tracking-[0.7px] mb-[2px]">Status</p>
                  <StatusBadge status={viewCon.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog(null)}>
          <div className="bg-surface-card rounded-[14px] shadow-2xl max-w-sm w-full p-5 mx-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-[13px] font-semibold text-text-primary mb-2">
              {dialog.type === 'block' ? 'Block Contractor' : 'Unblock Contractor'}
            </p>
            <p className="text-[12px] text-text-secondary mb-4">{`"${dialog.contractor.name}"?`}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDialog(null)} className="px-4 py-2 rounded-[12px] border-[1.5px] border-border-input text-[13px] font-medium text-text-secondary hover:bg-surface-input">{t('cancel')}</button>
              <button onClick={confirmDialog} className={cn('px-4 py-2 rounded-[12px] text-[13px] font-bold text-white', dialog.type === 'block' ? 'bg-semantic-error hover:bg-red-700' : 'bg-brand-navy hover:bg-brand-navy/80')}>
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DropItem({ onClick, children, danger }: { onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn('w-full text-start px-4 py-2 text-[12px] hover:bg-surface-input transition-colors', danger ? 'text-status-errorText' : 'text-text-primary')}>
      {children}
    </button>
  )
}

function Pagination({ page, totalPages, total, pageSize, onPage }: { page: number; totalPages: number; total: number; pageSize: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between px-[14px] py-[10px] border-t border-border-divider">
      <p className="text-[11px] text-text-muted">Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}</p>
      <div className="flex items-center gap-1">
        {['«','‹'].map((ch, i) => <button key={ch} onClick={() => onPage(i === 0 ? 1 : Math.max(1, page - 1))} disabled={page === 1} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-30">{ch}</button>)}
        {[...Array(Math.min(5, totalPages))].map((_, i) => { const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i; return <button key={p} onClick={() => onPage(p)} className={cn('w-7 h-7 rounded-[6px] text-[11px] font-medium', p === page ? 'bg-brand-navy text-white' : 'text-text-muted hover:bg-surface-input')}>{p}</button> })}
        {['›','»'].map((ch, i) => <button key={ch} onClick={() => onPage(i === 0 ? Math.min(totalPages, page + 1) : totalPages)} disabled={page === totalPages} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-30">{ch}</button>)}
      </div>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="bg-surface-card border border-border-card rounded-[14px] overflow-hidden animate-pulse">
      <table className="w-full">
        <thead><tr className="bg-surface-input">{[...Array(7)].map((_,i) => <th key={i} className="px-[14px] py-[7px]"><div className="h-2 bg-border-card rounded" /></th>)}</tr></thead>
        <tbody>{[...Array(6)].map((_,i) => <tr key={i} className="border-b border-border-divider">{[...Array(7)].map((_,j) => <td key={j} className="px-[14px] py-[9px]"><div className="h-3 bg-surface-input rounded" /></td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
