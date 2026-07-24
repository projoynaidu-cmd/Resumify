'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Download, Printer, Undo2, Redo2,
  Moon, Sun, Cloud, CloudOff, Loader2, CheckCircle2,
  Globe, Lock, Copy, RotateCcw, ClipboardCopy,
  Menu, X,
} from 'lucide-react'
import { useUIStore, useResumeStore } from '@/store'
import { useResumeExport } from '@/hooks/useResumeExport'
import { useTheme } from '@/hooks/useTheme'
import { useResetResume } from '@/hooks/useResetResume'
import { useClipboard } from '@/hooks/useClipboard'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { ExportMenu } from './ExportMenu'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { resumeToPlainText } from '@/lib/text-export'
import { cn } from '@/utils'
import type { SyncStatus } from '@/hooks/useCloudSync'

interface BuilderTopbarProps {
  resumeId: string
  resumeTitle: string
  userPlan: string
  syncStatus: SyncStatus
  lastSavedAt: Date | null
}

export function BuilderTopbar({
  resumeId,
  resumeTitle,
  syncStatus,
  lastSavedAt,
}: BuilderTopbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { activeView, setActiveView, addToast } = useUIStore()
  const { canUndo, canRedo, undo, redo } = useResumeStore()
  const { exportPdf, printDocument } = useResumeExport()
  const { requestReset, confirmReset, cancelReset, isPendingReset } = useResetResume()
  const { copy, isCopied } = useClipboard()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const resumeState = useResumeStore((s) => s)

  async function handleCopyText() {
    const ok = await copy(resumeToPlainText(resumeState))
    addToast(ok ? 'success' : 'error', ok ? 'Copied to clipboard!' : 'Clipboard unavailable')
    setMobileMenuOpen(false)
  }

  async function handleToggleShare() {
    setShareLoading(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}/visibility`, { method: 'PATCH' })
      const data = await res.json()
      setIsPublic(data.isPublic)
      setShareUrl(data.shareUrl)
      if (data.isPublic && data.shareUrl) {
        await copy(data.shareUrl)
        addToast('success', 'Share link copied to clipboard!')
      } else {
        addToast('info', 'Resume is now private')
      }
    } catch {
      addToast('error', 'Failed to update visibility')
    } finally {
      setShareLoading(false)
    }
  }

  async function handleDuplicate() {
    const res = await fetch(`/api/resumes/${resumeId}/duplicate`, { method: 'POST' })
    const data = await res.json()
    if (!res.ok) {
      addToast('error', data.error)
      return
    }
    addToast('success', `"${data.resume.title}" created`)
    setMobileMenuOpen(false)
  }

  function handleExport() {
    exportPdf(activeView === 'coverletter' ? 'coverletter' : 'resume')
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          'no-print fixed top-0 left-0 right-0 z-50 h-[58px]',
          'bg-[var(--surface)] border-b border-[var(--border)]',
          'flex items-center px-4 sm:px-5 gap-2 sm:gap-3',
          'shadow-[var(--shadow-sm)]',
        )}
      >
        {/* Back to dashboard */}
        <Tooltip content="My Resumes" side="bottom">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" aria-label="Back to dashboard">
              <ArrowLeft size={16} aria-hidden />
            </Button>
          </Link>
        </Tooltip>

        {/* Resume title */}
        <span className="hidden sm:block font-semibold text-[0.88rem] text-[var(--text)] truncate max-w-[140px] lg:max-w-[220px]">
          {resumeTitle}
        </span>

        <div className="hidden sm:block w-px h-[22px] bg-[var(--border)]" aria-hidden />

        {/* View tabs */}
        <nav
          role="tablist"
          className="flex bg-[var(--surface2)] border border-[var(--border)] rounded-[var(--radius-sm)] p-[3px] gap-0.5"
        >
          <ViewTab active={activeView === 'resume'} onClick={() => setActiveView('resume')}>
            Resume
          </ViewTab>
          <ViewTab active={activeView === 'coverletter'} onClick={() => setActiveView('coverletter')}>
            <span className="sm:hidden">Cover</span>
            <span className="hidden sm:inline">Cover Letter</span>
          </ViewTab>
        </nav>

        <div className="flex-1" />

        {/* Cloud sync status — desktop only */}
        <div className="hidden lg:flex items-center gap-1.5">
          <CloudStatus status={syncStatus} lastSavedAt={lastSavedAt} />
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-1">
          <Tooltip content="Undo (Ctrl+Z)" side="bottom">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo()} aria-label="Undo">
              <Undo2 size={15} />
            </Button>
          </Tooltip>
          <Tooltip content="Redo (Ctrl+Y)" side="bottom">
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo()} aria-label="Redo">
              <Redo2 size={15} />
            </Button>
          </Tooltip>
        </div>

        <div className="hidden md:block w-px h-[22px] bg-[var(--border)]" aria-hidden />

        <div className="hidden md:flex items-center gap-1.5">
          <Tooltip content={isPublic ? 'Make private' : 'Share public link'} side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleShare}
              disabled={shareLoading}
              aria-label="Toggle share"
            >
              {shareLoading
                ? <Loader2 size={15} className="animate-spin" />
                : isPublic
                ? <Globe size={15} className="text-[var(--accent)]" />
                : <Lock size={15} />}
            </Button>
          </Tooltip>
          {shareUrl && (
            <Tooltip content="Copy share link" side="bottom">
              <Button variant="ghost" size="icon" onClick={() => copy(shareUrl)} aria-label="Copy link">
                <Copy size={15} />
              </Button>
            </Tooltip>
          )}
          <Tooltip content="Duplicate resume" side="bottom">
            <Button variant="ghost" size="icon" onClick={handleDuplicate} aria-label="Duplicate">
              <Copy size={15} />
            </Button>
          </Tooltip>
          <Tooltip content="Copy as plain text" side="bottom">
            <Button variant="ghost" size="icon" onClick={handleCopyText} aria-label="Copy plain text">
              <ClipboardCopy size={15} />
            </Button>
          </Tooltip>
          <Tooltip content="Reset" side="bottom">
            <Button variant="ghost" size="icon" onClick={requestReset} aria-label="Reset">
              <RotateCcw size={15} />
            </Button>
          </Tooltip>
          <Tooltip content="Print" side="bottom">
            <Button variant="ghost" size="icon" onClick={printDocument} aria-label="Print">
              <Printer size={15} />
            </Button>
          </Tooltip>
          <Tooltip content={theme === 'dark' ? 'Light mode' : 'Dark mode'} side="bottom">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </Button>
          </Tooltip>
          <ExportMenu activeView={activeView} />
        </div>

        {/* Mobile: export + menu */}
        <div className="md:hidden flex items-center gap-1.5">
          <Button variant="primary" size="sm" onClick={handleExport}>
            <Download size={13} /> <span className="hidden xs:inline">Export</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Menu">
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
          <div className="md:hidden fixed top-[58px] right-0 z-40 w-[220px] bg-[var(--surface)] border-l border-b border-[var(--border)] rounded-bl-[var(--radius)] shadow-[var(--shadow-lg)] flex flex-col py-2">
            <MobileItem icon={<Undo2 size={15} />} label="Undo" disabled={!canUndo()} onClick={() => { undo(); setMobileMenuOpen(false) }} />
            <MobileItem icon={<Redo2 size={15} />} label="Redo" disabled={!canRedo()} onClick={() => { redo(); setMobileMenuOpen(false) }} />
            <div className="h-px bg-[var(--border)] my-1 mx-3" />
            <MobileItem icon={<Printer size={15} />} label="Print" onClick={() => { printDocument(); setMobileMenuOpen(false) }} />
            <MobileItem icon={isCopied ? <CheckCircle2 size={15} /> : <ClipboardCopy size={15} />} label={isCopied ? 'Copied!' : 'Copy plain text'} onClick={handleCopyText} />
            <MobileItem icon={<Copy size={15} />} label="Duplicate" onClick={handleDuplicate} />
            <MobileItem
              icon={shareLoading ? <Loader2 size={15} className="animate-spin" /> : isPublic ? <Globe size={15} /> : <Lock size={15} />}
              label={isPublic ? 'Make private' : 'Share public link'}
              onClick={() => { handleToggleShare(); setMobileMenuOpen(false) }}
            />
            <div className="h-px bg-[var(--border)] my-1 mx-3" />
            <MobileItem icon={<RotateCcw size={15} />} label="Reset" onClick={() => { requestReset(); setMobileMenuOpen(false) }} />
            <MobileItem
              icon={theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              onClick={() => { toggleTheme(); setMobileMenuOpen(false) }}
            />
          </div>
        </>
      )}

      <ConfirmDialog
        open={isPendingReset}
        title="Reset resume?"
        description="All changes will be lost. This cannot be undone."
        confirmLabel="Yes, reset"
        cancelLabel="Keep editing"
        variant="danger"
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function ViewTab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'px-2.5 sm:px-[13px] py-[5px] rounded-[5px] text-[0.78rem] sm:text-[0.8rem]',
        'font-medium cursor-pointer border-none transition-all duration-200 font-sans',
        active ? 'bg-[var(--accent)] text-white' : 'bg-transparent text-[var(--text2)] hover:bg-[var(--surface)] hover:text-[var(--text)]',
      )}
    >
      {children}
    </button>
  )
}

function CloudStatus({ status, lastSavedAt }: { status: SyncStatus; lastSavedAt: Date | null }) {
  const map: Record<SyncStatus, { icon: React.ReactNode; label: string; color: string }> = {
    idle: { icon: <Cloud size={12} />, label: 'Cloud sync on', color: 'text-[var(--text3)]' },
    saving: { icon: <Loader2 size={12} className="animate-spin" />, label: 'Saving…', color: 'text-[var(--accent)]' },
    saved: {
      icon: <CheckCircle2 size={12} />,
      label: lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Saved',
      color: 'text-[#27ae60]',
    },
    error: { icon: <CloudOff size={12} />, label: 'Save failed', color: 'text-[var(--danger)]' },
  }
  const { icon, label, color } = map[status]
  return (
    <span className={cn('flex items-center gap-1 text-[0.72rem] font-medium', color)} aria-live="polite">
      {icon} {label}
    </span>
  )
}

function MobileItem({ icon, label, onClick, disabled = false }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 text-[0.85rem] w-full text-left font-sans',
        disabled ? 'text-[var(--text3)] cursor-not-allowed' : 'text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]',
      )}
    >
      <span className="text-[var(--text3)]">{icon}</span>
      {label}
    </button>
  )
}
