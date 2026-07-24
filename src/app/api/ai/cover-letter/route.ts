export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getClaude, CLAUDE_MODEL, extractText } from '@/lib/claude'
import { assertAiQuota, recordAiUsage, AiQuotaExceededError } from '@/lib/ai-usage'
import { COVER_LETTER_SYSTEM_PROMPT, buildCoverLetterPrompt } from '@/lib/ai-prompts'
import type { ResumeState } from '@/types'

/**
 * POST /api/ai/cover-letter
 * Body: { resumeData: Partial<ResumeState> }
 * Returns: { body: string } — letter body only (no greeting/sign-off)
 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await assertAiQuota(session.user.id, session.user.plan ?? 'FREE')
  } catch (err) {
    if (err instanceof AiQuotaExceededError) {
      return NextResponse.json({ error: err.message }, { status: 429 })
    }
    throw err
  }

  let body: { resumeData?: Partial<ResumeState> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.resumeData) {
    return NextResponse.json({ error: 'Missing resumeData' }, { status: 400 })
  }

  try {
    const claude = getClaude()
    const message = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      system: COVER_LETTER_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildCoverLetterPrompt(body.resumeData as ResumeState) },
      ],
    })

    const letterBody = extractText(message)
    await recordAiUsage(session.user.id, 'cover_letter')

    return NextResponse.json({ body: letterBody })
  } catch (err) {
    console.error('[AI Cover Letter] Error:', err)
    return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
  }
}
