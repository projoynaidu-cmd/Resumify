'use client'

import { useState } from 'react'
import { Plus, Briefcase, Sparkles, Loader2 } from 'lucide-react'
import { useResumeStore } from '@/store'
import { FormField, FormRow, TextInput, Textarea } from '@/components/shared/FormField'
import { RepeaterItem, AddButton } from '@/components/shared/RepeaterItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAiGenerate } from '@/hooks/useAiGenerate'
import { cn } from '@/utils'

export function ExperienceSection() {
  const experience = useResumeStore((s) => s.experience)
  const addExperience = useResumeStore((s) => s.addExperience)
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const removeExperience = useResumeStore((s) => s.removeExperience)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const { improveBullets, isGenerating, activeFeature } = useAiGenerate()

  return (
    <div>
      {experience.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience added"
          description="Add your first work experience to get started."
          className="mb-2.5"
        />
      ) : (
        <div>
          {experience.map((exp, i) => {
            const isThisGenerating = isGenerating && activeFeature === `bullet-${exp.id}`
            const canImprove = !!exp.title && !!exp.company

            return (
              <RepeaterItem
                key={exp.id}
                index={i}
                title={exp.title || 'Experience'}
                onDelete={() => setPendingDeleteId(exp.id)}
              >
                <FormRow>
                  <FormField label="Job Title">
                    <TextInput
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                      placeholder="Senior Engineer"
                    />
                  </FormField>
                  <FormField label="Company">
                    <TextInput
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Acme Corp"
                    />
                  </FormField>
                </FormRow>
                <FormRow cols={1}>
                  <FormField label="Date Range">
                    <TextInput
                      value={exp.date}
                      onChange={(e) => updateExperience(exp.id, { date: e.target.value })}
                      placeholder="Jan 2022 – Present"
                    />
                  </FormField>
                </FormRow>
                <FormRow cols={1}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em]">
                      Description
                    </label>
                    <button
                      type="button"
                      onClick={() => improveBullets(exp)}
                      disabled={isGenerating || !canImprove}
                      title={!canImprove ? 'Add job title and company first' : 'Rewrite as achievement bullets'}
                      className={cn(
                        'flex items-center gap-1 text-[0.72rem] font-medium px-2 py-1 rounded-[5px]',
                        'text-[var(--accent)] bg-[var(--accent-bg)] hover:bg-[var(--accent)] hover:text-white',
                        'transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                      )}
                    >
                      {isThisGenerating
                        ? <Loader2 size={11} className="animate-spin" aria-hidden />
                        : <Sparkles size={11} aria-hidden />}
                      {isThisGenerating ? 'Improving…' : 'AI Improve'}
                    </button>
                  </div>
                  <Textarea
                    rows={3}
                    value={exp.desc}
                    onChange={(e) => updateExperience(exp.id, { desc: e.target.value })}
                    placeholder="Describe your responsibilities and achievements…"
                  />
                </FormRow>
              </RepeaterItem>
            )
          })}
        </div>
      )}

      <AddButton onClick={addExperience}>
        <Plus size={14} aria-hidden /> Add Experience
      </AddButton>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete experience?"
        description="This entry will be permanently removed. You can undo with Ctrl+Z."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (pendingDeleteId) removeExperience(pendingDeleteId)
          setPendingDeleteId(null)
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
