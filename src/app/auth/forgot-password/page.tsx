import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Reset password — Resumify' }

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-12 text-center">
      <h1 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">
        Password reset coming soon
      </h1>
      <p className="text-sm text-[var(--text3)] mb-6">
        Forgot password functionality is not yet implemented. Please use the
        sign-in options below to access your account.
      </p>
      <Link
        href="/auth/login"
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent2)] transition-colors duration-200"
      >
        Back to sign in
      </Link>
    </div>
  )
}
