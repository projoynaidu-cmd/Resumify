'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X, type LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { useUIStore } from '@/store'
import { cn } from '@/utils'
import type { ToastType } from '@/types'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

const ICON_MAP: Record<ToastType, LucideIcon> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const STYLE_MAP: Record<ToastType, { icon: string; bg: string }> = {
  success: { icon: 'bg-[#e8f5ed] text-[#2d7d46]', bg: '' },
  error: { icon: 'bg-[#feeeed] text-[var(--danger)]', bg: '' },
  info: { icon: 'bg-[#e8f0fe] text-[#2563eb]', bg: '' },
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = ICON_MAP[toast.type]
          const styles = STYLE_MAP[toast.type]

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'pointer-events-auto',
                'bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)]',
                'px-4 py-2.5 flex items-center gap-2.5',
                'shadow-[var(--shadow-lg)] text-[0.85rem] min-w-[260px]',
                'text-[var(--text)]',
              )}
            >
              <span
                className={cn(
                  'w-7 h-7 rounded-[7px] grid place-items-center flex-shrink-0 text-[0.8rem]',
                  styles.icon,
                )}
              >
                <Icon size={14} />
              </span>
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[var(--text3)] hover:text-[var(--text)] transition-colors ml-1"
              >
                <X size={13} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
