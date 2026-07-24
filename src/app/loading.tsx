export default function Loading() {
  return (
    <div
      className="flex h-screen items-center justify-center bg-[var(--bg)]"
      aria-busy="true"
      aria-label="Loading ResumeForge"
    >
      <div className="text-center">
        <div
          className="mx-auto mb-4 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--accent)]"
          style={{ width: '48px', height: '48px' }}
          role="status"
        />
        <p className="font-serif text-lg font-semibold text-[var(--text)]">ResumeForge</p>
        <p className="text-sm text-[var(--text3)] mt-1">Loading…</p>
      </div>
    </div>
  )
}
