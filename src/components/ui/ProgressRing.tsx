import { cn } from '@/utils'

interface ProgressRingProps {
  value: number          // 0–100
  size?: number          // px, default 80
  strokeWidth?: number   // px, default 6
  color?: string         // stroke color
  label?: string         // centre label (defaults to `${value}`)
  className?: string
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  color,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference

  const strokeColor =
    color ??
    (value >= 75 ? '#27ae60' : value >= 50 ? '#e67e22' : '#e74c3c')

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s ease' }}
        />
      </svg>
      {/* Centre label */}
      <span
        className="absolute inset-0 flex items-center justify-center text-[var(--text)] font-bold"
        style={{ fontSize: size * 0.22 }}
      >
        {label ?? value}
      </span>
    </div>
  )
}
