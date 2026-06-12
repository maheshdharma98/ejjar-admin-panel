// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronUp, ChevronDown, X, CheckCircle, XCircle, MoreVertical, Download } from 'lucide-react'
import {
  ADMIN_SUPPLIERS,
  getField,
} from '../adminDemoData'
import { cn, downloadCSV } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { usePageMeta } from '@/stores/pageStore'
import StatusBadge from '@/components/ui/StatusBadge'
import CategoryChip from '@/components/ui/CategoryChip'
import EmptyState from '@/components/ui/EmptyState'

type Supplier = typeof ADMIN_SUPPLIERS[0]

const PAGE_SIZE = 20

export default function SuppliersPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar' : 'en'
  const role = useAuthStore((s) => s.role)
  usePageMeta('Supplier Management', `${ADMIN_SUPPLIERS.length} suppliers · 🇴🇲 Oman`)

  const [suppliers, setSuppliers] = useState<Supplier[]>(ADMIN_SUPPLIERS.map((s) => ({ ...s })))
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [sheetSup, setSheetSup] = useState<Supplier | null>(null)
  const [dialog, setDialog] = useState<{ type: string; supplier: Supplier } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDialog(null); setSheetSup(null); setDropdown(null) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const categories = useMemo(() => [...new Set<string>(ADMIN_SUPPLIERS.map((s) => s.category))], [])

  const filtered = useMemo(() => {
    let data = suppliers
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.nameAr.includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      )
    }
    if (categoryFilter !== 'all') data = data.filter((s) => s.category === categoryFilter)
    if (verifiedFilter !== 'all') data = data.filter((s) => String(s.verified) === verifiedFilter)
    return [...data].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortKey]
      const bv = (b as unknown as Record<string, unknown>)[sortKey]
      const res = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0
      return sortDir === 'asc' ? res : -res
    })
  }, [suppliers, search, categoryFilter, verifiedFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const sort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: string }) =>
    sortKey === k ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : <ChevronDown size={11} className="opacity-30" />

  const mutate = (id: string, patch: Partial<Supplier>) =>
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const handleAction = (type: string, sup: Supplier) => {
    setDropdown(null)
    if (type === 'view') { setSheetSup(sup); return }
    setDialog({ type, supplier: sup })
  }

  const confirmDialog = () => {
    if (!dialog) return
    const { type, supplier } = dialog
    if (type === 'verify') mutate(supplier.id, { verified: true })
    if (type === 'block') mutate(supplier.id, { status: 'blocked' })
    if (type === 'unblock') mutate(supplier.id, { status: 'active' })
    setDialog(null)
  }

  const handleExport = () => {
    const rows = [
      ['ID', 'Name', 'Company', 'Category', 'City', 'Rating', 'Jobs', 'Verified', 'Status'],
      ...filtered.map((s) => [s.id, s.name, s.company, s.category, s.city, String(s.rating), String(s.jobs), String(s.verified), s.status]),
    ]
    downloadCSV('suppliers.csv', rows)
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
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }} className="px-3 py-[10px] rounded-[12px] border-[1.5px] border-border-input bg-surface-input text-[13px] text-text-primary focus:outline-none focus:border-border-active">
            <option value="all">Category: All</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={verifiedFilter} onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1) }} className="px-3 py-[10px] rounded-[12px] border-[1.5px] border-border-input bg-surface-input text-[13px] text-text-primary focus:outline-none focus:border-border-active">
            <option value="all">Verified: All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          {(search || categoryFilter !== 'all' || verifiedFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setCategoryFilter('all'); setVerifiedFilter('all'); setPage(1) }} className="flex items-center gap-1 px-3 py-[10px] rounded-[12px] border-[1.5px] border-border-input text-[13px] text-text-secondary hover:bg-surface-input">
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
                {[['name','Name'],['category','Category'],['city','City'],['rating','Rating'],['jobs','Jobs'],['','Verified'],['status','Status'],['','']].map(([k,label]) => (
                  <th key={label||k} onClick={k ? () => sort(k) : undefined} className={cn('px-[14px] py-[7px] text-start text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] whitespace-nowrap', k && 'cursor-pointer hover:text-text-secondary select-none')}>
                    {label && <span className="inline-flex items-center gap-1">{label}{k && <SortIcon k={k} />}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={8}><EmptyState title="No suppliers found" subtitle="Try adjusting your filters." /></td></tr>
              ) : pageData.map((sup) => (
                <tr key={sup.id} onClick={() => handleAction('view', sup)} className="border-b border-border-divider hover:bg-[#FFFBF4] cursor-pointer transition-colors">
                  <td className="px-[14px] py-[9px]">
                    <p className="text-[11px] font-medium text-text-primary">{getField(sup as unknown as Record<string, unknown>, 'name', lang)}</p>
                    <p className="font-mono text-[10px] text-text-muted">{sup.id}</p>
                  </td>
                  <td className="px-[14px] py-[9px]">
                    <CategoryChip category={sup.category} />
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary whitespace-nowrap">
                    🇴🇲 {getField(sup as unknown as Record<string, unknown>, 'city', lang)}
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary">
                    ⭐ {sup.rating}
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary">{sup.jobs}</td>
                  <td className="px-[14px] py-[9px]">
                    {sup.verified
                      ? <CheckCircle size={14} className="text-semantic-success" />
                      : <XCircle size={14} className="text-text-label" />}
                  </td>
                  <td className="px-[14px] py-[9px]">
                    <StatusBadge status={sup.status} />
                  </td>
                  {role !== 'Viewer' && (
                    <td className="px-[14px] py-[9px]">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setDropdown(dropdown === sup.id ? null : sup.id)} className="w-6 h-6 rounded-[6px] bg-surface-input flex items-center justify-center hover:bg-status-warningBg transition-colors group">
                          <MoreVertical size={11} className="text-text-muted group-hover:text-brand-orange" />
                        </button>
                        {dropdown === sup.id && (
                          <div className="absolute end-0 top-8 z-20 bg-surface-card rounded-[10px] shadow-lg border border-border-card py-1 min-w-40">
                            <DropItem onClick={() => handleAction('view', sup)}>View Details</DropItem>
                            {role === 'Super Admin' && (
                              <>
                                {!sup.verified && <DropItem onClick={() => handleAction('verify', sup)}>Verify</DropItem>}
                                {sup.status === 'active'
                                  ? <DropItem onClick={() => handleAction('block', sup)} danger>Block</DropItem>
                                  : <DropItem onClick={() => handleAction('unblock', sup)}>Unblock</DropItem>}
                              </>
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

      {/* Detail sheet */}
      {sheetSup && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSheetSup(null)}>
          <div className="w-full max-w-sm bg-surface-card h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-divider">
              <p className="text-[13px] font-semibold text-text-primary">Supplier Details</p>
              <button onClick={() => setSheetSup(null)} className="w-7 h-7 rounded-[6px] bg-surface-input flex items-center justify-center"><X size={14} className="text-text-muted" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[10px] bg-brand-orange/10 flex items-center justify-center">
                  <span className="text-brand-orange font-bold text-lg">{sheetSup.name[0]}</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-text-primary">{sheetSup.name}</p>
                  <p className="text-[11px] text-text-muted">{sheetSup.nameAr}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['ID', sheetSup.id],
                  ['Company', sheetSup.company],
                  ['Category', sheetSup.category],
                  ['City', `🇴🇲 ${sheetSup.city}`],
                  ['Rating', `⭐ ${sheetSup.rating}`],
                  ['Total Jobs', String(sheetSup.jobs)],
                  ['Verified', sheetSup.verified ? 'Yes ✓' : 'No'],
                  ['Status', sheetSup.status],
                ].map(([lbl, val]) => (
                  <div key={lbl}>
                    <p className="text-[9px] font-semibold text-text-label uppercase tracking-[0.7px] mb-[2px]">{lbl}</p>
                    <p className={cn('text-[12px] text-text-primary', lbl === 'ID' && 'font-mono text-text-muted')}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog(null)}>
          <div className="bg-surface-card rounded-[14px] shadow-2xl max-w-sm w-full p-5 mx-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-[13px] font-semibold text-text-primary mb-2 capitalize">
              {dialog.type === 'verify' ? 'Verify Supplier' : dialog.type === 'block' ? 'Block Supplier' : 'Unblock Supplier'}
            </p>
            <p className="text-[12px] text-text-secondary mb-4">{`"${dialog.supplier.name}"?`}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDialog(null)} className="px-4 py-2 rounded-[12px] border-[1.5px] border-border-input text-[13px] font-medium text-text-secondary hover:bg-surface-input">{t('cancel')}</button>
              <button onClick={confirmDialog} className={cn('px-4 py-2 rounded-[12px] text-[13px] font-bold text-white transition-colors', dialog.type === 'block' ? 'bg-semantic-error hover:bg-red-700' : 'bg-brand-navy hover:bg-brand-navy/80')}>
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
      <p className="text-[11px] text-text-muted">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        {['«','‹'].map((ch, i) => (
          <button key={ch} onClick={() => onPage(i === 0 ? 1 : Math.max(1, page - 1))} disabled={page === 1} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-30">{ch}</button>
        ))}
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
          return <button key={p} onClick={() => onPage(p)} className={cn('w-7 h-7 rounded-[6px] text-[11px] font-medium', p === page ? 'bg-brand-navy text-white' : 'text-text-muted hover:bg-surface-input')}>{p}</button>
        })}
        {['›','»'].map((ch, i) => (
          <button key={ch} onClick={() => onPage(i === 0 ? Math.min(totalPages, page + 1) : totalPages)} disabled={page === totalPages} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-30">{ch}</button>
        ))}
      </div>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="bg-surface-card border border-border-card rounded-[14px] overflow-hidden animate-pulse">
      <table className="w-full">
        <thead><tr className="bg-surface-input">{[...Array(8)].map((_,i) => <th key={i} className="px-[14px] py-[7px]"><div className="h-2 bg-border-card rounded" /></th>)}</tr></thead>
        <tbody>{[...Array(6)].map((_,i) => <tr key={i} className="border-b border-border-divider">{[...Array(8)].map((_,j) => <td key={j} className="px-[14px] py-[9px]"><div className="h-3 bg-surface-input rounded" /></td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
