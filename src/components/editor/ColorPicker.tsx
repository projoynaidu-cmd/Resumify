'use client'

import { ACCENT_COLORS } from '@/lib/constants'
import { cn } from '@/utils'
import { Tooltip } from '@/components/ui/Tooltip'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ACCENT_COLORS.map((c) => (
        <Tooltip key={c.value} content={c.label} side="top">
          <button
            type="button"
            onClick={() => onChange(c.value)}
            aria-label={c.label}
            aria-pressed={value === c.value}
            className={cn(
              'w-[22px] h-[22px] rounded-full border-2 transition-transform duration-200',
              'hover:scale-110 focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
              value === c.value
                ? 'border-[var(--text)] scale-125'
                : 'border-transparent',
            )}
            style={{ background: c.value }}
          />
        </Tooltip>
      ))}

      {/* Custom colour input */}
      <Tooltip content="Custom colour" side="top">
        <label className="relative cursor-pointer">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Custom accent color"
            className="sr-only"
          />
          <span
            className={cn(
              'block w-[22px] h-[22px] rounded-full border-2 border-dashed',
              'border-[var(--border)] hover:border-[var(--accent)]',
              'transition-colors duration-200',
              'bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]',
            )}
          />
        </label>
      </Tooltip>
    </div>
  )
}
