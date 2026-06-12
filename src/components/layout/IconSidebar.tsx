// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Users,
  HardHat,
  Tag,
  Bell,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ejjarLogo from '@/assets/Ejjar_logo_outlinewhite.svg'

interface NavItem {
  to: string
  icon: React.ElementType
  label: string
  tourKey?: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard',     tourKey: 'nav-dashboard' },
  { to: '/rfqs',          icon: FileText,        label: 'RFQs',          tourKey: 'nav-rfqs' },
  { to: '/suppliers',     icon: Users,           label: 'Suppliers',     tourKey: 'nav-suppliers' },
  { to: '/contractors',   icon: HardHat,         label: 'Contractors',   tourKey: 'nav-contractors' },
  { to: '/taxonomy',      icon: Tag,             label: 'Taxonomy',      tourKey: 'nav-taxonomy' },
  { to: '/notifications', icon: Bell,            label: 'Notifications', tourKey: 'nav-notifications' },
]

interface Props {
  open: boolean
  onClose: () => void
}

function NavBtn({ item }: { item: NavItem }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NavLink
        to={item.to}
        data-tour={item.tourKey}
        className={({ isActive }) =>
          `relative flex items-center justify-center w-11 h-11 rounded-[10px] transition-colors ${
            isActive
              ? 'text-brand-orange bg-brand-orange/10'
              : 'text-text-muted hover:text-text-ondark hover:bg-white/[0.07]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <item.icon size={19} strokeWidth={isActive ? 2 : 1.75} />
            {isActive && (
              <span className="absolute end-0 top-2 bottom-2 w-[3px] bg-brand-orange rounded-l-[3px]" />
            )}
          </>
        )}
      </NavLink>

      {hovered && (
        <div className="absolute start-[54px] z-50 pointer-events-none">
          <div className="relative bg-brand-tooltip text-text-ondark text-[12px] font-medium px-[10px] py-[5px] rounded-[7px] whitespace-nowrap shadow-lg">
            {item.label}
            <span className="absolute end-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-e-brand-tooltip" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function IconSidebar({ open, onClose }: Props) {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 start-0 h-full w-16 bg-surface-sidebar flex flex-col z-30 transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo mark */}
        <div className="flex items-center justify-center h-14 border-b border-white/[0.07] flex-shrink-0" data-tour="welcome">
          <img
            src={ejjarLogo}
            alt="EJJAR"
            className="h-7 w-auto select-none"
            draggable={false}
          />
        </div>

        {/* Close button (mobile only) — only when sidebar is open */}
        {open && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-3 end-[-36px] w-8 h-8 bg-brand-navy rounded-r-lg flex items-center justify-center text-text-muted hover:text-white"
          >
            <X size={16} />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 flex flex-col items-center gap-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavBtn key={item.to} item={item} />
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-white/[0.07]" />

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-1 py-3">
          <BottomBtn icon={Settings} label="Settings" onClick={() => {}} />
          <BottomBtn icon={LogOut} label="Logout" onClick={handleLogout} />
        </div>

        {/* Version */}
        <div className="pb-3 flex justify-center">
          <span className="text-[10px] text-text-muted">v1.0.0</span>
        </div>
      </aside>
    </>
  )
}

function BottomBtn({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        className="flex items-center justify-center w-11 h-11 rounded-[10px] text-text-muted hover:text-text-ondark hover:bg-white/[0.07] transition-colors"
      >
        <Icon size={19} strokeWidth={1.75} />
      </button>

      {hovered && (
        <div className="absolute start-[54px] z-50 pointer-events-none">
          <div className="relative bg-brand-tooltip text-text-ondark text-[12px] font-medium px-[10px] py-[5px] rounded-[7px] whitespace-nowrap shadow-lg">
            {label}
            <span className="absolute end-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-e-brand-tooltip" />
          </div>
        </div>
      )}
    </div>
  )
}
