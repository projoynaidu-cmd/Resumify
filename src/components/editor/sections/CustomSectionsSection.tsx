'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useResumeStore, useUIStore } from '@/store'
import { FormField, TextInput, Textarea } from '@/components/shared/FormField'
import { AddButton } from '@/components/shared/RepeaterItem'
import { cn } from '@/utils'

export function CustomSectionsSection() {
  const customSections = useResumeStore((s) => s.customSections)
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection)
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection)
  const addToast = useUIStore((s) => s.addToast)

  function handleAdd() {
    addCustomSection()
    addToast('info', 'Custom section added')
  }

  return (
    <div id="custom-list">
      {customSections.map((sec) => (
        <div
          key={sec.id}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 mb-2.5"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <TextInput
              value={sec.title}
              onChange={(e) => updateCustomSection(sec.id, { title: e.target.value })}
              placeholder="Section Title (e.g. Certifications)"
              className="flex-1 font-semibold text-[0.85rem]"
            />
            <button
              onClick={() => removeCustomSection(sec.id)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-[0.75rem] font-medium flex-shrink-0',
                'bg-[#fef0ee] text-[var(--danger)] border border-[#fdddd9]',
                'hover:bg-[#fdddd9] transition-colors duration-200',
              )}
            >
              <Trash2 size={12} />
            </button>
          </div>
          <FormField label="Content (one item per line)">
            <Textarea
              rows={4}
              value={sec.content}
              onChange={(e) => updateCustomSection(sec.id, { content: e.target.value })}
              placeholder={'AWS Certified Developer – 2024\nGoogle Cloud Professional – 2023'}
            />
          </FormField>
        </div>
      ))}
      <AddButton onClick={handleAdd}>
        <Plus size={14} /> Add Custom Section
      </AddButton>
    </div>
  )
}
