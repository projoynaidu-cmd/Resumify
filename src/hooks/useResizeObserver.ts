'use client'

import { useState, useEffect, useRef, type RefObject } from 'react'

interface Size {
  width: number
  height: number
}

/**
 * Observes the size of an element using ResizeObserver.
 * Returns `{ width, height }` of the element's content box.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const { width } = useResizeObserver(ref)
 */
export function useResizeObserver<T extends Element>(
  ref: RefObject<T>,
): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  const observerRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    observerRef.current = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observerRef.current.observe(el)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [ref])

  return size
}
