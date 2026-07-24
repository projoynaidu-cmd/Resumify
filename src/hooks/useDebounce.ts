'use client'

import { useState, useEffect } from 'react'

/**
 * Returns a debounced copy of `value` that only updates after
 * `delay` ms of inactivity.
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 400)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/**
 * Returns a stable debounced callback.
 * The callback is re-created only when `fn` identity changes.
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timerRef: { current: ReturnType<typeof setTimeout> | null } = { current: null }

  return (...args: Parameters<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fn(...args), delay)
  }
}
