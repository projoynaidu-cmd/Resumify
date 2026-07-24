/**
 * AI usage quota tracking.
 *
 * Free plan: 5 AI calls per rolling 24h window.
 * Pro plan: unlimited (no row insert needed for limit checks,
 * but we still log usage for analytics).
 *
 * This module is the foundation Phase 4 (AI Features) builds on —
 * it only handles quota bookkeeping here; the actual AI calls
 * (summary writer, bullet improver, cover letter) are wired in
 * Phase 4.
 */

import { db } from '@/lib/db'

export type AiFeature = 'summary' | 'bullet' | 'cover_letter' | 'ats_keywords'

const FREE_DAILY_LIMIT = 5

/**
 * Returns how many AI calls the user has made in the last 24h
 * and whether they're still under the free-plan limit.
 */
export async function getAiUsageStatus(
  userId: string,
  plan: string,
): Promise<{ used: number; limit: number | 'unlimited'; remaining: number | 'unlimited'; canUse: boolean }> {
  const isPro = plan === 'PRO' || plan === 'ENTERPRISE'

  if (isPro) {
    return { used: 0, limit: 'unlimited', remaining: 'unlimited', canUse: true }
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const used = await db.aiUsage.count({
    where: { userId, createdAt: { gte: since } },
  })

  return {
    used,
    limit: FREE_DAILY_LIMIT,
    remaining: Math.max(0, FREE_DAILY_LIMIT - used),
    canUse: used < FREE_DAILY_LIMIT,
  }
}

/**
 * Records an AI feature usage event. Call this AFTER a successful
 * AI generation so failed calls don't count against quota.
 */
export async function recordAiUsage(userId: string, feature: AiFeature): Promise<void> {
  await db.aiUsage.create({
    data: { userId, feature },
  })
}

/**
 * Throws a quota-exceeded error object — callers in API routes
 * can catch this and return a 429.
 */
export class AiQuotaExceededError extends Error {
  constructor() {
    super('Daily AI usage limit reached. Upgrade to Pro for unlimited AI features.')
    this.name = 'AiQuotaExceededError'
  }
}

/**
 * Guard helper: throws AiQuotaExceededError if the user is over quota.
 * Use at the top of any AI API route.
 */
export async function assertAiQuota(userId: string, plan: string): Promise<void> {
  const status = await getAiUsageStatus(userId, plan)
  if (!status.canUse) throw new AiQuotaExceededError()
}
