'use client'

import { useRef } from 'react'
import { Eye } from 'lucide-react'
import { PreviewViewport } from './PreviewViewport'

export function PreviewPanel() {
  const panelRef = useRef<HTMLElement>(null)

  return (
    <main
      ref={panelRef}
      id="preview-panel"
      aria-label="Resume live preview"
      className="bg-[var(--bg)] h-full overflow-hidden flex flex-col px-3 sm:px-5 lg:px-7 pt-6 sm:pt-8 lg:pt-9 pb-9"
      style={{
        transition: 'background var(--transition)',
      }}
    >
      {/* Header */}
      <div className="hidden sm:flex items-center gap-2 text-[0.72rem] font-semibold text-[var(--text3)] uppercase tracking-[0.08em] mb-4 no-print">
        <Eye size={13} aria-hidden />
        Live Preview

        <span
          className="flex-1 h-px bg-[var(--border)]"
          aria-hidden
        />
      </div>

      {/* Zoomable Preview */}
      <div className="flex-1 overflow-hidden">
        <PreviewViewport />
      </div>
    </main>
  )
}