'use client'

import { FONTS } from '@/lib/constants'
import { cn } from '@/utils'
import type { FontOption } from '@/types'

interface FontPickerProps {
  value: string
  onChange: (font: FontOption) => void
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
      {FONTS.map((f) => {
        const isSelected = value === f.value
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f)}
            aria-pressed={isSelected}
            className={cn(
              'px-2.5 py-2 border rounded-[var(--radius-sm)] cursor-pointer text-center',
              'transition-all duration-200 bg-[var(--surface)] font-sans text-[0.78rem]',
              isSelected
                ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)] hover:bg-[var(--accent-bg)]',
            )}
          >
            {/* Font name in its own typeface */}
            <div
              className="font-semibold mb-0.5 leading-tight"
              style={{ fontFamily: f.value }}
            >
              {f.name}
            </div>
            <div
              className="text-[0.68rem] opacity-70 leading-tight"
              style={{ fontFamily: f.value }}
            >
              {f.sample}
            </div>
          </button>
        )
      })}
    </div>
  )
}
