'use client'

import { Cloud, CloudOff, Loader2, CheckCircle2 } from 'lucide-react'
import type { SyncStatus } from '@/hooks/useCloudSync'
import { cn } from '@/utils'

interface CloudSyncBadgeProps {
  status: SyncStatus
  lastSavedAt: Date | null
  /** If false, shows localStorage-only indicator */
  isAuthenticated: boolean
}

/**
 * Small status badge shown in the editor panel.
 * – Authenticated: shows cloud save status (saving / saved / error)
 * – Unauthenticated: shows "Saved locally" with a lock icon
 */
export function CloudSyncBadge({
  status,
  lastSavedAt,
  isAuthenticated,
}: CloudSyncBadgeProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-1.5 px-5 pb-2 text-[0.72rem] text-[var(--text3)]">
        <CloudOff size={11} aria-hidden />
        Saved locally
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-5 pb-2 text-[0.72rem] transition-colors duration-300',
        status === 'saved' && 'text-[#27ae60]',
        status === 'error' && 'text-[var(--danger)]',
        status === 'saving' && 'text-[var(--accent)]',
        status === 'idle' && 'text-[var(--text3)]',
      )}
      aria-live="polite"
      aria-label={`Cloud save: ${status}`}
    >
      {status === 'saving' && (
        <Loader2 size={11} className="animate-spin" aria-hidden />
      )}
      {status === 'saved' && (
        <CheckCircle2 size={11} aria-hidden />
      )}
      {status === 'error' && (
        <CloudOff size={11} aria-hidden />
      )}
      {status === 'idle' && (
        <Cloud size={11} aria-hidden />
      )}

      {status === 'saving' && 'Saving…'}
      {status === 'saved' && lastSavedAt
        ? `Saved at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : status === 'saved'
        ? 'Saved'
        : null}
      {status === 'error' && 'Save failed — check connection'}
      {status === 'idle' && 'Cloud sync on'}
    </div>
  )
}
