import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('admin@ejjar.com')
  const [password, setPassword] = useState('admin123')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const ok = login(email.trim(), password)
    setLoading(false)
    if (ok) {
      navigate('/dashboard', { replace: true })
    } else {
      setError('Invalid credentials. Try admin@ejjar.com / admin123')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A4FBA] mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">EJJAR</h1>
          <p className="text-slate-400 text-sm mt-1">{t('admin_panel')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{t('login')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4FBA] focus:border-transparent"
                placeholder="admin@ejjar.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pe-10 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4FBA] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#1A4FBA] text-white font-semibold text-sm hover:bg-[#1540a0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : t('sign_in')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
