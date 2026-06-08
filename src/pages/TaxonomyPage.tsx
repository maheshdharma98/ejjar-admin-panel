import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Download, Upload, ChevronDown, ChevronRight, X } from 'lucide-react'
import { taxonomyData } from '@/data'
import { cn, downloadCSV } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

type TaxItem = { slug: string; label_en: string; label_ar: string; synonyms: string[] }
type Taxonomy = Record<string, TaxItem[]>

export default function TaxonomyPage() {
  const { t } = useTranslation()
  const role = useAuthStore((s) => s.role)
  const isSuperAdmin = role === 'Super Admin'
  const [loading, setLoading] = useState(true)
  const [taxonomy, setTaxonomy] = useState<Taxonomy>(taxonomyData as Taxonomy)
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({ manpower: true })
  const [selected, setSelected] = useState<{ cat: string; item: TaxItem } | null>(null)
  const [editItem, setEditItem] = useState<TaxItem | null>(null)
  const [synonymInput, setSynonymInput] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ cat: string; slug: string } | null>(null)
  const [addDialog, setAddDialog] = useState<{ cat: string } | null>(null)
  const [newItem, setNewItem] = useState<TaxItem>({ slug: '', label_en: '', label_ar: '', synonyms: [] })
  const [newSynInput, setNewSynInput] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDeleteDialog(null); setAddDialog(null) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (selected) {
      setEditItem({ ...selected.item, synonyms: [...selected.item.synonyms] })
      setSynonymInput('')
    }
  }, [selected])

  const toggleCat = (cat: string) => setOpenCats((p) => ({ ...p, [cat]: !p[cat] }))

  const selectItem = (cat: string, item: TaxItem) => setSelected({ cat, item })

  const handleSave = () => {
    if (!editItem || !selected) return
    setTaxonomy((prev) => ({
      ...prev,
      [selected.cat]: prev[selected.cat].map((i) => (i.slug === selected.item.slug ? editItem : i)),
    }))
    setSelected({ ...selected, item: editItem })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = () => {
    if (!deleteDialog) return
    setTaxonomy((prev) => ({
      ...prev,
      [deleteDialog.cat]: prev[deleteDialog.cat].filter((i) => i.slug !== deleteDialog.slug),
    }))
    if (selected?.cat === deleteDialog.cat && selected.item.slug === deleteDialog.slug) {
      setSelected(null)
      setEditItem(null)
    }
    setDeleteDialog(null)
  }

  const handleAdd = () => {
    if (!addDialog || !newItem.slug || !newItem.label_en) return
    const slug = newItem.slug.toLowerCase().replace(/\s+/g, '_')
    setTaxonomy((prev) => ({
      ...prev,
      [addDialog.cat]: [...prev[addDialog.cat], { ...newItem, slug }],
    }))
    setAddDialog(null)
    setNewItem({ slug: '', label_en: '', label_ar: '', synonyms: [] })
    setNewSynInput('')
  }

  const addSynonym = () => {
    if (!synonymInput.trim() || !editItem) return
    setEditItem({ ...editItem, synonyms: [...editItem.synonyms, synonymInput.trim()] })
    setSynonymInput('')
  }

  const removeSynonym = (s: string) => {
    if (!editItem) return
    setEditItem({ ...editItem, synonyms: editItem.synonyms.filter((x) => x !== s) })
  }

  const handleExport = () => {
    const rows = [['Category', 'Slug', 'Label EN', 'Label AR', 'Synonyms']]
    Object.entries(taxonomy).forEach(([cat, items]) => {
      items.forEach((item) => {
        rows.push([cat, item.slug, item.label_en, item.label_ar, item.synonyms.join('; ')])
      })
    })
    downloadCSV('taxonomy.csv', rows)
  }

  if (loading) return (
    <div className="bg-white rounded-xl p-6 animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('taxonomy')}</h1>
          <p className="text-slate-500 text-sm">{Object.values(taxonomy).reduce((s, a) => s + a.length, 0)} items across {Object.keys(taxonomy).length} categories</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={15} />{t('export')}
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
            <Upload size={15} />{t('import')}
            <input type="file" accept=".csv" className="hidden" onChange={() => {}} />
          </label>
        </div>
      </div>

      <div className="flex gap-4" style={{ minHeight: '600px' }}>
        <div className="w-[35%] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase">Categories</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {Object.entries(taxonomy).map(([cat, items]) => (
              <div key={cat} className="border-b border-slate-50 last:border-0">
                <div
                  onClick={() => toggleCat(cat)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {openCats[cat] ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                    <span className="font-semibold text-slate-700 capitalize">{cat}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{items.length}</span>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setAddDialog({ cat }); setNewItem({ slug: '', label_en: '', label_ar: '', synonyms: [] }) }}
                      className="p-1 rounded-lg hover:bg-[#192433]/10 text-[#192433] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
                {openCats[cat] && (
                  <div className="pb-1">
                    {items.map((item) => (
                      <div
                        key={item.slug}
                        onClick={() => selectItem(cat, item)}
                        className={cn('group flex items-center justify-between px-8 py-2 cursor-pointer hover:bg-slate-50 transition-colors text-sm', selected?.cat === cat && selected.item.slug === item.slug ? 'bg-[#192433]/5 text-[#192433] font-medium' : 'text-slate-600')}
                      >
                        <span>{item.label_en}</span>
                        {isSuperAdmin && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteDialog({ cat, slug: item.slug }) }}
                            className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <ChevronRight size={24} className="text-slate-300" />
                </div>
                <p className="text-sm">Select an item from the left panel to edit</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">{selected.item.label_en}</p>
                  <p className="text-xs text-slate-400 capitalize">{selected.cat}</p>
                </div>
                {saved && <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">Saved!</span>}
              </div>
              {editItem && (
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">English Label</label>
                    <input
                      value={editItem.label_en}
                      onChange={(e) => setEditItem({ ...editItem, label_en: e.target.value })}
                      disabled={!isSuperAdmin}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30 disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Arabic Label</label>
                    <input
                      dir="rtl"
                      value={editItem.label_ar}
                      onChange={(e) => setEditItem({ ...editItem, label_ar: e.target.value })}
                      disabled={!isSuperAdmin}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30 disabled:bg-slate-50 text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Slug</label>
                    <input
                      value={editItem.slug}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Synonyms</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editItem.synonyms.map((s) => (
                        <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-[#192433]/10 text-[#192433] rounded-full text-xs font-medium">
                          {s}
                          {isSuperAdmin && (
                            <button onClick={() => removeSynonym(s)} className="hover:text-red-500 transition-colors">
                              <X size={11} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isSuperAdmin && (
                      <div className="flex gap-2">
                        <input
                          value={synonymInput}
                          onChange={(e) => setSynonymInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addSynonym()}
                          placeholder="Add synonym…"
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30"
                        />
                        <button onClick={addSynonym} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm transition-colors">
                          <Plus size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Silhouette Key</label>
                    <input
                      value={editItem.slug}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
                    />
                  </div>
                  {isSuperAdmin && (
                    <button onClick={handleSave} className="w-full py-3 rounded-lg bg-[#192433] text-white text-sm font-semibold hover:bg-[#111b26] transition-colors">
                      {t('save')}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteDialog(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-2">Delete Item</h3>
            <p className="text-sm text-slate-600 mb-4">Delete "{deleteDialog.slug}" from {deleteDialog.cat}? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteDialog(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">{t('cancel')}</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {addDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAddDialog(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Add Item — <span className="capitalize">{addDialog.cat}</span></h3>
              <button onClick={() => setAddDialog(null)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Slug</label>
                <input value={newItem.slug} onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })} placeholder="e.g. steel_fixer" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">English Label</label>
                <input value={newItem.label_en} onChange={(e) => setNewItem({ ...newItem, label_en: e.target.value })} placeholder="e.g. Steel Fixer" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Arabic Label</label>
                <input dir="rtl" value={newItem.label_ar} onChange={(e) => setNewItem({ ...newItem, label_ar: e.target.value })} placeholder="مثبت الحديد" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30 text-right" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Synonyms</label>
                <div className="flex gap-2">
                  <input value={newSynInput} onChange={(e) => setNewSynInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && newSynInput.trim()) { setNewItem({ ...newItem, synonyms: [...newItem.synonyms, newSynInput.trim()] }); setNewSynInput('') } }} placeholder="Add synonym…" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#192433]/30" />
                  <button onClick={() => { if (newSynInput.trim()) { setNewItem({ ...newItem, synonyms: [...newItem.synonyms, newSynInput.trim()] }); setNewSynInput('') } }} className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"><Plus size={15} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {newItem.synonyms.map((s) => (
                    <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-[#192433]/10 text-[#192433] rounded-full text-xs">
                      {s}<button onClick={() => setNewItem({ ...newItem, synonyms: newItem.synonyms.filter((x) => x !== s) })}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setAddDialog(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">{t('cancel')}</button>
              <button onClick={handleAdd} disabled={!newItem.slug || !newItem.label_en} className="px-4 py-2 rounded-lg bg-[#192433] text-white text-sm font-medium hover:bg-[#111b26] disabled:opacity-50">{t('add')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
