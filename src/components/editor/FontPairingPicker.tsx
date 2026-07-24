'use client'

import { FONT_PAIRINGS } from '@/lib/constants'
import { cn } from '@/utils'

interface FontPairingPickerProps {
  activePairingId: string | null
  onSelect: (pairingId: string) => void
}

/**
 * Grid of curated heading+body font pairings. Selecting one sets
 * both fonts together. Manually picking a single font elsewhere
 * (FontPicker) clears the active pairing — see resume-store.ts.
 */
export function FontPairingPicker({ activePairingId, onSelect }: FontPairingPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {FONT_PAIRINGS.map((pairing) => {
        const isSelected = activePairingId === pairing.id
        return (
          <button
            key={pairing.id}
            type="button"
            onClick={() => onSelect(pairing.id)}
            aria-pressed={isSelected}
            className={cn(
              'flex items-center justify-between gap-3 px-3 py-2.5 rounded-[var(--radius-sm)]',
              'border text-left transition-all duration-200 bg-[var(--surface)]',
              isSelected
                ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
                : 'border-[var(--border)] hover:border-[var(--accent)]',
            )}
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[0.92rem] font-semibold text-[var(--text)] truncate"
                  style={{ fontFamily: pairing.heading }}
                >
                  {pairing.label}
                </span>
              </div>
              <p className="text-[0.7rem] text-[var(--text3)] mt-0.5 truncate">
                {pairing.description}
              </p>
              <p
                className="text-[0.74rem] text-[var(--text2)] mt-1"
                style={{ fontFamily: pairing.body }}
              >
                {pairing.headingName} + {pairing.bodyName}
              </p>
            </div>
            {isSelected && (
              <span className="flex-shrink-0 text-[var(--accent)] text-xs font-bold">✓</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
