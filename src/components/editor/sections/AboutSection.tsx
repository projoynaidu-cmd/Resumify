'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { useResumeStore } from '@/store'
import { FormField, Textarea } from '@/components/shared/FormField'
import { useAiGenerate } from '@/hooks/useAiGenerate'
import { cn } from '@/utils'

export function AboutSection() {
  const about = useResumeStore((s) => s.about)
  const updateAbout = useResumeStore((s) => s.updateAbout)
  const { generateSummary, isGenerating, activeFeature } = useAiGenerate()

  const isThisGenerating = isGenerating && activeFeature === 'summary'

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em]">
          Professional Summary
        </label>
        <button
          type="button"
          onClick={() => generateSummary()}
          disabled={isGenerating}
          className={cn(
            'flex items-center gap-1 text-[0.72rem] font-medium px-2 py-1 rounded-[5px]',
            'text-[var(--accent)] bg-[var(--accent-bg)] hover:bg-[var(--accent)] hover:text-white',
            'transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isThisGenerating
            ? <Loader2 size={11} className="animate-spin" aria-hidden />
            : <Sparkles size={11} aria-hidden />}
          {isThisGenerating ? 'Writing…' : 'AI Write'}
        </button>
      </div>
      <Textarea
        value={about}
        onChange={(e) => updateAbout(e.target.value)}
        rows={4}
        placeholder="Describe your professional background, key skills, and career goals..."
      />
    </div>
  )
}
