// EJJAR Admin Panel — EJJAR Design System v1.0
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, PlayCircle, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTourStore } from '@/stores/tourStore'
import { usePageStore } from '@/stores/pageStore'

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { adminName, logout } = useAuthStore()
  const startTour = useTourStore((s) => s.startTour)
  const { title, subtitle } = usePageStore()

  const isAr = i18n.language === 'ar'

  const toggleLang = () => {
    const next = isAr ? 'en' : 'ar'
    i18n.changeLanguage(next)
    localStorage.setItem('ejjar_admin_lang', next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = adminName
    ? adminName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'SA'

  return (
    <header className="flex-shrink-0 h-14 bg-surface-sidebar flex items-center justify-between px-5 border-b border-white/[0.07] z-10">
      {/* Left: mobile hamburger + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-[8px] bg-white/[0.07] text-text-muted hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-text-ondark leading-tight truncate">{title}</p>
          {subtitle && (
            <p className="text-[11px] text-text-muted mt-px truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-[10px] flex-shrink-0">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="text-[11px] text-text-muted px-[10px] py-[3px] rounded-full hover:bg-white/[0.07] hover:text-white transition-colors"
        >
          {isAr ? 'EN' : 'عربي'}
        </button>

        {/* Tour button — ghost style */}
        <button
          onClick={startTour}
          className="flex items-center gap-[6px] px-3 py-[6px] rounded-[8px] bg-white/[0.07] border border-white/[0.15] text-[12px] font-medium text-white/80 hover:text-white hover:bg-white/[0.12] transition-colors"
        >
          <PlayCircle size={14} strokeWidth={1.75} />
          <span className="hidden sm:inline">Tour</span>
        </button>

        {/* Admin pill */}
        <div
          className="flex items-center gap-[7px] ps-[6px] pe-3 py-[5px] rounded-full bg-white/[0.07] border border-white/[0.10]"
          data-tour="settings"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-[26px] h-[26px] rounded-full bg-brand-orange flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">{initials}</span>
            </div>
            <span className="absolute bottom-0 end-0 w-[5px] h-[5px] rounded-full bg-semantic-success border border-surface-sidebar" />
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-[12px] font-medium text-white/[0.85] leading-tight">{adminName || 'Admin'}</p>
            <p className="text-[10px] text-text-muted">Super Admin</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-white/[0.07] text-text-muted hover:text-white hover:bg-white/[0.12] transition-colors"
          title="Logout"
        >
          <LogOut size={16} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
