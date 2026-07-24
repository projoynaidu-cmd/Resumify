'use client'

import { useState, useEffect } from 'react'
import { generateQrDataUrl } from '@/lib/qrcode'
import { cn } from '@/utils'

interface QrCodeProps {
  url: string
  size?: number
  className?: string
  label?: string
}

/**
 * Renders a QR code for the given URL.
 * Lazy-generates the PNG data URL client-side.
 */
export function QrCode({ url, size = 160, className, label }: QrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    generateQrDataUrl(url, size)
      .then((du) => { if (!cancelled) setDataUrl(du) })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [url, size])

  if (error) return null

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt={`QR code for ${label ?? url}`}
          width={size}
          height={size}
          className="rounded-[8px] border border-[var(--border)] bg-white p-2"
        />
      ) : (
        <div
          className="animate-pulse bg-[var(--border)] rounded-[8px]"
          style={{ width: size, height: size }}
          aria-label="Loading QR code"
        />
      )}
      {label && (
        <span className="text-[0.7rem] text-[var(--text3)] text-center max-w-[160px] break-all">
          {label}
        </span>
      )}
    </div>
  )
}
