'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, GripVertical, Info, Star, Briefcase, GraduationCap, Code, User, Palette } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { useUIStore } from '@/store'
import { cn } from '@/utils'
import type { SectionKey } from '@/types'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

// Inline SVG fallback for icons not in this version of lucide-react
function PuzzlePieceIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.236 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.953a.97.97 0 0 0-.273-.85 1 1 0 0 0-1.414 0l-2 2a1 1 0 0 0-.293.707V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4a2 2 0 0 0-2-2 2 2 0 0 1 0-4 2 2 0 0 0 2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v.586a1 1 0 0 0 .293.707l2 2a1 1 0 0 0 1.414 0 .97.97 0 0 0 .273-.85c-.059-.473.273-.884.743-.953a.98.98 0 0 1 .837.276" />
    </svg>
  )
}

const ICON_MAP: Record<string, LucideIcon | (({ size }: { size?: number }) => React.JSX.Element)> = {
  User,
  Palette,
  Info,
  Star,
  Briefcase,
  GraduationCap,
  Code,
  PuzzlePiece: PuzzlePieceIcon,
}

interface SortableSectionCardProps {
  id: SectionKey
  label: string
  icon: string
  draggable: boolean
  children: React.ReactNode
}

export function SortableSectionCard({
  id,
  label,
  icon,
  draggable,
  children,
}: SortableSectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !draggable,
  })
  const { openSections, toggleSection } = useUIStore()
  const isOpen = openSections.has(id)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const IconComponent = ICON_MAP[icon] || Info

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'mx-3 mb-2.5 border border-[var(--border)] rounded-[var(--radius)] overflow-hidden',
        'transition-shadow duration-200',
        'hover:shadow-[var(--shadow-sm)]',
        isDragging && 'shadow-[var(--shadow-md)] z-50',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center gap-2.5 px-3.5 py-3 cursor-pointer select-none',
          'bg-[var(--surface)] hover:bg-[var(--surface2)]',
          'transition-colors duration-200',
        )}
        onClick={() => toggleSection(id)}
      >
        {/* Drag handle */}
        {draggable && (
          <span
            {...attributes}
            {...listeners}
            className="text-[var(--text3)] cursor-grab active:cursor-grabbing p-0.5 hover:text-[var(--text2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </span>
        )}

        {/* Icon */}
        <span className="w-7 h-7 rounded-[6px] bg-[var(--accent-bg)] text-[var(--accent)] grid place-items-center flex-shrink-0">
          <IconComponent size={12} />
        </span>

        {/* Title */}
        <span className="flex-1 text-sm font-semibold">{label}</span>

        {/* Chevron */}
        <ChevronDown
          size={12}
          className={cn(
            'text-[var(--text3)] transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-3.5 border-t border-[var(--border)] bg-[var(--surface2)]">
          {children}
        </div>
      )}
    </div>
  )
}
