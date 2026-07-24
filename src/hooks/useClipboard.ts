'use client'

import { useState, useCallback } from 'react'

interface UseClipboardOptions {
  /** How long (ms) to show the "copied" state. Default: 2000 */
  resetDelay?: number
}

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>
  isCopied: boolean
  isSupported: boolean
}

/**
 * Writes text to the clipboard and briefly sets `isCopied = true`.
 *
 * Usage:
 * ```tsx
 * const { copy, isCopied } = useClipboard()
 * <button onClick={() => copy(someText)}>
 *   {isCopied ? 'Copied!' : 'Copy'}
 * </button>
 * ```
 */
export function useClipboard({ resetDelay = 2000 }: UseClipboardOptions = {}): UseClipboardReturn {
  const [isCopied, setIsCopied] = useState(false)

  const isSupported =
    typeof navigator !== 'undefined' && !!navigator.clipboard

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!isSupported) return false
      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), resetDelay)
        return true
      } catch {
        return false
      }
    },
    [isSupported, resetDelay],
  )

  return { copy, isCopied, isSupported }
}
