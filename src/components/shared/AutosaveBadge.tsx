'use client'

export function AutosaveBadge() {
  return (
    <div className="autosave-badge flex items-center gap-1.5 text-[0.72rem] text-[var(--text3)] px-5 pb-2.5">
      <span
        className="animate-pulse-dot w-[5px] h-[5px] rounded-full bg-[var(--accent)] flex-shrink-0"
      />
      Auto-saved
    </div>
  )
}
