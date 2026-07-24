export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getClaude, CLAUDE_MODEL, extractText } from '@/lib/claude'
import { assertAiQuota, recordAiUsage, AiQuotaExceededError } from '@/lib/ai-usage'
import { SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt } from '@/lib/ai-prompts'
import type { ResumeState } from '@/types'

/**
 * POST /api/ai/summary
 * Body: { resumeData: Partial<ResumeState> }
 * Returns: { summary: string }
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
      max_tokens: 200,
      system: SUMMARY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildSummaryPrompt(body.resumeData as ResumeState) }],
    })

    const summary = extractText(message)
    await recordAiUsage(session.user.id, 'summary')

    return NextResponse.json({ summary })
  } catch (err) {
    console.error('[AI Summary] Error:', err)
    return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
  }
}
