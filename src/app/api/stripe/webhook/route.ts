export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { sendPaymentReceiptEmail, sendCancellationEmail } from '@/lib/email'

/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events to keep the database in sync
 * with subscription state changes.
 *
 * Events handled:
 *  - checkout.session.completed   → activate Pro
 *  - customer.subscription.updated → update plan/expiry
 *  - customer.subscription.deleted → downgrade to Free
 *  - invoice.payment_failed        → flag account
 */
export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(checkoutSession)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        // Ignore unhandled events
        break
    }
  } catch (err) {
    console.error(`[Webhook] Handler error for ${event.type}:`, err)
    // Return 500 for infrastructure errors so Stripe retries with
    // exponential backoff (up to 3 days). Only swallow truly
    // non-recoverable errors that don't need retry.
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// ─── Event handlers ───────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId || session.mode !== 'subscription') return

  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id

  if (!subscriptionId) return

  const stripe = getStripe()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // @ts-expect-error — current_period_end exists at runtime in Stripe API responses
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  await db.user.update({
    where: { id: userId },
    data: {
      plan: 'PRO',
      planExpiresAt: currentPeriodEnd,
      stripeSubscriptionId: subscriptionId,
    },
  })

  // Send payment receipt email (non-blocking)
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
  if (user?.email) {
    sendPaymentReceiptEmail(user.email, user.name ?? '', 900, currentPeriodEnd).catch((err) =>
      console.error('[Webhook] Payment receipt email failed:', err),
    )
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) return

  const sub = subscription as Stripe.Subscription & { current_period_end?: number }
  const currentPeriodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000)
    : null
  const isActive = ['active', 'trialing'].includes(subscription.status)

  await db.user.update({
    where: { id: userId },
    data: {
      plan: isActive ? 'PRO' : 'FREE',
      planExpiresAt: isActive ? currentPeriodEnd : null,
      stripeSubscriptionId: subscription.id,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) return

  await db.user.update({
    where: { id: userId },
    data: {
      plan: 'FREE',
      planExpiresAt: null,
      stripeSubscriptionId: null,
    },
  })

  // Send cancellation email (non-blocking)
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
  if (user?.email) {
    const accessUntil = new Date()
    sendCancellationEmail(user.email, user.name ?? '', accessUntil).catch((err) =>
      console.error('[Webhook] Cancellation email failed:', err),
    )
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
    select: { id: true, email: true },
  })

  if (!user) return

  // Log for monitoring — could send an email here
  console.warn(
    `[Webhook] Payment failed for user ${user.id} (${user.email})`,
  )
}
