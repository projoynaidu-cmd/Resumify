import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-full text-[0.7rem] px-2 py-0.5',
  {
    variants: {
      variant: {
        default: 'bg-[var(--surface2)] text-[var(--text2)] border border-[var(--border)]',
        accent: 'bg-[var(--accent-bg)] text-[var(--accent)]',
        success: 'bg-[#e8f5ed] text-[#27ae60]',
        warning: 'bg-[#fef3e2] text-[#e67e22]',
        danger: 'bg-[#feeeed] text-[#e74c3c]',
        primary: 'bg-[var(--accent)] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
