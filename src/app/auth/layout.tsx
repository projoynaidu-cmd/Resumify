import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign in — Resumify',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Simple header */}
      <header className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--accent)] no-underline"
        >
          <span className="bg-[var(--accent)] text-white w-[28px] h-[28px] rounded-[7px] grid place-items-center">
            <FileText size={13} aria-hidden />
          </span>
          <span className="font-serif font-bold text-[1.1rem]">Resumify</span>
        </Link>
      </header>

      {/* Centred content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>

      <footer className="py-4 text-center text-[0.75rem] text-[var(--text3)]">
        © {new Date().getFullYear()} Resumify. All rights reserved.
      </footer>
    </div>
  )
}

