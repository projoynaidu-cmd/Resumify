'use client'

import { useState } from 'react'
import { Palette, Plus, Trash2, Check, X } from 'lucide-react'
import { useCustomPalettes } from '@/hooks/useCustomPalettes'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils'
import type { CustomPalette } from '@/types'

interface CustomPaletteEditorProps {
  activePaletteId: string | null
  onApply: (palette: CustomPalette) => void
  onClear: () => void
  /** Current resume accent — used to seed a new palette draft */
  currentAccent: string
}

const DEFAULT_DRAFT: Omit<CustomPalette, 'id' | 'createdAt'> = {
  name: 'My Palette',
  accent: '#2d5a3d',
  header: '#1a1814',
  text: '#2c2a26',
  subtle: '#7a756e',
  border: '#d8d3c8',
  background: '#ffffff',
}

const SWATCH_FIELDS: { key: keyof typeof DEFAULT_DRAFT; label: string }[] = [
  { key: 'accent', label: 'Accent' },
  { key: 'header', label: 'Headings' },
  { key: 'text', label: 'Body text' },
  { key: 'subtle', label: 'Subtle text' },
  { key: 'border', label: 'Borders' },
  { key: 'background', label: 'Background' },
]

export function CustomPaletteEditor({
  activePaletteId,
  onApply,
  onClear,
  currentAccent,
}: CustomPaletteEditorProps) {
  const { palettes, savePalette, deletePalette, isAtLimit, limit } = useCustomPalettes()
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState({ ...DEFAULT_DRAFT, accent: currentAccent })

  function handleSave() {
    const created = savePalette(draft)
    if (created) {
      onApply(created)
      setIsCreating(false)
      setDraft({ ...DEFAULT_DRAFT, accent: currentAccent })
    }
  }

  function updateDraftField(key: keyof typeof DEFAULT_DRAFT, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em] flex items-center gap-1.5">
          <Palette size={11} aria-hidden /> Custom Palettes
        </p>
        {activePaletteId && (
          <button
            type="button"
            onClick={onClear}
            className="text-[0.7rem] text-[var(--text3)] hover:text-[var(--danger)] flex items-center gap-1"
          >
            <X size={10} aria-hidden /> Clear
          </button>
        )}
      </div>

      {/* Saved palettes */}
      {palettes.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-2.5">
          {palettes.map((p) => {
            const isActive = activePaletteId === p.id
            return (
              <div
                key={p.id}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] border transition-colors duration-200',
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
                    : 'border-[var(--border)] bg-[var(--surface)]',
                )}
              >
                {/* Swatch preview */}
                <div className="flex -space-x-1 flex-shrink-0">
                  {[p.accent, p.header, p.subtle].map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border-2 border-[var(--surface)]"
                      style={{ background: c }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onApply(p)}
                  className="flex-1 text-left text-[0.78rem] font-medium text-[var(--text)] truncate"
                >
                  {p.name}
                </button>

                {isActive && <Check size={13} className="text-[var(--accent)] flex-shrink-0" aria-hidden />}

                <button
                  type="button"
                  onClick={() => deletePalette(p.id)}
                  className="flex-shrink-0 text-[var(--text3)] hover:text-[var(--danger)] p-0.5"
                  aria-label={`Delete ${p.name}`}
                >
                  <Trash2 size={12} aria-hidden />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Create new palette */}
      {!isCreating ? (
        <Button
          variant="accent"
          size="sm"
          fullWidth
          onClick={() => setIsCreating(true)}
          disabled={isAtLimit}
        >
          <Plus size={12} aria-hidden />
          {isAtLimit ? `Limit reached (${limit})` : 'Create Custom Palette'}
        </Button>
      ) : (
        <div className="border border-[var(--border)] rounded-[var(--radius-sm)] p-3 bg-[var(--surface)] flex flex-col gap-2.5">
          <Input
            label="Palette name"
            value={draft.name}
            onChange={(e) => updateDraftField('name', e.target.value)}
            placeholder="e.g. Midnight Blue"
          />

          <div className="grid grid-cols-2 gap-2">
            {SWATCH_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <label className="relative flex-shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={draft[key]}
                    onChange={(e) => updateDraftField(key, e.target.value)}
                    className="sr-only"
                    aria-label={label}
                  />
                  <span
                    className="block w-7 h-7 rounded-[5px] border border-[var(--border)]"
                    style={{ background: draft[key] }}
                  />
                </label>
                <span className="text-[0.72rem] text-[var(--text2)] truncate">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-1">
            <Button variant="secondary" size="sm" fullWidth onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" fullWidth onClick={handleSave}>
              Save &amp; Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
