'use client'

import { useState, useCallback } from 'react'
import { FileText, Check } from 'lucide-react'
import { useResumeStore } from '@/store'
import { cn } from '@/utils'

/** Strips illegal filesystem characters and trims whitespace */
function sanitizeFilename(raw: string): string {
  return raw
    .trim()
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\.pdf$/i, '')
    .slice(0, 80)
}

/**
 * Compact filename input that sits in the Personal section.
 * Shows the `.pdf` suffix as a static label and sanitises the value
 * on blur.
 */
export function FilenameInput() {
  const filename = useResumeStore((s) => s.filename)
  const setFilename = useResumeStore((s) => s.setFilename)
  const [localValue, setLocalValue] = useState(filename)
  const [saved, setSaved] = useState(false)

  const handleBlur = useCallback(() => {
    const clean = sanitizeFilename(localValue) || 'my-resume'
    setLocalValue(clean)
    setFilename(clean)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, [localValue, setFilename])

  return (
    <div>
      <label className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em] block mb-1">
        PDF Filename
      </label>
      <div
        className={cn(
          'flex items-center gap-1.5',
          'bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)]',
          'px-2.5 py-2',
          'transition-[border-color,box-shadow] duration-200',
          'focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_rgba(45,90,61,0.1)]',
        )}
      >
        <FileText size={13} className="text-[var(--text3)] flex-shrink-0" aria-hidden />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          aria-label="PDF output filename"
          className="flex-1 bg-transparent border-none outline-none text-[0.85rem] font-sans text-[var(--text)] min-w-0"
          placeholder="my-resume"
          maxLength={80}
        />
        <span className="text-[0.75rem] text-[var(--text3)] flex-shrink-0 font-mono select-none">
          .pdf
        </span>
        {saved && (
          <Check
            size={13}
            className="text-[#27ae60] flex-shrink-0 animate-in fade-in"
            aria-label="Saved"
          />
        )}
      </div>
    </div>
  )
}
