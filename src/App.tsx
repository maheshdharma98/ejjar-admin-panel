import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/Layout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import RFQsPage from '@/pages/RFQsPage'
import SuppliersPage from '@/pages/SuppliersPage'
import ContractorsPage from '@/pages/ContractorsPage'
import TaxonomyPage from '@/pages/TaxonomyPage'
import NotificationsPage from '@/pages/NotificationsPage'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="rfqs" element={<RFQsPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="contractors" element={<ContractorsPage />} />
          <Route path="taxonomy" element={<TaxonomyPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
