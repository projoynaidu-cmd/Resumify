export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAiUsageStatus } from '@/lib/ai-usage'

/**
 * GET /api/ai/usage
 * Returns the current user's AI quota status.
 * Used by AiCallsBadge to show "3/5 AI calls left today".
 */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const status = await getAiUsageStatus(session.user.id, session.user.plan ?? 'FREE')
  return NextResponse.json(status)
}
