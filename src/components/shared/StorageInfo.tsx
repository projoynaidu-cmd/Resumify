'use client'

import { useState, useEffect } from 'react'
import { Database } from 'lucide-react'
import { storageGetUsageBytes, storageClearAll } from '@/lib/storage'
import { useUIStore } from '@/store'
import { cn } from '@/utils'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

/**
 * Small footer badge showing localStorage usage for the ResumeForge namespace.
 * Refreshes every 10 seconds.
 */
export function StorageInfo() {
  const [usageBytes, setUsageBytes] = useState(0)
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    function refresh() {
      setUsageBytes(storageGetUsageBytes())
    }
    refresh()
    const interval = setInterval(refresh, 10_000)
    return () => clearInterval(interval)
  }, [])

  // Warn if approaching 5 MB localStorage limit
  const isNearLimit = usageBytes > 4 * 1024 * 1024

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-5 py-2 text-[0.7rem]',
        isNearLimit ? 'text-[var(--danger)]' : 'text-[var(--text3)]',
      )}
      title="LocalStorage used by ResumeForge"
    >
      <Database size={11} aria-hidden />
      <span>{formatBytes(usageBytes)} stored</span>
      {isNearLimit && (
        <button
          type="button"
          onClick={() => {
            storageClearAll()
            setUsageBytes(0)
            addToast('info', 'Storage cleared')
          }}
          className="underline ml-1 hover:no-underline"
        >
          Clear
        </button>
      )}
    </div>
  )
}
