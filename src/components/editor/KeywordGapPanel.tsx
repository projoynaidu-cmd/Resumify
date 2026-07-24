'use client'

import { useState } from 'react'
import { ChevronDown, Sparkles, Loader2, Plus } from 'lucide-react'
import { useResumeStore } from '@/store'
import { useAiGenerate } from '@/hooks/useAiGenerate'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

/**
 * Lets the user paste a job description and get back a list of
 * important keywords missing from their resume's skills/experience.
 * Each missing keyword can be added directly to the Skills list
 * with one click.
 */
export function KeywordGapPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [missingKeywords, setMissingKeywords] = useState<string[] | null>(null)
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set())

  const { analyzeKeywordGap, isGenerating, activeFeature } = useAiGenerate()
  const addSkill = useResumeStore((s) => s.addSkill)

  const isThisGenerating = isGenerating && activeFeature === 'ats-keywords'
  const canAnalyze = jobDescription.trim().length >= 50

  async function handleAnalyze() {
    const result = await analyzeKeywordGap(jobDescription)
    setMissingKeywords(result)
  }

  function handleAddKeyword(keyword: string) {
    addSkill(keyword)
    setAddedKeywords((prev) => new Set([...prev, keyword]))
  }

  return (
    <div className="mx-3 mb-3 border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
      {/* Header */}
      <button
        type="button"
        className={cn(
          'w-full flex items-center justify-between px-3.5 py-2.5',
          'bg-[var(--surface)] hover:bg-[var(--surface2)]',
          'transition-colors duration-200 cursor-pointer',
        )}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="keyword-gap-body"
      >
        <span className="text-[0.85rem] font-semibold flex items-center gap-2">
          <Sparkles size={13} className="text-[var(--accent)]" aria-hidden />
          Job Match Keywords
        </span>
        <ChevronDown
          size={14}
          className={cn('text-[var(--text3)] transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      {/* Body */}
      {isOpen && (
        <div id="keyword-gap-body" className="p-3.5 border-t border-[var(--border)] bg-[var(--surface2)]">
          <p className="text-[0.76rem] text-[var(--text3)] mb-2.5 leading-relaxed">
            Paste a job description — AI will find important keywords missing from your resume.
          </p>

          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the full job description here…"
            className="mb-2.5 text-[0.8rem]"
          />

          <Button
            variant="primary"
            fullWidth
            size="sm"
            onClick={handleAnalyze}
            disabled={!canAnalyze || isGenerating}
          >
            {isThisGenerating
              ? <Loader2 size={13} className="animate-spin" aria-hidden />
              : <Sparkles size={13} aria-hidden />}
            {isThisGenerating ? 'Analyzing…' : 'Find Missing Keywords'}
          </Button>

          {!canAnalyze && jobDescription.length > 0 && (
            <p className="text-[0.7rem] text-[var(--text3)] mt-1.5">
              Paste at least 50 characters for accurate results.
            </p>
          )}

          {/* Results */}
          {missingKeywords !== null && (
            <div className="mt-3.5" aria-live="polite">
              {missingKeywords.length === 0 ? (
                <p className="text-[0.78rem] text-[#27ae60] font-medium flex items-center gap-1.5">
                  ✓ Your resume already covers this job&apos;s key terms well.
                </p>
              ) : (
                <>
                  <p className="text-[0.72rem] font-semibold text-[var(--text2)] uppercase tracking-wide mb-2">
                    Missing keywords ({missingKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {missingKeywords.map((keyword) => {
                      const isAdded = addedKeywords.has(keyword)
                      return (
                        <button
                          key={keyword}
                          type="button"
                          onClick={() => !isAdded && handleAddKeyword(keyword)}
                          disabled={isAdded}
                          className={cn(
                            'flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.74rem] font-medium',
                            'transition-colors duration-200',
                            isAdded
                              ? 'bg-[#e8f5ed] text-[#27ae60] cursor-default'
                              : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer',
                          )}
                        >
                          {isAdded ? '✓' : <Plus size={10} aria-hidden />}
                          {keyword}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-[0.7rem] text-[var(--text3)] mt-2">
                    Click a keyword to add it to your Skills section.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
