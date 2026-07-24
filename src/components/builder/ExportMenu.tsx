'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Download, FileText, FileJson, FileType2,
  ChevronDown, Loader2, Printer, Upload,
} from 'lucide-react'
import { useResumeExport } from '@/hooks/useResumeExport'
import { useExportExtended } from '@/hooks/useExportExtended'
import { useUIStore } from '@/store'
import { cn } from '@/utils'

type ActiveView = 'resume' | 'coverletter'

interface ExportMenuProps {
  activeView: ActiveView
}

/**
 * Dropdown export button with options:
 * - PDF (resume or cover letter)
 * - DOCX (resume only)
 * - JSON backup
 * - JSON import (restore)
 * - Print
 */
export function ExportMenu({ activeView }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { exportPdf, printDocument } = useResumeExport()
  const { exportDocx, exportJson, importJson, isDocxExporting, isJsonExporting } = useExportExtended()
  const { isExporting } = useUIStore()

  const isAnyExporting = isExporting || isDocxExporting || isJsonExporting

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen])

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await importJson(file)
    e.target.value = ''
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isAnyExporting}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-sm)]',
          'bg-[var(--accent)] text-white text-sm font-medium',
          'shadow-[0_2px_8px_rgba(45,90,61,0.25)]',
          'hover:bg-[var(--accent2)] hover:-translate-y-px',
          'hover:shadow-[0_4px_16px_rgba(45,90,61,0.35)]',
          'transition-all duration-200',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0',
        )}
      >
        {isAnyExporting
          ? <Loader2 size={14} className="animate-spin" aria-hidden />
          : <Download size={14} aria-hidden />}
        Export
        <ChevronDown
          size={12}
          className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Export options"
          className={cn(
            'absolute right-0 top-full mt-1.5 z-50 min-w-[210px]',
            'bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)]',
            'shadow-[var(--shadow-lg)] overflow-hidden py-1',
          )}
        >
          {/* PDF */}
          <MenuItem
            icon={<FileType2 size={14} />}
            label={activeView === 'coverletter' ? 'Cover Letter PDF' : 'Resume PDF'}
            description="High-quality A4 PDF"
            onClick={() => {
              exportPdf(activeView === 'coverletter' ? 'coverletter' : 'resume')
              setIsOpen(false)
            }}
          />

          {/* DOCX — resume only */}
          {activeView === 'resume' && (
            <MenuItem
              icon={
                isDocxExporting
                  ? <Loader2 size={14} className="animate-spin" />
                  : <FileText size={14} />
              }
              label="Word Document (.docx)"
              description="ATS-friendly for job portals"
              onClick={() => {
                exportDocx()
                setIsOpen(false)
              }}
              disabled={isDocxExporting}
            />
          )}

          {/* Print */}
          <MenuItem
            icon={<Printer size={14} />}
            label="Print"
            description="Opens browser print dialog"
            onClick={() => {
              printDocument()
              setIsOpen(false)
            }}
          />

          <div className="h-px bg-[var(--border)] my-1 mx-2" role="separator" />

          {/* JSON backup */}
          <MenuItem
            icon={
              isJsonExporting
                ? <Loader2 size={14} className="animate-spin" />
                : <FileJson size={14} />
            }
            label="Export Backup (.json)"
            description="Save to restore later"
            onClick={() => {
              exportJson()
              setIsOpen(false)
            }}
            disabled={isJsonExporting}
          />

          {/* JSON import */}
          <MenuItem
            icon={<Upload size={14} />}
            label="Import Backup"
            description="Restore from .json backup"
            onClick={() => fileInputRef.current?.click()}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="sr-only"
            aria-hidden
            onChange={handleImportFile}
          />
        </div>
      )}
    </div>
  )
}

// ── MenuItem sub-component ────────────────────────────────────

function MenuItem({
  icon,
  label,
  description,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-start gap-2.5 w-full px-3.5 py-2.5 text-left',
        'transition-colors duration-150',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-[var(--surface2)] cursor-pointer',
      )}
    >
      <span className="text-[var(--accent)] mt-0.5 flex-shrink-0">{icon}</span>
      <span>
        <span className="block text-[0.82rem] font-medium text-[var(--text)]">{label}</span>
        <span className="block text-[0.72rem] text-[var(--text3)] mt-0.5">{description}</span>
      </span>
    </button>
  )
}
