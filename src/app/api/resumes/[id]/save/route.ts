export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { saveResumeData } from '@/lib/resume-sync'
import type { ResumeState } from '@/types'

interface Params {
  params: Promise<{ id: string }>
}

/**
 * POST /api/resumes/:id/save
 * Body: { data: ResumeState, title?: string }
 *
 * Called by the builder's useCloudSync hook on debounced state changes.
 * Returns { savedAt: ISO string } on success.
 */
export async function POST(req: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  let body: { data?: ResumeState; title?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.data || typeof body.data !== 'object') {
    return NextResponse.json({ error: 'Missing resume data' }, { status: 400 })
  }

  const result = await saveResumeData(
    id,
    session.user.id,
    body.data,
    body.title,
  )

  if (!result) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  return NextResponse.json({ savedAt: result.updatedAt.toISOString() })
}
