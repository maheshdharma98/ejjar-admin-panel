// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Download, Upload, ChevronDown, ChevronRight, X } from 'lucide-react'
import { taxonomyData } from '@/data'
import { cn, downloadCSV } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { usePageMeta } from '@/stores/pageStore'

type TaxItem = { slug: string; label_en: string; label_ar: string; synonyms: string[] }
type Taxonomy = Record<string, TaxItem[]>

export default function TaxonomyPage() {
  const { t } = useTranslation()
  const role = useAuthStore((s) => s.role)
  const isSuperAdmin = role === 'Super Admin'
  usePageMeta('Taxonomy', 'Manage categories and labels')
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

  const inputClass = 'w-full px-4 py-2.5 rounded-[10px] border border-border-input bg-surface-input text-[13px] text-text-primary focus:outline-none focus:border-border-active focus:shadow-[0_0_0_3px_rgba(230,126,58,0.12)] disabled:opacity-60 disabled:cursor-not-allowed'

  if (loading) return (
    <div className="bg-surface-card border border-border-card rounded-[14px] p-6 animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-surface-input rounded-[10px]" />)}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-text-muted">
            {Object.values(taxonomy).reduce((s, a) => s + a.length, 0)} items across {Object.keys(taxonomy).length} categories
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] border border-border-card bg-surface-card text-[12px] font-medium text-text-secondary hover:bg-surface-input transition-colors"
          >
            <Download size={14} />{t('export')}
          </button>
          <label className="flex items-center gap-2 px-3 py-2 rounded-[10px] border border-border-card bg-surface-card text-[12px] font-medium text-text-secondary hover:bg-surface-input cursor-pointer transition-colors">
            <Upload size={14} />{t('import')}
            <input type="file" accept=".csv" className="hidden" onChange={() => {}} />
          </label>
        </div>
      </div>

      <div className="flex gap-3" style={{ minHeight: '600px' }}>
        {/* Left panel — category list */}
        <div className="w-[35%] bg-surface-card rounded-[14px] border border-border-card shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="px-4 py-[10px] border-b border-border-divider">
            <p className="text-[9px] font-semibold text-text-label uppercase tracking-[0.8px]">Categories</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {Object.entries(taxonomy).map(([cat, items]) => (
              <div key={cat} className="border-b border-border-divider last:border-0">
                <div
                  onClick={() => toggleCat(cat)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-input transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {openCats[cat]
                      ? <ChevronDown size={13} className="text-text-muted" />
                      : <ChevronRight size={13} className="text-text-muted" />}
                    <span className="text-[12px] font-semibold text-text-primary capitalize">{cat}</span>
                    <span className="text-[10px] text-text-muted bg-surface-input px-1.5 py-0.5 rounded-full">{items.length}</span>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setAddDialog({ cat }); setNewItem({ slug: '', label_en: '', label_ar: '', synonyms: [] }) }}
                      className="p-1 rounded-[6px] hover:bg-brand-orange/10 text-brand-orange transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  )}
                </div>
                {openCats[cat] && (
                  <div className="pb-1">
                    {items.map((item) => (
                      <div
                        key={item.slug}
                        onClick={() => selectItem(cat, item)}
                        className={cn(
                          'group flex items-center justify-between px-8 py-2 cursor-pointer hover:bg-surface-input transition-colors',
                          selected?.cat === cat && selected.item.slug === item.slug
                            ? 'bg-brand-orange/5 text-brand-orange font-semibold'
                            : 'text-text-secondary'
                        )}
                      >
                        <span className="text-[12px]">{item.label_en}</span>
                        {isSuperAdmin && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteDialog({ cat, slug: item.slug }) }}
                            className="p-1 rounded hover:bg-status-errorBg text-status-errorText opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={12} />
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

        {/* Right panel — editor */}
        <div className="flex-1 bg-surface-card rounded-[14px] border border-border-card shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-surface-input flex items-center justify-center mx-auto mb-3">
                  <ChevronRight size={24} className="text-text-label" />
                </div>
                <p className="text-[13px]">Select an item from the left panel to edit</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 py-[14px] border-b border-border-divider">
                <div>
                  <p className="text-[13px] font-semibold text-text-primary">{selected.item.label_en}</p>
                  <p className="text-[10px] text-text-muted capitalize mt-px">{selected.cat}</p>
                </div>
                {saved && (
                  <span className="text-[11px] text-status-successText font-medium bg-status-successBg px-2.5 py-1 rounded-[8px]">
                    Saved!
                  </span>
                )}
              </div>
              {editItem && (
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <div>
                    <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1.5">English Label</label>
                    <input
                      value={editItem.label_en}
                      onChange={(e) => setEditItem({ ...editItem, label_en: e.target.value })}
                      disabled={!isSuperAdmin}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1.5">Arabic Label</label>
                    <input
                      dir="rtl"
                      value={editItem.label_ar}
                      onChange={(e) => setEditItem({ ...editItem, label_ar: e.target.value })}
                      disabled={!isSuperAdmin}
                      className={cn(inputClass, 'text-right')}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1.5">Slug</label>
                    <input
                      value={editItem.slug}
                      readOnly
                      className={cn(inputClass, 'font-mono text-[11px] text-text-muted cursor-not-allowed')}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1.5">Synonyms</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editItem.synonyms.map((s) => (
                        <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-brand-navy/10 text-text-primary rounded-full text-[11px] font-medium">
                          {s}
                          {isSuperAdmin && (
                            <button onClick={() => removeSynonym(s)} className="hover:text-status-errorText transition-colors">
                              <X size={10} />
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
                          className="flex-1 px-3 py-2 rounded-[10px] border border-border-input bg-surface-input text-[12px] focus:outline-none focus:border-border-active focus:shadow-[0_0_0_3px_rgba(230,126,58,0.12)]"
                        />
                        <button onClick={addSynonym} className="px-3 py-2 rounded-[10px] bg-surface-input text-text-secondary hover:bg-border-divider text-sm transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1.5">Silhouette Key</label>
                    <input
                      value={editItem.slug}
                      readOnly
                      className={cn(inputClass, 'font-mono text-[11px] text-text-muted cursor-not-allowed')}
                    />
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={handleSave}
                      className="w-full py-3 rounded-[12px] bg-brand-orange text-white text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-[0_2px_12px_rgba(230,126,58,0.20)]"
                    >
                      {t('save')}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteDialog(null)}>
          <div className="bg-surface-card rounded-[16px] shadow-2xl max-w-sm w-full p-6 mx-4 border border-border-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[14px] font-bold text-text-primary mb-2">Delete Item</h3>
            <p className="text-[12px] text-text-secondary mb-5">Delete "{deleteDialog.slug}" from {deleteDialog.cat}? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteDialog(null)} className="px-4 py-2 rounded-[10px] border border-border-card text-[12px] font-medium text-text-secondary hover:bg-surface-input">
                {t('cancel')}
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-[10px] bg-status-errorText text-white text-[12px] font-medium hover:opacity-90">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add dialog */}
      {addDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAddDialog(null)}>
          <div className="bg-surface-card rounded-[16px] shadow-2xl max-w-md w-full p-6 mx-4 border border-border-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-bold text-text-primary">Add Item — <span className="capitalize">{addDialog.cat}</span></h3>
              <button onClick={() => setAddDialog(null)} className="p-2 rounded-[8px] hover:bg-surface-input text-text-muted">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1">Slug</label>
                <input
                  value={newItem.slug}
                  onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })}
                  placeholder="e.g. steel_fixer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1">English Label</label>
                <input
                  value={newItem.label_en}
                  onChange={(e) => setNewItem({ ...newItem, label_en: e.target.value })}
                  placeholder="e.g. Steel Fixer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1">Arabic Label</label>
                <input
                  dir="rtl"
                  value={newItem.label_ar}
                  onChange={(e) => setNewItem({ ...newItem, label_ar: e.target.value })}
                  placeholder="مثبت الحديد"
                  className={cn(inputClass, 'text-right')}
                />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-text-label uppercase tracking-[0.8px] mb-1">Synonyms</label>
                <div className="flex gap-2">
                  <input
                    value={newSynInput}
                    onChange={(e) => setNewSynInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSynInput.trim()) {
                        setNewItem({ ...newItem, synonyms: [...newItem.synonyms, newSynInput.trim()] })
                        setNewSynInput('')
                      }
                    }}
                    placeholder="Add synonym…"
                    className="flex-1 px-3 py-2 rounded-[10px] border border-border-input bg-surface-input text-[12px] focus:outline-none focus:border-border-active focus:shadow-[0_0_0_3px_rgba(230,126,58,0.12)]"
                  />
                  <button
                    onClick={() => {
                      if (newSynInput.trim()) {
                        setNewItem({ ...newItem, synonyms: [...newItem.synonyms, newSynInput.trim()] })
                        setNewSynInput('')
                      }
                    }}
                    className="px-3 py-2 rounded-[10px] bg-surface-input hover:bg-border-divider transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {newItem.synonyms.map((s) => (
                    <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-brand-navy/10 text-text-primary rounded-full text-[11px]">
                      {s}
                      <button onClick={() => setNewItem({ ...newItem, synonyms: newItem.synonyms.filter((x) => x !== s) })}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setAddDialog(null)} className="px-4 py-2 rounded-[10px] border border-border-card text-[12px] font-medium text-text-secondary hover:bg-surface-input">
                {t('cancel')}
              </button>
              <button
                onClick={handleAdd}
                disabled={!newItem.slug || !newItem.label_en}
                className="px-4 py-2 rounded-[10px] bg-brand-orange text-white text-[12px] font-semibold hover:opacity-90 disabled:opacity-40 shadow-[0_2px_12px_rgba(230,126,58,0.20)]"
              >
                {t('add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
