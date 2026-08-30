'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText, LayoutDashboard, User, Settings,
  CreditCard, LogOut, Sparkles, BarChart2,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/utils'

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    plan?: string
  }
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'My Resumes', icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/billing', label: 'Billing', icon: CreditCard },
]

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const isPro = user.plan === 'PRO' || user.plan === 'ENTERPRISE'

  return (
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen border-r border-[var(--border)] bg-[var(--surface)] flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2 text-[var(--accent)] no-underline">
          <span className="bg-[var(--accent)] text-white w-7 h-7 rounded-[6px] grid place-items-center">
            <FileText size={13} aria-hidden />
          </span>
          <span className="font-serif font-bold text-[1.05rem]">Resumify</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)]',
              'text-[0.85rem] font-medium transition-colors duration-150 no-underline',
              pathname === href
                ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                : 'text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]',
            )}
          >
            <Icon size={15} aria-hidden />
            {label}
          </Link>
        ))}

        {/* Upgrade banner for free users */}
        {!isPro && (
          <Link
            href="/billing"
            className={cn(
              'mt-3 flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-sm)] no-underline',
              'bg-gradient-to-r from-[var(--accent)] to-[#4a8c5e] text-white',
              'text-[0.78rem] font-semibold',
            )}
          >
            <Sparkles size={13} aria-hidden />
            Upgrade to Pro
          </Link>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-[var(--accent-bg)] grid place-items-center text-[var(--accent)] flex-shrink-0 overflow-hidden">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[0.7rem] font-bold">
                {user.name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[0.78rem] font-semibold text-[var(--text)] truncate">
              {user.name ?? 'User'}
            </p>
            <p className="text-[0.68rem] text-[var(--text3)] truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-[0.8rem] text-[var(--text3)] hover:text-[var(--danger)] hover:bg-[#fef0ee] rounded-[var(--radius-sm)] transition-colors"
        >
          <LogOut size={13} aria-hidden /> Sign out
        </button>
      </div>
    </aside>
  )
}

