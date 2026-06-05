import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import DemoTour from './DemoTour'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DemoTour />
      <Sidebar />
      <Navbar />
      <main className="ms-60 pt-14 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
