export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { recordResumeView } from '@/lib/analytics'

interface Params {
  params: Promise<{ id: string }>
}

/**
 * POST /api/resumes/:id/view
 * Records a view event (no auth required).
 */
export async function POST(req: Request, { params }: Params) {
  const { id } = await params

  const referrer = req.headers.get('referer') ?? undefined
  const country = req.headers.get('cf-ipcountry') ?? undefined

  try {
    await recordResumeView(id, { referrer, country })
  } catch {
    // Ignore — view tracking should never break the UX
  }

  return NextResponse.json({ ok: true })
}
