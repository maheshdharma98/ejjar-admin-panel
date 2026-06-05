import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'Super Admin' | 'Moderator' | 'Viewer'

interface AuthState {
  isAuthenticated: boolean
  role: Role | null
  adminName: string
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      adminName: '',
      login: (email, password) => {
        if (email === 'admin@ejjar.com' && password === 'admin123') {
          set({ isAuthenticated: true, role: 'Super Admin', adminName: 'Super Admin' })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false, role: null, adminName: '' }),
    }),
    { name: 'ejjar_admin_auth' }
  )
)
