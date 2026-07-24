/**
 * PostHog analytics integration.
 *
 * Browser client: wraps posthog-js for page views and custom events.
 * Server client: wraps posthog-node for server-side event capture.
 *
 * Usage:
 *   Client: import { trackEvent } from '@/lib/posthog'
 *   Server: import { captureServerEvent } from '@/lib/posthog'
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

// ─── Browser client ───────────────────────────────────────────

let _posthogInitialized = false

export async function initPosthog(): Promise<void> {
  if (typeof window === 'undefined' || !POSTHOG_KEY || _posthogInitialized) return
  const posthog = (await import('posthog-js')).default
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false, // We capture events manually for precision
    persistence: 'localStorage+cookie',
  })
  _posthogInitialized = true
}

/**
 * Capture a custom event in the browser.
 * Silently no-ops if PostHog is not configured.
 */
export async function trackEvent(
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return
  const posthog = (await import('posthog-js')).default
  posthog.capture(event, properties)
}

/**
 * Identify the current user after sign-in.
 */
export async function identifyUser(
  userId: string,
  traits?: { email?: string; plan?: string; name?: string },
): Promise<void> {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return
  const posthog = (await import('posthog-js')).default
  posthog.identify(userId, traits)
}

/**
 * Reset identity on sign-out.
 */
export async function resetPosthog(): Promise<void> {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return
  const posthog = (await import('posthog-js')).default
  posthog.reset()
}

// ─── Server-side client ───────────────────────────────────────

let _serverPosthog: import('posthog-node').PostHog | null = null

function getServerPosthog() {
  if (_serverPosthog) return _serverPosthog
  if (!POSTHOG_KEY) return null
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PostHog } = require('posthog-node') as typeof import('posthog-node')
  _serverPosthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST, flushAt: 1, flushInterval: 0 })
  return _serverPosthog
}

/**
 * Capture a server-side event associated with a user.
 * Silently no-ops if PostHog is not configured.
 */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const client = getServerPosthog()
  if (!client) return
  client.capture({ distinctId, event, properties: properties ?? {} })
  await client.flush()
}

// ─── Well-known event names ───────────────────────────────────

export const ANALYTICS_EVENTS = {
  // Auth
  USER_REGISTERED: 'user_registered',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',

  // Resume builder
  RESUME_CREATED: 'resume_created',
  RESUME_EXPORTED_PDF: 'resume_exported_pdf',
  RESUME_EXPORTED_DOCX: 'resume_exported_docx',
  RESUME_EXPORTED_JSON: 'resume_exported_json',
  RESUME_SHARED: 'resume_shared',
  RESUME_VIEWED_PUBLIC: 'resume_viewed_public',

  // AI features
  AI_SUMMARY_GENERATED: 'ai_summary_generated',
  AI_BULLETS_IMPROVED: 'ai_bullets_improved',
  AI_COVER_LETTER_DRAFTED: 'ai_cover_letter_drafted',
  AI_KEYWORDS_ANALYZED: 'ai_keywords_analyzed',

  // ATS
  ATS_SCORE_CHECKED: 'ats_score_checked',

  // Billing
  UPGRADE_INITIATED: 'upgrade_initiated',
  UPGRADE_COMPLETED: 'upgrade_completed',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
} as const
