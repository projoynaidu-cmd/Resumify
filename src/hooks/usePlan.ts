'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { FREE_TEMPLATES, PRO_TEMPLATES, canUseTemplate, canCreateResume } from '@/lib/stripe'

/**
 * Client-side hook for plan state and gating logic.
 *
 * Usage:
 * ```tsx
 * const { isPro, upgrade, isUpgrading } = usePlan()
 * if (!isPro) return <UpgradePrompt onUpgrade={upgrade} />
 * ```
 */
export function usePlan() {
  const { data: session } = useSession()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const plan = session?.user?.plan ?? 'FREE'
  const isPro = plan === 'PRO' || plan === 'ENTERPRISE'
  const isFree = !isPro

  /**
   * Redirects to Stripe Checkout.
   * Returns false if the API call fails.
   */
  const upgrade = useCallback(async (): Promise<boolean> => {
    setIsUpgrading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.url) return false
      window.location.href = data.url
      return true
    } catch {
      return false
    } finally {
      setIsUpgrading(false)
    }
  }, [])

  /**
   * Opens the Stripe billing portal (cancel, update card, invoices).
   */
  const openBillingPortal = useCallback(async (): Promise<boolean> => {
    setIsUpgrading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.url) return false
      window.location.href = data.url
      return true
    } catch {
      return false
    } finally {
      setIsUpgrading(false)
    }
  }, [])

  return {
    plan,
    isPro,
    isFree,
    isUpgrading,
    upgrade,
    openBillingPortal,
    // Convenience gates
    canUseTemplate: (templateId: string) => canUseTemplate(plan, templateId),
    canCreateResume: (currentCount: number) => canCreateResume(plan, currentCount),
    freeTemplates: FREE_TEMPLATES,
    proTemplates: PRO_TEMPLATES,
  }
}
