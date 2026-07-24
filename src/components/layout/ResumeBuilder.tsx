'use client'

import { useEffect, useState } from 'react'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Topbar } from './Topbar'
import { MobileBottomNav } from './MobileBottomNav'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { PreviewPanel } from '@/components/preview/PreviewPanel'
import { LoadingOverlay } from '@/components/shared/LoadingOverlay'
import { useResumeStore } from '@/store'
import { cn } from '@/utils'

/**
 * Mobile: stacked — one panel visible at a time, toggled by bottom nav.
 * Tablet (md): same as mobile but slightly wider editor.
 * Desktop (lg+): side-by-side, editor 420px fixed, preview fills rest.
 */
export default function ResumeBuilder() {
  useKeyboardShortcuts()
  const loadFromStorage = useResumeStore((s) => s.loadFromStorage)

  // Mobile active panel: 'editor' | 'preview'
  const [mobilePanel, setMobilePanel] = useState<'editor' | 'preview'>('editor')

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <Topbar />

      {/* ── Main content area ── */}
      <div
        className="flex-1 overflow-hidden"
        style={{ marginTop: '58px' }}
      >
        {/* Desktop: side-by-side grid */}
        <div className="hidden lg:grid h-full"
          style={{ gridTemplateColumns: '420px 1fr' }}
        >
          <EditorPanel />
          <PreviewPanel />
        </div>

        {/* Mobile / Tablet: single panel at a time */}
        <div className="lg:hidden h-full relative">
          <div
            className={cn(
              'absolute inset-0 transition-transform duration-300 ease-in-out',
              mobilePanel === 'editor'
                ? 'translate-x-0'
                : '-translate-x-full pointer-events-none',
            )}
          >
            <EditorPanel />
          </div>
          <div
            className={cn(
              'absolute inset-0 transition-transform duration-300 ease-in-out',
              mobilePanel === 'preview'
                ? 'translate-x-0'
                : 'translate-x-full pointer-events-none',
            )}
          >
            <PreviewPanel />
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNav
        active={mobilePanel}
        onChange={setMobilePanel}
      />

      <LoadingOverlay />
    </div>
  )
}
