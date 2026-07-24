import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function PlanBanner({ resumeCount }: { resumeCount: number }) {
  if (resumeCount < 2) return null

  return (
    <div className="mb-6 flex items-center gap-4 bg-gradient-to-r from-[var(--accent)] to-[#4a8c5e] text-white rounded-[var(--radius)] px-5 py-4">
      <Sparkles size={22} className="flex-shrink-0" aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[0.9rem]">
          {resumeCount >= 3
            ? 'You\'ve reached the free plan limit (3 resumes)'
            : `${3 - resumeCount} resume slot${3 - resumeCount !== 1 ? 's' : ''} remaining on free plan`}
        </p>
        <p className="text-[0.78rem] opacity-85 mt-0.5">
          Upgrade to Pro for unlimited resumes, all templates, and AI features.
        </p>
      </div>
      <Link
        href="/billing"
        className="flex-shrink-0 bg-white text-[var(--accent)] px-4 py-2 rounded-[var(--radius-sm)] text-[0.82rem] font-semibold hover:bg-opacity-90 transition-opacity no-underline"
      >
        Upgrade →
      </Link>
    </div>
  )
}
