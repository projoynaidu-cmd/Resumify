/**
 * ATS (Applicant Tracking System) score calculation.
 *
 * Scoring is weighted across 12 checks. Each check has a `weight` (points
 * it contributes when passing). Final score = sum(passing weights) /
 * sum(all weights) × 100, rounded to nearest integer.
 */

import type { ResumeState, AtsCheck, AtsResult } from '@/types'

interface AtsCheckConfig {
  label: string
  weight: number
  test: (state: ResumeState) => boolean
}

const ATS_CHECKS: AtsCheckConfig[] = [
  {
    label: 'Full name provided',
    weight: 8,
    test: (s) => !!(s.personal.fname && s.personal.lname),
  },
  {
    label: 'Job title added',
    weight: 8,
    test: (s) => !!s.personal.title,
  },
  {
    label: 'Email address',
    weight: 10,
    test: (s) => !!s.personal.email && s.personal.email.includes('@'),
  },
  {
    label: 'Phone number',
    weight: 8,
    test: (s) => !!s.personal.phone,
  },
  {
    label: 'Location listed',
    weight: 6,
    test: (s) => !!s.personal.location,
  },
  {
    label: 'Professional summary (60+ chars)',
    weight: 12,
    test: (s) => s.about.length >= 60,
  },
  {
    label: 'At least 5 skills listed',
    weight: 10,
    test: (s) => s.skills.length >= 5,
  },
  {
    label: 'At least 1 work experience',
    weight: 14,
    test: (s) => s.experience.length >= 1,
  },
  {
    label: 'Experience descriptions (30+ chars each)',
    weight: 8,
    test: (s) =>
      s.experience.length > 0 &&
      s.experience.every((e) => e.desc?.length >= 30),
  },
  {
    label: 'Education listed',
    weight: 8,
    test: (s) => s.education.length >= 1,
  },
  {
    label: 'Projects / portfolio included',
    weight: 5,
    test: (s) => s.projects.length >= 1,
  },
  {
    label: 'Website / LinkedIn URL',
    weight: 3,
    test: (s) => !!s.personal.website,
  },
]

export function calculateAtsScore(state: ResumeState): AtsResult {
  const checks: AtsCheck[] = ATS_CHECKS.map(({ label, weight, test }) => ({
    label,
    weight,
    pass: test(state),
  }))

  const earned = checks.reduce((acc, c) => acc + (c.pass ? c.weight : 0), 0)
  const total = checks.reduce((acc, c) => acc + c.weight, 0)
  const score = Math.round((earned / total) * 100)

  return {
    score,
    checks,
    level: score >= 75 ? 'high' : score >= 50 ? 'mid' : 'low',
  }
}

/** Human-readable label for an ATS level */
export function atsLevelLabel(level: AtsResult['level']): string {
  return { high: 'Strong', mid: 'Average', low: 'Needs Work' }[level]
}

/** Tailwind colour class for an ATS level */
export function atsLevelColor(level: AtsResult['level']): string {
  return {
    high: 'text-[#27ae60]',
    mid: 'text-[#e67e22]',
    low: 'text-[#e74c3c]',
  }[level]
}
