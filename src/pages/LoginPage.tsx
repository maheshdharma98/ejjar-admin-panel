// EJJAR Admin Panel — Login
// Layout mirrors supplier portal Login.tsx exactly.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

import logoMarkSrc from '@/assets/Ejjar_logo_outlinewhite.svg'
import wordmarkSrc from '@/assets/Ejjar_logo_white.svg'

export default function LoginPage() {
  const { i18n } = useTranslation()
  const lang       = i18n.language
  const navigate   = useNavigate()
  const { login, isAuthenticated } = useAuthStore()

  const [email, setEmail]     = useState('admin@ejjar.com')
  const [password, setPassword] = useState('admin123')
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    const ok = login(email.trim(), password)
    setLoading(false)
    if (ok) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(lang === 'ar'
        ? 'بيانات الاعتماد غير صحيحة'
        : 'Invalid credentials. Try admin@ejjar.com / admin123')
    }
  }

  /* ── shared input style (matches supplier portal) ── */
  const baseInput =
    'w-full ps-9 pe-3.5 py-3 text-[14px] text-white placeholder:text-white/30 rounded-[10px] transition-colors focus:outline-none'

  const inputStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)',
  }
  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border     = '1px solid rgba(230,126,58,0.70)'
    e.target.style.boxShadow  = '0 0 0 3px rgba(230,126,58,0.18)'
  }
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border     = '1px solid rgba(255,255,255,0.18)'
    e.target.style.boxShadow  = 'none'
  }

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── Splash backgrounds (same technique as supplier portal) ── */}
      <img
        src="/Web_Splash_screen.svg"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none hidden sm:block"
        aria-hidden="true"
        draggable={false}
        alt=""
      />
      <img
        src="/Mobile%20View%20splash%20screen.svg"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none sm:hidden"
        aria-hidden="true"
        draggable={false}
        alt=""
      />

      {/* ── Dark scrim — keeps splash visible but legible ── */}
      <div className="absolute inset-0 bg-brand-navy/40 pointer-events-none" />

      {/* ── Page layout ── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Top strip — wordmark + portal label */}
        <div className="px-6 py-4 flex items-center gap-2.5 flex-shrink-0">
          <img src={wordmarkSrc} alt="EJJAR" className="h-[22px] w-auto" draggable={false} />
          <span className="text-white/25 text-[12px]">·</span>
          <span className="text-white/50 text-[12px] font-medium">
            {lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
          </span>
        </div>

        {/* ── Centered form area ── */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-[400px]">

            {/* Logo mark + heading above the glass card */}
            <div className="flex flex-col items-center mb-7">
              <img
                src={logoMarkSrc}
                alt="EJJAR"
                className="h-[60px] w-auto mb-4 drop-shadow-lg"
                draggable={false}
              />
              <h1 className="text-[22px] font-bold text-white leading-tight drop-shadow">
                {lang === 'ar' ? 'مرحباً بعودتك' : 'Welcome back'}
              </h1>
              <p className="text-[13px] text-white/55 mt-1.5 text-center">
                {lang === 'ar'
                  ? 'سجّل الدخول إلى حساب الإدارة'
                  : 'Sign in to your admin account'}
              </p>
            </div>

            {/* ── Glass card ── */}
            <div
              className="rounded-[16px] border border-white/20 p-6 sm:p-8"
              style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-semibold text-white/60 uppercase tracking-[0.8px] mb-1.5"
                  >
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      strokeWidth={1.75}
                      className="absolute start-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ejjar.com"
                      required
                      className={baseInput}
                      style={inputStyle}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[11px] font-semibold text-white/60 uppercase tracking-[0.8px] mb-1.5"
                  >
                    {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      strokeWidth={1.75}
                      className="absolute start-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                    />
                    <input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`${baseInput} pe-10`}
                      style={inputStyle}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute end-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPw ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-[12px] text-red-200 bg-red-900/30 border border-red-500/25 px-3 py-2 rounded-[8px]">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-orange text-white font-semibold text-[14px] rounded-[12px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ boxShadow: '0 4px 20px rgba(230,126,58,0.35)' }}
                >
                  {loading
                    ? (lang === 'ar' ? 'جارٍ التحقق…' : 'Signing in…')
                    : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                </button>

              </form>
            </div>
            {/* ── end glass card ── */}

            <p className="text-center text-[11px] text-white/25 mt-6">
              © 2025 EJJAR. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
