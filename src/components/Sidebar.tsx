import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  Tags,
  Bell,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard', tour: 'nav-dashboard' },
  { to: '/rfqs', icon: FileText, key: 'rfqs', tour: 'nav-rfqs' },
  { to: '/suppliers', icon: Building2, key: 'suppliers', tour: 'nav-suppliers' },
  { to: '/contractors', icon: Users, key: 'contractors', tour: 'nav-contractors' },
  { to: '/taxonomy', icon: Tags, key: 'taxonomy', tour: 'nav-taxonomy' },
  { to: '/notifications', icon: Bell, key: 'notifications', tour: 'nav-notifications' },
]

export default function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="fixed top-0 start-0 h-full w-60 bg-[#0F172A] flex flex-col z-30">
      <div className="px-6 py-5 border-b border-slate-700" data-tour="welcome">
        <img src="/logo_white.svg" alt="EJJAR Admin" style={{ height: '48px', width: 'auto', marginBottom: '8px' }} />
        <p className="text-slate-400 text-xs">{t('admin_panel')}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ to, icon: Icon, key, tour }) => (
          <NavLink
            key={to}
            to={to}
            data-tour={tour}
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
  )
}
