'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/utils'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Accessible confirmation dialog using Framer Motion.
 * Traps focus when open and restores it on close.
 *
 * Usage:
 * ```tsx
 * <ConfirmDialog
 *   open={isPendingDelete}
 *   title="Delete experience?"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete"
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={() => setIsPendingDelete(false)}
 * />
 * ```
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Focus cancel button when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => cancelRef.current?.focus(), 50)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  const iconBg = variant === 'danger' ? 'bg-[#feeeed]' : 'bg-[#fef3e2]'
  const iconColor = variant === 'danger' ? 'text-[var(--danger)]' : 'text-[#e67e22]'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9000] bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            role="alertdialog"
            aria-modal
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'fixed left-1/2 top-1/2 z-[9001] -translate-x-1/2 -translate-y-1/2',
              'w-full max-w-[360px] bg-[var(--surface)] rounded-[var(--radius)]',
              'shadow-[var(--shadow-lg)] p-6',
            )}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close dialog"
              className="absolute top-3.5 right-3.5 text-[var(--text3)] hover:text-[var(--text)] transition-colors"
            >
              <X size={15} />
            </button>

            {/* Icon */}
            <div
              className={cn(
                'w-11 h-11 rounded-[10px] grid place-items-center mb-4',
                iconBg,
                iconColor,
              )}
            >
              <AlertTriangle size={20} aria-hidden />
            </div>

            {/* Content */}
            <h2
              id="confirm-title"
              className="font-semibold text-[var(--text)] text-[0.95rem] mb-1.5"
            >
              {title}
            </h2>
            <p id="confirm-desc" className="text-[0.82rem] text-[var(--text2)] leading-relaxed mb-5">
              {description}
            </p>

            {/* Actions */}
            <div className="flex gap-2.5 justify-end">
              <Button ref={cancelRef} variant="secondary" size="sm" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant="danger" size="sm" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
