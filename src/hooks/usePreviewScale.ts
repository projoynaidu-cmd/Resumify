'use client'

import { useState, useEffect, type RefObject } from 'react'
import { useResizeObserver } from './useResizeObserver'

const PREVIEW_WIDTH_PX = 794
const PANEL_PADDING_PX = 56 // 28px each side

/**
 * Calculates the CSS `scale` factor needed to fit a 794px-wide A4 preview
 * inside the available panel width, with optional padding.
 *
 * Returns `scale` (0 < scale ≤ 1) and `bottomOffset` (negative margin in px
 * to collapse the scaled-down element's whitespace).
 */
export function usePreviewScale(panelRef: RefObject<HTMLElement | null>): {
  scale: number
  bottomOffset: number
} {
  const { width: panelWidth } = useResizeObserver(
    panelRef as RefObject<Element>,
  )
  const [previewHeight, setPreviewHeight] = useState(0)

  // Update preview height when content changes
  useEffect(() => {
    const el = document.getElementById('resume-wrapper')
    if (!el) return
    const observer = new ResizeObserver(() => {
      setPreviewHeight(el.offsetHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const availableWidth = (panelWidth || PREVIEW_WIDTH_PX + PANEL_PADDING_PX) - PANEL_PADDING_PX
  const scale = Math.min(1, availableWidth / PREVIEW_WIDTH_PX)
  const bottomOffset = previewHeight > 0 ? previewHeight * scale - previewHeight : 0

  return { scale, bottomOffset }
}
