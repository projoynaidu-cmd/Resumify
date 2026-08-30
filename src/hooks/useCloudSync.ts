'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useResumeStore } from '@/store'

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseCloudSyncOptions {
  /** Resume DB id — undefined when not authenticated */
  resumeId: string | undefined
  /** Debounce delay in ms (default 1500) */
  delay?: number
}

/**
 * Watches the Zustand resume store and auto-saves to the database
 * whenever the state changes (debounced).
 *
 * Falls back to localStorage-only when resumeId is not provided
 * (unauthenticated users / local builder mode).
 *
 * Returns { status, lastSavedAt, forceSave }
 */
export function useCloudSync({ resumeId, delay = 1500 }: UseCloudSyncOptions) {
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSavingRef = useRef(false)
  const lastSavedPhotoRef = useRef<string | null>(null)

  // Subscribe to the full resume state snapshot (JSON for comparison)
  const stateJson = useResumeStore((s) =>
    JSON.stringify({
      personal: s.personal,
      about: s.about,
      skills: s.skills,
      experience: s.experience,
      education: s.education,
      projects: s.projects,
      customSections: s.customSections,
      coverLetter: s.coverLetter,
      template: s.template,
      accentColor: s.accentColor,
      resumeFont: s.resumeFont,
      headingFont: s.headingFont,
      fontPairingId: s.fontPairingId,
      customPalette: s.customPalette,
      filename: s.filename,
      photoDataUrl: s.photoDataUrl,
      sectionOrder: s.sectionOrder,
    }),
  )

  const getFullState = useCallback(
    () => useResumeStore.getState(),
    [],
  )

  const save = useCallback(async () => {
    if (!resumeId || isSavingRef.current) return
    isSavingRef.current = true
    setStatus('saving')

    try {
      const state = getFullState()

      // If photoDataUrl hasn't changed since the last successful save,
      // omit it from the payload to avoid re-uploading a large base64 string.
      const photoChanged = state.photoDataUrl !== lastSavedPhotoRef.current
      lastSavedPhotoRef.current = state.photoDataUrl

      const res = await fetch(`/api/resumes/${resumeId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            personal: state.personal,
            about: state.about,
            skills: state.skills,
            experience: state.experience,
            education: state.education,
            projects: state.projects,
            customSections: state.customSections,
            coverLetter: state.coverLetter,
            template: state.template,
            accentColor: state.accentColor,
            resumeFont: state.resumeFont,
            headingFont: state.headingFont,
            fontPairingId: state.fontPairingId,
            customPalette: state.customPalette,
            filename: state.filename,
            sectionOrder: state.sectionOrder,
            // Only include photo if it changed since last save
            ...(photoChanged ? { photoDataUrl: state.photoDataUrl } : {}),
          },
        }),
      })

      if (!res.ok) throw new Error('Save failed')

      const { savedAt } = await res.json()
      setLastSavedAt(new Date(savedAt))
      setStatus('saved')

      // Reset to idle after 3s
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    } finally {
      isSavingRef.current = false
    }
  }, [resumeId, getFullState])

  // Debounce on state changes
  useEffect(() => {
    if (!resumeId) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus('idle')
    timerRef.current = setTimeout(save, delay)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // stateJson is the dep — changes on every edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateJson, resumeId, delay])

  return { status, lastSavedAt, forceSave: save }
}
