import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronUp, ChevronDown, X, CheckCircle, XCircle, MoreVertical, Download } from 'lucide-react'
import { suppliersData } from '@/data'
import { cn, formatDate, statusLabel, STATUS_COLORS, downloadCSV } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

type Supplier = typeof suppliersData[0] & { status: string }

const TIER_STYLES: Record<string, string> = {
  basic: 'bg-slate-100 text-slate-600',
  pro: 'bg-blue-100 text-blue-700',
  platinum: 'bg-amber-100 text-amber-700',
}

const PAGE_SIZE = 20

export default function SuppliersPage() {
  const { t } = useTranslation()
  const role = useAuthStore((s) => s.role)
  const [loading, setLoading] = useState(true)
  const [suppliers, setSuppliers] = useState<Supplier[]>(
    (suppliersData as Supplier[]).map((s) => ({ ...s, status: 'active' }))
  )
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [sortKey, setSortKey] = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [sheetSup, setSheetSup] = useState<Supplier | null>(null)
  const [dialog, setDialog] = useState<{ type: string; supplier: Supplier } | null>(null)
  const [tierSelect, setTierSelect] = useState('')

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

  const countries = useMemo(() => [...new Set<string>((suppliersData as {country:string}[]).map((s) => s.country))], [])

  const filtered = useMemo(() => {
    let data = suppliers
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((s) => s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.city.toLowerCase().includes(q))
    }
    if (tierFilter !== 'all') data = data.filter((s) => s.subscription_tier === tierFilter)
    if (countryFilter !== 'all') data = data.filter((s) => s.country === countryFilter)
    if (verifiedFilter !== 'all') data = data.filter((s) => String(s.verified) === verifiedFilter)
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey]
      const bv = (b as Record<string, unknown>)[sortKey]
      const res = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0
      return sortDir === 'asc' ? res : -res
    })
  }, [suppliers, search, tierFilter, countryFilter, verifiedFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const sort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: string }) =>
    sortKey === k ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ChevronDown size={13} className="opacity-30" />

  const mutate = (id: string, patch: Partial<Supplier>) =>
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const handleAction = (type: string, sup: Supplier) => {
    setDropdown(null)
    if (type === 'view') { setSheetSup(sup); return }
    if (type === 'tier') { setTierSelect(sup.subscription_tier); }
    setDialog({ type, supplier: sup })
  }

  const confirmDialog = () => {
    if (!dialog) return
    const { type, supplier } = dialog
    if (type === 'verify') mutate(supplier.id, { verified: true })
    if (type === 'block') mutate(supplier.id, { status: 'blocked' })
    if (type === 'unblock') mutate(supplier.id, { status: 'active' })
    if (type === 'tier') mutate(supplier.id, { subscription_tier: tierSelect })
    setDialog(null)
  }

  const handleExport = () => {
    const rows = [
      ['ID', 'Company', 'Country', 'City', 'Tier', 'Verified', 'Status', 'Rating', 'Joined'],
      ...filtered.map((s) => [s.id, s.name, s.country, s.city, s.subscription_tier, String(s.verified), s.status, String(s.rating), s.created_at]),
    ]
    downloadCSV('suppliers.csv', rows)
  }

  if (loading) return <SkeletonTable />

  return (
    <div className="space-y-4" onClick={() => setDropdown(null)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('suppliers')}</h1>
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
          <select value={tierFilter} onChange={(e) => { setTierFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
            <option value="all">Tier: All</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="platinum">Platinum</option>
          </select>
          <select value={countryFilter} onChange={(e) => { setCountryFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
            <option value="all">{t('country')}: {t('all')}</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={verifiedFilter} onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1) }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
            <option value="all">Verified: All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          {(search || tierFilter !== 'all' || countryFilter !== 'all' || verifiedFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setTierFilter('all'); setCountryFilter('all'); setVerifiedFilter('all'); setPage(1) }} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">
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
                {([['name', 'Company'], ['country', 'Country'], ['subscription_tier', 'Tier'], ['verified', 'Verified'], ['status', 'Status'], ['created_at', 'Joined']] as [string,string][]).map(([k, label]) => (
                  <th key={k} onClick={() => sort(k)} className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">{label}<SortIcon k={k} /></span>
                  </th>
                ))}
                {role !== 'Viewer' && <th className="px-4 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">{t('no_data')}</td></tr>
              ) : pageData.map((sup) => (
                <tr key={sup.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{sup.name}</p>
                    <p className="text-xs text-slate-400">{sup.city}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{sup.country}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', TIER_STYLES[sup.subscription_tier] || 'bg-gray-100 text-gray-600')}>
                      {sup.subscription_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {sup.verified ? (
                      <CheckCircle size={16} className="text-emerald-500" />
                    ) : (
                      <XCircle size={16} className="text-slate-300" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[sup.status] || 'bg-gray-100 text-gray-600')}>
                      {statusLabel(sup.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(sup.created_at)}</td>
                  {role !== 'Viewer' && (
                    <td className="px-4 py-3">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setDropdown(dropdown === sup.id ? null : sup.id)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                          <MoreVertical size={15} />
                        </button>
                        {dropdown === sup.id && (
                          <div className="absolute end-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-slate-100 py-1 min-w-44">
                            <DropItem onClick={() => handleAction('view', sup)}>View Details</DropItem>
                            {role === 'Super Admin' && (
                              <>
                                {!sup.verified && <DropItem onClick={() => handleAction('verify', sup)}>Verify</DropItem>}
                                {sup.status === 'active' ? (
                                  <DropItem onClick={() => handleAction('block', sup)} danger>Block</DropItem>
                                ) : (
                                  <DropItem onClick={() => handleAction('unblock', sup)}>Unblock</DropItem>
                                )}
                                <DropItem onClick={() => handleAction('tier', sup)}>Change Tier</DropItem>
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

      {sheetSup && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSheetSup(null)}>
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl" dir="ltr" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Supplier Details</h2>
              <button onClick={() => setSheetSup(null)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1A4FBA]/10 flex items-center justify-center">
                  <span className="text-[#1A4FBA] font-bold text-lg">{sheetSup.name[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{sheetSup.name}</p>
                  <p className="text-sm text-slate-500">{sheetSup.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">{sheetSup.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label="ID" value={sheetSup.id} />
                <InfoRow label="Phone" value={sheetSup.phone} />
                <InfoRow label="Country" value={sheetSup.country} />
                <InfoRow label="City" value={sheetSup.city} />
                <InfoRow label="Tier" value={sheetSup.subscription_tier} />
                <InfoRow label="Rating" value={`${sheetSup.rating} ★`} />
                <InfoRow label="Verified" value={sheetSup.verified ? 'Yes' : 'No'} />
                <InfoRow label="Status" value={sheetSup.status} />
                <InfoRow label="Joined" value={formatDate(sheetSup.created_at)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {(sheetSup.categories as string[]).map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs capitalize">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-2 capitalize">
              {dialog.type === 'verify' ? 'Verify Supplier' : dialog.type === 'block' ? 'Block Supplier' : dialog.type === 'unblock' ? 'Unblock Supplier' : 'Change Tier'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {dialog.type === 'verify' && `Mark "${dialog.supplier.name}" as verified?`}
              {dialog.type === 'block' && `Block "${dialog.supplier.name}"? They won't be able to respond to RFQs.`}
              {dialog.type === 'unblock' && `Unblock "${dialog.supplier.name}"?`}
              {dialog.type === 'tier' && `Change subscription tier for "${dialog.supplier.name}".`}
            </p>
            {dialog.type === 'tier' && (
              <select value={tierSelect} onChange={(e) => setTierSelect(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]/30">
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="platinum">Platinum</option>
              </select>
            )}
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

function Pagination({ page, totalPages, total, pageSize, onPage }: { page: number; totalPages: number; total: number; pageSize: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(1)} disabled={page === 1} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">«</button>
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">‹</button>
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
          return <button key={p} onClick={() => onPage(p)} className={cn('w-8 h-8 rounded text-sm', p === page ? 'bg-[#1A4FBA] text-white' : 'text-slate-500 hover:bg-slate-100')}>{p}</button>
        })}
        <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">›</button>
        <button onClick={() => onPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 rounded text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40">»</button>
      </div>
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
