export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getClaude, CLAUDE_MODEL, extractText, stripCodeFences } from '@/lib/claude'
import { assertAiQuota, recordAiUsage, AiQuotaExceededError } from '@/lib/ai-usage'
import { ATS_KEYWORDS_SYSTEM_PROMPT, buildAtsKeywordsPrompt } from '@/lib/ai-prompts'
import type { ResumeState } from '@/types'

/**
 * POST /api/ai/ats-keywords
 * Body: { resumeData: Partial<ResumeState>, jobDescription: string }
 * Returns: { missingKeywords: string[] }
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

  let body: { resumeData?: Partial<ResumeState>; jobDescription?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.resumeData || !body.jobDescription?.trim()) {
    return NextResponse.json(
      { error: 'Missing resumeData or jobDescription' },
      { status: 400 },
    )
  }

  if (body.jobDescription.length > 8000) {
    return NextResponse.json(
      { error: 'Job description too long (max 8000 characters)' },
      { status: 400 },
    )
  }

  try {
    const claude = getClaude()
    const message = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      system: ATS_KEYWORDS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildAtsKeywordsPrompt(
            body.resumeData as ResumeState,
            body.jobDescription,
          ),
        },
      ],
    })

    const raw = stripCodeFences(extractText(message))
    let missingKeywords: string[] = []

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        missingKeywords = parsed.filter((x): x is string => typeof x === 'string').slice(0, 12)
      }
    } catch {
      // Model didn't return valid JSON — fail gracefully with empty result
      console.warn('[AI ATS Keywords] Failed to parse model output:', raw)
    }

    await recordAiUsage(session.user.id, 'ats_keywords')

    return NextResponse.json({ missingKeywords })
  } catch (err) {
    console.error('[AI ATS Keywords] Error:', err)
    return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
  }
}
