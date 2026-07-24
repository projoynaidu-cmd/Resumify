'use client'

import { useCallback } from 'react'
import { useResumeStore, useUIStore } from '@/store'
import { exportElementToPdf } from '@/lib/pdf'

export type ExportTarget = 'resume' | 'coverletter'

const ELEMENT_IDS: Record<ExportTarget, string> = {
  resume: 'resume-content',
  coverletter: 'cl-wrapper',
}

const FILENAMES: Record<ExportTarget, string> = {
  resume: 'resume',
  coverletter: 'cover-letter',
}

/**
 * Unified hook for PDF export and browser print.
 *
 * Usage:
 * ```tsx
 * const { exportPdf, printDocument } = useResumeExport()
 * <button onClick={() => exportPdf('resume')}>Export</button>
 * <button onClick={printDocument}>Print</button>
 * ```
 */
export function useResumeExport() {
  const filename = useResumeStore((s) => s.filename)
  const { setExporting, setExportProgress, addToast } = useUIStore()

  const exportPdf = useCallback(
    async (target: ExportTarget = 'resume') => {
      const elementId = ELEMENT_IDS[target]
      const element = document.getElementById(elementId)

      if (!element) {
        addToast('error', `Preview element #${elementId} not found`)
        return
      }

      const outputFilename =
        target === 'resume' ? filename || FILENAMES[target] : FILENAMES[target]

      setExporting(true, 5, 'Preparing…')

      try {
        await exportElementToPdf(element, outputFilename, {
          onProgress: (pct, label) => setExportProgress(pct, label),
        })
        setExporting(false)
        addToast(
          'success',
          `"${outputFilename.replace(/\.pdf$/i, '')}.pdf" downloaded successfully`,
        )
      } catch (err) {
        console.error('[useResumeExport] PDF export failed:', err)
        setExporting(false)
        addToast('error', 'Export failed — please try again')
      }
    },
    [filename, setExporting, setExportProgress, addToast],
  )

  const printDocument = useCallback(() => {
    if (typeof window !== 'undefined') window.print()
  }, [])

  return { exportPdf, printDocument }
}
