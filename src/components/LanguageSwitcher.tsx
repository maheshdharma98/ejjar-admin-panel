import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const toggle = () => {
    const next = isAr ? 'en' : 'ar'
    i18n.changeLanguage(next)
    localStorage.setItem('ejjar_admin_lang', next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [isAr, i18n.language])

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
    >
      {isAr ? 'EN' : 'عربي'}
    </button>
  )
}
