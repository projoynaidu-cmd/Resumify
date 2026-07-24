'use client'

import { useEffect, useRef } from 'react'
import { useResumeStore } from '@/store'
import { useCloudSync } from '@/hooks/useCloudSync'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { BuilderTopbar } from './BuilderTopbar'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { PreviewPanel } from '@/components/preview/PreviewPanel'
import { LoadingOverlay } from '@/components/shared/LoadingOverlay'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { useState } from 'react'
import type { ResumeState } from '@/types'

interface BuilderClientProps {
  resumeId: string
  initialData: ResumeState
  resumeTitle: string
  userId: string
  userPlan: string
}

/**
 * Client component that:
 * 1. Seeds the Zustand store with data loaded from the DB (server)
 * 2. Enables cloud auto-save via useCloudSync
 * 3. Renders the full builder UI
 */
export function BuilderClient({
  resumeId,
  initialData,
  resumeTitle,
  userPlan,
}: BuilderClientProps) {
  useKeyboardShortcuts()
  const [mobilePanel, setMobilePanel] = useState<'editor' | 'preview'>('editor')
  const seededRef = useRef(false)

  // Seed store once with DB data
  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true

    const store = useResumeStore.getState()
    // Apply each field individually to trigger proper reactivity
    if (initialData.personal) store.updatePersonal(initialData.personal)
    if (initialData.about !== undefined) store.updateAbout(initialData.about)
    if (initialData.skills) store.setSkills(initialData.skills)
    if (initialData.template) store.setTemplate(initialData.template)
    if (initialData.accentColor) store.setAccentColor(initialData.accentColor)
    if (initialData.resumeFont) store.setResumeFont(initialData.resumeFont)
    if (initialData.fontPairingId) store.setFontPairing(initialData.fontPairingId)
    if (initialData.headingFont !== undefined) store.setHeadingFont(initialData.headingFont)
    if (initialData.customPalette !== undefined) store.setCustomPalette(initialData.customPalette)
    if (initialData.filename) store.setFilename(initialData.filename)
    if (initialData.photoDataUrl !== undefined) store.setPhotoDataUrl(initialData.photoDataUrl)
    if (initialData.sectionOrder) store.reorderSections(initialData.sectionOrder)

    // Replace array data directly via snapshot
    useResumeStore.setState({
      experience: initialData.experience ?? [],
      education: initialData.education ?? [],
      projects: initialData.projects ?? [],
      customSections: initialData.customSections ?? [],
      coverLetter: initialData.coverLetter,
    })
  }, [initialData])

  // Cloud auto-save
  const { status, lastSavedAt } = useCloudSync({ resumeId })

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <BuilderTopbar
        resumeId={resumeId}
        resumeTitle={resumeTitle}
        userPlan={userPlan}
        syncStatus={status}
        lastSavedAt={lastSavedAt}
      />

      <div className="flex-1 overflow-hidden" style={{ marginTop: '58px' }}>
        {/* Desktop: side-by-side */}
        <div
          className="hidden lg:grid h-full"
          style={{ gridTemplateColumns: '420px 1fr' }}
        >
          <EditorPanel />
          <PreviewPanel />
        </div>

        {/* Mobile: one panel at a time */}
        <div className="lg:hidden h-full relative">
          <div
            className={`absolute inset-0 transition-transform duration-300 ${
              mobilePanel === 'editor' ? 'translate-x-0' : '-translate-x-full pointer-events-none'
            }`}
          >
            <EditorPanel />
          </div>
          <div
            className={`absolute inset-0 transition-transform duration-300 ${
              mobilePanel === 'preview' ? 'translate-x-0' : 'translate-x-full pointer-events-none'
            }`}
          >
            <PreviewPanel />
          </div>
        </div>
      </div>

      <MobileBottomNav active={mobilePanel} onChange={setMobilePanel} />
      <LoadingOverlay />

      {/* Cloud sync status — mobile only (desktop in topbar) */}
      <div className="lg:hidden fixed bottom-14 right-3 z-30">
        <SyncPill status={status} lastSavedAt={lastSavedAt} />
      </div>
    </div>
  )
}

// Small floating pill for mobile sync status
function SyncPill({
  status,
  lastSavedAt,
}: {
  status: string
  lastSavedAt: Date | null
}) {
  if (status === 'idle') return null
  const map: Record<string, string> = {
    saving: 'Saving…',
    saved: lastSavedAt
      ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : 'Saved',
    error: 'Save failed',
  }
  const colorMap: Record<string, string> = {
    saving: 'bg-[var(--accent)] text-white',
    saved: 'bg-[#e8f5ed] text-[#27ae60]',
    error: 'bg-[#feeeed] text-[var(--danger)]',
  }
  return (
    <div
      className={`text-[0.7rem] font-medium px-2.5 py-1 rounded-full shadow-md ${colorMap[status] ?? ''}`}
      aria-live="polite"
    >
      {map[status]}
    </div>
  )
}
