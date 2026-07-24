/**
 * Server-side helpers for syncing resume data with the database.
 * Import only in Server Components, API routes, and server actions.
 */

import { db } from '@/lib/db'
import { DEFAULT_RESUME_STATE } from '@/lib/constants'
import { generateSlug } from '@/utils'
import type { ResumeState } from '@/types'

// ─── Types ────────────────────────────────────────────────────

export interface DbResume {
  id: string
  title: string
  slug: string
  isPublic: boolean
  viewCount: number
  data: ResumeState
  createdAt: Date
  updatedAt: Date
  userId: string
}

// ─── Read ─────────────────────────────────────────────────────

/**
 * Load a single resume by ID.
 * Returns null if not found or if the requesting user doesn't own it
 * (unless it's public).
 */
export async function getResumeById(
  id: string,
  requestingUserId?: string,
): Promise<DbResume | null> {
  const resume = await db.resume.findUnique({ where: { id } })
  if (!resume) return null
  if (!resume.isPublic && resume.userId !== requestingUserId) return null

  return {
    ...resume,
    data: (resume.data as ResumeState) ?? DEFAULT_RESUME_STATE,
  }
}

/**
 * Load a resume by its public share slug.
 * Only returns public resumes.
 */
export async function getResumeBySlug(slug: string): Promise<DbResume | null> {
  const resume = await db.resume.findUnique({ where: { slug } })
  if (!resume || !resume.isPublic) return null
  return {
    ...resume,
    data: (resume.data as ResumeState) ?? DEFAULT_RESUME_STATE,
  }
}

/**
 * List all resumes for a user, newest first.
 */
export async function listResumesForUser(userId: string) {
  return db.resume.findMany({
    where: { userId },
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
}

// ─── Write ────────────────────────────────────────────────────

/**
 * Persist resume state to the database.
 * Also updates the title from personal.fname + personal.lname if provided.
 */
export async function saveResumeData(
  id: string,
  userId: string,
  data: ResumeState,
  titleOverride?: string,
): Promise<{ id: string; updatedAt: Date } | null> {
  const resume = await db.resume.findUnique({
    where: { id },
    select: { userId: true },
  })
  if (!resume || resume.userId !== userId) return null

  // Auto-derive title from name fields when no override given
  const autoTitle =
    titleOverride ??
    ([data.personal?.fname, data.personal?.lname].filter(Boolean).join(' ') || 'Untitled Resume')

  const updated = await db.resume.update({
    where: { id },
    data: { data: data as object, title: autoTitle },
    select: { id: true, updatedAt: true },
  })

  return updated
}

/**
 * Duplicate a resume for the same user.
 * Enforces the 3-resume free-plan limit.
 */
export async function duplicateResume(
  sourceId: string,
  userId: string,
  isPro: boolean,
): Promise<{ id: string; title: string } | { error: string }> {
  const source = await db.resume.findUnique({ where: { id: sourceId } })
  if (!source || source.userId !== userId) return { error: 'Not found' }

  if (!isPro) {
    const count = await db.resume.count({ where: { userId } })
    if (count >= 3) {
      return { error: 'Free plan allows up to 3 resumes. Upgrade to Pro.' }
    }
  }

  const copy = await db.resume.create({
    data: {
      userId,
      title: `${source.title} (copy)`,
      slug: generateSlug(),
      data: source.data ?? {},
    },
    select: { id: true, title: true },
  })

  return copy
}

/**
 * Toggle the public/private status of a resume.
 */
export async function toggleResumePublic(
  id: string,
  userId: string,
): Promise<{ isPublic: boolean; slug: string } | null> {
  const resume = await db.resume.findUnique({ where: { id } })
  if (!resume || resume.userId !== userId) return null

  const updated = await db.resume.update({
    where: { id },
    data: { isPublic: !resume.isPublic },
    select: { isPublic: true, slug: true },
  })
  return updated
}
