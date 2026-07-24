'use client'

import { useMemo } from 'react'
import { usePlan } from './usePlan'

interface UseResumeLimitOptions {
  currentCount: number
}

/**
 * Client-side resume-limit gate, mirrors the server check in
 * lib/stripe.ts → canCreateResume(). Used to disable/enable the
 * "New Resume" button and show remaining-slot copy without a
 * round trip to the server.
 */
export function useResumeLimit({ currentCount }: UseResumeLimitOptions) {
  const { isPro } = usePlan()

  return useMemo(() => {
    const limit = isPro ? null : 3
    const canCreate = isPro || currentCount < 3
    const remaining = limit === null ? null : Math.max(0, limit - currentCount)
    const isAtLimit = limit !== null && currentCount >= limit

    return { limit, canCreate, remaining, isAtLimit, isPro }
  }, [isPro, currentCount])
}
