'use client'

import { useCallback, useState } from 'react'
import { useResumeStore, useUIStore } from '@/store'
import { storageClearAll } from '@/lib/storage'
import { DEFAULT_RESUME_STATE } from '@/lib/constants'

/**
 * Provides a two-step resume reset:
 *   1. `requestReset()` — sets `isPendingReset = true` (show confirmation UI)
 *   2. `confirmReset()` — wipes store + localStorage, reloads state
 *   3. `cancelReset()`  — dismisses confirmation
 *
 * Usage:
 * ```tsx
 * const { requestReset, confirmReset, cancelReset, isPendingReset } = useResetResume()
 * ```
 */
export function useResetResume() {
  const [isPendingReset, setIsPendingReset] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  const requestReset = useCallback(() => {
    setIsPendingReset(true)
  }, [])

  const cancelReset = useCallback(() => {
    setIsPendingReset(false)
  }, [])

  const confirmReset = useCallback(() => {
    // Wipe all namespaced localStorage keys
    storageClearAll()

    // Reset the Zustand store to default state
    const store = useResumeStore.getState()
    store.loadFromStorage()

    // Explicitly set default since storage is now empty
    // (loadFromStorage falls back to DEFAULT_RESUME_STATE when nothing is stored)
    Object.assign(store, DEFAULT_RESUME_STATE)

    setIsPendingReset(false)
    addToast('success', 'Resume reset to defaults')
  }, [addToast])

  return { requestReset, confirmReset, cancelReset, isPendingReset }
}
