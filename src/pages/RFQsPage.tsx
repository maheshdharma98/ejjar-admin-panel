import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Download, ChevronUp, ChevronDown, X, Eye } from 'lucide-react'
import { rfqsData, contractorsData, suppliersData } from '@/data'
import { cn, formatDate, formatDateTime, statusLabel, STATUS_COLORS, downloadCSV } from '@/lib/utils'

type RFQ = typeof rfqsData[0]
type SortKey = string
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 20

export default function RFQsPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<RFQ | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const contractorMap = useMemo(() => Object.fromEntries((contractorsData as {id:string;name:string}[]).map((c) => [c.id, c.name])), [])
  const supplierMap = useMemo(() => Object.fromEntries((suppliersData as {id:string;name:string}[]).map((s) => [s.id, s.name])), [])

  const statuses = useMemo(() => [...new Set<string>(rfqsData.map((r: RFQ) => r.status))], [])
  const categories = useMemo(() => [...new Set<string>(rfqsData.map((r: RFQ) => r.category))], [])
  const countries = useMemo(() => [...new Set<string>(rfqsData.map((r: RFQ) => r.country))], [])

  const filtered = useMemo(() => {
    let data = rfqsData as RFQ[]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          (contractorMap[r.contractor_id] || '').toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.subcategory.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') data = data.filter((r) => r.status === statusFilter)
    if (categoryFilter !== 'all') data = data.filter((r) => r.category === categoryFilter)
    if (countryFilter !== 'all') data = data.filter((r) => r.country === countryFilter)
    if (dateFrom) data = data.filter((r) => r.created_at >= dateFrom)
    if (dateTo) data = data.filter((r) => r.created_at <= dateTo + 'T23:59:59Z')
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey]
        const bv = (b as Record<string, unknown>)[sortKey]
        const res = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0
        return sortDir === 'asc' ? res : -res
      })
    }
    return data
  }, [search, statusFilter, categoryFilter, countryFilter, dateFrom, dateTo, sortKey, sortDir, contractorMap])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : (
      <ChevronDown size={13} className="opacity-30" />
    )

  const handleExport = () => {
    const rows = [
      ['ID', 'Contractor', 'Category', 'Subcategory', 'Country', 'City', 'Status', 'Quantity', 'Created'],
      ...filtered.map((r) => [
        r.id, contractorMap[r.contractor_id] || r.contractor_id,
        r.category, r.subcategory, r.country, r.city, r.status, String(r.quantity), r.created_at,
      ]),
    ]
    downloadCSV('rfqs.csv', rows)
  }

  const resetFilters = () => {
    setSearch(''); setStatusFilter('all'); setCategoryFilter('all')
    setCountryFilter('all'); setDateFrom(''); setDateTo(''); setPage(1)
  }

  const hasFilters = search || statusFilter !== 'all' || categoryFilter !== 'all' || countryFilter !== 'all' || dateFrom || dateTo

  if (loading) return <SkeletonTable cols={8} />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('rfqs')}</h1>
          <p className="text-slate-500 text-sm">{filtered.length} records</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#192433] text-white text-sm font-medium hover:bg-[#111b26] transition-colors">
          <Download size={15} />
          {t('export')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder={t('search') + '...'}
              className="w-full ps-9 pe-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30"
            />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30 bg-white">
            <option value="all">{t('status')}: {t('all')}</option>
            {statuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30 bg-white">
            <option value="all">{t('category')}: {t('all')}</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={countryFilter} onChange={(e) => { setCountryFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30 bg-white">
            <option value="all">{t('country')}: {t('all')}</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30 bg-white" />
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30 bg-white" />
          {hasFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">
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
                {(['id', 'contractor_id', 'category', 'country', 'status', 'created_at'] as string[]).map((k) => (
                  <th key={k} onClick={() => sort(k)} className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      {k === 'contractor_id' ? 'Contractor' : k === 'created_at' ? 'Created' : k.replace(/_/g, ' ')}
                      <SortIcon k={k} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide">Supplier Quotes</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">{t('no_data')}</td></tr>
              ) : pageData.map((rfq) => (
                <tr key={rfq.id} onClick={() => setSelected(rfq)} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{rfq.id}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">{contractorMap[rfq.contractor_id] || rfq.contractor_id}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-slate-700">{rfq.category}</span>
                    <span className="text-slate-400 text-xs ms-1">/ {rfq.subcategory}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{rfq.city}, {rfq.country}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[rfq.status] || 'bg-gray-100 text-gray-600')}>
                      {statusLabel(rfq.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(rfq.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-slate-600">{(rfq.supplier_responses as unknown[]).length} quotes</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={(e) => { e.stopPropagation(); setSelected(rfq) }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">«</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">‹</button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return (
                <button key={p} onClick={() => setPage(p)} className={cn('w-8 h-8 rounded text-sm', p === page ? 'bg-[#192433] text-white' : 'text-slate-500 hover:bg-slate-100')}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">»</button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800">RFQ Details</h2>
                <p className="text-xs font-mono text-slate-500">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field label="Contractor" value={contractorMap[selected.contractor_id] || selected.contractor_id} />
                <Field label="Category" value={`${selected.category} / ${selected.subcategory}`} />
                <Field label="Location" value={`${selected.city}, ${selected.country}`} />
                <Field label="Quantity" value={String(selected.quantity)} />
                <Field label="Start Date" value={formatDate(selected.start_date)} />
                <Field label="End Date" value={formatDate(selected.end_date)} />
                <Field label="Status" value={statusLabel(selected.status)} />
                <Field label="Created" value={formatDateTime(selected.created_at)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{selected.description}</p>
              </div>
              {(selected.supplier_responses as unknown[]).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Supplier Responses ({(selected.supplier_responses as unknown[]).length})</p>
                  <div className="space-y-2">
                    {(selected.supplier_responses as Array<{id:string;supplier_id:string;unit_price_usd:number;total_price_usd:number;currency:string;notes:string;submitted_at:string;status:string}>).map((sr) => (
                      <div key={sr.id} className="bg-slate-50 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-700">{supplierMap[sr.supplier_id] || sr.supplier_id}</span>
                          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[sr.status] || 'bg-gray-100 text-gray-600')}>{statusLabel(sr.status)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 text-xs text-slate-500">
                          <span>Unit: ${sr.unit_price_usd} {sr.currency}</span>
                          <span>Total: ${sr.total_price_usd.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 italic">{sr.notes}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDateTime(sr.submitted_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  )
}

function SkeletonTable({ cols }: { cols: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-32" />
      </div>
      <table className="w-full">
        <thead><tr className="border-b border-slate-100">{[...Array(cols)].map((_, i) => <th key={i} className="px-4 py-3"><div className="h-3 bg-slate-200 rounded" /></th>)}</tr></thead>
        <tbody>
          {[...Array(8)].map((_, i) => (
            <tr key={i} className="border-b border-slate-50">
              {[...Array(cols)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded" /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
