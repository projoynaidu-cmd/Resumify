export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/resumes/:id
export async function GET(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const resume = await db.resume.findUnique({ where: { id } })

  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  // Only owner can access non-public resumes
  if (resume.userId !== session.user.id && !resume.isPublic) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ resume })
}

// PATCH /api/resumes/:id — update title, data, isPublic
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  const resume = await db.resume.findUnique({ where: { id } })
  if (!resume || resume.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await db.resume.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.data !== undefined && { data: body.data }),
      ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
    },
    select: { id: true, title: true, slug: true, isPublic: true, updatedAt: true },
  })

  return NextResponse.json({ resume: updated })
}

// DELETE /api/resumes/:id
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const resume = await db.resume.findUnique({ where: { id } })
  if (!resume || resume.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await db.resume.delete({ where: { id } })

  return NextResponse.json({ message: 'Resume deleted' })
}
