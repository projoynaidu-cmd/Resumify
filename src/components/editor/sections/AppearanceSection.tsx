'use client'

import { useResumeStore, useUIStore } from '@/store'
import { ColorPicker } from '@/components/editor/ColorPicker'
import { FontPicker } from '@/components/editor/FontPicker'
import { FontPairingPicker } from '@/components/editor/FontPairingPicker'
import { TemplatePicker } from '@/components/editor/TemplatePicker'
import { CustomPaletteEditor } from '@/components/editor/CustomPaletteEditor'
import { Divider } from '@/components/ui/Divider'
import { cn } from '@/utils'
import { useState } from 'react'
import type { FontOption, TemplateId, CustomPalette } from '@/types'

type FontMode = 'single' | 'pairing'

export function AppearanceSection() {
  const template = useResumeStore((s) => s.template)
  const accentColor = useResumeStore((s) => s.accentColor)
  const resumeFont = useResumeStore((s) => s.resumeFont)
  const fontPairingId = useResumeStore((s) => s.fontPairingId)
  const customPalette = useResumeStore((s) => s.customPalette)

  const setTemplate = useResumeStore((s) => s.setTemplate)
  const setAccentColor = useResumeStore((s) => s.setAccentColor)
  const setResumeFont = useResumeStore((s) => s.setResumeFont)
  const setFontPairing = useResumeStore((s) => s.setFontPairing)
  const setCustomPalette = useResumeStore((s) => s.setCustomPalette)
  const addToast = useUIStore((s) => s.addToast)

  const [fontMode, setFontMode] = useState<FontMode>(fontPairingId ? 'pairing' : 'single')

  function handleColorChange(color: string) {
    setAccentColor(color)
  }

  function handleFontChange(font: FontOption) {
    setResumeFont(font.value)
    addToast('info', `Font: ${font.name}`)
  }

  function handlePairingSelect(pairingId: string) {
    setFontPairing(pairingId)
    addToast('info', 'Font pairing applied')
  }

  function handleTemplateChange(id: TemplateId) {
    setTemplate(id)
    addToast('info', `Template: ${id.charAt(0).toUpperCase() + id.slice(1)}`)
  }

  function handleApplyPalette(palette: CustomPalette) {
    setCustomPalette(palette)
    addToast('success', `Applied "${palette.name}"`)
  }

  function handleClearPalette() {
    setCustomPalette(null)
    addToast('info', 'Custom palette cleared — using accent color only')
  }

  return (
    <div className="space-y-4">
      {/* Template grid */}
      <div>
        <p className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em] mb-2">
          Template
        </p>
        <TemplatePicker value={template} onChange={handleTemplateChange} />
      </div>

      <Divider />

      {/* Accent color (simple) */}
      <div>
        <p className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em] mb-2">
          Accent Color
          {customPalette && (
            <span className="ml-1.5 normal-case font-normal text-[var(--text3)]">
              (overridden by custom palette below)
            </span>
          )}
        </p>
        <ColorPicker value={customPalette?.accent ?? accentColor} onChange={handleColorChange} />
      </div>

      <Divider />

      {/* Custom palette editor */}
      <CustomPaletteEditor
        activePaletteId={customPalette?.id ?? null}
        onApply={handleApplyPalette}
        onClear={handleClearPalette}
        currentAccent={accentColor}
      />

      <Divider />

      {/* Font mode toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em]">
            Typography
          </p>
          <div className="flex bg-[var(--surface2)] border border-[var(--border)] rounded-[6px] p-[2px] gap-0.5">
            <button
              type="button"
              onClick={() => setFontMode('single')}
              className={cn(
                'px-2 py-1 rounded-[4px] text-[0.7rem] font-medium transition-colors',
                fontMode === 'single'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text3)] hover:text-[var(--text)]',
              )}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setFontMode('pairing')}
              className={cn(
                'px-2 py-1 rounded-[4px] text-[0.7rem] font-medium transition-colors',
                fontMode === 'pairing'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text3)] hover:text-[var(--text)]',
              )}
            >
              Pairing
            </button>
          </div>
        </div>

        {fontMode === 'single' ? (
          <FontPicker value={resumeFont} onChange={handleFontChange} />
        ) : (
          <FontPairingPicker activePairingId={fontPairingId} onSelect={handlePairingSelect} />
        )}
      </div>
    </div>
  )
}
