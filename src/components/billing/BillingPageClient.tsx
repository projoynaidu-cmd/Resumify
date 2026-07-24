'use client'

import { useEffect, useState } from 'react'
import { Check, Sparkles, CreditCard, AlertTriangle, Loader2, X } from 'lucide-react'
import { usePlan } from '@/hooks/usePlan'
import { PLANS } from '@/lib/stripe'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils'

interface BillingPageClientProps {
  plan: string
  planExpiresAt: string | null
  hasStripeAccount: boolean
  justUpgraded: boolean
  justCanceled: boolean
}

export function BillingPageClient({
  plan,
  planExpiresAt,
  hasStripeAccount,
  justUpgraded,
  justCanceled,
}: BillingPageClientProps) {
  const { upgrade, openBillingPortal, isUpgrading } = usePlan()
  const [banner, setBanner] = useState<'upgraded' | 'canceled' | null>(
    justUpgraded ? 'upgraded' : justCanceled ? 'canceled' : null,
  )

  // Auto-dismiss banner after 6s
  useEffect(() => {
    if (!banner) return
    const t = setTimeout(() => setBanner(null), 6000)
    return () => clearTimeout(t)
  }, [banner])

  const isPro = plan === 'PRO' || plan === 'ENTERPRISE'
  const expiresDate = planExpiresAt
    ? new Date(planExpiresAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success / canceled banners */}
      {banner === 'upgraded' && (
        <Banner
          variant="success"
          message="🎉 Welcome to Pro! All features are now unlocked."
          onClose={() => setBanner(null)}
        />
      )}
      {banner === 'canceled' && (
        <Banner
          variant="warning"
          message="Checkout was canceled. You can upgrade any time."
          onClose={() => setBanner(null)}
        />
      )}

      <div className="mb-7">
        <h1 className="font-serif text-2xl font-bold text-[var(--text)]">Billing</h1>
        <p className="text-sm text-[var(--text3)] mt-1">
          Manage your plan and payment details
        </p>
      </div>

      {/* Current plan card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-5 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-1">
              Current Plan
            </p>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-xl font-bold text-[var(--text)]">
                {isPro ? 'Pro' : 'Free'}
              </span>
              <Badge variant={isPro ? 'success' : 'default'}>
                {isPro ? '⭐ Active' : 'Free tier'}
              </Badge>
            </div>
            {isPro && expiresDate && (
              <p className="text-xs text-[var(--text3)] mt-1.5">
                Renews on {expiresDate}
              </p>
            )}
            {!isPro && (
              <p className="text-xs text-[var(--text3)] mt-1.5">
                3 resumes · 3 templates · 5 AI calls/day
              </p>
            )}
          </div>

          {isPro && hasStripeAccount && (
            <Button
              variant="secondary"
              size="sm"
              onClick={openBillingPortal}
              disabled={isUpgrading}
            >
              {isUpgrading
                ? <Loader2 size={13} className="animate-spin" />
                : <CreditCard size={13} />}
              Manage billing
            </Button>
          )}
        </div>
      </div>

      {/* Pricing table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Free plan */}
        <PlanCard
          plan={PLANS.FREE}
          isCurrentPlan={!isPro}
          action={null}
        />

        {/* Pro plan */}
        <PlanCard
          plan={PLANS.PRO}
          isCurrentPlan={isPro}
          highlighted
          action={
            isPro ? null : (
              <Button
                variant="primary"
                fullWidth
                onClick={upgrade}
                disabled={isUpgrading}
                className="mt-4"
              >
                {isUpgrading
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Sparkles size={14} />}
                {isUpgrading ? 'Redirecting…' : 'Upgrade to Pro — $9/mo'}
              </Button>
            )
          }
        />
      </div>

      {/* FAQ */}
      <div className="mt-8 space-y-4">
        <h2 className="font-semibold text-[var(--text)]">FAQ</h2>
        {FAQ_ITEMS.map(({ q, a }) => (
          <details
            key={q}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] group"
          >
            <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-[var(--text)] select-none list-none flex items-center justify-between">
              {q}
              <span className="text-[var(--text3)] group-open:rotate-180 transition-transform duration-200 text-base">
                ›
              </span>
            </summary>
            <p className="px-4 pb-3 text-sm text-[var(--text2)] leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function PlanCard({
  plan,
  isCurrentPlan,
  highlighted = false,
  action,
}: {
  plan: typeof PLANS.FREE | typeof PLANS.PRO
  isCurrentPlan: boolean
  highlighted?: boolean
  action: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-[var(--radius)] border p-5',
        highlighted
          ? 'border-[var(--accent)] shadow-[0_0_0_2px_rgba(45,90,61,0.12)]'
          : 'border-[var(--border)] bg-[var(--surface)]',
      )}
    >
      {/* Plan header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-serif font-bold text-lg text-[var(--text)]">
            {plan.name}
          </span>
          {highlighted && (
            <span className="bg-[var(--accent)] text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Popular
            </span>
          )}
          {isCurrentPlan && (
            <Badge variant="accent">Current</Badge>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[var(--text)]">
            {plan.priceDisplay}
          </span>
          {plan.interval && (
            <span className="text-sm text-[var(--text3)]">/ {plan.interval}</span>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[var(--text2)]">
            <Check
              size={14}
              className="text-[var(--accent)] flex-shrink-0 mt-0.5"
              aria-hidden
            />
            {feature}
          </li>
        ))}
      </ul>

      {action}
    </div>
  )
}

function Banner({
  variant,
  message,
  onClose,
}: {
  variant: 'success' | 'warning'
  message: string
  onClose: () => void
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] mb-5 text-sm',
        variant === 'success'
          ? 'bg-[#e8f5ed] border border-[#c3e8cf] text-[#1a5c31]'
          : 'bg-[#fef3e2] border border-[#fddba8] text-[#854d0e]',
      )}
      role="status"
    >
      {variant === 'success'
        ? <Check size={16} className="flex-shrink-0" />
        : <AlertTriangle size={16} className="flex-shrink-0" />}
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

const FAQ_ITEMS = [
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes. Click "Manage billing" to open the Stripe portal where you can cancel immediately. You keep Pro access until the end of your billing period.',
  },
  {
    q: 'What happens to my resumes if I downgrade?',
    a: 'Your resumes are preserved. You will only be able to edit the first 3 and access the 3 free templates. No data is deleted.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Free plan is free forever. Pro is $9/month with no trial — you can upgrade and cancel any time.',
  },
  {
    q: 'Do you offer annual billing?',
    a: 'Annual billing is coming soon with a 2-month discount. Contact support to arrange it manually in the meantime.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes. Payments are processed by Stripe, a PCI DSS Level 1 certified provider. We never store your card details.',
  },
]
