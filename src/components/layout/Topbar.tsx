'use client'

import { useState } from 'react'
import {
  Moon, Sun, Printer, Download, Undo2, Redo2,
  FileText, RotateCcw, ClipboardCopy, Menu, X,
} from 'lucide-react'
import { useUIStore, useResumeStore } from '@/store'
import { useResumeExport } from '@/hooks/useResumeExport'
import { useTheme } from '@/hooks/useTheme'
import { useResetResume } from '@/hooks/useResetResume'
import { useClipboard } from '@/hooks/useClipboard'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { resumeToPlainText } from '@/lib/text-export'
import { cn } from '@/utils'

export function Topbar() {
  const { theme, toggleTheme } = useTheme()
  const { activeView, setActiveView, addToast } = useUIStore()
  const { canUndo, canRedo, undo, redo, historyLabel } = useResumeStore()
  const { exportPdf, printDocument } = useResumeExport()
  const { requestReset, confirmReset, cancelReset, isPendingReset } = useResetResume()
  const { copy, isCopied } = useClipboard()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const resumeState = useResumeStore((s) => s)

  async function handleCopyText() {
    const ok = await copy(resumeToPlainText(resumeState))
    addToast(ok ? 'success' : 'error', ok ? 'Resume copied!' : 'Clipboard unavailable')
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
        {/* ── Logo ── */}
        <a
          href="/"
          className="flex items-center gap-2 flex-shrink-0 text-[var(--accent)] no-underline"
          aria-label="Resumify home"
        >
          <span className="bg-[var(--accent)] text-white w-[30px] h-[30px] rounded-[7px] grid place-items-center flex-shrink-0">
            <FileText size={14} aria-hidden />
          </span>
          {/* Hide wordmark on very small screens */}
          <span className="hidden sm:inline font-serif font-bold text-[1.15rem]">
            Resumify{' '}
            <span className="bg-[var(--accent)] text-white text-[0.6rem] font-bold px-1 py-px rounded align-middle ml-0.5">
              v2
            </span>
          </span>
        </a>

        <div className="hidden sm:block w-px h-[26px] bg-[var(--border)]" aria-hidden />

        {/* ── View tabs ── */}
        <nav
          role="tablist"
          aria-label="Document view"
          className="flex bg-[var(--surface2)] border border-[var(--border)] rounded-[var(--radius-sm)] p-[3px] gap-0.5"
        >
          <ViewTab
            active={activeView === 'resume'}
            onClick={() => setActiveView('resume')}
            aria-selected={activeView === 'resume'}
          >
            Resume
          </ViewTab>
          <ViewTab
            active={activeView === 'coverletter'}
            onClick={() => setActiveView('coverletter')}
            aria-selected={activeView === 'coverletter'}
          >
            {/* Shorten on mobile */}
            <span className="sm:hidden">Cover</span>
            <span className="hidden sm:inline">Cover Letter</span>
          </ViewTab>
        </nav>

        <div className="flex-1" />

        {/* ── Desktop controls ── */}
        <div className="hidden md:flex items-center gap-1" role="group" aria-label="History">
          <Tooltip content="Undo (Ctrl+Z)" side="bottom">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo()} aria-label="Undo">
              <Undo2 size={15} aria-hidden />
            </Button>
          </Tooltip>
          <Tooltip content="Redo (Ctrl+Y)" side="bottom">
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo()} aria-label="Redo">
              <Redo2 size={15} aria-hidden />
            </Button>
          </Tooltip>
          <span className="text-[0.72rem] text-[var(--text3)] font-mono min-w-[52px] text-center select-none">
            {historyLabel()}
          </span>
        </div>

        <div className="hidden md:block w-px h-[26px] bg-[var(--border)]" aria-hidden />

        <div className="hidden md:flex items-center gap-1.5">
          <Tooltip content="Print" side="bottom">
            <Button variant="ghost" size="icon" onClick={printDocument} aria-label="Print">
              <Printer size={15} aria-hidden />
            </Button>
          </Tooltip>
          {activeView === 'resume' && (
            <Tooltip content={isCopied ? 'Copied!' : 'Copy as plain text'} side="bottom">
              <Button variant="ghost" size="icon" onClick={handleCopyText} aria-label="Copy plain text">
                <ClipboardCopy size={15} aria-hidden />
              </Button>
            </Tooltip>
          )}
          <Tooltip content="Reset resume" side="bottom">
            <Button variant="ghost" size="icon" onClick={requestReset} aria-label="Reset">
              <RotateCcw size={15} aria-hidden />
            </Button>
          </Tooltip>
          <Tooltip content={theme === 'dark' ? 'Light mode' : 'Dark mode'} side="bottom">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
            </Button>
          </Tooltip>
          <Button variant="primary" size="md" onClick={handleExport} aria-label="Export PDF">
            <Download size={14} aria-hidden />
            Export PDF
          </Button>
        </div>

        {/* ── Mobile: export + hamburger ── */}
        <div className="md:hidden flex items-center gap-1.5">
          <Button variant="primary" size="sm" onClick={handleExport} aria-label="Export PDF">
            <Download size={13} aria-hidden />
            <span className="hidden xs:inline">Export</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </Button>
        </div>
      </header>

      {/* ── Mobile dropdown menu ── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          {/* Menu panel */}
          <div
            className={cn(
              'md:hidden fixed top-[58px] right-0 z-40 w-[240px]',
              'bg-[var(--surface)] border-l border-b border-[var(--border)]',
              'rounded-bl-[var(--radius)] shadow-[var(--shadow-lg)]',
              'flex flex-col py-2',
            )}
            role="menu"
          >
            <MobileMenuItem icon={<Undo2 size={15} />} label="Undo" disabled={!canUndo()} onClick={() => { undo(); setMobileMenuOpen(false) }} />
            <MobileMenuItem icon={<Redo2 size={15} />} label="Redo" disabled={!canRedo()} onClick={() => { redo(); setMobileMenuOpen(false) }} />
            <div className="h-px bg-[var(--border)] my-1.5 mx-3" />
            <MobileMenuItem icon={<Printer size={15} />} label="Print" onClick={() => { printDocument(); setMobileMenuOpen(false) }} />
            <MobileMenuItem icon={<ClipboardCopy size={15} />} label={isCopied ? 'Copied!' : 'Copy plain text'} onClick={handleCopyText} />
            <MobileMenuItem icon={<RotateCcw size={15} />} label="Reset resume" onClick={() => { requestReset(); setMobileMenuOpen(false) }} />
            <div className="h-px bg-[var(--border)] my-1.5 mx-3" />
            <MobileMenuItem
              icon={theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              onClick={() => { toggleTheme(); setMobileMenuOpen(false) }}
            />
          </div>
        </>
      )}

      {/* Reset confirmation */}
      <ConfirmDialog
        open={isPendingReset}
        title="Reset resume?"
        description="All your resume data will be cleared. This cannot be undone."
        confirmLabel="Yes, reset"
        cancelLabel="Keep editing"
        variant="danger"
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────

interface ViewTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
}
function ViewTab({ active, children, ...props }: ViewTabProps) {
  return (
    <button
      role="tab"
      {...props}
      className={cn(
        'px-2.5 sm:px-[13px] py-[5px] rounded-[5px] text-[0.78rem] sm:text-[0.8rem]',
        'font-medium cursor-pointer border-none transition-all duration-200 font-sans',
        active
          ? 'bg-[var(--accent)] text-white'
          : 'bg-transparent text-[var(--text2)] hover:bg-[var(--surface)] hover:text-[var(--text)]',
      )}
    >
      {children}
    </button>
  )
}

function MobileMenuItem({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode
  label: string
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
        'flex items-center gap-3 px-4 py-2.5 text-[0.85rem] font-sans w-full text-left',
        'transition-colors duration-150',
        disabled
          ? 'text-[var(--text3)] cursor-not-allowed'
          : 'text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]',
      )}
    >
      <span className="text-[var(--text3)]">{icon}</span>
      {label}
    </button>
  )
}

