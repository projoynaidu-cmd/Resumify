'use client'

import { PenLine, Eye } from 'lucide-react'
import { cn } from '@/utils'

interface MobileBottomNavProps {
  active: 'editor' | 'preview'
  onChange: (panel: 'editor' | 'preview') => void
}

/**
 * Shown only on mobile/tablet (lg:hidden).
 * Lets the user toggle between the editor and live preview panels.
 */
export function MobileBottomNav({ active, onChange }: MobileBottomNavProps) {
  return (
    <nav
      className={cn(
        'lg:hidden no-print',
        'flex border-t border-[var(--border)] bg-[var(--surface)]',
        'shadow-[0_-4px_16px_rgba(0,0,0,0.06)]',
        // Safe-area inset for iPhone home bar
        'pb-[env(safe-area-inset-bottom)]',
      )}
      aria-label="Panel switcher"
    >
      <NavTab
        icon={<PenLine size={18} aria-hidden />}
        label="Edit"
        active={active === 'editor'}
        onClick={() => onChange('editor')}
      />
      <NavTab
        icon={<Eye size={18} aria-hidden />}
        label="Preview"
        active={active === 'preview'}
        onClick={() => onChange('preview')}
      />
    </nav>
  )
}

function NavTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex-1 flex flex-col items-center justify-center gap-1 py-2.5',
        'text-[0.7rem] font-medium font-sans transition-colors duration-200',
        active
          ? 'text-[var(--accent)]'
          : 'text-[var(--text3)] hover:text-[var(--text2)]',
      )}
    >
      {/* Active indicator bar */}
      <span
        className={cn(
          'absolute top-0 h-[2px] w-12 rounded-full transition-opacity duration-200 bg-[var(--accent)]',
          active ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden
      />
      {icon}
      {label}
    </button>
  )
}
