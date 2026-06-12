// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import IconSidebar from './IconSidebar'
import Topbar from './Topbar'
import DemoTour from '../DemoTour'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page">
      <DemoTour />
      <IconSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-x-hidden lg:ms-16">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-5 flex flex-col gap-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
