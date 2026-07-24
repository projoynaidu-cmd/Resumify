import { type LucideProps } from 'lucide-react'
import { type ForwardRefExoticComponent, type RefAttributes } from 'react'
import { cn } from '@/utils'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Displayed when a list section has no entries.
 *
 * Usage:
 * ```tsx
 * {experience.length === 0 && (
 *   <EmptyState
 *     icon={Briefcase}
 *     title="No experience added"
 *     description="Add your first work experience below."
 *   />
 * )}
 * ```
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-6 px-4',
        'border border-dashed border-[var(--border)] rounded-[var(--radius)]',
        'bg-[var(--surface2)]',
        className,
      )}
    >
      <div className="w-10 h-10 rounded-[10px] bg-[var(--accent-bg)] text-[var(--accent)] grid place-items-center mb-3">
        <Icon size={18} aria-hidden />
      </div>
      <p className="text-[0.82rem] font-semibold text-[var(--text)] mb-1">{title}</p>
      {description && (
        <p className="text-[0.75rem] text-[var(--text3)] max-w-[200px] leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
