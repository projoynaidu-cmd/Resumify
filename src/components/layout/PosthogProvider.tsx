'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { initPosthog, identifyUser } from '@/lib/posthog'

/**
 * Initializes PostHog analytics and identifies the current user.
 * Mount once at the app root (inside Providers).
 */
export function PosthogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    initPosthog()
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      identifyUser(session.user.id, {
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        plan: session.user.plan,
      })
    }
  }, [session?.user?.id, session?.user?.plan])

  return <>{children}</>
}
