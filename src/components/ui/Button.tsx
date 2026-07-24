import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const buttonVariants = cva(
  // Base
  [
    'inline-flex items-center justify-center gap-1.5',
    'font-medium font-sans text-sm',
    'rounded-[var(--radius-sm)] border',
    'transition-all duration-200 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--accent)] text-white border-[var(--accent)]',
          'shadow-[0_2px_8px_rgba(45,90,61,0.25)]',
          'hover:bg-[var(--accent2)] hover:-translate-y-px',
          'hover:shadow-[0_4px_16px_rgba(45,90,61,0.35)]',
          'active:translate-y-0 active:shadow-sm',
        ],
        secondary: [
          'bg-[var(--surface)] text-[var(--text2)] border-[var(--border)]',
          'hover:bg-[var(--surface2)] hover:text-[var(--text)] hover:border-[var(--accent)]',
        ],
        ghost: [
          'bg-transparent text-[var(--text2)] border-transparent',
          'hover:bg-[var(--surface2)] hover:text-[var(--text)]',
        ],
        danger: [
          'bg-[#fef0ee] text-[var(--danger)] border-[#fdddd9]',
          'hover:bg-[#fdddd9]',
        ],
        accent: [
          'bg-[var(--accent-bg)] text-[var(--accent)] border-dashed border-[var(--accent2)]',
          'hover:bg-[var(--accent)] hover:text-white hover:border-solid',
        ],
      },
      size: {
        xs: 'px-2 py-1 text-[0.72rem] gap-1',
        sm: 'px-2.5 py-1.5 text-[0.78rem]',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
        icon: 'w-9 h-9 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
