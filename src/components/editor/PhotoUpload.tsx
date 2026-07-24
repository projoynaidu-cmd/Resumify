'use client'

import { useRef } from 'react'
import { User, X, Camera } from 'lucide-react'
import { useResumeStore, useUIStore } from '@/store'
import { compressProfileImage, ImageTooLargeError } from '@/lib/compress-image'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

export function PhotoUpload() {
  const photoDataUrl = useResumeStore((s) => s.photoDataUrl)
  const setPhotoDataUrl = useResumeStore((s) => s.setPhotoDataUrl)
  const addToast = useUIStore((s) => s.addToast)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    try {
      const dataUrl = await compressProfileImage(file)
      setPhotoDataUrl(dataUrl)
      addToast('success', 'Photo uploaded!')
    } catch (err) {
      const message =
        err instanceof ImageTooLargeError
          ? err.message
          : 'Failed to process image'
      addToast('error', message)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  function handleRemove() {
    setPhotoDataUrl(null)
    addToast('info', 'Photo removed')
  }

  return (
    <div className="flex items-center gap-3.5 mb-1">
      {/* Avatar circle — click to upload */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={photoDataUrl ? 'Change profile photo' : 'Upload profile photo'}
        className={cn(
          'relative group w-[70px] h-[70px] rounded-full flex-shrink-0',
          'border-2 border-dashed border-[var(--border)]',
          'overflow-hidden bg-[var(--surface2)] cursor-pointer',
          'hover:border-[var(--accent)] transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
        )}
      >
        {photoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoDataUrl}
            alt="Profile photo preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={28} className="text-[var(--text3)] absolute inset-0 m-auto" aria-hidden />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={16} className="text-white" aria-hidden />
        </div>
      </button>

      {/* Info + controls */}
      <div className="flex-1">
        <p className="text-[0.78rem] text-[var(--text2)] leading-relaxed">
          {photoDataUrl ? (
            <>
              Photo uploaded.{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-[var(--accent)] font-medium hover:underline cursor-pointer"
              >
                Change
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-[var(--accent)] font-medium hover:underline cursor-pointer"
              >
                Upload photo
              </button>{' '}
              <span className="text-[var(--text3)]">(optional, max 3 MB)</span>
            </>
          )}
        </p>

        {photoDataUrl && (
          <Button
            variant="ghost"
            size="xs"
            onClick={handleRemove}
            className="mt-1 text-[var(--danger)] hover:bg-[#fef0ee]"
            aria-label="Remove profile photo"
          >
            <X size={11} aria-hidden /> Remove
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden
        onChange={handleChange}
      />
    </div>
  )
}
