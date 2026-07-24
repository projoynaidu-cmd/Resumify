'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '@/store'

export function LoadingOverlay() {
  const { isExporting, exportProgress, exportLabel } = useUIStore()

  return (
    <AnimatePresence>
      {isExporting && (
        <motion.div
          id="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex flex-col items-center justify-center gap-5"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--surface)] rounded-[var(--radius)] px-11 py-8 text-center min-w-[300px] shadow-[var(--shadow-lg)]"
          >
            {/* Spinner */}
            <div className="w-13 h-13 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4"
              style={{ width: '52px', height: '52px' }}
            />

            <div className="font-serif font-semibold text-[1.05rem] mb-1">
              Generating PDF…
            </div>
            <div
              id="loading-sub"
              className="text-[0.78rem] text-[var(--text3)] mb-4 min-h-[1.2em]"
            >
              {exportLabel}
            </div>

            {/* Progress bar */}
            <div className="w-full h-[5px] bg-[var(--border)] rounded-full overflow-hidden mb-2">
              <div
                id="progress-fill"
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{
                  width: `${exportProgress}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                }}
              />
            </div>
            <div
              id="progress-text"
              className="text-[0.72rem] text-[var(--text3)] font-mono"
            >
              {exportProgress}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
