import { create } from 'zustand'
import type { ActiveView, Toast, ToastType } from '@/types'
import { generateId } from '@/utils'

interface UIStore {
  // View
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void

  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void

  // Open sections
  openSections: Set<string>
  toggleSection: (key: string) => void
  openSection: (key: string) => void
  closeSection: (key: string) => void

  // Export
  isExporting: boolean
  exportProgress: number
  exportLabel: string
  setExporting: (exporting: boolean, progress?: number, label?: string) => void
  setExportProgress: (progress: number, label: string) => void

  // Toasts
  toasts: Toast[]
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  // -- View --
  activeView: 'resume',
  setActiveView: (view) => set({ activeView: view }),

  // -- Theme --
  theme: 'light',
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: next })
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next === 'dark')
    }
  },

  // -- Open sections --
  openSections: new Set(['personal']),
  toggleSection: (key) =>
    set((state) => {
      const next = new Set(state.openSections)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return { openSections: next }
    }),
  openSection: (key) =>
    set((state) => ({ openSections: new Set([...state.openSections, key]) })),
  closeSection: (key) =>
    set((state) => {
      const next = new Set(state.openSections)
      next.delete(key)
      return { openSections: next }
    }),

  // -- Export --
  isExporting: false,
  exportProgress: 0,
  exportLabel: '',
  setExporting: (isExporting, progress = 0, label = '') =>
    set({ isExporting, exportProgress: progress, exportLabel: label }),
  setExportProgress: (progress, label) =>
    set({ exportProgress: progress, exportLabel: label }),

  // -- Toasts --
  toasts: [],
  addToast: (type, message) => {
    const id = generateId('toast')
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }))
    setTimeout(() => get().removeToast(id), 3500)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
