'use client'

import { useCallback } from 'react'
import { useResumeStore, useUIStore } from '@/store'
import { exportElementToPdf } from '@/lib/pdf'

/**
 * @deprecated Prefer `useResumeExport` which supports both resume and cover letter.
 * Kept for backward compatibility.
 */
export function usePdfExport() {
  const filename = useResumeStore((s) => s.filename)
  const { setExporting, setExportProgress, addToast } = useUIStore()

  const exportResume = useCallback(
    async (elementId: string, customFilename?: string) => {
      const element = document.getElementById(elementId)
      if (!element) {
        addToast('error', 'Preview element not found')
        return
      }

      setExporting(true, 5, 'Preparing…')

      try {
        await exportElementToPdf(element, customFilename ?? filename, {
          onProgress: (pct, label) => setExportProgress(pct, label),
        })
        setExporting(false)
        addToast('success', `"${(customFilename ?? filename).replace(/\.pdf$/i, '')}.pdf" downloaded!`)
      } catch (err) {
        console.error(err)
        setExporting(false)
        addToast('error', 'Export failed. Try again.')
      }
    },
    [filename, setExporting, setExportProgress, addToast],
  )

  return { exportResume }
}
