import { cn } from '@/utils'

interface SkeletonProps {
  className?: string
  /** If true renders as a circle (for avatars) */
  circle?: boolean
  width?: string | number
  height?: string | number
}

/**
 * Shimmer-animated loading placeholder.
 *
 * Usage:
 * ```tsx
 * <Skeleton className="h-4 w-40 mb-2" />
 * <Skeleton circle className="w-10 h-10" />
 * ```
 */
export function Skeleton({ className, circle, width, height }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn(
        'animate-pulse bg-[var(--border)] relative overflow-hidden',
        circle ? 'rounded-full' : 'rounded-[var(--radius-sm)]',
        className,
      )}
      style={{ width, height }}
    >
      {/* Shimmer sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

/** Pre-built skeleton for an editor section card */
export function SectionSkeleton() {
  return (
    <div className="mx-3 mb-2.5 border border-[var(--border)] rounded-[var(--radius)] p-3.5 space-y-2.5">
      <Skeleton className="h-4 w-32" />
      <div className="grid grid-cols-2 gap-2.5">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
      <Skeleton className="h-9" />
      <Skeleton className="h-16" />
    </div>
  )
}

/** Pre-built skeleton for a resume entry row */
export function EntrySkeleton() {
  return (
    <div className="space-y-1.5 py-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-64" />
    </div>
  )
}
