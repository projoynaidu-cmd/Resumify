'use client'

import { useState, useCallback } from 'react'
import { useResumeStore, useUIStore } from '@/store'
import { useAiUsage } from './useAiUsage'
import type { ExperienceEntry } from '@/types'

interface AiCallOptions {
  /** Called with the result string(s) on success */
  onSuccess?: (result: string) => void
}

/**
 * Unified hook for all AI generation features. Each method:
 * 1. Checks quota client-side (fast fail before network call)
 * 2. Calls the corresponding API route
 * 3. Records usage server-side (handled by the route)
 * 4. Refreshes the quota badge
 * 5. Shows a toast on error
 *
 * Usage:
 * ```tsx
 * const { generateSummary, isGenerating } = useAiGenerate()
 * <Button onClick={() => generateSummary()} disabled={isGenerating}>
 *   AI Write Summary
 * </Button>
 * ```
 */
export function useAiGenerate() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const addToast = useUIStore((s) => s.addToast)
  const { status, refresh } = useAiUsage()

  const checkQuota = useCallback((): boolean => {
    if (status && !status.canUse) {
      addToast('error', 'Daily AI limit reached. Upgrade to Pro for unlimited AI features.')
      return false
    }
    return true
  }, [status, addToast])

  const callApi = useCallback(
    async (endpoint: string, payload: object): Promise<{ ok: boolean; data: Record<string, unknown> }> => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      return { ok: res.ok, data }
    },
    [],
  )

  // ── Summary generator ──────────────────────────────────────
  const generateSummary = useCallback(
    async (opts: AiCallOptions = {}) => {
      if (!checkQuota()) return
      setIsGenerating(true)
      setActiveFeature('summary')
      try {
        const resumeData = useResumeStore.getState()
        const { ok, data } = await callApi('/api/ai/summary', { resumeData })

        if (!ok) {
          addToast('error', (data.error as string) ?? 'Failed to generate summary')
          return
        }

        const summary = data.summary as string
        useResumeStore.getState().updateAbout(summary)
        opts.onSuccess?.(summary)
        addToast('success', 'Summary generated!')
        refresh()
      } catch {
        addToast('error', 'Something went wrong. Please try again.')
      } finally {
        setIsGenerating(false)
        setActiveFeature(null)
      }
    },
    [checkQuota, callApi, addToast, refresh],
  )

  // ── Bullet improver ─────────────────────────────────────────
  const improveBullets = useCallback(
    async (entry: ExperienceEntry, opts: AiCallOptions = {}) => {
      if (!checkQuota()) return
      setIsGenerating(true)
      setActiveFeature(`bullet-${entry.id}`)
      try {
        const { ok, data } = await callApi('/api/ai/bullet', {
          entry: { title: entry.title, company: entry.company, desc: entry.desc },
        })

        if (!ok) {
          addToast('error', (data.error as string) ?? 'Failed to improve bullets')
          return
        }

        const bullets = data.bullets as string
        useResumeStore.getState().updateExperience(entry.id, { desc: bullets })
        opts.onSuccess?.(bullets)
        addToast('success', 'Bullets improved!')
        refresh()
      } catch {
        addToast('error', 'Something went wrong. Please try again.')
      } finally {
        setIsGenerating(false)
        setActiveFeature(null)
      }
    },
    [checkQuota, callApi, addToast, refresh],
  )

  // ── Cover letter draft ───────────────────────────────────────
  const generateCoverLetterAi = useCallback(
    async (opts: AiCallOptions = {}) => {
      if (!checkQuota()) return
      setIsGenerating(true)
      setActiveFeature('cover-letter')
      try {
        const resumeData = useResumeStore.getState()
        const { ok, data } = await callApi('/api/ai/cover-letter', { resumeData })

        if (!ok) {
          addToast('error', (data.error as string) ?? 'Failed to generate cover letter')
          return
        }

        const letterBody = data.body as string
        useResumeStore.getState().updateCoverLetter({ body: letterBody })
        opts.onSuccess?.(letterBody)
        addToast('success', 'Cover letter drafted!')
        refresh()
      } catch {
        addToast('error', 'Something went wrong. Please try again.')
      } finally {
        setIsGenerating(false)
        setActiveFeature(null)
      }
    },
    [checkQuota, callApi, addToast, refresh],
  )

  // ── ATS keyword gap analysis ─────────────────────────────────
  const analyzeKeywordGap = useCallback(
    async (jobDescription: string): Promise<string[] | null> => {
      if (!checkQuota()) return null
      setIsGenerating(true)
      setActiveFeature('ats-keywords')
      try {
        const resumeData = useResumeStore.getState()
        const { ok, data } = await callApi('/api/ai/ats-keywords', {
          resumeData,
          jobDescription,
        })

        if (!ok) {
          addToast('error', (data.error as string) ?? 'Failed to analyze keywords')
          return null
        }

        refresh()
        return data.missingKeywords as string[]
      } catch {
        addToast('error', 'Something went wrong. Please try again.')
        return null
      } finally {
        setIsGenerating(false)
        setActiveFeature(null)
      }
    },
    [checkQuota, callApi, addToast, refresh],
  )

  return {
    isGenerating,
    activeFeature,
    generateSummary,
    improveBullets,
    generateCoverLetterAi,
    analyzeKeywordGap,
    quotaStatus: status,
  }
}
