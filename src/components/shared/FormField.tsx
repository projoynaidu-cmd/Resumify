import { cn } from '@/utils'

interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
  error?: string
}

export function FormField({ label, children, className, error }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em]">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-[0.7rem] text-[var(--danger)]" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

interface FormRowProps {
  children: React.ReactNode
  /**
   * cols=2: two columns on sm+ screens, one column on mobile
   * cols=1: always one column
   */
  cols?: 1 | 2
  className?: string
}

export function FormRow({ children, cols = 2, className }: FormRowProps) {
  return (
    <div
      className={cn(
        'grid gap-2.5 mb-2.5',
        // On mobile always 1 col; 2-col layout kicks in at sm (640px)
        cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function TextInput({ className, error, ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={cn(
        'bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)]',
        'px-[11px] py-2 text-[0.85rem] font-sans text-[var(--text)] w-full',
        'transition-[border-color,box-shadow] duration-200',
        'focus:outline-none focus:border-[var(--accent)]',
        'focus:shadow-[0_0_0_3px_rgba(45,90,61,0.1)]',
        'placeholder:text-[var(--text3)]',
        // Prevent iOS zoom on focus (font-size must be ≥16px)
        'text-base sm:text-[0.85rem]',
        error && 'border-[var(--danger)]',
        className,
      )}
    />
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        'bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)]',
        'px-[11px] py-2 text-[0.85rem] font-sans text-[var(--text)] w-full',
        'transition-[border-color,box-shadow] duration-200',
        'focus:outline-none focus:border-[var(--accent)]',
        'focus:shadow-[0_0_0_3px_rgba(45,90,61,0.1)]',
        'placeholder:text-[var(--text3)] resize-y min-h-[72px]',
        'text-base sm:text-[0.85rem]',
        error && 'border-[var(--danger)]',
        className,
      )}
    />
  )
}
