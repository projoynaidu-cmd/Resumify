'use client'

import { memo, useEffect } from 'react'
import { useResumeStore } from '@/store'
import { ClassicTemplate } from '../templates/ClassicTemplate'
import { ModernTemplate } from '../templates/ModernTemplate'
import { MinimalTemplate } from '../templates/MinimalTemplate'
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate'
import { CreativeTemplate } from '../templates/CreativeTemplate'
import { CompactTemplate } from '../templates/CompactTemplate'
import { TimelineTemplate } from '../templates/TimelineTemplate'
import { ElegantTemplate } from '../templates/ElegantTemplate'
import { TechnicalTemplate } from '../templates/TechnicalTemplate'
import { BoldTemplate } from '../templates/BoldTemplate'
import { FONT_PAIRINGS } from '@/lib/constants'
import type { TemplateId } from '@/types'

const TEMPLATE_MAP: Record<TemplateId, React.ComponentType> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  compact: CompactTemplate,
  timeline: TimelineTemplate,
  elegant: ElegantTemplate,
  technical: TechnicalTemplate,
  bold: BoldTemplate,
}

export const ResumePreview = memo(function ResumePreview() {
  const template = useResumeStore((s) => s.template)
  const accentColor = useResumeStore((s) => s.accentColor)
  const resumeFont = useResumeStore((s) => s.resumeFont)
  const headingFont = useResumeStore((s) => s.headingFont)
  const fontPairingId = useResumeStore((s) => s.fontPairingId)
  const customPalette = useResumeStore((s) => s.customPalette)

  // Sync CSS vars for resume rendering — accent, fonts, and palette overrides
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement.style

    // Resolve effective fonts: a saved pairing wins over manual selections
    const pairing = fontPairingId ? FONT_PAIRINGS.find((f) => f.id === fontPairingId) : null
    const effectiveBodyFont = pairing?.body ?? resumeFont
    const effectiveHeadingFont = pairing?.heading ?? headingFont ?? resumeFont

    root.setProperty('--resume-font', effectiveBodyFont)
    root.setProperty('--resume-heading-font', effectiveHeadingFont)

    // Custom palette overrides individual tokens; otherwise fall back to accentColor only
    if (customPalette) {
      root.setProperty('--resume-accent', customPalette.accent)
      root.setProperty('--resume-header', customPalette.header)
      root.setProperty('--resume-text', customPalette.text)
      root.setProperty('--resume-subtle', customPalette.subtle)
      root.setProperty('--resume-border', customPalette.border)
      root.setProperty('--resume-bg', customPalette.background)
    } else {
      root.setProperty('--resume-accent', accentColor)
      root.setProperty('--resume-header', '#1a1814')
      root.setProperty('--resume-text', '#2c2a26')
      root.setProperty('--resume-subtle', '#7a756e')
      root.setProperty('--resume-border', '#d8d3c8')
      root.setProperty('--resume-bg', '#fff')
    }
  }, [accentColor, resumeFont, headingFont, fontPairingId, customPalette])

  const TemplateComponent = TEMPLATE_MAP[template]

  return (
    <div id="resume-content" className={`tpl-${template}`}>
      <TemplateComponent />
    </div>
  )
})
