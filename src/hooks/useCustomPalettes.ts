'use client'

import { useState, useEffect, useCallback } from 'react'
import { storageGet, storageSet } from '@/lib/storage'
import { PALETTE_STORAGE_KEY, MAX_CUSTOM_PALETTES } from '@/lib/constants'
import { generateId } from '@/utils'
import type { CustomPalette } from '@/types'

/**
 * Manages the user's saved custom color palettes — stored separately
 * from individual resumes so a palette can be reused across multiple
 * resumes. Persisted via lib/storage (versioned, SSR-safe).
 */
export function useCustomPalettes() {
  const [palettes, setPalettes] = useState<CustomPalette[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load on mount
  useEffect(() => {
    const saved = storageGet<CustomPalette[]>(PALETTE_STORAGE_KEY)
    if (saved) setPalettes(saved)
    setHydrated(true)
  }, [])

  const persist = useCallback((next: CustomPalette[]) => {
    setPalettes(next)
    storageSet(PALETTE_STORAGE_KEY, next)
  }, [])

  const savePalette = useCallback(
    (palette: Omit<CustomPalette, 'id' | 'createdAt'>): CustomPalette | null => {
      if (palettes.length >= MAX_CUSTOM_PALETTES) return null

      const newPalette: CustomPalette = {
        ...palette,
        id: generateId('palette'),
        createdAt: new Date().toISOString(),
      }
      persist([newPalette, ...palettes])
      return newPalette
    },
    [palettes, persist],
  )

  const deletePalette = useCallback(
    (id: string) => {
      persist(palettes.filter((p) => p.id !== id))
    },
    [palettes, persist],
  )

  const updatePalette = useCallback(
    (id: string, updates: Partial<Omit<CustomPalette, 'id' | 'createdAt'>>) => {
      persist(palettes.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    },
    [palettes, persist],
  )

  return {
    palettes,
    hydrated,
    savePalette,
    deletePalette,
    updatePalette,
    isAtLimit: palettes.length >= MAX_CUSTOM_PALETTES,
    limit: MAX_CUSTOM_PALETTES,
  }
}
