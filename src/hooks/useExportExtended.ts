'use client'

import { useState, useCallback } from 'react'
import { useResumeStore, useUIStore } from '@/store'

export function useExportExtended() {
  const [isDocxExporting, setIsDocxExporting] = useState(false)
  const [isJsonExporting, setIsJsonExporting] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  // ── DOCX ────────────────────────────────────────────────────
  const exportDocx = useCallback(async () => {
    setIsDocxExporting(true)
    try {
      const state = useResumeStore.getState()
      const { exportToDocx } = await import('@/lib/docx-export')
      await exportToDocx(state)
      addToast('success', `"${state.filename || 'resume'}.docx" downloaded!`)
    } catch (err) {
      console.error('[DOCX Export]', err)
      addToast('error', 'DOCX export failed. Please try again.')
    } finally {
      setIsDocxExporting(false)
    }
  }, [addToast])

  // ── JSON backup ─────────────────────────────────────────────
  const exportJson = useCallback(async () => {
    setIsJsonExporting(true)
    try {
      const state = useResumeStore.getState()
      const { downloadResumeJson } = await import('@/lib/json-export')
      downloadResumeJson(state)
      addToast('success', `"${state.filename || 'resume'}-backup.json" downloaded!`)
    } catch (err) {
      console.error('[JSON Export]', err)
      addToast('error', 'JSON export failed.')
    } finally {
      setIsJsonExporting(false)
    }
  }, [addToast])

  // ── JSON import ─────────────────────────────────────────────
  const importJson = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const { parseResumeJson, ResumeImportError } = await import('@/lib/json-export')
        const state = await parseResumeJson(file)

        const store = useResumeStore.getState()
        if (state.personal) store.updatePersonal(state.personal)
        if (state.about !== undefined) store.updateAbout(state.about)
        if (state.skills) store.setSkills(state.skills)
        if (state.template) store.setTemplate(state.template)
        if (state.accentColor) store.setAccentColor(state.accentColor)
        if (state.resumeFont) store.setResumeFont(state.resumeFont)
        if (state.filename) store.setFilename(state.filename)
        if (state.photoDataUrl !== undefined) store.setPhotoDataUrl(state.photoDataUrl)
        if (state.fontPairingId !== undefined) store.setFontPairing(state.fontPairingId)
        if (state.headingFont !== undefined) store.setHeadingFont(state.headingFont)
        if (state.customPalette !== undefined) store.setCustomPalette(state.customPalette)
        if (state.sectionOrder) store.reorderSections(state.sectionOrder)

        useResumeStore.setState({
          experience: state.experience ?? [],
          education: state.education ?? [],
          projects: state.projects ?? [],
          customSections: state.customSections ?? [],
          coverLetter: state.coverLetter,
        })

        store.snapshot()
        store.saveToStorage()
        addToast('success', 'Resume imported successfully!')
        return true
      } catch (err) {
        const { ResumeImportError } = await import('@/lib/json-export')
        const message =
          err instanceof ResumeImportError
            ? err.message
            : 'Import failed. Is this a valid Resumify backup file?'
        addToast('error', message)
        return false
      }
    },
    [addToast],
  )

  return { exportDocx, exportJson, importJson, isDocxExporting, isJsonExporting }
}

