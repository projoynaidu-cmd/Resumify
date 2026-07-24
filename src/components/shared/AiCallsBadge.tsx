'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { useAiUsage } from '@/hooks/useAiUsage'
import { cn } from '@/utils'

/**
 * Small badge shown in the editor sidebar indicating remaining
 * daily AI calls for free-plan users. Hidden for Pro users and
 * while loading.
 */
export function AiCallsBadge() {
  const { status, loading } = useAiUsage()

  if (loading || !status || status.limit === 'unlimited') return null

  const isLow = typeof status.remaining === 'number' && status.remaining <= 1

  return (
    <div className="px-5 pb-2">
      <Link
        href="/billing"
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-[0.72rem] font-medium no-underline transition-colors',
          isLow
            ? 'bg-[#fef3e2] text-[#854d0e] hover:bg-[#fde9c8]'
            : 'bg-[var(--accent-bg)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white',
        )}
      >
        <Sparkles size={11} aria-hidden />
        {status.remaining}/{status.limit} AI calls left today
        {isLow && ' · Upgrade'}
      </Link>
    </div>
  )
}
