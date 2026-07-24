'use client'

import { useRef } from 'react'
import { Eye } from 'lucide-react'
import { useUIStore } from '@/store'
import { usePreviewScale } from '@/hooks/usePreviewScale'
import { ResumePreview } from './ResumePreview'
import { CoverLetterPreview } from './CoverLetterPreview'

export function PreviewPanel() {
  const activeView = useUIStore((s) => s.activeView)
  const panelRef = useRef<HTMLElement>(null)
  const { scale, bottomOffset } = usePreviewScale(panelRef)

  return (
    <main
      ref={panelRef}
      className="bg-[var(--bg)] h-full overflow-y-auto flex flex-col items-center
                 px-3 sm:px-5 lg:px-7 pt-6 sm:pt-8 lg:pt-9 pb-9"
      id="preview-panel"
      style={{ transition: 'background var(--transition)' }}
      aria-label="Resume live preview"
    >
      {/* Label — hidden on mobile to save space */}
      <div className="hidden sm:flex self-start items-center gap-2 text-[0.72rem] font-semibold text-[var(--text3)] uppercase tracking-[0.08em] mb-4 no-print">
        <Eye size={13} aria-hidden />
        Live Preview
        <span className="flex-1 h-px bg-[var(--border)] w-24 sm:w-40 block" aria-hidden />
      </div>

      {/* Resume */}
      <div
        id="resume-wrapper"
        className="w-[794px] bg-white shadow-[var(--shadow-lg)] rounded-[4px] overflow-hidden"
        style={{
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
          marginBottom: `${bottomOffset}px`,
          display: activeView === 'resume' ? '' : 'none',
        }}
        aria-hidden={activeView !== 'resume'}
      >
        <ResumePreview />
      </div>

      {/* Cover letter */}
      <div
        style={{
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
          marginBottom: `${bottomOffset}px`,
          display: activeView === 'coverletter' ? 'block' : 'none',
        }}
        aria-hidden={activeView !== 'coverletter'}
      >
        <CoverLetterPreview />
      </div>
    </main>
  )
}
