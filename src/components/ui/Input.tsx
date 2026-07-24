import * as React from 'react'
import { cn } from '@/utils'

// ─── Input ────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)]',
            'px-[11px] py-2 text-[0.85rem] font-sans text-[var(--text)] w-full',
            'transition-[border-color,box-shadow] duration-200',
            'focus:outline-none focus:border-[var(--accent)]',
            'focus:shadow-[0_0_0_3px_rgba(45,90,61,0.1)]',
            'placeholder:text-[var(--text3)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--danger)] focus:shadow-[0_0_0_3px_rgba(192,57,43,0.1)]',
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-[0.7rem] text-[var(--danger)]" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

// ─── Textarea ─────────────────────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[0.7rem] font-medium text-[var(--text2)] uppercase tracking-[0.03em]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)]',
            'px-[11px] py-2 text-[0.85rem] font-sans text-[var(--text)] w-full',
            'transition-[border-color,box-shadow] duration-200',
            'focus:outline-none focus:border-[var(--accent)]',
            'focus:shadow-[0_0_0_3px_rgba(45,90,61,0.1)]',
            'placeholder:text-[var(--text3)]',
            'resize-y min-h-[72px]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--danger)] focus:shadow-[0_0_0_3px_rgba(192,57,43,0.1)]',
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-[0.7rem] text-[var(--danger)]" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Input, Textarea }
