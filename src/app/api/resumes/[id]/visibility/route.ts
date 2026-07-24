export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { toggleResumePublic } from '@/lib/resume-sync'

interface Params {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/resumes/:id/visibility
 * Toggles isPublic. Returns { isPublic, slug, shareUrl }.
 */
export async function PATCH(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const result = await toggleResumePublic(id, session.user.id)

  if (!result) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return NextResponse.json({
    isPublic: result.isPublic,
    slug: result.slug,
    shareUrl: result.isPublic ? `${baseUrl}/r/${result.slug}` : null,
  })
}
