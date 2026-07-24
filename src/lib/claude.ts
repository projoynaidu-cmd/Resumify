/**
 * Anthropic Claude client singleton.
 * Import ONLY in server code (API routes).
 */

import Anthropic from '@anthropic-ai/sdk'

let _client: Anthropic | null = null

export function getClaude(): Anthropic {
  if (_client) return _client
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set')
  _client = new Anthropic({ apiKey: key })
  return _client
}

export const CLAUDE_MODEL = 'claude-sonnet-4-6'

/**
 * Extracts plain text from a Claude message response,
 * concatenating all text content blocks.
 */
export function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim()
}

/**
 * Strips markdown code fences if the model wraps its JSON/text
 * response in ```json ... ``` despite instructions not to.
 */
export function stripCodeFences(text: string): string {
  return text.replace(/^```(?:json|text)?\n?/i, '').replace(/\n?```$/i, '').trim()
}
