import { cn } from '@/utils'

interface DividerProps {
  label?: string
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-2 my-2', className)}>
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[0.68rem] font-medium text-[var(--text3)] uppercase tracking-[0.08em]">
          {label}
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
    )
  }

  return <hr className={cn('border-none h-px bg-[var(--border)] my-2', className)} />
}
