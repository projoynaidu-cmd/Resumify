export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStripe, PLANS } from '@/lib/stripe'
import { db } from '@/lib/db'

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session for the Pro plan.
 * Returns { url } — redirect the user to this URL.
 */
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const proPlan = PLANS.PRO
  if (!proPlan.stripePriceId) {
    return NextResponse.json(
      { error: 'Stripe price ID not configured. Set STRIPE_PRO_PRICE_ID.' },
      { status: 500 },
    )
  }

  const stripe = getStripe()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Retrieve or create Stripe customer
  let stripeCustomerId: string | undefined

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true, email: true, name: true },
  })

  if (user?.stripeCustomerId) {
    stripeCustomerId = user.stripeCustomerId
  } else {
    const customer = await stripe.customers.create({
      email: user?.email ?? undefined,
      name: user?.name ?? undefined,
      metadata: { userId: session.user.id },
    })
    stripeCustomerId = customer.id

    await db.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId },
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: proPlan.stripePriceId, quantity: 1 }],
    success_url: `${baseUrl}/billing?success=1`,
    cancel_url: `${baseUrl}/billing?canceled=1`,
    subscription_data: {
      metadata: { userId: session.user.id },
    },
    metadata: { userId: session.user.id },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
