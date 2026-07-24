'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface AiUsageStatus {
  used: number
  limit: number | 'unlimited'
  remaining: number | 'unlimited'
  canUse: boolean
}

/**
 * Fetches and caches the current user's AI usage quota.
 * Refetch with `refresh()` after a successful AI call.
 */
export function useAiUsage() {
  const { data: session } = useSession()
  const [status, setStatus] = useState<AiUsageStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!session?.user) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/usage')
      if (res.ok) {
        const data = await res.json()
        setStatus(data)
      }
    } finally {
      setLoading(false)
    }
  }, [session?.user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { status, loading, refresh }
}
