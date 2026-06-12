import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, Shield, Compass, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTourStore } from '@/stores/tourStore'
import LanguageSwitcher from './LanguageSwitcher'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { adminName, role, logout } = useAuthStore()
  const startTour = useTourStore((s) => s.startTour)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 start-0 lg:start-60 end-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between lg:justify-end px-4 sm:px-6 gap-4 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-600 hover:text-slate-900 p-1"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <LanguageSwitcher />

      <button
        onClick={startTour}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#192433] hover:bg-blue-50 transition-colors font-medium border border-[#192433]/20"
        title="Start Demo Tour"
      >
        <Compass size={15} />
        <span className="hidden sm:inline">{t('tour')}</span>
      </button>

      <div className="flex items-center gap-2 text-sm" data-tour="settings">
        <div className="w-8 h-8 rounded-full bg-[#192433] flex items-center justify-center">
          <Shield size={14} className="text-white" />
        </div>
        <div className="leading-tight hidden sm:block">
          <p className="font-semibold text-slate-800 text-xs">{adminName}</p>
          <p className="text-slate-500 text-xs">{role}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
      >
        <LogOut size={15} />
        <span className="hidden sm:inline">{t('logout')}</span>
      </button>
    </header>
  )
}
