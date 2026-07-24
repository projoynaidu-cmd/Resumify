'use client'

import { useState } from 'react'
import { Plus, Code } from 'lucide-react'
import { useResumeStore } from '@/store'
import { FormField, FormRow, TextInput, Textarea } from '@/components/shared/FormField'
import { RepeaterItem, AddButton } from '@/components/shared/RepeaterItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function ProjectsSection() {
  const projects = useResumeStore((s) => s.projects)
  const addProject = useResumeStore((s) => s.addProject)
  const updateProject = useResumeStore((s) => s.updateProject)
  const removeProject = useResumeStore((s) => s.removeProject)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  return (
    <div>
      {projects.length === 0 ? (
        <EmptyState
          icon={Code}
          title="No projects added"
          description="Showcase your side projects and open-source work."
          className="mb-2.5"
        />
      ) : (
        <div>
          {projects.map((proj, i) => (
            <RepeaterItem
              key={proj.id}
              index={i}
              title={proj.name || 'Project'}
              onDelete={() => setPendingDeleteId(proj.id)}
            >
              <FormRow>
                <FormField label="Project Name">
                  <TextInput
                    value={proj.name}
                    onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                    placeholder="OpenMetrics"
                  />
                </FormField>
                <FormField label="Year">
                  <TextInput
                    value={proj.date}
                    onChange={(e) => updateProject(proj.id, { date: e.target.value })}
                    placeholder="2023"
                  />
                </FormField>
              </FormRow>
              <FormRow cols={1}>
                <FormField label="Tech Stack">
                  <TextInput
                    value={proj.tech}
                    onChange={(e) => updateProject(proj.id, { tech: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </FormField>
              </FormRow>
              <FormRow cols={1}>
                <FormField label="Description">
                  <Textarea
                    rows={2}
                    value={proj.desc}
                    onChange={(e) => updateProject(proj.id, { desc: e.target.value })}
                    placeholder="Describe the project, impact, and your role…"
                  />
                </FormField>
              </FormRow>
            </RepeaterItem>
          ))}
        </div>
      )}

      <AddButton onClick={addProject}>
        <Plus size={14} aria-hidden /> Add Project
      </AddButton>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete project?"
        description="This entry will be permanently removed. You can undo with Ctrl+Z."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (pendingDeleteId) removeProject(pendingDeleteId)
          setPendingDeleteId(null)
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
