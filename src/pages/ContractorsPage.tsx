import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronUp, ChevronDown, X, MoreVertical, Download, Eye } from 'lucide-react'
import { contractorsData } from '@/data'
import { cn, formatDate, statusLabel, STATUS_COLORS, downloadCSV } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

type Contractor = typeof contractorsData[0] & { status: string }

const PAGE_SIZE = 20

export default function ContractorsPage() {
  const { t } = useTranslation()
  const role = useAuthStore((s) => s.role)
  const [loading, setLoading] = useState(true)
  const [contractors, setContractors] = useState<Contractor[]>(
    (contractorsData as Contractor[]).map((c) => ({ ...c }))
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [sortKey, setSortKey] = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
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

  const countries = useMemo(() => [...new Set<string>((contractorsData as {country:string}[]).map((c) => c.country))], [])
  const statuses = useMemo(() => [...new Set<string>((contractorsData as {status:string}[]).map((c) => c.status))], [])

  const filtered = useMemo(() => {
    let data = contractors
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.phone.includes(q))
    }
    if (statusFilter !== 'all') data = data.filter((c) => c.status === statusFilter)
    if (countryFilter !== 'all') data = data.filter((c) => c.country === countryFilter)
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey]
      const bv = (b as Record<string, unknown>)[sortKey]
      const res = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0
      return sortDir === 'asc' ? res : -res
    })
  }, [contractors, search, statusFilter, countryFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const sort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: string }) =>
    sortKey === k ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ChevronDown size={13} className="opacity-30" />

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
      ['ID', 'Name', 'Phone', 'Country', 'City', 'Total RFQs', 'Status', 'Joined'],
      ...filtered.map((c) => [c.id, c.name, c.phone, c.country, c.city, String(c.total_rfqs), c.status, c.created_at]),
    ]
    downloadCSV('contractors.csv', rows)
  }

  if (loading) return <SkeletonTable />

  return (
    <div className="space-y-4" onClick={() => setDropdown(null)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('contractors')}</h1>
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
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
            <option value="all">{t('status')}: {t('all')}</option>
            {statuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
          <select value={countryFilter} onChange={(e) => { setCountryFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
            <option value="all">{t('country')}: {t('all')}</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {(search || statusFilter !== 'all' || countryFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setCountryFilter('all'); setPage(1) }} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">
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
                {([['name', 'Name'], ['phone', 'Phone'], ['country', 'Country / City'], ['total_rfqs', 'RFQs'], ['status', 'Status'], ['created_at', 'Joined']] as [string,string][]).map(([k, label]) => (
                  <th key={k} onClick={() => sort(k)} className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">{label}<SortIcon k={k} /></span>
                  </th>
                ))}
                <th className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">{t('no_data')}</td></tr>
              ) : pageData.map((con) => (
                <tr key={con.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{con.name}</td>
                  <td className="px-4 py-3 text-slate-600">{con.phone}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{con.city}, {con.country}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-700">{con.total_rfqs}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[con.status] || 'bg-gray-100 text-gray-600')}>
                      {statusLabel(con.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(con.created_at)}</td>
                  <td className="px-4 py-3">
                    {role === 'Viewer' ? (
                      <button onClick={() => setViewCon(con)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Eye size={15} /></button>
                    ) : (
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setDropdown(dropdown === con.id ? null : con.id)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                          <MoreVertical size={15} />
                        </button>
                        {dropdown === con.id && (
                          <div className="absolute end-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-slate-100 py-1 min-w-36">
                            <DropItem onClick={() => handleAction('view', con)}>View</DropItem>
                            {con.status === 'active' ? (
                              <DropItem onClick={() => handleAction('block', con)} danger>Block</DropItem>
                            ) : (
                              <DropItem onClick={() => handleAction('unblock', con)}>Unblock</DropItem>
                            )}
                          </div>
                        )}
                      </div>
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

      {viewCon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setViewCon(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Contractor Details</h2>
              <button onClick={() => setViewCon(null)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <InfoRow label="Name" value={viewCon.name} />
              <InfoRow label="ID" value={viewCon.id} />
              <InfoRow label="Phone" value={viewCon.phone} />
              <InfoRow label="Location" value={`${viewCon.city}, ${viewCon.country}`} />
              <InfoRow label="Total RFQs" value={String(viewCon.total_rfqs)} />
              <InfoRow label="Status" value={statusLabel(viewCon.status)} />
              <InfoRow label="Joined" value={formatDate(viewCon.created_at)} />
            </div>
          </div>
        </div>
      )}

      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-2 capitalize">{dialog.type === 'block' ? 'Block Contractor' : 'Unblock Contractor'}</h3>
            <p className="text-sm text-slate-600 mb-4">
              {dialog.type === 'block' ? `Block "${dialog.contractor.name}"? They won't be able to post RFQs.` : `Unblock "${dialog.contractor.name}"?`}
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDialog(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">{t('cancel')}</button>
              <button onClick={confirmDialog} className={cn('px-4 py-2 rounded-lg text-sm font-medium text-white', dialog.type === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#1A4FBA] hover:bg-[#1540a0]')}>
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
    <button onClick={onClick} className={cn('w-full text-start px-4 py-2 text-sm hover:bg-slate-50 transition-colors', danger ? 'text-red-600' : 'text-slate-700')}>
      {children}
    </button>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-100"><div className="h-4 bg-slate-200 rounded w-32" /></div>
      <table className="w-full"><thead><tr className="border-b border-slate-100">{[...Array(7)].map((_, i) => <th key={i} className="px-4 py-3"><div className="h-3 bg-slate-200 rounded" /></th>)}</tr></thead>
        <tbody>{[...Array(8)].map((_, i) => <tr key={i} className="border-b border-slate-50">{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded" /></td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
