/**
 * Stripe server-side singleton.
 * Import ONLY in server code (API routes, server actions).
 * Never import in client components or middleware.
 */

import Stripe from 'stripe'

// Lazy singleton — prevents instantiation at module eval time
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  _stripe = new Stripe(key, { apiVersion: '2026-05-27.dahlia', typescript: true })
  return _stripe
}

// ─── Plan configuration ───────────────────────────────────────

export interface PlanConfig {
  id: 'FREE' | 'PRO'
  name: string
  price: number          // USD cents
  priceDisplay: string
  interval: 'month' | 'year' | null
  stripePriceId: string | null
  features: string[]
  limits: {
    resumes: number | 'unlimited'
    aiCallsPerDay: number | 'unlimited'
    templates: 'basic' | 'all'
  }
}

export const PLANS: Record<'FREE' | 'PRO', PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    priceDisplay: '$0',
    interval: null,
    stripePriceId: null,
    features: [
      '3 resumes',
      '3 templates (Classic, Modern, Minimal)',
      'PDF export',
      'ATS score checker',
      'LocalStorage save',
    ],
    limits: {
      resumes: 3,
      aiCallsPerDay: 5,
      templates: 'basic',
    },
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 900,           // $9.00
    priceDisplay: '$9',
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    features: [
      'Unlimited resumes',
      'All 6 templates',
      'AI summary & bullet writer',
      'AI cover letter generator',
      'Unlimited AI calls',
      'Public share links',
      'Priority support',
    ],
    limits: {
      resumes: 'unlimited',
      aiCallsPerDay: 'unlimited',
      templates: 'all',
    },
  },
}

export const FREE_TEMPLATES = ['classic', 'modern', 'minimal']
export const PRO_TEMPLATES = ['executive', 'creative', 'compact', 'timeline', 'elegant', 'technical', 'bold']

/**
 * Returns true if the user's plan allows access to a given template.
 */
export function canUseTemplate(plan: string, templateId: string): boolean {
  if (plan === 'PRO' || plan === 'ENTERPRISE') return true
  return FREE_TEMPLATES.includes(templateId)
}

/**
 * Returns true if the user can create more resumes.
 */
export function canCreateResume(plan: string, currentCount: number): boolean {
  if (plan === 'PRO' || plan === 'ENTERPRISE') return true
  return currentCount < 3
}
