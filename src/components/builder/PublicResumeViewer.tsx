'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, FileText, ExternalLink, Share2, QrCode as QrIcon, X } from 'lucide-react'
import { useResumeStore } from '@/store'
import { ResumePreview } from '@/components/preview/ResumePreview'
import { Button } from '@/components/ui/Button'
import { QrCode } from '@/components/shared/QrCode'
import { usePdfExport } from '@/hooks/usePdfExport'
import type { ResumeState } from '@/types'

interface PublicResumeViewerProps {
  resumeId: string
  resumeData: ResumeState
  ownerName: string
  slug: string
  viewCount: number
}

const PREVIEW_WIDTH = 794

export function PublicResumeViewer({
  resumeId,
  resumeData,
  ownerName,
  slug,
  viewCount,
}: PublicResumeViewerProps) {
  const { exportResume } = usePdfExport()
  const [scale, setScale] = useState(1)
  const [showQr, setShowQr] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/r/${slug}`
    : `https://Resumify.app/r/${slug}`

  // Seed store with public resume data
  useEffect(() => {
    useResumeStore.setState({
      personal: resumeData.personal,
      about: resumeData.about,
      skills: resumeData.skills,
      experience: resumeData.experience,
      education: resumeData.education,
      projects: resumeData.projects,
      customSections: resumeData.customSections,
      coverLetter: resumeData.coverLetter,
      template: resumeData.template,
      accentColor: resumeData.accentColor,
      resumeFont: resumeData.resumeFont,
      headingFont: resumeData.headingFont ?? null,
      fontPairingId: resumeData.fontPairingId ?? null,
      customPalette: resumeData.customPalette ?? null,
      photoDataUrl: resumeData.photoDataUrl,
      sectionOrder: resumeData.sectionOrder,
    })
  }, [resumeData])

  // Fire view-count increment once on mount
  useEffect(() => {
    fetch(`/api/resumes/${resumeId}/view`, { method: 'POST' }).catch(() => {})
  }, [resumeId])

  // Scale preview to viewport
  useEffect(() => {
    function handleResize() {
      const available = Math.min(window.innerWidth - 48, PREVIEW_WIDTH)
      setScale(available / PREVIEW_WIDTH)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--surface)] border-b border-[var(--border)] px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--accent)] no-underline flex-shrink-0"
          >
            <span className="bg-[var(--accent)] text-white w-7 h-7 rounded-[6px] grid place-items-center">
              <FileText size={13} />
            </span>
            <span className="hidden sm:inline font-serif font-bold">Resumify</span>
          </Link>

          {/* Title + view count */}
          <div className="text-center min-w-0">
            <p className="text-sm font-semibold text-[var(--text)] truncate">
              {ownerName}&apos;s Resume
            </p>
            <p className="text-[0.7rem] text-[var(--text3)]">
              {viewCount + 1} view{viewCount + 1 !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* QR toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQr((v) => !v)}
              aria-label="Show QR code"
              aria-pressed={showQr}
            >
              <QrIcon size={15} />
            </Button>

            {/* Copy link */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </Button>

            {/* Download PDF */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                exportResume(
                  'resume-content',
                  `${ownerName.replace(/\s+/g, '-').toLowerCase()}-resume`,
                )
              }
            >
              <Download size={13} />
              <span className="hidden sm:inline">PDF</span>
            </Button>

            {/* CTA */}
            <Link href="/auth/register">
              <Button variant="primary" size="sm">
                <ExternalLink size={13} />
                <span className="hidden xs:inline">Build yours</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* QR Code panel */}
      {showQr && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-[var(--radius)] p-6 text-center shadow-[var(--shadow-lg)] relative max-w-xs w-full">
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className="absolute top-3 right-3 text-[var(--text3)] hover:text-[var(--text)]"
              aria-label="Close QR code"
            >
              <X size={15} />
            </button>
            <p className="font-semibold text-[var(--text)] mb-4">Scan to view this resume</p>
            <QrCode
              url={shareUrl}
              size={200}
              label={shareUrl}
              className="mx-auto"
            />
            <p className="text-[0.72rem] text-[var(--text3)] mt-4 leading-relaxed">
              Share this QR code so recruiters can instantly view the resume on any device.
            </p>
          </div>
        </div>
      )}

      {/* Resume preview */}
      <main className="flex justify-center px-4 sm:px-6 py-8">
        <div
          id="resume-wrapper"
          className="w-[794px] bg-white shadow-[var(--shadow-lg)] rounded-[4px] overflow-hidden"
          style={{
            transformOrigin: 'top center',
            transform: `scale(${scale})`,
            marginBottom: `${794 * 1.414 * scale - 794 * 1.414}px`,
          }}
        >
          <ResumePreview />
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="text-center pb-12 px-4">
        <p className="text-sm text-[var(--text3)] mb-3">
          Built with{' '}
          <Link href="/" className="text-[var(--accent)] font-medium hover:underline">
            Resumify
          </Link>{' '}
          — free AI resume builder
        </p>
        <Link href="/auth/register">
          <Button variant="primary" size="md">
            Create your free resume →
          </Button>
        </Link>
      </footer>
    </div>
  )
}

