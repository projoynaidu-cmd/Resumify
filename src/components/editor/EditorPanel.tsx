'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useUIStore, useResumeStore } from '@/store'
import { SECTION_META } from '@/lib/constants'
import type { SectionKey } from '@/types'

import { SortableSectionCard } from './SortableSectionCard'
import { PersonalSection } from './sections/PersonalSection'
import { AppearanceSection } from './sections/AppearanceSection'
import { AboutSection } from './sections/AboutSection'
import { SkillsSection } from './sections/SkillsSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { CustomSectionsSection } from './sections/CustomSectionsSection'
import { CoverLetterEditor } from './CoverLetterEditor'
import { AtsScorePanel } from './AtsScorePanel'
import { KeywordGapPanel } from './KeywordGapPanel'
import { AutosaveBadge } from '../shared/AutosaveBadge'
import { StorageInfo } from '../shared/StorageInfo'
import { AiCallsBadge } from '../shared/AiCallsBadge'
import { HtmlUploadDropZone } from './HtmlUploadDropZone'

const SECTION_COMPONENTS: Record<SectionKey, React.ComponentType> = {
  personal: PersonalSection,
  appearance: AppearanceSection,
  about: AboutSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
  custom: CustomSectionsSection,
}

export function EditorPanel() {
  const activeView = useUIStore((s) => s.activeView)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const reorderSections = useResumeStore((s) => s.reorderSections)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sectionOrder.indexOf(active.id as SectionKey)
    const newIndex = sectionOrder.indexOf(over.id as SectionKey)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(arrayMove(sectionOrder, oldIndex, newIndex))
    }
  }

  return (
    <aside
      className="bg-[var(--surface)] border-r border-[var(--border)] overflow-y-auto overflow-x-hidden
                 h-full pb-[env(safe-area-inset-bottom)]"
      style={{ transition: 'background var(--transition)' }}
    >
      {/* Cover Letter Editor */}
      {activeView === 'coverletter' && <CoverLetterEditor />}

      {/* Resume Sections */}
      {activeView === 'resume' && (
        <>
          {/* HTML Upload Zone */}
          <HtmlUploadDropZone />

          {/* ATS Score */}
          <AtsScorePanel />

          {/* AI Job Match Keywords */}
          <KeywordGapPanel />

          {/* Autosave indicator */}
          <AutosaveBadge />

          {/* Section cards with drag reorder */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
              <div id="sections-container" className="pb-2">
                {sectionOrder.map((key) => {
                  const meta = SECTION_META[key]
                  const SectionComponent = SECTION_COMPONENTS[key]
                  return (
                    <SortableSectionCard
                      key={key}
                      id={key}
                      label={meta.label}
                      icon={meta.icon}
                      draggable={meta.draggable}
                    >
                      <SectionComponent />
                    </SortableSectionCard>
                  )
                })}
              </div>
              <StorageInfo />
              <AiCallsBadge />
            </SortableContext>
          </DndContext>
        </>
      )}
    </aside>
  )
}
