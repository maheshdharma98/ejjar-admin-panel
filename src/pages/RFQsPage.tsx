// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Download, ChevronUp, ChevronDown, X, Eye } from 'lucide-react'
import {
  ADMIN_RFQS,
  getField,
  formatOMR,
} from '../adminDemoData'
import { cn, downloadCSV } from '@/lib/utils'
import { usePageMeta } from '@/stores/pageStore'
import StatusBadge from '@/components/ui/StatusBadge'
import CategoryChip from '@/components/ui/CategoryChip'
import EmptyState from '@/components/ui/EmptyState'

type RFQ = typeof ADMIN_RFQS[0]
type SortKey = string
type SortDir = 'asc' | 'desc'

function statusLabelAr(status: string): string {
  const labels: Record<string, string> = {
    negotiating: 'قيد التفاوض',
    receiving_quotes: 'استلام عروض',
    broadcasted: 'تم البث',
    accepted: 'مقبول',
    rejected: 'مرفوض',
  }
  return labels[status] || status
}

export default function RFQsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar' : 'en'
  usePageMeta(
    lang === 'ar' ? 'إدارة طلبات العروض' : 'RFQ Management',
    lang === 'ar' ? `${ADMIN_RFQS.length} طلبات · 🇴🇲 عُمان` : `${ADMIN_RFQS.length} RFQs · 🇴🇲 Oman`
  )

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<RFQ | null>(null)

  const PAGE_SIZE = 20

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const statuses = useMemo(() => [...new Set<string>(ADMIN_RFQS.map((r) => r.status))], [])

  const filtered = useMemo(() => {
    let data = ADMIN_RFQS as RFQ[]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.subcategory.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.contractor.toLowerCase().includes(q) ||
          r.contractorCompany.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') data = data.filter((r) => r.status === statusFilter)
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = (a as unknown as Record<string, unknown>)[sortKey]
        const bv = (b as unknown as Record<string, unknown>)[sortKey]
        const res = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0
        return sortDir === 'asc' ? res : -res
      })
    }
    return data
  }, [search, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
    ) : (
      <ChevronDown size={11} className="opacity-30" />
    )

  const handleExport = () => {
    const rows = [
      ['ID', 'Contractor', 'Category', 'Subcategory', 'City', 'Country', 'Budget Min', 'Budget Max', 'Status', 'Date'],
      ...filtered.map((r) => [
        r.id, r.contractorCompany, r.category, r.subcategory, r.city, r.country,
        String(r.budgetMin), String(r.budgetMax), r.status, r.date,
      ]),
    ]
    downloadCSV('rfqs.csv', rows)
  }

  if (loading) return <SkeletonTable />

  return (
    <>
      {/* Filter bar */}
      <div className="bg-surface-card border border-border-card rounded-[14px] p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
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
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-[10px] rounded-[12px] border-[1.5px] border-border-input bg-surface-input text-[13px] text-text-primary focus:outline-none focus:border-border-active"
          >
            <option value="all">Status: All</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{lang === 'ar' ? statusLabelAr(s) : s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          {(search || statusFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setPage(1) }}
              className="flex items-center gap-1 px-3 py-[10px] rounded-[12px] border-[1.5px] border-border-input text-[13px] text-text-secondary hover:bg-surface-input transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
          <div className="ms-auto">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-brand-orange text-white text-[13px] font-bold hover:bg-[#D4692E] transition-colors shadow-[0_2px_12px_rgba(230,126,58,0.20)]"
            >
              <Download size={13} strokeWidth={2} />
              {t('export')}
            </button>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-surface-card border border-border-card rounded-[14px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-input">
                {[
                  { k: 'id', label: 'ID' },
                  { k: 'category', label: 'Category' },
                  { k: '', label: 'Contractor' },
                  { k: 'city', label: 'Location' },
                  { k: '', label: 'Budget' },
                  { k: '', label: 'Notified / Quotes' },
                  { k: 'status', label: 'Status' },
                  { k: '', label: '' },
                ].map(({ k, label }) => (
                  <th
                    key={label || k}
                    onClick={k ? () => sort(k) : undefined}
                    className={cn(
                      'px-[14px] py-[7px] text-start text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] whitespace-nowrap',
                      k && 'cursor-pointer hover:text-text-secondary select-none'
                    )}
                  >
                    {label && (
                      <span className="inline-flex items-center gap-1">
                        {label}
                        {k && <SortIcon k={k} />}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState title="No RFQs found" subtitle="Try adjusting your search or filters." />
                  </td>
                </tr>
              ) : pageData.map((rfq) => (
                <tr
                  key={rfq.id}
                  onClick={() => setSelected(rfq)}
                  className="border-b border-border-divider hover:bg-[#FFFBF4] cursor-pointer transition-colors"
                >
                  <td className="px-[14px] py-[9px]">
                    <span className="font-mono text-[10px] text-text-muted">{rfq.id}</span>
                  </td>
                  <td className="px-[14px] py-[9px]">
                    <CategoryChip category={rfq.category} />
                    <span className="text-text-muted text-[10px] ms-1">/ {getField(rfq as unknown as Record<string, unknown>, 'subcategory', lang)}</span>
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary font-medium whitespace-nowrap">
                    {getField(rfq as unknown as Record<string, unknown>, 'contractorCompany', lang)}
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary whitespace-nowrap">
                    🇴🇲 {getField(rfq as unknown as Record<string, unknown>, 'city', lang)}
                  </td>
                  <td className="px-[14px] py-[9px] text-[10px] text-text-muted whitespace-nowrap">
                    {formatOMR(rfq.budgetMin, lang)} – {formatOMR(rfq.budgetMax, lang)}
                  </td>
                  <td className="px-[14px] py-[9px] text-[11px] text-text-primary font-medium">
                    {rfq.suppliersNotified} / {rfq.quotesReceived}
                  </td>
                  <td className="px-[14px] py-[9px]">
                    <StatusBadge status={rfq.status} customLabel={lang === 'ar' ? statusLabelAr(rfq.status) : undefined} />
                  </td>
                  <td className="px-[14px] py-[9px]">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(rfq) }}
                      className="w-6 h-6 rounded-[6px] bg-surface-input flex items-center justify-center hover:bg-status-warningBg transition-colors group"
                    >
                      <Eye size={11} className="text-text-muted group-hover:text-brand-orange" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-[14px] py-[10px] border-t border-border-divider">
          <p className="text-[11px] text-text-muted">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <PagBtn onClick={() => setPage(1)} disabled={page === 1}>«</PagBtn>
            <PagBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</PagBtn>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn('w-7 h-7 rounded-[6px] text-[11px] font-medium transition-colors', p === page ? 'bg-brand-navy text-white' : 'text-text-muted hover:bg-surface-input')}
                >
                  {p}
                </button>
              )
            })}
            <PagBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</PagBtn>
            <PagBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PagBtn>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-surface-card rounded-[14px] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-divider">
              <div>
                <p className="text-[13px] font-semibold text-text-primary">RFQ Details</p>
                <p className="font-mono text-[10px] text-text-muted">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-[6px] bg-surface-input flex items-center justify-center hover:bg-status-errorBg transition-colors">
                <X size={14} className="text-text-muted" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <DetailField label="Contractor" value={getField(selected as unknown as Record<string, unknown>, 'contractorCompany', lang)} />
              <DetailField label="Category" value={`${getField(selected as unknown as Record<string, unknown>, 'category', lang)} / ${getField(selected as unknown as Record<string, unknown>, 'subcategory', lang)}`} />
              <DetailField label="Location" value={`🇴🇲 ${getField(selected as unknown as Record<string, unknown>, 'city', lang)}, Oman`} />
              <DetailField label="Budget" value={`${formatOMR(selected.budgetMin, lang)} – ${formatOMR(selected.budgetMax, lang)}`} />
              <DetailField label="Suppliers Notified" value={String(selected.suppliersNotified)} />
              <DetailField label="Quotes Received" value={String(selected.quotesReceived)} />
              <DetailField label="Date" value={selected.date} />
              <div>
                <p className="text-[9px] font-semibold text-text-label uppercase tracking-[0.7px] mb-1">Status</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PagBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} className="w-7 h-7 rounded-[6px] text-[11px] text-text-muted hover:bg-surface-input disabled:opacity-30 transition-colors">
      {children}
    </button>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-semibold text-text-label uppercase tracking-[0.7px] mb-1">{label}</p>
      <p className="text-[12px] text-text-primary">{value}</p>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="bg-surface-card border border-border-card rounded-[14px] overflow-hidden animate-pulse">
      <div className="p-4 border-b border-border-divider">
        <div className="h-3 bg-border-card rounded w-32" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-surface-input">
            {[...Array(8)].map((_, i) => <th key={i} className="px-[14px] py-[7px]"><div className="h-2 bg-border-card rounded" /></th>)}
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, i) => (
            <tr key={i} className="border-b border-border-divider">
              {[...Array(8)].map((_, j) => <td key={j} className="px-[14px] py-[9px]"><div className="h-3 bg-surface-input rounded" /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
