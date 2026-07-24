'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { TEMPLATES } from '@/lib/constants'
import { FREE_TEMPLATES } from '@/lib/stripe'
import { cn } from '@/utils'
import type { TemplateId } from '@/types'

interface TemplatePickerProps {
  value: TemplateId
  onChange: (id: TemplateId) => void
}

// Mini SVG thumbnails per template
const THUMBNAILS: Record<TemplateId, React.ReactNode> = {
  classic: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="0" y="0" width="40" height="10" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="0" y="12" width="13" height="38" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="15" y="12" width="25" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="15" y="17" width="20" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="15" y="21" width="22" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="15" y="27" width="25" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="15" y="32" width="18" height="2" rx="1" fill="currentColor" opacity="0.25" />
    </svg>
  ),
  modern: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="0" y="0" width="40" height="8" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="0" y="10" width="27" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="0" y="15" width="27" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="0" y="19" width="27" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="0" y="25" width="27" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="0" y="30" width="20" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="29" y="10" width="11" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="29" y="14" width="9" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="3" y="3" width="20" height="5" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="3" y="10" width="34" height="1" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="3" y="14" width="34" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="3" y="18" width="28" height="1.5" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="3" y="23" width="34" height="1" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="3" y="27" width="34" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="3" y="31" width="25" height="1.5" rx="1" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  executive: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="0" y="0" width="40" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="2" y="2" width="22" height="5" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="0" y="11" width="28" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="0" y="16" width="28" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="30" y="11" width="10" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="30" y="15" width="8" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="0" y="26" width="28" height="3" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  creative: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="0" y="0" width="14" height="52" rx="1" fill="currentColor" opacity="0.6" />
      <circle cx="7" cy="8" r="4" fill="white" opacity="0.5" />
      <rect x="2" y="15" width="10" height="1.5" rx="1" fill="white" opacity="0.5" />
      <rect x="16" y="5" width="22" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="16" y="10" width="22" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="16" y="15" width="22" height="3" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  compact: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="5" y="2" width="30" height="5" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="3" y="9" width="34" height="1.5" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="0" y="13" width="19" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="0" y="18" width="19" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="21" y="13" width="19" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="21" y="18" width="19" height="2" rx="1" fill="currentColor" opacity="0.25" />
    </svg>
  ),
  timeline: (
    // Header + vertical line with dots
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="0" y="0" width="40" height="9" rx="1" fill="currentColor" opacity="0.5" />
      <line x1="5" y1="14" x2="5" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="5" cy="16" r="2" fill="currentColor" opacity="0.7" />
      <rect x="10" y="14" width="26" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="10" y="18" width="20" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
      <circle cx="5" cy="27" r="2" fill="currentColor" opacity="0.7" />
      <rect x="10" y="25" width="26" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="10" y="29" width="22" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
      <circle cx="5" cy="38" r="2" fill="currentColor" opacity="0.7" />
      <rect x="10" y="36" width="26" height="2" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  elegant: (
    // Centered header, centered text blocks
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <circle cx="20" cy="8" r="4" fill="currentColor" opacity="0.3" />
      <rect x="10" y="15" width="20" height="3" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="14" y="20" width="12" height="1.5" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="6" y="27" width="28" height="1" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="10" y="31" width="20" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="8" y="35" width="24" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="12" y="41" width="16" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
    </svg>
  ),
  technical: (
    // Terminal bar + monospace block
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="0" y="0" width="40" height="6" rx="1" fill="currentColor" opacity="0.7" />
      <circle cx="3.5" cy="3" r="0.8" fill="white" opacity="0.8" />
      <circle cx="6.5" cy="3" r="0.8" fill="white" opacity="0.6" />
      <circle cx="9.5" cy="3" r="0.8" fill="white" opacity="0.4" />
      <rect x="0" y="8" width="40" height="11" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="3" y="15" width="14" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="3" y="23" width="16" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="3" y="27" width="34" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="3" y="31" width="30" height="1.5" rx="1" fill="currentColor" opacity="0.25" />
    </svg>
  ),
  bold: (
    // Large solid header block, bold section dividers
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect x="0" y="0" width="40" height="13" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="3" y="3" width="22" height="4" rx="1" fill="white" opacity="0.8" />
      <rect x="3" y="9" width="14" height="2" rx="1" fill="white" opacity="0.5" />
      <rect x="0" y="16" width="40" height="2" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="3" y="22" width="3" height="10" fill="currentColor" opacity="0.6" />
      <rect x="9" y="22" width="20" height="2.5" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="9" y="27" width="16" height="2" rx="1" fill="currentColor" opacity="0.25" />
    </svg>
  ),
}

export function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  const { data: session } = useSession()
  const isPro =
    session?.user?.plan === 'PRO' || session?.user?.plan === 'ENTERPRISE'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {TEMPLATES.map((tpl) => {
        const isSelected = value === tpl.id
        const isLocked = !isPro && !FREE_TEMPLATES.includes(tpl.id)

        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => !isLocked && onChange(tpl.id)}
            aria-pressed={isSelected}
            aria-disabled={isLocked}
            title={isLocked ? `${tpl.label} — Pro only` : tpl.description}
            className={cn(
              'group relative flex flex-col items-center gap-1.5 p-2',
              'border rounded-[var(--radius-sm)] text-center',
              'transition-all duration-200 bg-[var(--surface)]',
              isLocked
                ? 'cursor-default opacity-60'
                : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]',
              isSelected
                ? 'border-[var(--accent)] shadow-[0_0_0_2px_rgba(45,90,61,0.15)]'
                : 'border-[var(--border)]',
            )}
          >
            {/* Thumbnail */}
            <div
              className={cn(
                'w-full aspect-[3/4] rounded-[4px] overflow-hidden p-1.5 transition-colors duration-200',
                isSelected
                  ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                  : 'bg-[var(--surface2)] text-[var(--text3)] group-hover:text-[var(--accent)]',
              )}
            >
              {THUMBNAILS[tpl.id]}
            </div>

            {/* Label */}
            <span
              className={cn(
                'text-[0.72rem] font-medium leading-tight',
                isSelected ? 'text-[var(--accent)]' : 'text-[var(--text2)]',
              )}
            >
              {tpl.label}
            </span>

            {/* Pro lock badge */}
            {isLocked && (
              <span className="absolute top-1.5 right-1.5 bg-[var(--accent)] text-white rounded-full w-4 h-4 grid place-items-center">
                <Lock size={8} aria-hidden />
              </span>
            )}
          </button>
        )
      })}

      {/* Pro upsell row */}
      {!isPro && (
        <div className="col-span-2 sm:col-span-3 mt-1">
          <Link
            href="/billing"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-[var(--radius-sm)] text-[0.75rem] font-medium text-[var(--accent)] bg-[var(--accent-bg)] hover:bg-[var(--accent)] hover:text-white transition-colors no-underline"
          >
            <Lock size={11} aria-hidden />
            Unlock Executive, Creative &amp; Compact with Pro
          </Link>
        </div>
      )}
    </div>
  )
}
