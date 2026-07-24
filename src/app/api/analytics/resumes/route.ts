export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserResumeAnalytics } from '@/lib/analytics'

/**
 * GET /api/analytics/resumes
 * Returns analytics summary for all of the current user's resumes.
 */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const analytics = await getUserResumeAnalytics(session.user.id)
  return NextResponse.json({ analytics })
}
