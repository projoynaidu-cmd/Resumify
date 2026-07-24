'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * SSR-safe typed localStorage hook.
 *
 * - Returns `initialValue` on the server and during hydration
 * - Synchronises across browser tabs via the `storage` event
 * - Handles JSON parse errors gracefully
 *
 * @example
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Lazy init: always use initialValue on the server
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  // After hydration, read from localStorage
  useEffect(() => {
    setHydrated(true)
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T)
      }
    } catch {
      // Corrupt data or private browsing — keep initialValue
    }
  }, [key])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const next = value instanceof Function ? value(storedValue) : value
        setStoredValue(next)
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(next))
        }
      } catch {
        // Quota exceeded
      }
    },
    [key, storedValue],
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    } catch {
      // ignore
    }
  }, [key, initialValue])

  // Sync across tabs
  useEffect(() => {
    if (!hydrated) return

    function handleStorage(e: StorageEvent) {
      if (e.key !== key) return
      if (e.newValue === null) {
        setStoredValue(initialValue)
      } else {
        try {
          setStoredValue(JSON.parse(e.newValue) as T)
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, initialValue, hydrated])

  return [storedValue, setValue, removeValue]
}
