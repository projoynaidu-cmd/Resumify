'use client'

import { useState } from 'react'
import { Plus, GraduationCap } from 'lucide-react'
import { useResumeStore } from '@/store'
import { FormField, FormRow, TextInput } from '@/components/shared/FormField'
import { RepeaterItem, AddButton } from '@/components/shared/RepeaterItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function EducationSection() {
  const education = useResumeStore((s) => s.education)
  const addEducation = useResumeStore((s) => s.addEducation)
  const updateEducation = useResumeStore((s) => s.updateEducation)
  const removeEducation = useResumeStore((s) => s.removeEducation)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  return (
    <div>
      {education.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education added"
          description="Add your degrees and qualifications."
          className="mb-2.5"
        />
      ) : (
        <div>
          {education.map((edu, i) => (
            <RepeaterItem
              key={edu.id}
              index={i}
              title={edu.degree || 'Education'}
              onDelete={() => setPendingDeleteId(edu.id)}
            >
              <FormRow>
                <FormField label="Degree">
                  <TextInput
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="B.S. Computer Science"
                  />
                </FormField>
                <FormField label="School">
                  <TextInput
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                    placeholder="MIT"
                  />
                </FormField>
              </FormRow>
              <FormRow cols={1}>
                <FormField label="Date">
                  <TextInput
                    value={edu.date}
                    onChange={(e) => updateEducation(edu.id, { date: e.target.value })}
                    placeholder="2015 – 2019"
                  />
                </FormField>
              </FormRow>
              <FormRow cols={1}>
                <FormField label="Notes / Achievements">
                  <TextInput
                    value={edu.desc}
                    onChange={(e) => updateEducation(edu.id, { desc: e.target.value })}
                    placeholder="Dean's List, GPA 3.9…"
                  />
                </FormField>
              </FormRow>
            </RepeaterItem>
          ))}
        </div>
      )}

      <AddButton onClick={addEducation}>
        <Plus size={14} aria-hidden /> Add Education
      </AddButton>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete education entry?"
        description="This entry will be permanently removed. You can undo with Ctrl+Z."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (pendingDeleteId) removeEducation(pendingDeleteId)
          setPendingDeleteId(null)
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
