import { Trash2 } from 'lucide-react'
import { cn } from '@/utils'

interface RepeaterItemProps {
  index: number
  title: string
  onDelete: () => void
  children: React.ReactNode
}

export function RepeaterItem({ index, title, onDelete, children }: RepeaterItemProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 mb-2.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[0.78rem] font-semibold text-[var(--text2)]">
          #{index + 1} {title}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-[0.75rem] font-medium',
            'bg-[#fef0ee] text-[var(--danger)] border border-[#fdddd9]',
            'hover:bg-[#fdddd9] transition-colors duration-200',
          )}
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
      {children}
    </div>
  )
}

interface AddButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export function AddButton({ onClick, children }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-1.5 w-full px-3 py-1.5',
        'rounded-[var(--radius-sm)] text-[0.8rem] font-medium',
        'text-[var(--accent)] bg-[var(--accent-bg)] border border-dashed border-[var(--accent2)]',
        'hover:bg-[var(--accent)] hover:text-white hover:border-solid',
        'transition-all duration-200 cursor-pointer font-sans',
      )}
    >
      {children}
    </button>
  )
}
