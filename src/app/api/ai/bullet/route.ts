export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getClaude, CLAUDE_MODEL, extractText } from '@/lib/claude'
import { assertAiQuota, recordAiUsage, AiQuotaExceededError } from '@/lib/ai-usage'
import { BULLET_SYSTEM_PROMPT, buildBulletPrompt } from '@/lib/ai-prompts'
import type { ExperienceEntry } from '@/types'

/**
 * POST /api/ai/bullet
 * Body: { entry: { title, company, desc } }
 * Returns: { bullets: string } — newline-separated "• " bullets
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

  let body: { entry?: Pick<ExperienceEntry, 'title' | 'company' | 'desc'> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.entry?.title || !body.entry?.company) {
    return NextResponse.json(
      { error: 'Job title and company are required' },
      { status: 400 },
    )
  }

  try {
    const claude = getClaude()
    const message = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      system: BULLET_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildBulletPrompt(body.entry as ExperienceEntry) },
      ],
    })

    const bullets = extractText(message)
    await recordAiUsage(session.user.id, 'bullet')

    return NextResponse.json({ bullets })
  } catch (err) {
    console.error('[AI Bullet] Error:', err)
    return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
  }
}
