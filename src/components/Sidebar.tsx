import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  Tags,
  Bell,
  X,
} from 'lucide-react'
import EjjarLogoWhite from '../assets/Ejjar_logo_white.svg';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard', tour: 'nav-dashboard' },
  { to: '/rfqs', icon: FileText, key: 'rfqs', tour: 'nav-rfqs' },
  { to: '/suppliers', icon: Building2, key: 'suppliers', tour: 'nav-suppliers' },
  { to: '/contractors', icon: Users, key: 'contractors', tour: 'nav-contractors' },
  { to: '/taxonomy', icon: Tags, key: 'taxonomy', tour: 'nav-taxonomy' },
  { to: '/notifications', icon: Bell, key: 'notifications', tour: 'nav-notifications' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 start-0 h-full w-60 bg-[#0F172A] flex flex-col z-30 transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="px-6 py-5 border-b border-slate-700 flex items-start justify-between" data-tour="welcome">
          <div>
            <img src={EjjarLogoWhite} alt="EJJAR Admin" style={{ height: '40px', width: 'auto', marginBottom: '8px' }} />
            <p className="text-slate-400 text-xs">{t('admin_panel')}</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white mt-1">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map(({ to, icon: Icon, key, tour }) => (
            <NavLink
              key={to}
              to={to}
              data-tour={tour}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#192433] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`
              }
            >
              <Icon size={18} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-700">
          <p className="text-slate-500 text-xs text-center">v1.0.0</p>
        </div>
      </aside>
    </>
  )
}
