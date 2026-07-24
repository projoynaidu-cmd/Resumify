'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import { useAtsScore } from '@/hooks/useAtsScore'
import { useUIStore } from '@/store'
import { atsLevelLabel, atsLevelColor } from '@/lib/ats'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

export function AtsScorePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const [hasRun, setHasRun] = useState(false)
  const addToast = useUIStore((s) => s.addToast)
  const atsResult = useAtsScore()
  const rafRef = useRef<number | null>(null)

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  function animateToScore(target: number) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    let current = 0
    const step = target / 45
    const tick = () => {
      current = Math.min(current + step, target)
      setDisplayScore(Math.round(current))
      if (current < target) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function handleRun() {
    setHasRun(true)
    setIsOpen(true)
    animateToScore(atsResult.score)
    addToast(
      atsResult.level === 'high' ? 'success'
        : atsResult.level === 'mid' ? 'info'
        : 'error',
      `ATS Score: ${atsResult.score}/100 — ${atsLevelLabel(atsResult.level)}`,
    )

    // Record score to history (fire-and-forget)
    const resumeId = typeof window !== 'undefined'
      ? window.location.pathname.split('/builder/')[1]?.split('/')[0]
      : null

    if (resumeId) {
      fetch('/api/analytics/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, score: atsResult.score }),
      }).catch(() => {})
    }

    // PostHog event (fire-and-forget)
    import('@/lib/posthog').then(({ trackEvent, ANALYTICS_EVENTS }) => {
      trackEvent(ANALYTICS_EVENTS.ATS_SCORE_CHECKED, { score: atsResult.score, level: atsResult.level })
    }).catch(() => {})
  }

  const badgeVariant =
    atsResult.level === 'high' ? 'success'
      : atsResult.level === 'mid' ? 'warning'
      : 'danger'

  return (
    <div className="mx-3 mb-3 border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
      {/* Header */}
      <button
        type="button"
        className={cn(
          'w-full flex items-center justify-between px-3.5 py-2.5',
          'bg-[var(--surface)] hover:bg-[var(--surface2)]',
          'transition-colors duration-200 cursor-pointer',
        )}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="ats-body"
      >
        <span className="text-[0.85rem] font-semibold flex items-center gap-2">
          ATS Score Checker
          {hasRun && (
            <Badge variant={badgeVariant}>
              {atsResult.score} · {atsLevelLabel(atsResult.level)}
            </Badge>
          )}
        </span>
        <ChevronDown
          size={14}
          className={cn('text-[var(--text3)] transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      {/* Body */}
      {isOpen && (
        <div id="ats-body" className="p-3.5 border-t border-[var(--border)] bg-[var(--surface2)]">

          {/* Score ring */}
          {hasRun && (
            <div className="flex flex-col items-center gap-1 mb-4" aria-live="polite">
              <ProgressRing value={displayScore} size={88} />
              <span className={cn('text-[0.78rem] font-semibold', atsLevelColor(atsResult.level))}>
                {atsLevelLabel(atsResult.level)} ATS Score
              </span>
            </div>
          )}

          {/* Check list */}
          {hasRun && (
            <ul className="flex flex-col gap-1.5 mb-4" role="list" aria-label="ATS checks">
              {atsResult.checks.map((check, i) => (
                <li key={i} className="flex items-center gap-2 text-[0.78rem]">
                  <span
                    className={cn(
                      'w-[18px] h-[18px] rounded-full grid place-items-center text-[0.6rem] flex-shrink-0',
                      check.pass ? 'bg-[#e8f5ed] text-[#27ae60]' : 'bg-[#feeeed] text-[#e74c3c]',
                    )}
                    aria-label={check.pass ? 'Pass' : 'Fail'}
                  >
                    {check.pass ? '✓' : '✕'}
                  </span>
                  <span className="flex-1 text-[var(--text2)]">{check.label}</span>
                  <span className="text-[0.7rem] text-[var(--text3)] font-mono tabular-nums">
                    {check.weight}pt
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Button variant="primary" fullWidth size="sm" onClick={handleRun}>
            <RefreshCw size={13} aria-hidden />
            {hasRun ? 'Re-run ATS Check' : 'Run ATS Check'}
          </Button>
        </div>
      )}
    </div>
  )
}
