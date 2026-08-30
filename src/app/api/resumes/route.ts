export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateSlug } from '@/utils'
import { DEFAULT_RESUME_STATE } from '@/lib/constants'

// GET /api/resumes — list all resumes for current user
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resumes = await db.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({ resumes })
}

// POST /api/resumes — create a new resume
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Free plan limit: 3 resumes
  const isPro = session.user.plan === 'PRO' || session.user.plan === 'ENTERPRISE'
  if (!isPro) {
    const count = await db.resume.count({ where: { userId: session.user.id } })
    if (count >= 3) {
      return NextResponse.json(
        { error: 'Free plan allows up to 3 resumes. Upgrade to Pro for unlimited.' },
        { status: 403 },
      )
    }
  }

  const body = await req.json().catch(() => ({}))
  const title = typeof body.title === 'string' ? body.title : 'Untitled Resume'

  const resume = await db.resume.create({
    data: {
      userId: session.user.id,
      title,
      slug: generateSlug(),
      data: DEFAULT_RESUME_STATE as unknown as Prisma.InputJsonValue,
    },
    select: { id: true, title: true, slug: true, createdAt: true, updatedAt: true },
  })

  return NextResponse.json({ resume }, { status: 201 })
}
