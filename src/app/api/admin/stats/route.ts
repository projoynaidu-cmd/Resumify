export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAdminStats, getUserGrowthData } from '@/lib/analytics'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)

/**
 * GET /api/admin/stats
 * Returns aggregate platform statistics.
 * Restricted to admin email addresses (set ADMIN_EMAILS in env).
 */
export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [stats, growth] = await Promise.all([
    getAdminStats(),
    getUserGrowthData(30),
  ])

  return NextResponse.json({ stats, growth })
}
