'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, FileText, LogOut, Sparkles } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/utils'

interface TopbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    plan?: string
  }
}

export function DashboardTopbar({ user }: TopbarProps) {
  const [open, setOpen] = useState(false)
  const isPro = user.plan === 'PRO' || user.plan === 'ENTERPRISE'

  return (
    <>
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2 text-[var(--accent)] no-underline">
          <span className="bg-[var(--accent)] text-white w-7 h-7 rounded-[6px] grid place-items-center">
            <FileText size={13} />
          </span>
          <span className="font-serif font-bold">Resumify</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[var(--accent-bg)] grid place-items-center text-[var(--accent)] overflow-hidden">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold">
                {user.name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text2)] hover:bg-[var(--surface2)]"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-20 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="lg:hidden fixed top-[53px] left-0 right-0 z-30 bg-[var(--surface)] border-b border-[var(--border)] shadow-[var(--shadow-md)] p-4 flex flex-col gap-1">
            {[
              { href: '/dashboard', label: 'My Resumes' },
              { href: '/dashboard/analytics', label: 'Analytics' },
              { href: '/profile', label: 'Profile' },
              { href: '/settings', label: 'Settings' },
              { href: '/billing', label: 'Billing' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-[var(--radius-sm)] text-[0.9rem] font-medium text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] no-underline"
              >
                {label}
              </Link>
            ))}
            {!isPro && (
              <Link
                href="/billing"
                onClick={() => setOpen(false)}
                className={cn(
                  'mt-1 flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-sm)] no-underline',
                  'bg-[var(--accent)] text-white text-[0.85rem] font-semibold',
                )}
              >
                <Sparkles size={14} /> Upgrade to Pro
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-3 py-2.5 text-[0.85rem] text-[var(--danger)] hover:bg-[#fef0ee] rounded-[var(--radius-sm)] mt-1"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </>
      )}
    </>
  )
}

