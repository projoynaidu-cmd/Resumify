'use client'

import { Wand2, Eraser, Sparkles, Loader2, Download } from 'lucide-react'
import { useResumeStore, useUIStore } from '@/store'
import { generateCoverLetterBody } from '@/lib/cover-letter'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useResumeExport } from '@/hooks/useResumeExport'
import { useAiGenerate } from '@/hooks/useAiGenerate'
import { cn } from '@/utils'

export function CoverLetterEditor() {
  const coverLetter = useResumeStore((s) => s.coverLetter)
  const updateCoverLetter = useResumeStore((s) => s.updateCoverLetter)
  const addToast = useUIStore((s) => s.addToast)
  const { exportPdf } = useResumeExport()
  const { generateCoverLetterAi, isGenerating, activeFeature } = useAiGenerate()

  const isAiGenerating = isGenerating && activeFeature === 'cover-letter'

  function handleTemplateDraft() {
    const state = useResumeStore.getState()
    const body = generateCoverLetterBody(state)
    updateCoverLetter({ body })
    addToast('info', 'Template draft inserted — try AI Draft for a personalized version')
  }

  function handleClear() {
    updateCoverLetter({ body: '' })
  }

  return (
    <div className="p-3.5 flex flex-col gap-3">
      {/* Header */}
      <div>
        <h2 className="font-serif font-semibold text-[0.95rem]">Cover Letter</h2>
        <p className="text-[0.75rem] text-[var(--text3)] mt-0.5">
          Customise below · exports as a separate PDF
        </p>
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-2 gap-2.5">
        <Input
          label="Hiring Manager"
          value={coverLetter.to}
          onChange={(e) => updateCoverLetter({ to: e.target.value })}
          placeholder="Mr. John Smith"
        />
        <Input
          label="Company"
          value={coverLetter.company}
          onChange={(e) => updateCoverLetter({ company: e.target.value })}
          placeholder="Acme Corp"
        />
        <Input
          label="Position"
          value={coverLetter.position}
          onChange={(e) => updateCoverLetter({ position: e.target.value })}
          placeholder="Frontend Engineer"
        />
        <Input
          label="Date"
          value={coverLetter.date}
          onChange={(e) => updateCoverLetter({ date: e.target.value })}
          placeholder="May 17, 2026"
        />
      </div>

      {/* Toolbar */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => generateCoverLetterAi()}
          disabled={isGenerating}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-[5px] text-[0.78rem] font-medium',
            'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
            'transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isAiGenerating
            ? <Loader2 size={12} className="animate-spin" aria-hidden />
            : <Sparkles size={12} aria-hidden />}
          {isAiGenerating ? 'Writing…' : 'AI Draft'}
        </button>
        <Button variant="secondary" size="sm" onClick={handleTemplateDraft}>
          <Wand2 size={12} aria-hidden /> Quick Template
        </Button>
        <Button variant="secondary" size="sm" onClick={handleClear}>
          <Eraser size={12} aria-hidden /> Clear
        </Button>
      </div>

      {/* Body */}
      <Textarea
        label="Letter Body"
        value={coverLetter.body}
        onChange={(e) => updateCoverLetter({ body: e.target.value })}
        rows={14}
        className="min-h-[340px] text-[0.875rem] leading-[1.75]"
        placeholder={`Dear Mr. Smith,\n\nI am writing to express my interest in the [Position] role at [Company]...`}
      />

      {/* Export */}
      <Button variant="primary" fullWidth onClick={() => exportPdf('coverletter')}>
        <Download size={14} aria-hidden />
        Export Cover Letter PDF
      </Button>
    </div>
  )
}
