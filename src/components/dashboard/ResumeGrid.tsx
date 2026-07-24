'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, FileText, Pencil, Trash2, Globe,
  Lock, Loader2, Copy, Link2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Tooltip } from '@/components/ui/Tooltip'
import { useResumeLimit } from '@/hooks/useResumeLimit'
import { cn } from '@/utils'

interface ResumeItem {
  id: string
  title: string
  slug: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

interface ResumeGridProps {
  resumes: ResumeItem[]
  isPro: boolean
}

export function ResumeGrid({ resumes, isPro }: ResumeGridProps) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [publicStates, setPublicStates] = useState<Record<string, boolean>>(
    Object.fromEntries(resumes.map((r) => [r.id, r.isPublic])),
  )

  async function handleCreate() {
    setCreating(true)
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Resume' }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error); return }
      router.push(`/builder/${data.resume.id}`)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    setLoadingId(id)
    try {
      await fetch(`/api/resumes/${id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setLoadingId(null)
      setConfirmDeleteId(null)
    }
  }

  async function handleDuplicate(id: string) {
    setLoadingId(id + '-dup')
    try {
      const res = await fetch(`/api/resumes/${id}/duplicate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error); return }
      router.refresh()
    } finally {
      setLoadingId(null)
    }
  }

  async function handleToggleShare(id: string) {
    setLoadingId(id + '-share')
    try {
      const res = await fetch(`/api/resumes/${id}/visibility`, { method: 'PATCH' })
      const data = await res.json()
      if (!res.ok) return
      setPublicStates((prev) => ({ ...prev, [id]: data.isPublic }))
      if (data.isPublic && data.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl).catch(() => {})
        alert(`Share link copied!\n${data.shareUrl}`)
      }
    } finally {
      setLoadingId(null)
    }
  }

  const { canCreate, remaining, isAtLimit } = useResumeLimit({ currentCount: resumes.length })

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* New resume card */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={!canCreate || creating}
          className={cn(
            'flex flex-col items-center justify-center gap-2.5 p-8 min-h-[220px]',
            'border-2 border-dashed border-[var(--border)] rounded-[var(--radius)]',
            'text-[var(--text3)] transition-all duration-200',
            canCreate
              ? 'hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] cursor-pointer'
              : 'opacity-40 cursor-not-allowed',
          )}
        >
          {creating
            ? <Loader2 size={26} className="animate-spin" />
            : <Plus size={26} />
          }
          <span className="text-[0.88rem] font-semibold">
            {creating ? 'Creating…' : 'New Resume'}
          </span>
          {!isPro && remaining !== null && (
            <span className={cn('text-[0.72rem]', isAtLimit ? 'text-[var(--danger)]' : 'opacity-70')}>
              {isAtLimit ? 'Limit reached — upgrade to add more' : `${remaining} slot${remaining !== 1 ? 's' : ''} left on free plan`}
            </span>
          )}
        </button>

        {/* Resume cards */}
        {resumes.map((resume) => {
          const isShared = publicStates[resume.id] ?? resume.isPublic
          return (
            <div
              key={resume.id}
              className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden hover:shadow-[var(--shadow-md)] transition-all duration-200"
            >
              {/* Thumbnail */}
              <div
                className="h-36 bg-gradient-to-br from-[var(--accent-bg)] to-[var(--surface2)] flex items-center justify-center cursor-pointer relative"
                onClick={() => router.push(`/builder/${resume.id}`)}
              >
                <FileText size={44} className="text-[var(--accent)] opacity-25" />
                {/* Edit overlay on hover */}
                <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/8 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    Open
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="px-4 py-3 flex-1 flex flex-col">
                <p className="font-semibold text-[0.9rem] text-[var(--text)] truncate mb-0.5">
                  {resume.title}
                </p>
                <p className="text-[0.72rem] text-[var(--text3)] mb-3">
                  Edited {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
                </p>

                {/* Action row */}
                <div className="flex items-center gap-1.5 mt-auto">
                  {/* Edit */}
                  <button
                    onClick={() => router.push(`/builder/${resume.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[5px] text-[0.78rem] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent2)] transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </button>

                  {/* Share */}
                  <Tooltip content={isShared ? 'Make private' : 'Share publicly'} side="top">
                    <button
                      onClick={() => handleToggleShare(resume.id)}
                      disabled={loadingId === resume.id + '-share'}
                      className={cn(
                        'p-1.5 rounded-[5px] border transition-colors',
                        isShared
                          ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-bg)]'
                          : 'border-[var(--border)] text-[var(--text3)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
                      )}
                    >
                      {loadingId === resume.id + '-share'
                        ? <Loader2 size={13} className="animate-spin" />
                        : isShared
                        ? <Globe size={13} />
                        : <Lock size={13} />}
                    </button>
                  </Tooltip>

                  {/* Copy share link */}
                  {isShared && (
                    <Tooltip content="Copy share link" side="top">
                      <button
                        onClick={async () => {
                          const url = `${window.location.origin}/r/${resume.slug}`
                          await navigator.clipboard.writeText(url).catch(() => {})
                        }}
                        className="p-1.5 rounded-[5px] border border-[var(--border)] text-[var(--text3)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                      >
                        <Link2 size={13} />
                      </button>
                    </Tooltip>
                  )}

                  {/* Duplicate */}
                  <Tooltip content="Duplicate" side="top">
                    <button
                      onClick={() => handleDuplicate(resume.id)}
                      disabled={loadingId === resume.id + '-dup'}
                      className="p-1.5 rounded-[5px] border border-[var(--border)] text-[var(--text3)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      {loadingId === resume.id + '-dup'
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Copy size={13} />}
                    </button>
                  </Tooltip>

                  {/* Delete */}
                  <Tooltip content="Delete" side="top">
                    <button
                      onClick={() => setConfirmDeleteId(resume.id)}
                      disabled={loadingId === resume.id}
                      className="p-1.5 rounded-[5px] border border-[var(--border)] text-[var(--text3)] hover:border-[var(--danger)] hover:text-[var(--danger)] hover:bg-[#fef0ee] transition-colors"
                    >
                      {loadingId === resume.id
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Trash2 size={13} />}
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete resume?"
        description="This resume will be permanently deleted from the cloud. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </>
  )
}
