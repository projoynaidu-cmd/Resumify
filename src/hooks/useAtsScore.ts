'use client'

import { useMemo } from 'react'
import { useResumeStore } from '@/store'
import { calculateAtsScore } from '@/lib/ats'
import type { AtsResult } from '@/types'

/**
 * Memoized ATS score for the current resume state.
 * Only recomputes when resume content fields change.
 */
export function useAtsScore(): AtsResult {
  const personal = useResumeStore((s) => s.personal)
  const about = useResumeStore((s) => s.about)
  const skills = useResumeStore((s) => s.skills)
  const experience = useResumeStore((s) => s.experience)
  const education = useResumeStore((s) => s.education)
  const projects = useResumeStore((s) => s.projects)

  // Build a minimal state shape for the calculator
  return useMemo(
    () =>
      calculateAtsScore({
        personal,
        about,
        skills,
        experience,
        education,
        projects,
        // Non-scoring fields
        template: 'classic',
        accentColor: '',
        resumeFont: '',
        headingFont: null,
        fontPairingId: null,
        filename: '',
        photoDataUrl: null,
        customPalette: null,
        customSections: [],
        coverLetter: { to: '', company: '', position: '', date: '', body: '' },
        sectionOrder: [],
      }),
    // Stringify for deep equality without extra deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      JSON.stringify(personal),
      about,
      JSON.stringify(skills),
      JSON.stringify(experience),
      JSON.stringify(education),
      JSON.stringify(projects),
    ],
  )
}
