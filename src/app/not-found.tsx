import Link from 'next/link'
import { FileSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--accent-bg)] text-[var(--accent)] grid place-items-center mb-5">
        <FileSearch size={28} aria-hidden />
      </div>
      <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-2">404</h1>
      <p className="text-[var(--text2)] mb-6 max-w-sm">
        This page doesn&apos;t exist. Head back to the builder to craft your resume.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent2)] transition-colors duration-200"
      >
        Go to Builder
      </Link>
    </div>
  )
}
