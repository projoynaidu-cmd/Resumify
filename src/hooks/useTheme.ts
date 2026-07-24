'use client'

import { useCallback } from 'react'
import { useUIStore } from '@/store'

/**
 * Convenience hook for theme management.
 * Reads from and writes to the UI store, and synchronises with the DOM.
 */
export function useTheme() {
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

  const setTheme = useCallback(
    (next: 'light' | 'dark') => {
      if (next !== theme) toggleTheme()
    },
    [theme, toggleTheme],
  )

  const isDark = theme === 'dark'
  const isLight = theme === 'light'

  return { theme, toggleTheme, setTheme, isDark, isLight }
}
