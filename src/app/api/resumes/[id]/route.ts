export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

interface Params {
  params: Promise<{ id: string }>
}

const updateResumeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  data: z.unknown().optional(),
  isPublic: z.boolean().optional(),
})

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
  const parsed = updateResumeSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const resume = await db.resume.findUnique({ where: { id } })
  if (!resume || resume.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await db.resume.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.data !== undefined && { data: parsed.data.data as object }),
      ...(parsed.data.isPublic !== undefined && { isPublic: parsed.data.isPublic }),
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
