'use client'

import dynamic from 'next/dynamic'

// Dynamically import the heavy builder client-side to keep SSR bundle lean
const ResumeBuilder = dynamic(() => import('@/components/layout/ResumeBuilder'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
      <div className="text-center">
        <div
          className="mx-auto mb-4 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--accent)]"
          style={{ width: '48px', height: '48px' }}
        />
        <p className="font-serif text-lg font-semibold text-[var(--text)]">Resumify</p>
        <p className="text-sm text-[var(--text3)]">Loading builder…</p>
      </div>
    </div>
  ),
})

export default function Page() {
  return <ResumeBuilder />
}

