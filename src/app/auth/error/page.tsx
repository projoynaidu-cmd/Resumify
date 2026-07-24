import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'Could not start the sign-in process. Please try again.',
  OAuthCallback: 'OAuth callback failed. Please try again.',
  OAuthAccountNotLinked:
    'This email is already registered with a different sign-in method.',
  CredentialsSignin: 'Invalid email or password.',
  Default: 'An unexpected error occurred. Please try again.',
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const message = ERROR_MESSAGES[error ?? 'Default'] ?? ERROR_MESSAGES.Default

  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#feeeed] text-[var(--danger)] grid place-items-center mx-auto mb-5">
        <AlertTriangle size={24} aria-hidden />
      </div>
      <h1 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">
        Sign-in failed
      </h1>
      <p className="text-[var(--text2)] text-sm mb-6 max-w-xs mx-auto">{message}</p>
      <Link
        href="/auth/login"
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent2)] transition-colors"
      >
        Back to sign in
      </Link>
    </div>
  )
}
