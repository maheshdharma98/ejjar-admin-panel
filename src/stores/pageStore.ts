// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { create } from 'zustand'
import { useEffect } from 'react'

interface PageState {
  title: string
  subtitle: string
  setPage: (title: string, subtitle: string) => void
}

export const usePageStore = create<PageState>((set) => ({
  title: 'Dashboard',
  subtitle: '',
  setPage: (title, subtitle) => set({ title, subtitle }),
}))

export function usePageMeta(title: string, subtitle: string) {
  const setPage = usePageStore((s) => s.setPage)
  useEffect(() => {
    setPage(title, subtitle)
  }, [title, subtitle, setPage])
}
